import { Router } from "express";
import { verifyCredentials, signToken, publicUser, registerUser, updateProfile, getCoins, getWallet, adjustWallet, exchangeWallet, redeemAchievement, getXp, claimDailyStarGift } from "../services/authService.js";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { getByUser } from "../services/gameProgressService.js";
import { getCollection } from "../db.js";
import { trackAction } from "../services/dailyTaskService.js";
import { processTaskEvent } from "../services/taskEngineService.js";
import { getClassById } from "../services/classService.js";

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
    trackAction(user.id, "login", 1).catch(() => {});
    processTaskEvent(user.id, { type: "LOGIN" }).catch(() => {});
    sendSuccess(res, { token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, name, generatedPassword } = req.body || {};
    if (!username || !password || !name) {
      return sendError(res, "Vui lòng nhập đầy đủ thông tin", 400);
    }
    if (password.length < 6) {
      return sendError(res, "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }
    const result = await registerUser({ username, email, password, name, generatedPassword });
    sendCreated(res, result);
  } catch (e) {
    const msg = e.message || "Đăng ký thất bại";
    if (msg.includes("tồn tại")) return sendError(res, msg, 409);
    next(e);
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const [userDoc, coins, games] = await Promise.all([
      getCollection("users").findOne({ id: req.user.sub }).catch(() => null),
      getCoins(req.user.sub).catch(() => 0),
      getByUser(req.user.sub).catch(() => []),
    ]);

    let classInfo = null;
    if (userDoc?.classId) {
      classInfo = await getClassById(userDoc.classId).catch(() => null);
    }

    const gameIds = games.map(g => g.gameId).filter(Boolean);
    const gameDocs = gameIds.length
      ? await getCollection("games").find({ _id: { $in: gameIds } }).toArray().catch(() => [])
      : [];
    const gameDocMap = {};
    gameDocs.forEach(d => { gameDocMap[d._id.toString()] = d; });

    const totalPlays = games.reduce((s, g) => s + (g.gamesPlayed || 0), 0);
    const totalXP = games.reduce((s, g) => s + (g.experience || 0), 0);
    sendSuccess(res, {
      id: req.user.sub,
      username: req.user.username,
      name: req.user.name,
      email: userDoc?.email || null,
      role: req.user.role,
      coins,
      createdAt: userDoc?.createdAt || null,
      classId: userDoc?.classId || null,
      className: classInfo?.name || null,
      classCode: classInfo?.code || null,
      // Bộ đồ avatar + thú cưng do game tạo avatar lưu (không phải avatarLoadout).
      avatar: userDoc?.avatar || null,
      pet: userDoc?.pet || null,
      stats: {
        totalPlays,
        totalXP,
        gamesPlayed: games.length,
      },
      games: games.map(g => {
        const doc = gameDocMap[g.gameId] || {};
        return {
          gameId: g.gameId,
          name: doc.name || g.gameName || g.gameId,
          description: doc.description || null,
          subject: doc.subject || null,
          topic: doc.topic || null,
          language: doc.language || null,
          type: doc.type || null,
          status: doc.status || null,
          code: doc.code || null,
          questionsCount: doc.questionsCount || 0,
          playersCount: doc.playersCount || 0,
          level: g.level || 1,
          experience: g.experience || 0,
          progress: g.progress || 0,
          gamesPlayed: g.gamesPlayed || 0,
          questsCompleted: g.questsCompleted || 0,
          inventory: g.inventory || [],
          loadout: g.loadout || null,
          lastPlayedAt: g.lastPlayedAt || g.updatedAt,
          createdAt: doc.createdAt || null,
          updatedAt: doc.updatedAt || null,
        };
      }),
    });
  } catch {
    sendSuccess(res, { id: req.user.sub, username: req.user.username, name: req.user.name, email: null, role: req.user.role, coins: 0, createdAt: null, classId: null, className: null, classCode: null, avatar: null, pet: null, stats: { totalPlays: 0, totalXP: 0, gamesPlayed: 0 }, games: [] });
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

export default router;
