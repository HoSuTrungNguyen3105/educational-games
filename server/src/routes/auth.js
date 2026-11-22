import { Router } from "express";
import { verifyCredentials, signToken, publicUser, registerUser, updateProfile, changePassword, getCoins, getWallet, adjustWallet, exchangeWallet, redeemAchievement, getXp, claimDailyStarGift, getTickets, addTickets, useTicket } from "../services/authService.js";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { getByUser, XP_LEDGER_GAME_ID } from "../services/gameProgressService.js";
import * as petService from "../services/petService.js";
import { getCollection } from "../db.js";
import { trackAction } from "../services/dailyTaskService.js";
import { processTaskEvent } from "../services/taskEngineService.js";
import { getClassById } from "../services/classService.js";
import { getRolePermissions, getRoleIdentity } from "../services/permissionService.js";
import {
  checkRefreshOrigin, issueRefreshToken, rotateRefreshToken, readRefreshToken,
  setRefreshCookie, clearRefreshCookie, revokeAllForUser, refreshUserId, REFRESH_COOKIE_NAME,
  listSessions, revokeOtherSessions, revokeAllForUserCount,
} from "../services/refreshTokenService.js";
import { record as audit, AUDIT } from "../services/auditService.js";

const router = Router();

/** Thông tin thiết bị kèm theo refresh token (trang Cài đặt dùng để liệt kê phiên). */
const sessionMeta = (req) => ({ ua: req.headers["user-agent"] || "", ip: req.ip || "" });

/**
 * §5.1–5.2: chỉ chấp nhận refresh từ origin nằm trong REFRESH_ALLOWED_ORIGINS.
 * Chặn sớm (trước khi đụng DB/token) để token thật không bị đem ra đoán thử.
 */
function requireRefreshOrigin(req, res) {
  const check = checkRefreshOrigin(req);
  if (check.ok) return true;
  console.warn(`[refresh] Từ chối ${req.method} ${req.originalUrl} — origin=${check.origin || "(không có)"}: ${check.reason}`);
  sendError(res, check.reason || "Domain không được phép", 403);
  return false;
}

router.post("/login", async (req, res, next) => {
  try {
    const { username, password, identifier } = req.body || {};
    const id = identifier || username;
    if (!id || !password) {
      return sendError(res, "Vui lòng nhập tên đăng nhập/email và mật khẩu", 400);
    }
    const user = await verifyCredentials(id, password);
    if (!user) {
      // Đăng nhập thất bại cũng ghi lại (không có mật khẩu trong log) để truy vết dò tài khoản.
      audit({ req, action: AUDIT.LOGIN_FAIL, target: String(id).slice(0, 60), result: "fail", message: "Sai tên đăng nhập hoặc mật khẩu" }).catch(() => {});
      return sendError(res, "Sai tên đăng nhập hoặc mật khẩu", 401);
    }

    const token = signToken(user);
    // Refresh token đi qua cookie HttpOnly (đường chính) VÀ trả thêm trong
    // body (`refreshToken`) cho client iOS: WebKit chặn cookie bên thứ ba
    // (client github.io ≠ API onrender.com) nên client giữ bản này trong
    // localStorage và gửi lại qua header `x-refresh-token` — xem
    // readRefreshToken trong refreshTokenService.
    const refreshRaw = await issueRefreshToken(user, { meta: sessionMeta(req) });
    setRefreshCookie(res, refreshRaw);
    trackAction(user.id, "login", 1).catch(() => {});
    processTaskEvent(user.id, { type: "LOGIN" }).catch(() => {});
    audit({
      req,
      actor: { sub: user.id, username: user.username, name: user.name, role: user.role },
      action: AUDIT.LOGIN,
      target: user.username || user.id,
      message: `Đăng nhập với vai trò ${user.role}`,
    }).catch(() => {});
    // `pet` trong response login = trạng thái thú cưng ĐẦY ĐỦ (gộp từ
    // /api/pet cũ), không chỉ bộ đồ DressUp thô trong users.pet — client
    // đọc luôn từ đây, khỏi gọi thêm GET /api/users/me/pet.
    const pub = publicUser(user);
    pub.pet = await petService.getFullState(user.id).catch(() => pub.pet);
    sendSuccess(res, { token, user: pub, refreshToken: refreshRaw });
  } catch (e) {
    next(e);
  }
});

/**
 * Lõi refresh DÙNG CHUNG cho POST /api/auth/refresh và POST /api/v1/user/refresh
 * (routes/v1User.js): kiểm tra origin → đọc refresh token (header
 * `x-refresh-token` → body `refreshToken` → cookie HttpOnly, xem
 * readRefreshToken) → xoay vòng qua refreshTokenService → set cookie mới +
 * trả token mới trong body để client không phụ thuộc cookie (iOS) cập nhật
 * bản lưu của mình. Hai endpoint chỉ khác nhau ở shape của response THÀNH
 * CÔNG; logic và response LỖI là một.
 *
 * @returns {Promise<{token: string, refreshToken: string}|null>} access token
 *   + refresh token MỚI khi thành công; `null` khi thất bại — lúc đó response
 *   lỗi đã được gửi rồi, caller không gửi thêm gì.
 */
export async function performRefresh(req, res) {
  if (!requireRefreshOrigin(req, res)) return null;

  const raw = readRefreshToken(req);
  if (!raw) {
    sendError(res, "Không có refresh token", 401);
    return null;
  }

  try {
    const { token, refreshRaw } = await rotateRefreshToken(raw);
    setRefreshCookie(res, refreshRaw); // xoay vòng: cookie mới thay cookie cũ
    return { token, refreshToken: refreshRaw };
  } catch (e) {
    // Token hỏng/hết hạn/thu hồi ⇒ cookie cũng vô giá trị, xoá để client không retry lặp.
    clearRefreshCookie(res);
    console.warn(`[refresh] Thất bại (${e.code || "unknown"}): ${e.message}`);
    sendError(res, e.message || "Refresh thất bại", 401);
    return null;
  }
}

/**
 * POST /api/auth/refresh — cấp access token mới từ refresh token trong cookie.
 *
 * Hợp đồng response theo update_refresh_token.md §3.2: `Authorization` nằm ở
 * gốc JSON. Kèm thêm `data.token` (cùng một giá trị) vì mọi API khác của dự án
 * trả theo envelope `{status, code, msg, data}` và client cũ đọc theo kiểu đó.
 */
router.post("/refresh", async (req, res) => {
  const result = await performRefresh(req, res);
  if (result === null) return;
  return res.json({
    status: true,
    code: 200,
    msg: "refresh.success",
    Authorization: `Bearer ${result.token}`,
    data: { token: result.token, refreshToken: result.refreshToken },
  });
});

/**
 * POST /api/auth/logout — kết thúc phiên: thu hồi refresh token trong DB và xoá cookie.
 * Không yêu cầu access token hợp lệ (phiên đã hết hạn vẫn phải xoá được cookie),
 * nên user được lấy từ chính refresh token gửi kèm (header/body/cookie).
 */
router.post("/logout", async (req, res) => {
  // Đọc hợp nhất header/body/cookie: client iOS không có cookie vẫn phải thu
  // hồi được family của mình khi đăng xuất.
  const raw = readRefreshToken(req);
  let userId = null;
  // Logout không cấp thêm quyền hạn, chỉ thu hồi — nên không chặn theo origin.
  try {
    if (raw) {
      userId = refreshUserId(raw);
      if (userId) await revokeAllForUser(userId);
    }
  } catch (e) {
    console.warn("[logout] Thu hồi refresh token thất bại:", e.message);
  }
  if (userId) {
    audit({ req, actor: { sub: userId }, action: AUDIT.LOGOUT, target: userId, message: "Đăng xuất, thu hồi mọi phiên" }).catch(() => {});
  }
  clearRefreshCookie(res);
  sendSuccess(res, { loggedOut: true, cookie: REFRESH_COOKIE_NAME }, "logout.success");
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, name, generatedPassword, ageCode, gender } = req.body || {};
    if (!username || !password || !name) {
      return sendError(res, "Vui lòng nhập đầy đủ thông tin", 400);
    }
    if (password.length < 6) {
      return sendError(res, "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }
    const result = await registerUser({ username, email, password, name, generatedPassword, ageCode, gender });
    // Kèm refreshToken trong body như login — client iOS giữ bản này trong
    // localStorage vì cookie bên thứ ba bị WebKit chặn.
    const refreshRaw = await issueRefreshToken(result.user, { meta: sessionMeta(req) });
    setRefreshCookie(res, refreshRaw);
    audit({
      req,
      actor: { sub: result.user?.id, username: result.user?.username, name: result.user?.name, role: result.user?.role },
      action: AUDIT.REGISTER,
      target: result.user?.username || "",
      message: `Tạo tài khoản mới (${result.user?.role || "student"})`,
    }).catch(() => {});
    sendCreated(res, { ...result, refreshToken: refreshRaw });
  } catch (e) {
    const msg = e.message || "Đăng ký thất bại";
    if (msg.includes("tồn tại")) return sendError(res, msg, 409);
    next(e);
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const [userDoc, coins, games, permissions, roleIdentity, fullPet] = await Promise.all([
      getCollection("users").findOne({ id: req.user.sub }).catch(() => null),
      getCoins(req.user.sub).catch(() => 0),
      getByUser(req.user.sub).catch(() => []),
      getRolePermissions(req.user.role).catch(() => []),
      getRoleIdentity(req.user.role).catch(() => null),
      // Trạng thái thú cưng ĐẦY ĐỦ (cấp/EXP/tâm tính + `look`) — gộp từ
      // /api/pet cũ để hồ sơ là nguồn đọc pet duy nhất phía client.
      petService.getFullState(req.user.sub).catch(() => null),
    ]);

    let classInfo = null;
    if (userDoc?.classId) {
      classInfo = await getClassById(userDoc.classId).catch(() => null);
    }

    // Bản ghi sổ XP server thưởng (XP_LEDGER_GAME_ID) không phải một game thật
    // → không tính vào số game đã chơi / tổng lượt chơi.
    const realGames = games.filter((g) => g.gameId !== XP_LEDGER_GAME_ID);
    const totalPlays = realGames.reduce((s, g) => s + (g.gamesPlayed || 0), 0);
    // XP CHUẨN của hệ thống là `stats.totalXP` (Nguyên chốt 2026-11-02) = tổng
    // `experience` trên MỌI bản ghi tiến độ: experience theo từng game (do
    // client báo qua PUT /users/me/games) CỘNG bản ghi sổ XP server thưởng mà
    // addXp ghi vào. Mọi nơi hiển thị XP (Hồ sơ, Thành tựu qua /auth/me/xp,
    // danh sách người dùng) đều lấy đúng tổng này — xem getXp trong authService.
    const totalXP = games.reduce((s, g) => s + (g.experience || 0), 0);
    sendSuccess(res, {
      id: req.user.sub,
      username: req.user.username,
      name: req.user.name,
      email: userDoc?.email || null,
      role: req.user.role,
      // Cấu trúc vai trò cho client: [{ slug, name_vi, name_en }].
      roles: roleIdentity ? [roleIdentity] : [],
      // Quyền của vai trò này, gộp từ collection `roles` (kể cả vai trò tùy chỉnh
      // admin tạo trong trang Phân quyền) + quyền cơ bản:
      // ["games.view", "games.manage", "question_bank.edit", "chat", "profile", ...].
      permissions,
      coins,
      // Sao + XP (chuẩn) nằm ngay trên response — bản cũ thiếu `stars` khiến
      // trang Hồ sơ hiện 0 sao dù ví có sao (đã vá tạm ở frontend đợt 2, nay
      // backend trả đủ để client khỏi gọi thêm /me/wallet).
      stars: userDoc?.stars || 0,
      xp: totalXP,
      createdAt: userDoc?.createdAt || null,
      classId: userDoc?.classId || null,
      className: classInfo?.name || null,
      classCode: classInfo?.code || null,
      // Bộ đồ avatar do game tạo avatar lưu (không phải avatarLoadout).
      avatar: userDoc?.avatar || null,
      // Thú cưng: trạng thái ĐẦY ĐỦ từ petService (kèm `look` = bộ đồ
      // DressUp trong users.pet). Lỗi đọc pet thì lùi về bộ đồ thô như cũ.
      pet: fullPet ?? (userDoc?.pet || null),
      // Lớp + giới tính của bé. `ageCode` là mã opaque, tuổi thật chỉ client biết.
      ageCode: userDoc?.ageCode || null,
      gender: userDoc?.gender || null,
      stats: {
        totalPlays,
        totalXP,
        gamesPlayed: realGames.length,
      },
      // Không còn trả danh sách game: hồ sơ chỉ cần `stats`, còn tiến độ từng
      // game đã có GET /api/users/me/games (trang Hồ sơ gọi riêng endpoint đó).
    });
  } catch {
    sendSuccess(res, { id: req.user.sub, username: req.user.username, name: req.user.name, email: null, role: req.user.role, roles: [], permissions: [], coins: 0, stars: 0, xp: 0, createdAt: null, classId: null, className: null, classCode: null, avatar: null, pet: null, ageCode: null, gender: null, stats: { totalPlays: 0, totalXP: 0, gamesPlayed: 0 } });
  }
});

router.put("/me", authenticate, async (req, res, next) => {
  try {
    const updated = await updateProfile(req.user.sub, req.body || {});
    sendSuccess(res, updated);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

/**
 * POST /api/auth/change-password — đổi mật khẩu của chính mình.
 *
 * Body: { currentPassword, newPassword }.
 * Trang Cài đặt trong khu quản trị dùng endpoint này thay cho "Mã PIN" cũ
 * (mã PIN của src/games/_tools/admin.html chỉ là chuỗi hash nằm trong
 * localStorage của một máy, không chặn được gì).
 *
 * Mật khẩu đổi xong thì mọi refresh token của tài khoản bị thu hồi (máy khác
 * phải đăng nhập lại), riêng phiên đang gọi được cấp lại cookie mới nên người
 * quản trị không bị đá ra giữa lúc đang làm việc.
 */
router.post("/change-password", authenticate, async (req, res, next) => {
  try {
    const user = await changePassword(req.user.sub, req.body || {});
    await revokeAllForUser(user.id);
    const refreshRaw = await issueRefreshToken(user, { meta: sessionMeta(req) });
    setRefreshCookie(res, refreshRaw);
    // Chỉ ghi "đã đổi mật khẩu" — mật khẩu cũ/mới không bao giờ đi vào log.
    audit({ req, action: AUDIT.PASSWORD_CHANGE, target: req.user.username || req.user.sub, message: "Đổi mật khẩu, thu hồi mọi phiên khác" }).catch(() => {});
    // Kèm refreshToken mới trong body: phiên này vừa bị thu hồi cùng mọi
    // phiên khác, client không có cookie (iOS) phải nhận token mới qua đây
    // mới giữ được đăng nhập.
    sendSuccess(res, { changed: true, user: publicUser(user), refreshToken: refreshRaw });
  } catch (e) {
    audit({ req, action: AUDIT.PASSWORD_CHANGE, target: req.user.username || req.user.sub, result: "fail", message: e.message }).catch(() => {});
    sendError(res, e.message, 400);
  }
});

/**
 * GET /api/auth/sessions — danh sách phiên (refresh token) đang hoạt động của
 * CHÍNH tài khoản đang đăng nhập. Dựa trên collection `refresh_tokens` đã có sẵn
 * từ cơ chế JWT + rotation, không tạo thêm cơ chế phiên mới.
 * Response chỉ có id/thời gian/thiết bị — không có token hay hash.
 */
router.get("/sessions", authenticate, async (req, res, next) => {
  try {
    const items = await listSessions(req.user.sub, readRefreshToken(req));
    const current = items.find((s) => s.current) || null;
    sendSuccess(res, {
      items,
      total: items.length,
      current: current ? { createdAt: current.createdAt, expiresAt: current.expiresAt, userAgent: current.userAgent, ip: current.ip } : null,
      account: { id: req.user.sub, username: req.user.username, name: req.user.name, role: req.user.role },
    });
  } catch (e) { next(e); }
});

/**
 * DELETE /api/auth/sessions — thu hồi phiên.
 *   ?others=true → đá mọi thiết bị KHÁC, giữ phiên đang gọi (admin dùng nút
 *   "Đăng xuất tất cả thiết bị" mà không bị mất phiên của mình).
 *   không có query → thu hồi toàn bộ, kể cả phiên hiện tại (cookie bị xoá,
 *   client phải đăng nhập lại).
 */
router.delete("/sessions", authenticate, async (req, res, next) => {
  try {
    const keepCurrent = req.query.others === "true" || req.query.others === "1";
    const raw = readRefreshToken(req);
    const revoked = keepCurrent ? await revokeOtherSessions(req.user.sub, raw) : await revokeAllForUserCount(req.user.sub);
    if (!keepCurrent) clearRefreshCookie(res);
    await audit({
      req,
      action: AUDIT.SESSIONS_REVOKE,
      target: req.user.username || req.user.sub,
      message: keepCurrent ? `Đã đá ${revoked} phiên khác` : `Thu hồi toàn bộ ${revoked} phiên (kể cả máy hiện tại)`,
      meta: { revoked, keepCurrent },
    });
    sendSuccess(res, { revoked, keepCurrent, loggedOut: !keepCurrent });
  } catch (e) { next(e); }
});

// ── Ví tiền (coin + sao) ──────────────────────────────────────────────────
// Coin và sao trước đây có 2 cặp endpoint riêng; gộp lại thành /me/wallet vì
// mọi giao dịch đổi tiền tệ đều chạm cả hai loại cùng lúc.
// GET /api/auth/me/wallet — số dư + tỷ giá + catalog thành tựu đổi bằng sao
router.get("/me/wallet", authenticate, async (req, res, next) => {
  try {
    sendSuccess(res, await getWallet(req.user.sub));
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/me/wallet — cộng/trừ coin và sao: { coins?, stars? }
router.post("/me/wallet", authenticate, async (req, res, next) => {
  try {
    const { coins, stars } = req.body || {};
    if (coins === undefined && stars === undefined) {
      return sendError(res, "Cần truyền coins hoặc stars (kiểu số)", 400);
    }
    sendSuccess(res, await adjustWallet(req.user.sub, { coins, stars }));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// POST /api/auth/me/wallet/daily-gift — nhận quà sao, mỗi ngày 1 lần.
router.post("/me/wallet/daily-gift", authenticate, async (req, res, next) => {
  try {
    sendSuccess(res, await claimDailyStarGift(req.user.sub));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// GET /api/auth/me/xp — get XP / level
router.get("/me/xp", authenticate, async (req, res, next) => {
  try {
    sendSuccess(res, await getXp(req.user.sub));
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/me/wallet/exchange — đổi qua lại coin ⇄ sao
// body: { direction: "coinToStar" | "starToCoin", amount? } (bỏ trống = đổi hết)
router.post("/me/wallet/exchange", authenticate, async (req, res, next) => {
  try {
    const { direction, amount } = req.body || {};
    if (direction !== "coinToStar" && direction !== "starToCoin") {
      return sendError(res, 'direction phải là "coinToStar" hoặc "starToCoin"', 400);
    }
    sendSuccess(res, await exchangeWallet(req.user.sub, { direction, amount }));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// POST /api/auth/me/wallet/redeem — đổi sao lấy thành tựu: { achievementId }
router.post("/me/wallet/redeem", authenticate, async (req, res, next) => {
  try {
    const { achievementId } = req.body || {};
    if (!achievementId) return sendError(res, "achievementId là bắt buộc", 400);
    sendSuccess(res, await redeemAchievement(req.user.sub, achievementId));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// ── Vé (tickets) ─────────────────────────────────────────────────────────
// Client (ticketService) đã gọi 3 endpoint này từ lâu nhưng server chưa
// từng có → cộng vé ở DailyGift/thắng game đều 404. Rule permission
// /^\/auth\/me/ (quyền `profile`) đã bao phủ cả cụm này như /me/wallet.

// GET /api/auth/me/tickets — vé chưa dùng + số lượng
router.get("/me/tickets", authenticate, async (req, res, next) => {
  try {
    sendSuccess(res, await getTickets(req.user.sub));
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/me/tickets — cộng vé: { amount }
router.post("/me/tickets", authenticate, async (req, res) => {
  try {
    const { amount } = req.body || {};
    if (amount === undefined) return sendError(res, "Cần truyền amount (kiểu số)", 400);
    sendSuccess(res, await addTickets(req.user.sub, amount));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// POST /api/auth/me/tickets/:ticketId/use — dùng 1 vé
router.post("/me/tickets/:ticketId/use", authenticate, async (req, res) => {
  try {
    sendSuccess(res, await useTicket(req.user.sub, req.params.ticketId));
  } catch (e) {
    sendError(res, e.message, e.status || 400);
  }
});

export default router;
