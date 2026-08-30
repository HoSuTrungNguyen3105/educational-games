import { getCollection } from "../db.js";
import { sendPushToUser } from "./fcmService.js";

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
