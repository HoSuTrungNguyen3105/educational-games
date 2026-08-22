import { Router } from "express";
import * as setupService from "../services/setupService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/templates", async (_req, res, next) => {
  try {
    res.json(await setupService.listTemplates());
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
    await setupService.removeTemplate(req.params.id);
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

router.get("/subjects", async (_req, res, next) => {
  try {
    res.json(await setupService.listSubjects());
  } catch (e) {
    next(e);
  }
});

export default router;