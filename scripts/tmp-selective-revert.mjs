/**
 * Revert file mà thay đổi CHỈ nằm ở phần import.
 * Cách kiểm: bỏ hết import (kể cả import nhiều d���ng) rồi so phần còn lại của
 * bản HEAD với bản hiện tại — nếu giống nhau thì chắc chắn chỉ đổi import.
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

/** Xoá mọi câu import, kể cả bản trải nhiều dòng. */
function stripImports(s) {
  return s.replace(/^\s*import\s+[\s\S]*?from\s*["'][^"']*["'];?\s*$/gm, "")
          .replace(/^\s*import\s+["'][^"']*["'];?\s*$/gm, "")
          .replace(/^\s*export\s+\{[^}]*\}\s*from\s*["'][^"']*["'];?\s*$/gm, "")
          .split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
}

const changed = execSync("git diff --name-only", { encoding: "utf8" }).trim().split("\n").filter(Boolean);
const KEEP = new Set(["src/lib/kidSettings.js", "src/pages/OnboardingScreen.jsx"]);

const revert = [], keep = [];
for (const f of changed) {
  if (KEEP.has(f)) { keep.push(f + "  (bản sửa thật)"); continue; }
  const head = execSync(`git show "HEAD:${f}"`, { encoding: "utf8", maxBuffer: 1 << 26 });
  if (!existsSync(f)) { revert.push(f); continue; }   // file bi xoa -> revert de phuc hoi
  const now = readFileSync(f, "utf8");
  stripImports(head) === stripImports(now) ? revert.push(f) : keep.push(f);
}

console.log(`  REVERT ${revert.length} file (chi khac o dong import)`);
revert.forEach((f) => console.log(`     ${f}`));
console.log(`\n  GIU ${keep.length} file`);
keep.forEach((f) => console.log(`     ${f}`));

if (revert.length) {
  execSync(`git checkout -- ${revert.map((f) => `"${f}"`).join(" ")}`, { stdio: "pipe" });
  console.log(`\n  -> da revert ${revert.length} file`);
}