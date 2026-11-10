import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { createUser, listUsers, removeUser, removeUsersBulk, BULK_DELETE_MAX_IDS, resetPassword, updateUserRole, updateUser } from "../services/authService.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";
import { record as audit, AUDIT } from "../services/auditService.js";

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
    audit({ req, action: AUDIT.USER_CREATE, target: user?.username || req.params.id || "", message: `Tạo tài khoản ${user?.role || role || ""}` }).catch(() => {});
    sendCreated(res, user);
  } catch (e) {
    audit({ req, action: AUDIT.USER_CREATE, target: req.body?.username || "", result: "fail", message: e.message }).catch(() => {});
    sendError(res, e.message, 400);
  }
});

router.patch("/:id/role", requireRoles("admin"), async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (!role) return sendError(res, "role là bắt buộc", 400);
    const user = await updateUserRole(req.params.id, role);
    audit({ req, action: AUDIT.USER_ROLE, target: user?.username || req.params.id, message: `Đổi vai trò thành ${role}` }).catch(() => {});
    sendSuccess(res, user, "Đã cập nhật vai trò");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.patch("/:id", requireRoles("admin"), async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body || {});
    // Chỉ ghi TÊN field thay đổi — body có thể chứa email/mật khẩu.
    audit({ req, action: AUDIT.USER_UPDATE, target: user?.username || req.params.id, meta: { fields: Object.keys(req.body || {}) } }).catch(() => {});
    sendSuccess(res, user, "Đã cập nhật người dùng");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// Xóa HÀNG LOẠT tài khoản rác theo danh sách id — CHỈ admin (xóa đơn lẻ ở
// dưới vẫn cho teacher như cũ). PHẢI khai báo TRƯỚC "/:id" để "bulk" không
// bị nuốt thành một id. Body: { ids: string[] } (tối đa BULK_DELETE_MAX_IDS).
// Từng id độc lập: tự xóa mình / tài khoản admin / id không tồn tại chỉ vào
// danh sách `failed`, không làm hỏng cả batch. Ghi audit MỘT bản ghi/batch.
router.delete("/bulk", requireRoles("admin"), async (req, res, next) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0 || ids.some((x) => typeof x !== "string" || !x.trim())) {
      return sendError(res, "ids phải là mảng chuỗi id không rỗng", 400);
    }
    if (ids.length > BULK_DELETE_MAX_IDS) {
      return sendError(res, `Tối đa ${BULK_DELETE_MAX_IDS} id mỗi lần xóa`, 400);
    }
    const { deleted, failed } = await removeUsersBulk(ids.map((x) => x.trim()), { selfId: req.user.sub });
    audit({
      req, action: AUDIT.USER_BULK_DELETE, target: "users/bulk",
      message: `Xóa hàng loạt: ${deleted.length} thành công, ${failed.length} thất bại`,
      meta: { deletedIds: deleted, deletedCount: deleted.length, failedCount: failed.length },
    }).catch(() => {});
    sendSuccess(res, { deleted, failed, deletedCount: deleted.length, failedCount: failed.length }, "Đã xử lý xóa hàng loạt");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.delete("/:id", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await removeUser(req.params.id);
    audit({ req, action: AUDIT.USER_DELETE, target: req.params.id, message: "Xóa tài khoản" }).catch(() => {});
    sendNoContent(res);
  } catch (e) {
    audit({ req, action: AUDIT.USER_DELETE, target: req.params.id, result: "fail", message: e.message }).catch(() => {});
    sendError(res, e.message, 400);
  }
});

router.patch("/:id/reset-password", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword) return sendError(res, "newPassword là bắt buộc", 400);
    await resetPassword(req.params.id, newPassword);
    // Mật khẩu mới KHÔNG bao giờ được ghi vào nhật ký.
    audit({ req, action: AUDIT.USER_RESET_PASSWORD, target: req.params.id, message: "Đặt lại mật khẩu cho người dùng" }).catch(() => {});
    sendSuccess(res, { ok: true }, "Đã đổi mật khẩu thành công");
  } catch (e) {
    audit({ req, action: AUDIT.USER_RESET_PASSWORD, target: req.params.id, result: "fail", message: e.message }).catch(() => {});
    sendError(res, e.message, 400);
  }
});

export default router;
