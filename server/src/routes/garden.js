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

router.post("/plant", authenticate, async (req, res, next) => {
  try {
    const { slotIndex, plantType } = req.body || {};
    if (slotIndex === undefined || !plantType) return sendError(res, "Thiếu slotIndex hoặc plantType", 400);
    const result = await gardenService.plantTree(req.user.sub, Number(slotIndex), plantType);
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

router.get("/inventory", authenticate, async (req, res, next) => {
  try {
    const inventory = await gardenService.getInventory(req.user.sub);
    sendSuccess(res, { inventory });
  } catch (e) { next(e); }
});

router.post("/buy-item", authenticate, async (req, res, next) => {
  try {
    const { itemId } = req.body || {};
    if (!itemId) return sendError(res, "Thiếu itemId", 400);
    const result = await gardenService.buyGardenItem(req.user.sub, itemId);
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

router.post("/use-item", authenticate, async (req, res, next) => {
  try {
    const { itemId } = req.body || {};
    if (!itemId) return sendError(res, "Thiếu itemId", 400);
    const result = await gardenService.useGardenItem(req.user.sub, itemId);
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

export default router;
