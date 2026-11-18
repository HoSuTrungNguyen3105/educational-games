import { Router } from "express";
import * as bankService from "../services/questionBankService.js";
import * as setService from "../services/questionSetService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";
import { respondWithRange } from "../utils/rangeList.js";

const router = Router();

// Public read: list all
router.get("/", async (req, res, next) => {
  try {
    // limit mặc định 500 như cũ; trang Ngân hàng câu hỏi cần lấy toàn bộ để dựng
    // ma trận môn × lớp nên cho phép nâng trần tới 5000.
    const { search, subject, category, grade, limit } = req.query;
    const cap = Math.min(5000, Math.max(1, Number(limit) || 500));
    const questions = await bankService.listAll({ search, subject, category, grade, limit: cap });
    if (respondWithRange(req, res, questions)) return;
    const pagination = buildPagination({ total: questions.length });
    sendSuccess(res, questions, "success", pagination);
  } catch (e) { next(e); }
});

// ── Bộ đề (combo đóng gói theo bài) ─────────────────────────────────────
// Các route /sets PHẢI khai báo trước /:id để "sets" không bị hiểu là id
// câu hỏi. Học sinh đã đăng nhập xem + luyện tập được; tạo/sửa/xóa chỉ
// teacher/admin (route chặn role, middleware permission chặn thêm quyền
// question_bank.edit như mọi thao tác ghi của ngân hàng).
const isStaff = (req) => req.user && (req.user.role === "teacher" || req.user.role === "admin");

router.get("/sets", authenticate, async (req, res, next) => {
  try {
    const { subject, grade } = req.query;
    const sets = await setService.listSets({ subject, grade });
    const pagination = buildPagination({ total: sets.length });
    sendSuccess(res, sets, "success", pagination);
  } catch (e) { next(e); }
});

router.get("/sets/:setId", authenticate, async (req, res, next) => {
  try {
    const detail = await setService.getSetWithQuestions(req.params.setId);
    if (!detail) return sendError(res, "Không tìm thấy bộ đề", 404);
    // Học sinh: câu hỏi bị strip correctAnswer theo chuẩn DTO của hệ;
    // teacher/admin xem bản đầy đủ để đối chiếu khi soạn bộ.
    if (!isStaff(req)) {
      detail.questions = detail.questions.map((q) => setService.stripBankQuestion(q));
    }
    sendSuccess(res, detail);
  } catch (e) { next(e); }
});

// Chấm một câu khi học sinh tự luyện cả bộ: server chấm bằng isAnswerCorrect
// dùng chung, đáp án đúng chỉ lộ SAU khi đã trả lời (mẫu /questions/explain-context).
// Không ghi điểm/xu/kết quả — tự luyện thuần túy.
router.post("/sets/:setId/check", authenticate, async (req, res, next) => {
  try {
    const { questionId, answer } = req.body || {};
    if (!questionId) return sendError(res, "questionId là bắt buộc", 400);
    if (answer != null && typeof answer !== "string" && typeof answer !== "number") {
      return sendError(res, "answer phải là chuỗi hoặc số", 400);
    }
    const result = await setService.checkAnswer(req.params.setId, questionId, answer ?? null);
    if (!result) return sendError(res, "Không tìm thấy bộ đề hoặc câu hỏi không thuộc bộ", 404);
    sendSuccess(res, result);
  } catch (e) { next(e); }
});

router.post("/sets", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const created = await setService.createSet(req.user.sub, req.body || {});
    sendSuccess(res, created, "Đã tạo bộ đề");
  } catch (e) { next(e); }
});

router.put("/sets/:setId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const updated = await setService.updateSet(req.params.setId, req.body || {});
    if (!updated) return sendError(res, "Không tìm thấy bộ đề", 404);
    sendSuccess(res, updated, "Đã cập nhật bộ đề");
  } catch (e) { next(e); }
});

router.delete("/sets/:setId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const ok = await setService.removeSet(req.params.setId);
    if (!ok) return sendError(res, "Không tìm thấy bộ đề", 404);
    sendSuccess(res, { ok: true }, "Đã xóa bộ đề (câu hỏi trong ngân hàng vẫn còn nguyên)");
  } catch (e) { next(e); }
});

router.get("/stats", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const stats = await bankService.getStats();
    sendSuccess(res, stats);
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const q = await bankService.getById(req.params.id);
    if (!q) return sendError(res, "Không tìm thấy câu hỏi", 404);
    sendSuccess(res, q);
  } catch (e) { next(e); }
});

router.post("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const q = await bankService.create(req.body);
    sendSuccess(res, q, "Đã tạo câu hỏi trong bank");
  } catch (e) { next(e); }
});

router.post("/bulk", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { questions, mode } = req.body || {};
    const out = await bankService.createMany(questions, { mode: mode === "replace" ? "replace" : "merge" });
    sendSuccess(res, out, `Đã nhập ${out.created} câu${out.skipped ? `, bỏ qua ${out.skipped}` : ""}`);
  } catch (e) { next(e); }
});

router.put("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const updated = await bankService.update(req.params.id, req.body);
    if (!updated) return sendError(res, "Không tìm thấy câu hỏi", 404);
    sendSuccess(res, updated, "Đã cập nhật và đồng bộ tới các game liên kết");
  } catch (e) { next(e); }
});

router.delete("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const count = await bankService.removeAll();
    sendSuccess(res, { deleted: count }, `Đã xóa ${count} câu hỏi`);
  } catch (e) { next(e); }
});

router.delete("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const ok = await bankService.remove(req.params.id);
    if (!ok) return sendError(res, "Không tìm thấy câu hỏi", 404);
    sendSuccess(res, { ok: true }, "Đã xóa");
  } catch (e) { next(e); }
});

// Bulk link — đặt trước :bankId để tránh match nhầm
router.post("/bulk-link", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { bankIds, gameId } = req.body;
    if (!Array.isArray(bankIds) || !gameId) return sendError(res, "bankIds (array) và gameId là bắt buộc", 400);
    const results = await bankService.bulkLinkToGame(bankIds, gameId);
    sendSuccess(res, results);
  } catch (e) { next(e); }
});

// Link a bank question to a game (clone with bankId)
router.post("/:bankId/link/:gameId", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const doc = await bankService.linkToGame(req.params.bankId, req.params.gameId);
    sendSuccess(res, doc, "Đã thêm câu hỏi từ bank vào game");
  } catch (e) { next(e); }
});

// Manual sync
router.post("/:id/sync", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const r = await bankService.syncToGames(req.params.id);
    sendSuccess(res, r, `Đã đồng bộ tới ${r.modified} câu hỏi trong games`);
  } catch (e) { next(e); }
});

export default router;
