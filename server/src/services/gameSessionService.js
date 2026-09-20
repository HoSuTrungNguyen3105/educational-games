import { getCollection } from "../db.js";

const COLLECTION = "gameSessions";
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export async function createSession({ gameId, gameName, gameCode, hostUserId, hostName }) {
  const now = new Date().toISOString();
  const doc = {
    id: uid("session"),
    gameId,
    gameName,
    gameCode,
    hostUserId,
    hostName,
    guestUserId: null,
    guestName: null,
    status: "waiting",
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function joinSession(sessionId, { guestUserId, guestName }) {
  const now = new Date().toISOString();
  const result = await getCollection(COLLECTION).findOneAndUpdate(
    { id: sessionId, status: "waiting" },
    { $set: { guestUserId, guestName, status: "active", updatedAt: now } },
    { returnDocument: "after" }
  );
  return result;
}

export async function getSession(sessionId) {
  return getCollection(COLLECTION).findOne({ id: sessionId });
}

export async function getSessionByCode(gameCode) {
  return getCollection(COLLECTION).findOne({ gameCode, status: "waiting" });
}

export async function endSession(sessionId) {
  const now = new Date().toISOString();
  return getCollection(COLLECTION).findOneAndUpdate(
    { id: sessionId },
    { $set: { status: "finished", updatedAt: now } },
    { returnDocument: "after" }
  );
}

export async function getActiveSessionByUser(userId) {
  return getCollection(COLLECTION).findOne({
    $or: [{ hostUserId: userId }, { guestUserId: userId }],
    status: { $in: ["waiting", "active"] },
  });
}
