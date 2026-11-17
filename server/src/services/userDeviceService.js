import { getCollection } from "../db.js";

const COLLECTION = "user_devices";

import { uid } from "../utils/id.js";

export async function registerDevice(userId, token, deviceType = "WEB") {
  const now = new Date().toISOString();
  const existing = await getCollection(COLLECTION).findOne({ token });
  if (existing) {
    // Rebind to the CURRENT user — otherwise a shared device keeps receiving
    // pushes for whichever user registered the token first.
    await getCollection(COLLECTION).updateOne(
      { _id: existing._id },
      { $set: { userId, deviceType: deviceType.toUpperCase(), isActive: true, updatedAt: now } }
    );
    return { ...existing, userId, deviceType: deviceType.toUpperCase(), isActive: true, updatedAt: now };
  }
  const doc = {
    _id: uid("dev"),
    userId,
    token,
    deviceType: deviceType.toUpperCase(),
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function removeDevice(token) {
  const result = await getCollection(COLLECTION).deleteOne({ token });
  return result.deletedCount > 0;
}

export async function getDevicesByUser(userId) {
  return getCollection(COLLECTION).find({ userId, isActive: true }).toArray();
}

export async function getActiveTokensByUser(userId) {
  const devices = await getCollection(COLLECTION)
    .find({ userId, isActive: true })
    .toArray();
  return devices.map((d) => d.token);
}

export async function deactivateAllByUser(userId) {
  const now = new Date().toISOString();
  return getCollection(COLLECTION).updateMany(
    { userId },
    { $set: { isActive: false, updatedAt: now } }
  );
}
