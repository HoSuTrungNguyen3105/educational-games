#!/usr/bin/env node
/**
 * Kiểm tra dịch vụ lưu trữ HTML (Cloudflare R2 / Firebase Storage) đã sẵn sàng chưa.
 *
 *   cd server
 *   npm run check:storage
 *
 * Chỉ ĐỌC + một probe upload/xoá nhỏ. Không đụng DB.
 */
import { activeProvider, providerLabel, configErrorHint, saveHtmlTemplate, deleteHtmlTemplate } from "../src/services/templateStorageService.js";
import { getR2Config, isR2Configured, missingR2Keys, getR2Client } from "../src/config/r2.js";

let failed = 0;
const row = (ok, label, detail) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "✔" : "✖"} ${label}${detail ? "  — " + detail : ""}`);
};

const provider = activeProvider();
console.log(`\nPROVIDER : ${provider === "r2" ? "Cloudflare R2" : provider === "firebase" ? "Firebase Storage" : "(chưa có)"}`);
console.log(`ĐANG DÙNG: ${providerLabel()}\n`);

if (!provider) {
  console.log("1) Cấu hình");
  row(false, "chưa có provider nào", configErrorHint() || "R2 thiếu: " + missingR2Keys().join(", "));
  console.log("\n→ Làm theo 1 trong 2 cách:\n");
  console.log("  [A] Cloudflare R2 (miễn phí, không cần billing Firebase)");
  console.log("      1. console.r2.cloudflare.com → tạo bucket, ví dụ: game-templates");
  console.log("      2. R2 → Manage R2 API Tokens → Create API Token → Object Read & Write");
  console.log("      3. Bật 'Public access' cho bucket, lấy link https://pub-xxxx.r2.dev");
  console.log("      4. Điền vào server/.env:");
  console.log("         R2_ACCOUNT_ID=...  R2_ACCESS_KEY_ID=...  R2_SECRET_ACCESS_KEY=...");
  console.log("         R2_BUCKET_NAME=game-templates  R2_PUBLIC_URL=https://pub-xxxx.r2.dev\n");
  console.log("  [B] Firebase Storage (cần nâng gói lên Blaze)");
  console.log("      FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY / FIREBASE_STORAGE_BUCKET\n");
  process.exit(1);
}

if (provider === "r2") {
  const c = getR2Config();
  console.log("1) Cấu hình R2");
  row(isR2Configured(), "đủ 5 biến R2_*", missingR2Keys().join(", ") || "ok");
  row(c.accountId === String(c.accountId).trim(), "không có khoảng trắng thừa trong accountId", c.accountId || "");
  console.log(`    bucket    : ${c.bucket}`);
  console.log(`    public URL: ${c.publicUrl}`);
  console.log(`    endpoint  : ${c.endpoint}`);

  console.log("\n2) Bucket tồn tại?");
  const { HeadBucketCommand, GetBucketCorsCommand } = await import("@aws-sdk/client-s3");
  const client = await getR2Client();
  try {
    await client.send(new HeadBucketCommand({ Bucket: c.bucket }));
    row(true, "bucket tồn tại");
  } catch (e) {
    row(false, "bucket tồn tại", `${e.name}: ${e.message}`);
    console.log("\n→ Kiểm tra R2_BUCKET_NAME có đúng không (Cloudflare console → R2 → Overview).");
    process.exit(1);
  }

  console.log("\n3) CORS (bắt buộc — iframe fetch từ trình duyệt)");
  try {
    const cors = await client.send(new GetBucketCorsCommand({ Bucket: c.bucket }));
    const rules = cors.CORSRules || [];
    const okCors = rules.some((r) =>
      (r.AllowedOrigins || []).some((o) => o === "*" || /localhost|https?:/.test(o)) &&
      (r.AllowedMethods || []).some((m) => ["GET", "HEAD", "*"].includes(m))
    );
    row(okCors, "có rule cho phép GET", okCors ? `${rules.length} rule` : "thiếu rule GET — chạy --fix-cors");
    if (!okCors) console.log("    → Sửa bằng: npm run check:storage -- --fix-cors");
  } catch {
    row(false, "có rule cho phép GET", "chưa cấu hình CORS — chạy npm run check:storage -- --fix-cors");
  }
}

console.log("\n4) Upload thật (probe)");
const probeId = `__probe__${Date.now()}`;
const url = await saveHtmlTemplate(probeId, "<h1>probe</h1>");
row(Boolean(url), "upload được", url || "xem dòng [templateStorage] phía trên để biết lỗi");

if (url) {
  console.log(`    URL: ${url}`);
  console.log("\n5) Đọc public không cần token (iframe cần điều này)");
  try {
    const r = await fetch(url);
    const body = r.ok ? await r.text() : "";
    row(r.ok && body.includes("probe"), "đọc được không cần token",
      r.ok ? `HTTP ${r.status}, ${body.length} byte` : `HTTP ${r.status} → bật Public access cho bucket R2`);
  } catch (e) {
    row(false, "đọc được không cần token", e.message);
  }
  await deleteHtmlTemplate(probeId).catch(() => {});
  console.log("    (đã xoá file probe)");
}

console.log(failed === 0
  ? "\n✔ SẴN SÀNG — chạy: npm run migrate:storage\n"
  : `\n✖ Còn ${failed} vấn đề. Sửa các dòng ✖ rồi chạy lại.\n`);
process.exit(failed ? 1 : 0);
