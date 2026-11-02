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

/**
 * gameId dành riêng cho XP do SERVER thưởng mà không gắn với một game cụ thể
 * (nhận thưởng nhiệm vụ, nộp bài tập, ván chơi đã chấm ở server...).
 *
 * XP CHUẨN của hệ thống (Nguyên chốt 2026-11-02) là `stats.totalXP` = tổng
 * `experience` trên MỌI bản ghi userGameProgress. Muốn XP server thưởng cũng
 * nằm trong tổng đó thì `addXp` cộng vào bản ghi sổ này — cùng một nguồn với
 * experience theo game, không còn hai con số lệch nhau. Bản ghi sổ bị lọc
 * khỏi danh sách game của người dùng (GET /users/me/games) và không tính vào
 * số game đã chơi ở /auth/me.
 */
export const XP_LEDGER_GAME_ID = "__xp_ledger__";

/** Tổng XP chuẩn của một người dùng = tổng `experience` trên mọi bản ghi tiến độ. */
export async function getTotalExperience(userId) {
  const docs = await getCollection(COLLECTION).find({ userId }).toArray();
  return docs.reduce((s, d) => s + (d.experience || 0), 0);
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
