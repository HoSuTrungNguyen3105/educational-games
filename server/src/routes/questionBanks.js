import { Router } from "express";
import * as bankService from "../services/questionBankService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";

const router = Router();

// Public read: list all
router.get("/", async (req, res, next) => {
  try {
    const { search, subject, category, limit } = req.query;
    const questions = await bankService.listAll({ search, subject, category, limit: limit ? Number(limit) : 500 });
    const pagination = buildPagination({ total: questions.length });
    sendSuccess(res, questions, "success", pagination);
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
