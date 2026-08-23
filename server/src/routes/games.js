import { Router } from "express";
import * as gameService from "../services/gameService.js";
import * as questionService from "../services/questionService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.post("/answer", async (req, res, next) => {
  try {
    const { questionId, answerId } = req.body;
    if (!questionId || !answerId) {
      return sendError(res, "questionId và answerId là bắt buộc", 400);
    }
    const question = await questionService.getById(questionId);
    if (!question) {
      return sendError(res, "Không tìm thấy câu hỏi", 404);
    }
    const isCorrect = question.correctAnswer === answerId;
    sendSuccess(res, { correct: isCorrect, points: isCorrect ? (question.points || 0) : 0, correctAnswer: question.correctAnswer });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const games = await gameService.list(req.query);
    const total = Array.isArray(games) ? games.length : 0;
    const pagination = buildPagination({
      page: req.query.page, perPage: req.query.per_page, total,
      keyword: req.query.query || "", sortBy: req.query.sort_by || "",
      sortDir: req.query.sort_dir || "DESC",
    });
    sendSuccess(res, games, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/code/:code", async (req, res, next) => {
  try {
    const game = await gameService.getByCode(req.params.code);
    if (!game) return sendError(res, "Không tìm thấy trò chơi", 404);
    sendSuccess(res, game);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const game = await gameService.get(req.params.id);
    if (!game) return sendError(res, "Không tìm thấy trò chơi", 404);
    sendSuccess(res, game);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.create(req.body);
    sendCreated(res, game);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.update(req.params.id, req.body);
    sendSuccess(res, game);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/duplicate", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.duplicate(req.params.id);
    sendCreated(res, game);
  } catch (e) {
    next(e);
  }
});

router.delete("/", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const result = await gameService.removeAll();
    sendSuccess(res, result, `Đã xóa ${result.deleted} trò chơi`);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await gameService.remove(req.params.id);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
});

export default router;
