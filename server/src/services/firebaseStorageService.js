// services/firebaseStorageService.js
//
// Lưu HTML game lên Firebase Storage thay vì nhúng trong Mongo.
// Template trong Mongo chỉ giữ metadata + `htmlTemplateUrl` (xem setupService.js).
//
// Quy ước đường dẫn:  templates/<templateId>.html
//
// Mọi hàm đều "best-effort": nếu Firebase chưa cấu hình / lỗi mạng thì trả về
// null thay vì ném lỗi, để API vẫn lưu được template (fallback về Mongo).

import { bucket } from '../config/firebase.js';

const PREFIX = 'templates';

/** Chuẩn hoá id về dạng an toàn cho đường dẫn Firebase. */
export function safeKey(templateId) {
  return String(templateId || '').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 100);
}

export function htmlPath(templateId) {
  return `${PREFIX}/${safeKey(templateId)}.html`;
}

/** Firebase đã có đủ biến môi trường chưa. */
export function isStorageReady() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_STORAGE_BUCKET
  );
}

function publicUrl(filePath) {
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

/**
 * Upload HTML game lên Firebase Storage.
 * @returns {Promise<{url, path, size}|null>} null nếu Firebase lỗi / chưa cấu hình
 */
export const saveHtmlTemplate = async (templateId, html) => {
  const filePath = htmlPath(templateId);
  try {
    const file = bucket.file(filePath);
    const content = Buffer.from(String(html ?? ''), 'utf-8');

    await file.save(content, {
      resumable: false,
      metadata: {
        contentType: 'text/html; charset=utf-8',
        cacheControl: 'no-cache, max-age=0',
      },
    });

    // Bucket mới của Firebase thường bị khoá public → makePublic() sẽ 403.
    // Không chặn lưu: client đọc qua API proxy nên không cần public.
    let isPublic = false;
    try {
      await file.makePublic();
      isPublic = true;
    } catch (e) {
      console.warn('[firebaseStorage] makePublic bị từ chối (không sao, client đọc qua API):', e.message);
    }

    return { url: publicUrl(filePath), path: filePath, size: content.length, isPublic };
  } catch (e) {
    console.error('[firebaseStorage] Lỗi upload HTML template:', e.message);
    return null;
  }
};

/**
 * Tải HTML game từ Firebase Storage.
 * @returns {Promise<string|null>}
 */
export const getHtmlTemplate = async (templateId) => {
  if (!isStorageReady()) return null;
  try {
    const [contents] = await bucket.file(htmlPath(templateId)).download();
    return contents.toString('utf-8');
  } catch (e) {
    const missing = e.code === 404 || /not found/i.test(e.message || '');
    if (!missing) console.error('[firebaseStorage] Lỗi tải HTML template:', e.message);
    return null;
  }
};

/**
 * Xoá file HTML trên Firebase (best-effort).
 * Dùng khi template bị xoá hoặc HTML được xoá.
 */
export const deleteHtmlTemplate = async (templateId) => {
  if (!isStorageReady()) return false;
  try {
    await bucket.file(htmlPath(templateId)).delete({ ignoreNotFound: true });
    return true;
  } catch (e) {
    console.error('[firebaseStorage] Lỗi xoá HTML template:', e.message);
    return false;
  }
};