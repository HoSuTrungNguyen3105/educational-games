// services/supabaseStorageService.js
//
// Upload/ xóa file trên Supabase Storage (bucket công khai `edu-game-templates`).
// Cấu trúc:  templates/<uuid>.html   ·   thumbnails/<uuid>.<ext>
// MongoDB chỉ lưu URL public trả về — không lưu HTML/ảnh nhị phân.
//
// Secret key (SUPABASE_SECRET_KEY) chỉ được dùng Ở BACKEND — không bao giờ
// xuất hiện trong bundle React hay bị commit lên Git.

import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";

export function isSupabaseConfigured() {
  const s = config.supabase;
  return Boolean(s.url && s.key && s.bucket);
}

let client = null;
function getClient() {
  if (!client) client = createClient(config.supabase.url, config.supabase.key, { auth: { persistSession: false } });
  return client;
}

/** URL công khai của 1 object trong bucket. */
export function publicUrl(objectPath) {
  return `${config.supabase.url}/storage/v1/object/public/${config.supabase.bucket}/${objectPath}`;
}

/** URL này có phải file trong bucket của mình? Trả về objectPath, không phải → null. */
export function pathFromPublicUrl(url) {
  const m = String(url || "").match(
    new RegExp(`/storage/v1/object/public/${config.supabase.bucket}/(.+)$`)
  );
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Ghi 1 object. buffer: Buffer, objectPath ví dụ `templates/abc.html`.
 * upsert=true: UUID sinh lại mỗi lần lưu nên thực tế không đè file cũ.
 */
async function upload(objectPath, buffer, contentType) {
  const { error } = await getClient().storage
    .from(config.supabase.bucket)
    .upload(objectPath, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Supabase Storage lỗi (${objectPath}): ${error.message}`);
  return publicUrl(objectPath);
}

/**
 * Liệt kê object trong một thư mục của bucket (kèm `metadata.size`) — dùng cho
 * thống kê dung lượng ở trang Cài đặt. Ném lỗi khi không truy cập được để nơi gọi
 * phân biệt "thư mục trống" với "mất kết nối".
 * @param {string} prefix  "templates" | "thumbnails"
 */
export async function listObjects(prefix, limit = 1000) {
  const { data, error } = await getClient().storage
    .from(config.supabase.bucket)
    .list(String(prefix || ""), { limit });
  if (error) throw new Error(`Supabase Storage lỗi khi liệt kê ${prefix}/: ${error.message}`);
  return data || [];
}

/** Upload HTML game → templates/<uuid>.html */
export async function saveHtmlToSupabase(html) {
  const fileName = `${randomUUID()}.html`;
  const url = await upload(`templates/${fileName}`, Buffer.from(html, "utf-8"), "text/html; charset=utf-8");
  return { url, fileName };
}

/** Định dạng ảnh cho phép cho thumbnail (theo Content-Type thật của data URL). */
const IMAGE_EXT = { "image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg", "image/webp": "webp", "image/gif": "gif" };

/**
 * Upload thumbnail từ data URL base64 (`data:image/png;base64,...`).
 * Kiểm tra MIME ảnh + dung lượng. Trả { url, fileName }.
 */
export async function saveThumbnailToSupabase(dataUrl) {
  const m = String(dataUrl || "").match(/^data:(image\/[a-z.+-]+);base64,(.+)$/i);
  if (!m) throw new Error("thumbnail phải là ảnh dạng data-URL base64 hoặc link có sẵn");
  const mime = m[1].toLowerCase();
  const ext = IMAGE_EXT[mime];
  if (!ext) throw new Error(`Định dạng ảnh không hỗ trợ: ${mime} (chụp PNG/JPG/WebP/GIF)`);
  const buffer = Buffer.from(m[2], "base64");
  const max = config.thumbnailMaxMb * 1024 * 1024;
  if (buffer.length > max) {
    throw new Error(`Ảnh thumbnail quá lớn (${(buffer.length / 1024 / 1024).toFixed(2)}MB) — tối đa ${config.thumbnailMaxMb}MB`);
  }
  const fileName = `${randomUUID()}.${ext}`;
  const url = await upload(`thumbnails/${fileName}`, buffer, mime);
  return { url, fileName };
}

/** Xóa object theo đường dẫn (best-effort). */
export async function removeObject(objectPath) {
  if (!isSupabaseConfigured() || !objectPath) return false;
  try {
    const { error } = await getClient().storage.from(config.supabase.bucket).remove([objectPath]);
    return !error;
  } catch (e) {
    console.error("[supabaseStorage] Lỗi xóa object:", e.message);
    return false;
  }
}

/** Xóa file từ URL public đã lưu trong DB (best-effort). */
export async function removeByUrl(url) {
  if (!isSupabaseConfigured()) return false;
  const p = pathFromPublicUrl(url);
  if (!p) return false;
  return removeObject(p);
}
