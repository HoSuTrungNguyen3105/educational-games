import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
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
router.get("/admin/stats", authenticate, requireRoles("admin"), async (_req, res, next) => {
  try { sendSuccess(res, await getTaskStats()); } catch (e) { next(e); }
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

router.delete("/admin/tasks/:taskId", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    await deleteTask(req.params.taskId);
    sendSuccess(res, { deleted: true }, "Đã xóa nhiệm vụ!");
  } catch (e) { sendError(res, e.message, 400); }
});

export default router;
