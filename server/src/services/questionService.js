import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

const COLLECTION = "questions";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

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
    { _id: new ObjectId(gameId) },
    { $set: { questionsCount: prepared.length, updatedAt: new Date().toISOString() } }
  );
  return prepared;
}

export async function add(gameId, question) {
  const doc = { ...question, id: question.id || uid("question"), gameId };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function getById(questionId) {
  return getCollection(COLLECTION).findOne({ id: questionId });
}
