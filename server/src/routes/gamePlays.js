import { Router } from "express";
import * as gamePlayService from "../services/gamePlayService.js";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

const router = Router();

/**
 * POST /api/game-plays/complete
 *
 * Chốt kết quả ván chơi. Điểm do server chấm lại từ `answers` — client không
 * thể tự khai `score` (trừ play-to-win, vốn không có câu hỏi để chấm).
 *
 * Body:
 *   {
 *     gameId, playerName?, playId?, answers?, questionIds?,
 *     clientScore?, timeUsed?, gameType?, playMode?
 *   }
 *
 * Trả về: document của `results` (cấu trúc cũ giữ nguyên) + field mới
 *   `xpGained` và `profile` { xp, level, xpIntoLevel, xpPerLevel, leveledUp }.
 */
router.post("/complete", authenticate, async (req, res) => {
  try {
    const { gameId, playerName, playId, answers, questionIds, clientScore, timeUsed, gameType, playMode } = req.body || {};
    if (!gameId) return sendError(res, "gameId là bắt buộc", 400);

    const result = await gamePlayService.completePlay({
      userId: req.user.sub,
      playerName: playerName || req.user.name || "",
      gameId: String(gameId),
      playId: playId ? String(playId) : null,
      answers: Array.isArray(answers) ? answers : [],
      questionIds: Array.isArray(questionIds) ? questionIds : null,
      clientScore,
      timeUsed,
      gameType,
      playMode,
    });

    if (result.replayed) return sendSuccess(res, result);
    sendCreated(res, result);
  } catch (e) {
    sendError(res, e.message, e.status || 400);
  }
});

/**
 * POST /api/game-plays/assignment
 *
 * Ghi nhận ván chơi của một bài giao đã nộp xong (bài giao tự chấm ở
 * `POST /assignments/:id/submit`). Hàm này chỉ ghi `results` + cấp XP.
 */
router.post("/assignment", authenticate, async (req, res) => {
  try {
    const { submissionId, playId, gameScore, timeUsed } = req.body || {};
    if (!submissionId) return sendError(res, "submissionId là bắt buộc", 400);
    const result = await gamePlayService.recordAssignmentPlay({
      userId: req.user.sub,
      submissionId: String(submissionId),
      playId: playId ? String(playId) : null,
      gameScore,
      timeUsed,
    });
    if (result.replayed) return sendSuccess(res, result);
    sendCreated(res, result);
  } catch (e) {
    sendError(res, e.message, e.status || 400);
  }
});

/**
 * POST /api/game-plays/reward-coins
 *
 * Game tự quyết định mức thưởng coin sau khi thắng (ví dụ XO). Có trần mỗi
 * ngày phía server nên iframe không thể spam vô hạn.
 */
router.post("/reward-coins", authenticate, async (req, res) => {
  try {
    const { amount } = req.body || {};
    if (typeof amount !== "number") return sendError(res, "amount (number) is required", 400);
    const out = await gamePlayService.rewardCoins(req.user.sub, amount);
    sendSuccess(res, out);
  } catch (e) {
    sendError(res, e.message, e.status || 400);
  }
});

export default router;