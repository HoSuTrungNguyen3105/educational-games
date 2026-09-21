import { Router } from "express";
import * as reminderService from "../services/reminderService.js";
import { verifyToken } from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/response.js";

const r = Router();

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return sendError(res, "Unauthorized", 401);
  try { req.user = verifyToken(h.slice(7)); next(); } catch { sendError(res, "Invalid token", 401); }
}

// List reminders
r.get("/", auth, async (req, res) => {
  try {
    const reminders = await reminderService.getReminders(req.user.sub);
    sendSuccess(res, reminders);
  } catch (e) { sendError(res, e.message, 500); }
});

// Get upcoming reminders (next N minutes)
r.get("/upcoming", auth, async (req, res) => {
  try {
    const minutes = parseInt(req.query.minutes) || 60;
    const reminders = await reminderService.getUpcomingReminders(req.user.sub, minutes);
    sendSuccess(res, reminders);
  } catch (e) { sendError(res, e.message, 500); }
});

// Get due reminders (for polling / trigger check)
r.get("/due", auth, async (req, res) => {
  try {
    const reminders = await reminderService.getDueReminders();
    sendSuccess(res, reminders);
  } catch (e) { sendError(res, e.message, 500); }
});

// Create reminder
r.post("/", auth, async (req, res) => {
  try {
    const { title, message, remindAt, repeat, type, relatedId, vibrate, sound } = req.body;
    if (!title || !remindAt) return sendError(res, "title và remindAt là bắt buộc", 400);
    const reminder = await reminderService.createReminder({
      userId: req.user.sub,
      title,
      message,
      remindAt,
      repeat,
      type,
      relatedId,
      vibrate,
      sound,
    });

    // Send confirmation push
    try {
      const { sendPushToUser } = await import("../services/fcmService.js");
      const dt = new Date(remindAt);
      const timeStr = dt.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      await sendPushToUser(req.user.sub, {
        title: "✅ Đã đặt nhắc nhở",
        body: `"${title}" lúc ${timeStr}`,
        type: "REMINDER_CREATED",
        data: { reminderId: reminder.id },
      });
    } catch { /* push fail ok */ }

    sendSuccess(res, reminder);
  } catch (e) { sendError(res, e.message, 400); }
});

// Update reminder
r.put("/:id", auth, async (req, res) => {
  try {
    const existing = await reminderService.getReminderById(req.params.id);
    if (!existing) return sendError(res, "Không tìm thấy nhắc nhở", 404);
    if (existing.userId !== req.user.sub) return sendError(res, "Forbidden", 403);
    const updated = await reminderService.updateReminder(req.params.id, req.body);
    sendSuccess(res, updated);
  } catch (e) { sendError(res, e.message, 400); }
});

// Mark as triggered
r.post("/:id/trigger", auth, async (req, res) => {
  try {
    await reminderService.markTriggered(req.params.id);
    sendSuccess(res, { ok: true });
  } catch (e) { sendError(res, e.message, 400); }
});

// Delete reminder
r.delete("/:id", auth, async (req, res) => {
  try {
    const existing = await reminderService.getReminderById(req.params.id);
    if (!existing) return sendError(res, "Không tìm thấy nhắc nhở", 404);
    if (existing.userId !== req.user.sub) return sendError(res, "Forbidden", 403);
    await reminderService.deleteReminder(req.params.id);
    sendSuccess(res, { ok: true });
  } catch (e) { sendError(res, e.message, 500); }
});

export default r;
