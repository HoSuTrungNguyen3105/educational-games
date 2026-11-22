import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as examResultService from "../services/examResultService.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/users/me/exam-results — save an exam result (Trường Vui Vẻ)
router.post("/me/exam-results", async (req, res, next) => {
  try {
    const { examId } = req.body || {};
    if (!examId) return sendError(res, "examId is required", 400);
    const doc = await examResultService.create(req.user.sub, req.body);
    sendSuccess(res, doc);
  } catch (e) {
    next(e);
  }
});

// GET /api/users/me/exam-results — my exam history
router.get("/me/exam-results", async (req, res, next) => {
  try {
    const list = await examResultService.listByUser(req.user.sub, { limit: req.query.limit });
    sendSuccess(res, list);
  } catch (e) {
    next(e);
  }
});

// Bản admin GET /api/users/exam-results (liệt kê kết quả thi của mọi học
// sinh) đã bị GỠ: 0 caller trong web — client chỉ dùng /me/exam-results
// cho chính học sinh. adminRouter rỗng đi kèm cũng gỡ khỏi app.js.

export default router;
