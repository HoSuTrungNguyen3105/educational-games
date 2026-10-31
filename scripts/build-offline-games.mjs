#!/usr/bin/env node
// scripts/build-offline-games.mjs
//
// Sinh src/games/offline/<id>.html — MỘT file HTML cho MỘT game, tự chứa hoàn
// toàn (không còn <script src> nên nạp được bằng iframe srcDoc).
//
//   npm run games:build
//
// Nguồn:  src/games/offline/lib/{shell.html, core.js, single.js, ui.js}
//         src/games/offline/games-src/<id>.js
// Kết quả: src/games/offline/<id>.html
//
// File sinh ra ĐÃ được commit để app chạy được ngay sau khi clone. Khi sửa
// lib/ hoặc src/ thì chạy lại script này.
//
// Chỉ game có mã nguồn games-src/<id>.js mới được sinh lại. Game standalone
// (3D, nằm ngang, game viết tay…) do script riêng/nguồn riêng quản lý và
// KHÔNG bị ghi đè ở đây.

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const read = (p) => fs.readFileSync(G(p), "utf8").replace(/\r\n/g, "\n");

const shell = read("src/games/offline/lib/shell.html");
const tokens = read("src/games/offline/lib/tokens.css").replace(/\s+$/, "");
const core = read("src/games/offline/lib/core.js").replace(/\s+$/, "");
const single = read("src/games/offline/lib/single.js").replace(/\s+$/, "");
const ui = read("src/games/offline/lib/ui.js").replace(/\s+$/, "");

// Lấy danh mục từ manifest.js mà không cần import ESM (nó dùng export).
// Chỉ đọc dòng khai báo thật, bỏ qua entry bị comment để không sinh file rác.
const manifestSrc = read("src/games/offline/games-src/manifest.js");
const ids = [...manifestSrc.matchAll(/^\s*\{ id: '([^']+)',/gm)].map((m) => m[1]);
if (!ids.length) throw new Error("không đọc được danh sách id từ src/games/offline/games-src/manifest.js");

/**
 * Escape "</script>" trong JS.
 * HTML parser đóng thẻ <script> ở "</script>" ĐẦU TIÊN, kể cả khi chuỗi đó nằm
 * trong comment hay string của JS — nên mọi "</script" phải thành "<\/script".
 * Trong JS hai cách này cho CÙNG giá trị nên hành vi không đổi.
 */
const esc = (s) => s.replace(/<\/(script)/gi, "<\\/$1").replace(/<!(?=script)/gi, "<\\!");

/** Bỏ "use strict" / comment đầu file thừo, gọn một chút. */
function tidy(js) {
  return esc(js.replace(/^\s*(?:\/\*[\s\S]*?\*\/\s*)?/, "").replace(/\s+$/, ""));
}

/**
 * Chèn lib/tokens.css vào placeholder trong shell.html.
 * Tokens là nguồn màu/font duy nhất: game sinh ra mang nó trong file, game viết
 * tay thì OfflineGamePage tiêm cùng nội dung đó lúc nạp iframe → cả hai nhóm
 * nhìn giống nhau. Thiếu placeholder là fail build chứ không im lặng lệch màu.
 */
function applyTokens(html) {
  if (!html.includes("/*__EG_TOKENS__*/")) {
    throw new Error("lib/shell.html thiếu placeholder /*__EG_TOKENS__*/ — không chèn được lib/tokens.css");
  }
  return html.replace("/*__EG_TOKENS__*/", () => tokens);
}

const shellDoc = applyTokens(shell);

function build(id) {
  const game = read(`src/games/offline/games-src/${id}.js`);

  const parts = [
    shellDoc,
    "",
    "    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->",
    "    <script>",
    tidy(core),
    "    </script>",
    "",
    "    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->",
    "    <script>",
    tidy(single),
    "    </script>",
    "",
    "    <!-- ui.js: khung mở đầu + chọn nhịp độ dùng chung -->",
    "    <script>",
    tidy(ui),
    "    </script>",
  ];

  parts.push(
    "",
    `    <!-- Game: ${id} — nội dung riêng của file này -->`,
    "    <script>",
    tidy(game),
    "    </script>",
    "</body>",
    "</html>",
    ""
  );

  return parts.join("\n");
}

fs.mkdirSync(G("src/games/offline"), { recursive: true });

let total = 0;
const rows = [];
const skipped = [];
for (const id of ids) {
  // Chỉ sinh lại game có mã nguồn trong games-src. Game standalone (3D, nằm
  // ngang, game viết tay…) là HTML độc lập, KHÔNG bị ghi đè ở đây.
  const srcFile = `src/games/offline/games-src/${id}.js`;
  if (!fs.existsSync(G(srcFile))) {
    skipped.push(id);
    continue;
  }

  const html = build(id);
  const out = `src/games/offline/${id}.html`;
  fs.writeFileSync(G(out), html, "utf8");
  const kb = Buffer.byteLength(html) / 1024;
  total += kb;
  const external = /<script[^>]*\bsrc\s*=/i.test(html);
  rows.push({ id, "KB": kb.toFixed(1), "dòng": html.split("\n").length, "script ngoài": external ? "CÓ ✖" : "không ✓" });
}

console.table(rows);
console.log(`\n✔ ${rows.length} file → src/games/offline/  (tổng ${(total / 1024).toFixed(2)} MB)`);
if (skipped.length) {
  console.log(`⏭  Bỏ qua ${skipped.length} game không có mã nguồn games-src/<id>.js (standalone/3D/viết tay):`);
  console.log(`   ${skipped.join(", ")}`);
}
