import { getCollection } from "../db.js";

const COLLECTION = "notifications";
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export async function createNotification({ fromUserId, fromUsername, fromName, toUserId, gameId, gameName, gameCode, type = "game_invite" }) {
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
    read: false,
    createdAt: new Date().toISOString(),
  };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
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
