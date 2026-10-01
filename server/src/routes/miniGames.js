/**
 * routes/miniGames.js
 * Tất cả endpoint cho 16 mini-game "Học Mà Chơi".
 *
 * Prefix mount: /api/mini  (xem app.js)
 *
 * Endpoints:
 *   POST   /api/mini/sessions            — bắt đầu ván mới (yêu cầu auth)
 *   POST   /api/mini/results             — gửi kết quả ván (yêu cầu auth)
 *   GET    /api/mini/me                  — hồ sơ người dùng (yêu cầu auth)
 *   GET    /api/mini/results             — lịch sử gần đây (yêu cầu auth)
 *   GET    /api/mini/leaderboard/xp      — BXH tổng XP (public)
 *   GET    /api/mini/leaderboard/:game   — BXH theo game (public)
 *   DELETE /api/mini/me                  — xóa dữ liệu cá nhân (yêu cầu auth)
 */

import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import * as svc from "../services/miniGameService.js";
import { MINI_GAME_IDS } from "../config/miniGameConfig.js";

const router = Router();

// ── POST /api/mini/sessions ───────────────────────────────────────────────────
/**
 * Bắt đầu một ván chơi mới. Trả về sessionId để gửi kèm khi submit result.
 *
 * Body: { "game": "math" }
 * Response: { sessionId, startedAt }
 */
router.post("/sessions", authenticate, async (req, res, next) => {
  try {
    const { game } = req.body ?? {};
    if (!game) return sendError(res, "Trường 'game' là bắt buộc", 400);
    if (!MINI_GAME_IDS.includes(game)) {
      return sendError(res, `Game '${game}' không tồn tại. Các game hợp lệ: ${MINI_GAME_IDS.join(", ")}`, 400);
    }

    const result = await svc.createSession(req.user.sub, game);
    return sendCreated(res, result, "Ván chơi đã bắt đầu");
  } catch (e) {
    if (e.status) return sendError(res, e.message, e.status);
    next(e);
  }
});

// ── POST /api/mini/results ────────────────────────────────────────────────────
/**
 * Gửi kết quả khi kết thúc ván. Idempotent theo sessionId.
 *
 * Body: { sessionId, game, score, details? }
 * Response: { xpGained, totalXp, level, leveledUp, isBest, best, newBadges, suspicious }
 */
router.post("/results", authenticate, async (req, res, next) => {
  try {
    const { sessionId, game, score, details } = req.body ?? {};

    // Validate bắt buộc
    if (!sessionId) return sendError(res, "Trường 'sessionId' là bắt buộc", 400);
    if (!game)      return sendError(res, "Trường 'game' là bắt buộc", 400);
    if (score === undefined || score === null) {
      return sendError(res, "Trường 'score' là bắt buộc", 400);
    }
    if (typeof score !== "number" || !Number.isFinite(score)) {
      return sendError(res, "Trường 'score' phải là số hợp lệ", 400);
    }

    const result = await svc.submitResult(req.user.sub, {
      sessionId,
      game,
      score,
      details: details && typeof details === "object" ? details : {},
    });

    return sendSuccess(res, result, "Kết quả đã được lưu");
  } catch (e) {
    if (e.status) return sendError(res, e.message, e.status);
    next(e);
  }
});

// ── GET /api/mini/me ──────────────────────────────────────────────────────────
/**
 * Lấy hồ sơ mini-game của người dùng đang đăng nhập.
 * Response: { userId, displayName, xp, level, gamesPlayed, played, best, badges }
 */
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const profile = await svc.getProfile(req.user.sub);
    return sendSuccess(res, profile);
  } catch (e) {
    next(e);
  }
});

// ── GET /api/mini/results ─────────────────────────────────────────────────────
/**
 * Lịch sử ván chơi gần đây.
 * Query: ?limit=20
 */
router.get("/results", authenticate, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const data = await svc.getRecentResults(req.user.sub, limit);
    return sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

// ── GET /api/mini/leaderboard/xp ─────────────────────────────────────────────
/**
 * Bảng xếp hạng theo tổng XP.
 * Query: ?limit=20
 */
router.get("/leaderboard/xp", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const data = await svc.getLeaderboardXp(limit);
    return sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

// ── GET /api/mini/leaderboard/:game ──────────────────────────────────────────
/**
 * Bảng xếp hạng theo game cụ thể.
 * Params: :game   — id game (math, flap, ...)
 * Query:  ?scope=all|week  &limit=20
 */
router.get("/leaderboard/:game", async (req, res, next) => {
  try {
    const { game } = req.params;
    const scope = req.query.scope === "week" ? "week" : "all";
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    if (!MINI_GAME_IDS.includes(game)) {
      return sendError(res, `Game '${game}' không tồn tại`, 400);
    }

    const data = await svc.getLeaderboardByGame(game, scope, limit);
    return sendSuccess(res, data);
  } catch (e) {
    if (e.status) return sendError(res, e.message, e.status);
    next(e);
  }
});

// ── DELETE /api/mini/me ───────────────────────────────────────────────────────
/**
 * Xóa toàn bộ dữ liệu mini-game của bản thân (quyền riêng tư / GDPR).
 * Yêu cầu xác nhận: body phải có { "confirm": "XOA_DU_LIEU" }
 */
router.delete("/me", authenticate, async (req, res, next) => {
  try {
    const { confirm } = req.body ?? {};
    if (confirm !== "XOA_DU_LIEU") {
      return sendError(
        res,
        "Để xác nhận xóa, gửi body: { \"confirm\": \"XOA_DU_LIEU\" }",
        400
      );
    }
    await svc.deleteUserData(req.user.sub);
    return sendSuccess(res, { deleted: true }, "Dữ liệu mini-game đã được xóa");
  } catch (e) {
    next(e);
  }
});

// ── Admin: xóa dữ liệu user bất kỳ ──────────────────────────────────────────
/**
 * DELETE /api/mini/users/:userId — chỉ admin/teacher
 */
router.delete("/users/:userId", authenticate, requireRoles("admin", "teacher"), async (req, res, next) => {
  try {
    await svc.deleteUserData(req.params.userId);
    return sendSuccess(res, { deleted: true, userId: req.params.userId });
  } catch (e) {
    next(e);
  }
});

export default router;
