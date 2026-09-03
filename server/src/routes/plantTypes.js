import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as plantTypeService from "../services/plantTypeService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const types = await plantTypeService.getAllPlantTypes();
    sendSuccess(res, { types });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const type = await plantTypeService.getPlantType(req.params.id);
    if (!type) return sendError(res, "Không tìm thấy", 404);
    sendSuccess(res, type);
  } catch (e) { next(e); }
});

router.post("/", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const { id, name, icon, stages, growthTime, harvestCoin, seedPrice, rarity, palette } = req.body || {};
    if (!id || !name) return sendError(res, "Thiếu id hoặc name", 400);
    const result = await plantTypeService.createPlantType({
      id, name, icon: icon || name, stages: stages || 3,
      growthTime: growthTime || 300000, harvestCoin: harvestCoin || 10,
      seedPrice: seedPrice || 5, rarity: rarity || "common",
      palette: palette || { stem: "#5B8C3A", leaf: "#7CB342", leafDark: "#4C7A2A", accent: "#F4B93E", accentLight: "#FFE08A", accentDark: "#C97F17" },
    });
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

router.put("/:id", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const result = await plantTypeService.updatePlantType(req.params.id, req.body);
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

router.delete("/:id", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    await plantTypeService.deletePlantType(req.params.id);
    sendSuccess(res, { success: true });
  } catch (e) { sendError(res, e.message, 400); }
});

export default router;
