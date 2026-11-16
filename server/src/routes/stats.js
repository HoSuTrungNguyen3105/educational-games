import { Router } from "express";
import * as statsService from "../services/statsService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    // ?days=7|14|30|90|180 — cửa sổ biểu đồ; statsService tự chặn về khoảng hợp lệ.
    const data = await statsService.getStats({ days: req.query.days });
    const body = { status: true, code: 200, msg: "success", data };
    res.set("Content-Type", "application/json; charset=utf-8");
    res.send(JSON.stringify(body));
  } catch (e) {
    next(e);
  }
});

export default router;
