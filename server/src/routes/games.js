import { Router } from "express";
import * as gameService from "../services/gameService.js";
import * as questionService from "../services/questionService.js";
import * as gameVersionService from "../services/gameVersionService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.post("/answer", async (req, res, next) => {
  try {
    const { questionId, answerId } = req.body;
    if (!questionId || !answerId) {
      return sendError(res, "questionId và answerId là bắt buộc", 400);
    }
    const question = await questionService.getById(questionId);
    if (!question) {
      return sendError(res, "Không tìm thấy câu hỏi", 404);
    }
    const isCorrect = question.correctAnswer === answerId;
    sendSuccess(res, { correct: isCorrect, points: isCorrect ? (question.points || 0) : 0, correctAnswer: question.correctAnswer });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { items, total, from, to } = await gameService.list(req.query);
    const pagination = buildPagination({
      page: req.query.page, perPage: req.query.per_page, total,
      keyword: req.query.query || "", sortBy: req.query.sort_by || "",
      sortDir: req.query.sort_dir || "DESC",
    });
    pagination.from = from;
    pagination.to = to;
    sendSuccess(res, items, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/code/:code", async (req, res, next) => {
  try {
    const game = await gameService.getByCode(req.params.code);
    if (!game) return sendError(res, "Không tìm thấy trò chơi", 404);
    sendSuccess(res, game);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const game = await gameService.get(req.params.id);
    if (!game) return sendError(res, "Không tìm thấy trò chơi", 404);
    sendSuccess(res, game);
  } catch (e) {
    next(e);
  }
});

// Phiên bản mới nhất — công khai vì client chơi game cần check update (GĐ4).
// Chưa publish lần nào → { version: 0, publishedAt: null }.
router.get("/:id/version", async (req, res, next) => {
  try {
    sendSuccess(res, await gameVersionService.getInfo(req.params.id));
  } catch (e) {
    next(e);
  }
});

// Dữ liệu chơi được (config + questions, đã strip correctAnswer) — công khai
// cho học sinh load/cache offline (GĐ3). Ưu tiên bản publish, chưa có thì bản live.
router.get("/:id/data", async (req, res, next) => {
  try {
    const data = await gameVersionService.getData(req.params.id);
    if (!data) return sendError(res, "Không tìm thấy trò chơi", 404);
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/publish", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const info = await gameVersionService.publish(req.params.id, req.user);
    sendCreated(res, info, `Đã xuất bản phiên bản ${info.version}`);
  } catch (e) {
    next(e);
  }
});

router.get("/:id/versions", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    sendSuccess(res, await gameVersionService.listVersions(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.get("/:id/versions/:version", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const snap = await gameVersionService.getVersion(req.params.id, req.params.version);
    if (!snap) return sendError(res, "Không tìm thấy phiên bản", 404);
    sendSuccess(res, snap);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/versions/:version/restore", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const info = await gameVersionService.restore(req.params.id, req.params.version, req.user);
    sendSuccess(res, info, `Đã khôi phục phiên bản ${req.params.version} thành phiên bản ${info.version}`);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.create(req.body);
    sendCreated(res, game);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.update(req.params.id, req.body);
    sendSuccess(res, game);
  } catch (e) {
    next(e);
  }
});

// Bước 2 của luồng cấu hình: /api/games chỉ trả key, endpoint này trả values.
// Công khai (không cần token) vì học sinh cũng cần config để chơi đúng logic game.
router.get("/:id/config", async (req, res, next) => {
  try {
    const payload = await gameService.getConfig(req.params.id);
    if (!payload) return sendError(res, "Không tìm thấy trò chơi", 404);
    sendSuccess(res, payload);
  } catch (e) {
    next(e);
  }
});

router.put("/:id/config", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { config } = req.body || {};
    if (config === undefined || config === null) {
      return sendError(res, "Thiếu dữ liệu config", 400);
    }
    const game = await gameService.updateConfig(req.params.id, config);
    sendSuccess(res, game);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/duplicate", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const game = await gameService.duplicate(req.params.id);
    sendCreated(res, game);
  } catch (e) {
    next(e);
  }
});

router.delete("/", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const result = await gameService.removeAll();
    sendSuccess(res, result, `Đã xóa ${result.deleted} trò chơi`);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await gameService.remove(req.params.id);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
});

export default router;
