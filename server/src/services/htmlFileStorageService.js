// services/htmlFileStorageService.js
//
// Lưu HTML game thành FILE trên đĩa server (không nhúng vào MongoDB).
//   • Thư mục:  server/uploads/html/   (đã được express.static phục vụ tại /uploads)
//   • Tên file: <uuid>.html — sinh ngẫu nhiên, KHÔNG dùng tên do frontend gửi lên
//   • URL:      BASE_URL + /uploads/html/<uuid>.html  (BASE_URL đặt trong .env;
//               thiếu thì trả đường dẫn tương đối, frontend tự ghép gốc API)
//   • Xóa:      best-effort, file không tồn tại coi như thành công
//
// Mọi hàm ở đây chỉ đụng tới /uploads/html — không cho phép truy cập đường dẫn
// file tùy ý (basename được kiểm tra regex trước khi ghép đường dẫn).

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Thư mục chứa file HTML game. */
export const HTML_DIR = path.resolve(__dirname, "../../uploads/html");
/** Tiền tố URL công khai của thư mục này (khớp app.use("/uploads", ...) trong app.js). */
export const HTML_URL_PREFIX = "/uploads/html";

const FILE_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*\.html?$/i;

/** Giá trị này trỏ tới 1 file HTML trên đĩa của server này? */
export function isDiskHtmlRef(value) {
  const v = String(value || "").trim();
  return /(^|\/)uploads\/html\/[\w.-]+\.html?/i.test(v) && !/\s/.test(v);
}

/**
 * Giá trị này là "link/đường dẫn" (không phải HTML thô)?
 * Khớp 3 dạng frontend đã hỗ trợ: http(s)://…, /uploads/html/x.html,
 * và đường dẫn .html cùng-origin cũ (vd /games/abc.html).
 */
export function isHtmlRef(value) {
  const v = String(value || "").trim();
  if (!v || /\s/.test(v)) return false;              // HTML thô luôn chứa khoảng trắng/xuống dòng
  if (/^https?:\/\//i.test(v)) return true;
  return /^\/[\w\-./%]*\.html?$/i.test(v);
}

/** Kiểm tra dung lượng + kiểu dữ liệu trước khi ghi file. Ném Error nếu không hợp lệ. */
export function validateHtml(html) {
  if (html === undefined || html === null || html === "") return "";
  if (typeof html !== "string") throw new Error("Nội dung HTML phải là chuỗi");
  const bytes = Buffer.byteLength(html, "utf-8");
  const max = config.htmlMaxMb * 1024 * 1024;
  if (bytes > max) {
    throw new Error(`HTML quá lớn (${(bytes / 1024 / 1024).toFixed(2)}MB) — tối đa ${config.htmlMaxMb}MB`);
  }
  const t = html.trim();
  if (!t.startsWith("<") || !t.includes(">")) {
    throw new Error("Nội dung gửi lên không giống HTML");
  }
  return html;
}

/** Ghép URL công khai của 1 file (tuyệt đối nếu có BASE_URL, tương đối nếu không). */
export function urlForFile(fileName) {
  const rel = `${HTML_URL_PREFIX}/${fileName}`;
  return config.baseUrl ? `${config.baseUrl}${rel}` : rel;
}

/** Rút tên file từ URL/đường dẫn đĩa; không nhận → null. */
export function fileNameFromRef(ref) {
  const m = String(ref || "").match(/uploads\/html\/([\w.-]+\.html?)/i);
  return m ? m[1] : null;
}

/**
 * Ghi HTML thành file <uuid>.html.
 * @param {string} html nội dung đã qua validateHtml()
 * @returns {Promise<{url: string, fileName: string}>}
 */
export async function saveHtmlFile(html) {
  await fs.mkdir(HTML_DIR, { recursive: true });
  const fileName = `${randomUUID()}.html`;
  // 'wx' = chỉ ghi nếu file chưa tồn tại (UUID va chạm là bất khả thi, phòng hờ vẫn an toàn)
  await fs.writeFile(path.join(HTML_DIR, fileName), html, { encoding: "utf-8", flag: "wx" });
  return { url: urlForFile(fileName), fileName };
}

/**
 * Xóa file đĩa theo URL/đường dẫn tham chiếu (best-effort).
 * @returns {Promise<boolean>} true nếu có xóa (hoặc file biến mất giữa chừng)
 */
export async function deleteHtmlFile(ref) {
  const fileName = fileNameFromRef(ref);
  if (!fileName || !FILE_NAME_RE.test(fileName)) return false; // chặn mọi dạng đường dẫn tùy ý
  try {
    await fs.unlink(path.join(HTML_DIR, fileName));
    return true;
  } catch (e) {
    if (e.code === "ENOENT") return false; // file không tồn tại → vẫn an toàn
    console.error("[htmlFileStorage] Lỗi xóa file HTML:", e.message);
    return false;
  }
}
