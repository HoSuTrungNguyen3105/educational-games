import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getCollection } from "../db.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.get("/search", authenticate, async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q || q.length < 2) {
      return sendSuccess(res, []);
    }
    const currentUserId = req.user.sub;
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const users = await getCollection("users")
      .find({
        $and: [
          { id: { $ne: currentUserId } },
          { role: { $in: ["student", "teacher"] } },
          { $or: [{ name: regex }, { username: regex }] },
        ],
      })
      .project({ passwordHash: 0 })
      .limit(20)
      .toArray();
    const pagination = buildPagination({ total: users.length, keyword: q });
    sendSuccess(res, users, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getCollection("users").findOne({ id }, { projection: { passwordHash: 0 } });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, user);
  } catch (e) {
    next(e);
  }
});

export default router;
