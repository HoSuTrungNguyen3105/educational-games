import { getCollection } from "../db.js";

export const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
export const genCode = () => uid("code").slice(0, 8).toUpperCase();

const COLLECTION = "games";

export async function list(filters = {}) {
  const coll = getCollection(COLLECTION);
  const query = {};
  if (filters.status && filters.status !== "all") query.status = filters.status;
  if (filters.subject && filters.subject !== "all") query.subject = filters.subject;
  if (filters.template && filters.template !== "all") query.template = filters.template;

  let cursor = coll.find(query).sort({ updatedAt: -1 });

  const games = await cursor.toArray();

  let result = games;
  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter(
      (g) => g.title.toLowerCase().includes(q) || (g.topic || "").toLowerCase().includes(q)
    );
  }
  if (filters.category && filters.category !== "all") {
    const templates = await getCollection("templates").find({ category: filters.category }).toArray();
    const tplIds = new Set(templates.map((t) => t.id));
    result = result.filter((g) => tplIds.has(g.template));
  }
  return result;
}

export async function get(id) {
  return getCollection(COLLECTION).findOne({ id });
}

export async function getByCode(code) {
  return getCollection(COLLECTION).findOne({
    code: new RegExp(`^${escapeRegExp(code.trim().toLowerCase())}$`, "i"),
    status: "published",
  });
}

export async function create(data) {
  const now = new Date().toISOString();
  // Validate slug uniqueness
  if (data.slug) {
    const existing = await getCollection(COLLECTION).findOne({ slug: data.slug });
    if (existing) throw new Error(`Slug "${data.slug}" đã tồn tại`);
  }
  const game = {
    id: uid("game"),
    status: "draft",
    playersCount: 0,
    questionsCount: 0,
    code: genCode(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  await getCollection(COLLECTION).insertOne(game);
  return game;
}

export async function update(id, data) {
  const { _id, ...rest } = data;
  // Validate slug uniqueness if changing slug
  if (rest.slug) {
    const existing = await getCollection(COLLECTION).findOne({ slug: rest.slug, id: { $ne: id } });
    if (existing) throw new Error(`Slug "${rest.slug}" đã tồn tại`);
  }
  const updateDoc = { $set: { ...rest, updatedAt: new Date().toISOString() } };
  const result = await getCollection(COLLECTION).findOneAndUpdate(
    { id },
    updateDoc,
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy trò chơi");
  return result;
}

export async function remove(id) {
  await getCollection(COLLECTION).deleteOne({ id });
  await getCollection("questions").deleteMany({ gameId: id });
  await getCollection("results").deleteMany({ gameId: id });
  return true;
}

export async function duplicate(id) {
  const src = await get(id);
  if (!src) throw new Error("Không tìm thấy trò chơi");
  const now = new Date().toISOString();
  const copy = {
    ...src,
    id: uid("game"),
    title: `${src.title} (Bản sao)`,
    status: "draft",
    playersCount: 0,
    code: genCode(),
    createdAt: now,
    updatedAt: now,
  };
  delete copy._id;
  if (copy.htmlTemplate) copy.htmlTemplate = copy.htmlTemplate;
  await getCollection(COLLECTION).insertOne(copy);

  const questions = await getCollection("questions").find({ gameId: src.id }).toArray();
  if (questions.length > 0) {
    const cloned = questions.map((q) => ({
      ...q,
      _id: undefined,
      id: uid("question"),
      gameId: copy.id,
    }));
    await getCollection("questions").insertMany(cloned);
  }
  return copy;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
