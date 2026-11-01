// scratch/unused-services-audit.mjs
//
// Kiểm tra mục H của update_admin_page.md: liệt kê các file dịch vụ (services /
// lib) KHÔNG còn được code khác tham chiếu.
//
// Cách làm: dựng đồ thị import từ các entry point rồi tìm mọi file với tới được
// (reachability). File services/lib không tới được = ứng viên bỏ. Script chỉ ĐỌC,
// không xoá gì cả — quyết định xoá vẫn làm tay sau khi xem từng file.
//
// chạy:  node scratch/unused-services-audit.mjs   (cwd = gốc repo)

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";

const ROOT = resolve(".");
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "build", "coverage", ".qoder", "scratch", "uploads"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p, out);
    } else if (/\.(js|jsx|mjs)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

/** Đường dẫn tương đối từ gốc repo, luôn dùng dấu gạch chéo. */
function rel(f) {
  return relative(ROOT, f).replace(/\\/g, "/");
}

const files = ["server/src", "src", "scripts", "edu-game-ai-service"]
  .filter((d) => existsSync(join(ROOT, d)))
  .flatMap((d) => walk(join(ROOT, d)));

/** Lấy mọi specifier trong import/require/dynamic import. */
const SPEC_RE =
  /(?:import|export)\s[^"']*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)|from\s*["']([^"']+)["']/g;

const EXT_CANDIDATES = ["", ".js", ".jsx", ".mjs", "/index.js", "/index.jsx"];

function resolveSpec(spec, fromFile) {
  if (!spec.startsWith(".")) return null; // package npm → bỏ qua
  const base = resolve(dirname(fromFile), spec);
  for (const ext of EXT_CANDIDATES) {
    const p = base + ext;
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

const graph = new Map(); // file -> Set(file)
const rawSpecs = new Map(); // file -> string[] (specifier thô, để tra đường dẫn động)

for (const f of files) {
  const code = readFileSync(f, "utf8");
  const deps = new Set();
  const specs = [];
  let m;
  SPEC_RE.lastIndex = 0;
  while ((m = SPEC_RE.exec(code))) {
    const spec = m[1] || m[2] || m[3] || m[4];
    specs.push(spec);
    const r = resolveSpec(spec, f);
    if (r) deps.add(r);
  }
  graph.set(f, deps);
  rawSpecs.set(f, specs);
}

// Entry point: server + client + script CLI + file tự-chạy (có listen()/createServer/main).
const entries = files.filter((f) => {
  const rel = relative(ROOT, f).replace(/\\/g, "/");
  if (rel === "src/main.jsx" || rel === "server/src/server.js") return true;
  if (rel.startsWith("scripts/") || rel.startsWith("edu-game-ai-service/")) return true;
  const code = readFileSync(f, "utf8");
  return /\.listen\(|createServer\(|#!\/usr\/bin|process\.argv/.test(code);
});

const seen = new Set();
const stack = [...entries];
while (stack.length) {
  const f = stack.pop();
  if (seen.has(f)) continue;
  seen.add(f);
  for (const d of graph.get(f) || []) stack.push(d);
}

const buckets = {
  "server/src/services": files.filter((f) => /^server\/src\/services\//.test(rel(f))),
  "src/services": files.filter((f) => /^src\/services\//.test(rel(f))),
  "src/lib": files.filter((f) => /^src\/lib\//.test(rel(f))),
  "src/hooks + src/socket": files.filter((f) => /^(src\/hooks|src\/socket)\//.test(rel(f))),
};

let unreachableTotal = 0;
for (const [label, list] of Object.entries(buckets)) {
  const dead = list.filter((f) => !seen.has(f));
  const alive = list.length - dead.length;
  console.log(`\n### ${label} — ${list.length} file, ${alive} được tham chiếu, ${dead.length} KHÔNG tới được`);
  for (const f of dead) {
    unreachableTotal++;
    const rel = relative(ROOT, f).replace(/\\/g, "/");
    // Có ai nhắc tới bằng TÊN file (chuỗi) dù không import tĩnh không?
    const base = rel.split("/").pop().replace(/\.(jsx?|mjs)$/, "");
    const soft = files.filter((g) => g !== f && rawSpecs.get(g).some((s) => s.includes(base)));
    console.log(`  - ${rel}${soft.length ? `  ← nhắc tới bằng chuỗi ở: ${soft.map((s) => relative(ROOT, s).replace(/\\/g, "/")).join(", ")}` : ""}`);
  }
}

console.log(`\nTổng file không tới được trong 3 thư mục dịch vụ: ${unreachableTotal}`);
console.log(`Entry point dùng để lan toả: ${entries.map((e) => relative(ROOT, e).replace(/\\/g, "/")).slice(0, 12).join(", ")}${entries.length > 12 ? ` … (+${entries.length - 12})` : ""}`);
