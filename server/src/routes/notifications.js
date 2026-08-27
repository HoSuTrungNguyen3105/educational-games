import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as notificationService from "../services/notificationService.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();

// GET /api/notifications — list current user's notifications
router.get("/", authenticate, async (req, res, next) => {
  try {
    const unreadOnly = req.query.unread === "true";
    const notifications = await notificationService.listByUser(req.user.sub, { unreadOnly });
    sendSuccess(res, notifications);
  } catch (e) {
    next(e);
  }
});

// GET /api/notifications/unread-count
router.get("/unread-count", authenticate, async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.sub);
    sendSuccess(res, { count });
  } catch (e) {
    next(e);
  }
});

// POST /api/notifications/:id/read
router.post("/:id/read", authenticate, async (req, res, next) => {
  try {
    await notificationService.markRead(req.params.id, req.user.sub);
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/notifications/read-all
router.post("/read-all", authenticate, async (req, res, next) => {
  try {
    await notificationService.markAllRead(req.user.sub);
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
