// routes/pet.js
//
// API thú cưng. Mọi route đều yêu cầu đăng nhập, trừ GET /catalog.
//
//   GET    /api/pet/catalog        danh mục loài / màu / trang phục (đã lọc theo cấp)
//   GET    /api/pet                 pet hiện tại (tự tạo nếu chưa có)
//   PUT    /api/pet                 đổi tên / loài / màu / trang phục
//   POST   /api/pet/exp             cộng EXP khi trả lời đúng (game gọi)
//   POST   /api/pet/mood            đổi tâm tính
//   POST   /api/pet/reset           đặt lại mặc định

import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as petService from "../services/petService.js";

const router = Router();

// Danh mục công khai — không cần đăng nhập (app cần hiển thị trước khi login)
router.get("/catalog", async (req, res, next) => {
  try {
    const userId = req.user?.sub || null;
    const data = userId ? await petService.catalogFor(userId) : await petService.catalogFor(null);
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

router.use(authenticate);

// GET /api/pet
router.get("/", async (req, res, next) => {
  try {
    const pet = await petService.getByUser(req.user.sub);
    sendSuccess(res, petService.serialize(pet));
  } catch (e) {
    next(e);
  }
});

// PUT /api/pet — cập nhật diện mạo
router.put("/", async (req, res, next) => {
  try {
    const result = await petService.updateLook(req.user.sub, req.body || {});
    if (!result.ok) {
      return sendError(res, 400, result.errors?.join("; ") || "Dữ liệu không hợp lệ");
    }
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

// POST /api/pet/exp — game gọi sau mỗi câu trả lời
router.post("/exp", async (req, res, next) => {
  try {
    const { amount, correct, wrong } = req.body || {};
    const result = await petService.addExp(
      req.user.sub,
      Number(amount) || 0,
      { correct: Number(correct) || 0, wrong: Number(wrong) || 0 }
    );
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
});

// POST /api/pet/mood
router.post("/mood", async (req, res, next) => {
  try {
    const result = await petService.setMood(req.user.sub, req.body?.mood);
    if (!result.ok) return sendError(res, 400, result.errors?.join("; ") || "mood không hợp lệ");
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

// POST /api/pet/reset
router.post("/reset", async (req, res, next) => {
  try {
    const result = await petService.reset(req.user.sub);
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

export default router;
