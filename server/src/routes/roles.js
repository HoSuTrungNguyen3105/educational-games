import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { listRolesPaged } from "../services/permissionService.js";
import { sendSuccess, buildPagination } from "../utils/response.js";

const router = Router();

router.use(authenticate);

// GET /api/roles — danh sách vai trò dạng phẳng, phân trang kiểu HiWeb:
//   ?page=1&perPage=10&keyword=&sort_by=created_at&sort_dir=DESC&from_date=&to_date=&date_col=created_at
// Mỗi bản ghi: { id, slug, name_vi, name_en, created_at, updated_at, total_permissions }
// (route cũ GET /api/permissions/roles vẫn giữ cho trang ma trận quyền.)
router.get("/", requireRoles("admin", "teacher"), async (req, res, next) => {
  try {
    const q = req.query || {};
    const { data, total, page, perPage } = await listRolesPaged(q);
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

export default router;
