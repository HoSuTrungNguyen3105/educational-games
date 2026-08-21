import { Router } from "express";
import * as questionService from "../services/questionService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

// GET /api/questions/game/:gameId — trả về câu hỏi KHÔNG có correctAnswer
router.get("/game/:gameId", async (req, res, next) => {
  try {
    const questions = await questionService.listByGame(req.params.gameId);
    const safe = questions.map(({ correctAnswer, ...rest }) => rest);
    res.json(safe);
  } catch (e) {
    next(e);
  }
});

// PUT /api/questions/game/:gameId  (thay thế toàn bộ câu hỏi của game)
router.put("/game/:gameId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Body phải là mảng câu hỏi" });
    }
    const questions = await questionService.save(req.params.gameId, req.body);
    res.json(questions);
  } catch (e) {
    next(e);
  }
});

export default router;