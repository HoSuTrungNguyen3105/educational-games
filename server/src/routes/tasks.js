import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";
import { parseRange, sliceRange } from "../utils/rangeList.js";
import { matchesFolded } from "../utils/textFold.js";
import { parseBulkIds, runBulkDelete, bulkResultPayload } from "../utils/bulkDelete.js";
import {
  getUserTaskProgress,
  getUserAllTaskStatus,
  processTaskEvent,
  claimTaskReward,
  getAllActiveTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  seedDefaultTasks,
} from "../services/taskEngineService.js";

const router = Router();

// ── GET /me/tasks?scope=daily ──
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const scope = (req.query.scope || "DAILY").toUpperCase();
    const tasks = await getUserTaskProgress(req.user.sub, scope);
    const completedCount = tasks.filter((t) => t.completed).length;
    const claimedCount = tasks.filter((t) => t.claimed).length;
    sendSuccess(res, {
      scope,
      tasks,
      completedCount,
      totalCount: tasks.length,
    });
  } catch (e) { next(e); }
});

// ── GET /me/tasks/all — all scopes ──
router.get("/me/all", authenticate, async (req, res, next) => {
  try {
    const tasks = await getUserAllTaskStatus(req.user.sub);
    sendSuccess(res, { tasks });
  } catch (e) { next(e); }
});

// ── POST /task-events — process a game event ──
router.post("/events", authenticate, async (req, res, next) => {
  try {
    const { eventId, type, gameId, metadata } = req.body || {};
    if (!type) return sendError(res, "type is required", 400);

    const result = await processTaskEvent(req.user.sub, { eventId, type, gameId, metadata });
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

// ── POST /tasks/:taskId/claim ──
router.post("/:taskId/claim", authenticate, async (req, res, next) => {
  try {
    const result = await claimTaskReward(req.user.sub, req.params.taskId);
    sendSuccess(res, result, "Nhận thưởng thành công!");
  } catch (e) { sendError(res, e.message, 400); }
});

// ── GET /admin/stats ──
// Phân đoạn tuỳ chọn cho PHẦN tasks của payload (chỉ áp khi client GỬI
// from/to và/hoặc q — không gửi → payload cũ nguyên vẹn, không thêm field):
// trang /dashboard/daily-tasks phân trang phía server nên danh sách nhiệm
// vụ trong stats được lọc theo ?q= (tên/mã/mô tả + nhãn loại/phạm vi —
// đúng các trường ô tìm kiếm phía client vẫn lọc, gập dấu qua
// utils/textFold.js) rồi cắt theo ?from=&to=; payload đính kèm
// `pagination` (tổng SAU lọc) để trang vẽ cụm phân trang dùng chung.
// Các số tổng (totalTasks/totalParticipants/…) luôn là tổng TOÀN BỘ,
// không đổi theo bộ lọc/trang.
const TASK_TYPE_LABELS = {
  GAME_PLAYED: "Chơi game",
  QUESTION_ANSWERED: "Trả lời câu hỏi",
  ANSWER_CORRECT: "Trả lời đúng",
  XP_EARNED: "Kiếm XP",
  GAME_WON: "Thắng game",
  LOGIN: "Đăng nhập",
};
const TASK_SCOPE_LABELS = { DAILY: "Hàng ngày", WEEKLY: "Hàng tuần", TOTAL: "Tổng cộng" };

router.get("/admin/stats", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const stats = await getTaskStats();
    const range = parseRange(req.query);
    if (range.error) return sendError(res, range.error, 400);
    if (!range.present && req.query.q === undefined) {
      return sendSuccess(res, stats);
    }
    let tasks = stats.tasks || [];
    if (req.query.q !== undefined) {
      tasks = tasks.filter((t) => matchesFolded(req.query.q,
        t.name, t.code, t.description, TASK_TYPE_LABELS[t.type], TASK_SCOPE_LABELS[t.scope]));
    }
    const total = tasks.length;
    if (range.present) tasks = sliceRange(tasks, range);
    const size = range.present ? Math.max(1, range.to - range.from + 1) : Math.max(1, total);
    const pagination = buildPagination({
      page: range.present ? Math.floor((range.from - 1) / size) + 1 : 1,
      perPage: size,
      total,
    });
    if (range.present) { pagination.from = range.from; pagination.to = range.to; }
    sendSuccess(res, { ...stats, tasks, pagination });
  } catch (e) { next(e); }
});

// ── POST /admin/seed — nạp bộ nhiệm vụ mẫu còn thiếu (admin) ──
// db.js chỉ seed khi collection rỗng lúc khởi tạo; nếu admin đã xoá sạch
// nhiệm vụ thì dùng endpoint này để nạp lại mà không cần khởi động lại server.
router.post("/admin/seed", authenticate, requireRoles("admin"), async (_req, res, next) => {
  try { sendSuccess(res, await seedDefaultTasks(), "Đã nạp bộ nhiệm vụ mẫu"); } catch (e) { next(e); }
});

// ── Admin CRUD ──
router.post("/admin/tasks", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const task = await createTask(req.body || {});
    sendSuccess(res, task, "Tạo nhiệm vụ thành công!");
  } catch (e) { sendError(res, e.message, 400); }
});

router.put("/admin/tasks/:taskId", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const result = await updateTask(req.params.taskId, req.body || {});
    if (!result) return sendError(res, "Không có gì thay đổi", 400);
    sendSuccess(res, result, "Cập nhật thành công!");
  } catch (e) { sendError(res, e.message, 400); }
});

// Xóa HÀNG LOẠT nhiệm vụ — PHẢI khai báo TRƯỚC "/admin/tasks/:taskId".
// Body: { ids: string[] } (tối đa BULK_DELETE_MAX_IDS), từng id độc lập.
// (Trang quản trị Nhiệm vụ dùng route này qua taskService; bản song song ở
// routes/dailyTasks.js phục vụ dailyTaskService.)
router.delete("/admin/tasks/bulk", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const parsed = parseBulkIds(req.body);
    if (parsed.error) return sendError(res, parsed.error, 400);
    const result = await runBulkDelete(parsed.ids, (id) => deleteTask(id));
    sendSuccess(res, bulkResultPayload(result), "Đã xử lý xóa hàng loạt");
  } catch (e) { sendError(res, e.message, 400); }
});

router.delete("/admin/tasks/:taskId", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    await deleteTask(req.params.taskId);
    sendSuccess(res, { deleted: true }, "Đã xóa nhiệm vụ!");
  } catch (e) { sendError(res, e.message, 400); }
});

export default router;
