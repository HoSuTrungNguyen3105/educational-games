// services/aiAdminQueryService.js
//
// Tra cứu dữ liệu quản trị THẬT cho chat AI theo vai trò (update_features.md
// mục 3 + 5.3). Đúng triết lý sẵn có của aiChatContext: Backend quyết định
// dữ liệu nào được đưa vào ngữ cảnh — model KHÔNG tự gọi tool, KHÔNG tự
// truy cập database, KHÔNG được bịa số liệu.
//
// Nguyên tắc an toàn:
//  - CHỈ chạy khi người hỏi là ADMIN — vai trò lấy từ hồ sơ DB qua
//    aiChatContext.loadChatIdentity, không tin dữ liệu client gửi lên.
//    (Đợt #74 từng cho cả teacher với phạm vi lớp được phân công; Nguyên
//    yêu cầu 2026-11-10 thu hẹp: tra cứu quản trị CHỈ còn admin, teacher
//    quay về chat thường — xem runAdminQuery.)
//  - "Điểm thấp" lấy ngưỡng từ cấu hình `ai.lowScoreThreshold`. Chưa cấu
//    hình (null) → trả trạng thái needsThreshold để AI HỎI LẠI admin,
//    TUYỆT ĐỐI không tự đặt ngưỡng ở bất kỳ đâu trong file này.
//  - Nguồn điểm chính là `submissions` (server chấm, thang 100).
//    KHÔNG dùng `examResults` (điểm do client tự gửi, không đáng tin).
//  - Dữ liệu đưa vào prompt luôn là số liệu/danh sách RÚT GỌN (tối đa
//    ~20 dòng mỗi nhóm) — không mật khẩu/hash, không token, không khoá
//    API; trạng thái cấu hình AI chỉ gồm trạng thái an toàn (bật/tắt,
//    model, ngưỡng), KHÔNG có bất kỳ secret/env nào.
//  - Mỗi lượt tra cứu ghi audit `ai.admin_query` — meta chỉ gồm loại truy
//    vấn + số kết quả, không ghi nội dung câu hỏi hay dữ liệu cá nhân.

import { getCollection } from "../db.js";
import { config } from "../config.js";
import { get as getConfigValue } from "./systemConfigService.js";
import { getEffectiveGroqModel } from "./aiModelConfig.js";
import { REPORT_REASONS } from "./reportService.js";
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
 * Nhận diện câu hỏi quản trị từ các mẫu câu ở đặc tả mục 3 + các nhóm mở
 * rộng 2026-11-10 (tổng quan hệ thống / nội dung mới nhất / báo cáo & hỗ
 * trợ / hoạt động AI / trạng thái cấu hình AI). Thứ tự xét quan trọng:
 * các mẫu CỤ THỂ phải đứng trước mẫu CHUNG (ví dụ "ngưỡng điểm thấp đã
 * đặt chưa" là hỏi cấu hình, không phải tra cứu điểm thấp).
 * @returns {{type: string, period: string|null}|null} null = chat thường.
 */
export function detectAdminQuery(message) {
  const m = foldText(message);
  if (!m) return null;
  const period = detectPeriod(m);
  // Trạng thái cấu hình AI — xét sớm: "ngưỡng điểm thấp đã đặt chưa" chứa
  // cả "điểm"+"thấp" nhưng là hỏi CẤU HÌNH, không phải xin danh sách.
  if (/trang thai (ai|tro ly)|cau hinh (ai|tro ly)|model.*(dang dung|hien tai|la gi|nao)|ai dang dung model|(tro ly ai|ai).*(dang bat|dang tat|da bat|da tat)|nguong diem thap.*(da dat|dat chua|dat la|cau hinh|bao nhieu)/.test(m)) {
    return { type: "ai_config", period };
  }
  // Hoạt động hỏi–đáp AI (dữ liệu ai_chat_logs của đợt #78).
  if (/hoat dong ai|luot hoi ai|cau hoi ai|lich su hoi|hoi ai|chat ai|hoc sinh hoi gi|hoi gi nhieu nhat/.test(m)) {
    return { type: "ai_activity", period };
  }
  // Báo cáo người dùng xấu / ticket hỗ trợ đang chờ xử lý.
  if (/ticket|phieu ho tro|yeu cau ho tro/.test(m)
    || (/ho tro/.test(m) && /(dang mo|chua xu ly|cho xu ly|dang cho|con mo)/.test(m))) {
    return { type: "support_backlog", period };
  }
  if (/bao cao/.test(m) && /(nguoi dung|vi pham|xau|chua xu ly|dang mo|bi bao cao)/.test(m)) {
    return { type: "support_backlog", period };
  }
  // Nội dung mới nhất — phải có game/bài học/ngân hàng + sắc thái "mới/gần
  // đây" để không nuốt câu hỏi kiến thức thường về các chủ đề này.
  if (/(game|tro choi|bai hoc|bai giang|ngan hang cau hoi)/.test(m) && /(moi|gan day|vua (tao|them|dang))/.test(m)) {
    return { type: "content_new", period };
  }
  // Thống kê / trung bình — xét trước vì "trung bình thấp nhất" cũng chứa
  // chữ "thấp" nhưng là câu thống kê theo lớp, không phải lọc điểm thấp.
  if (/thong ke|trung binh|theo lop|theo mon/.test(m)) return { type: "stats", period };
  if (/dang ky/.test(m) && /(moi|vua|hoc sinh)/.test(m)) return { type: "new_students", period };
  // Tổng quan hệ thống — sau new_students để "học sinh mới đăng ký" không
  // bị nuốt vào nhóm đếm tổng.
  if (/tong quan|toan he thong|he thong.*(bao nhieu|hien co|co gi)|co bao nhieu (hoc sinh|giao vien|lop|game|tro choi|bai hoc)|tong so (hoc sinh|giao vien|nguoi dung|lop|game|bai hoc)|so luong (hoc sinh|giao vien|nguoi dung|lop)/.test(m)) {
    return { type: "overview", period };
  }
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

export async function newStudents({ period = "month" } = {}) {
  const { from, to } = periodRange(period || "month");
  const filter = { role: "student", createdAt: { $gte: from, $lt: to } };
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
export async function lowScores({ threshold, period = null } = {}) {
  if (threshold == null) return { needsThreshold: true };
  const range = period ? periodRange(period) : null;
  const rows = (await submittedRows()).filter((s) =>
    typeof s.score === "number" && s.score < threshold &&
    (!range || (whenOf(s) >= range.from && whenOf(s) < range.to)));
  const assignments = await assignmentIndex(rows.map((s) => s.assignmentId));
  const users = await userIndex(rows.map((s) => s.studentId));
  const names = await classNameMap(rows.map((s) =>
    assignments.get(String(s.assignmentId))?.classId ?? users.get(String(s.studentId))?.classId));
  const items = rows
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
  return { threshold, period, total: rows.length, items };
}

// ─────────────────── Học sinh chưa hoàn thành bài kiểm tra ───────────────────

export async function unfinished() {
  const todayStart = periodRange("today").from;
  const all = await getCollection("assignments")
    .find({}, { projection: { _id: 0, id: 1, title: 1, classId: 1, status: 1, deadline: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
  const open = all
    .filter((a) => a.status !== "CLOSED")
    .filter((a) => !a.deadline || String(a.deadline) >= todayStart)
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
export async function statsByClassOrSubject() {
  const subs = await submittedRows();
  const assignments = await assignmentIndex(subs.map((s) => s.assignmentId));
  const byClassAgg = new Map();
  for (const s of subs) {
    if (typeof s.score !== "number") continue;
    const classId = assignments.get(String(s.assignmentId))?.classId ?? null;
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

export async function declining() {
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

// ─────────────────── Tổng quan hệ thống (nhóm mới) ───────────────────

/** Đếm tổng theo từng kho dữ liệu chính — chỉ số lượng, không chi tiết cá nhân. */
export async function systemOverview() {
  const users = getCollection("users");
  const count = (name, filter = {}) => getCollection(name).countDocuments(filter);
  const [
    students, teachers, admins, classesTotal,
    gamesTotal, gamesPublished, lessonsTotal, lessonsPublished,
    banksTotal, assignmentsTotal, playsTotal,
  ] = await Promise.all([
    users.countDocuments({ role: "student" }),
    users.countDocuments({ role: "teacher" }),
    users.countDocuments({ role: "admin" }),
    count("classes"),
    count("games"),
    count("games", { status: "published" }),
    count("lessons"),
    count("lessons", { status: "published" }),
    count("question_banks"),
    count("assignments"),
    count("results"),
  ]);
  return {
    students, teachers, admins, classesTotal,
    gamesTotal, gamesPublished, lessonsTotal, lessonsPublished,
    banksTotal, assignmentsTotal, playsTotal,
  };
}

// ─────────────────── Nội dung mới nhất (nhóm mới) ───────────────────

const RECENT_CONTENT_LIMIT = 5;

/** Mục nội dung mới nhất của một kho: chỉ tên + môn + trạng thái + ngày tạo. */
async function recentOf(collection, projection) {
  const rows = await getCollection(collection)
    .find({}, { projection: { _id: 0, ...projection } })
    .sort({ createdAt: -1 })
    .limit(RECENT_CONTENT_LIMIT)
    .toArray();
  return rows.map((r) => ({
    name: r.name || r.title || "(không tên)",
    subject: r.subject ?? null,
    status: r.status ?? null,
    createdAt: r.createdAt ?? null,
  }));
}

export async function recentContent() {
  const [games, lessons, bankQuestions] = await Promise.all([
    recentOf("games", { name: 1, subject: 1, status: 1, createdAt: 1 }),
    recentOf("lessons", { title: 1, subject: 1, status: 1, createdAt: 1 }),
    // question_banks lưu TỪNG CÂU HỎI (không có khái niệm "ngân hàng" có
    // tên riêng, cũng không có createdAt — xem db.js) → chỉ tra được
    // TỔNG SỐ câu hỏi trong kho, không có "mới nhất".
    getCollection("question_banks").countDocuments({}),
  ]);
  return { games, lessons, bankQuestions };
}

// ─────────────── Báo cáo & hỗ trợ đang chờ (nhóm mới) ───────────────

const REPORT_REASON_LABELS = new Map(REPORT_REASONS.map((r) => [r.value, r.label]));
/** Trạng thái ticket còn đang chờ xử lý (chưa done/closed). */
const TICKET_OPEN_STATUSES = ["open", "processing", "pending"];

export async function supportBacklog() {
  const reports = getCollection("reports");
  const tickets = getCollection("support_tickets");
  const [openReports, recentReports, openTickets, recentTickets] = await Promise.all([
    reports.countDocuments({ status: "open" }),
    reports
      .find({ status: "open" }, { projection: { _id: 0, reportedName: 1, reportedUsername: 1, reason: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(RECENT_CONTENT_LIMIT)
      .toArray(),
    tickets.countDocuments({ status: { $in: TICKET_OPEN_STATUSES } }),
    tickets
      .find({ status: { $in: TICKET_OPEN_STATUSES } },
        { projection: { _id: 0, code: 1, title: 1, priority: 1, status: 1, username: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(RECENT_CONTENT_LIMIT)
      .toArray(),
  ]);
  return {
    openReports,
    recentReports: recentReports.map((r) => ({
      reportedName: r.reportedName || r.reportedUsername || "",
      reasonLabel: REPORT_REASON_LABELS.get(r.reason) || r.reason || "",
      createdAt: r.createdAt ?? null,
    })),
    openTickets,
    recentTickets: recentTickets.map((t) => ({
      code: t.code || "",
      title: t.title || "",
      priority: t.priority || "",
      status: t.status || "",
      username: t.username || "",
      createdAt: t.createdAt ?? null,
    })),
  };
}

// ─────────────────── Hoạt động hỏi AI (nhóm mới) ───────────────────

/** Thống kê lượt hỏi AI từ ai_chat_logs (đợt #78) trong một kỳ theo giờ VN. */
export async function aiActivity({ period = "week" } = {}) {
  const p = period || "week";
  const { from, to } = periodRange(p);
  const filter = { createdAt: { $gte: from, $lt: to } };
  const coll = getCollection("ai_chat_logs");
  const [total, kindRows, topUsers, recentQuestions] = await Promise.all([
    coll.countDocuments(filter),
    coll.aggregate([
      { $match: filter },
      { $group: { _id: "$kind", count: { $sum: 1 } } },
    ]).toArray(),
    coll.aggregate([
      { $match: filter },
      { $group: { _id: { userId: "$userId", username: "$username" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: RECENT_CONTENT_LIMIT },
    ]).toArray(),
    coll
      .find(filter, { projection: { _id: 0, username: 1, question: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(RECENT_CONTENT_LIMIT)
      .toArray(),
  ]);
  const kindCount = (k) => kindRows.find((r) => r._id === k)?.count || 0;
  return {
    period: p,
    total,
    chatCount: kindCount("chat"),
    adminQueryCount: kindCount("admin_query"),
    topUsers: topUsers.map((t) => ({
      username: t._id?.username || t._id?.userId || "",
      count: t.count,
    })),
    recentQuestions: recentQuestions.map((r) => ({
      username: r.username || "",
      question: String(r.question || "").slice(0, 120),
      createdAt: r.createdAt ?? null,
    })),
  };
}

// ─────────────── Trạng thái cấu hình AI an toàn (nhóm mới) ───────────────

/**
 * CHỈ trạng thái an toàn: trợ lý bật/tắt, nhà cung cấp + model đang dùng,
 * ngưỡng điểm thấp đã đặt hay chưa. TUYỆT ĐỐI không có khoá API/secret —
 * các giá trị đọc từ system_config + aiModelConfig, không đụng env secret.
 */
export async function aiConfigStatus() {
  const [enabledRaw, thresholdRaw] = await Promise.all([
    getConfigValue("ai.enabled", { fresh: true }),
    getConfigValue("ai.lowScoreThreshold", { fresh: true }),
  ]);
  const provider = config.ollama.provider || null;
  const model = provider === "groq"
    ? await getEffectiveGroqModel()
    : config.ollama.model || null;
  return {
    enabled: enabledRaw === true,
    provider,
    model: model || null,
    threshold: typeof thresholdRaw === "number" && Number.isFinite(thresholdRaw) ? thresholdRaw : null,
  };
}

// ─────────────────── Định dạng ngữ cảnh đưa vào prompt ───────────────────

export function formatAdminContext(intent, result) {
  const lines = [];
  const periodLabel = intent.period ? PERIOD_LABELS[intent.period] : null;

  if (intent.type === "overview") {
    lines.push("[KẾT QUẢ TRA CỨU THẬT — tổng quan hệ thống]");
    lines.push(`- Học sinh: ${result.students} tài khoản.`);
    lines.push(`- Giáo viên: ${result.teachers} tài khoản.`);
    lines.push(`- Quản trị viên: ${result.admins} tài khoản.`);
    lines.push(`- Lớp học: ${result.classesTotal} lớp.`);
    lines.push(`- Trò chơi: ${result.gamesPublished}/${result.gamesTotal} đã xuất bản.`);
    lines.push(`- Bài học: ${result.lessonsPublished}/${result.lessonsTotal} đã xuất bản.`);
    lines.push(`- Ngân hàng câu hỏi: ${result.banksTotal} câu hỏi.`);
    lines.push(`- Bài kiểm tra đã giao: ${result.assignmentsTotal} bài.`);
    lines.push(`- Tổng lượt chơi game đã ghi nhận: ${result.playsTotal} lượt.`);
  } else if (intent.type === "content_new") {
    lines.push("[KẾT QUẢ TRA CỨU THẬT — nội dung mới nhất]");
    lines.push("- Trò chơi mới nhất:");
    if (result.games.length === 0) lines.push("  • (chưa có trò chơi nào)");
    for (const g of result.games) {
      lines.push(`  • ${g.name}${g.subject ? ` — môn ${g.subject}` : ""} — ${g.status === "published" ? "đã xuất bản" : "bản nháp"}${g.createdAt ? ` — tạo ${dateOf(g.createdAt)}` : ""}`);
    }
    lines.push("- Bài học mới nhất:");
    if (result.lessons.length === 0) lines.push("  • (chưa có bài học nào)");
    for (const l of result.lessons) {
      lines.push(`  • ${l.name}${l.subject ? ` — môn ${l.subject}` : ""} — ${l.status === "published" ? "đã xuất bản" : "bản nháp"}${l.createdAt ? ` — tạo ${dateOf(l.createdAt)}` : ""}`);
    }
    lines.push(`- Ngân hàng câu hỏi: hiện có ${result.bankQuestions} câu hỏi (kho này không lưu thời điểm tạo từng câu nên không xếp hạng "mới nhất" được).`);
  } else if (intent.type === "support_backlog") {
    lines.push("[KẾT QUẢ TRA CỨU THẬT — báo cáo & hỗ trợ đang chờ xử lý]");
    lines.push(`- Báo cáo người dùng chưa xử lý: ${result.openReports} báo cáo.`);
    for (const r of result.recentReports) {
      lines.push(`  • Người bị báo cáo: ${r.reportedName} — lý do: ${r.reasonLabel}${r.createdAt ? ` — ${dateOf(r.createdAt)}` : ""}`);
    }
    lines.push(`- Yêu cầu hỗ trợ đang chờ xử lý (chưa hoàn thành/đóng): ${result.openTickets} yêu cầu.`);
    for (const t of result.recentTickets) {
      lines.push(`  • ${t.code ? `[${t.code}] ` : ""}${t.title}${t.priority ? ` — ưu tiên ${t.priority}` : ""}${t.username ? ` — từ ${t.username}` : ""}${t.createdAt ? ` — ${dateOf(t.createdAt)}` : ""}`);
    }
  } else if (intent.type === "ai_activity") {
    lines.push(`[KẾT QUẢ TRA CỨU THẬT — hoạt động hỏi AI ${PERIOD_LABELS[result.period] || ""}]`);
    lines.push(`- Tổng số lượt hỏi AI: ${result.total} lượt (chat thường ${result.chatCount}, tra cứu quản trị ${result.adminQueryCount}).`);
    if (result.topUsers.length > 0) {
      lines.push("- Người hỏi nhiều nhất:");
      for (const u of result.topUsers) lines.push(`  • ${u.username}: ${u.count} lượt`);
    }
    if (result.recentQuestions.length > 0) {
      lines.push("- Câu hỏi gần nhất:");
      for (const q of result.recentQuestions) {
        lines.push(`  • ${q.username ? `${q.username}: ` : ""}"${q.question}"${q.createdAt ? ` (${dateOf(q.createdAt)})` : ""}`);
      }
    }
  } else if (intent.type === "ai_config") {
    lines.push("[KẾT QUẢ TRA CỨU THẬT — trạng thái cấu hình AI (chỉ trạng thái an toàn, không có khoá bí mật)]");
    lines.push(`- Trợ lý AI: ${result.enabled ? "ĐANG BẬT" : "ĐANG TẮT"}.`);
    lines.push(`- Nhà cung cấp model: ${result.provider || "(chưa rõ)"}.`);
    lines.push(`- Model đang dùng: ${result.model || "(chưa rõ)"}.`);
    lines.push(result.threshold == null
      ? "- Ngưỡng điểm thấp: CHƯA ĐƯỢC CẤU HÌNH (đang để trống — khi hỏi về điểm thấp, AI sẽ hỏi lại ngưỡng)."
      : `- Ngưỡng điểm thấp: đã đặt ở mức dưới ${result.threshold} điểm (thang 100).`);
  } else if (intent.type === "new_students") {
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
 * @returns {Promise<null|{type, needsThreshold, resultCount, text}>}
 *   null khi không phải câu tra cứu hoặc người hỏi không có quyền.
 */
export async function runAdminQuery(req, message, identity) {
  // Cổng quyền DUY NHẤT và cứng nhất: CHỈ admin (vai trò từ hồ sơ DB).
  // Kiểm tra TRƯỚC khi nhận diện intent — teacher/học sinh không bao giờ
  // chạy tra cứu, kể cả khi câu hỏi giống hệt câu của admin (Nguyên chốt
  // 2026-11-10, thay cho phạm vi lớp của giáo viên ở đợt #74).
  if (identity?.role !== "admin") return null;
  const intent = detectAdminQuery(message);
  if (!intent) return null;

  let result;
  let resultCount = 0;
  if (intent.type === "overview") {
    result = await systemOverview();
    resultCount = result.students;
  } else if (intent.type === "content_new") {
    result = await recentContent();
    resultCount = result.games.length + result.lessons.length;
  } else if (intent.type === "support_backlog") {
    result = await supportBacklog();
    resultCount = result.openReports + result.openTickets;
  } else if (intent.type === "ai_activity") {
    result = await aiActivity({ period: intent.period || "week" });
    resultCount = result.total;
  } else if (intent.type === "ai_config") {
    result = await aiConfigStatus();
    resultCount = 1;
  } else if (intent.type === "new_students") {
    result = await newStudents({ period: intent.period || "month" });
    resultCount = result.total;
  } else if (intent.type === "low_scores") {
    const raw = await getConfigValue("ai.lowScoreThreshold", { fresh: true });
    const threshold = typeof raw === "number" && Number.isFinite(raw) ? raw : null;
    result = await lowScores({ threshold, period: intent.period });
    resultCount = result.needsThreshold ? 0 : result.total;
  } else if (intent.type === "unfinished") {
    result = await unfinished();
    resultCount = result.totalUnfinished;
  } else if (intent.type === "stats") {
    result = await statsByClassOrSubject();
    resultCount = result.byClass.length + result.bySubject.length;
  } else if (intent.type === "declining") {
    result = await declining();
    resultCount = result.total;
  } else {
    return null;
  }

  const text = formatAdminContext(intent, result);
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
  };
}
