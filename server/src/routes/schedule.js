import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as scheduleService from "../services/scheduleService.js";

// ── Lịch học: /api/schedule ───────────────────────────────────────────────
// GET    /        lịch tuần: của mình + của lớp mình học/dạy
// POST   /        thêm buổi học { title, subject?, weekday 1-7, startTime,
//                 endTime, note?, classId? } — classId chỉ giáo viên của lớp
//                 hoặc admin mới dùng được (service kiểm tra).
// PUT    /:id     sửa buổi học (chủ sở hữu / giáo viên của lớp / admin)
// DELETE /:id     xóa buổi học (cùng điều kiện như sửa)

const router = Router();
router.use(authenticate);

function fail(res, e) {
  return sendError(res, e.message || "Thao tác thất bại", e.status || 400);
}

router.get("/", async (req, res, next) => {
  try {
    sendSuccess(res, await scheduleService.listForUser(req.user));
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res) => {
  try {
    sendSuccess(res, await scheduleService.createEntry(req.user, req.body || {}));
  } catch (e) {
    return fail(res, e);
  }
});

router.put("/:id", async (req, res) => {
  try {
    sendSuccess(res, await scheduleService.updateEntry(req.user, req.params.id, req.body || {}));
  } catch (e) {
    return fail(res, e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    sendSuccess(res, await scheduleService.deleteEntry(req.user, req.params.id));
  } catch (e) {
    return fail(res, e);
  }
});

export default router;
