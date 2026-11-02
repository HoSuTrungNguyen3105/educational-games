import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { listLeaderboard } from "../services/authService.js";
import { sendSuccess, buildPagination } from "../utils/response.js";

// ── Bảng xếp hạng: /api/leaderboard ───────────────────────────────────────
// Endpoint RIÊNG cho trang Bảng xếp hạng phía người dùng. Trước đây trang
// này gọi GET /api/users (chỉ giáo viên/admin + quyền users.view) nên học
// sinh vào luôn bị 403. Endpoint này chỉ cần đăng nhập (mọi vai trò), trả
// field tối thiểu của học sinh — KHÔNG nới lỏng /api/users.
const router = Router();

router.use(authenticate);

router.get("/", async (_req, res, next) => {
  try {
    const data = await listLeaderboard(50);
    sendSuccess(res, data, "success", buildPagination({ total: data.length }));
  } catch (e) {
    next(e);
  }
});

export default router;
