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
 *     NGOẠI LỆ: token MỚI bị xoay trong cửa sổ grace (ROTATION_GRACE_MS) mà
 *     family vẫn còn token active thì coi là đua/retry lành tính của chính
 *     client (hai lượt refresh chồng nhau trên mobile) — cấp token "anh em"
 *     trong cùng family, KHÔNG thu hồi. Xem `graceSiblingUser`.
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
/**
 * Cửa sổ khoan dung (grace) cho token VỪA bị xoay vòng — 60 giây.
 *
 * Vì sao tồn tại: trên mobile rất dễ có hai lượt refresh CHỒNG nhau dùng cùng
 * một cookie (PWA và tab trình duyệt cùng chạy vòng refresh 20 giây trên
 * Android dùng chung cookie jar; hoặc mạng di động làm mất response khiến
 * client retry bằng cookie cũ). Nếu coi mọi lần trình lại token đã xoay là
 * đánh cắp và thu hồi cả family, phía THẮNG cuộc đua cũng mất phiên oan —
 * token mới của nó chết theo — và user bị đá về màn hình đăng nhập dù không
 * có gì bất thường. Trong cửa sổ này, nếu family vẫn còn token active (chuỗi
 * xoay vòng còn sống) thì cấp thêm một token "anh em" thay vì thu hồi.
 * Ngoài cửa sổ: giữ nguyên kết luận đánh cắp → thu hồi cả family.
 */
const ROTATION_GRACE_MS = 60_000;
/**
 * Khi phía thua cuộc đua kiểm tra family, phía thắng có thể đã chiếu token cũ
 * thành `rotated` nhưng CHƯA cấp xong token kế tiếp — family tạm thời không
 * có token `active` nào. Chờ tối đa chừng này (kiểm lại mỗi
 * GRACE_FAMILY_POLL_MS) trước khi kết luận family đã chết.
 */
const GRACE_FAMILY_WAIT_MS = 2_000;
const GRACE_FAMILY_POLL_MS = 125;

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

/**
 * Path cookie của các bản trước khi có endpoint refresh v1. Trình duyệt coi
 * (tên + path) là các cookie KHÁC nhau: bản cũ ở path này còn sót sẽ được gửi
 * kèm bản mới ở những request khớp cả hai path, mà cookie-parser chỉ đọc một
 * giá trị — đọc trúng token đã xoay vòng thì reuse-detection thu hồi cả
 * family oan. Mọi lần set/clear đều xoá luôn bản legacy để jar hội tụ về
 * đúng một cookie ở path hiện hành.
 */
const LEGACY_REFRESH_COOKIE_PATH = "/api/auth";

export function setRefreshCookie(res, rawToken) {
  const opts = cookieOptions();
  res.cookie(config.refreshCookieName, rawToken, opts);
  if (opts.path !== LEGACY_REFRESH_COOKIE_PATH) {
    res.clearCookie(config.refreshCookieName, { ...opts, path: LEGACY_REFRESH_COOKIE_PATH, maxAge: 0 });
  }
}

export function clearRefreshCookie(res) {
  // `path` phải khớp lúc set thì xoá mới có tác dụng; maxAge 0 = xóa ngay.
  // Xoá cả path hiện hành lẫn path legacy để đăng xuất/refresh lỗi là cookie
  // biến mất thật ở mọi path.
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie(config.refreshCookieName, { ...opts, maxAge: 0 });
  if (opts.path !== LEGACY_REFRESH_COOKIE_PATH) {
    res.clearCookie(config.refreshCookieName, { ...opts, path: LEGACY_REFRESH_COOKIE_PATH, maxAge: 0 });
  }
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
 * @param {string} [meta]  thông tin thiết bị (user-agent + ip) để trang Cài đặt
 *   liệt kê phiên. KHÔNG chứa credential — token chỉ được lưu dạng hash.
 * @returns {Promise<string>} refresh token (chỉ dùng để set cookie, không trả trong JSON)
 */
export async function issueRefreshToken(user, { familyId, meta } = {}) {
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
    ...(meta && (meta.ua || meta.ip) ? { meta: { ua: String(meta.ua || "").slice(0, 180), ip: String(meta.ip || "").slice(0, 60) } } : {}),
  });

  // Dọn phiên cũ nhất của user để bảng không phình vô hạn.
  const active = await col.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  const stale = active.slice(MAX_SESSIONS_PER_USER).map((d) => d.id);
  if (stale.length) await col.deleteMany({ id: { $in: stale } });

  return raw;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Token đã xoay còn nằm trong cửa sổ grace không — tính từ `updatedAt` (thời điểm bị chiếu thành `rotated`). */
function rotatedWithinGrace(row) {
  const at = row.updatedAt instanceof Date ? row.updatedAt.getTime() : NaN;
  if (!Number.isFinite(at)) return false;
  const age = Date.now() - at;
  return age >= 0 && age <= ROTATION_GRACE_MS;
}

/**
 * Family còn token `active` nào không — dấu hiệu chuỗi xoay vòng còn sống và
 * token kế tiếp đã tới tay phía thắng. Với `wait: true`, nếu chưa thấy thì chờ
 * tối đa GRACE_FAMILY_WAIT_MS rồi mới kết luận (phía thắng có thể chưa cấp
 * xong token kế tiếp — xem hằng số ở đầu file).
 */
async function familyHasActiveToken(col, familyId, { wait = false } = {}) {
  const deadline = Date.now() + (wait ? GRACE_FAMILY_WAIT_MS : 0);
  for (;;) {
    const active = await col.findOne({ familyId, status: "active" }, { projection: { _id: 1 } });
    if (active) return true;
    if (Date.now() >= deadline) return false;
    await sleep(GRACE_FAMILY_POLL_MS);
  }
}

/**
 * GRACE cho token vừa bị xoay vòng: đủ cả ba điều kiện — (1) mới bị xoay
 * trong cửa sổ ROTATION_GRACE_MS, (2) bản thân token chưa hết hạn, (3) family
 * vẫn còn token active — thì đây là đua/retry lành tính, trả về user để
 * caller cấp một refresh token "anh em" trong cùng family. Thiếu bất kỳ điều
 * kiện nào → null, caller giữ nguyên hành vi bảo mật cũ (thu hồi cả family).
 */
async function graceSiblingUser(col, row) {
  if (!rotatedWithinGrace(row)) return null;
  if (!(row.expiresAt instanceof Date) || row.expiresAt.getTime() <= Date.now()) return null;
  if (!(await familyHasActiveToken(col, row.familyId, { wait: true }))) return null;
  return getCollection("users").findOne({ id: row.userId });
}

/** Cấp refresh token "anh em" trong cùng family cho nhánh grace + access token mới. */
async function issueGraceSibling(user, row) {
  const refreshRaw = await issueRefreshToken(user, { familyId: row.familyId, meta: row.meta });
  return { token: signToken(user), refreshRaw, userId: user.id };
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
    /* Có thể là đua/retry lành tính trong cửa sổ grace (hai lượt refresh
     * chồng nhau, hoặc client retry bằng cookie cũ khi response bị mất):
     * cấp token anh em, KHÔNG thu hồi family. Ngoài grace → giữ nguyên kết
     * luận đánh cắp như thiết kế gốc. */
    const graceUser = await graceSiblingUser(col, row);
    if (graceUser) return issueGraceSibling(graceUser, row);
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
    /* Thua claim = một request khác vừa chiếm token này trong tích tắc (hai
     * lượt refresh chồng nhau trên mobile). Đọc lại dòng mới nhất: nếu nó VỪA
     * bị xoay trong cửa sổ grace và family còn sống → xử lí grace như nhánh
     * `rotated` ở trên thay vì thu hồi cả family oan. Lưu ý phải dùng dòng
     * mới đọc — bản `row` ở đây là ảnh chụp TRƯỚC khi phía thắng xoay, nên
     * `updatedAt` của nó không phản ánh thời điểm xoay vừa xảy ra. */
    const fresh = await col.findOne({ _id: row._id });
    if (fresh && fresh.status === "rotated") {
      const graceUser = await graceSiblingUser(col, fresh);
      if (graceUser) return issueGraceSibling(graceUser, fresh);
    }
    await revokeFamily(row.familyId, "reuse_detected");
    const err = new Error("Refresh token đã bị thu hồi");
    err.code = "reuse_detected";
    throw err;
  }

  let refreshRaw;
  try {
    refreshRaw = await issueRefreshToken(user, { familyId: row.familyId, meta: row.meta });
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

/**
 * Danh sách phiên đang hoạt động của một user — phục vụ trang Cài đặt.
 * Chỉ trả thông tin mô tả, KHÔNG bao giờ trả tokenHash/familyId bí mật hay token.
 *
 * @param {string} userId
 * @param {string} [rawCurrentToken] refresh token trong cookie của request hiện tại
 *        (để đánh dấu đúng máy đang dùng).
 */
export async function listSessions(userId, rawCurrentToken) {
  const col = getCollection(COLLECTION);
  const rows = await col.find({ userId }).sort({ createdAt: -1 }).toArray();
  const currentHash = rawCurrentToken ? hash(rawCurrentToken) : null;
  const nowMs = Date.now();
  return rows.map((r) => ({
    id: r.id,
    // Họp nhất: phiên đang dùng là bản ghi `active` khớp đúng token trong cookie.
    current: currentHash ? r.tokenHash === currentHash : false,
    status: r.status,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    expiresAt: r.expiresAt instanceof Date ? r.expiresAt.toISOString() : r.expiresAt,
    expiresInSeconds: r.expiresAt instanceof Date ? Math.max(0, Math.round((r.expiresAt.getTime() - nowMs) / 1000)) : 0,
    userAgent: r.meta?.ua || "",
    ip: r.meta?.ip || "",
  }));
}

/**
 * Thu hồi mọi phiên của user trừ phiên hiện tại (đang dùng cookie `rawCurrentToken`).
 * @returns {Promise<number>} số phiên đã đá
 */
export async function revokeOtherSessions(userId, rawCurrentToken) {
  if (!rawCurrentToken) {
    const n = await revokeAllForUserCount(userId);
    return n;
  }
  const col = getCollection(COLLECTION);
  const res = await col.deleteMany({ userId, tokenHash: { $ne: hash(rawCurrentToken) } });
  return res.deletedCount || 0;
}

/** Đếm/ xoá toàn bộ phiên của user, trả số lượng đã xoá. */
export async function revokeAllForUserCount(userId) {
  const res = await getCollection(COLLECTION).deleteMany({ userId });
  return res.deletedCount || 0;
}

/** Đọc refresh token từ cookie HttpOnly. */
export function readRefreshCookie(req) {
  const raw = req.cookies?.[config.refreshCookieName];
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

/**
 * Đọc refresh token theo thứ tự ưu tiên: header `x-refresh-token` → body JSON
 * `refreshToken` → cookie HttpOnly.
 *
 * Vì sao cần đường header/body ngoài cookie: client (github.io) và API
 * (onrender.com) là hai site khác hẳn nhau (cả hai đều nằm trên Public Suffix
 * List) nên cookie refresh là cookie BÊN THỨ BA. WebKit trên iOS chặn cookie
 * bên thứ ba mặc định bằng ITP ⇒ cookie không được lưu/gửi, refresh trên
 * iPhone luôn 401 "Không có refresh token" dù cấu hình cookie đã đúng
 * (Android Chrome cho phép SameSite=None nên không sao). Client iOS vì vậy
 * giữ thêm một bản refresh token trong localStorage (cùng object phiên với
 * access token vốn đã ở đó) và gửi qua header khi refresh/đăng xuất.
 *
 * Đánh đổi đã cân nhắc: token rời khỏi HttpOnly, nhưng server vẫn chỉ lưu
 * hash, token vẫn xoay vòng mỗi lần dùng và reuse-detection ngoài cửa sổ
 * grace vẫn thu hồi cả family — token bị lộ tự vô hiệu ngay khi chủ thật
 * hoặc kẻ gian dùng trước. Cookie vẫn là đường chính cho desktop/Android.
 */
export function readRefreshToken(req) {
  const fromHeader = req.headers?.["x-refresh-token"];
  if (typeof fromHeader === "string" && fromHeader.length > 0) return fromHeader;
  const fromBody = req.body?.refreshToken;
  if (typeof fromBody === "string" && fromBody.length > 0) return fromBody;
  return readRefreshCookie(req);
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
