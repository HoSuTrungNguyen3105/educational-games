import { getCollection } from "../db.js";

function uid() {
  return "rmnd-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export async function createReminder({ userId, title, message, remindAt, repeat = "none", type = "CUSTOM", relatedId = null, vibrate = true, sound = true }) {
  const doc = {
    id: uid(),
    userId,
    title,
    message: message || "",
    remindAt,
    repeat,
    type,
    relatedId,
    vibrate,
    sound,
    triggered: false,
    createdAt: new Date().toISOString(),
  };
  await getCollection("reminders").insertOne(doc);
  return doc;
}

export async function getReminders(userId) {
  return getCollection("reminders")
    .find({ userId })
    .sort({ remindAt: 1 })
    .toArray();
}

export async function getReminderById(id) {
  return getCollection("reminders").findOne({ id });
}

export async function updateReminder(id, data) {
  const allowed = ["title", "message", "remindAt", "repeat", "type", "relatedId", "triggered"];
  const update = {};
  for (const k of allowed) {
    if (data[k] !== undefined) update[k] = data[k];
  }
  update.updatedAt = new Date().toISOString();
  await getCollection("reminders").updateOne({ id }, { $set: update });
  return getReminderById(id);
}

export async function deleteReminder(id) {
  await getCollection("reminders").deleteOne({ id });
  return true;
}

export async function getDueReminders() {
  const now = new Date().toISOString();
  return getCollection("reminders")
    .find({
      remindAt: { $lte: now },
      triggered: false,
    })
    .toArray();
}

export async function markTriggered(id) {
  await getCollection("reminders").updateOne({ id }, { $set: { triggered: true } });
}

export async function getUpcomingReminders(userId, withinMinutes = 60) {
  const now = new Date();
  const future = new Date(now.getTime() + withinMinutes * 60000).toISOString();
  return getCollection("reminders")
    .find({
      userId,
      remindAt: { $gte: now.toISOString(), $lte: future },
      triggered: false,
    })
    .sort({ remindAt: 1 })
    .toArray();
}

/**
 * Process due reminders: send push notifications + handle repeat.
 * Called by the background scheduler every 60s.
 */
export async function processDueReminders() {
  const { sendPushToUser } = await import("./fcmService.js");

  const due = await getDueReminders();
  if (due.length === 0) return;

  console.log(`[Reminder] Found ${due.length} due reminder(s), sending push...`);

  for (const r of due) {
    try {
      // Send push notification
      const result = await sendPushToUser(r.userId, {
        title: "🔔 " + r.title,
        body: r.message || "Đến giờ nhắc nhở!",
        type: "REMINDER",
        data: { reminderId: r.id, remindAt: r.remindAt, vibrate: String(r.vibrate !== false), sound: String(r.sound !== false) },
      });
      console.log(`[Reminder] Push to ${r.userId}: sent=${result.sent}, reason=${result.reason || "ok"}`);

      // Handle repeat
      if (r.repeat && r.repeat !== "none") {
        const current = new Date(r.remindAt);
        let next;
        if (r.repeat === "daily") {
          next = new Date(current.getTime() + 86400000);
        } else if (r.repeat === "weekly") {
          next = new Date(current.getTime() + 7 * 86400000);
        }
        if (next) {
          await updateReminder(r.id, {
            remindAt: next.toISOString(),
            triggered: false,
          });
          console.log(`[Reminder] Repeated ${r.id} → next: ${next.toISOString()}`);
          continue; // skip markTriggered, it's rescheduled
        }
      }

      // Mark as triggered (non-repeating)
      await markTriggered(r.id);
    } catch (e) {
      console.error(`[Reminder] Error processing ${r.id}:`, e.message);
    }
  }
}
