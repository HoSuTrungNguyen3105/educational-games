/**
 * support.js — API ticket hỗ trợ.
 *
 * · POST  /api/support/tickets               — người dùng đăng nhập gửi yêu cầu
 *     (server tự gán cho GV chủ nhiệm lớp người gửi; không có lớp → admin tổng)
 * · GET   /api/support/tickets/mine          — danh sách ticket của chính mình
 * · GET   /api/support/tickets/assigned      — GV: ticket được gán cho mình;
 *     tài khoản có `support_all` (admin tổng): xem hết của mọi GV
 * · PATCH /api/support/tickets/assigned/:id  — GV trả lời/cập nhật ticket được gán
 * · GET   /api/support/admin/tickets         — admin tổng (support_all) xem toàn bộ
 * · PATCH /api/support/admin/tickets/:id     — admin tổng đổi trạng thái/ưu tiên/trả lời
 * · DELETE /api/support/admin/tickets/:id    — admin tổng xóa ticket
 *
 * Quyền: middleware/permission.js — /admin/ đòi `support_all`, /tickets/assigned
 * đòi `support.view` (route còn lại kiểm tra người được gán), phần còn lại cần
 * quyền cơ bản `profile`.
 */
import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import {
  createTicket,
  listTickets,
  listMyTickets,
  listAssignedTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} from "../services/supportService.js";
import { getRolePermissionsCached } from "../services/permissionService.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

const router = Router();

/** Tài khoản này có "toàn quyền" xem mọi ticket? (quyền `support_all`) */
async function hasAllAccess(role) {
  const perms = await getRolePermissionsCached(role).catch(() => []);
  return perms.includes("support_all");
}

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

// ── Giáo viên được gán / admin tổng ────────────────────────────────────
// GV chỉ thấy ticket của mình; ai có `support_all` (admin tổng) thấy tất cả.
router.get("/tickets/assigned", authenticate, async (req, res, next) => {
  try {
    const data = (await hasAllAccess(req.user.role))
      ? await listTickets()
      : await listAssignedTickets(req.user.sub);
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

// GV trả lời / đổi trạng thái ticket được gán cho mình (admin tổng làm được mọi ticket).
router.patch("/tickets/assigned/:id", authenticate, async (req, res, next) => {
  try {
    const ticket = await getTicket(req.params.id);
    if (!ticket) return sendError(res, "Không tìm thấy ticket", 404);
    const mine = ticket.assigneeId && ticket.assigneeId === req.user.sub;
    if (!mine && !(await hasAllAccess(req.user.role))) {
      return sendError(res, "Ticket này không được gán cho bạn", 403);
    }
    const updated = await updateTicket(req.params.id, req.body || {});
    sendSuccess(res, updated, "Đã cập nhật ticket");
  } catch (e) {
    if (e.message === "Không tìm thấy ticket") return sendError(res, e.message, 404);
    next(e);
  }
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
