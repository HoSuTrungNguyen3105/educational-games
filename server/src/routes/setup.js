import { Router } from "express";
import * as setupService from "../services/setupService.js";
import * as gameService from "../services/api.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/templates", async (_req, res, next) => {
  try {
    res.json(await setupService.listTemplates());
  } catch (e) {
    next(e);
  }
});

router.get("/templates/slug/:slug", async (req, res, next) => {
  try {
    const tpl = await setupService.getTemplateBySlug(req.params.slug);
    if (!tpl) return res.status(404).json({ message: "Không tìm thấy template" });
    res.json(tpl);
  } catch (e) {
    next(e);
  }
});

router.get("/templates/:id", async (req, res, next) => {
  try {
    const tpl = await setupService.getTemplate(req.params.id);
    if (!tpl) return res.status(404).json({ message: "Không tìm thấy template" });
    res.json(tpl);
  } catch (e) {
    next(e);
  }
});

router.post("/templates", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const tpl = await setupService.createTemplate(req.body);
    res.status(201).json(tpl);
  } catch (e) {
    next(e);
  }
});

// Xóa TẤT CẢ templates
router.delete("/templates", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const result = await setupService.removeAllTemplates();
    res.json({ message: `Đã xóa ${result.deleted} template`, ...result });
  } catch (e) {
    next(e);
  }
});

router.put("/templates/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const tpl = await setupService.updateTemplate(req.params.id, req.body);
    res.json(tpl);
  } catch (e) {
    next(e);
  }
});

router.delete("/templates/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const result = await setupService.removeTemplate(req.params.id);
    if (result.deactivated) {
      return res.json({ message: `Template đang được ${result.gamesCount} game sử dụng, đã chuyển sang inactive`, deactivated: true });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

router.get("/categories", async (_req, res, next) => {
  try {
    res.json(await setupService.listCategories());
  } catch (e) {
    next(e);
  }
});

router.get("/players", async (_req, res, next) => {
  try {
    res.json(await setupService.listPlayers());
  } catch (e) {
    next(e);
  }
});

router.get("/games/:gameId/players", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await gameService.get(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    // Trả về playersCount và info cơ bản từ DB game
    // Để lấy live score đang chơi thì HTML nên dùng init PostMessage từ parent
    res.json({
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
    res.json(await setupService.listSubjects());
  } catch (e) {
    next(e);
  }
});

export default router;
