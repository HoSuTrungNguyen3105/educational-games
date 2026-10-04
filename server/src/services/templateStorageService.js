// services/templateStorageService.js
//
// Lưu HTML game lên dịch vụ lưu trữ đối tượng và trả về link tải.
// `templates.htmlTemplate` lưu LUÔN link — không nhúng HTML vào Mongo.
//
// Ba chế độ, chọn theo thứ tự ưu tiên:
//   1. Cloudflare R2  (R2_*)     — 10GB free, không cần billing Firebase
//   2. Firebase Storage (FIREBASE_*) — nếu project đã bật Blaze
//   3. Không có gì               → trả null, API giữ HTML thô trong Mongo
//
// Đường dẫn:  templates/<templateId>.html
//
// Mọi hàm đều best-effort: provider lỗi thì trả null / false, API vẫn chạy
// và không bao giờ mất dữ liệu (HTML thô vẫn nằm trong Mongo).

import { isR2Configured, missingR2Keys, getR2Config, getR2Client, r2PublicUrl, htmlKey } from "../config/r2.js";
import * as firebaseStorage from "./firebaseStorageService.js";

export const STORAGE_PREFIX = "templates";

/** Đường dẫn object của 1 template. */
export function htmlPath(templateId) {
  return htmlKey(templateId);
}

/**
 * Provider đang dùng.
 * @returns {"r2"|"firebase"|null}
 */
export function activeProvider() {
  if (isR2Configured()) return "r2";
  if (firebaseStorage.isFirebaseConfigured()) return "firebase";
  return null;
}

/** Nhãn người đọc được, dùng cho log. */
export function providerLabel() {
  const p = activeProvider();
  if (p === "r2") return `Cloudflare R2 (${r2PublicUrl()})`;
  if (p === "firebase") return "Firebase Storage";
  return "KHÔNG CÓ (giữ HTML thô trong Mongo)";
}

/** Thông báo thiếu cấu hình, để log cho dễ hiểu. */
export function configErrorHint() {
  if (!isR2Configured()) return `R2 thiếu: ${missingR2Keys().join(", ")}`;
  return "";
}

/** Chuẩn hoá id thành khoá an toàn cho đường dẫn object. */
export function safeKey(templateId) {
  return String(templateId || "").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100);
}

/**
 * Link tải công khai của 1 object.
 * Với R2, link là public URL (r2.dev hoặc custom domain).
 * Với Firebase, dùng endpoint có CORS để máy khách fetch được.
 */
export function downloadUrl(filePath) {
  if (activeProvider() === "r2") return `${r2PublicUrl()}/${filePath}`;
  return firebaseStorage.downloadUrl(filePath);
}

/**
 * Upload HTML game.
 * @param {string} templateId
 * @param {string} html
 * @returns {Promise<string|null>} link tải, null nếu lỗi / chưa cấu hình
 */
export async function saveHtmlTemplate(templateId, html) {
  const provider = activeProvider();
  if (!provider) {
    console.warn(
      `[templateStorage] Chưa cấu hình nhà cung cấp lưu trữ (${configErrorHint()}) — ` +
        `tạo server/src/config/r2.local.js hoặc điền server/.env. HTML sẽ lưu thô trong Mongo.`
    );
    return null;
  }
  if (provider === "firebase") return firebaseStorage.saveHtmlTemplate(templateId, html);

  const filePath = htmlPath(templateId);
  try {
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: getR2Config().bucket,
        Key: filePath,
        Body: Buffer.from(String(html ?? ""), "utf-8"),
        ContentType: "text/html; charset=utf-8",
        CacheControl: "no-cache, max-age=0",
      })
    );
    return downloadUrl(filePath);
  } catch (e) {
    console.error("[templateStorage] Lỗi upload HTML lên R2:", e.message);
    return null;
  }
}

/** Xoá 1 object theo đường dẫn đầy đủ (best-effort). */
export async function deleteHtmlPath(filePath) {
  const provider = activeProvider();
  if (!provider || !filePath) return false;
  if (provider === "firebase") return firebaseStorage.deleteHtmlPath(filePath);
  try {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    await getR2Client().send(new DeleteObjectCommand({ Bucket: getR2Config().bucket, Key: filePath }));
    return true;
  } catch (e) {
    console.error("[templateStorage] Lỗi xoá object trên R2:", e.message);
    return false;
  }
}

/** Xoá file HTML của 1 template (best-effort). */
export const deleteHtmlTemplate = (templateId) => deleteHtmlPath(htmlPath(templateId));
