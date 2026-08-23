import { verifyToken } from "../services/authService.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại" });
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return next();
  try {
    req.user = verifyToken(token);
  } catch { /* ignore invalid token */ }
  next();
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
    }
    next();
  };
}