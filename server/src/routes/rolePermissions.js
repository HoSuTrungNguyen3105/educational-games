import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import {
  listRolePermissions,
  grantRolePermissions,
  syncRolePermissions,
  revokeRolePermissions,
} from "../services/permissionService.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";
import { parseRange, sliceRange, sendRangedList } from "../utils/rangeList.js";
import { record as audit, AUDIT } from "../services/auditService.js";

const router = Router();

router.use(authenticate);

function fail(res, e) {
  return sendError(res, e.message, e.statusCode || 400);
}

// GET /api/rolePermissions?role_id=&page=&per_page=
//   — chỉ quyền của đúng vai trò được hỏi (kèm thông tin vai trò + quyền +
//   module). role_id chấp nhận id số (như GET /api/roles), id document
//   hoặc slug của vai trò. Hỗ trợ thêm ?from=&to= theo hợp đồng rangeList.
router.get("/", requireRoles("admin", "teacher"), async (req, res, next) => {
  try {
    const ref = req.query.role_id ?? req.query.roleId ?? req.query.role;
    if (ref == null || String(ref).trim() === "") {
      return sendError(res, "Thiếu tham số role_id", 400);
    }
    const range = parseRange(req.query);
    if (range.present && range.error) return sendError(res, range.error, 400);
    if (range.present) {
      const all = await listRolePermissions(ref, { page: 1, per_page: 500 });
      // Tổng số có thể vượt 500 nếu vai trò có rất nhiều quyền — lấy đủ
      // theo total trước khi cắt đoạn.
      const full = all.total > all.data.length
        ? await listRolePermissions(ref, { page: 1, per_page: all.total })
        : all;
      return sendRangedList(res, sliceRange(full.data, range), range, full.total);
    }
    const { data, total, page, perPage } = await listRolePermissions(ref, req.query);
    sendSuccess(res, data, "success", buildPagination({ page, perPage, total }));
  } catch (e) {
    if (e.statusCode) return fail(res, e);
    next(e);
  }
});

// POST /api/rolePermissions { role_id, permission_ids[] } — gán thêm quyền
// (cặp đã có thì bỏ qua, unique index chống trùng).
router.post("/", requireRoles("admin"), async (req, res, next) => {
  try {
    const { role_id, roleId, permission_ids, permissionIds } = req.body || {};
    const data = await grantRolePermissions(role_id ?? roleId, permission_ids ?? permissionIds);
    audit({ req, action: AUDIT.ROLE_PERMISSIONS_GRANT, target: data.role_slug, message: `Gán thêm ${data.added} quyền (tổng ${data.total_permissions})` }).catch(() => {});
    sendSuccess(res, data, "Đã gán quyền cho vai trò");
  } catch (e) {
    if (e.statusCode) return fail(res, e);
    next(e);
  }
});

// PUT /api/rolePermissions/:roleId { permission_ids[] } — đồng bộ TOÀN BỘ
// tập quyền của vai trò theo danh sách gửi lên (thêm mới + gỡ phần thiếu).
router.put("/:roleId", requireRoles("admin"), async (req, res, next) => {
  try {
    const { permission_ids, permissionIds } = req.body || {};
    const data = await syncRolePermissions(req.params.roleId, permission_ids ?? permissionIds);
    audit({ req, action: AUDIT.ROLE_PERMISSIONS_SYNC, target: data.role_slug, message: `Đồng bộ quyền: +${data.added} / -${data.removed} (tổng ${data.total_permissions})` }).catch(() => {});
    sendSuccess(res, data, "Đã đồng bộ quyền của vai trò");
  } catch (e) {
    if (e.statusCode) return fail(res, e);
    next(e);
  }
});

// DELETE /api/rolePermissions { role_id, permission_ids[] } — thu hồi quyền
// (quyền cơ bản không thu hồi được, xem permissionService).
router.delete("/", requireRoles("admin"), async (req, res, next) => {
  try {
    const { role_id, roleId, permission_ids, permissionIds } = req.body || {};
    const data = await revokeRolePermissions(role_id ?? roleId, permission_ids ?? permissionIds);
    audit({ req, action: AUDIT.ROLE_PERMISSIONS_REVOKE, target: data.role_slug, message: `Thu hồi ${data.removed} quyền (tổng còn ${data.total_permissions})` }).catch(() => {});
    sendSuccess(res, data, "Đã thu hồi quyền của vai trò");
  } catch (e) {
    if (e.statusCode) return fail(res, e);
    next(e);
  }
});

export default router;
