import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname, dirname as d } from "node:path";

const ROOT = "src/games";

/** Mọi file .html/.js/.jsx/.css dưới src/games, bỏ qua offline/ (giữ nguyên). */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(html|js|jsx|css)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const RE = /(?:src|href)\s*=\s*["']([^"']+)["']|import\s+(?:[^"']*?\s+from\s+)?["'](\.[^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\.meta\.glob\(\s*["']([^"']+)["']/g;

const refs = [];
for (const f of files) {
  if (f.includes(join("offline"))) continue;         // offline không di chuyển
  if (f.includes(join("_shared"))) continue;
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(RE)) {
    const raw = m[1] || m[2] || m[3] || m[4];
    if (!raw) continue;
    // chỉ quan tâm tham chiếu TƯƠNG ĐỐI
    if (/^(https?:)?\/\//.test(raw) || raw.startsWith("#") || raw.startsWith("data:")) continue;
    if (!raw.startsWith(".") && !raw.startsWith("/") && !raw.includes("src/games")) continue;
    refs.push({ file: f, raw, target: raw.startsWith(".") ? join(d(f), raw.split(/[?#]/)[0]) : raw });
  }
}

/** Gom theo thư mục đích để dễ đánh giá. */
const byDir = new Map();
for (const r of refs) {
  const dir = dirname(r.file).replace(/\\/g, "/");
  if (!byDir.has(dir)) byDir.set(dir, []);
  byDir.get(dir).push(r);
}

console.log(`Tổng tham chiếu tương đối (ngoài offline/): ${refs.length}\n`);
for (const [dir, list] of [...byDir].sort()) {
  console.log(`── ${dir}`);
  const seen = new Set();
  for (const r of list) {
    if (seen.has(r.raw)) continue;
    seen.add(r.raw);
    console.log(`     ${r.raw}`);
  }
}