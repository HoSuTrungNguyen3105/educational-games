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
    console.log(`[API] device-token registered/updated for user=${req.user.sub} active=${device.isActive}`);
    sendSuccess(res, device);
  } catch (e) { next(e); }
});

// DELETE /api/notifications/device-token — remove device
router.delete("/device-token", authenticate, async (req, res, next) => {
  try {
    const { token } = req.body || {};
    if (!token) return sendError(res, "Token là bắt buộc", 400);
    const removed = await userDeviceService.removeDevice(token);
    console.log(`[API] device-token removed for user=${req.user.sub} removed=${removed}`);
    sendSuccess(res, { ok: true });
  } catch (e) { next(e); }
});

// (GET /api/notifications/devices đã bị gỡ: không còn caller nào trong
// client — client chỉ đăng ký/gỡ device-token và reset toàn bộ token.)

// DELETE /api/notifications/devices/reset — reset all device tokens for current user (re-register after reinstall)
router.delete("/devices/reset", authenticate, async (req, res, next) => {
  try {
    const result = await userDeviceService.deactivateAllByUser(req.user.sub);
    sendSuccess(res, { ok: true, deactivated: result.modifiedCount });
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

// DELETE /api/notifications/all — xóa hết thông báo (dùng để test)
router.delete("/all", authenticate, async (req, res, next) => {
  try {
    const { getCollection } = await import("../db.js");
    const result = await getCollection("notifications").deleteMany({ toUserId: req.user.sub });
    sendSuccess(res, { deleted: result.deletedCount });
  } catch (e) {
    next(e);
  }
});

// POST /api/notifications/test-push — send a test push notification to current user's registered devices
router.post("/test-push", authenticate, async (req, res, next) => {
  try {
    const { sendPushToUser } = await import("../services/fcmService.js");
    console.log(`[API] test-push requested by user: ${req.user.sub}`);
    const result = await sendPushToUser(req.user.sub, {
      title: "🧪 Kiểm tra thông báo",
      body: "Chúc mừng! Thiết bị di động của bạn đã nhận được thông báo đẩy từ EduPlay.",
      type: "TEST",
      data: { test: "true", timestamp: new Date().toISOString() },
    });
    console.log(`[API] test-push result:`, JSON.stringify(result));
    // Hiển thị thông báo về token đã bị remove
    if (result.invalidTokensRemoved > 0) {
      console.log(`[API] ${result.invalidTokensRemoved} token(s) không còn hợp lệ đã được xóa khỏi database.`);
    }
    sendSuccess(res, result);
  } catch (e) {
    console.error("[API] test-push error:", e);
    next(e);
  }
});

export default router;
