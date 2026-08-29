import { Router } from "express";
import * as questionService from "../services/questionService.js";
import { authenticate, optionalAuth, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError, sendNoContent, buildPagination } from "../utils/response.js";

const router = Router();

router.get("/game/:gameId", optionalAuth, async (req, res, next) => {
  try {
    const questions = await questionService.listByGame(req.params.gameId);
    const isAdmin = req.user && (req.user.role === "teacher" || req.user.role === "admin");
    const safe = isAdmin
      ? questions
      : questions.map(({ correctAnswer, ...rest }) => rest);
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
    sendSuccess(res, questions);
  } catch (e) {
    next(e);
  }
});

router.patch("/game/:gameId/:questionId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const updated = await questionService.updateOne(req.params.gameId, req.params.questionId, req.body);
    if (!updated) return sendError(res, "Không tìm thấy câu hỏi", 404);
    sendSuccess(res, updated);
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
