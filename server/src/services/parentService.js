import { getCollection } from "../db.js";
import { createUser, findByUsername, signToken, getXp, resetPassword } from "./authService.js";
import { revokeAllForUser } from "./refreshTokenService.js";
import { getByUser as getProgressByUser } from "./gameProgressService.js";
import { getUserAllTaskStatus, STUDENT_TASK_SCOPES } from "./taskEngineService.js";
import { getClassById, getTeacherClasses, getClassStudents } from "./classService.js";

// ── Phụ huynh ↔ Học sinh ──────────────────────────────────────────────────
// Cơ chế liên kết bằng MÃ 6 SỐ (giống mã lớp / mã bài tập mà hệ thống đã dùng):
//   1. Học sinh (hoặc giáo viên của lớp / admin) tạo mã từ tài khoản của mình
//      — mã lưu ở `users.parentLinkCode` của HỌC SINH, tạo một lần dùng nhiều
//      lần (cả bố và mẹ cùng liên kết được), học sinh xem được ai đã liên kết
//      và gỡ liên kết bất cứ lúc nào.
//   2. Phụ huynh đăng ký tài khoản role `parent` rồi nhập mã → tạo bản ghi
//      trong collection `parentLinks` { parentId, studentId }.
// Quyền xem báo cáo được kiểm tra Ở BACKEND trên từng request: phụ huynh chỉ
// đọc được dữ liệu của studentId có bản ghi liên kết với mình — không có
// đường nào xem học sinh khác, kể cả khi sửa URL ở client.

const LINKS = "parentLinks";
const USERS = "users";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function linkCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

// ── Mã liên kết ───────────────────────────────────────────────────────────

/** Lấy mã hiện tại của học sinh (chưa có → null, không tự tạo). */
export async function getLinkCode(studentId) {
  const student = await getCollection(USERS).findOne({ id: studentId });
  if (!student) throw httpError("Không tìm thấy học sinh", 404);
  return student.parentLinkCode || null;
}

/** Tạo mã mới cho học sinh (ghi đè mã cũ — mã cũ hết hiệu lực ngay). */
export async function generateLinkCode(studentId) {
  const col = getCollection(USERS);
  const student = await col.findOne({ id: studentId });
  if (!student) throw httpError("Không tìm thấy học sinh", 404);
  if (student.role !== "student") throw httpError("Chỉ tài khoản học sinh mới có mã liên kết phụ huynh", 400);

  let code = linkCode();
  for (let i = 0; i < 10; i++) {
    const clash = await col.findOne({ parentLinkCode: code, id: { $ne: studentId } });
    if (!clash) break;
    code = linkCode();
  }
  await col.updateOne(
    { id: studentId },
    { $set: { parentLinkCode: code, parentLinkCodeAt: new Date().toISOString() } }
  );
  return code;
}

/** Tìm học sinh theo mã liên kết (không lộ thông tin gì thêm). */
async function findStudentByCode(code) {
  const clean = String(code || "").trim();
  if (!/^\d{6}$/.test(clean)) return null;
  const student = await getCollection(USERS).findOne({ parentLinkCode: clean });
  if (!student || student.role !== "student") return null;
  return student;
}

// ── Tài khoản phụ huynh ───────────────────────────────────────────────────

/**
 * Đăng ký tài khoản phụ huynh. Nếu kèm `linkCode` thì mã được kiểm tra TRƯỚC
 * khi tạo tài khoản (mã sai → báo lỗi ngay, không tạo tài khoản mồ côi) và
 * liên kết được tạo ngay sau khi tài khoản sinh ra.
 */
export async function registerParent({ username, email, password, name, linkCode: code }) {
  let student = null;
  if (code) {
    student = await findStudentByCode(code);
    if (!student) throw httpError("Mã liên kết không hợp lệ", 400);
  }
  const pub = await createUser({ username, email, password, name, role: "parent" });
  if (student) {
    await getCollection(LINKS).insertOne({
      _id: uid("plink"),
      id: uid("plink"),
      parentId: pub.id,
      studentId: student.id,
      createdAt: new Date().toISOString(),
    });
  }
  const full = await findByUsername(pub.username);
  return { token: signToken(full), user: pub, linkedStudentId: student?.id || null };
}

// ── Liên kết ──────────────────────────────────────────────────────────────

/** Phụ huynh nhập mã để gắn thêm một người con. */
export async function linkByCode(parentId, code) {
  const student = await findStudentByCode(code);
  if (!student) throw httpError("Mã liên kết không hợp lệ", 400);
  const col = getCollection(LINKS);
  const existing = await col.findOne({ parentId, studentId: student.id });
  if (existing) throw httpError("Bạn đã liên kết với học sinh này rồi", 409);
  const doc = {
    _id: uid("plink"),
    id: uid("plink"),
    parentId,
    studentId: student.id,
    createdAt: new Date().toISOString(),
  };
  await col.insertOne(doc);
  return studentSummary(student);
}

/** Gỡ liên kết — dùng chung cho phụ huynh (bỏ con) và học sinh (bỏ phụ huynh). */
export async function unlink(parentId, studentId) {
  const res = await getCollection(LINKS).deleteOne({ parentId, studentId });
  if (res.deletedCount === 0) throw httpError("Không tìm thấy liên kết", 404);
  return { ok: true };
}

export async function isLinked(parentId, studentId) {
  const doc = await getCollection(LINKS).findOne({ parentId, studentId });
  return !!doc;
}

/**
 * Phụ huynh đặt lại mật khẩu cho CON ĐÃ LIÊN KẾT (con quên mật khẩu thì
 * hiện chỉ có quản trị mới đặt lại được). Điều kiện cứng giống mọi endpoint
 * báo cáo: phải có bản ghi liên kết thật trong `parentLinks` — chưa liên
 * kết → 403, không có ngoại lệ.
 * Mật khẩu mới đi qua `authService.resetPassword` (băm bcrypt, tối thiểu 6
 * ký tự, xóa generatedPassword) — cùng cơ chế quản trị đang dùng.
 * Sau khi đổi, thu hồi MỌI refresh token của con (cơ chế sẵn có
 * `revokeAllForUser`) để các thiết bị đang đăng nhập phải đăng nhập lại
 * bằng mật khẩu mới. Giới hạn còn lại: access token JWT đã cấp là stateless
 * nên vẫn hiệu lực tới khi tự hết hạn — hệ thống chưa có danh sách thu hồi
 * access token.
 */
export async function resetChildPassword(parentId, studentId, newPassword) {
  if (!(await isLinked(parentId, studentId))) {
    throw httpError("Bạn chưa liên kết với học sinh này", 403);
  }
  const student = await getCollection(USERS).findOne({ id: studentId });
  if (!student) throw httpError("Không tìm thấy học sinh", 404);
  if (student.role !== "student") throw httpError("Tài khoản này không phải là học sinh", 400);
  await resetPassword(studentId, newPassword);
  await revokeAllForUser(studentId).catch((e) => {
    console.error("[parents] Thu hồi phiên của học sinh sau đặt lại mật khẩu thất bại:", e.message);
  });
  return { ok: true };
}

// ── Tóm tắt hiển thị ──────────────────────────────────────────────────────

async function studentSummary(student) {
  if (!student) return null;
  let className = null;
  if (student.classId) {
    const cls = await getClassById(student.classId).catch(() => null);
    className = cls?.name || null;
  }
  return {
    id: student.id,
    username: student.username,
    name: student.name,
    classId: student.classId || null,
    className,
  };
}

function parentSummary(parent) {
  if (!parent) return null;
  return { id: parent.id, username: parent.username, name: parent.name };
}

/** Danh sách con của một phụ huynh. */
export async function listChildren(parentId) {
  const links = await getCollection(LINKS).find({ parentId }).sort({ createdAt: 1 }).toArray();
  const out = [];
  for (const link of links) {
    const student = await getCollection(USERS).findOne({ id: link.studentId });
    if (!student) continue;
    out.push({ ...(await studentSummary(student)), linkedAt: link.createdAt });
  }
  return out;
}

/** Danh sách phụ huynh đã liên kết với một học sinh (học sinh tự xem/gỡ). */
export async function listParentsOf(studentId) {
  const links = await getCollection(LINKS).find({ studentId }).sort({ createdAt: 1 }).toArray();
  const out = [];
  for (const link of links) {
    const parent = await getCollection(USERS).findOne({ id: link.parentId });
    if (!parent) continue;
    out.push({ ...parentSummary(parent), linkedAt: link.createdAt });
  }
  return out;
}

/**
 * Giáo viên có được tạo mã liên kết cho học sinh này không?
 * (giáo viên phải dạy lớp mà học sinh đang học; admin thì luôn được)
 */
export async function teacherCanManageStudent(teacher, studentId) {
  if (teacher.role === "admin") return true;
  if (teacher.role !== "teacher") return false;
  const classes = await getTeacherClasses(teacher.sub).catch(() => []);
  for (const cls of classes || []) {
    const students = await getClassStudents(cls.id).catch(() => []);
    if ((students || []).some((s) => s.id === studentId)) return true;
  }
  return false;
}

// ── Báo cáo học tập ───────────────────────────────────────────────────────

/**
 * Báo cáo của MỘT học sinh cho phụ huynh — CHỈ khi đã liên kết.
 * Gom từ đúng các nguồn mà các trang khác đang dùng (users.xp chuẩn, ví,
 * tiến độ game, kết quả đã chấm ở server, bài nộp, nhiệm vụ).
 */
export async function getChildReport(parentId, studentId) {
  if (!(await isLinked(parentId, studentId))) {
    throw httpError("Bạn chưa liên kết với học sinh này", 403);
  }
  const student = await getCollection(USERS).findOne({ id: studentId });
  if (!student) throw httpError("Không tìm thấy học sinh", 404);

  const [summary, xpInfo, progress, taskStatus] = await Promise.all([
    studentSummary(student),
    getXp(studentId).catch(() => ({ xp: 0, level: 1, xpIntoLevel: 0, xpPerLevel: 120 })),
    getProgressByUser(studentId).catch(() => []),
    getUserAllTaskStatus(studentId).catch(() => []),
  ]);

  // Tên game để báo cáo dễ đọc (bỏ qua game đã bị xóa).
  const gameIds = [...new Set(progress.map((p) => p.gameId).filter(Boolean))];
  const games = gameIds.length
    ? await getCollection("games").find({ id: { $in: gameIds } }).toArray()
    : [];
  const gameName = new Map(games.map((g) => [g.id, g.name || g.title || g.id]));

  const perGame = [...progress]
    .sort((a, b) => (b.gamesPlayed || 0) - (a.gamesPlayed || 0))
    .slice(0, 5)
    .map((p) => ({
      gameId: p.gameId,
      gameName: gameName.get(p.gameId) || p.gameId,
      gamesPlayed: p.gamesPlayed || 0,
      experience: p.experience || 0,
      lastPlayedAt: p.lastPlayedAt || null,
    }));

  const recentResults = await getCollection("results")
    .find({ userId: studentId })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  const recentSubs = await getCollection("submissions")
    .find({ studentId, status: "SUBMITTED" })
    .sort({ submittedAt: -1 })
    .limit(10)
    .toArray();
  const asgnIds = [...new Set(recentSubs.map((s) => s.assignmentId).filter(Boolean))];
  const asgns = asgnIds.length
    ? await getCollection("assignments").find({ id: { $in: asgnIds } }).toArray()
    : [];
  const asgnTitle = new Map(asgns.map((a) => [a.id, a.title]));

  // Đếm CÙNG tập nhiệm vụ học sinh nhìn thấy trên trang Nhiệm vụ
  // (STUDENT_TASK_SCOPES — 3 tab Hàng ngày/Hàng tuần/Tổng cộng).
  // getUserAllTaskStatus trả MỌI nhiệm vụ đang bật, gồm cả scope EVENT
  // không hề xuất hiện trên trang Nhiệm vụ → trước đây tổng số phía phụ
  // huynh (14 trên production) luôn lớn hơn tập học sinh thấy (tab mặc
  // định Hàng ngày là 10) dù tiến độ không sai. tasksCompleted/tasksClaimed
  // ở dưới lọc trên cùng tập `tasks` này nên tự khớp theo.
  const tasks = (Array.isArray(taskStatus) ? taskStatus : [])
    .filter((t) => STUDENT_TASK_SCOPES.includes(t.scope));

  return {
    student: {
      ...summary,
      coins: student.coins || 0,
      stars: student.stars || 0,
      xp: xpInfo.xp,
      level: xpInfo.level,
      xpIntoLevel: xpInfo.xpIntoLevel,
      xpPerLevel: xpInfo.xpPerLevel,
    },
    overview: {
      totalPlays: progress.reduce((s, p) => s + (p.gamesPlayed || 0), 0),
      gamesPlayed: progress.length,
      questsCompleted: progress.reduce((s, p) => s + (p.questsCompleted || 0), 0),
      tasksTotal: tasks.length,
      tasksCompleted: tasks.filter((t) => t.completed).length,
      tasksClaimed: tasks.filter((t) => t.claimed).length,
    },
    perGame,
    recentResults: recentResults.map((r) => ({
      id: r.id,
      gameId: r.gameId,
      gameName: gameName.get(r.gameId) || r.gameName || r.gameId,
      score: r.score ?? null,
      correctAnswers: r.correctAnswers ?? null,
      totalQuestions: r.totalQuestions ?? null,
      accuracy: r.accuracy ?? null,
      xpGained: r.xpGained || 0,
      createdAt: r.createdAt,
    })),
    recentSubmissions: recentSubs.map((s) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle: asgnTitle.get(s.assignmentId) || "Bài tập",
      score: s.score,
      correctCount: s.correctCount || 0,
      totalQuestions: s.totalQuestions || 0,
      submittedAt: s.submittedAt,
    })),
  };
}
