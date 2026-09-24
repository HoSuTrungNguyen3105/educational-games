import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getUserCounts,
  PERMISSION_FEATURES,
} from "../services/permissionService.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.use(authenticate);

// GET /api/permissions/features — permission matrix feature definitions
router.get("/features", requireRoles("admin", "teacher"), (_req, res) => {
  sendSuccess(res, PERMISSION_FEATURES);
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
