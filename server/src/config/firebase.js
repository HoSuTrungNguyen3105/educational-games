// config/firebase.js
//
// Khởi tạo firebase-admin cho Storage (HTML game).
//
// ⚠ VỀ THỨ TỰ NẠP ENV — đây là lý do file này tự gọi dotenv:
// ESM hoist toàn bộ `import` và evaluate theo thứ tự phụ thuộc TRƯỚC khi thân
// module chạy. `config/firebase.js` không phụ thuộc `config.js`, nên nó có thể
// được evaluate trước lúc `config.js` kịp gọi `dotenv.config()` → process.env
// rỗng → `cert({...undefined})` làm hỏng lúc boot.
//
// Vì vậy: tự nạp .env + init Storage LAZY (chỉ khi thật sự cần).
//
// Nguồn cấu hình (theo thứ tự ưu tiên):
//   1. server/src/config/firebase.local.js  ← file literal, KHÔNG commit (git-ignored)
//   2. process.env (server/.env)
//
// Nếu không tạo firebase.local.js thì chỉ cần trong server/.env:
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY,
//   FIREBASE_STORAGE_BUCKET

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import dotenv from 'dotenv';
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const require_ = createRequire(import.meta.url);

const LOCAL_FILE = new URL('./firebase.local.js', import.meta.url);

// Nạp .env ngay tại đây để không phụ thuộc thứ tự import
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

const REQUIRED_KEYS = ['projectId', 'clientEmail', 'privateKey', 'storageBucket'];

let cachedBucket = null;

/**
 * Đọc file literal tuỳ chọn (không có thì trả null).
 *
 * ⚠ `existsSync` đi thẳng ra filesystem, còn `require`/`require.resolve` của
 * Node CACHE LẠI cả kết quả thất bại. Nếu chỉ dùng require, thì lần gọi đầu
 * tiên khi file chưa tồn tại sẽ khiến mọi lần gọi sau vĩnh viễn trả "không có
 * file" — tạo file lúc đang chạy cũng không được nhận.
 */
function readLocalFile() {
  if (!existsSync(LOCAL_FILE)) return null;
  try {
    const abs = require_.resolve('./firebase.local.js');
    delete require_.cache[abs];
    const mod = require_('./firebase.local.js');
    return mod?.firebaseConfig || mod?.default || mod || null;
  } catch {
    return null;
  }
}

/** Cấu hình Firebase đang dùng, đã chuẩn hoá về 1 dạng. */
export function getFirebaseConfig() {
  const local = readLocalFile();
  const src = local?.projectId && local?.clientEmail && local?.privateKey ? local : process.env;

  return {
    projectId: src.projectId ?? src.FIREBASE_PROJECT_ID,
    clientEmail: src.clientEmail ?? src.FIREBASE_CLIENT_EMAIL,
    // Private key trong .env thường bị escape \n → khôi phục lại xuống dòng thật
    privateKey: String(src.privateKey ?? src.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    storageBucket: src.storageBucket ?? src.FIREBASE_STORAGE_BUCKET,
  };
}

/** Trả về danh sách khoá còn thiếu (rỗng = đã cấu hình đủ). */
export function missingFirebaseKeys() {
  const c = getFirebaseConfig();
  return REQUIRED_KEYS.filter((k) => !c[k]);
}

export function isFirebaseConfigured() {
  return missingFirebaseKeys().length === 0;
}

/** Bucket của Firebase Storage (init 1 lần). Ném lỗi rõ ràng nếu thiếu cấu hình. */
export function getBucket() {
  if (cachedBucket) return cachedBucket;

  const missing = missingFirebaseKeys();
  if (missing.length) {
    throw new Error(
      `Firebase chưa cấu hình. Thiếu: ${missing.join(", ")}. ` +
      `Điền các biến tương ứng vào server/.env hoặc tạo server/src/config/firebase.local.js`
    );
  }

  const c = getFirebaseConfig();
  // getApps() để không khởi tạo app trùng nếu module bị import nhiều lần
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({ projectId: c.projectId, clientEmail: c.clientEmail, privateKey: c.privateKey }),
        storageBucket: c.storageBucket,
      });

  cachedBucket = getStorage(app).bucket();
  return cachedBucket;
}

/** Chỉ số bucket, dùng để dựng link tải. */
export function getBucketName() {
  return getBucket().name;
}

export default getBucket;