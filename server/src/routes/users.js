import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { createUser, listUsers, removeUser, resetPassword } from "../services/authService.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.use(authenticate);
router.use(requireRoles("teacher", "admin"));

router.get("/", async (_req, res, next) => {
  try {
    const data = await listUsers();
    const pagination = buildPagination({ total: data.length });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await createUser(req.body || {});
    sendCreated(res, user);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await removeUser(req.params.id);
    sendNoContent(res);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.patch("/:id/reset-password", async (req, res, next) => {
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
