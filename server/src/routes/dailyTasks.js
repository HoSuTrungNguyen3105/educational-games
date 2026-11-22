import { Router } from "express";
import { sendSuccess } from "../utils/response.js";
import { respondWithRange } from "../utils/rangeList.js";
import { getDailyTasks } from "../services/dailyTaskService.js";

const router = Router();

// Danh sách nhiệm vụ ngày (client chỉ còn dùng endpoint này qua
// dailyTaskService.list()). Các endpoint /me, /track, /claim và cụm
// /admin/* đã xoá vì không còn caller nào; tầng service server
// (trackAction…) vẫn được auth/gameEvent gọi nội bộ nên giữ nguyên.
router.get("/", async (req, res, next) => {
  try {
    const data = await getDailyTasks();
    if (respondWithRange(req, res, data)) return;
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

export default router;
