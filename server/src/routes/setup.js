import { Router } from "express";
import * as setupService from "../services/setupService.js";

const router = Router();

router.get("/templates", async (_req, res, next) => {
  try {
    res.json(await setupService.listTemplates());
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