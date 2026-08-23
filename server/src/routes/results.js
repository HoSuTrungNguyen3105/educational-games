import { Router } from "express";
import * as resultService from "../services/resultService.js";
import { sendSuccess, sendCreated, sendError, buildPagination } from "../utils/response.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await resultService.listAll();
    const pagination = buildPagination({ total: data.length });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/game/:gameId", async (req, res, next) => {
  try {
    const data = await resultService.listByGame(req.params.gameId);
    const pagination = buildPagination({ total: data.length });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const entry = await resultService.submit(req.body);
    sendCreated(res, entry);
  } catch (e) {
    next(e);
  }
});

export default router;
