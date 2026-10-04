#!/usr/bin/env node
// scripts/migrate-templates-to-storage.mjs
//
// Đổi `templates.htmlTemplate` từ HTML thô sang LINK trên dịch vụ lưu trữ
// (Cloudflare R2 hoặc Firebase Storage — cái nào được cấu hình sẽ được dùng).
//
//   node scripts/migrate-templates-to-storage.mjs --dry-run       ← chỉ xem, không ghi
//   node scripts/migrate-templates-to-storage.mjs                 ← thực sự migrate
//   node scripts/migrate-templates-to-storage.mjs --id=<id>       ← 1 template
//   node scripts/migrate-templates-to-storage.mjs --force         ← migrate lại link cũ
//   node scripts/migrate-templates-to-storage.mjs --fix-cors      ← (chỉ R2) đặt CORS
//
// An toàn:
//   • Template nào upload lỗi → giữ nguyên HTML thô trong DB, KHÔNG mất gì.
//   • Mặc định BỎ QUA template đã là link (tránh tạo file trùng).
//   • Probe chạy trước; nếu provider không dùng được thì DỪNG, không đụng DB.

import { MongoClient, ObjectId } from "mongodb";
import * as storage from "../src/services/templateStorageService.js";
import { isR2Configured, getR2Config, getR2Client } from "../src/config/r2.js";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const FORCE = args.includes("--force");
const FIX_CORS = args.includes("--fix-cors");
const ONLY_ID = (args.find((a) => a.startsWith("--id=")) || "").slice("--id=".length).trim();

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.MONGODB_DB || "educational_games";

const isLink = (v) => /^https?:\/\//i.test(String(v || "").trim());

function fmtSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

/** Đặt CORS + public access cho bucket R2 (bắt buộc để iframe fetch được). */
async function fixCors() {
  const c = getR2Config();
  const { PutBucketCorsCommand } = await import("@aws-sdk/client-s3");
  const client = await getR2Client();
  await client.send(
    new PutBucketCorsCommand({
      Bucket: c.bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ["*"],
            AllowedMethods: ["GET", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag", "Content-Length", "Content-Type"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  );
  console.log(`✔ Đã đặt CORS cho bucket ${c.bucket} (GET/HEAD, mọi origin)`);
  console.log("  Nhớ bật 'Public access' cho bucket trong Cloudflare console nếu link chưa mở được.");
}

async function main() {
  // ── 0. Kiểm tra provider trước khi đụng DB ──
  const provider = storage.activeProvider();
  if (!provider) {
    console.error(`✖ Chưa cấu hình nhà cung cấp lưu trữ. ${storage.configErrorHint()}`);
    console.error("  → Làm theo hướng dẫn: npm run check:storage");
    process.exit(1);
  }
  console.log(`Provider: ${storage.providerLabel()}`);

  if (FIX_CORS) {
    if (provider !== "r2") {
      console.error("✖ --fix-cors chỉ dùng cho Cloudflare R2. Firebase dùng Storage Rules trong console.");
      process.exit(1);
    }
    await fixCors();
    if (DRY) process.exit(0);
  }

  // Probe: bucket tồn tại / có quyền ghi không?
  const probe = await storage.saveHtmlTemplate("__probe__", "ok");
  if (!probe) {
    console.error("✖ Storage không dùng được (probe upload thất bại).");
    if (provider === "r2") {
      console.error("  Thường do: bucket sai tên, hoặc API token thiếu quyền 'Object Read & Write'.");
      console.error(`  Bucket đang cấu hình: ${getR2Config().bucket}`);
    } else {
      console.error("  Thường do: project chưa bật Billing, hoặc chưa bật Cloud Storage.");
      console.error("  → Firebase Console → Usage & billing → Storage → Get started");
    }
    console.error("  DB KHÔNG bị thay đổi gì.");
    process.exit(1);
  }
  await storage.deleteHtmlPath(storage.htmlPath("__probe__"));
  console.log("✓ Kết nối Storage thành công\n");

  // ── 1. Kết nối Mongo ──
  const client = new MongoClient(URI);
  await client.connect();
  const col = client.db(DB_NAME).collection("templates");
  console.log(`MongoDB: ${DB_NAME}.templates`);

  const query = ONLY_ID ? { _id: new ObjectId(ONLY_ID) } : {};
  const docs = await col.find(query).toArray();
  console.log(`Tìm thấy ${docs.length} template\n`);

  // ── 2. Migrate từng template ──
  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  let bytes = 0;

  for (const doc of docs) {
    const id = doc._id.toString();
    const name = doc.name || "(không tên)";
    const raw = String(doc.htmlTemplate || "");

    if (!raw.trim()) {
      skipped++;
      console.log(`  ⏭  ${name} — chưa có HTML`);
      continue;
    }
    if (isLink(raw) && !FORCE) {
      skipped++;
      console.log(`  ⏭  ${name} — đã là link`);
      continue;
    }
    if (isLink(raw) && FORCE) {
      console.log(`  ↻  ${name} — --force: tải lại nội dung link cũ`);
      try {
        const res = await fetch(raw);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const url = await storage.saveHtmlTemplate(id, text);
        if (!url) throw new Error("upload trả về null");
        if (!DRY) await col.updateOne({ _id: doc._id }, { $set: { htmlTemplate: url, updatedAt: new Date().toISOString() } });
        console.log(`     → ${url}`);
        migrated++;
        bytes += text.length;
      } catch (e) {
        failed++;
        console.log(`     ✖ ${e.message} — giữ nguyên link cũ`);
      }
      continue;
    }

    console.log(`  →  ${name} (${fmtSize(raw.length)})`);
    if (DRY) {
      migrated++;
      bytes += raw.length;
      continue;
    }

    const url = await storage.saveHtmlTemplate(id, raw);
    if (!url) {
      failed++;
      console.log("     ✖ upload lỗi — GIỮ NGUYÊN HTML trong DB");
      continue;
    }
    await col.updateOne({ _id: doc._id }, { $set: { htmlTemplate: url, updatedAt: new Date().toISOString() } });
    console.log(`     ✓ ${url}`);
    migrated++;
    bytes += raw.length;
  }

  await client.close();

  console.log("\n────────────── KẾT QUẢ ──────────────");
  console.log(`  Đã chuyển  : ${migrated}${DRY ? "  (DRY RUN — chưa ghi DB)" : ""}`);
  console.log(`  Bỏ qua     : ${skipped}`);
  console.log(`  Lỗi        : ${failed}   (HTML được giữ nguyên trong DB)`);
  console.log(`  Dung lượng : ${fmtSize(bytes)}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("✖", e.message);
  process.exit(1);
});

// Giữ isR2Configured cho script khác import
export { isR2Configured };
