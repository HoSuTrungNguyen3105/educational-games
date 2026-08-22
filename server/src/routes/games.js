import { Router } from "express";
import * as gameService from "../services/gameService.js";
import * as questionService from "../services/questionService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

router.post("/answer", async (req, res, next) => {
  try {
    const { questionId, answerId } = req.body;
    if (!questionId || !answerId) {
      return res.status(400).json({ message: "questionId và answerId là bắt buộc" });
    }
    const question = await questionService.getById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
    }
    const isCorrect = question.correctAnswer === answerId;
    res.json({ correct: isCorrect, points: isCorrect ? (question.points || 0) : 0, correctAnswer: question.correctAnswer });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const games = await gameService.list(req.query);
    res.json(games);
  } catch (e) {
    next(e);
  }
});

router.get("/code/:code", async (req, res, next) => {
  try {
    const game = await gameService.getByCode(req.params.code);
    if (!game) return res.status(404).json({ message: "Không tìm thấy trò chơi" });
    res.json(game);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const game = await gameService.get(req.params.id);
    if (!game) return res.status(404).json({ message: "Không tìm thấy trò chơi" });
    res.json(game);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.create(req.body);
    res.status(201).json(game);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.update(req.params.id, req.body);
    res.json(game);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/duplicate", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.duplicate(req.params.id);
    res.status(201).json(game);
  } catch (e) {
    next(e);
  }
});

// Xóa TẤT CẢ games (kèm questions + results)
router.delete("/", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const result = await gameService.removeAll();
    res.json({ message: `Đã xóa ${result.deleted} trò chơi`, ...result });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await gameService.remove(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
