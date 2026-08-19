import { Router } from "express";
import { verifyCredentials, signToken, publicUser } from "../services/authService.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }
    const user = await verifyCredentials(username, password);
    if (!user) return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

// GET /api/auth/me — kiểm tra token còn hạn
router.get("/me", authenticate, (req, res) => {
  res.json({ user: { id: req.user.sub, username: req.user.username, name: req.user.name, role: req.user.role } });
});

export default router;