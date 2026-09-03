import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as gardenService from "../services/gardenService.js";

const router = Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const garden = await gardenService.getGarden(req.user.sub);
    sendSuccess(res, garden);
  } catch (e) { next(e); }
});

router.get("/tree-types", async (req, res, next) => {
  try {
    const types = gardenService.getTreeTypes();
    sendSuccess(res, { types });
  } catch (e) { next(e); }
});

router.post("/plant", authenticate, async (req, res, next) => {
  try {
    const { slotIndex, treeType } = req.body || {};
    if (slotIndex === undefined || !treeType) return sendError(res, "Thiếu slotIndex hoặc treeType", 400);
    const result = await gardenService.plantTree(req.user.sub, Number(slotIndex), treeType);
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

router.post("/harvest", authenticate, async (req, res, next) => {
  try {
    const { slotIndex } = req.body || {};
    if (slotIndex === undefined) return sendError(res, "Thiếu slotIndex", 400);
    const result = await gardenService.harvestTree(req.user.sub, Number(slotIndex));
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

router.post("/water", authenticate, async (req, res, next) => {
  try {
    const { slotIndex } = req.body || {};
    if (slotIndex === undefined) return sendError(res, "Thiếu slotIndex", 400);
    const result = await gardenService.waterTree(req.user.sub, Number(slotIndex));
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

router.post("/remove", authenticate, async (req, res, next) => {
  try {
    const { slotIndex } = req.body || {};
    if (slotIndex === undefined) return sendError(res, "Thiếu slotIndex", 400);
    const result = await gardenService.removeTree(req.user.sub, Number(slotIndex));
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

export default router;
