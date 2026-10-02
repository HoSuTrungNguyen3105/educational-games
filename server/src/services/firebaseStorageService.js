// services/firebaseStorageService.js
//
// Lưu HTML game lên Firebase Storage.
// `templates.htmlTemplate` lưu LUÔN link tải của file trên Firebase —
// không nhúng HTML vào Mongo.
//
// Đường dẫn:  templates/<templateId>.html
//
// Link trả về dùng endpoint `firebasestorage.googleapis.com/v0/b/...?alt=media`
// vì endpoint này có header CORS, để máy khách fetch trực tiếp được
// (link storage.googleapis.com thuần không có CORS).
//
// Mọi hàm đều best-effort: Firebase lỗi thì trả null / false, API vẫn chạy được
// và fallback giữ HTML thô trong Mongo.

import { getBucket, isFirebaseConfigured, missingFirebaseKeys } from '../config/firebase.js';

const PREFIX = 'templates';

/** Chuẩn hoá id về dạng an toàn cho đường dẫn Firebase. */
export function safeKey(templateId) {
  return String(templateId || '').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 100);
}

export function htmlPath(templateId) {
  return `${PREFIX}/${safeKey(templateId)}.html`;
}

/** Link tải trực tiếp (có CORS) của 1 file trong bucket. */
export function downloadUrl(filePath) {
  return `https://firebasestorage.googleapis.com/v0/b/${getBucket().name}/o/${encodeURIComponent(filePath)}?alt=media`;
}

/** Firebase đã cấu hình đủ chưa. */
export { isFirebaseConfigured };

/** Thông báo lỗi cấu hình (dùng khi muốn log ra cho dễ hiểu). */
export function configErrorHint() {
  return `Thiếu: ${missingFirebaseKeys().join(', ')}`;
}

/**
 * Upload HTML game lên Firebase Storage.
 * @param {string} templateId
 * @param {string} html
 * @returns {Promise<string|null>} link tải, hoặc null nếu lỗi / chưa cấu hình
 */
export const saveHtmlTemplate = async (templateId, html) => {
  if (!isFirebaseConfigured()) {
    console.warn(`[firebaseStorage] Chưa cấu hình Firebase (${configErrorHint()}) — tạo server/src/config/firebase.local.js hoặc điền server/.env`);
    return null;
  }
  const filePath = htmlPath(templateId);
  try {
    const file = getBucket().file(filePath);
    await file.save(Buffer.from(String(html ?? ''), 'utf-8'), {
      resumable: false,
      metadata: {
        contentType: 'text/html; charset=utf-8',
        cacheControl: 'no-cache, max-age=0',
      },
    });

    // Bucket mới của Firebase thường khoá public → makePublic() sẽ 403.
    // Không chặn lưu: client đọc bằng link download nên file cần public.
    try {
      await file.makePublic();
    } catch (e) {
      console.warn('[firebaseStorage] makePublic bị từ chối — bật "All users: read" trong Firebase Console > Storage:', e.message);
    }

    return downloadUrl(filePath);
  } catch (e) {
    console.error('[firebaseStorage] Lỗi upload HTML template:', e.message);
    return null;
  }
};

/** Xoá file theo đường dẫn đầy đủ (best-effort). */
export const deleteHtmlPath = async (filePath) => {
  if (!isFirebaseConfigured() || !filePath) return false;
  try {
    await getBucket().file(filePath).delete({ ignoreNotFound: true });
    return true;
  } catch (e) {
    console.error('[firebaseStorage] Lỗi xoá file:', e.message);
    return false;
  }
};

/** Xoá file HTML của 1 template (best-effort). */
export const deleteHtmlTemplate = (templateId) => deleteHtmlPath(htmlPath(templateId));