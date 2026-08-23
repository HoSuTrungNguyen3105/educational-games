import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as gameProgressService from "../services/gameProgressService.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users/me/games — list all game progress for the user
router.get("/me/games", async (req, res, next) => {
  try {
    const list = await gameProgressService.getByUser(req.user.sub);
    const mapped = list.map((p) => ({
      gameId: p.gameId,
      name: p.gameName || p.gameId,
      progress: p.progress || 0,
      level: p.level || 1,
      coins: p.coins || 0,
      experience: p.experience || 0,
      gamesPlayed: p.gamesPlayed || 0,
      lastPlayedAt: p.lastPlayedAt || p.updatedAt,
    }));
    sendSuccess(res, mapped);
  } catch (e) {
    next(e);
  }
});

// GET /api/users/me/games/:gameId — get progress for a specific game
router.get("/me/games/:gameId", async (req, res, next) => {
  try {
    const progress = await gameProgressService.getByUserAndGame(
      req.user.sub,
      req.params.gameId
    );
    if (!progress) {
      return sendSuccess(res, {
        gameId: req.params.gameId,
        coins: 0,
        level: 1,
        experience: 0,
        progress: 0,
        gamesPlayed: 0,
        questsCompleted: 0,
        inventory: [],
      });
    }
    sendSuccess(res, {
      gameId: progress.gameId,
      coins: progress.coins || 0,
      level: progress.level || 1,
      experience: progress.experience || 0,
      progress: progress.progress || 0,
      gamesPlayed: progress.gamesPlayed || 0,
      questsCompleted: progress.questsCompleted || 0,
      inventory: progress.inventory || [],
      lastPlayedAt: progress.lastPlayedAt,
    });
  } catch (e) {
    next(e);
  }
});

// PUT /api/users/me/games/:gameId — upsert progress (coins, level, experience, etc.)
router.put("/me/games/:gameId", async (req, res, next) => {
  try {
    const { coins, level, experience, progress, gamesPlayed, questsCompleted, inventory, gameName } = req.body || {};
    const data = {};
    if (coins !== undefined) data.coins = coins;
    if (level !== undefined) data.level = level;
    if (experience !== undefined) data.experience = experience;
    if (progress !== undefined) data.progress = progress;
    if (gamesPlayed !== undefined) data.gamesPlayed = gamesPlayed;
    if (questsCompleted !== undefined) data.questsCompleted = questsCompleted;
    if (inventory !== undefined) data.inventory = inventory;
    if (gameName !== undefined) data.gameName = gameName;

    const result = await gameProgressService.upsert(req.user.sub, req.params.gameId, data);
    sendSuccess(res, {
      gameId: result.gameId,
      coins: result.coins || 0,
      level: result.level || 1,
      experience: result.experience || 0,
      progress: result.progress || 0,
      gamesPlayed: result.gamesPlayed || 0,
      questsCompleted: result.questsCompleted || 0,
      inventory: result.inventory || [],
      lastPlayedAt: result.lastPlayedAt,
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/users/me/games/:gameId/coins — add/deduct coins
router.post("/me/games/:gameId/coins", async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (amount === undefined || typeof amount !== "number") {
      return sendError(res, "amount (number) is required", 400);
    }
    const result = await gameProgressService.incrementCoins(req.user.sub, req.params.gameId, amount);
    sendSuccess(res, { gameId: result.gameId, coins: result.coins });
  } catch (e) {
    next(e);
  }
});

// POST /api/users/me/games/:gameId/experience — add experience
router.post("/me/games/:gameId/experience", async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    if (amount === undefined || typeof amount !== "number") {
      return sendError(res, "amount (number) is required", 400);
    }
    const result = await gameProgressService.incrementExperience(req.user.sub, req.params.gameId, amount);
    sendSuccess(res, { gameId: result.gameId, experience: result.experience });
  } catch (e) {
    next(e);
  }
});

// POST /api/users/me/games/:gameId/play — increment gamesPlayed
router.post("/me/games/:gameId/play", async (req, res, next) => {
  try {
    const result = await gameProgressService.incrementGamesPlayed(req.user.sub, req.params.gameId);
    sendSuccess(res, { gameId: result.gameId, gamesPlayed: result.gamesPlayed });
  } catch (e) {
    next(e);
  }
});

// POST /api/users/me/games/:gameId/inventory — add item
router.post("/me/games/:gameId/inventory", async (req, res, next) => {
  try {
    const { itemId, quantity } = req.body || {};
    if (!itemId) return sendError(res, "itemId is required", 400);
    const result = await gameProgressService.addInventoryItem(
      req.user.sub,
      req.params.gameId,
      { itemId, quantity: quantity || 1 }
    );
    sendSuccess(res, { gameId: result.gameId, inventory: result.inventory });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/users/me/games/:gameId/inventory/:itemId — remove item
router.delete("/me/games/:gameId/inventory/:itemId", async (req, res, next) => {
  try {
    const { quantity } = req.query || {};
    const result = await gameProgressService.removeInventoryItem(
      req.user.sub,
      req.params.gameId,
      req.params.itemId,
      Number(quantity) || 1
    );
    if (!result) return sendError(res, "Item not found", 404);
    sendSuccess(res, { gameId: result.gameId, inventory: result.inventory });
  } catch (e) {
    next(e);
  }
});

// ── Admin routes ──
const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(requireRoles("teacher", "admin"));

// GET /api/users/game-progress — list all users' game progress
adminRouter.get("/game-progress", async (req, res, next) => {
  try {
    const all = await gameProgressService.listAll();
    // Enrich with game names from games collection
    const { getCollection } = await import("../db.js");
    const games = await getCollection("games").find({}).toArray();
    const gameNameMap = {};
    games.forEach(g => { gameNameMap[g.code] = g.name; });
    const enriched = all.map(p => ({
      ...p,
      gameName: gameNameMap[p.gameId] || p.gameName || p.gameId,
    }));
    sendSuccess(res, enriched);
  } catch (e) {
    next(e);
  }
});

// PUT /api/users/game-progress/:id — admin update any user's progress
adminRouter.put("/game-progress/:id", async (req, res, next) => {
  try {
    const { coins, level, experience, progress, gamesPlayed, questsCompleted } = req.body || {};
    const data = {};
    if (coins !== undefined) data.coins = coins;
    if (level !== undefined) data.level = level;
    if (experience !== undefined) data.experience = experience;
    if (progress !== undefined) data.progress = progress;
    if (gamesPlayed !== undefined) data.gamesPlayed = gamesPlayed;
    if (questsCompleted !== undefined) data.questsCompleted = questsCompleted;

    const { getCollection } = await import("../db.js");
    const doc = await getCollection("userGameProgress").findOne({ _id: req.params.id });
    if (!doc) return sendError(res, "Not found", 404);

    await getCollection("userGameProgress").updateOne(
      { _id: req.params.id },
      { $set: { ...data, updatedAt: new Date().toISOString() } }
    );
    sendSuccess(res, { ...doc, ...data });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/users/game-progress/:id — admin delete progress entry
adminRouter.delete("/game-progress/:id", async (req, res, next) => {
  try {
    const { getCollection } = await import("../db.js");
    await getCollection("userGameProgress").deleteOne({ _id: req.params.id });
    sendSuccess(res, { deleted: true });
  } catch (e) {
    next(e);
  }
});

export default router;
export { adminRouter };
