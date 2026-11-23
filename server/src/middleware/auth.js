import { verifyToken } from "../services/authService.js";
import { config } from "../config.js";

const BFF_INTERNAL_TOKEN = process.env.BFF_BACKEND_TOKEN || "bff-internal-secret-change-me";

export function authenticate(req, res, next) {
  // Check for BFF internal token (server-to-server)
  const bffToken = req.headers["x-bff-internal-token"];
  const isBffRequest = bffToken && bffToken === BFF_INTERNAL_TOKEN;
  
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  
  if (!token) {
    return res.status(401).json({ status: false, code: 401, msg: "Chưa đăng nhập" });
  }
  
  try {
    req.user = verifyToken(token);
    req.isBffRequest = isBffRequest;
    next();
  } catch {
    return res.status(401).json({ status: false, code: 401, msg: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại" });
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
      return res.status(403).json({ status: false, code: 403, msg: "Bạn không có quyền thực hiện thao tác này" });
    }
    next();
  };
}

/**
 * Middleware to verify BFF internal token for BFF-only endpoints
 */
export function requireBff(req, res, next) {
  const bffToken = req.headers["x-bff-internal-token"];
  if (!bffToken || bffToken !== BFF_INTERNAL_TOKEN) {
    return res.status(403).json({ status: false, code: 403, msg: "Forbidden: BFF access required" });
  }
  next();
}