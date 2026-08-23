import { Router } from "express";
import * as statsService from "../services/statsService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess } from "../utils/response.js";

const router = Router();

router.get("/", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const data = await statsService.getStats();
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

export default router;
