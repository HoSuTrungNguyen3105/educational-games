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

// GET /api/users/:id — lấy thông tin 1 user theo id (SAU /search để tránh match nhầm)
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getCollection("users")
      .findOne({ id }, { projection: { passwordHash: 0 } });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
