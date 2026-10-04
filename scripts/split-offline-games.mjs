#!/usr/bin/env node
// scripts/split-offline-games.mjs
//
// MỘT LẦN: tách 4 file hub (game1..4.html) thành cấu trúc 1-game-1-file.
//
//   game1.html  ─┐
//   game2.html  ─┼─> src/games/lib/    (shell.html, api.js, core.js)  — dùng chung
//   game3.html  ─┤   src/games/src/<id>.js                          — 1 file = 1 game
//   game4.html  ─┘   src/games/src/manifest.js
//
// Sau khi script này chạy xong, các file hub cũ có thể xoá. Từ đó dùng
// `npm run games:build` để sinh src/games/offline/<id>.html từ lib + src.

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const read = (p) => fs.readFileSync(G(p), "utf8").replace(/\r\n/g, "\n");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(G(p)), { recursive: true });
  fs.writeFileSync(G(p), s, "utf8");
  return s.split("\n").length;
};

/** Nội dung các <script> không có src, theo thứ tự xuất hiện. */
function scriptBlocks(html) {
  return [...html.matchAll(/<script(?![^>]*\bsrc)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
}

// ── 1. Shell: từ <!DOCTYPE> tới hết khối DOM, bỏ 3 script block ─────────────
function extractShell(html) {
  const end = html.search(/<!--[^>]*Cấu hình API|<!--.*①|<script(?![^>]*\bsrc)/);
  if (end < 0) throw new Error("không tìm thấy điểm kết thúc shell trong game1.html");
  let shell = html.slice(0, end);
  // shell đã còn </body></html>? cắt phần đó ra, generator sẽ thêm lại
  shell = shell.replace(/<\/body>\s*<\/html>\s*$/i, "");
  return shell.replace(/\s+$/, "") + "\n";
}

// ── 2. Cắt một khối game theo khoảng dòng (1-indexed, inclusive) ────────────
function slice(lines, from, to) {
  return lines.slice(from - 1, to).join("\n");
}

// ── 3. Thẻ banner của từng game ─────────────────────────────────────────────
const META = {
  // game1.html
  math:     { name: "Đua Toán",              icon: "➕", tag: "Toán",           grad: "from-orange-400 to-amber-500", src: "game1", range: [45, 95],   deps: [[3, 8]] },
  memory:   { name: "Lật Thẻ Anh – Việt",   icon: "🃏", tag: "Tiếng Anh",      grad: "from-sky-400 to-blue-500",    src: "game1", range: [96, 137],  deps: [[3, 8], [9, 18]] },
  scramble: { name: "Xếp Chữ",               icon: "🔤", tag: "Tiếng Anh",      grad: "from-rose-400 to-pink-500",   src: "game1", range: [138, 205], deps: [[3, 8], [9, 18]] },
  quiz:     { name: "Đố Vui Khoa Học",       icon: "🔬", tag: "Khoa học",       grad: "from-violet-400 to-purple-600", src: "game1", range: [206, 260], deps: [[19, 44]] },
  snake:    { name: "Rắn Săn Đáp Án",        icon: "🐍", tag: "Toán · Phản xạ", grad: "from-emerald-400 to-teal-600", src: "game1", range: [261, 366], deps: [] },

  // game2.html (gộp bộ trùng của game3 — xem GHI_CHU bên dưới)
  flap:     { name: "Chim Bay Qua Cổng",     icon: "🐦", tag: "Toán · Phản xạ", grad: "from-amber-400 to-orange-500", src: "game2", range: [3, 197] },
  g2048:    { name: "2048 Lũy Thừa",         icon: "🔢", tag: "Logic",          grad: "from-violet-400 to-indigo-600", src: "game2", range: [198, 312] },
  chem:     { name: "Nhà Hóa Học Nhí",        icon: "⚗️", tag: "Hóa học",        grad: "from-lime-400 to-green-600",  src: "game2", range: [313, 410] },
  clock:    { name: "Đồng Hồ Thời Gian",     icon: "🕒", tag: "Toán · Xem giờ", grad: "from-coral-400 to-rose-500",  src: "game2", range: [411, 491] },
  pattern:  { name: "Thám Tử Quy Luật",      icon: "🕵️", tag: "Toán · Tư duy",  grad: "from-sky-400 to-cyan-600",    src: "game2", range: [492, 550] },
  simon:    { name: "Nhớ Dãy Màu",           icon: "🎵", tag: "Trí nhớ",        grad: "from-pink-400 to-fuchsia-500", src: "game2", range: [551, 618] },

  // game4.html — dùng chung engine mcengine.js, chỉ lấy data + maker
  anagram:  { name: "Đảo Chữ Nhí",           icon: "🧩", tag: "Tiếng Anh",      grad: "from-amber-400 to-yellow-500", src: "game4", deps: [[68, 75], [94, 117]], maker: "anagram" },
  stroop:   { name: "Đuổi Màu",               icon: "🎨", tag: "Tập trung",      grad: "from-violet-400 to-purple-500", src: "game4", deps: [[76, 76]], maker: "stroop" },
  sumseq:   { name: "Chuỗi Số",               icon: "➕", tag: "Toán",           grad: "from-sky-400 to-blue-500",   src: "game4", deps: [], maker: "sumseq" },
  compare:  { name: "Ai Nhiều Hơn?",          icon: "⚖️", tag: "So sánh",        grad: "from-lime-400 to-emerald-500", src: "game4", deps: [[91, 91]], maker: "compare" },
  riddle:   { name: "Đố Vui Nhanh",           icon: "💡", tag: "Kiến thức",      grad: "from-coral-400 to-orange-500", src: "game4", deps: [[77, 90]], maker: "riddle" },
  shapecount:{ name: "Đếm Nhanh",             icon: "🔷", tag: "Tập trung",      grad: "from-pink-400 to-rose-500", src: "game4", deps: [], maker: "shapecount" },
};

// Mỗi game cần badge riêng. `ok` viết bằng biểu thức đánh giá trong core.js
// (S.flags.* do chính game set, S.games là số ván đã chơi, lvl() là cấp độ).
const BADGES = {
  math:     [{ id: "f10", n: "10 câu đúng", i: "✅", ok: () => S.games >= 1 }],
  memory:   [{ id: "memGold", n: "Lật thẻ vàng", i: "🟡", ok: () => !!S.flags.memGold }],
  scramble: [{ id: "word10", n: "Xếp 10 từ", i: "🔤", ok: () => !!S.flags.w10 }],
  quiz:     [{ id: "perfect", n: "Trả lời 10/10", i: "🎯", ok: () => !!S.flags.perfect }],
  snake:    [{ id: "snake20", n: "Ăn 20 món", i: "🐍", ok: () => (S.flags.snakeEat || 0) >= 20 }],
  flap:     [{ id: "flap10", n: "Qua 10 cổng", i: "🐦", ok: () => !!S.flags.flap }],
  g2048:    [{ id: "t256", n: "Đạt ô 256", i: "🔢", ok: () => !!S.flags.t256 }],
  chem:     [{ id: "chem", n: "Nhà hóa học", i: "⚗️", ok: () => !!S.flags.chem }],
  clock:    [{ id: "clock", n: "Xem giờ 10/10", i: "🕒", ok: () => !!S.flags.clock }],
  pattern:  [{ id: "pat", n: "Tìm ra quy luật", i: "🕵️", ok: () => !!S.flags.pat }],
  simon:    [{ id: "simon", n: "Nhớ 8 vòng", i: "🧠", ok: () => !!S.flags.simon }],
};

function main() {
  const g1 = read("src/games/game1.html");
  const g2 = read("src/games/game2.html");
  const g4 = read("src/games/game4.html");

  const lines = {
    game1: scriptBlocks(g1).at(-1).split("\n"),
    game2: scriptBlocks(g2).at(-1).split("\n"),
    game4: scriptBlocks(g4).at(-1).split("\n"),
  };

  // ── lib/shell.html ────────────────────────────────────────────────────────
  const n1 = write("src/games/lib/shell.html", extractShell(g1));
  console.log(`lib/shell.html            ${String(n1).padStart(5)} dòng`);

  // ── lib/api.js + lib/core.js ──────────────────────────────────────────────
  const b1 = scriptBlocks(g1);
  const n2 = write("src/games/lib/api.js", b1[1].replace(/\s+$/, "") + "\n");   // block 1 = api.js
  const n3 = write("src/games/lib/core.js", b1[2].replace(/\s+$/, "") + "\n");   // block 2 = game-core.js
  console.log(`lib/api.js                ${String(n2).padStart(5)} dòng`);
  console.log(`lib/core.js               ${String(n3).padStart(5)} dòng`);

  // ── src/<id>.js ───────────────────────────────────────────────────────────
  let count = 0;
  for (const [id, m] of Object.entries(META)) {
    const L = lines[m.src];
    let body = "";
    for (const [a, b] of m.deps || []) body += slice(L, a, b) + "\n\n";
    if (m.range) body += slice(L, m.range[0], m.range[1]) + "\n";
    else if (m.maker) {
      // game4: lấy riêng 1 maker trong MAKERS
      const makers = {
        anagram: [120, 132], stroop: [134, 151], sumseq: [153, 184],
        compare: [186, 202], riddle: [204, 211], shapecount: [213, 229],
      };
      const [a, b] = makers[m.maker];
      const raw = slice(L, a, b);
      // "anagram(level) {"  →  "function anagram(level) {"
      const fnName = raw.replace(/^(\s*)(\w+)\(level\)\s*\{/m, "$1function $2(level) {");
      body += `MC_MAKERS.${m.maker} = ${fnName.trim()}\n`;
    }

    const badgeList = (BADGES[id] || []).map((b) => `      { id: '${b.id}', n: '${b.n.replace(/'/g, "\\'")}', i: '${b.i}', ok: ${String(b.ok)} },`).join("\n");

    const tail = m.maker
      ? `\nstartMcGame('${id}', {\n  name: '${m.name}',\n  icon: '${m.icon}',\n  badges: [\n${badgeList}\n  ],\n});\n`
      : `\nstartSingleGame({\n  id: '${id}',\n  name: '${m.name.replace(/'/g, "\\'")}',\n  icon: '${m.icon}',\n  storageKey: 'offline_${id}',\n  mount: ${m.src === "game1" ? id + "Game" : { flap: "flapGame", g2048: "game2048", chem: "chemGame", clock: "clockGame", pattern: "patternGame", simon: "simonGame" }[id]},\n  badges: [\n${badgeList}\n  ],\n});\n`;

    const header = `// src/games/src/${id}.js — ${m.name} (${m.tag})\n`
      + `// Sinh tự động từ ${m.src}.html bởi scripts/split-offline-games.mjs.\n`
      + `// Sửa file này, KHÔNG sửa ${m.src}.html.\n\n`;

    write(`src/games/src/${id}.js`, header + body.replace(/\s+$/, "") + tail);
    count++;
  }
  console.log(`src/*.js                  ${count} file game`);

  // ── src/manifest.js ───────────────────────────────────────────────────────
  const entries = Object.entries(META).map(([id, m]) =>
    `  { id: '${id}', name: '${m.name.replace(/'/g, "\\'")}', icon: '${m.icon}', tag: '${m.tag}', grad: '${m.grad}',` +
    (m.maker ? ` engine: 'mc', maker: '${m.maker}',` : ` engine: 'single',`) +
    ` file: 'src/games/offline/${id}.html' },`
  ).join("\n");
  write("src/games/src/manifest.js",
    `// Danh mục 17 game offline. Đây là nguồn sự thật cho trang Home và route /offline/:id.\n`
    + `// Sinh tự động bởi scripts/split-offline-games.mjs.\n\nexport const OFFLINE_GAME_MANIFEST = [\n${entries}\n];\n\n`
    + `export const offlineGameIds = OFFLINE_GAME_MANIFEST.map((g) => g.id);\n\n`
    + `export function findOfflineGame(id) {\n  return OFFLINE_GAME_MANIFEST.find((g) => g.id === id) || null;\n}\n`);

  console.log("\nGHI_CHU: game3.html có 6 game TRÙNG TÊN với game2.html (code khác ~100 byte/game).");
  console.log("Theo quyết định 'gộp còn 1 bộ', manifest lấy bản game2. File game3.html sẽ bị xoá.");
}

main();
