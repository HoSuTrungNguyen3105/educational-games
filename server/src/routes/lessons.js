import { Router } from "express";
import * as lessonService from "../services/lessonService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError, buildPagination } from "../utils/response.js";

// Bài học EduPlay AI Studio (collection `lessons`, model trang/phần tử JSON).
// Hai bề mặt tách bạch:
//   • Giáo viên (teacher/admin): CRUD + publish — chỉ chủ sở hữu (service
//     kiểm tra ownerId, admin ngoại lệ). Bản chi tiết phía này GỒM
//     correctAnswer để giáo viên soạn/sửa.
//   • Học sinh (mọi role đã đăng nhập): chỉ bài đã published, DTO đã lọc
//     sạch correctAnswer ở mọi cấp (lessonService.stripAnswers).
const router = Router();

const actorOf = (req) => ({ id: req.user.sub, role: req.user.role });

// Lỗi publish mang theo danh sách lỗi cụ thể theo trang/phần tử (§15) →
// trả trong data.errors thay vì chỉ một message chung.
function handleError(res, e) {
  const code = e.status || 400;
  if (Array.isArray(e.errors)) {
    return res.status(code).json({
      status: false, code, msg: e.message, data: { errors: e.errors },
    });
  }
  return sendError(res, e.message, code);
}

// ── Phía học sinh: danh sách + chi tiết bài đã published ────────────────
// Khai báo TRƯỚC /:id để "published"/"mine" không bị nuốt vào :id.
router.get("/published", authenticate, async (req, res) => {
  try {
    const { search, subject, grade, page, perPage } = req.query;
    const { items, total } = await lessonService.listPublishedLessons({ search, subject, grade, page, perPage });
    sendSuccess(res, items, "success",
      buildPagination({ page, perPage, total, keyword: search || "" }));
  } catch (e) { handleError(res, e); }
});

router.get("/published/:id", authenticate, async (req, res) => {
  try {
    const lesson = await lessonService.getPublishedLessonForStudent(req.params.id);
    if (!lesson) return sendError(res, "Không tìm thấy bài học", 404);
    sendSuccess(res, lesson);
  } catch (e) { handleError(res, e); }
});

// ── Phía giáo viên: bài của tôi ──────────────────────────────────────────
router.get("/mine", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const { search, status, page, perPage } = req.query;
    const { items, total } = await lessonService.listMyLessons(req.user.sub, { search, status, page, perPage });
    sendSuccess(res, items, "success",
      buildPagination({ page, perPage, total, keyword: search || "" }));
  } catch (e) { handleError(res, e); }
});

router.post("/", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(req.user.sub, req.body || {});
    sendCreated(res, lesson, "Đã tạo bài học");
  } catch (e) { handleError(res, e); }
});

router.get("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const lesson = await lessonService.getLessonForOwner(req.params.id, actorOf(req));
    sendSuccess(res, lesson);
  } catch (e) { handleError(res, e); }
});

router.put("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const lesson = await lessonService.updateLesson(req.params.id, actorOf(req), req.body || {});
    sendSuccess(res, lesson, "Đã cập nhật bài học");
  } catch (e) { handleError(res, e); }
});

router.delete("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const out = await lessonService.deleteLesson(req.params.id, actorOf(req));
    sendSuccess(res, out, "Đã xoá bài học");
  } catch (e) { handleError(res, e); }
});

router.post("/:id/publish", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const lesson = await lessonService.publishLesson(req.params.id, actorOf(req));
    sendSuccess(res, lesson, "Đã xuất bản bài học");
  } catch (e) { handleError(res, e); }
});

router.post("/:id/unpublish", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const lesson = await lessonService.unpublishLesson(req.params.id, actorOf(req));
    sendSuccess(res, lesson, "Đã gỡ xuất bản bài học");
  } catch (e) { handleError(res, e); }
});

export default router;
