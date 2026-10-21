import { Router } from "express";
import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

const router = Router();

const MAX_SCORE = 100000;

// POST /api/game-attempts — đồng bộ kết quả chơi OFFLINE (GĐ5 của refactor_game.md).
// - Idempotent theo attemptId (lưu vào results.playId): sync lại nhiều lần không ghi trùng.
// - Điểm client gửi KHÔNG tin tuyệt đối: chỉ nhận số hợp lệ, đánh dấu verified:false,
//   KHÔNG cộng coin/xp từ kết quả này (phòng gian lận khi chơi offline).
router.post("/", authenticate, async (req, res, next) => {
  try {
    const { attemptId, templateId, gameVersion, score, details } = req.body || {};
    if (!attemptId || !templateId) {
      return sendError(res, "attemptId và templateId là bắt buộc", 400);
    }

    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > MAX_SCORE) {
      return sendError(res, "Điểm số không hợp lệ", 400);
    }

    let gameId;
    try {
      gameId = new ObjectId(templateId).toString();
    } catch {
      return sendError(res, "templateId không hợp lệ", 400);
    }
    const game = await getCollection("games").findOne({ _id: new ObjectId(gameId) }, { projection: { name: 1 } });
    if (!game) return sendError(res, "Không tìm thấy trò chơi", 404);

    // Idempotency: attemptId đã sync rồi → trả về bản đã lưu, không insert thêm
    const existing = await getCollection("results").findOne({ playId: String(attemptId) });
    if (existing) {
      return sendSuccess(res, { ...existing, duplicate: true }, "Kết quả này đã được đồng bộ trước đó");
    }

    const d = details && typeof details === "object" ? details : {};
    const totalQuestions = Number(d.total) || 0;
    const correctAnswers = Number(d.correct) || 0;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) / 100 : 0;

    const doc = {
      id: `result-${Math.random().toString(36).slice(2, 9)}`,
      gameId,
      playerId: req.user.sub || "",
      playerName: req.user.name || "",
      userId: req.user.sub || "",
      playId: String(attemptId),
      gameVersion: Number(gameVersion) || 0,
      score: numericScore,
      correctAnswers,
      totalQuestions,
      accuracy,
      durationMs: Number(d.durationMs) || 0,
      verified: false,
      source: "offline-sync",
      createdAt: d.completedAt || new Date().toISOString(),
    };
    await getCollection("results").insertOne(doc);
    sendCreated(res, doc);
  } catch (e) {
    next(e);
  }
});

export default router;
