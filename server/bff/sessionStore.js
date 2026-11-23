import { MongoClient } from "mongodb";
import crypto from "node:crypto";
import { config } from "./config.js";

let client;
let db;
let sessionsCol;

const SESSION_ID_PREFIX = "sess_";

function generateSessionId() {
  return SESSION_ID_PREFIX + crypto.randomBytes(16).toString("hex");
}

export async function connectSessionStore() {
  if (db) return db;
  
  client = new MongoClient(config.mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
  
  await client.connect();
  db = client.db(config.dbName);
  sessionsCol = db.collection(config.sessionCollection);
  
  // Create indexes
  await sessionsCol.createIndex({ userId: 1 });
  await sessionsCol.createIndex({ sessionId: 1 }, { unique: true });
  await sessionsCol.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  
  console.log("[BFF] Session store connected");
  return db;
}

export async function createSession(user, accessToken, encryptedRefreshToken, meta = {}) {
  const sessionId = generateSessionId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.sessionCookieMaxAge);
  
  const session = {
    sessionId,
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    email: user.email || null,
    accessToken,
    refreshToken: encryptedRefreshToken, // Store encrypted refresh token
    meta: {
      ua: (meta.ua || "").slice(0, 180),
      ip: (meta.ip || "").slice(0, 60),
    },
    createdAt: now,
    updatedAt: now,
    expiresAt,
    revoked: false,
  };
  
  await sessionsCol.insertOne(session);
  return { sessionId, session };
}

export async function getSession(sessionId) {
  if (!sessionId) return null;
  return sessionsCol.findOne({ sessionId, revoked: false });
}

export async function updateSessionTokens(sessionId, accessToken, encryptedRefreshToken) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.sessionCookieMaxAge);
  
  const result = await sessionsCol.findOneAndUpdate(
    { sessionId, revoked: false },
    {
      $set: {
        accessToken,
        refreshToken: encryptedRefreshToken,
        updatedAt: now,
        expiresAt,
      },
    },
    { returnDocument: "after" }
  );
  return result;
}

export async function revokeSession(sessionId) {
  await sessionsCol.updateOne(
    { sessionId },
    { $set: { revoked: true, updatedAt: new Date() } }
  );
}

export async function revokeAllUserSessions(userId, exceptSessionId = null) {
  const filter = { userId, revoked: false };
  if (exceptSessionId) {
    filter.sessionId = { $ne: exceptSessionId };
  }
  await sessionsCol.updateMany(filter, { $set: { revoked: true, updatedAt: new Date() } });
}

export async function cleanupExpiredSessions() {
  await sessionsCol.deleteMany({ expiresAt: { $lt: new Date() } });
}

export async function closeSessionStore() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    sessionsCol = null;
  }
}