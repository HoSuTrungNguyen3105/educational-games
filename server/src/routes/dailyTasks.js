import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import {
  getDailyTasks,
  getUserDailyStatus,
  trackAction,
  claimReward,
  getAdminStats,
  getAllUsersProgress,
  resetDailyProgress,
  createTask,
  updateTask,
  deleteTask,
} from "../services/dailyTaskService.js";

const router = Router();

// ── Public / Auth ──

router.get("/", async (_req, res, next) => {
  try { sendSuccess(res, await getDailyTasks()); } catch (e) { next(e); }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const status = await getUserDailyStatus(req.user.sub);
    const completedCount = status.filter((t) => t.completed).length;
    const claimedCount = status.filter((t) => t.claimed).length;
    const totalRewards = status.filter((t) => t.claimed).reduce((sum, t) => sum + t.coinReward, 0);
    sendSuccess(res, {
      date: new Date().toISOString().slice(0, 10),
      tasks: status,
      summary: { total: status.length, completed: completedCount, claimed: claimedCount, totalRewards },
    });
  } catch (e) { next(e); }
});

router.post("/track", authenticate, async (req, res, next) => {
  try {
    const { type, amount } = req.body || {};
    if (!type) return sendError(res, "type is required", 400);
    await trackAction(req.user.sub, type, amount || 1);
    sendSuccess(res, { tracked: true });
  } catch (e) { next(e); }
});

router.post("/claim/:taskId", authenticate, async (req, res, next) => {
  try {
    const result = await claimReward(req.user.sub, req.params.taskId);
    sendSuccess(res, result, "Nhận thưởng thành công!");
  } catch (e) { sendError(res, e.message, 400); }
});

// ── Admin: Stats & Progress ──

router.get("/admin/stats", authenticate, requireRoles("admin"), async (_req, res, next) => {
  try { sendSuccess(res, await getAdminStats()); } catch (e) { next(e); }
});

router.get("/admin/progress", authenticate, requireRoles("admin"), async (_req, res, next) => {
  try { sendSuccess(res, await getAllUsersProgress()); } catch (e) { next(e); }
});

router.post("/admin/reset", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return sendError(res, "userId is required", 400);
    await resetDailyProgress(userId);
    sendSuccess(res, { reset: true });
  } catch (e) { next(e); }
});

// ── Admin: CRUD Tasks ──

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
