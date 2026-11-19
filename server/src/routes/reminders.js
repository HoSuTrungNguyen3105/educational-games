import { Router } from "express";
import * as reminderService from "../services/reminderService.js";
import { verifyToken } from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { respondWithRange } from "../utils/rangeList.js";
import { foldText } from "../utils/textFold.js";

const r = Router();

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return sendError(res, "Unauthorized", 401);
  try { req.user = verifyToken(h.slice(7)); next(); } catch { sendError(res, "Invalid token", 401); }
}

// Gập dấu dùng helper dùng chung server/src/utils/textFold.js (cùng thuật
// toán với matchesQuery phía client) — xem ghi chú ở đó.

// List reminders
// Lọc tuỳ chọn (chỉ áp khi client GỬI, không gửi → hành vi cũ nguyên vẹn):
//   ?triggered=true|false — trang /dashboard/reminders phân trang RIÊNG hai
//     mục "Sắp tới" (chưa triggered) và "Đã nhắc" (đã triggered) nên cần
//     server lọc theo cờ này TRƯỚC khi cắt from/to, nếu không tổng số và
//     đoạn cắt của từng mục sẽ sai.
//   ?q=<từ khoá> — tìm theo tiêu đề/ghi chú, không phân biệt hoa thường và
//     dấu (giữ nguyên ngữ nghĩa ô tìm kiếm vốn lọc ở client trước đây).
// Cả hai lọc đều chạy trên danh sách của CHÍNH user (đã lọc theo userId ở
// service) và chạy TRƯỚC respondWithRange → pagination.total là tổng của
// tập ĐÃ lọc.
r.get("/", auth, async (req, res) => {
  try {
    let reminders = await reminderService.getReminders(req.user.sub);
    if (req.query.triggered === "true" || req.query.triggered === "false") {
      const want = req.query.triggered === "true";
      reminders = reminders.filter((x) => Boolean(x.triggered) === want);
    }
    const q = foldText(req.query.q).trim();
    if (q) {
      reminders = reminders.filter(
        (x) => foldText(x.title).includes(q) || foldText(x.message).includes(q)
      );
    }
    if (respondWithRange(req, res, reminders)) return;
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
    const { title, message, remindAt, repeat, type, relatedId, vibrate, sound, vibratePattern } = req.body;
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
      vibratePattern,
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
