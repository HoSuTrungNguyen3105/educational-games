import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

export const genCode = () => Math.random().toString(36).slice(2, 9).toUpperCase().slice(0, 8);

const COLLECTION = "games";

// Serialize ObjectId fields to plain strings so frontend always receives strings
function serialize(doc) {
  if (!doc) return doc;
  const out = { ...doc };
  if (out._id) out._id = out._id.toString();
  if (out.templateId) out.templateId = out.templateId.toString();
  return out;
}

export async function list(filters = {}) {
  const coll = getCollection(COLLECTION);
  const query = {};
  if (filters.status && filters.status !== "all") query.status = filters.status;
  if (filters.subject && filters.subject !== "all") query.subject = filters.subject;
  if (filters.templateId && filters.templateId !== "all") {
    try { query.templateId = new ObjectId(filters.templateId); } catch { /* ignore */ }
  }

  let cursor = coll.find(query).sort({ updatedAt: -1 });
  const games = await cursor.toArray();

  let result = games.map(serialize);
  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter(
      (g) => (g.name || "").toLowerCase().includes(q) || (g.topic || "").toLowerCase().includes(q)
    );
  }
  if (filters.category && filters.category !== "all") {
    const templates = await getCollection("templates").find({ category: filters.category }).toArray();
    const tplIds = new Set(templates.map((t) => t._id.toString()));
    result = result.filter((g) => g.templateId && tplIds.has(g.templateId.toString()));
  }
  return result;
}

export async function get(id) {
  try {
    const doc = await getCollection(COLLECTION).findOne({ _id: new ObjectId(id) });
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function getByCode(code) {
  const doc = await getCollection(COLLECTION).findOne({
    code: new RegExp(`^${escapeRegExp(code.trim().toLowerCase())}$`, "i"),
    status: "published",
  });
  return serialize(doc);
}

export async function create(data) {
  const now = new Date().toISOString();
  const game = {
    name: data.name || "Game mới",
    description: data.description || "",
    subject: data.subject || "",
    topic: data.topic || "",
    language: data.language || "vi",
    templateId: data.templateId ? new ObjectId(data.templateId) : null,
    type: data.type || "play-to-learn",
    status: "draft",
    questionsCount: data.questionsCount || 0,
    playersCount: 0,
    code: genCode(),
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection(COLLECTION).insertOne(game);
  return { _id: result.insertedId.toString(), ...game };
}

export async function update(id, data) {
  const { _id, ...rest } = data;
  if (rest.templateId) rest.templateId = new ObjectId(rest.templateId);
  rest.updatedAt = new Date().toISOString();
  const result = await getCollection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: rest },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy trò chơi");
  return serialize(result);
}

export async function remove(id) {
  const oid = new ObjectId(id);
  await getCollection(COLLECTION).deleteOne({ _id: oid });
  await getCollection("questions").deleteMany({ gameId: id });
  await getCollection("results").deleteMany({ gameId: id });
  return true;
}

export async function duplicate(id) {
  const src = await get(id);
  if (!src) throw new Error("Không tìm thấy trò chơi");
  const now = new Date().toISOString();
  const { _id, ...rest } = src;
  const copy = {
    ...rest,
    name: `${rest.name} (Bản sao)`,
    status: "draft",
    playersCount: 0,
    code: genCode(),
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection(COLLECTION).insertOne(copy);
  const copyId = result.insertedId.toString();

  const questions = await getCollection("questions").find({ gameId: id }).toArray();
  if (questions.length > 0) {
    const cloned = questions.map((q) => ({
      ...q,
      _id: undefined,
      gameId: copyId,
    }));
    await getCollection("questions").insertMany(cloned);
  }
  return { _id: copyId, ...copy };
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
