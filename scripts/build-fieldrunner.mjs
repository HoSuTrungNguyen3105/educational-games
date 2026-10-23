#!/usr/bin/env node
// scripts/build-fieldrunner.mjs
//
// Gom src/games/offline/fieldrunner/ (css + js rời nhau) thành MỘT file tự chứa:
// src/games/offline/fieldrunner.html
//
//   npm run games:build:fieldrunner
//
// Vì sao cần bước gộp này: app nạp game bằng <iframe srcDoc={...}>, mà srcDoc
// không có base URL để resolve đường dẫn tương đối → <script src="js/levels.js">
// và <link href="css/game.css"> sẽ không tải được.
//
// Kèm 2 kiểm tra bắt buộc trước khi ghi file:
//   · mọi <link>/<script> trong index.html phải có file thật;
//   · từng cánh đồng trong js/levels.js phải còn đường đi từ cổng vào tới cổng ra
//     (địa hình authored bằng tay rất dễ bịt kín lối).

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const SRC = "src/games/offline/fieldrunner";
const OUT = "src/games/offline/fieldrunner.html";
const read = (p) => fs.readFileSync(G(p), "utf8").replace(/\r\n/g, "\n");

// HTML parser đóng <script> ở "</script>" ĐẦU TIÊN, kể cả khi nằm trong chuỗi JS.
const esc = (s) => s.replace(/<\/(script)/gi, "<\\/$1").replace(/<!(?=script)/gi, "<\\!");

/** Đọc LEVELS từ js/levels.js (chỉ phần khai báo, không chạy DOM).
 *  Tham số = các biến toàn cục levels.js ĐỌC/GHI nhưng không tự khai báo;
 *  không được đặt tên trùng `let/const` trong thân hàm (new Function sẽ lỗi). */
function loadLevels() {
  const src = read(`${SRC}/js/levels.js`);
  const fn = new Function(
    "COLS", "ROWS", "CS", "CW", "CH", "GOALC", "SR", "GR",
    "GC", "document", "localStorage", "sessionStorage", "bfs", "setDist", "blocked", "noBuild", "level",
    `${src}\nreturn LEVELS;`
  );
  return fn(24, 15, 40, 960, 600, 23, 7, 7,
    null, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
}

/** BFS 4 hướng từ cổng ra — giống hệt js/pathfinding.js */
function reachable(lv) {
  const COLS = 24, ROWS = 15, GOALC = COLS - 1;
  const BLOCK = "trwfbh";
  const k = Array.from({ length: COLS }, () => Array(ROWS).fill("."));

  for (const [kind, c0, r0, w, h] of lv.props) {
    for (let c = c0; c < c0 + w; c++) {
      for (let r = r0; r < r0 + h; r++) {
        if (c >= 0 && r >= 0 && c < COLS && r < ROWS) k[c][r] = kind;
      }
    }
  }

  k[0][lv.sr] = "."; k[1][lv.sr] = ".";
  k[GOALC][lv.gr] = "."; k[GOALC - 1][lv.gr] = ".";

  const d = new Array(COLS * ROWS).fill(Infinity);
  const q = [GOALC + lv.gr * COLS];
  d[q[0]] = 0;

  for (let i = 0; i < q.length; i++) {
    const cur = q[i];
    const c = cur % COLS;
    const r = (cur / COLS) | 0;

    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = c + dc, nr = r + dr;
      if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS || BLOCK.includes(k[nc][nr])) continue;
      const key = nc + nr * COLS;
      if (d[key] !== Infinity) continue;
      d[key] = d[cur] + 1;
      q.push(key);
    }
  }

  const buildable = k.flat().filter((x) => !BLOCK.includes(x) && x !== "j").length;
  return { len: d[0 + lv.sr * COLS], open: q.length, buildable, total: COLS * ROWS };
}

function checkLevels() {
  const LEVELS = loadLevels();
  const bad = [];

  for (const lv of LEVELS) {
    const r = reachable(lv);
    const flag = Number.isFinite(r.len) ? `đường ${r.len} ô` : "KHÔNG CÓ ĐƯỜNG ✖";
    console.log(`  ${lv.icon} ${lv.name.padEnd(24)} ${String(lv.waves).padStart(2)} đợt · ${flag} · ${r.buildable} ô xây được`);
    if (!Number.isFinite(r.len)) bad.push(lv.id);
    if (r.buildable < 120) bad.push(`${lv.id} (quá ít chỗ xây)`);
  }

  if (bad.length) throw new Error(`Cánh đồng lỗi: ${bad.join(", ")}`);
}

/** Thay <link rel="stylesheet" href="css/x.css"> bằng <style> nội dung file. */
function inlineCss(html) {
  return html.replace(/[ \t]*<link[^>]*\bhref=["']css\/([^"']+)["'][^>]*>\n?/gi, (m, file) => {
    const p = `${SRC}/css/${file}`;
    if (!fs.existsSync(G(p))) throw new Error(`Thiếu stylesheet: ${p}`);
    return `\n    <style>\n${read(p).replace(/\s+$/, "")}\n    </style>\n`;
  });
}

/** Thay <script src="js/x.js"> bằng <script> nội dung file, giữ đúng thứ tự. */
function inlineScripts(html) {
  const missing = [];

  const out = html.replace(/[ \t]*<script src=["']([^"']+)["']><\/script>\n?/g, (_m, href) => {
    const rel = href.replace(/^\.?\//, "");
    const file = `${SRC}/${rel}`;
    if (!fs.existsSync(G(file))) {
      missing.push(file);
      return "";
    }
    return `    <!-- ${rel} -->\n    <script>\n${esc(read(file).replace(/\s+$/, ""))}\n    </script>\n`;
  });

  if (missing.length) throw new Error(`Thiếu file: ${missing.join(", ")}`);
  if (/<script[^>]*\bsrc\s*=/i.test(out)) {
    throw new Error("Còn <script src> chưa được gộp — file sinh ra sẽ hỏng trong srcDoc");
  }
  return out;
}

console.log("Kiểm tra 8 cánh đồng (đường đi & chỗ xây):");
checkLevels();

let html = read(`${SRC}/index.html`);
html = inlineCss(html);
html = inlineScripts(html);
html = html.replace(/<\/body>\s*<\/html>\s*$/, "</body>\n</html>\n");

fs.writeFileSync(G(OUT), html, "utf8");

const kb = Buffer.byteLength(html) / 1024;
console.log(`\n✔ ${OUT}`);
console.log(`  ${kb.toFixed(1)} KB · ${html.split("\n").length} dòng · không còn script/css ngoài`);
