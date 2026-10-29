// scratch/audit-unused.mjs — liệt kê ảnh trong public/ và file rác ở gốc repo
// KHÔNG xoá gì cả, chỉ đếm số lần được tham chiếu trong mã nguồn.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SKIP_DIR = new Set(["node_modules", "dist", ".git", "edu-game-ai-service", ".jdk", "coverage", ".vite"]);

// Toàn bộ nội dung mã nguồn + html + json + md (bỏ public vì ảnh tự khớp tên)
function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue;
      yield* walk(path.join(dir, e.name));
    } else {
      yield path.join(dir, e.name);
    }
  }
}

const corpus = [];
for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f).replace(/\\/g, "/");
  if (rel.startsWith("public/")) continue;
  if (rel === "scratch/audit-unused.mjs") continue;
  if (!/\.(js|jsx|ts|tsx|mjs|cjs|json|html|css|md|yaml|yml|txt|xml|svg)$/i.test(rel)) continue;
  if (fs.statSync(f).size > 6_000_000) continue;
  try { corpus.push({ rel, text: fs.readFileSync(f, "utf8") }); } catch { /* binary */ }
}

const size = (p) => (fs.statSync(p).size / 1024).toFixed(0) + " KB";

/* ── 1. ảnh trong public/ ── */
const publicFiles = fs.readdirSync(path.join(ROOT, "public"))
  .filter((f) => /\.(png|jpe?g|webp|gif|svg|ico|mp3|wav|ogg)$/i.test(f))
  .map((f) => ({ f, bytes: fs.statSync(path.join(ROOT, "public", f)).size }))
  .sort((a, b) => b.bytes - a.bytes);

const hits = (needle) => {
  const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return corpus.filter((c) => re.test(c.text)).map((c) => c.rel);
};

const orphan = [];
console.log("\n=== public/ : số nơi tham chiếu ===");
for (const { f, bytes } of publicFiles) {
  const h = hits(f);
  if (!h.length) orphan.push({ f, bytes });
  if (process.env.VERBOSE) console.log(`${String(h.length).padStart(3)}  ${f.padEnd(40)} ${size(path.join("public", f))}  ${h.slice(0, 2).join(", ")}`);
}
console.log(`\n-- KHÔNG nơi nào tham chiếu (${orphan.length} file, ${(orphan.reduce((s, o) => s + o.bytes, 0) / 1048576).toFixed(1)} MB) --`);
orphan.forEach((o) => console.log(`   ${o.f.padEnd(40)} ${(o.bytes / 1024).toFixed(0)} KB`));

/* ── 2. file ở gốc repo ── */
const rootFiles = fs.readdirSync(ROOT).filter((f) => fs.statSync(path.join(ROOT, f)).isFile());
console.log("\n=== gốc repo: file lạ (không phải entry chuẩn) ===");
const KEEP = new Set(["package.json", "package-lock.json", "vite.config.js", "eslint.config.js", "index.html", "render.yaml", "README.md", ".gitignore", ".env.example"]);
for (const f of rootFiles) {
  if (KEEP.has(f) || f.startsWith(".")) continue;
  const h = hits(f);
  const marker = h.length ? "dùng  " : "RẮC? ";
  console.log(`  ${marker}${f.padEnd(34)} ${size(f)}${h.length ? "  ← " + h.slice(0, 2).join(", ") : ""}`);
}

/* ── 3. thư mục nặng ── */
const du = (dir) => {
  let s = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) s += du(path.join(dir, e.name)); }
    else s += fs.statSync(path.join(dir, e.name)).size;
  }
  return s;
};
console.log("\n=== dung luong thu muc (bo node_modules/dist/.git) ===");
for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || SKIP_DIR.has(e.name)) continue;
  console.log(`  ${(du(path.join(ROOT, e.name)) / 1048576).toFixed(1)} MB  ${e.name}/`);
}
console.log(`  ${(du(path.join(ROOT, "public")) / 1048576).toFixed(1)} MB  public/ (tinh rieng)`);
