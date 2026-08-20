import { Router } from "express";
import * as statsService from "../services/statsService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

// GET /api/stats — thống kê tổng hợp cho dashboard giáo viên
router.get("/", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    res.json(await statsService.getStats());
  } catch (e) {
    next(e);
  }
});

export default router;