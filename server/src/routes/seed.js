import { Router } from "express";
import { sendSuccess } from "../utils/response.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

// Đã tắt seed mock data: không nạp dữ liệu mẫu từ file JSON nữa.
router.post("/seed", authenticate, requireRoles("admin", "teacher"), async (_req, res) => {
  sendSuccess(res, { message: "Seed mock data đã bị tắt. Không nạp dữ liệu mẫu.", data: {} });
});

export default router;
