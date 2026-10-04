// config/r2.js
//
// Cấu hình Cloudflare R2 (S3-compatible) để lưu HTML game.
//
// R2 free tier: 10 GB, 1 triệu write/tháng, 10 triệu read/tháng.
// Không cần bật billing Firebase.
//
// ⚠ VỀ THỨ TỰ NẠP ENV — giống config/firebase.js: ESM hoist `import` và evaluate
// module theo thứ tự phụ thuộc TRƯỚC khi thân module chạy, nên `config/r2.js`
// (không phụ thuộc `config.js`) có thể được evaluate trước lúc `config.js` kịp
// gọi `dotenv.config()` → process.env rỗng. Vì vậy file này TỰ nạp .env.
//
// Nguồn cấu hình (theo thứ tự ưu tiên):
//   1. server/src/config/r2.local.js  ← file literal, KHÔNG commit (git-ignored)
//   2. process.env (server/.env hoặc biến môi trường trên Render)
//
// Biến cần có:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
//   R2_PUBLIC_URL   ← link public của bucket, VD: https://pub-xxx.r2.dev
//                     hoặc custom domain https://cdn.tên-domain.com

import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import dotenv from "dotenv";

const require_ = createRequire(import.meta.url);

const LOCAL_FILE = new URL("./r2.local.js", import.meta.url);

// Nạp .env ngay tại đây để không phụ thuộc thứ tự import
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const REQUIRED_KEYS = ["accountId", "accessKeyId", "secretAccessKey", "bucket", "publicUrl"];

/** Đường dẫn object của 1 template. */
export const R2_PREFIX = "templates";

let cachedClient = null;

/**
 * Đọc file literal tuỳ chọn (không có thì trả null).
 *
 * ⚠ `existsSync` đi thẳng ra filesystem, còn `require`/`require.resolve` của
 * Node CACHE LẠI cả kết quả thất bại. Nếu chỉ dùng require, thì lần gọi đầu
 * tiên khi file chưa tồn tại sẽ khiến mọi lần gọi sau vĩnh viễn trả "không có
 * file" — tạo file lúc đang chạy cũng không được nhận.
 *
 * Xoá cache `require` mỗi lần gọi còn giúp sửa khoá trong file local có hiệu
 * lực ngay, không cần khởi động lại server.
 */
function readLocalFile() {
  if (!existsSync(LOCAL_FILE)) return null;
  try {
    const abs = require_.resolve("./r2.local.js");
    delete require_.cache[abs];
    const mod = require_("./r2.local.js");
    return mod?.r2Config || mod?.default || mod || null;
  } catch {
    return null;
  }
}

/** Cấu hình R2 đang dùng, đã chuẩn hoá. */
export function getR2Config() {
  const local = readLocalFile();
  const src = local?.accountId && local?.accessKeyId && local?.secretAccessKey ? local : process.env;

  const publicUrl = String(src.publicUrl ?? src.R2_PUBLIC_URL ?? "").trim().replace(/\/+$/, "");

  return {
    accountId: src.accountId ?? src.R2_ACCOUNT_ID,
    accessKeyId: src.accessKeyId ?? src.R2_ACCESS_KEY_ID,
    secretAccessKey: src.secretAccessKey ?? src.R2_SECRET_ACCESS_KEY,
    bucket: src.bucket ?? src.R2_BUCKET_NAME,
    // Endpoint S3 của R2, luôn kết thúc bằng dấu /
    endpoint: `https://${src.accountId ?? src.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
    // Link public để iframe fetch trực tiếp (bỏ dấu / cuối)
    publicUrl,
  };
}

/** Danh sách khoá còn thiếu (rỗng = đã cấu hình đủ). */
export function missingR2Keys() {
  const c = getR2Config();
  return REQUIRED_KEYS.filter((k) => !c[k]);
}

export function isR2Configured() {
  return missingR2Keys().length === 0;
}

/** Link public của bucket, không có dấu / cuối. */
export function r2PublicUrl() {
  return getR2Config().publicUrl || "";
}

/** Khoá object an toàn cho đường dẫn. */
export function htmlKey(templateId) {
  const safe = String(templateId || "").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100);
  return `${R2_PREFIX}/${safe}.html`;
}

/** Client S3 của R2 (init 1 lần). Ném lỗi rõ ràng nếu thiếu cấu hình. */
export async function getR2Client() {
  if (cachedClient) return cachedClient;

  const missing = missingR2Keys();
  if (missing.length) {
    throw new Error(
      `R2 chưa cấu hình. Thiếu: ${missing.join(", ")}. ` +
        `Điền các biến tương ứng vào server/.env hoặc tạo server/src/config/r2.local.js`
    );
  }

  const c = getR2Config();
  const { S3Client } = await import("@aws-sdk/client-s3");
  cachedClient = new S3Client({
    region: "auto",
    endpoint: c.endpoint,
    credentials: { accessKeyId: c.accessKeyId, secretAccessKey: c.secretAccessKey },
  });
  return cachedClient;
}
