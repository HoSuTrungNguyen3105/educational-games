import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { getRemediationPreview, createRemediationPack } from "../services/remediationService.js";

const router = Router();

// GET /api/remediation/preview?classId&topic — xem trước gói can thiệp:
// có bao nhiêu câu CƠ BẢN cùng chủ đề trong ngân hàng sẽ được trích.
// Chỉ teacher/admin; phạm vi lớp do remediationService kiểm tra như
// heatmap. Permission middleware: GET đòi reports.view.
router.get("/preview", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const { classId, topic } = req.query;
    if (!classId || !topic) return sendError(res, "classId và topic là bắt buộc", 400);
    const data = await getRemediationPreview({ classId, topic, requester: req.user });
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không xem trước được gói ôn tập", e.status || 500);
  }
});

// POST /api/remediation/packs { classId, topic, studentIds } — tạo gói
// ôn tập 1 chạm: bài đích danh cho nhóm học sinh + thông báo + nhắc
// lặp lại cách quãng +3/+7 ngày. Permission middleware: POST đòi
// assignments.edit.
router.post("/packs", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const { classId, topic, studentIds } = req.body || {};
    if (!classId || !topic) return sendError(res, "classId và topic là bắt buộc", 400);
    const data = await createRemediationPack({ classId, topic, studentIds, requester: req.user });
    return sendCreated(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không tạo được gói ôn tập", e.status || 500);
  }
});

export default router;
