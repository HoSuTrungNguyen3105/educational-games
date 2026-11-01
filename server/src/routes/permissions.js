import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getUserCounts,
  listPermissionsPaged,
  seedAllAccessPermissions,
  PERMISSION_FEATURES,
  PERMISSION_CATALOG,
} from "../services/permissionService.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.use(authenticate);

// GET /api/permissions — danh sách quyền hạn phẳng, phân trang kiểu HiWeb:
//   ?page=1&perPage=10&keyword=&sort_by=&sort_dir=&from_date=&to_date=&date_col=created_at
// Mỗi bản ghi: { id, slug, name_vi, name_en, module, created_at, updated_at }
// (route cũ /catalog vẫn giữ cho modal ma trận quyền.)
router.get("/", requireRoles("admin", "teacher"), async (req, res, next) => {
  try {
    const q = req.query || {};
    const { data, total, page, perPage } = await listPermissionsPaged(q);
    sendSuccess(res, data, "success", buildPagination({
      page,
      perPage,
      total,
      keyword: String(q.keyword || "").trim(),
      sortBy: String(q.sort_by || "").trim(),
      sortDir: String(q.sort_dir || "DESC"),
      fromDate: String(q.from_date || "").trim(),
      toDate: String(q.to_date || "").trim(),
      dateCol: String(q.date_col || "created_at"),
    }));
  } catch (e) {
    next(e);
  }
});

// POST /api/permissions/all — admin tạo/seed các quyền `<module>_all` (toàn
// quyền, chỉ admin tổng có) vào collection `permissions`. Chạy lại không sao cả
// (idempotent) — thiếu slug nào chèn slug đó.
router.post("/all", requireRoles("admin"), async (_req, res, next) => {
  try {
    const data = await seedAllAccessPermissions();
    sendSuccess(res, data, `Đã có ${data.seeded}/${data.total} quyền toàn truy cập (_all)`);
  } catch (e) {
    next(e);
  }
});

// GET /api/permissions/features — permission matrix feature definitions
router.get("/features", requireRoles("admin", "teacher"), (_req, res) => {
  sendSuccess(res, PERMISSION_FEATURES);
});

// GET /api/permissions/catalog — flat permission catalog for role detail modal
router.get("/catalog", requireRoles("admin", "teacher"), (_req, res) => {
  sendSuccess(res, PERMISSION_CATALOG);
});

// GET /api/permissions/roles — list roles + account counts + matrix
router.get("/roles", requireRoles("admin", "teacher"), async (_req, res, next) => {
  try {
    const data = await listRoles();
    sendSuccess(res, data, "success", buildPagination({ total: data.length }));
  } catch (e) {
    next(e);
  }
});

// GET /api/permissions/roles/:key — one role
router.get("/roles/:key", requireRoles("admin", "teacher"), async (req, res, next) => {
  try {
    const role = await getRole(req.params.key);
    if (!role) return sendError(res, "Không tìm thấy vai trò", 404);
    sendSuccess(res, role);
  } catch (e) {
    next(e);
  }
});

// GET /api/permissions/counts — { admin: n, teacher: n, ... }
router.get("/counts", requireRoles("admin", "teacher"), async (_req, res, next) => {
  try {
    const data = await getUserCounts();
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

// POST /api/permissions/roles — create custom role
router.post("/roles", requireRoles("admin"), async (req, res, next) => {
  try {
    const role = await createRole(req.body || {});
    sendCreated(res, role, "Đã tạo vai trò");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// PUT /api/permissions/roles/:key — update label / matrix / dashboardAccess
router.put("/roles/:key", requireRoles("admin"), async (req, res, next) => {
  try {
    const role = await updateRole(req.params.key, req.body || {});
    sendSuccess(res, role, "Đã cập nhật vai trò");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// PATCH alias (some clients use PATCH)
router.patch("/roles/:key", requireRoles("admin"), async (req, res, next) => {
  try {
    const role = await updateRole(req.params.key, req.body || {});
    sendSuccess(res, role, "Đã cập nhật vai trò");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// DELETE /api/permissions/roles/:key — delete custom role only
router.delete("/roles/:key", requireRoles("admin"), async (req, res, next) => {
  try {
    await deleteRole(req.params.key);
    sendNoContent(res);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

export default router;
