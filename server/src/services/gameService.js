import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

export const genCode = () => Math.random().toString(36).slice(2, 9).toUpperCase().slice(0, 8);

const COLLECTION = "games";

// Schema mới — chỉ các trường này được trả về cho frontend
const GAME_FIELDS = [
  "name", "description", "subject", "topic", "language",
  "templateId", "type", "status", "playMode", "questionsCount", "playersCount",
  "code", "config", "gameMode", "createdAt", "updatedAt",
];

// Chế độ chạy của game:
//   quiz   — dùng câu hỏi trong collection `questions` (mặc định, như cũ)
//   custom — game tự sinh nội dung từ JSON `config`, KHÔNG dùng câu hỏi
export const GAME_MODES = ["quiz", "custom"];
export const DEFAULT_GAME_MODE = "quiz";

// Config là chuỗi JSON riêng cho từng game (không dùng chung key giữa các game).
// Game cũ / game không cần cấu hình → trả về `null` để client biết rõ là không có
// config, tuyệt đối không tự bịa dữ liệu hay gán nhầm config của game khác.
function sanitizeConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const { key, schemaVersion, values, ...rest } = value;
  const trimmedKey = typeof key === "string" ? key.trim() : "";
  const source = values && typeof values === "object" && !Array.isArray(values) ? values : rest;
  const plainValues = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  if (!trimmedKey && Object.keys(plainValues).length === 0) return null;
  const out = {};
  if (trimmedKey) out.key = trimmedKey;
  if (Number.isFinite(Number(schemaVersion))) out.schemaVersion = Number(schemaVersion);
  out.values = plainValues;
  return out;
}

// Bản "nhẹ" của config: chỉ key + schemaVersion (danh sách game gửi về client).
// Client sẽ dùng key này để gọi tiếp API lấy đúng values cần hiển thị.
function summarizeConfig(config, mode) {
  const out = { key: config.key };
  if (config.schemaVersion) out.schemaVersion = config.schemaVersion;
  if (mode === "full") out.values = config.values;
  return out;
}

// Chuẩn hóa về schema mới: bỏ trường cũ (id/slug/title/template/theme/htmlTemplate),
// map title→name, đảm bảo kiểu dữ liệu đúng
// configMode "summary" (mặc định): chỉ trả key/schemaVersion — payload nhẹ cho list/detail.
// configMode "full": kèm luôn values, dùng cho endpoint cấu hình / lúc chơi game.
function serialize(doc, { configMode = "summary" } = {}) {
  if (!doc) return doc;
  const out = { _id: doc._id.toString() };
  for (const key of GAME_FIELDS) {
    let value = doc[key];
    if (key === "name") value = doc.name ?? doc.title ?? "Game";
    if (key === "config") {
      const config = sanitizeConfig(value);
      out[key] = config ? summarizeConfig(config, configMode) : null;
      continue;
    }
    if (value === undefined) value = "";
    if (key === "templateId" && value) value = value.toString();
    if ((key === "questionsCount" || key === "playersCount")) value = Number(value) || 0;
    out[key] = value;
  }
  if (!out.type) out.type = "play-to-learn";
  if (!out.status) out.status = "draft";
  if (!out.playMode) out.playMode = "solo";
  if (!GAME_MODES.includes(out.gameMode)) out.gameMode = DEFAULT_GAME_MODE;
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

  let result = games.map((g) => serialize(g));
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

// Bước 2: lấy riêng cấu hình (kèm values) của một game theo id
export async function getConfig(id) {
  try {
    const doc = await getCollection(COLLECTION).findOne(
      { _id: new ObjectId(id) },
      { projection: { config: 1, name: 1, code: 1, updatedAt: 1 } }
    );
    if (!doc) return null;
    const config = sanitizeConfig(doc.config);
    return {
      gameId: doc._id.toString(),
      gameName: doc.name || "",
      gameCode: doc.code || "",
      config: config ? { ...summarizeConfig(config, "full"), updatedAt: doc.updatedAt || null } : null,
    };
  } catch {
    return null;
  }
}

// Bước 2 (theo key): client đã có key từ /api/games nên gọi thẳng endpoint này.
// - có gameId: lấy config của đúng game đó (nếu key khác thì trả rỗng)
// - không có gameId: lấy config mới nhất trong các game dùng key này
export async function getConfigByKey(key, gameId) {
  const trimmed = String(key || "").trim();
  if (!trimmed) return { key: null, config: null, gamesCount: 0 };
  const coll = getCollection(COLLECTION);

  if (gameId) {
    try {
      const doc = await coll.findOne(
        { _id: new ObjectId(gameId) },
        { projection: { config: 1, name: 1, code: 1, updatedAt: 1 } }
      );
      const config = sanitizeConfig(doc?.config);
      if (!config || config.key !== trimmed) {
        return { key: trimmed, config: null, gamesCount: 0, gameId: String(gameId) };
      }
      return {
        key: trimmed,
        gameId: String(gameId),
        config: { ...summarizeConfig(config, "full"), updatedAt: doc.updatedAt || null },
        gamesCount: await coll.countDocuments({ "config.key": trimmed }),
      };
    } catch {
      return { key: trimmed, config: null, gamesCount: 0 };
    }
  }

  const doc = await coll
    .findOne({ "config.key": trimmed }, { sort: { updatedAt: -1 }, projection: { config: 1, name: 1, code: 1, updatedAt: 1 } });
  const config = sanitizeConfig(doc?.config);
  return {
    key: trimmed,
    gameId: doc?._id ? doc._id.toString() : null,
    config: config ? { ...summarizeConfig(config, "full"), updatedAt: doc.updatedAt || null } : null,
    gamesCount: await coll.countDocuments({ "config.key": trimmed }),
  };
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
    gameMode: GAME_MODES.includes(data.gameMode) ? data.gameMode : DEFAULT_GAME_MODE,
    questionsCount: data.questionsCount || 0,
    playersCount: 0,
    config: sanitizeConfig(data.config),
    code: genCode(),
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection(COLLECTION).insertOne(game);
  return { _id: result.insertedId.toString(), ...game, config: game.config ? summarizeConfig(game.config, "full") : null };
}

export async function update(id, data) {
  const { _id, ...rest } = data;
  if (rest.templateId) rest.templateId = new ObjectId(rest.templateId);
  if (rest.config !== undefined) rest.config = sanitizeConfig(rest.config);
  rest.updatedAt = new Date().toISOString();
  const result = await getCollection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: rest },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy trò chơi");
  return serialize(result);
}

// Chỉ cập nhật config của 1 game — không đụng tới các trường khác
export async function updateConfig(id, config) {
  const updatedAt = new Date().toISOString();
  const result = await getCollection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { config: sanitizeConfig(config), updatedAt } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy trò chơi");
  return getConfig(id);
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
    config: sanitizeConfig(rest.config),
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
