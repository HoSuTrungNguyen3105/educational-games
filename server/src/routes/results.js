import { Router } from "express";
import * as resultService from "../services/resultService.js";

const router = Router();

// GET /api/results
router.get("/", async (req, res, next) => {
  try {
    res.json(await resultService.listAll());
  } catch (e) {
    next(e);
  }
});

// GET /api/results/game/:gameId
router.get("/game/:gameId", async (req, res, next) => {
  try {
    const results = await resultService.listByGame(req.params.gameId);
    res.json(results);
  } catch (e) {
    next(e);
  }
});

// POST /api/results
router.post("/", async (req, res, next) => {
  try {
    const entry = await resultService.submit(req.body);
    res.status(201).json(entry);
  } catch (e) {
    next(e);
  }
});

export default router;