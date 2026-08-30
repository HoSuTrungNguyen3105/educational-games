import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as notificationService from "../services/notificationService.js";
import * as userDeviceService from "../services/userDeviceService.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();

// ── Device Token Management ──

// POST /api/notifications/device-token — register device
router.post("/device-token", authenticate, async (req, res, next) => {
  try {
    const { token, deviceType } = req.body || {};
    if (!token) return sendError(res, "Token là bắt buộc", 400);
    const device = await userDeviceService.registerDevice(req.user.sub, token, deviceType || "WEB");
    sendSuccess(res, device);
  } catch (e) { next(e); }
});

// DELETE /api/notifications/device-token — remove device
router.delete("/device-token", authenticate, async (req, res, next) => {
  try {
    const { token } = req.body || {};
    if (!token) return sendError(res, "Token là bắt buộc", 400);
    await userDeviceService.removeDevice(token);
    sendSuccess(res, { ok: true });
  } catch (e) { next(e); }
});

// GET /api/notifications/devices — list user's devices
router.get("/devices", authenticate, async (req, res, next) => {
  try {
    const devices = await userDeviceService.getDevicesByUser(req.user.sub);
    sendSuccess(res, devices);
  } catch (e) { next(e); }
});

// ── Notification CRUD ──

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
