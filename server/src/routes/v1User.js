import { Router } from "express";
import { performRefresh } from "./auth.js";

/**
 * API v1 phía người dùng.
 *
 * POST /api/v1/user/refresh — refresh token theo đúng mẫu Nguyên đưa (ảnh hệ
 * thống khác): response THÀNH CÔNG chỉ gồm đúng 4 field ở gốc JSON:
 *   { status: true, code: 200, msg: "refresh.success", Authorization: "Bearer <token>" }
 * Toàn bộ logic (kiểm tra origin, đọc cookie HttpOnly, xoay vòng + thu hồi
 * qua refreshTokenService) dùng chung `performRefresh` với
 * POST /api/auth/refresh — endpoint cũ giữ nguyên để tương thích; response
 * lỗi cũng là một (shape `{status:false, code, msg}` của luồng gốc).
 * Client gọi endpoint này theo chu kỳ 20 giây — xem cơ chế interval trong
 * src/services/api.js (startSessionRefreshLoop).
 */
const router = Router();

router.post("/user/refresh", async (req, res) => {
  const token = await performRefresh(req, res);
  if (token === null) return; // performRefresh đã gửi response lỗi
  return res.json({
    status: true,
    code: 200,
    msg: "refresh.success",
    Authorization: `Bearer ${token}`,
  });
});

export default router;
