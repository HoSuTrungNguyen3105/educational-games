import { Router } from "express";
import * as gameService from "../services/gameService.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();

/**
 * GET /api/game-configs/:key?gameId=<id>
 *
 * Client đã biết `key` từ /api/games, gọi tiếp endpoint này để lấy đúng
 * values cần hiển thị:
 *  - có gameId → lấy config của game đó (nếu game không dùng key này thì config = null)
 *  - không gameId → lấy config mới nhất trong các game dùng key này
 */
router.get("/:key", async (req, res, next) => {
  try {
    const key = String(req.params.key || "").trim();
    if (!key) return sendError(res, "Thiếu key cấu hình", 400);
    sendSuccess(res, await gameService.getConfigByKey(key, req.query.gameId));
  } catch (e) {
    next(e);
  }
});

export default router;