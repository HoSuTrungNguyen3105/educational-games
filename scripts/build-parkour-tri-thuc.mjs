#!/usr/bin/env node
// scripts/build-parkour-tri-thuc.mjs
//
// Gom src/games/offline/parkour-tri-thuc/ (css + js rời nhau) thành MỘT file
// tự chứa: src/games/offline/parkour-tri-thuc.html
//
//   npm run games:build:parkour
//
// Vì sao cần bước gộp này: app nạp game bằng <iframe srcDoc={...}>
// (xem src/games/HtmlGameLoader.jsx). Trong srcDoc không có base URL để resolve
// đường dẫn tương đối, nên <script src="js/data.js"> và <link href="css/...">
// sẽ không tải được → mất hết CSS và mất cả event listener.
//
// Nguồn:   src/games/offline/parkour-tri-thuc/index.html
//          src/games/offline/parkour-tri-thuc/css/style.css
//          src/games/offline/parkour-tri-thuc/js/*.js
// Kết quả: src/games/offline/parkour-tri-thuc.html  ← manifest trỏ tới đây

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const SRC = "src/games/offline/parkour-tri-thuc";
const OUT = "src/games/offline/parkour-tri-thuc.html";
const read = (p) => fs.readFileSync(G(p), "utf8").replace(/\r\n/g, "\n");

// HTML parser đóng <script> ở "</script>" ĐẦU TIÊN, kể cả khi nằm trong chuỗi
// JS. Mọi "</script" phải thành "<\/script" — trong JS hai cách cho cùng giá trị.
const esc = (s) => s.replace(/<\/(script)/gi, "<\\/$1").replace(/<!(?=script)/gi, "<\\!");

/** Thay <link rel="stylesheet" href="css/x.css"> bằng <style> nội dung file. */
function inlineCss(html, cssHref, cssPath) {
  const tag = new RegExp(
    `[ \\t]*<link[^>]*href=["']\\.?/?${cssHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>\\n?`,
    "i"
  );
  if (!tag.test(html)) {
    throw new Error(`Không tìm thấy <link href="${cssHref}"> trong index.html`);
  }
  const css = read(cssPath).replace(/\s+$/, "");
  return html.replace(tag, `\n    <style>\n${css}\n    </style>\n`);
}

/** Thay <script src="js/x.js"> bằng <script> nội dung file, giữ đúng thứ tự. */
function inlineScripts(html, scriptDir) {
  const tagRe = /[ \t]*<script src=["']([^"']+)["']><\/script>\n?/g;
  const missing = [];
  const out = html.replace(tagRe, (_m, href) => {
    // index.html dùng đường dẫn tương đối "js/data.js"; đã có sẵn tiền tố "js/".
    const rel = href.replace(/^\.?\//, "");
    const file = rel.startsWith("js/") ? `${SRC}/${rel}` : path.posix.join(scriptDir, rel);
    if (!fs.existsSync(G(file))) {
      missing.push(file);
      return "";
    }
    const js = read(file).replace(/\s+$/, "");
    return `    <!-- ${rel} -->\n    <script>\n${esc(js)}\n    </script>\n`;
  });
  if (missing.length) {
    throw new Error(`Thiếu file JS: ${missing.join(", ")}`);
  }
  if (/<script[^>]*\bsrc\s*=/i.test(out)) {
    throw new Error("Còn <script src> chưa được gộp — file sinh ra sẽ hỏng trong srcDoc");
  }
  return out;
}

const cssDir = "src/games/offline/parkour-tri-thuc/css";
const jsDir = "src/games/offline/parkour-tri-thuc/js";

let html = read(`${SRC}/index.html`);
html = inlineCss(html, "css/style.css", `${cssDir}/style.css`);
html = inlineScripts(html, jsDir);
html = html.replace(/<\/body>\s*<\/html>\s*$/, "</body>\n</html>\n");

fs.mkdirSync(path.dirname(G(OUT)), { recursive: true });
fs.writeFileSync(G(OUT), html, "utf8");

const kb = Buffer.byteLength(html) / 1024;
console.log(`✔ ${OUT}`);
console.log(`  ${kb.toFixed(1)} KB · ${html.split("\n").length} dòng · không còn script/css ngoài`);