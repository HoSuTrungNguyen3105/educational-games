import { getCollection } from "../db.js";
import { uid } from "./gameService.js";

const COLLECTION = "questions";

export async function listByGame(gameId) {
  return getCollection(COLLECTION).find({ gameId }).sort({ id: 1 }).toArray();
}

export async function save(gameId, questions) {
  const coll = getCollection(COLLECTION);
  await coll.deleteMany({ gameId });

  const prepared = questions.map((q) => {
    const { _id, ...rest } = q;
    return { ...rest, id: q.id || uid("question"), gameId };
  });
  if (prepared.length > 0) await coll.insertMany(prepared);

  await getCollection("games").updateOne(
    { id: gameId },
    { $set: { questionsCount: prepared.length, updatedAt: new Date().toISOString() } }
  );
  return prepared;
}

export async function add(gameId, question) {
  const doc = { ...question, id: question.id || uid("question"), gameId };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}
