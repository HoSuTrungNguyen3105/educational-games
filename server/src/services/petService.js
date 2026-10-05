// services/petService.js
//
// Lưu thú cưng trên server (collection `userPets`) — mỗi người dùng 1 pet.
// Màu / trang phục / loài đều kiểm tra theo petCatalog nên không thể gán giá trị
// bừa. Loài và đồ mới thêm vào catalog là dùng được, không phải sửa file này.

import { getCollection } from "../db.js";
import * as catalog from "./petCatalog.js";

const COLLECTION = "userPets";

const uid = () => `upet-${Math.random().toString(36).slice(2, 9)}`;
const nowIso = () => new Date().toISOString();

/** EXP cần để lên cấp tiếp theo. */
export function expNeededFor(level) {
  return Math.round(200 * Math.pow(1.18, Math.max(0, level - 1)));
}

/** Pet mặc định: chó, màu kem, chưa mặc gì. */
export function buildDefault(userId, name = "Bồng") {
  const sp = catalog.getSpecies("dog");
  const col = catalog.defaultColorFor("dog");
  return {
    _id: uid(),
    userId,
    species: sp.id,
    name: String(name || "Bồng").slice(0, 24),
    color: col.id,
    outfits: { hat: null, scarf: null, glasses: null, shirt: null, bow: null, cape: null, backpack: null },
    level: 1,
    exp: 0,
    expNeeded: expNeededFor(1),
    mood: "happy",
    bonded: 10,
    totalCorrect: 0,
    totalWrong: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

/** Bảo đảm luôn có 1 document pet cho user (tạo nếu chưa có). */
export async function getOrCreate(userId, name) {
  const col = getCollection(COLLECTION);
  let doc = await col.findOne({ userId });
  if (doc) return doc;

  const fresh = buildDefault(userId, name);
  try {
    await col.insertOne(fresh);
  } catch (e) {
    // Hai request song song có thể cùng tạo → đọc lại bản đã có
    if (e?.code !== 11000) throw e;
    doc = await col.findOne({ userId });
    if (doc) return doc;
    throw e;
  }
  return fresh;
}

export async function getByUser(userId) {
  return getOrCreate(userId);
}

/** Bỏ trường private trước khi trả về cho client. */
export function serialize(doc) {
  if (!doc) return null;
  // Bỏ các trường nội bộ trước khi trả về cho client.
  const out = { ...doc, id: String(doc._id) };
  delete out._id;
  delete out.userId;
  return out;
}

/**
 * Cập nhật diện mạo (loài, màu, trang phục, tên).
 * Chỉ nhận các trường được chỉ định; trường khác bị bỏ qua.
 * @returns {{ ok: boolean, pet?: object, errors?: string[], locked?: string[] }}
 */
export async function updateLook(userId, patch = {}) {
  const current = await getOrCreate(userId);
  const set = { updatedAt: nowIso() };

  if (patch.name != null) {
    const n = String(patch.name).trim().slice(0, 24);
    if (!n) return { ok: false, errors: ["Tên không được để trống"] };
    set.name = n;
  }

  // Gom species/color/outfits lại rồi kiểm tra 1 lần theo catalog
  const wantsLook =
    patch.species != null || patch.color != null || patch.outfits != null;

  if (wantsLook) {
    const candidate = {
      species: patch.species ?? current.species,
      color: patch.color ?? current.color,
      outfits: { ...current.outfits, ...(patch.outfits || {}) },
    };
    const check = catalog.validateLook(candidate);
    if (!check.ok) return { ok: false, errors: check.errors };

    // Chỉ cho dùng loài / trang phục đã mở khoá theo cấp
    const locked = [];
    const sp = catalog.getSpecies(check.value.species);
    if (sp.minLevel > current.level) locked.push(`Loài "${sp.name}" cần cấp ${sp.minLevel}`);

    for (const slot of Object.keys(check.value.outfits)) {
      const entry = check.value.outfits[slot];
      if (!entry) continue;
      const item = catalog.getOutfit(entry.id);
      if (item && item.minLevel > current.level) locked.push(`"${item.name}" cần cấp ${item.minLevel}`);
    }
    if (locked.length) return { ok: false, errors: locked, locked };

    set.species = check.value.species;
    set.color = check.value.color;
    set.outfits = check.value.outfits;
  }

  await getCollection(COLLECTION).updateOne({ _id: current._id }, { $set: set });
  return { ok: true, pet: serialize({ ...current, ...set }) };
}

/**
 * Cộng EXP, tự lên cấp. Trả về cờ levelUp để UI bật hiệu ứng.
 * @param {string} userId
 * @param {number} amount
 * @param {object} stats   { correct, wrong } — tích luỹ số câu đúng/sai
 */
export async function addExp(userId, amount = 5, stats = {}) {
  const pet = await getOrCreate(userId);

  let exp = pet.exp + Math.max(0, Number(amount) || 0);
  let level = pet.level;
  let expNeeded = pet.expNeeded || expNeededFor(level);
  const levelsGained = [];

  while (exp >= expNeeded && level < 99) {
    exp -= expNeeded;
    level += 1;
    expNeeded = expNeededFor(level);
    levelsGained.push(level);
  }

  // Độ gắn kết tăng theo cấp, tối đa 100
  const bonded = Math.min(100, pet.bonded + levelsGained.length * 5 + (stats.correct || 0));

  const set = {
    exp,
    level,
    expNeeded,
    bonded,
    mood: levelsGained.length ? "excited" : "happy",
    totalCorrect: (pet.totalCorrect || 0) + (stats.correct || 0),
    totalWrong: (pet.totalWrong || 0) + (stats.wrong || 0),
    updatedAt: nowIso(),
  };

  await getCollection(COLLECTION).updateOne({ _id: pet._id }, { $set: set });
  return { ok: true, pet: serialize({ ...pet, ...set }), levelUp: levelsGained.length > 0, levelsGained };
}

/** Đổi tâm tính (mood). */
export async function setMood(userId, mood) {
  if (!catalog.MOODS[mood]) return { ok: false, errors: [`mood không hợp lệ: ${mood}`] };
  const pet = await getOrCreate(userId);
  const set = { mood, updatedAt: nowIso() };
  await getCollection(COLLECTION).updateOne({ _id: pet._id }, { $set: set });
  return { ok: true, pet: serialize({ ...pet, ...set }) };
}

/** Đặt lại về mặc định (giữ nguyên tên và cấp độ). */
export async function reset(userId) {
  const pet = await getOrCreate(userId);
  const sp = catalog.getSpecies("dog");
  const col = catalog.defaultColorFor("dog");
  const set = {
    species: sp.id,
    color: col.id,
    outfits: { hat: null, scarf: null, glasses: null, shirt: null, bow: null, cape: null, backpack: null },
    mood: "happy",
    updatedAt: nowIso(),
  };
  await getCollection(COLLECTION).updateOne({ _id: pet._id }, { $set: set });
  return { ok: true, pet: serialize({ ...pet, ...set }) };
}

/** Danh mục đã lọc theo cấp của người chơi. */
export async function catalogFor(userId) {
  try {
    const pet = await getByUser(userId);
    return catalog.fullCatalog(pet?.level || 1);
  } catch {
    // Người chưa đăng nhập / lỗi DB vẫn xem được toàn bộ danh mục ở cấp 1
    return catalog.fullCatalog(1);
  }
}
