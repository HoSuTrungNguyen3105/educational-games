// scratch/service-usage-audit.mjs
//
// Mục H của update_admin_page.md: kiểm tra xem còn file dịch vụ (service) nào
// không được dùng nữa. Script CHỈ ĐỌC — không xoá, không sửa gì.
//
// Cách làm: gom toàn bộ file .js/.jsx trong server/src và src, phân tích mọi
// statement import/export-from/dynamic-import, rồi đếm số lần mỗi file dịch vụ
// được trích dẫn. File có 0 tham chiếu tĩnh mới là ứng viên xoá; sau đó vẫn phải
// xem tay (route động, import string, file self-entry…).
//
// chạy:  node scratch/service-usage-audit.mjs

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";

const ROOT = resolve(".");
const SKIP = new Set(["node_modules", "dist", ".git", "build", "coverage", ".qoder", "scratch", "uploads", "public"]);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP.has(name)) walk(p, out);
    } else if (/\.(js|jsx|mjs)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

const rel = (f) => relative(ROOT, f).replace(/\\/g, "/");
const files = [...walk(join(ROOT, "server/src")), ...walk(join(ROOT, "src"))].filter(
  // Loại HTML game offline (không phải module ES) — chỉ đi .js/.jsx nên đã tự loại.
  (f) => !/src[\\/]games[\\/]/.test(f),
);

const SPEC_RE =
  /(?:import|export)\s+(?:[\s\S]*?)\s?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;

/** file -> danh sách specifier thô nó import */
const imports = new Map();
for (const f of files) {
  const code = readFileSync(f, "utf8");
  const specs = [];
  let m;
  SPEC_RE.lastIndex = 0;
  while ((m = SPEC_RE.exec(code))) specs.push(m[1] || m[2] || m[3]);
  imports.set(f, specs);
}

/** đường dẫn tuyệt đối của 1 specifier (chỉ tính họ hàng "./…"), null nếu là package npm */
function resolveSpec(spec, fromFile) {
  if (!spec.startsWith(".")) return null;
  const base = resolve(dirname(fromFile), spec);
  for (const ext of ["", ".js", ".jsx", ".mjs", "/index.js", "/index.jsx"]) {
    const p = base + ext;
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

const refCount = new Map(); // file -> [{from, raw}]
for (const [f, specs] of imports) {
  for (const spec of specs) {
    const r = resolveSpec(spec, f);
    if (!r) continue;
    if (!refCount.has(r)) refCount.set(r, []);
    refCount.get(r).push({ from: rel(f), spec });
  }
}

const buckets = [
  ["server/src/services", /^server\/src\/services\//],
  ["server/src (khác)", /^server\/src\//],
  ["src/services", /^src\/services\//],
  ["src/lib", /^src\/lib\//],
  ["src/hooks", /^src\/hooks\//],
  ["src/socket", /^src\/socket\//],
  ["src/firebase", /^src\/firebase\//],
];

const ENTRY_OK = new Set([
  "server/src/server.js",
  "src/main.jsx",
]);

for (const [label, re] of buckets) {
  const list = files.map(rel).filter((r) => re.test(r) && /(?:services|lib|hooks|socket|firebase)\//.test(r));
  if (!list.length) continue;
  const dead = list.filter((r) => {
    if (ENTRY_OK.has(r)) return false;
    const abs = join(ROOT, r);
    return !refCount.has(abs);
  });
  console.log(`\n### ${label}: ${list.length} file — ${dead.length} không ai import`);
  for (const r of dead) {
    const base = r.split("/").pop().replace(/\.(jsx?|mjs)$/, "");
    // Có nơi nào nhắc tới bằng chuỗi (route lười, console, comment…) không?
    const mentions = files
      .filter((f) => rel(f) !== r)
      .filter((f) => readFileSync(f, "utf8").includes(base))
      .map(rel);
    console.log(`  - ${r}${mentions.length ? `   [nhắc tới bằng tên ở: ${mentions.join(", ")}]` : "   [KHÔNG nhắc tới ở đâu]"}`);
  }
}
