import { Router } from "express";
import { verifyCredentials, signToken, publicUser, registerUser, updateProfile, getCoins, addCoins, getStars, addStars, exchangeStarsForCoins } from "../services/authService.js";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { getByUser } from "../services/gameProgressService.js";
import { getCollection } from "../db.js";
import { trackAction } from "../services/dailyTaskService.js";
import { processTaskEvent } from "../services/taskEngineService.js";

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

router.get("/me", authenticate, async (req, res) => {
  try {
    const [userDoc, coins, games] = await Promise.all([
      getCollection("users").findOne({ id: req.user.sub }).catch(() => null),
      getCoins(req.user.sub).catch(() => 0),
      getByUser(req.user.sub).catch(() => []),
    ]);

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
    sendSuccess(res, { id: req.user.sub, username: req.user.username, name: req.user.name, email: null, role: req.user.role, coins: 0, createdAt: null, stats: { totalPlays: 0, totalXP: 0, gamesPlayed: 0 }, games: [] });
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

// GET /api/auth/me/coins — get global coins
router.get("/me/coins", authenticate, async (req, res, next) => {
  try {
    const coins = await getCoins(req.user.sub);
    sendSuccess(res, { coins });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/me/coins — add/deduct coins (global)
router.post("/me/coins", authenticate, async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (amount === undefined || typeof amount !== "number") {
      return sendError(res, "amount (number) is required", 400);
    }
    const coins = await addCoins(req.user.sub, amount);
    sendSuccess(res, { coins });
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// GET /api/auth/me/stars — get global stars
router.get("/me/stars", authenticate, async (req, res, next) => {
  try {
    const stars = await getStars(req.user.sub);
    sendSuccess(res, { stars });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/me/stars — add stars
router.post("/me/stars", authenticate, async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (amount === undefined || typeof amount !== "number") {
      return sendError(res, "amount (number) is required", 400);
    }
    const stars = await addStars(req.user.sub, amount);
    sendSuccess(res, { stars });
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// POST /api/auth/me/stars/exchange — exchange all stars for coins
router.post("/me/stars/exchange", authenticate, async (req, res, next) => {
  try {
    const result = await exchangeStarsForCoins(req.user.sub);
    sendSuccess(res, result);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

export default router;
