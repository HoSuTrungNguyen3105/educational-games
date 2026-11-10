// services/aiAdminQueryService.js
//
// Tra cứu dữ liệu quản trị THẬT cho chat AI theo vai trò (update_features.md
// mục 3 + 5.3). Đúng triết lý sẵn có của aiChatContext: Backend quyết định
// dữ liệu nào được đưa vào ngữ cảnh — model KHÔNG tự gọi tool, KHÔNG tự
// truy cập database, KHÔNG được bịa số liệu.
//
// Nguyên tắc an toàn:
//  - CHỈ chạy khi người hỏi là admin/teacher (vai trò lấy từ hồ sơ DB qua
//    aiChatContext.loadChatIdentity, không tin dữ liệu client gửi lên).
//  - Admin: toàn quyền. Teacher: mọi truy vấn bị lọc theo các lớp được
//    phân công trong `teacher_classes` (scopeClassIds) — ngoài phạm vi thì
//    kết quả rỗng.
//  - "Điểm thấp" lấy ngưỡng từ cấu hình `ai.lowScoreThreshold`. Chưa cấu
//    hình (null) → trả trạng thái needsThreshold để AI HỎI LẠI admin,
//    TUYỆT ĐỐI không tự đặt ngưỡng ở bất kỳ đâu trong file này.
//  - Nguồn điểm chính là `submissions` (server chấm, thang 100).
//    KHÔNG dùng `examResults` (điểm do client tự gửi, không đáng tin).
//  - Mỗi lượt tra cứu ghi audit `ai.admin_query` — meta chỉ gồm loại truy
//    vấn + số kết quả, không ghi nội dung câu hỏi hay dữ liệu cá nhân.

import { getCollection } from "../db.js";
import { getTeacherClasses } from "./classService.js";
import { get as getConfigValue } from "./systemConfigService.js";
import { record as auditRecord, AUDIT } from "./auditService.js";
import { round1 } from "./aiLearningMetrics.js";

/** Số mục tối đa đưa vào ngữ cảnh cho mỗi danh sách (tổng số luôn có riêng). */
const MAX_LIST = 20;
/** Số bài kiểm tra tối đa xét ở tra cứu "chưa hoàn thành". */
const MAX_UNFINISHED_ASSIGNMENTS = 5;
/** Trần bản ghi điểm nạp cho các tổng hợp trong bộ nhớ. */
const MAX_SCORE_ROWS = 2000;
/**
 * Mức giảm tối thiểu (điểm, thang 100) để coi là "kết quả giảm rõ rệt" —
 * cùng tinh thần ngưỡng xu hướng TREND_THRESHOLD của aiLearningMetrics.
 */
export const DECLINE_MIN_DROP_POINTS = 5;

// ─────────────────── Nhận diện intent bằng từ khoá ───────────────────

/** Bỏ dấu tiếng Việt + thường hoá để khớp từ khoá bền với cách gõ. */
export function foldText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const PERIOD_PATTERNS = [
  ["today", /hom nay/],
  ["week", /tuan nay|tuan nay/],
  ["last_month", /thang truoc/],
  ["month", /thang nay/],
];

function detectPeriod(folded) {
  for (const [key, re] of PERIOD_PATTERNS) if (re.test(folded)) return key;
  return null;
}

/**
 * Nhận diện câu hỏi quản trị từ các mẫu câu ở đặc tả mục 3.
 * @returns {{type: string, period: string|null}|null} null = chat thường.
 */
export function detectAdminQuery(message) {
  const m = foldText(message);
  if (!m) return null;
  const period = detectPeriod(m);
  // Thống kê / trung bình — xét trước vì "trung bình thấp nhất" cũng chứa
  // chữ "thấp" nhưng là câu thống kê theo lớp, không phải lọc điểm thấp.
  if (/thong ke|trung binh|theo lop|theo mon/.test(m)) return { type: "stats", period };
  if (/dang ky/.test(m) && /(moi|vua|hoc sinh)/.test(m)) return { type: "new_students", period };
  if (/chua (hoan thanh|nop|lam)/.test(m)) return { type: "unfinished", period };
  if (/(giam|tut|sut giam|di xuong)/.test(m) && /(diem|ket qua|hoc tap)/.test(m)) {
    return { type: "declining", period };
  }
  if (/diem/.test(m) && /thap/.test(m)) return { type: "low_scores", period };
  if (/ket qua thap|bai kiem tra thap/.test(m)) return { type: "low_scores", period };
  return null;
}

// ─────────────────── Khoảng thời gian theo giờ Việt Nam ───────────────────

const VN_OFFSET_MS = 7 * 3600_000;

/** Mốc 00:00 giờ VN của một ngày (y/m/d theo lịch VN) dưới dạng ISO UTC. */
function vnMidnightIso(y, m, d) {
  return new Date(Date.UTC(y, m - 1, d) - VN_OFFSET_MS).toISOString();
}

/** Khoảng [from, to) ISO của kỳ today/week/month/last_month theo giờ VN. */
export function periodRange(period, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "numeric", day: "numeric", weekday: "short",
  }).formatToParts(now);
  const pick = (t) => parts.find((p) => p.type === t)?.value;
  const y = Number(pick("year"));
  const mo = Number(pick("month"));
  const d = Number(pick("day"));
  switch (period) {
    case "today":
      return { from: vnMidnightIso(y, mo, d), to: vnMidnightIso(y, mo, d + 1) };
    case "week": {
      const back = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[pick("weekday")] ?? 0;
      return { from: vnMidnightIso(y, mo, d - back), to: vnMidnightIso(y, mo, d - back + 7) };
    }
    case "last_month":
      return { from: vnMidnightIso(y, mo - 1, 1), to: vnMidnightIso(y, mo, 1) };
    case "month":
    default:
      return { from: vnMidnightIso(y, mo, 1), to: vnMidnightIso(y, mo + 1, 1) };
  }
}

const PERIOD_LABELS = {
  today: "hôm nay", week: "tuần này", month: "tháng này", last_month: "tháng trước",
};

// ─────────────────── Tiện ích dữ liệu dùng chung ───────────────────

const inScope = (classId, scopeClassIds) =>
  scopeClassIds == null || scopeClassIds.includes(classId ?? null);

async function classNameMap(classIds) {
  const ids = [...new Set((classIds || []).filter(Boolean).map(String))];
  const map = new Map();
  if (ids.length === 0) return map;
  const classes = await getCollection("classes")
    .find({ id: { $in: ids } }, { projection: { _id: 0, id: 1, name: 1 } })
    .toArray();
  for (const c of classes) map.set(String(c.id), c.name || String(c.id));
  return map;
}

async function userIndex(userIds) {
  const ids = [...new Set((userIds || []).filter(Boolean).map(String))];
  const map = new Map();
  if (ids.length === 0) return map;
  const users = await getCollection("users")
    .find({ id: { $in: ids } }, { projection: { _id: 0, id: 1, name: 1, classId: 1 } })
    .toArray();
  for (const u of users) map.set(String(u.id), u);
  return map;
}

async function assignmentIndex(assignmentIds) {
  const ids = [...new Set((assignmentIds || []).filter(Boolean).map(String))];
  const map = new Map();
  if (ids.length === 0) return map;
  const rows = await getCollection("assignments")
    .find({ id: { $in: ids } }, { projection: { _id: 0, id: 1, title: 1, classId: 1 } })
    .toArray();
  for (const a of rows) map.set(String(a.id), a);
  return map;
}

const submittedRows = () =>
  getCollection("submissions")
    .find(
      { status: "SUBMITTED" },
      { projection: { _id: 0, assignmentId: 1, studentId: 1, score: 1, submittedAt: 1, createdAt: 1 } },
    )
    .limit(MAX_SCORE_ROWS)
    .toArray();

const whenOf = (sub) => sub.submittedAt || sub.createdAt || "";
const dateOf = (iso) => (iso ? String(iso).slice(0, 10) : "");

// ─────────────────── 3.1 Học sinh mới đăng ký ───────────────────

export async function newStudents({ period = "month", scopeClassIds = null } = {}) {
  const { from, to } = periodRange(period || "month");
  const filter = { role: "student", createdAt: { $gte: from, $lt: to } };
  if (scopeClassIds != null) filter.classId = { $in: scopeClassIds };
  const coll = getCollection("users");
  const total = await coll.countDocuments(filter);
  const rows = await coll
    .find(filter, { projection: { _id: 0, id: 1, name: 1, classId: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(MAX_LIST)
    .toArray();
  const names = await classNameMap(rows.map((r) => r.classId));
  return {
    period: period || "month",
    total,
    students: rows.map((r) => ({
      name: r.name || "",
      className: r.classId ? names.get(String(r.classId)) || null : null,
      createdAt: r.createdAt || null,
    })),
  };
}

// ─────────────────── 3.2 Điểm kiểm tra thấp ───────────────────

/**
 * @param {number|null} threshold ngưỡng từ cấu hình ai.lowScoreThreshold.
 *   null → { needsThreshold: true } và KHÔNG tra cứu gì thêm.
 */
export async function lowScores({ threshold, period = null, scopeClassIds = null } = {}) {
  if (threshold == null) return { needsThreshold: true };
  const range = period ? periodRange(period) : null;
  const rows = (await submittedRows()).filter((s) =>
    typeof s.score === "number" && s.score < threshold &&
    (!range || (whenOf(s) >= range.from && whenOf(s) < range.to)));
  const assignments = await assignmentIndex(rows.map((s) => s.assignmentId));
  const users = await userIndex(rows.map((s) => s.studentId));
  const scoped = rows.filter((s) => {
    const a = assignments.get(String(s.assignmentId));
    const u = users.get(String(s.studentId));
    return inScope(a?.classId ?? u?.classId ?? null, scopeClassIds);
  });
  const names = await classNameMap(scoped.map((s) =>
    assignments.get(String(s.assignmentId))?.classId ?? users.get(String(s.studentId))?.classId));
  const items = scoped
    .sort((a, b) => a.score - b.score)
    .slice(0, MAX_LIST)
    .map((s) => {
      const a = assignments.get(String(s.assignmentId));
      const u = users.get(String(s.studentId));
      const classId = a?.classId ?? u?.classId ?? null;
      return {
        studentName: u?.name || "",
        className: classId ? names.get(String(classId)) || null : null,
        assignmentTitle: a?.title || null,
        score: s.score,
        submittedAt: whenOf(s) || null,
      };
    });
  return { threshold, period, total: scoped.length, items };
}

// ─────────────────── Học sinh chưa hoàn thành bài kiểm tra ───────────────────

export async function unfinished({ scopeClassIds = null } = {}) {
  const todayStart = periodRange("today").from;
  const all = await getCollection("assignments")
    .find({}, { projection: { _id: 0, id: 1, title: 1, classId: 1, status: 1, deadline: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
  const open = all
    .filter((a) => a.status !== "CLOSED")
    .filter((a) => !a.deadline || String(a.deadline) >= todayStart)
    .filter((a) => inScope(a.classId ?? null, scopeClassIds))
    .slice(0, MAX_UNFINISHED_ASSIGNMENTS);

  const names = await classNameMap(open.map((a) => a.classId));
  const items = [];
  let totalUnfinished = 0;
  for (const a of open) {
    const students = await getCollection("users")
      .find({ role: "student", classId: a.classId }, { projection: { _id: 0, id: 1, name: 1 } })
      .toArray();
    const subs = await getCollection("submissions")
      .find({ assignmentId: a.id }, { projection: { _id: 0, studentId: 1, status: 1 } })
      .toArray();
    const submitted = new Set(subs.filter((s) => s.status === "SUBMITTED").map((s) => String(s.studentId)));
    const inProgress = new Set(subs.filter((s) => s.status === "IN_PROGRESS").map((s) => String(s.studentId)));
    const missing = students.filter((s) => !submitted.has(String(s.id)));
    totalUnfinished += missing.length;
    items.push({
      assignmentTitle: a.title || null,
      className: a.classId ? names.get(String(a.classId)) || null : null,
      totalStudents: students.length,
      unfinishedCount: missing.length,
      inProgressCount: missing.filter((s) => inProgress.has(String(s.id))).length,
      names: missing.slice(0, 10).map((s) => s.name || ""),
    });
  }
  return { totalUnfinished, items };
}

// ─────────────────── Thống kê theo lớp / theo môn ───────────────────

/**
 * Theo lớp: điểm TB của `submissions` (server chấm) nối qua assignments.
 * Theo môn: tỉ lệ đúng TB của `results` đã xác thực nối qua games.subject —
 * chọn đường này vì submissions không mang môn (môn nằm rải trong từng câu
 * hỏi của ngân hàng), còn results+games là nguồn aiLearningMetrics đang
 * dùng và có sẵn subject sạch.
 */
export async function statsByClassOrSubject({ scopeClassIds = null } = {}) {
  const subs = await submittedRows();
  const assignments = await assignmentIndex(subs.map((s) => s.assignmentId));
  const byClassAgg = new Map();
  for (const s of subs) {
    if (typeof s.score !== "number") continue;
    const classId = assignments.get(String(s.assignmentId))?.classId ?? null;
    if (!inScope(classId, scopeClassIds)) continue;
    const key = classId || "(không lớp)";
    const agg = byClassAgg.get(key) || { classId, sum: 0, count: 0 };
    agg.sum += s.score; agg.count += 1;
    byClassAgg.set(key, agg);
  }
  const classNames = await classNameMap([...byClassAgg.keys()]);
  const byClass = [...byClassAgg.values()]
    .map((a) => ({
      className: a.classId ? classNames.get(String(a.classId)) || String(a.classId) : "Không rõ lớp",
      submissions: a.count,
      average: round1(a.sum / a.count),
    }))
    .sort((x, y) => x.average - y.average);

  // Theo môn qua results + games (lượt chơi đã xác thực).
  let studentIds = null;
  if (scopeClassIds != null) {
    const students = await getCollection("users")
      .find({ role: "student", classId: { $in: scopeClassIds } }, { projection: { _id: 0, id: 1 } })
      .toArray();
    studentIds = new Set(students.map((s) => String(s.id)));
  }
  const results = await getCollection("results")
    .find({ verified: true }, { projection: { _id: 0, userId: 1, gameId: 1, accuracy: 1 } })
    .limit(MAX_SCORE_ROWS)
    .toArray();
  const gameIds = [...new Set(results.map((r) => r.gameId).filter(Boolean).map(String))];
  const gameSubject = new Map();
  if (gameIds.length > 0) {
    const games = await getCollection("games")
      .find({ $or: [{ id: { $in: gameIds } }, { code: { $in: gameIds } }] },
        { projection: { _id: 1, id: 1, code: 1, subject: 1 } })
      .toArray();
    for (const g of games) {
      for (const key of [g._id, g.id, g.code]) {
        if (key != null && String(key).trim() !== "") gameSubject.set(String(key), g.subject ?? null);
      }
    }
  }
  const bySubjectAgg = new Map();
  for (const r of results) {
    if (studentIds != null && !studentIds.has(String(r.userId))) continue;
    const subject = gameSubject.get(String(r.gameId)) || null;
    if (!subject || typeof r.accuracy !== "number") continue;
    const agg = bySubjectAgg.get(subject) || { sum: 0, count: 0 };
    agg.sum += r.accuracy; agg.count += 1;
    bySubjectAgg.set(subject, agg);
  }
  const bySubject = [...bySubjectAgg.entries()]
    .map(([subject, a]) => ({ subject, plays: a.count, averageAccuracy: round1(a.sum / a.count) }))
    .sort((x, y) => y.plays - x.plays);

  return { byClass, lowestClass: byClass[0] || null, bySubject };
}

// ─────────────────── 3.3 Kết quả giảm so với trước ───────────────────

export async function declining({ scopeClassIds = null } = {}) {
  const subs = (await submittedRows()).filter((s) => typeof s.score === "number");
  const assignments = await assignmentIndex(subs.map((s) => s.assignmentId));
  const users = await userIndex(subs.map((s) => s.studentId));
  const byStudent = new Map();
  for (const s of subs) {
    const key = String(s.studentId);
    if (!byStudent.has(key)) byStudent.set(key, []);
    byStudent.get(key).push(s);
  }
  const items = [];
  for (const [studentId, rows] of byStudent) {
    if (rows.length < 2) continue;
    const u = users.get(studentId);
    const classId = assignments.get(String(rows[rows.length - 1].assignmentId))?.classId ?? u?.classId ?? null;
    if (!inScope(classId, scopeClassIds)) continue;
    const sorted = [...rows].sort((a, b) => whenOf(a).localeCompare(whenOf(b)));
    const half = Math.max(1, Math.floor(sorted.length / 2));
    const first = sorted.slice(0, half);
    const second = sorted.slice(half);
    if (second.length === 0) continue;
    const avg = (arr) => arr.reduce((sum, s) => sum + s.score, 0) / arr.length;
    const firstAvg = avg(first);
    const secondAvg = avg(second);
    const drop = round1(firstAvg - secondAvg);
    if (drop < DECLINE_MIN_DROP_POINTS) continue;
    items.push({
      studentId,
      classId,
      submissions: sorted.length,
      firstAvg: round1(firstAvg),
      secondAvg: round1(secondAvg),
      drop,
    });
  }
  const names = await classNameMap(items.map((i) => i.classId));
  return {
    total: items.length,
    items: items
      .sort((a, b) => b.drop - a.drop)
      .slice(0, MAX_LIST)
      .map((i) => ({
        studentName: users.get(i.studentId)?.name || "",
        className: i.classId ? names.get(String(i.classId)) || null : null,
        submissions: i.submissions,
        firstAvg: i.firstAvg,
        secondAvg: i.secondAvg,
        drop: i.drop,
      })),
  };
}

// ─────────────────── Định dạng ngữ cảnh đưa vào prompt ───────────────────

export function formatAdminContext(intent, result, { scopeNote = null } = {}) {
  const lines = [];
  if (scopeNote) lines.push(`[PHẠM VI DỮ LIỆU] ${scopeNote}`);
  const periodLabel = intent.period ? PERIOD_LABELS[intent.period] : null;

  if (intent.type === "new_students") {
    lines.push(`[KẾT QUẢ TRA CỨU THẬT — học sinh mới đăng ký ${PERIOD_LABELS[result.period] || ""}]`);
    lines.push(`- Tổng số học sinh mới: ${result.total} em.`);
    if (result.students.length > 0) {
      lines.push(`- Danh sách (mới nhất trước, tối đa ${MAX_LIST} em):`);
      for (const s of result.students) {
        lines.push(`  • ${s.name}${s.className ? ` — lớp ${s.className}` : ""} — đăng ký ${dateOf(s.createdAt)}`);
      }
    } else {
      lines.push("- Không có học sinh nào đăng ký trong khoảng thời gian này.");
    }
  } else if (intent.type === "low_scores") {
    if (result.needsThreshold) {
      lines.push("[TRẠNG THÁI TRA CỨU — điểm kiểm tra thấp]");
      lines.push(
        "Hệ thống CHƯA ĐƯỢC CẤU HÌNH ngưỡng điểm thấp (cấu hình ai.lowScoreThreshold đang để trống). " +
        "Bạn PHẢI hỏi lại người quản trị muốn lấy ngưỡng điểm thấp là bao nhiêu (thang 100) rồi mới tra cứu được. " +
        "TUYỆT ĐỐI không tự chọn một con số làm ngưỡng, không suy đoán danh sách học sinh điểm thấp khi chưa có ngưỡng.",
      );
    } else {
      lines.push(`[KẾT QUẢ TRA CỨU THẬT — điểm kiểm tra thấp${periodLabel ? `, ${periodLabel}` : ""}]`);
      lines.push(`- Ngưỡng đang cấu hình: dưới ${result.threshold} điểm (thang 100).`);
      lines.push(`- Tổng số bài nộp dưới ngưỡng: ${result.total}.`);
      if (result.items.length > 0) {
        lines.push(`- Danh sách (điểm thấp nhất trước, tối đa ${MAX_LIST}):`);
        for (const it of result.items) {
          lines.push(
            `  • ${it.studentName}${it.className ? ` — lớp ${it.className}` : ""}` +
            `${it.assignmentTitle ? ` — bài "${it.assignmentTitle}"` : ""} — ${it.score} điểm` +
            `${it.submittedAt ? ` — nộp ${dateOf(it.submittedAt)}` : ""}`,
          );
        }
      } else {
        lines.push("- Không có bài nộp nào dưới ngưỡng trong phạm vi dữ liệu.");
      }
    }
  } else if (intent.type === "unfinished") {
    lines.push("[KẾT QUẢ TRA CỨU THẬT — học sinh chưa hoàn thành bài kiểm tra]");
    if (result.items.length === 0) {
      lines.push("- Không có bài kiểm tra đang mở nào trong phạm vi dữ liệu.");
    } else {
      for (const it of result.items) {
        lines.push(
          `- Bài "${it.assignmentTitle || ""}"${it.className ? ` (lớp ${it.className})` : ""}: ` +
          `${it.unfinishedCount}/${it.totalStudents} học sinh chưa nộp` +
          `${it.inProgressCount ? `, trong đó ${it.inProgressCount} em đang làm dở` : ""}.` +
          `${it.names.length ? ` Tên: ${it.names.join(", ")}.` : ""}`,
        );
      }
      lines.push(`- Tổng cộng: ${result.totalUnfinished} lượt học sinh chưa hoàn thành.`);
    }
  } else if (intent.type === "stats") {
    lines.push("[KẾT QUẢ TRA CỨU THẬT — thống kê kết quả học tập]");
    lines.push("- Theo lớp (điểm bài kiểm tra trung bình do server chấm, từ thấp đến cao):");
    if (result.byClass.length === 0) lines.push("  • (chưa có dữ liệu điểm theo lớp)");
    for (const c of result.byClass) {
      lines.push(`  • ${c.className}: trung bình ${c.average} điểm (${c.submissions} bài nộp)`);
    }
    if (result.lowestClass) {
      lines.push(`- Lớp có điểm trung bình thấp nhất: ${result.lowestClass.className} (${result.lowestClass.average} điểm).`);
    }
    lines.push("- Theo môn (tỉ lệ đúng trung bình từ lượt chơi game đã xác thực):");
    if (result.bySubject.length === 0) lines.push("  • (chưa có dữ liệu theo môn)");
    for (const s of result.bySubject) {
      lines.push(`  • ${s.subject}: ${s.averageAccuracy}% (${s.plays} lượt chơi)`);
    }
  } else if (intent.type === "declining") {
    lines.push("[KẾT QUẢ TRA CỨU THẬT — kết quả giảm so với các lần kiểm tra trước]");
    lines.push(
      `- Tiêu chí: học sinh có từ 2 bài nộp trở lên, điểm trung bình nửa sau thấp hơn nửa đầu ` +
      `từ ${DECLINE_MIN_DROP_POINTS} điểm trở lên.`,
    );
    if (result.items.length === 0) {
      lines.push("- Chưa phát hiện học sinh nào giảm rõ rệt theo tiêu chí này (hoặc chưa đủ dữ liệu bài nộp để so sánh).");
    } else {
      lines.push(`- Tổng số học sinh cần quan tâm: ${result.total}.`);
      for (const it of result.items) {
        lines.push(
          `  • ${it.studentName}${it.className ? ` — lớp ${it.className}` : ""}: trung bình trước ${it.firstAvg} → sau ${it.secondAvg} ` +
          `(giảm ${it.drop} điểm, ${it.submissions} bài nộp)`,
        );
      }
    }
  }
  return lines.join("\n");
}

// ─────────────────── Điểm vào dùng chung cho tầng chat ───────────────────

/**
 * Chạy một lượt tra cứu quản trị cho lượt chat hiện tại.
 * @param {object} req request đã xác thực (để ghi audit đúng actor).
 * @param {string} message câu hỏi gốc của người dùng.
 * @param {{userId: string, role: string}} identity danh tính từ DB.
 * @returns {Promise<null|{type, needsThreshold, resultCount, text, scopeNote}>}
 *   null khi không phải câu tra cứu hoặc người hỏi không có quyền.
 */
export async function runAdminQuery(req, message, identity) {
  const intent = detectAdminQuery(message);
  if (!intent) return null;
  const role = identity?.role;
  if (role !== "admin" && role !== "teacher") return null;

  let scopeClassIds = null;
  let scopeNote = null;
  if (role === "teacher") {
    const classes = await getTeacherClasses(String(identity.userId));
    scopeClassIds = classes.map((c) => String(c.id));
    scopeNote = classes.length > 0
      ? `Người hỏi là GIÁO VIÊN, chỉ được phân công các lớp: ${classes.map((c) => c.name).join(", ")}. ` +
        "Mọi số liệu dưới đây ĐÃ được Backend lọc đúng trong phạm vi đó — không được nói tới dữ liệu ngoài các lớp này."
      : "Người hỏi là GIÁO VIÊN nhưng chưa được phân công lớp nào — hiện không có dữ liệu nào trong phạm vi của họ.";
  }

  let result;
  let resultCount = 0;
  if (intent.type === "new_students") {
    result = await newStudents({ period: intent.period || "month", scopeClassIds });
    resultCount = result.total;
  } else if (intent.type === "low_scores") {
    const raw = await getConfigValue("ai.lowScoreThreshold", { fresh: true });
    const threshold = typeof raw === "number" && Number.isFinite(raw) ? raw : null;
    result = await lowScores({ threshold, period: intent.period, scopeClassIds });
    resultCount = result.needsThreshold ? 0 : result.total;
  } else if (intent.type === "unfinished") {
    result = await unfinished({ scopeClassIds });
    resultCount = result.totalUnfinished;
  } else if (intent.type === "stats") {
    result = await statsByClassOrSubject({ scopeClassIds });
    resultCount = result.byClass.length + result.bySubject.length;
  } else if (intent.type === "declining") {
    result = await declining({ scopeClassIds });
    resultCount = result.total;
  } else {
    return null;
  }

  const text = formatAdminContext(intent, result, { scopeNote });
  // Audit best-effort: chỉ loại truy vấn + số kết quả (đặc tả §4) —
  // auditService.record tự nuốt lỗi nên không cần bọc thêm.
  await auditRecord({
    req,
    action: AUDIT.AI_ADMIN_QUERY,
    target: "ai:chat",
    meta: { queryType: intent.type, resultCount },
  });
  return {
    type: intent.type,
    needsThreshold: result.needsThreshold === true,
    resultCount,
    text,
    scopeNote,
  };
}
