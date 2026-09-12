import { getCollection } from "../db.js";
import { sendPushToUser } from "./fcmService.js";
import * as classService from "./classService.js";

const COLLECTION = "notifications";
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export async function createNotification({ fromUserId, fromUsername, fromName, toUserId, gameId, gameName, gameCode, type = "SYSTEM", title, message, data, ...rest }) {
  const now = new Date().toISOString();
  const doc = {
    id: uid("notif"),
    fromUserId,
    fromUsername,
    fromName,
    toUserId,
    gameId,
    gameName,
    gameCode,
    type,
    title: title || getDefaultTitle(type),
    message: message || "",
    data: data || {},
    read: false,
    sentAt: now,
    createdAt: now,
    ...rest,
  };
  await getCollection(COLLECTION).insertOne(doc);

  // Send push notification in background (don't block)
  sendPushToUser(toUserId, { title: doc.title, body: doc.message, type, data }).catch(() => {});

  return doc;
}

function getDefaultTitle(type) {
  const titles = {
    GAME_MISSION: "🎮 Nhiệm vụ mới",
    GAME_REWARD: "🎁 Phần thưởng",
    DAILY_MISSION: "📋 Nhiệm vụ hàng ngày",
    NEW_LESSON: "📚 Bài học mới",
    TEACHER_ASSIGNMENT: "📝 Bài tập mới",
    MESSAGE: "💬 Tin nhắn",
    LEVEL_UP: "🏆 Lên cấp!",
    ITEM_REWARD: "🎁 Nhận vật phẩm",
    COOP_INVITATION: "👥 Lời mời chơi",
    DEADLINE_REMINDER: "⏰ Bài tập sắp hết hạn",
    SYSTEM: "🔔 Thông báo",
  };
  return titles[type] || "🔔 Thông báo";
}

export async function listByUser(userId, { unreadOnly = false, limit = 50 } = {}) {
  const query = { toUserId: userId };
  if (unreadOnly) query.read = false;
  return getCollection(COLLECTION)
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function markRead(notificationId, userId) {
  await getCollection(COLLECTION).updateOne(
    { id: notificationId, toUserId: userId },
    { $set: { read: true } }
  );
  return true;
}

export async function markAllRead(userId) {
  await getCollection(COLLECTION).updateMany(
    { toUserId: userId, read: false },
    { $set: { read: true } }
  );
  return true;
}

export async function getUnreadCount(userId) {
  return getCollection(COLLECTION).countDocuments({ toUserId: userId, read: false });
}

// ── Deadline Reminder ──

export async function checkDeadlineReminders() {
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Find ACTIVE assignments with deadline within next 24 hours
  const expiringAssignments = await getCollection("assignments").find({
    status: "ACTIVE",
    deadline: { $ne: null, $ne: "" },
    $expr: {
      $and: [
        { $gte: [{ $toDate: "$deadline" }, now] },
        { $lte: [{ $toDate: "$deadline" }, oneDayLater] },
      ],
    },
  }).toArray();

  for (const assignment of expiringAssignments) {
    const deadlineDate = new Date(assignment.deadline);
    const hoursLeft = Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    // Get students in the class
    let students = [];
    try {
      students = await classService.getClassStudents(assignment.classId);
    } catch {
      continue;
    }

    for (const student of students) {
      // Check if reminder already sent for this assignment+student
      const alreadyNotified = await getCollection(COLLECTION).findOne({
        toUserId: student.id,
        type: "DEADLINE_REMINDER",
        "data.assignmentId": assignment.id,
      });
      if (alreadyNotified) continue;

      // Check if student already submitted
      const submitted = await getCollection("submissions").findOne({
        assignmentId: assignment.id,
        studentId: student.id,
        status: "SUBMITTED",
      });
      if (submitted) continue;

      const timeText = hoursLeft <= 1 ? "1 giờ" : `${hoursLeft} giờ`;

      // Create notification + push
      await createNotification({
        toUserId: student.id,
        type: "DEADLINE_REMINDER",
        title: "⏰ Bài tập sắp hết hạn",
        message: `Bài tập "${assignment.title}" sẽ hết hạn trong ${timeText}. Nhanh tay nộp bài nhé!`,
        data: { assignmentId: assignment.id },
      });
    }
  }
}
