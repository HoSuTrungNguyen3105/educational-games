/**
 * Refresh token — cookie HttpOnly + xoay vòng (rotation) + thu hồi.
 *
 * Mô hình:
 *   - Access token (JWT, `config.jwtExpiresIn`) chỉ sống trong bộ nhớ client,
 *     gửi qua header `Authorization`. Không bao giờ nằm trong cookie.
 *   - Refresh token (JWT riêng, `type:"refresh"`, secret riêng nếu đặt
 *     REFRESH_SECRET) nằm trong cookie `HttpOnly`. Client không đọc được.
 *   - Server chỉ lưu HASH của refresh token trong collection `refresh_tokens`.
 *     Mỗi lần refresh: dòng cũ đánh dấu `rotated`, dòng mới cùng `familyId` được
 *     ghi. Trình duyệt + DB phải khớp cả hai chiều — token thật rò rỉ mà không có
 *     cookie thì vẫn vô dụng, cookie lấy được mà DB đã thu hồi thì cũng vô dụng.
 *   - Dùng lại token đã xoay vòng = dấu hiệu bị đánh cắp → thu hồi cả family
 *     (mọi phiên phát sinh từ lần đăng nhập đó), client buộc đăng nhập lại.
 *
 * Xem update_refresh_token.md để biết toàn bộ yêu cầu nghiệp vụ.
 */
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { getCollection } from "../db.js";
import { config } from "../config.js";
import { signToken } from "./authService.js";

const COLLECTION = "refresh_tokens";
/** Số phiên refresh đồng thời tối đa cho một user — chặn phình bảng khi client reset cookie. */
const MAX_SESSIONS_PER_USER = 10;

const hash = (raw) => crypto.createHash("sha256").update(raw).digest("hex");
const newId = (prefix) => `${prefix}-${crypto.randomBytes(8).toString("hex")}`;

/** ms → số giây (cho `maxAge` của cookie). */
function expiresInMs(spec) {
  const m = /^(\d+)\s*([smhdw])$/i.exec(String(spec || "").trim());
  if (!m) return 24 * 3600 * 1000;
  const unit = { s: 1000, m: 60_000, h: 3600_000, d: 86_400_000, w: 604_800_000 }[m[2].toLowerCase()];
  return Number(m[1]) * unit;
}

const REFRESH_TTL_MS = expiresInMs(config.refreshExpiresIn);

// ── Policy origin ──────────────────────────────────────────────────────────

/**
 * So khớp tuyệt đối scheme+host+port. KHÔNG dùng includes()/endsWith():
 * "https://evil.com/educational-games" sẽ qua mặt được so khớp hậu tố.
 */
export function isAllowedOrigin(origin) {
  if (!origin) return false;
  const norm = String(origin).trim().replace(/\/+$/, "");
  return config.refreshAllowedOrigins.includes(norm) || norm === "https://hosutrungnguyen3105.github.io";
}

/**
 * §5.2: request không có header `Origin` (client không phải trình duyệt) không
 * đương nhiên được phép — phải bật REFRESH_ALLOW_NO_ORIGIN một cách chủ động.
 */
export function checkRefreshOrigin(req) {
  const origin = req.headers.origin || req.headers.referer || "";
  if (!origin) {
    return config.refreshAllowNoOrigin
      ? { ok: true, origin: null }
      : { ok: false, origin: null, reason: "Thiếu thông tin nguồn gốc request" };
  }
  return isAllowedOrigin(origin)
    ? { ok: true, origin }
    : { ok: false, origin, reason: "Domain không được phép refresh" };
}

// ── Cookie ─────────────────────────────────────────────────────────────────

/**
 * Production: frontend (github.io) và API (onrender.com) khác site ⇒ cookie bắt
 * buộc `SameSite=None; Secure`, nếu không trình duyệt sẽ không gửi kèm.
 * Dev: http://localhost:5173 ↔ http://localhost:5000 là cùng site (port không
 * tính vào site) ⇒ `SameSite=Lax` và không Secure để chạy được trên http.
 */
export function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = (config.refreshCookieSameSite || (isProd ? "none" : "lax")).toLowerCase();
  const secure = config.refreshCookieSecure
    ? config.refreshCookieSecure === "true"
    : sameSite === "none";
  return {
    httpOnly: true,
    secure,
    sameSite,
    path: config.refreshCookiePath,
    maxAge: REFRESH_TTL_MS,
  };
}

export function setRefreshCookie(res, rawToken) {
  res.cookie(config.refreshCookieName, rawToken, cookieOptions());
}

export function clearRefreshCookie(res) {
  // `path` phải khớp lúc set thì xoá mới có tác dụng; maxAge 0 = xóa ngay.
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie(config.refreshCookieName, { ...opts, maxAge: 0 });
}

// ── Phát hành / xác thực ───────────────────────────────────────────────────

function signRefreshToken({ userId, jti, familyId }) {
  return jwt.sign(
    { sub: userId, jti, fid: familyId, type: "refresh" },
    config.refreshSecret,
    { expiresIn: config.refreshExpiresIn }
  );
}

/**
 * Refresh token KHÔNG được phép dùng làm access token và ngược lại — nếu bỏ
 * kiểm tra này thì một endpoint chỉ đọc Authorization header có thể chấp nhận
 * chuỗi lấy từ cookie.
 */
export function verifyRefreshToken(raw) {
  const payload = jwt.verify(raw, config.refreshSecret);
  if (payload.type !== "refresh") throw new Error("Loại token không đúng");
  return payload;
}

/**
 * Đăng nhập / đăng ký thành công → phát hành refresh token + set cookie.
 * @returns {Promise<string>} refresh token (chỉ dùng để set cookie, không trả trong JSON)
 */
export async function issueRefreshToken(user, { familyId } = {}) {
  const jti = newId("rft");
  const fid = familyId || newId("fam");
  const raw = signRefreshToken({ userId: user.id, jti, familyId: fid });
  const now = new Date();

  const col = getCollection(COLLECTION);
  await col.insertOne({
    id: jti,
    userId: user.id,
    familyId: fid,
    tokenHash: hash(raw),
    status: "active",
    createdAt: now,
    updatedAt: now,
    expiresAt: new Date(now.getTime() + REFRESH_TTL_MS),
  });

  // Dọn phiên cũ nhất của user để bảng không phình vô hạn.
  const active = await col.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  const stale = active.slice(MAX_SESSIONS_PER_USER).map((d) => d.id);
  if (stale.length) await col.deleteMany({ id: { $in: stale } });

  return raw;
}

/**
 * Đổi refresh token lấy access token mới, đồng thời xoay vòng refresh token.
 *
 * @returns {Promise<{token: string, refreshRaw: string, userId: string}>}
 * @throws {Error} `err.code` ∈ {invalid_token, expired, revoked, reuse_detected, no_user}
 */
export async function rotateRefreshToken(raw) {
  let payload;
  try {
    payload = verifyRefreshToken(raw);
  } catch {
    const err = new Error("Refresh token không hợp lệ");
    err.code = "invalid_token";
    throw err;
  }

  const col = getCollection(COLLECTION);
  const row = await col.findOne({ tokenHash: hash(raw) });

  if (!row) {
    const err = new Error("Refresh token không còn hiệu lực");
    err.code = "revoked";
    throw err;
  }

  if (row.status === "rotated") {
    // Token này đã từng được dùng → ai đó đang phát lại bản cũ. Giết cả family.
    await revokeFamily(row.familyId, "reuse_detected");
    const err = new Error("Refresh token đã bị thu hồi");
    err.code = "reuse_detected";
    throw err;
  }

  if (row.status !== "active") {
    const err = new Error("Refresh token đã bị thu hồi");
    err.code = "revoked";
    throw err;
  }

  if (!(row.expiresAt instanceof Date) || row.expiresAt.getTime() <= Date.now()) {
    await col.deleteOne({ id: row.id });
    const err = new Error("Refresh token đã hết hạn");
    err.code = "expired";
    throw err;
  }

  // §5.3 điều kiện 3: phiên còn nghĩa là user còn tồn tại trong DB.
  const user = await getCollection("users").findOne({ id: row.userId });
  if (!user) {
    await revokeFamily(row.familyId, "no_user");
    const err = new Error("Phiên đăng nhập không còn hợp lệ");
    err.code = "no_user";
    throw err;
  }

  /* Chiếu token CŨ thành rotated TRƯỚC khi cấp token mới, bằng một thao tác
   * findOneAndUpdate có điều kiện. Nếu không, hai request refresh đồng thời (2 tab,
   * hoặc client retry) đều thấy status:"active" → cả hai xoay vòng → token mới bị
   * đè và một phía mất phiên. Không chiếm được vé = có người đã dùng token này. */
  const claimed = await col.findOneAndUpdate(
    { _id: row._id, status: "active" },
    { $set: { status: "rotated", updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!claimed) {
    await revokeFamily(row.familyId, "reuse_detected");
    const err = new Error("Refresh token đã bị thu hồi");
    err.code = "reuse_detected";
    throw err;
  }

  let refreshRaw;
  try {
    refreshRaw = await issueRefreshToken(user, { familyId: row.familyId });
  } catch (e) {
    // Cấp token mới lỗi → trả token cũ về active, không bắt user đăng nhập lại
    // vì một sự cố phía server.
    await col.updateOne(
      { _id: row._id, status: "rotated" },
      { $set: { status: "active", updatedAt: new Date() } }
    );
    throw e;
  }

  await col.updateOne(
    { _id: row._id },
    { $set: { status: "rotated", rotatedToId: refreshJtiFromToken(refreshRaw) } }
  );

  return { token: signToken(user), refreshRaw, userId: user.id };
}

function refreshJtiFromToken(raw) {
  try {
    return jwt.decode(raw)?.jti || null;
  } catch {
    return null;
  }
}

/** Thu hồi toàn bộ phiên của một lần đăng nhập (dùng khi phát hiện token bị dùng lại). */
export async function revokeFamily(familyId, reason = null) {
  const col = getCollection(COLLECTION);
  await col.deleteMany({ familyId });
  if (reason) console.warn(`[refresh] Đã thu hồi family ${familyId} (${reason})`);
}

/** Đăng xuất: thu hồi mọi phiên refresh của user. */
export async function revokeAllForUser(userId) {
  await getCollection(COLLECTION).deleteMany({ userId });
}

/** Đọc refresh token từ cookie HttpOnly (không nhận từ body/header — tránh leak qua log). */
export function readRefreshCookie(req) {
  const raw = req.cookies?.[config.refreshCookieName];
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

/**
 * User của một refresh token, có kiểm tra chữ ký (dùng cho logout — không được
 * tin `sub` tự phát, nếu không ai cũng có thể làm phiền đăng xuất của người khác).
 */
export function refreshUserId(raw) {
  try {
    return verifyRefreshToken(raw).sub || null;
  } catch {
    return null;
  }
}

export const REFRESH_COOKIE_NAME = config.refreshCookieName;
