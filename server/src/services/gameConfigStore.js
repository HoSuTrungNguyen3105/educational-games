/**
 * gameConfigStore.js — kho cấu hình JSON đứng độc lập theo `key`.
 *
 * Vì sao phải có thêm kho này khi đã có `games.config`?
 * `games.config` chỉ tồn tại khi game có một document trong collection `games`.
 * Game offline (Vườn Thủ Hộ, Săn Trái Cây…) không có dòng nào trong `games` —
 * chúng nằm trong manifest của client — nên admin không có chỗ để lưu cấu hình
 * JSON do trang quản trị tạo ra.
 *
 * Một document = một key:
 *   { key, values, updatedAt, updatedBy }
 * `values` là JSON thô do admin biên tập (server không biết sơ sở gì về hình
 * dạng bên trong, chỉ kiểm tra dung lượng + kiểu object).
 */
import { getCollection } from "../db.js";

const COLLECTION = "game_configs";
const KEY_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/i;
// Cấu hình vườn có ~8 cây + 6 quái + vài màn, mỗi màn có timeline → vẫn rất nhỏ.
// Chặn ở 400KB để một paste JSON lỗi không phá được document.
const MAX_BYTES = 400 * 1024;

/** Tên key viết hoa/dấu cách → slug ("Vườn Thủ Hộ" → "vuon-thu-ho" là việc của
 *  client; server chỉ chấp nhận key đã slug hoá). */
export function normalizeKey(key) {
  const k = String(key || "").trim().toLowerCase();
  if (!KEY_RE.test(k)) throw new Error(`Key cấu hình không hợp lệ: "${key}"`);
  return k;
}

function sizeOf(values) {
  try {
    return Buffer.byteLength(JSON.stringify(values ?? null), "utf8");
  } catch {
    throw new Error("Config không phải JSON hợp lệ");
  }
}

/** Trả về `{ key, values, updatedAt, updatedBy }` hoặc null nếu chưa lưu gì. */
export async function get(key) {
  const k = String(key || "").trim().toLowerCase();
  if (!k) return null;
  const doc = await getCollection(COLLECTION).findOne({ key: k });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

/** Ghi đè cấu hình của một key (create-or-replace). */
export async function set(key, values, actor = null) {
  const k = normalizeKey(key);
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    throw new Error("Config phải là object JSON { ... }");
  }
  const bytes = sizeOf(values);
  if (bytes > MAX_BYTES) {
    throw new Error(`Config quá lớn (${Math.round(bytes / 1024)}KB, tối đa ${MAX_BYTES / 1024}KB)`);
  }
  const now = new Date().toISOString();
  const updatedBy = actor?.id || actor?.sub || null;
  const doc = await getCollection(COLLECTION).findOneAndUpdate(
    { key: k },
    { $set: { key: k, values, updatedAt: now, updatedBy }, $setOnInsert: { createdAt: now } },
    { upsert: true, returnDocument: "after" }
  );
  const { _id, ...rest } = doc;
  return rest;
}

export async function remove(key) {
  const k = normalizeKey(key);
  const res = await getCollection(COLLECTION).deleteOne({ key: k });
  return res.deletedCount > 0;
}

/** Danh sách key đã lưu (cho trang admin liệt kê). */
export async function list() {
  const docs = await getCollection(COLLECTION).find({}).sort({ updatedAt: -1 }).toArray();
  return docs.map(({ _id, values, ...meta }) => ({ ...meta, size: sizeOf(values) }));
}
