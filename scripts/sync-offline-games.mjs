#!/usr/bin/env node
// scripts/sync-offline-games.mjs
//
// Đồng bộ manifest với những file .html đang nằm trong src/games/offline/.
//
//   npm run games:sync           ← thêm game mới, GIỮ NGUYÊN metadata cũ
//   npm run games:sync -- --dry-run
//
// Vì sao cần script này: OfflineGamePage dùng import.meta.glob nên FILE HTML
// nào trong thư mục cũng chơi được ngay. Nhưng trang chủ lấy tên/emoji/màu từ
// manifest, nên game mới sẽ hiện tên lạ ("Night Strike") và màu ngẫu nhiên cho
// tới khi được thêm vào manifest. Script này bổ sung dòng đó cho bạn.
//
// File đã có trong manifest thì KHÔNG bị đụng tới — kéo dài code sẽ không bị ghi đè.

import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve(process.cwd(), "src/games/offline");
const MANIFEST = path.resolve(process.cwd(), "src/games/src/manifest.js");
const DRY = process.argv.includes("--dry-run");

const GRADS = [
  "from-red-400 to-rose-600", "from-amber-400 to-orange-500", "from-emerald-400 to-green-600",
  "from-sky-400 to-blue-500", "from-violet-400 to-purple-600", "from-teal-400 to-emerald-600",
  "from-pink-400 to-rose-500", "from-indigo-400 to-blue-600",
];

/** Giải mã entity HTML cơ bản để tên hiển thị sạch. */
function decodeEntities(t) {
  return String(t)
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&mdash;|&ndash;/gi, "–").replace(/&hellip;/gi, "…")
    .replace(/&times;/gi, "×").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function titleCase(id) {
  return String(id).split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** Bỏ dấu tiếng Việt để nhét an toàn vào chuỗi JS single-quoted. */
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, " ");

if (!fs.existsSync(DIR)) {
  console.error(`✖ Không thấy thư mục: ${DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html")).sort();
const src = fs.readFileSync(MANIFEST, "utf8").replace(/\r\n/g, "\n");
const inManifest = new Set([...src.matchAll(/\{ id: '([^']+)'/g)].map((m) => m[1]));

const rows = [];
const added = [];

for (const file of files) {
  const id = file.replace(/\.html$/, "");
  if (inManifest.has(id)) continue;

  const html = fs.readFileSync(path.join(DIR, file), "utf8");
  const rawTitle = decodeEntities(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || titleCase(id));
  const icon = rawTitle.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u)?.[0] || "🎮";
  const name = rawTitle.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim() || titleCase(id);
  const needsNet = /<script[^>]*\bsrc=["']https?:/i.test(html);
  const grad = GRADS[Math.abs(hash(id)) % GRADS.length];

  const line =
    `  { id: '${esc(id)}', name: '${esc(name)}', icon: '${icon}', tag: 'Offline', ` +
    `grad: '${grad}', engine: 'single',${needsNet ? " needsNet: true," : ""} ` +
    `file: 'src/games/offline/${id}.html' },`;

  added.push({ line, id, name, icon, needsNet, grad });
  rows.push({ id, "tên lấy từ": name, icon, "cần mạng": needsNet ? "có" : "không" });
}

const missing = [...inManifest].filter((id) => !files.some((f) => f.replace(/\.html$/, "") === id));

console.log(`\nThư mục : src/games/offline/  (${files.length} file)`);
console.log(`Manifest: ${inManifest.size} game\n`);

if (!added.length) {
  console.log("✔ Không có game mới — manifest đã đầy đủ.");
} else {
  console.table(rows);
  if (!DRY) {
    // Chèn trước dấu `];` kết thúc mảng
    const out = src.replace(/\n\];\n/, `\n${added.map((a) => a.line).join("\n")}\n];\n`);
    fs.writeFileSync(MANIFEST, out, "utf8");
    console.log(`✔ Đã thêm ${added.length} game vào manifest: ${added.map((a) => a.id).join(", ")}`);
    console.log("  Sửa tên/emoji/màu trong src/games/src/manifest.js nếu muốn.");
  } else {
    console.log(`(DRY-RUN) sẽ thêm ${added.length} game. Bỏ --dry-run để ghi file.`);
  }
}

if (missing.length) {
  console.log(`\n⚠ Manifest có nhưng thư mục không có file: ${missing.join(", ")}`);
  console.log("  (file đã bị xoá — xoá luôn dòng trong manifest nếu không dùng nữa)");
}

console.log("\nLưu ý: OfflineGamePage dùng import.meta.glob nên game mới ĐÃ chơi được ngay,");
console.log("      kể cả chưa có trong manifest (tên/emoji sẽ tự dựng tạm).");