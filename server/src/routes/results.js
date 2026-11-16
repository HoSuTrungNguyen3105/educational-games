import { Router } from "express";
import * as resultService from "../services/resultService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError, buildPagination } from "../utils/response.js";

const router = Router();

// DELETE /api/results/orphans — dọn phiếu kết quả gắn game đã bị xoá khỏi
// thư viện (kể cả gameId rỗng/slug seed cũ). Chỉ admin; trước đây hệ thống
// không có endpoint xoá results nào nên admin không dọn được dữ liệu này.
router.delete("/orphans", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const { deletedCount, scanned } = await resultService.deleteOrphans();
    sendSuccess(res, { deletedCount, scanned }, `Đã xoá ${deletedCount} phiếu kết quả mồ côi`);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = await resultService.listAll();
    const pagination = buildPagination({ total: data.length });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/game/:gameId", async (req, res, next) => {
  try {
    const data = await resultService.listByGame(req.params.gameId);
    const pagination = buildPagination({ total: data.length });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const entry = await resultService.submit(req.body);
    sendCreated(res, entry);
  } catch (e) {
    next(e);
  }
});

export default router;
