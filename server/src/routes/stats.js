import { Router } from "express";
import * as statsService from "../services/statsService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess } from "../utils/response.js";

const router = Router();

router.get("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    // ?days=7|14|30|90|180 — cửa sổ biểu đồ; statsService tự chặn về khoảng hợp lệ.
    const data = await statsService.getStats({ days: req.query.days });
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

export default router;
