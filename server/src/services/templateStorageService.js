// services/templateStorageService.js
//
// Lưu HTML game thành FILE và trả về link tải.
// `templates.htmlTemplate` lưu LUÔN link — không nhúng HTML thô vào Mongo.
//
// Ba provider, chọn theo thứ tự ưu tiên:
//   1. Cloudflare R2  (R2_*)     — 10GB free, không cần billing Firebase
//   2. Firebase Storage (FIREBASE_*) — nếu project đã bật Blaze
//   3. Đĩa server (Mặc định, luôn có) — file server/uploads/html/<uuid>.html,
//      URL ghép từ env BASE_URL (xem htmlFileStorageService.js)
//
// Đường dẫn:  R2/Firebase → templates/<templateId>.html;  đĩa → uploads/html/<uuid>.html
//
// Hàm cũ (saveHtmlTemplate/deleteHtmlPath) vẫn best-effort: provider lỗi thì trả
// null / false. Route CRUD templates dùng storeHtmlTemplate() và báo lỗi rõ ràng
// thay vì âm thầm nhúng HTML thô trở lại Mongo.

import { isR2Configured, missingR2Keys, getR2Config, getR2Client, r2PublicUrl, htmlKey } from "../config/r2.js";
import * as firebaseStorage from "./firebaseStorageService.js";
import * as disk from "./htmlFileStorageService.js";

export const STORAGE_PREFIX = "templates";

/** Đường dẫn object của 1 template. */
export function htmlPath(templateId) {
  return htmlKey(templateId);
}

/**
 * Provider đang dùng.
 * @returns {"r2"|"firebase"|"disk"}
 */
export function activeProvider() {
  if (isR2Configured()) return "r2";
  if (firebaseStorage.isFirebaseConfigured()) return "firebase";
  return "disk";
}

/** Nhãn người đọc được, dùng cho log. */
export function providerLabel() {
  const p = activeProvider();
  if (p === "r2") return `Cloudflare R2 (${r2PublicUrl()})`;
  if (p === "firebase") return "Firebase Storage";
  return `FILE trên đĩa (${disk.urlForFile("<uuid>.html")})`;
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
 * Với đĩa, URL/đường dẫn của file trong /uploads/html.
 */
export function downloadUrl(filePath) {
  const provider = activeProvider();
  if (provider === "r2") return `${r2PublicUrl()}/${filePath}`;
  if (provider === "disk") return disk.fileNameFromRef(filePath) ? disk.urlForFile(disk.fileNameFromRef(filePath)) : filePath;
  return firebaseStorage.downloadUrl(filePath);
}

/** Frontend cần biết đây có phải "link" (không phải HTML thô) không — re-export. */
export const isHtmlRef = disk.isHtmlRef;
/** Kiểm tra kiểu + dung lượng HTML trước khi ghi file — ném Error nếu không hợp lệ. */
export const validateHtml = disk.validateHtml;

/**
 * Lưu HTML và trả đủ thông tin để ghi vào Mongo.
 * @param {string} templateId
 * @param {string} html  nội dung thô (validate dung lượng ở đây)
 * @returns {Promise<{url: string, fileName: string}|null>} null nếu provider lỗi
 */
export async function storeHtmlTemplate(templateId, html) {
  const provider = activeProvider();
  const checked = disk.validateHtml(html); // kiểu dữ liệu + giới hạn dung lượng
  if (provider === "disk") {
    const saved = await disk.saveHtmlFile(checked);
    return { url: saved.url, fileName: saved.fileName };
  }
  const url = await saveHtmlTemplate(templateId, checked);
  if (url) {
    // R2/Firebase đặt tên theo templateId — lưu luôn làm fileName để đối chiếu khi xóa.
    return { url, fileName: htmlPath(templateId) };
  }
  // R2/Firebase cấu hình nhưng lỗi (thiếu billing, sai key…) → fallback file trên đĩa,
  // nhất quyết không trả HTML thô về Mongo.
  console.warn(`[templateStorage] ${provider} lỗi khi lưu — chuyển sang file trên đĩa (uploads/html)`);
  const saved = await disk.saveHtmlFile(checked);
  return { url: saved.url, fileName: saved.fileName };
}

/**
 * Upload HTML game.
 * @param {string} templateId
 * @param {string} html
 * @returns {Promise<string|null>} link tải, null nếu lỗi
 */
export async function saveHtmlTemplate(templateId, html) {
  const provider = activeProvider();
  if (provider === "firebase") return firebaseStorage.saveHtmlTemplate(templateId, html);
  if (provider === "disk") return (await disk.saveHtmlFile(disk.validateHtml(html))).url;

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

/** Xoá 1 object theo đường dẫn đầy đủ (best-effort). Nhận cả URL đĩa /uploads/html/… */
export async function deleteHtmlPath(filePath) {
  if (!filePath) return false;
  if (disk.isDiskHtmlRef(filePath)) return disk.deleteHtmlFile(filePath);
  const provider = activeProvider();
  if (provider === "firebase") return firebaseStorage.deleteHtmlPath(filePath);
  if (provider === "disk") return false; // không phải file của đĩa → không có gì để xóa
  try {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    await getR2Client().send(new DeleteObjectCommand({ Bucket: getR2Config().bucket, Key: filePath }));
    return true;
  } catch (e) {
    console.error("[templateStorage] Lỗi xoá object trên R2:", e.message);
    return false;
  }
}

/** Xoá file HTML của 1 template (best-effort). Với đĩa, cần truyền URL đã lưu. */
export const deleteHtmlTemplate = (templateId) => deleteHtmlPath(htmlPath(templateId));

/**
 * Xoá file từ ĐÚNG giá trị đã lưu trong templates.htmlTemplate
 * (tự nhận diện: file đĩa /uploads/html, link Firebase, object R2/CDN).
 * Các dạng link khác (vd /games/x.html của app cũ) sẽ KHÔNG bị xoá.
 */
export async function deleteHtmlByUrl(url) {
  const v = String(url || "").trim();
  if (!v) return false;
  if (disk.isDiskHtmlRef(v)) return disk.deleteHtmlFile(v);
  const fb = v.match(/\/o\/([^?]+)\?/);
  if (fb) return firebaseStorage.deleteHtmlPath(decodeURIComponent(fb[1]));
  const cdn = v.match(/\/templates\/([^/?#]+)\.html(?:[?#]|$)/);
  if (cdn) return deleteHtmlPath(`templates/${cdn[1]}.html`);
  return false;
}
