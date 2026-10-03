// scripts/migrate-templates-to-firebase.mjs
//
// Đổi `templates.htmlTemplate` từ HTML thô sang LINK Firebase Storage.
//
//   node scripts/migrate-templates-to-firebase.mjs --dry-run   ← chỉ xem, không ghi
//   node scripts/migrate-templates-to-firebase.mjs             ← thực sự migrate
//   node scripts/migrate-templates-to-firebase.mjs --id=<templateId>   ← 1 template
//   node scripts/migrate-templates-to-firebase.mjs --force     ← migrate lại cả link cũ
//
// YÊU CẦU: project Firebase phải bật Billing + Storage (Firebase Console → Storage).
//          Nếu chưa bật, script báo rõ và DỪNG, không đụng gì vào DB.
//
// An toàn:
//   • Template nào upload lỗi → giữ nguyên HTML thô trong DB, không mất gì.
//   • Mặc định BỎ QUA template đã là link (tránh tạo file trùng).

import { MongoClient, ObjectId } from 'mongodb';
import * as firebaseStorage from '../src/services/firebaseStorageService.js';
import { isFirebaseConfigured, missingFirebaseKeys, getFirebaseConfig } from '../src/config/firebase.js';

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const FORCE = args.includes('--force');
const ONLY_ID = (args.find(a => a.startsWith('--id=')) || '').slice('--id='.length).trim();

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB || 'educational_games';

function isLink(v) {
  return /^https?:\/\//i.test(String(v || '').trim());
}

function fmtSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  // ── 0. Kiểm tra Firebase trước khi đụng DB ──
  if (!isFirebaseConfigured()) {
    console.error('✖ Firebase chưa cấu hình. Thiếu:', missingFirebaseKeys().join(', '));
    console.error('  → Điền vào server/.env hoặc tạo server/src/config/firebase.local.js');
    process.exit(1);
  }
  const cfg = getFirebaseConfig();
  console.log(`Firebase: ${cfg.projectId} / bucket ${cfg.storageBucket}`);

  // Probe nhanh: bucket có tồn tại / service account có quyền ghi không?
  const probe = await firebaseStorage.saveHtmlTemplate('__probe__', 'ok');
  if (!probe) {
    console.error('✖ Storage không dùng được (probe upload thất bại).');
    console.error('  Thường do một trong hai nguyên nhân:');
    console.error('   • Project chưa bật Billing            → Firebase Console → Usage & billing');
    console.error('   • Project chưa bật Cloud Storage      → Firebase Console → Storage → Get started');
    console.error(`  Bucket đang cấu hình: ${cfg.storageBucket}`);
    console.error('  DB KHÔNG bị thay đổi gì.');
    process.exit(1);
  }
  await firebaseStorage.deleteHtmlPath('templates/__probe__.html');
  console.log('✓ Kết nối Storage thành công\n');

  // ── 1. Kết nối Mongo ──
  const client = new MongoClient(URI);
  await client.connect();
  const col = client.db(DB_NAME).collection('templates');
  console.log(`MongoDB: ${DB_NAME}.templates`);

  const query = ONLY_ID ? { _id: new ObjectId(ONLY_ID) } : {};
  const docs = await col.find(query).toArray();
  console.log(`Tìm thấy ${docs.length} template\n`);

  // ── 2. Migrate từng template ──
  let migrated = 0, skipped = 0, failed = 0, bytes = 0;

  for (const doc of docs) {
    const id = doc._id.toString();
    const name = doc.name || '(không tên)';
    const raw = String(doc.htmlTemplate || '');

    if (!raw.trim()) { skipped++; console.log(`  ⏭  ${name} — chưa có HTML`); continue; }
    if (isLink(raw) && !FORCE) { skipped++; console.log(`  ⏭  ${name} — đã là link`); continue; }
    if (isLink(raw) && FORCE) {
      console.log(`  ↻  ${name} — --force: tải lại nội dung link cũ`);
      try {
        const res = await fetch(raw);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const url = await firebaseStorage.saveHtmlTemplate(id, text);
        if (!url) throw new Error('upload trả về null');
        if (!DRY) await col.updateOne({ _id: doc._id }, { $set: { htmlTemplate: url, updatedAt: new Date().toISOString() } });
        console.log(`     → ${url}`);
        migrated++; bytes += text.length;
      } catch (e) { failed++; console.log(`     ✖ ${e.message} — giữ nguyên link cũ`); }
      continue;
    }

    console.log(`  →  ${name} (${fmtSize(raw.length)})`);
    if (DRY) { migrated++; bytes += raw.length; continue; }

    const url = await firebaseStorage.saveHtmlTemplate(id, raw);
    if (!url) {
      failed++;
      console.log(`     ✖ upload lỗi — GIỮ NGUYÊN HTML trong DB`);
      continue;
    }
    await col.updateOne(
      { _id: doc._id },
      { $set: { htmlTemplate: url, updatedAt: new Date().toISOString() } }
    );
    console.log(`     ✓ ${url}`);
    migrated++; bytes += raw.length;
  }

  await client.close();

  console.log('\n────────────── KẾT QUẢ ──────────────');
  console.log(`  Đã chuyển : ${migrated}${DRY ? '  (DRY RUN — chưa ghi DB)' : ''}`);
  console.log(`  Bỏ qua    : ${skipped}`);
  console.log(`  Lỗi       : ${failed}   (HTML được giữ nguyên trong DB)`);
  console.log(`  Dung lượng : ${fmtSize(bytes)}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error('✖', e.message); process.exit(1); });