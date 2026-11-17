import { getCollection } from "../db.js";

import { uid } from "../utils/id.js";

const COLLECTION = "results";

export async function listByGame(gameId) {
  return getCollection(COLLECTION)
    .find({ gameId })
    .sort({ score: -1, completionTime: 1 })
    .toArray();
}

export async function submit(result) {
  const entry = { id: uid("result"), ...result };
  const { _id, ...rest } = entry;
  const doc = { ...rest, createdAt: rest.createdAt || new Date().toISOString() };
  await getCollection(COLLECTION).insertOne(doc);

  // cập nhật player count nếu chưa có id người chơi này trong game
  const existing = await getCollection(COLLECTION).countDocuments({
    gameId: doc.gameId,
    playerId: doc.playerId,
  });
  if (existing === 1) {
    await getCollection("games").updateOne(
      { id: doc.gameId },
      { $inc: { playersCount: 1 } }
    );
  }
  return doc;
}

export async function listAll() {
  return getCollection(COLLECTION).find().sort({ score: -1 }).toArray();
}

/**
 * Xoá mọi phiếu kết quả "mồ côi": gameId không khớp bất kỳ game nào đang
 * tồn tại trong collection `games`. Khớp game theo cùng quy ước với
 * statsService.gameResolver (_id ObjectId dạng chuỗi, field `id` cũ, hoặc
 * `code`) — phiếu gắn game còn tồn tại theo bất kỳ dạng id nào cũng được giữ.
 * gameId rỗng/thiếu luôn là mồ côi (dữ liệu seed đời đầu: "game-001"...).
 * Trả { deletedCount, scanned }.
 */
export async function deleteOrphans() {
  const games = await getCollection("games")
    .find({})
    .project({ _id: 1, id: 1, code: 1 })
    .toArray();
  const valid = new Set();
  for (const g of games) {
    for (const k of [g._id?.toString(), g.id, g.code]) {
      if (k) valid.add(String(k));
    }
  }
  const all = await getCollection(COLLECTION)
    .find({})
    .project({ _id: 1, gameId: 1 })
    .toArray();
  const orphanIds = all
    .filter((r) => {
      const gid = r.gameId == null ? "" : String(r.gameId).trim();
      return !gid || !valid.has(gid);
    })
    .map((r) => r._id);
  if (!orphanIds.length) return { deletedCount: 0, scanned: all.length };
  const res = await getCollection(COLLECTION).deleteMany({ _id: { $in: orphanIds } });
  return { deletedCount: res.deletedCount, scanned: all.length };
}
