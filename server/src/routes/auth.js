import { Router } from "express";
import { verifyCredentials, signToken, publicUser, registerUser } from "../services/authService.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password, identifier } = req.body || {};
    const id = identifier || username;
    if (!id || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập/email và mật khẩu" });
    }
    const user = await verifyCredentials(id, password);
    if (!user) return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body || {};
    if (!username || !password || !name) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }
    const result = await registerUser({ username, email, password, name });
    res.status(201).json(result);
  } catch (e) {
    const msg = e.message || "Đăng ký thất bại";
    if (msg.includes("tồn tại")) return res.status(409).json({ message: msg });
    next(e);
  }
});

// GET /api/auth/me — kiểm tra token còn hạn
router.get("/me", authenticate, (req, res) => {
  res.json({ user: { id: req.user.sub, username: req.user.username, name: req.user.name, role: req.user.role } });
});

export default router;