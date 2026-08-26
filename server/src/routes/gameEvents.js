import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { processEvent } from "../services/gameEventService.js";

const router = Router();

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { event, gameId, gameType, score, won, questionsAnswered, questionsCorrect, eventId } = req.body || {};
    if (!event) return sendError(res, "event is required", 400);

    const result = await processEvent(req.user.sub, {
      eventId,
      event,
      gameId,
      gameType,
      score,
      won,
      questionsAnswered,
      questionsCorrect,
    });

    sendSuccess(res, result);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

export default router;
