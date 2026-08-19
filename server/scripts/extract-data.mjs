import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, "../../public/game.html");
const outDir = path.resolve(__dirname, "../data");

const TARGETS = [
  "mockGameTemplates",
  "CATEGORIES",
  "initialGames",
  "initialQuestions",
  "mockPlayersPool",
  "initialResults",
  "mockCurrentUser",
  "SUBJECTS",
];

const html = readFileSync(htmlPath, "utf8");

function extractBlock(src, name) {
  const marker = `const ${name} = `;
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Không tìm thấy ${name}`);
  let i = start + marker.length;
  let depth = 0;
  let inStr = null;
  const begin = i;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\") { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
    if (ch === "[" || ch === "{") depth++;
    else if (ch === "]" || ch === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  return src.slice(begin, i + 1);
}

mkdirSync(outDir, { recursive: true });

for (const name of TARGETS) {
  let block;
  try {
    block = extractBlock(html, name);
  } catch (e) {
    console.error(`BỎ QUA ${name}: ${e.message}`);
    continue;
  }
  let value;
  try {
    value = vm.runInNewContext(`(${block})`, Object.create(null));
  } catch (e) {
    console.error(`LỖI parse ${name}: ${e.message}`);
    continue;
  }
  const filename = name === "mockCurrentUser" ? "users.json"
    : name === "mockGameTemplates" ? "templates.json"
    : name === "mockPlayersPool" ? "players.json"
    : `${name}.json`;
  const filePath = path.join(outDir, filename);
  const json = JSON.stringify(value, null, 2);
  writeFileSync(filePath, json, "utf8");
  const count = Array.isArray(value) ? value.length : 1;
  console.log(`✓ ${filename} (${count} items)`);
}
