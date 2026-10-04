#!/usr/bin/env node
// scripts/build-offline-games.mjs
//
// Sinh src/games/offline/<id>.html — MỘT file HTML cho MỘT game, tự chứa hoàn
// toàn (không còn <script src> nên nạp được bằng iframe srcDoc).
//
//   npm run games:build
//
// Nguồn:  src/games/lib/{shell.html, api.js, core.js, single.js, mcengine.js}
//         src/games/src/<id>.js
// Kết quả: src/games/offline/<id>.html
//
// File sinh ra ĐÃ được commit để app chạy được ngay sau khi clone. Khi sửa
// lib/ hoặc src/ thì chạy lại script này.

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const read = (p) => fs.readFileSync(G(p), "utf8").replace(/\r\n/g, "\n");

const shell = read("src/games/lib/shell.html");
const api = read("src/games/lib/api.js").replace(/\s+$/, "");
const core = read("src/games/lib/core.js").replace(/\s+$/, "");
const single = read("src/games/lib/single.js").replace(/\s+$/, "");
const mcengine = read("src/games/lib/mcengine.js").replace(/\s+$/, "");

// Lấy danh mục từ manifest.js mà không cần import ESM (nó dùng export)
const manifestSrc = read("src/games/src/manifest.js");
const ids = [...manifestSrc.matchAll(/\{ id: '([^']+)',/g)].map((m) => m[1]);
if (!ids.length) throw new Error("không đọc được danh sách id từ src/games/src/manifest.js");

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

function build(id) {
  const game = read(`src/games/src/${id}.js`);
  const meta = manifestSrc.match(new RegExp(`\\{ id: '${id}',[\\s\\S]*?file: '[^']+' \\}`));
  const usesMc = /engine: 'mc'/.test(meta ? meta[0] : "");

  const parts = [
    shell,
    "",
    "    <!-- ① Cấu hình API — đặt trước khi load api.js -->",
    "    <script>",
    "        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';",
    "        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');",
    "    </script>",
    "",
    "    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->",
    "    <script>",
    tidy(api),
    "    </script>",
    "",
    "    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->",
    "    <script>",
    tidy(core),
    "    </script>",
    "",
    "    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->",
    "    <script>",
    tidy(single),
    "    </script>",
  ];

  if (usesMc) {
    parts.push(
      "",
      "    <!-- ⑤ Engine chung cho các game dạng câu hỏi (tiến độ lưu sau từng câu) -->",
      "    <script>",
      tidy(mcengine),
      "    </script>"
    );
  }

  parts.push(
    "",
    `    <!-- ⑥ Game: ${id} — nội dung riêng của file này -->`,
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
for (const id of ids) {
  const html = build(id);
  const out = `src/games/offline/${id}.html`;
  fs.writeFileSync(G(out), html, "utf8");
  const kb = Buffer.byteLength(html) / 1024;
  total += kb;
  const external = /<script[^>]*\bsrc\s*=/i.test(html);
  rows.push({ id, "KB": kb.toFixed(1), "dòng": html.split("\n").length, "script ngoài": external ? "CÓ ✖" : "không ✓" });
}

console.table(rows);
console.log(`\n✔ ${ids.length} file → src/games/offline/  (tổng ${(total / 1024).toFixed(2)} MB)`);
