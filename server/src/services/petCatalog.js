// services/petCatalog.js
//
// Danh mục thú cưng: LOÀI, BẢNG MÀU, TRANG PHỤC.
//
// Nguồn sự thật là collection Mongo `petCatalog` (mỗi document = 1 mục, kèm
// `kind` để phân biệt species / color / outfit). Admin sửa trực tiếp trên web
// qua /api/pet/admin/*, không cần sửa code rồi deploy lại.
//
// Vì `validateLook` / `getSpecies` … được gọi từ nhiều nơi dưới dạng HÀM ĐỒNG
// BỘ, catalog được nạp vào cache trong RAM. Mọi entry point gọi vào đều phải
// `await ensureLoaded()` trước (petService làm việc này), sau đó các hàm đồng
// bộ bên dưới đọc từ cache.
//
// `art` (SVG) KHÔNG nằm ở đây: frontend giữ toàn bộ hình vẽ trong
// src/data/petAssets.js và chỉ tra bằng id. Server không bao giờ gửi SVG.

import { getCollection } from "../db.js";
import { COLORS, OUTFITS, SPECIES, MOODS, OUTFIT_SLOTS, SLOT_LABELS } from "./petCatalogSeed.js";

const COLLECTION = "petCatalog";

const nowIso = () => new Date().toISOString();

/** Loại mục trong collection. */
export const KINDS = ["species", "color", "outfit"];

/** Ô trang phục hợp lệ — trùng với OUTFIT_SLOTS ở seed. */
export const SLOTS = [...OUTFIT_SLOTS];

export const SLOT_LABEL = { ...SLOT_LABELS };

/** Tâm tính — cố định trong code, admin không sửa được. */
export const MOOD_LIST = MOODS;

/* ── Seed ──────────────────────────────────────────────────────────────── */

function seedDocs() {
  const docs = [];
  SPECIES.forEach((s, i) => docs.push({ ...s, kind: "species", order: i }));
  COLORS.forEach((c, i) => docs.push({ ...c, kind: "color", order: i }));
  OUTFITS.forEach((o, i) => docs.push({ ...o, kind: "outfit", order: i }));
  return docs;
}

/* ── Cache ─────────────────────────────────────────────────────────────── */

let cache = null;
let loading = null;

/** Trả về cache hiện tại, nạp từ DB nếu chưa có. */
export async function ensureLoaded() {
  if (cache) return cache;
  // Nhiều request có thể gọi song song — chỉ nạp một lần rồi cùng chờ.
  if (!loading) {
    loading = (async () => {
      try {
        const col = getCollection(COLLECTION);
        const count = await col.countDocuments();
        if (count === 0) {
          const docs = seedDocs().map((d) => ({ ...d, createdAt: nowIso(), updatedAt: nowIso() }));
          await col.insertMany(docs, { ordered: false }).catch(() => {});
        }
        const rows = await col.find({}).sort({ order: 1 }).toArray();
        cache = buildCache(rows);
      } catch {
        // DB lỗi / chưa kết nối → dùng seed để app không trắng màn hình
        cache = buildCache(seedDocs());
      }
      loading = null;
      return cache;
    })();
  }
  return loading;
}

/** Xoá cache, lần đọc kế tiếp sẽ nạp lại từ DB. */
export function invalidate() {
  cache = null;
}

function clean(doc) {
  if (!doc) return null;
  const { _id, kind, order, createdAt, updatedAt, ...rest } = doc;
  return rest;
}

function buildCache(rows) {
  const species = [];
  const colors = [];
  const outfits = [];
  for (const row of rows || []) {
    const item = clean(row);
    if (!item?.id) continue;
    if (row.kind === "species") species.push(item);
    else if (row.kind === "color") colors.push(item);
    else if (row.kind === "outfit") outfits.push(item);
  }
  return {
    species,
    colors,
    outfits,
    speciesById: new Map(species.map((s) => [s.id, s])),
    colorById: new Map(colors.map((c) => [c.id, c])),
    outfitById: new Map(outfits.map((o) => [o.id, o])),
    loadedAt: nowIso(),
  };
}

/** Cache hiện tại; null nếu chưa nạp. Dùng cho test / fallback. */
export function peek() {
  return cache;
}

/* ── Tra cứu (đồng bộ, đọc cache) ─────────────────────────────────────── */

export function getSpecies(id) {
  return cache?.speciesById.get(id) || null;
}

export function getColor(id) {
  return cache?.colorById.get(id) || null;
}

export function getOutfit(id) {
  return id ? cache?.outfitById.get(id) || null : null;
}

export function listSpecies() {
  return cache?.species || [];
}

export function listColors() {
  return cache?.colors || [];
}

export function listOutfits() {
  return cache?.outfits || [];
}

/** Màu mặc định theo loài, có fallback về màu đầu tiên. */
export function defaultColorFor(speciesId) {
  const sp = getSpecies(speciesId);
  return getColor(sp?.defaultColor) || cache?.colors?.[0] || null;
}

/**
 * Kiểm tra một bộ "diện mạo" có hợp lệ không.
 *
 * `outfits[slot]` nhận hoặc chuỗi id, hoặc object `{ id, color }` để mỗi món
 * mang màu riêng. Kết quả trả về LUÔN dạng object `{ id, color }` để client
 * không phải tự suy ra màu mặc định.
 *
 * Ô không được đưa vào `patch` thì giữ nguyên giá trị cũ (không phải null) —
 * nhờ vậy client chỉ cần gửi ô muốn đổi, không phải gửi cả bộ.
 *
 * @returns {{ ok: boolean, value?: object, errors?: string[] }}
 */
export function validateLook({ species, color, outfits } = {}) {
  const errors = [];

  const sp = getSpecies(species);
  if (!sp) errors.push(`species không hợp lệ: ${species}`);

  const col = getColor(color);
  if (!col) errors.push(`color không hợp lệ: ${color}`);

  const picked = {};
  for (const slot of SLOTS) {
    const raw = outfits?.[slot] ?? null;
    if (!raw) { picked[slot] = null; continue; }

    const id = typeof raw === "string" ? raw : raw.id;
    const item = getOutfit(id);
    if (!item) { errors.push(`trang phục không hợp lệ ở ô ${slot}: ${id}`); continue; }
    if (item.slot !== slot) { errors.push(`"${item.name}" không thuộc ô ${slot}`); continue; }

    // Màu phải nằm trong bảng màu của chính món đó
    let chosen = item.colors?.[0] || null;
    if (raw && typeof raw === "object" && raw.color) {
      if (!item.colors?.includes(raw.color)) {
        errors.push(`"${item.name}" không có màu ${raw.color}`);
        continue;
      }
      chosen = raw.color;
    }
    picked[slot] = { id: item.id, color: chosen };
  }

  return errors.length ? { ok: false, errors } : { ok: true, value: { species: sp.id, color: col.id, outfits: picked } };
}

/** Lọc danh mục theo cấp thú cưng hiện tại (dùng cho UI chọn đồ). */
export function availableFor(level = 1) {
  const lv = Math.max(1, Number(level) || 1);
  return {
    species: listSpecies().filter((s) => (s.minLevel || 1) <= lv),
    colors: listColors(),
    outfits: listOutfits().filter((o) => (o.minLevel || 1) <= lv),
  };
}

/**
 * Toàn bộ danh mục cho frontend.
 *
 * `availableFor(level)` CHỈ chứa phần đã lọc theo cấp. Client dùng
 * `data.species/colors/outfits` cho danh sách, `data.unlocked` để đánh dấu
 * mở khoá hay chưa.
 */
export function fullCatalog(level = 1) {
  return {
    species: listSpecies(),
    colors: listColors(),
    outfits: listOutfits(),
    moods: MOODS,
    slots: SLOTS,
    slotLabels: SLOT_LABEL,
    unlocked: availableFor(level),
  };
}

/* ── CRUD cho admin ────────────────────────────────────────────────────── */

const ID_RE = /^[a-z0-9][a-z0-9_-]{0,39}$/;

export function isValidId(id) {
  return ID_RE.test(String(id || ""));
}

/** @returns {Promise<{ ok: boolean, errors?: string[] }>} */
export async function createItem(kind, payload = {}) {
  if (!KINDS.includes(kind)) return { ok: false, errors: [`kind không hợp lệ: ${kind}`] };

  const id = String(payload.id || "").trim();
  const errs = [];
  if (!isValidId(id)) errs.push("id phải là chữ thường / số / gạch dưới, 1–40 ký tự");
  if (!String(payload.name || "").trim()) errs.push("Thiếu tên");

  if (kind === "outfit") {
    if (!SLOTS.includes(payload.slot)) errs.push(`slot không hợp lệ: ${payload.slot}`);
    const colors = normalizeColors(payload.colors);
    if (colors.length === 0) errs.push("Cần ít nhất 1 màu");
  }

  const minLevel = Math.max(1, Number(payload.minLevel) || 1);
  if (errs.length) return { ok: false, errors: errs };

  const doc = {
    kind, id,
    name: String(payload.name).trim(),
    minLevel,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  if (kind === "species") {
    doc.emoji = String(payload.emoji || "🐾");
    doc.shape = String(payload.shape || id);
    doc.art = payload.art === "svg" ? "svg" : null;
    doc.desc = String(payload.desc || "");
    doc.likes = Array.isArray(payload.likes) ? payload.likes.map(String) : [];
    doc.trait = String(payload.trait || "");
    doc.defaultColor = payload.defaultColor || null;
  } else if (kind === "color") {
    doc.body = String(payload.body || "#F4AF66");
    doc.accent = String(payload.accent || "#FFF7EE");
  } else {
    doc.slot = payload.slot;
    doc.colors = normalizeColors(payload.colors);
  }

  const col = getCollection(COLLECTION);
  if (await col.findOne({ kind, id })) return { ok: false, errors: [`id "${id}" đã tồn tại`] };

  const last = await col.find({ kind }).sort({ order: -1 }).limit(1).toArray();
  doc.order = (last[0]?.order ?? -1) + 1;

  await col.insertOne(doc);
  invalidate();
  await ensureLoaded();
  return { ok: true, item: clean(doc) };
}

/**
 * Sửa một mục. `id` (khoá) KHÔNG đổi được — người chơi đang lưu id cũ trong
 * `pet.outfits` / `pet.species`, đổi id làm dữ liệu của họ mất hiệu lực.
 */
export async function updateItem(kind, id, payload = {}) {
  if (!KINDS.includes(kind)) return { ok: false, errors: [`kind không hợp lệ: ${kind}`] };
  const col = getCollection(COLLECTION);
  const existing = await col.findOne({ kind, id });
  if (!existing) return { ok: false, errors: [`Không tìm thấy "${id}"`] };

  const errs = [];
  const set = { updatedAt: nowIso() };

  if (payload.name !== undefined) {
    const n = String(payload.name).trim();
    if (!n) errs.push("Tên không được để trống");
    else set.name = n;
  }
  if (payload.minLevel !== undefined) set.minLevel = Math.max(1, Number(payload.minLevel) || 1);

  if (kind === "species") {
    if (payload.emoji !== undefined) set.emoji = String(payload.emoji);
    if (payload.shape !== undefined) set.shape = String(payload.shape);
    if (payload.art !== undefined) set.art = payload.art === "svg" ? "svg" : null;
    if (payload.desc !== undefined) set.desc = String(payload.desc);
    if (payload.likes !== undefined) set.likes = Array.isArray(payload.likes) ? payload.likes.map(String) : [];
    if (payload.trait !== undefined) set.trait = String(payload.trait);
    if (payload.defaultColor !== undefined) set.defaultColor = payload.defaultColor || null;
  } else if (kind === "color") {
    if (payload.body !== undefined) set.body = String(payload.body);
    if (payload.accent !== undefined) set.accent = String(payload.accent);
  } else {
    if (payload.slot !== undefined) {
      if (!SLOTS.includes(payload.slot)) errs.push(`slot không hợp lệ: ${payload.slot}`);
      else set.slot = payload.slot;
    }
    if (payload.colors !== undefined) {
      const colors = normalizeColors(payload.colors);
      if (colors.length === 0) errs.push("Cần ít nhất 1 màu");
      else set.colors = colors;
    }
  }

  if (errs.length) return { ok: false, errors: errs };

  await col.updateOne({ kind, id }, { $set: set });
  invalidate();
  await ensureLoaded();
  return { ok: true, item: clean({ ...existing, ...set }) };
}

/**
 * Xoá một mục.
 *
 * Trước khi xoá, dọn luôn dữ liệu đang trỏ tới nó trong `userPets`:
 *   · xoá loài  → mọi pet đang dùng loài đó về loài mặc định
 *   · xoá màu   → mọi pet đang dùng màu đó về màu đầu tiên
 *   · xoá đồ    → set ô tương ứng về null
 * Không làm vậy thì pet của người chơi sẽ mang id không tồn tại và
 * `validateLook` chặn họ thay đổi bất kỳ thứ gì.
 *
 * @returns {Promise<{ ok: boolean, errors?: string[], affectedPets?: number }>}
 */
export async function deleteItem(kind, id) {
  if (!KINDS.includes(kind)) return { ok: false, errors: [`kind không hợp lệ: ${kind}`] };
  await ensureLoaded();

  const doc = await getCollection(COLLECTION).findOne({ kind, id });
  if (!doc) return { ok: false, errors: [`Không tìm thấy "${id}"`] };

  // Loài "dog" là loài mặc định của mọi pet mới → không cho xoá.
  if (kind === "species" && id === "dog") {
    return { ok: false, errors: ["Không thể xoá loài mặc định (dog)"] };
  }
  if (kind === "color" && id === "cream") {
    return { ok: false, errors: ["Không thể xoá màu mặc định (cream)"] };
  }

  const affected = await cleanupPets(kind, id);
  await getCollection(COLLECTION).deleteOne({ kind, id });
  invalidate();
  await ensureLoaded();
  return { ok: true, affectedPets: affected };
}

async function cleanupPets(kind, id) {
  const pets = getCollection("userPets");
  if (kind === "species") {
    const fallback = getSpecies("dog")?.id || "dog";
    const res = await pets.updateMany({ species: id }, { $set: { species: fallback } });
    return res.modifiedCount || 0;
  }
  if (kind === "color") {
    const fallback = cache?.colors?.find((c) => c.id !== id)?.id || "cream";
    const res = await pets.updateMany({ color: id }, { $set: { color: fallback } });
    return res.modifiedCount || 0;
  }
  const slot = docSlotFor(id);
  if (!slot) return 0;
  const res = await pets.updateMany({ [`outfits.${slot}.id`]: id }, { $set: { [`outfits.${slot}`]: null } });
  return res.modifiedCount || 0;
}

function docSlotFor(id) {
  // `outfits[slot]` có thể là string cũ hoặc object `{ id, color }` — lấy slot
  // từ chính mục đang tồn tại trong cache (đã nạp trước khi gọi hàm này).
  return getOutfit(id)?.slot || null;
}

/** Xoá sạch collection rồi seed lại từ `petCatalogSeed.js`. */
export async function resetToSeed() {
  const col = getCollection(COLLECTION);
  await col.deleteMany({});
  await col.insertMany(seedDocs().map((d) => ({ ...d, createdAt: nowIso(), updatedAt: nowIso() })), { ordered: false });
  invalidate();
  await ensureLoaded();
  return { ok: true, count: seedDocs().length };
}

/** Số pet đang dùng mục `id` — admin hiển thị trước khi xoá. */
export async function countPetsUsing(kind, id) {
  const pets = getCollection("userPets");
  if (kind === "species") return pets.countDocuments({ species: id });
  if (kind === "color") return pets.countDocuments({ color: id });
  const item = getOutfit(id);
  if (!item) return 0;
  return pets.countDocuments({
    $or: [
      { [`outfits.${item.slot}`]: id },
      { [`outfits.${item.slot}.id`]: id },
    ],
  });
}

function normalizeColors(colors) {
  if (Array.isArray(colors)) {
    return colors.map((c) => String(c).trim()).filter((c) => /^#[0-9a-fA-F]{3,8}$/.test(c));
  }
  if (typeof colors === "string") {
    return colors.split(/[,\s]+/).map((c) => c.trim()).filter((c) => /^#[0-9a-fA-F]{3,8}$/.test(c));
  }
  return [];
}
