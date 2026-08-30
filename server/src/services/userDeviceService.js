import { getCollection } from "../db.js";

const COLLECTION = "user_devices";

function uid() {
  return `dev-${Math.random().toString(36).slice(2, 9)}`;
}

export async function registerDevice(userId, token, deviceType = "WEB") {
  const now = new Date().toISOString();
  const existing = await getCollection(COLLECTION).findOne({ token });
  if (existing) {
    await getCollection(COLLECTION).updateOne(
      { _id: existing._id },
      { $set: { isActive: true, updatedAt: now } }
    );
    return { ...existing, isActive: true, updatedAt: now };
  }
  const doc = {
    _id: uid(),
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

export async function removeDeviceById(id) {
  const result = await getCollection(COLLECTION).deleteOne({ _id: id });
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

export async function deactivateDevice(token) {
  const now = new Date().toISOString();
  await getCollection(COLLECTION).updateOne(
    { token },
    { $set: { isActive: false, updatedAt: now } }
  );
}

export async function deactivateAllByUser(userId) {
  const now = new Date().toISOString();
  await getCollection(COLLECTION).updateMany(
    { userId },
    { $set: { isActive: false, updatedAt: now } }
  );
}
