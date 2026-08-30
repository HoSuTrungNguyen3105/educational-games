import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { processEvent } from "../services/gameEventService.js";
import { processTaskEvent } from "../services/taskEngineService.js";

const router = Router();

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { event, eventId, gameId, gameType, score, won, questionsAnswered, questionsCorrect } = req.body || {};
    if (!event) return sendError(res, "event is required", 400);

    // Legacy: process through old system
    const legacyResult = await processEvent(req.user.sub, {
      eventId,
      event,
      gameId,
      gameType,
      score,
      won,
      questionsAnswered,
      questionsCorrect,
    });

    // New: process through task engine (map old event types to new ones)
    const EVENT_MAP = {
      GAME_STARTED: "GAME_STARTED",
      GAME_COMPLETED: "GAME_PLAYED",
      GAME_WON: "GAME_WON",
      GAME_LOST: "GAME_LOST",
      QUESTION_ANSWERED: "QUESTION_ANSWERED",
      QUESTION_CORRECT: "ANSWER_CORRECT",
      QUESTION_WRONG: "QUESTION_WRONG",
      SCORE_ACHIEVED: "XP_EARNED",
      LOGIN: "LOGIN",
      SPIN: "SPIN",
    };

    const newType = EVENT_MAP[event];
    if (newType) {
      const metadata = {};
      if (score) metadata.amount = score;
      if (questionsAnswered) metadata.amount = questionsAnswered;
      if (questionsCorrect) metadata.amount = questionsCorrect;

      await processTaskEvent(req.user.sub, {
        eventId: eventId ? `${eventId}-v2` : undefined,
        type: newType,
        gameId,
        metadata,
      });
    }

    sendSuccess(res, legacyResult);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

export default router;
