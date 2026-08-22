import { getCollection } from "../db.js";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

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
