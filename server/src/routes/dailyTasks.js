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
} from "../services/dailyTaskService.js";

const router = Router();

// GET /api/daily-tasks — danh sách nhiệm vụ (public)
router.get("/", (_req, res, next) => {
  try {
    sendSuccess(res, getDailyTasks());
  } catch (e) {
    next(e);
  }
});

// GET /api/daily-tasks/me — trạng thái nhiệm vụ hôm nay của user
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const status = await getUserDailyStatus(req.user.sub);
    const completedCount = status.filter((t) => t.completed).length;
    const claimedCount = status.filter((t) => t.claimed).length;
    const totalRewards = status
      .filter((t) => t.claimed)
      .reduce((sum, t) => sum + t.coinReward, 0);
    sendSuccess(res, {
      date: new Date().toISOString().slice(0, 10),
      tasks: status,
      summary: {
        total: status.length,
        completed: completedCount,
        claimed: claimedCount,
        totalRewards,
      },
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/daily-tasks/track — ghi nhận hành động
// body: { type: "play_game" | "correct_answer" | "earn_xp" | "win_game" | "login", amount?: number }
router.post("/track", authenticate, async (req, res, next) => {
  try {
    const { type, amount } = req.body || {};
    if (!type) return sendError(res, "type is required", 400);
    await trackAction(req.user.sub, type, amount || 1);
    sendSuccess(res, { tracked: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/daily-tasks/claim/:taskId — nhận thưởng
router.post("/claim/:taskId", authenticate, async (req, res, next) => {
  try {
    const result = await claimReward(req.user.sub, req.params.taskId);
    sendSuccess(res, result, "Nhận thưởng thành công!");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// ═══════════════════════════════ ADMIN ═══════════════════════════════

// GET /api/daily-tasks/admin/stats — thống kê tổng quan
router.get("/admin/stats", authenticate, requireRoles("admin"), async (_req, res, next) => {
  try {
    const stats = await getAdminStats();
    sendSuccess(res, stats);
  } catch (e) {
    next(e);
  }
});

// GET /api/daily-tasks/admin/progress — toàn bộ progress hôm nay
router.get("/admin/progress", authenticate, requireRoles("admin"), async (_req, res, next) => {
  try {
    const progress = await getAllUsersProgress();
    sendSuccess(res, progress);
  } catch (e) {
    next(e);
  }
});

// POST /api/daily-tasks/admin/reset — reset progress 1 user
router.post("/admin/reset", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return sendError(res, "userId is required", 400);
    await resetDailyProgress(userId);
    sendSuccess(res, { reset: true });
  } catch (e) {
    next(e);
  }
});

export default router;
