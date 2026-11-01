/**
 * support.js — API ticket hỗ trợ.
 *
 * · POST /api/support/tickets            — người dùng đăng nhập gửi yêu cầu
 * · GET  /api/support/tickets/mine       — danh sách ticket của chính mình
 * · GET  /api/support/admin/tickets      — admin xem toàn bộ
 * · PATCH /api/support/admin/tickets/:id — admin đổi trạng thái/ưu tiên/trả lời
 * · DELETE /api/support/admin/tickets/:id — admin xóa ticket
 *
 * Quyền: route công khai với mọi tài khoản đăng nhập (quyền `profile` trong
 * middleware/permission.js), nhóm /admin/ chỉ role admin (requireRoles).
 */
import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import {
  createTicket,
  listTickets,
  listMyTickets,
  updateTicket,
  deleteTicket,
} from "../services/supportService.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

const router = Router();

// ── Người dùng ──────────────────────────────────────────────────────────
router.post("/tickets", authenticate, async (req, res, next) => {
  try {
    const { title, content, priority } = req.body || {};
    if (!String(title || "").trim() || !String(content || "").trim()) {
      return sendError(res, "Tiêu đề và nội dung là bắt buộc", 400);
    }
    const ticket = await createTicket({ title, content, priority, user: req.user });
    sendCreated(res, ticket, "Đã gửi yêu cầu hỗ trợ");
  } catch (e) { next(e); }
});

router.get("/tickets/mine", authenticate, async (req, res, next) => {
  try {
    const data = await listMyTickets(req.user.sub);
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

// ── Admin ───────────────────────────────────────────────────────────────
router.get("/admin/tickets", authenticate, requireRoles("admin"), async (_req, res, next) => {
  try {
    const data = await listTickets();
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.patch("/admin/tickets/:id", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const ticket = await updateTicket(req.params.id, req.body || {});
    sendSuccess(res, ticket, "Đã cập nhật ticket");
  } catch (e) {
    if (e.message === "Không tìm thấy ticket") return sendError(res, e.message, 404);
    sendError(res, e.message, 400);
  }
});

router.delete("/admin/tickets/:id", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    await deleteTicket(req.params.id);
    sendSuccess(res, { id: req.params.id }, "Đã xóa ticket");
  } catch (e) {
    if (e.message === "Không tìm thấy ticket") return sendError(res, e.message, 404);
    next(e);
  }
});

export default router;
