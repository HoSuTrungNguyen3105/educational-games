import { Router } from "express";
import * as questionService from "../services/questionService.js";
import { authenticate, optionalAuth, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";

const router = Router();

// Strip internal fields (gameId, correctAnswer for non-admin) from question objects
function stripQuestion(q, { includeCorrectAnswer = false } = {}) {
  if (!q) return q;
  const { gameId: _gameId, correctAnswer, ...rest } = q;
  if (includeCorrectAnswer) return { ...rest, correctAnswer };
  return rest;
}

function stripQuestions(questions, opts) {
  return questions.map(q => stripQuestion(q, opts));
}

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const questions = await questionService.listAll({ limit: 500 });
    const isAdmin = req.user && (req.user.role === "teacher" || req.user.role === "admin");
    const safe = stripQuestions(questions, { includeCorrectAnswer: isAdmin });
    const pagination = buildPagination({ total: safe.length });
    sendSuccess(res, safe, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/game/:gameId", optionalAuth, async (req, res, next) => {
  try {
    const { inputMode } = req.query;
    const questions = await questionService.listByGame(req.params.gameId, { inputMode });
    const isAdmin = req.user && (req.user.role === "teacher" || req.user.role === "admin");
    const safe = stripQuestions(questions, { includeCorrectAnswer: isAdmin });
    const pagination = buildPagination({ total: safe.length });
    sendSuccess(res, safe, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.put("/game/:gameId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return sendError(res, "Body phải là mảng câu hỏi", 400);
    }
    const questions = await questionService.save(req.params.gameId, req.body);
    sendSuccess(res, stripQuestions(questions, { includeCorrectAnswer: true }));
  } catch (e) {
    next(e);
  }
});

router.patch("/game/:gameId/:questionId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const updated = await questionService.updateOne(req.params.gameId, req.params.questionId, req.body);
    if (!updated) return sendError(res, "Không tìm thấy câu hỏi", 404);
    sendSuccess(res, stripQuestion(updated, { includeCorrectAnswer: true }));
  } catch (e) {
    next(e);
  }
});

router.delete("/game/:gameId/:questionId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const deleted = await questionService.removeOne(req.params.gameId, req.params.questionId);
    if (!deleted) return sendError(res, "Không tìm thấy câu hỏi", 404);
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
});

router.delete("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const count = await questionService.removeAll();
    sendSuccess(res, { deleted: count }, `Đã xóa ${count} câu hỏi`);
  } catch (e) {
    next(e);
  }
});

export default router;
