import { getCollection } from "../db.js";

const COLLECTION = "userGameProgress";

function uid() {
  return `ugp-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getByUser(userId) {
  return getCollection(COLLECTION).find({ userId }).toArray();
}

export async function listAll() {
  return getCollection(COLLECTION).find({}).sort({ updatedAt: -1 }).toArray();
}

export async function getByUserAndGame(userId, gameId) {
  return getCollection(COLLECTION).findOne({ userId, gameId });
}

export async function upsert(userId, gameId, data = {}) {
  const existing = await getByUserAndGame(userId, gameId);
  const now = new Date().toISOString();

  if (existing) {
    const updates = { ...data, updatedAt: now };
    await getCollection(COLLECTION).updateOne(
      { _id: existing._id },
      { $set: updates }
    );
    return { ...existing, ...updates };
  }

  const doc = {
    _id: uid(),
    userId,
    gameId,
    level: 1,
    experience: 0,
    progress: 0,
    gamesPlayed: 0,
    questsCompleted: 0,
    inventory: [],
    lastPlayedAt: now,
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function incrementExperience(userId, gameId, amount) {
  const now = new Date().toISOString();
  const existing = await getByUserAndGame(userId, gameId);
  if (!existing) {
    return upsert(userId, gameId, { experience: Math.max(0, amount), lastPlayedAt: now });
  }
  const newExp = Math.max(0, (existing.experience || 0) + amount);
  await getCollection(COLLECTION).updateOne(
    { _id: existing._id },
    { $set: { experience: newExp, updatedAt: now, lastPlayedAt: now } }
  );
  return { ...existing, experience: newExp, updatedAt: now, lastPlayedAt: now };
}

export async function incrementGamesPlayed(userId, gameId) {
  const now = new Date().toISOString();
  const existing = await getByUserAndGame(userId, gameId);
  if (!existing) {
    return upsert(userId, gameId, { gamesPlayed: 1, lastPlayedAt: now });
  }
  const newCount = (existing.gamesPlayed || 0) + 1;
  await getCollection(COLLECTION).updateOne(
    { _id: existing._id },
    { $set: { gamesPlayed: newCount, updatedAt: now, lastPlayedAt: now } }
  );
  return { ...existing, gamesPlayed: newCount, updatedAt: now, lastPlayedAt: now };
}

export async function addInventoryItem(userId, gameId, item) {
  const now = new Date().toISOString();
  const existing = await getByUserAndGame(userId, gameId);
  if (!existing) {
    return upsert(userId, gameId, { inventory: [item], lastPlayedAt: now });
  }
  const inventory = [...(existing.inventory || [])];
  const idx = inventory.findIndex(i => i.itemId === item.itemId);
  if (idx >= 0) {
    inventory[idx].quantity = (inventory[idx].quantity || 0) + (item.quantity || 1);
  } else {
    inventory.push(item);
  }
  await getCollection(COLLECTION).updateOne(
    { _id: existing._id },
    { $set: { inventory, updatedAt: now, lastPlayedAt: now } }
  );
  return { ...existing, inventory, updatedAt: now, lastPlayedAt: now };
}

export async function removeInventoryItem(userId, gameId, itemId, quantity = 1) {
  const now = new Date().toISOString();
  const existing = await getByUserAndGame(userId, gameId);
  if (!existing) return null;
  const inventory = [...(existing.inventory || [])];
  const idx = inventory.findIndex(i => i.itemId === itemId);
  if (idx < 0) return existing;
  inventory[idx].quantity = (inventory[idx].quantity || 0) - quantity;
  if (inventory[idx].quantity <= 0) inventory.splice(idx, 1);
  await getCollection(COLLECTION).updateOne(
    { _id: existing._id },
    { $set: { inventory, updatedAt: now, lastPlayedAt: now } }
  );
  return { ...existing, inventory, updatedAt: now, lastPlayedAt: now };
}
