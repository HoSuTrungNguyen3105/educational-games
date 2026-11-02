import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getCollection } from "../db.js";
import { sendSuccess, buildPagination } from "../utils/response.js";

// ── Thư mục người dùng tối thiểu: GET /api/users/directory?q= ─────────────
// Cho các màn hình PHÍA NGƯỜI DÙNG (Tìm bạn, mời bạn chơi cùng…) tìm người
// theo tên mà không cần quyền users.view như /api/users/search — endpoint
// search cũ trả gần như toàn bộ bản ghi user (kể cả email) nên chỉ giáo
// viên/admin mới được dùng, học sinh gọi là 403.
// Endpoint này: mọi tài khoản đăng nhập, query tối thiểu 2 ký tự, tối đa 10
// kết quả, loại trừ chính mình, CHỈ trả id/username/name/avatarLoadout và
// KHÔNG khớp theo email. Router chỉ khai đúng route tĩnh "/directory" và
// được mount TRƯỚC các adminRouter ở /api/users (xem app.js) để học sinh
// tới được; các path khác không khớp sẽ rơi qua như cũ.
const router = Router();

router.get("/directory", authenticate, async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q || q.length < 2) {
      return sendSuccess(res, []);
    }
    const currentUserId = req.user.sub;
    const isAdmin = req.user.role === "admin";
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const conditions = [
      { id: { $ne: currentUserId } },
      { $or: [{ name: regex }, { username: regex }] },
    ];
    if (!isAdmin) {
      conditions.push({ role: { $in: ["student", "teacher"] } });
    }
    const users = await getCollection("users")
      .find({ $and: conditions })
      .project({ _id: 0, id: 1, username: 1, name: 1, avatarLoadout: 1 })
      .limit(10)
      .toArray();
    const pagination = buildPagination({ total: users.length, keyword: q });
    sendSuccess(res, users, "success", pagination);
  } catch (e) {
    next(e);
  }
});

export default router;
