// scratch/unused-exports-audit.mjs
//
// Mục H (bổ sung cho service-usage-audit.mjs): file dịch vụ nào cũng còn được
// import, nhưng bên trong có thể còn HÀM export không ai gọi. Script này liệt kê
// từng export cấp 0 lần tham chiếu ở ngoài file của nó.
//
// CHỈ ĐỌC — không xoá. Kết quả phải xem tay vì:
//  - export dùng qua `import * as x` rồi gọi x.ten() → có tính (đếm theo tên)
//  - export chỉ dùng nội bộ (re-export ở index.js) → tên vẫn xuất hiện nên không bị báo
//  - tên chung chung (get/list/save…) dễ trùng → xem kỹ trước khi xoá
//
// chạy:  node scratch/unused-exports-audit.mjs

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(".");
const SKIP = new Set(["node_modules", "dist", ".git", "build", "coverage", ".qoder", "scratch", "uploads", "public"]);
const rel = (f) => relative(ROOT, f).replace(/\\/g, "/");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP.has(name)) walk(p, out);
    } else if (/\.(js|jsx|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

// Corpus rộng hơn cả thư mục dịch vụ: scripts/ (migration CLI, seed) và
// edu-game-ai-service cũng được quét để không báo nhầm export "chết" khi thực tế
// có script bảo trì đang dùng.
const dirs = ["server/src", "src", "scripts", "edu-game-ai-service"]
  .map((d) => join(ROOT, d))
  .filter(existsSync);
const files = dirs.flatMap((d) => walk(d)).filter((f) => !/src[\\/]games[\\/]/.test(f));

const EXPORT_RE =
  /^export\s+(?:async\s+)?(?:function\*?|const|let|var|class)\s+([A-Za-z0-9_$]+)/gm;

const targets = files.filter((f) => /(?:services|lib|hooks|socket|firebase)[\\/]/.test(rel(f)));

// Toàn bộ mã nguồn (trừ game HTML) để đếm tham chiếu theo tên.
const corpus = files.map((f) => ({ f, code: readFileSync(f, "utf8") }));

const report = [];
for (const f of targets) {
  const self = corpus.find((c) => c.f === f).code;
  const names = [...self.matchAll(EXPORT_RE)].map((m) => m[1]);
  const defaultExport = /export\s+default\s/.test(self);
  const used = [];
  const unused = [];
  for (const name of names) {
    let count = 0;
    for (const c of corpus) {
      if (c.f === f) continue;
      const re = new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`, "g");
      count += (c.code.match(re) || []).length;
    }
    (count === 0 ? unused : used).push({ name, count });
  }
  if (unused.length || (defaultExport && !names.length)) {
    report.push({ file: rel(f), unused, defaultExport, totalExports: names.length });
  }
}

let total = 0;
for (const r of report) {
  if (!r.unused.length && !r.defaultExport) continue;
  console.log(`\n${r.file}  (${r.totalExports} export)`);
  for (const u of r.unused) {
    total++;
    console.log(`   ✗ ${u.name} — 0 tham chiếu ngoài file`);
  }
}
console.log(`\nTổng số export không ai dùng: ${total}  (trên ${report.length} file có dấu hiệu)`);
