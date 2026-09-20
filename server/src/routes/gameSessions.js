import { Router } from "express";
import { sendSuccess, sendError } from "../utils/response.js";
import * as gameSessionService from "../services/gameSessionService.js";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const session = await gameSessionService.getSession(req.params.id);
    if (!session) return sendError(res, "Session không tồn tại", 404);
    sendSuccess(res, session);
  } catch (e) {
    sendError(res, e.message, 500);
  }
});

router.get("/by-code/:code", async (req, res) => {
  try {
    const session = await gameSessionService.getSessionByCode(req.params.code);
    if (!session) return sendError(res, "Không tìm thấy phòng", 404);
    sendSuccess(res, session);
  } catch (e) {
    sendError(res, e.message, 500);
  }
});

router.get("/active/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return sendError(res, "Unauthorized", 401);
    const { verifyToken } = await import("../services/authService.js");
    const payload = verifyToken(authHeader.slice(7));
    const session = await gameSessionService.getActiveSessionByUser(payload.sub);
    sendSuccess(res, session || null);
  } catch {
    sendSuccess(res, null);
  }
});

router.post("/:id/join", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return sendError(res, "Unauthorized", 401);
    const { verifyToken } = await import("../services/authService.js");
    const payload = verifyToken(authHeader.slice(7));
    const session = await gameSessionService.joinSession(req.params.id, {
      guestUserId: payload.sub,
      guestName: payload.name,
    });
    if (!session) return sendError(res, "Session không tồn tại hoặc đã đầy", 404);
    sendSuccess(res, session);
  } catch (e) {
    sendError(res, e.message, 500);
  }
});

router.post("/:id/end", async (req, res) => {
  try {
    const session = await gameSessionService.endSession(req.params.id);
    if (!session) return sendError(res, "Session không tồn tại", 404);
    sendSuccess(res, session);
  } catch (e) {
    sendError(res, e.message, 500);
  }
});

export default router;
