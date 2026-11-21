import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { getClassHeatmap } from "../services/heatmapService.js";

const router = Router();

// GET /api/heatmap/class/:classId — Bản đồ nhiệt điểm mù của một lớp.
// Chỉ teacher/admin (requireRoles); giáo viên chỉ xem được lớp mình phụ
// trách (heatmapService kiểm tra teacher_classes, admin xem mọi lớp).
// Middleware permission đòi thêm quyền reports.view cho path /heatmap/*.
router.get("/class/:classId", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const data = await getClassHeatmap({ classId: req.params.classId, requester: req.user });
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không tải được bản đồ nhiệt", e.status || 500);
  }
});

export default router;
