import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

export const genCode = () => Math.random().toString(36).slice(2, 9).toUpperCase().slice(0, 8);

const COLLECTION = "games";

// Schema mới — chỉ các trường này được trả về cho frontend
const GAME_FIELDS = [
  "name", "description", "subject", "topic", "language",
  "templateId", "type", "status", "playMode", "questionsCount", "playersCount",
  "code", "createdAt", "updatedAt",
];

// Chuẩn hóa về schema mới: bỏ trường cũ (id/slug/title/template/theme/htmlTemplate),
// map title→name, đảm bảo kiểu dữ liệu đúng
function serialize(doc) {
  if (!doc) return doc;
  const out = { _id: doc._id.toString() };
  for (const key of GAME_FIELDS) {
    let value = doc[key];
    if (key === "name") value = doc.name ?? doc.title ?? "Game";
    if (value === undefined) value = "";
    if (key === "templateId" && value) value = value.toString();
    if ((key === "questionsCount" || key === "playersCount")) value = Number(value) || 0;
    out[key] = value;
  }
  if (!out.type) out.type = "play-to-learn";
  if (!out.status) out.status = "draft";
  if (!out.playMode) out.playMode = "solo";
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

  const total = result.length;
  let from = Math.max(1, parseInt(filters.from) || 1);
  let to = parseInt(filters.to) || Math.min(from + 49, total);
  to = Math.min(to, total);
  if (to < from) to = Math.min(from + 49, total);
  if (to - from + 1 > 50) to = from + 49;
  const sliced = result.slice(from - 1, to);

  return { items: sliced, total, from, to };
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
    status: data.status || "draft",
    playMode: ["solo", "classroom"].includes(data.playMode) ? data.playMode : "solo",
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

// Xóa TẤT CẢ games + questions + results liên quan
export async function removeAll() {
  const coll = getCollection(COLLECTION);
  const count = await coll.countDocuments();
  await coll.deleteMany({});
  await getCollection("questions").deleteMany({});
  await getCollection("results").deleteMany({});
  return { deleted: count };
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
