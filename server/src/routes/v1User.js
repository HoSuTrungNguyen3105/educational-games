import { Router } from "express";
import { performRefresh } from "./auth.js";

/**
 * API v1 phía người dùng.
 *
 * POST /api/v1/user/refresh — refresh token theo đúng mẫu Nguyên đưa (ảnh hệ
 * thống khác): response THÀNH CÔNG gồm 4 field ở gốc JSON:
 *   { status: true, code: 200, msg: "refresh.success", Authorization: "Bearer <token>" }
 * cộng thêm field `refreshToken` (refresh token MỚI sau xoay vòng) ở gốc —
 * client iOS không dùng được cookie bên thứ ba (WebKit chặn) nên giữ token
 * này trong localStorage và gửi lại qua header `x-refresh-token`.
 * Toàn bộ logic (kiểm tra origin, đọc token header/body/cookie, xoay vòng +
 * thu hồi qua refreshTokenService) dùng chung `performRefresh` với
 * POST /api/auth/refresh — endpoint cũ giữ nguyên để tương thích; response
 * lỗi cũng là một (shape `{status:false, code, msg}` của luồng gốc).
 * Client gọi endpoint này theo chu kỳ 20 giây — xem cơ chế interval trong
 * src/services/api.js (startSessionRefreshLoop).
 */
const router = Router();

router.post("/user/refresh", async (req, res) => {
  const result = await performRefresh(req, res);
  if (result === null) return; // performRefresh đã gửi response lỗi
  return res.json({
    status: true,
    code: 200,
    msg: "refresh.success",
    Authorization: `Bearer ${result.token}`,
    refreshToken: result.refreshToken,
  });
});

export default router;
