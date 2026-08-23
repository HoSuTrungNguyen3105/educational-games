import { Router } from "express";
import * as setupService from "../services/setupService.js";
import * as gameService from "../services/api.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.get("/templates", async (req, res, next) => {
  try {
    const data = await setupService.listTemplates();
    const pagination = buildPagination({ total: data.length, keyword: req.query.keyword || "" });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/templates/slug/:slug", async (req, res, next) => {
  try {
    const tpl = await setupService.getTemplateBySlug(req.params.slug);
    if (!tpl) return sendError(res, "Không tìm thấy template", 404);
    sendSuccess(res, tpl);
  } catch (e) {
    next(e);
  }
});

router.get("/templates/:id", async (req, res, next) => {
  try {
    const tpl = await setupService.getTemplate(req.params.id);
    if (!tpl) return sendError(res, "Không tìm thấy template", 404);
    sendSuccess(res, tpl);
  } catch (e) {
    next(e);
  }
});

router.post("/templates", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const tpl = await setupService.createTemplate(req.body);
    sendCreated(res, tpl);
  } catch (e) {
    next(e);
  }
});

router.delete("/templates", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const result = await setupService.removeAllTemplates();
    sendSuccess(res, result, `Đã xóa ${result.deleted} template`);
  } catch (e) {
    next(e);
  }
});

router.put("/templates/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const tpl = await setupService.updateTemplate(req.params.id, req.body);
    sendSuccess(res, tpl);
  } catch (e) {
    next(e);
  }
});

router.delete("/templates/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const result = await setupService.removeTemplate(req.params.id);
    if (result.deactivated) {
      return sendSuccess(res, result, `Template đang được ${result.gamesCount} game sử dụng, đã chuyển sang inactive`);
    }
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    const data = await setupService.listCategories();
    const pagination = buildPagination({ total: data.length, keyword: req.query.keyword || "" });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/categories", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const cat = await setupService.createCategory(req.body);
    sendCreated(res, cat);
  } catch (e) {
    next(e);
  }
});

router.put("/categories/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const cat = await setupService.updateCategory(req.params.id, req.body);
    sendSuccess(res, cat);
  } catch (e) {
    next(e);
  }
});

router.delete("/categories/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await setupService.removeCategory(req.params.id);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
});

router.delete("/categories", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const result = await setupService.removeAllCategories();
    sendSuccess(res, result, `Đã xóa ${result.deleted} category`);
  } catch (e) {
    next(e);
  }
});

router.get("/players", async (_req, res, next) => {
  try {
    const data = await setupService.listPlayers();
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

router.get("/games/:gameId/players", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await gameService.get(gameId);
    if (!game) return sendError(res, "Game not found", 404);
    sendSuccess(res, {
      _id: game._id,
      name: game.name,
      playersCount: game.playersCount || 0,
      type: game.type,
      templateId: game.templateId,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/subjects", async (_req, res, next) => {
  try {
    const data = await setupService.listSubjects();
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

router.post("/subjects", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const list = await setupService.addSubject(req.body.name);
    sendCreated(res, list);
  } catch (e) {
    next(e);
  }
});

router.put("/subjects/:name", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const list = await setupService.updateSubject(decodeURIComponent(req.params.name), req.body.name);
    sendSuccess(res, list);
  } catch (e) {
    next(e);
  }
});

router.delete("/subjects/:name", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const list = await setupService.removeSubject(decodeURIComponent(req.params.name));
    sendSuccess(res, list);
  } catch (e) {
    next(e);
  }
});

export default router;
