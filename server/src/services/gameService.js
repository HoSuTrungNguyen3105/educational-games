import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

export const genCode = () => Math.random().toString(36).slice(2, 9).toUpperCase().slice(0, 8);

const COLLECTION = "games";

// Schema mới — chỉ các trường này được trả về cho frontend
const GAME_FIELDS = [
  "name", "description", "subject", "subjectId", "topic", "language",
  "templateId", "type", "status", "playMode", "deliveryMode", "questionsCount", "playersCount",
  "code", "config", "gameMode", "createdAt", "updatedAt",
];

// Cách vận hành dữ liệu (refactor_game.md mục 4 — tách khỏi playMode solo/classroom):
//   offline — client cache JSON vào IndexedDB, chơi được khi mất mạng
//   online  — luôn tải dữ liệu từ API mỗi lượt chơi
export const DELIVERY_MODES = ["offline", "online"];
export const DEFAULT_DELIVERY_MODE = "online";

// Chế độ chạy của game:
//   quiz   — dùng câu hỏi trong collection `questions` (mặc định, như cũ)
//   custom — game tự sinh nội dung từ JSON `config`, KHÔNG dùng câu hỏi
export const GAME_MODES = ["quiz", "custom"];
export const DEFAULT_GAME_MODE = "quiz";

// Config là chuỗi JSON riêng cho từng game (không dùng chung key giữa các game).
// Game cũ / game không cần cấu hình → trả về `null` để client biết rõ là không có
// config, tuyệt đối không tự bịa dữ liệu hay gán nhầm config của game khác.
// Export để gameVersionService tái dùng khi snapshot/restore config
export function sanitizeConfig(value) {
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

// Nối games ↔ subjects bằng ID: collection `subjects` là nguồn tên chuẩn,
// game giữ subjectId + bản sao tên (subject) cho dữ liệu cũ/frontend cũ.
// Đổi tên môn ở subjects là game tự theo tên mới nhờ resolve lúc đọc.
async function loadSubjectMaps() {
  const docs = await getCollection("subjects").find({}).toArray();
  const byId = new Map();
  const byName = new Map();
  for (const d of docs) {
    const id = d._id.toString();
    byId.set(id, d.name);
    if (d.name && !byName.has(d.name)) byName.set(d.name, id);
  }
  return { byId, byName };
}

// Chuẩn hoá cặp subject/subjectId theo danh sách môn hiện tại:
// - subjectId hợp lệ → subject = tên HIỆN TẠI của môn đó
// - chưa có subjectId mà tên khớp một môn → suy ra subjectId từ tên
// - không khớp gì → giữ nguyên subject cũ, subjectId = null
function resolveSubjectFields(source, maps) {
  const rawId = source.subjectId ? String(source.subjectId) : "";
  if (rawId && maps.byId.has(rawId)) {
    return { subjectId: rawId, subject: maps.byId.get(rawId) };
  }
  const name = typeof source.subject === "string" ? source.subject : "";
  if (name && maps.byName.has(name)) {
    return { subjectId: maps.byName.get(name), subject: name };
  }
  return { subjectId: null, subject: name };
}

// Áp resolve lên game đã serialize (ghi đè subject/subjectId tại chỗ)
function applySubjectResolution(game, maps) {
  if (!game || !maps) return game;
  const resolved = resolveSubjectFields(game, maps);
  game.subject = resolved.subject;
  game.subjectId = resolved.subjectId;
  return game;
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
    if ((key === "templateId" || key === "subjectId") && value) value = value.toString();
    if ((key === "questionsCount" || key === "playersCount")) value = Number(value) || 0;
    out[key] = value;
  }
  if (!out.type) out.type = "play-to-learn";
  if (!out.status) out.status = "draft";
  if (!out.playMode) out.playMode = "solo";
  if (!DELIVERY_MODES.includes(out.deliveryMode)) out.deliveryMode = DEFAULT_DELIVERY_MODE;
  if (!GAME_MODES.includes(out.gameMode)) out.gameMode = DEFAULT_GAME_MODE;
  return out;
}

export async function list(filters = {}) {
  const coll = getCollection(COLLECTION);
  const query = {};
  if (filters.status && filters.status !== "all") query.status = filters.status;
  // Lọc môn học làm SAU serialize + resolve (như deliveryMode bên dưới):
  // game lưu theo subjectId phải match được cả khi lọc bằng tên và ngược lại,
  // query Mongo trực tiếp trên field thô không làm được cả hai dạng.
  // Lọc theo field có default: doc cũ có thể KHÔNG chứa key (trước khi thêm
  // type/deliveryMode) → $in:[value, null] để match cả doc thiếu field.
  if (filters.type && filters.type !== "all") query.type = { $in: [filters.type, null] };
  if (filters.playMode && filters.playMode !== "all") query.playMode = { $in: [filters.playMode, null] };
  if (filters.templateId && filters.templateId !== "all") {
    try { query.templateId = new ObjectId(filters.templateId); } catch { /* ignore */ }
  }

  let cursor = coll.find(query).sort({ updatedAt: -1 });
  const games = await cursor.toArray();

  const subjectMaps = await loadSubjectMaps();
  let result = games.map((g) => applySubjectResolution(serialize(g), subjectMaps));
  // Sau resolve, subject là tên hiện tại và subjectId đã chuẩn hoá ở cả hai
  // dạng lưu (theo id / theo tên cũ) → lọc theo field nào cũng khớp.
  if (filters.subjectId && filters.subjectId !== "all") {
    result = result.filter((g) => g.subjectId === String(filters.subjectId));
  }
  if (filters.subject && filters.subject !== "all") {
    result = result.filter((g) => g.subject === filters.subject);
  }
  // Lọc sau serialize: doc cũ chưa có deliveryMode được default "online" nên
  // không thể match bằng query Mongo trực tiếp.
  if (filters.deliveryMode && filters.deliveryMode !== "all") {
    result = result.filter((g) => g.deliveryMode === filters.deliveryMode);
  }
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
    if (!doc) return serialize(doc);
    return applySubjectResolution(serialize(doc), await loadSubjectMaps());
  } catch {
    return null;
  }
}

export async function getByCode(code) {
  const doc = await getCollection(COLLECTION).findOne({
    code: new RegExp(`^${escapeRegExp(code.trim().toLowerCase())}$`, "i"),
    status: "published",
  });
  if (!doc) return serialize(doc);
  return applySubjectResolution(serialize(doc), await loadSubjectMaps());
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

// Chặn dùng template chưa "dùng được" để tạo/đổi game: template tìm thấy
// mà status !== "published" (draft/inactive) thì không cho dùng. templateId
// rỗng, không parse được ObjectId, hoặc không tìm thấy template → BỎ QUA
// (không throw) để giữ nguyên hành vi cũ với dữ liệu lạ.
async function assertTemplateUsable(templateId) {
  if (!templateId) return;
  let oid;
  try { oid = new ObjectId(templateId); } catch { return; }
  const tpl = await getCollection("templates").findOne(
    { _id: oid },
    { projection: { name: 1, status: 1 } }
  );
  if (!tpl) return;
  if (tpl.status !== "published") {
    throw new Error(`Template "${tpl.name || ""}" chưa xuất bản hoặc đã tắt, không thể dùng để tạo game`);
  }
}

export async function create(data) {
  if (data.templateId) await assertTemplateUsable(data.templateId);
  const now = new Date().toISOString();
  // Ưu tiên subjectId hợp lệ (lưu kèm tên resolve); chỉ có tên thì suy ra id
  // nếu khớp một môn; id không tồn tại → subjectId = null, giữ tên theo input.
  const resolvedSubject = resolveSubjectFields(data, await loadSubjectMaps());
  const game = {
    name: data.name || "Game mới",
    description: data.description || "",
    subject: resolvedSubject.subject,
    subjectId: resolvedSubject.subjectId,
    topic: data.topic || "",
    language: data.language || "vi",
    templateId: data.templateId ? new ObjectId(data.templateId) : null,
    type: data.type || "play-to-learn",
    status: data.status || "draft",
    playMode: ["solo", "classroom"].includes(data.playMode) ? data.playMode : "solo",
    deliveryMode: DELIVERY_MODES.includes(data.deliveryMode) ? data.deliveryMode : DEFAULT_DELIVERY_MODE,
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
  if (rest.templateId) {
    // Chỉ chặn khi game ĐỔI sang template khác: sửa game cũ đang gắn template
    // nay đã inactive/draft (vì lý do khác) không bị chặn oan.
    const current = await getCollection(COLLECTION).findOne(
      { _id: new ObjectId(id) },
      { projection: { templateId: 1 } }
    );
    const currentTplId = current?.templateId ? current.templateId.toString() : null;
    if (String(rest.templateId) !== currentTplId) await assertTemplateUsable(rest.templateId);
    rest.templateId = new ObjectId(rest.templateId);
  }
  if (rest.deliveryMode !== undefined && !DELIVERY_MODES.includes(rest.deliveryMode)) {
    rest.deliveryMode = DEFAULT_DELIVERY_MODE;
  }
  if (rest.config !== undefined) rest.config = sanitizeConfig(rest.config);
  const subjectMaps = await loadSubjectMaps();
  if (rest.subjectId !== undefined || rest.subject !== undefined) {
    // Resolve theo đúng field client gửi (như create): gửi tên mới thì suy
    // id từ tên mới — KHÔNG để subjectId đã lưu thắng, nếu không game đã có
    // id sẽ không bao giờ đổi môn bằng tên được.
    const resolved = resolveSubjectFields(rest, subjectMaps);
    rest.subjectId = resolved.subjectId;
    if (rest.subject !== undefined || resolved.subject) {
      rest.subject = resolved.subject;
    } else {
      // Chỉ gửi subjectId không hợp lệ mà không kèm tên → giữ tên đã lưu
      const current = await getCollection(COLLECTION).findOne(
        { _id: new ObjectId(id) },
        { projection: { subject: 1 } }
      );
      rest.subject = current?.subject || "";
    }
  }
  rest.updatedAt = new Date().toISOString();
  const result = await getCollection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: rest },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy trò chơi");
  return applySubjectResolution(serialize(result), subjectMaps);
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
