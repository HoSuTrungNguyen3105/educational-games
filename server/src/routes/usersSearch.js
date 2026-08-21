import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getCollection } from "../db.js";

const router = Router();

// GET /api/users/search?q=keyword — tìm kiếm người dùng (cần đăng nhập)
router.get("/search", authenticate, async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q || q.length < 2) {
      return res.json([]);
    }
    const currentUserId = req.user.sub;
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const users = await getCollection("users")
      .find({
        $and: [
          { id: { $ne: currentUserId } },
          { role: { $in: ["student", "teacher"] } },
          {
            $or: [
              { name: regex },
              { username: regex },
            ],
          },
        ],
      })
      .project({ passwordHash: 0 })
      .limit(20)
      .toArray();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

export default router;
