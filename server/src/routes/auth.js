import { Router } from "express";
import { verifyCredentials, signToken, publicUser, registerUser } from "../services/authService.js";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { username, password, identifier } = req.body || {};
    const id = identifier || username;
    if (!id || !password) {
      return sendError(res, "Vui lòng nhập tên đăng nhập/email và mật khẩu", 400);
    }
    const user = await verifyCredentials(id, password);
    if (!user) return sendError(res, "Sai tên đăng nhập hoặc mật khẩu", 401);

    const token = signToken(user);
    sendSuccess(res, { token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body || {};
    if (!username || !password || !name) {
      return sendError(res, "Vui lòng nhập đầy đủ thông tin", 400);
    }
    if (password.length < 6) {
      return sendError(res, "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }
    const result = await registerUser({ username, email, password, name });
    sendCreated(res, result);
  } catch (e) {
    const msg = e.message || "Đăng ký thất bại";
    if (msg.includes("tồn tại")) return sendError(res, msg, 409);
    next(e);
  }
});

router.get("/me", authenticate, (req, res) => {
  sendSuccess(res, { id: req.user.sub, username: req.user.username, name: req.user.name, role: req.user.role });
});

export default router;
