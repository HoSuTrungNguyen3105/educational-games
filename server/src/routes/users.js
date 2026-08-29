import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { createUser, listUsers, removeUser, resetPassword, updateUserRole, updateUser } from "../services/authService.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const data = await listUsers();
    const pagination = buildPagination({ total: data.length });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (role === "admin" && req.user.role !== "admin") {
      return sendError(res, "Chỉ quản trị mới có thể tạo tài khoản quản trị", 403);
    }
    const user = await createUser(req.body || {});
    sendCreated(res, user);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.patch("/:id/role", requireRoles("admin"), async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (!role) return sendError(res, "role là bắt buộc", 400);
    const user = await updateUserRole(req.params.id, role);
    sendSuccess(res, user, "Đã cập nhật vai trò");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.patch("/:id", requireRoles("admin"), async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body || {});
    sendSuccess(res, user, "Đã cập nhật người dùng");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.delete("/:id", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await removeUser(req.params.id);
    sendNoContent(res);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.patch("/:id/reset-password", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword) return sendError(res, "newPassword là bắt buộc", 400);
    await resetPassword(req.params.id, newPassword);
    sendSuccess(res, { ok: true }, "Đã đổi mật khẩu thành công");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

export default router;
