import { Router } from "express";
import * as gameService from "../services/gameService.js";
import * as configStore from "../services/gameConfigStore.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();

/**
 * GET /api/game-configs/
 * Danh sách key đã lưu trong kho cấu hình độc lập (không kèm values để nhẹ).
 */
router.get("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    sendSuccess(res, await configStore.list());
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/game-configs/:key?gameId=<id>
 *
 * Client đã biết `key` từ /api/games, gọi tiếp endpoint này để lấy đúng
 * values cần hiển thị:
 *  - có gameId → lấy config của game đó (nếu game không dùng key này thì config = null)
 *  - không gameId → lấy config mới nhất trong các game dùng key này
 *  - không có game nào dùng key (game offline, không có document trong `games`)
 *    → đọc kho cấu hình độc lập `game_configs` mà trang admin ghi vào.
 */
router.get("/:key", async (req, res, next) => {
  try {
    const key = String(req.params.key || "").trim();
    if (!key) return sendError(res, "Thiếu key cấu hình", 400);
    const fromGame = await gameService.getConfigByKey(key, req.query.gameId);
    if (fromGame?.config) return sendSuccess(res, fromGame);

    const stored = await configStore.get(key);
    if (!stored) return sendSuccess(res, fromGame);
    sendSuccess(res, {
      key,
      gameId: null,
      source: "store",
      gamesCount: 0,
      config: { key, values: stored.values, updatedAt: stored.updatedAt },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /api/game-configs/:key
 *
 * Admin lưu JSON cấu hình cho game không có document trong `games` (game
 * offline). Body nhận cả hai kiểu:
 *   { values: {...} }                 — khuyên dùng
 *   { config: { key, values } }       — cùng hình với games.config cũ
 * Ghi xong GET lại chính key đó sẽ thấy bản mới (client + game đọc được ngay,
 * không cần build lại frontend).
 */
router.put("/:key", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const key = String(req.params.key || "").trim();
    if (!key) return sendError(res, "Thiếu key cấu hình", 400);
    const body = req.body || {};
    const values = body.values !== undefined ? body.values : (body.config && body.config.values);
    if (values === undefined) return sendError(res, "Thiếu `values` là JSON cấu hình", 400);
    const saved = await configStore.set(key, values, req.user);
    sendSuccess(res, {
      key: saved.key,
      gameId: null,
      source: "store",
      gamesCount: 0,
      config: { key: saved.key, values: saved.values, updatedAt: saved.updatedAt },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
