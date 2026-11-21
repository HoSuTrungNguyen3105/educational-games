import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { respondWithRange } from "../utils/rangeList.js";
import {
  listEvents,
  createEvent,
  updateEvent,
  setEventEnabled,
  deleteEvent,
  getEventOr404,
  computeLeaderboard,
  finalizeEventByAdmin,
  getActiveEventsForStudent,
  getEventForStudent,
  listTopicKeys,
} from "../services/eventService.js";

const router = Router();

// ── Phía admin (chỉ admin — route requireRoles("admin") chốt cuối,
// permission middleware đòi thêm quyền events.manage cho /events/admin) ──

// GET /api/events/admin — danh sách mọi sự kiện (hỗ trợ ?from=&to= như
// các trang quản trị khác qua helper dùng chung rangeList).
router.get("/admin", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const items = await listEvents();
    if (respondWithRange(req, res, items)) return;
    return sendSuccess(res, items);
  } catch (e) {
    return sendError(res, e.message || "Không tải được danh sách sự kiện", e.status || 500);
  }
});

// GET /api/events/admin/topics — khoá chủ đề THẬT suy từ games hiện có,
// để form tạo cột mốc "ván theo chủ đề" chọn đúng giá trị đo được.
router.get("/admin/topics", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    return sendSuccess(res, await listTopicKeys());
  } catch (e) {
    return sendError(res, e.message || "Không tải được danh sách chủ đề", e.status || 500);
  }
});

// POST /api/events/admin — tạo sự kiện mới.
router.post("/admin", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const requesterId = req.user?.sub || req.user?.id;
    const data = await createEvent(req.body || {}, requesterId);
    return sendCreated(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không tạo được sự kiện", e.status || 500);
  }
});

// PUT /api/events/admin/:id — sửa sự kiện (đã tổng kết thì bị giới hạn
// ở eventService: chỉ sửa được tên/mô tả/bật-tắt).
router.put("/admin/:id", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const data = await updateEvent(req.params.id, req.body || {});
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không sửa được sự kiện", e.status || 500);
  }
});

// PATCH /api/events/admin/:id/enabled { enabled } — công tắc bật/tắt
// realtime: học sinh thấy/không thấy ngay ở lần tải tiếp theo.
router.patch("/admin/:id/enabled", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const data = await setEventEnabled(req.params.id, req.body?.enabled);
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không đổi được trạng thái sự kiện", e.status || 500);
  }
});

// DELETE /api/events/admin/:id — xoá sự kiện + sổ thưởng của nó.
router.delete("/admin/:id", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const data = await deleteEvent(req.params.id);
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không xoá được sự kiện", e.status || 500);
  }
});

// GET /api/events/admin/:id/leaderboard — bảng xếp hạng: đã tổng kết thì
// trả snapshot đã chốt, chưa thì tính trực tiếp từ results thật.
router.get("/admin/:id/leaderboard", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const ev = await getEventOr404(req.params.id);
    const leaderboard =
      ev.finalizedAt && Array.isArray(ev.finalLeaderboard)
        ? ev.finalLeaderboard
        : await computeLeaderboard(ev);
    return sendSuccess(res, { event: { id: ev.id, name: ev.name, finalizedAt: ev.finalizedAt || null }, leaderboard });
  } catch (e) {
    return sendError(res, e.message || "Không tải được bảng xếp hạng sự kiện", e.status || 500);
  }
});

// POST /api/events/admin/:id/finalize — tổng kết tay (chỉ khi đã kết
// thúc): trao phần thưởng chưa nhận + chốt snapshot. Processor nền
// processEndedEvents dùng chung finalizeEvent cho sự kiện đến hạn.
router.post("/admin/:id/finalize", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const data = await finalizeEventByAdmin(req.params.id);
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không tổng kết được sự kiện", e.status || 500);
  }
});

// ── Phía học sinh ────────────────────────────────────────────────────────
// GET /api/events/active — sự kiện đang chạy thuộc phạm vi của mình,
// kèm tiến độ của mình + xếp hạng rút gọn. Đạt mốc ở lần đọc này thì
// server trao thưởng ngay (grant-on-read trong eventService).
router.get("/active", authenticate, requireRoles("student", "admin"), async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const data = await getActiveEventsForStudent(userId);
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không tải được sự kiện đang chạy", e.status || 500);
  }
});

// GET /api/events/:id — chi tiết một sự kiện thuộc phạm vi của mình
// (tiến độ từng cột mốc + bảng xếp hạng đầy đủ).
router.get("/:id", authenticate, requireRoles("student", "admin"), async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const data = await getEventForStudent(req.params.id, userId);
    return sendSuccess(res, data);
  } catch (e) {
    return sendError(res, e.message || "Không tải được chi tiết sự kiện", e.status || 500);
  }
});

export default router;
