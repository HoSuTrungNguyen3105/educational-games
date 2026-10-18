import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = "src/games";
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(html|js|jsx|css)$/.test(name)) out.push(p);
  }
  return out;
}

const RE = /(?:src|href)\s*=\s*["']([^"']+)["']|import\s+(?:[^"']*?\s+from\s+)?["'](\.[^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

let broken = 0, okCount = 0;
const rows = [];
for (const f of walk(ROOT)) {
  if (f.includes(join("offline")) || f.includes(join("_shared"))) continue;
  for (const m of readFileSync(f, "utf8").matchAll(RE)) {
    const raw = m[1] || m[2] || m[3];
    if (!raw || /^(https?:)?\/\//.test(raw) || raw.startsWith("#") || raw.startsWith("data:")) continue;
    if (!raw.startsWith(".")) continue;
    const clean = raw.split(/[?#]/)[0];
    if (clean === "." || clean === "..") continue;
    const target = join(dirname(f), clean);
    const good = existsSync(target);
    if (good) okCount++;
    else { broken++; rows.push(`${f.replace(/\\/g, "/")}  ->  ${raw}`); }
  }
}

console.log(`\nTham chiếu tương đối: ${okCount} còn tốt, ${broken} ĐANG GÃY\n`);
const byDir = new Map();
for (const r of rows) {
  const dir = r.split("  ->  ")[0].split("/").slice(0, -1).join("/");
  if (!byDir.has(dir)) byDir.set(dir, []);
  byDir.get(dir).push(r);
}
for (const [dir, list] of [...byDir].sort()) {
  console.log(`── ${dir}`);
  list.forEach((r) => console.log("   " + r));
}