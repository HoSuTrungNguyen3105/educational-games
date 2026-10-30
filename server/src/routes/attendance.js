import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getRolePermissionsCached } from "../services/permissionService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import {
  ATTENDANCE_STATUSES,
  SELF_STATUSES,
  todayDate,
  normalizeDate,
  normalizeMonth,
  saveRecord,
  listByUser,
  listByClass,
  getMonthlyStats,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../services/attendanceService.js";

/**
 * attendance.js — API chấm công mà client (src/services/attendanceService.js) gọi.
 *
 * Hai tầng quyền (middleware/permission.js) đã chặn từ trước:
 *   GET /attendance/*          → attendance.view   (quyền cơ bản của mọi vai trò)
 *   POST /attendance/checkin   → attendance.checkin ≡ ô "Chấm công · sửa"
 *   PATCH /attendance/:id      → attendance.edit
 *   DELETE /attendance/:id     → attendance.delete
 *
 * Phần còn lại ở đây là quyền SỞ HỮU dữ liệu, mà middleware theo path không
 * phân biệt được:
 *  · Tài khoản vai trò `student` chỉ chạm được bản ghi của CHÍNH MÌNH, tự chấm
 *    chỉ được NGÀY HÔM NAY và chỉ present/late (không tự đánh dấu mình nghỉ,
 *    không tự sửa quá khứ). Muốn cho học sinh tự điểm danh thì bật ô "Chấm công
 *    · sửa" cho vai trò student ở trang Phân quyền.
 *  · Chạm dữ liệu của NGƯỜI KHÁC (xem history/stats của bạn khác, xem cả lớp,
 *    sửa/xoá bản ghi) cần ô "Chấm công · sửa" — `attendance.view` là quyền cơ
 *    bản của mọi tài khoản nên tự nó chỉ đủ để xem lịch của chính mình.
 */
const r = Router();

const STUDENT_ROLE = "student";
const isStudent = (user) => user?.role === STUDENT_ROLE;
/** "me" = tự chấm cho mình; ngoài ra phải đúng id trong token. */
const resolveTarget = (raw, me) => {
  const id = String(raw ?? "").trim();
  if (!id || id === "me") return me;
  return id;
};

async function roleHasPermission(user, ...perms) {
  const granted = await getRolePermissionsCached(user.role).catch(() => []);
  return perms.some((p) => granted.includes(p));
}

/** Đọc/ghi bản ghi của người khác: ngoài vai trò student + có ô "Chấm công · sửa". */
const canSeeOthers = (user) => !isStudent(user) && roleHasPermission(user, "attendance.edit", "attendance.checkin");

r.use(authenticate);

// ── Chấm công ────────────────────────────────────────────────────────────
r.post("/checkin", async (req, res, next) => {
  try {
    const me = req.user.sub;
    const studentId = resolveTarget(req.body?.studentId, me);
    const status = String(req.body?.status ?? "").trim();
    const date = normalizeDate(req.body?.date ?? todayDate());

    if (!ATTENDANCE_STATUSES.includes(status)) {
      return sendError(res, `Trạng thái không hợp lệ ( cần một trong: ${ATTENDANCE_STATUSES.join(", ")} )`, 400);
    }
    if (!date) return sendError(res, "Ngày chấm công không hợp lệ (YYYY-MM-DD)", 400);

    if (isStudent(req.user)) {
      if (studentId !== me) return sendError(res, "Bạn chỉ chấm công được cho chính mình", 403);
      if (date !== todayDate()) return sendError(res, "Học sinh chỉ chấm công được cho ngày hôm nay", 403);
      if (!SELF_STATUSES.includes(status)) {
        return sendError(res, `Học sinh tự chấm chỉ được: ${SELF_STATUSES.join(", ")}`, 403);
      }
    }

    const { record, created } = await saveRecord({
      userId: studentId,
      date,
      status,
      notes: req.body?.notes,
      source: isStudent(req.user) && studentId === me ? "self" : "staff",
      updatedBy: me,
    });
    sendSuccess(res, record, created ? "Đã chấm công" : "Đã cập nhật chấm công");
  } catch (e) { next(e); }
});

// ── Lịch sử ──────────────────────────────────────────────────────────────
r.get("/student/:id", async (req, res, next) => {
  try {
    const me = req.user.sub;
    const id = resolveTarget(req.params.id, me);
    if (id !== me && !(await canSeeOthers(req.user))) {
      return sendError(res, "Bạn chỉ xem được lịch chấm công của chính mình", 403);
    }
    sendSuccess(res, await listByUser(id, { month: req.query.month, year: req.query.year }));
  } catch (e) { next(e); }
});

r.get("/class/:classId", async (req, res, next) => {
  try {
    if (!(await canSeeOthers(req.user))) return sendError(res, "Bạn cần quyền Chấm công · sửa để xem lịch của lớp", 403);
    sendSuccess(res, await listByClass(req.params.classId, { month: req.query.month, year: req.query.year }));
  } catch (e) { next(e); }
});

// Thống kê tháng — month ở đường dẫn hoặc ?month=
r.get("/stats/:id/:month?", async (req, res, next) => {
  try {
    const me = req.user.sub;
    const id = resolveTarget(req.params.id, me);
    if (id !== me && !(await canSeeOthers(req.user))) {
      return sendError(res, "Bạn chỉ xem được thống kê của chính mình", 403);
    }
    const month = normalizeMonth(req.params.month || req.query.month);
    if (!month) return sendError(res, "Tháng không hợp lệ (YYYY-MM)", 400);
    sendSuccess(res, await getMonthlyStats(id, month));
  } catch (e) { next(e); }
});

// ── Sửa / xoá bản ghi (dành cho giáo viên, quản trị) ─────────────────────
r.patch("/:id", async (req, res, next) => {
  try {
    if (isStudent(req.user)) return sendError(res, "Bạn không được sửa bản ghi chấm công", 403);
    if (!(await roleHasPermission(req.user, "attendance.edit", "attendance.checkin"))) {
      return sendError(res, "Bạn không có quyền: Chấm công · sửa", 403);
    }
    const existing = await getRecordById(req.params.id);
    if (!existing) return sendError(res, "Không tìm thấy bản ghi chấm công", 404);
    const record = await updateRecord(
      req.params.id,
      {
        ...(req.body?.status !== undefined ? { status: req.body.status } : {}),
        ...(req.body?.notes !== undefined ? { notes: req.body.notes } : {}),
        ...(req.body?.date !== undefined ? { date: req.body.date } : {}),
      },
      { updatedBy: req.user.sub },
    );
    sendSuccess(res, record, "Đã cập nhật");
  } catch (e) { next(e); }
});

r.delete("/:id", async (req, res, next) => {
  try {
    if (isStudent(req.user)) return sendError(res, "Bạn không được xoá bản ghi chấm công", 403);
    if (!(await roleHasPermission(req.user, "attendance.delete"))) {
      return sendError(res, "Bạn không có quyền: Chấm công · xóa", 403);
    }
    const existing = await getRecordById(req.params.id);
    if (!existing) return sendError(res, "Không tìm thấy bản ghi chấm công", 404);
    await deleteRecord(req.params.id);
    sendSuccess(res, { ok: true, id: req.params.id }, "Đã xoá");
  } catch (e) { next(e); }
});

export default r;
