#!/usr/bin/env node
// scripts/build-parkour-offline.mjs
//
// Sao chép 3 game parkour thành các file tự chứa trong src/games/offline/:
//
//   src/games/parkour/me-cung-thi.html → src/games/offline/knowledge-maze.html
//   src/games/parkour/thap-may.html    → src/games/offline/cloud-tower-climb.html
//   src/games/parkour/mecung-moi.html  → src/games/offline/discovery-maze.html
//
//   npm run games:build:parkour-offline
//
// Tên file = id game trong manifest → đường dẫn /offline/<id> và key save
// `offline:<id>` suy ra từ đây, nên hai tên đặt theo tiêu đề thật trong game
// ("Mê Cung Tri Thức", "Leo Tháp Mây") chứ không theo tên file gốc. Riêng
// mecung-moi.html cũng mang tiêu đề "Mê Cung Tri Thức" dù là game khác (mê cung
// exploration có hồ sơ + bảng xếp hạng, không có chiến đấu) → đặt tên theo cách
// chơi để hai ô trong danh mục không trùng nhau.
//
// Khác build-parkour-fps.mjs: Leo Tháp Mây dựng bằng three.js và lấy thư viện
// đó từ CDN, giống nhay-xoay.html đang có trong offline/. Vì vậy ở đây KHÔNG
// cấm <script src> — chỉ kiểm tra thẻ script đóng/mở khớp nhau và file không
// gọi thẳng API của app (game offline phải chơi được khi không có mạng).

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const PAIRS = [
  ["src/games/parkour/me-cung-thi.html", "src/games/offline/knowledge-maze.html"],
  ["src/games/parkour/thap-may.html", "src/games/offline/cloud-tower-climb.html"],
  ["src/games/parkour/mecung-moi.html", "src/games/offline/discovery-maze.html"],
];

// Ngân hàng câu hỏi chuẩn của khối #defBank nằm trong src/games/_tools/admin.html.
// mecung-moi.html chỉ giữ placeholder __DEF_BANK__ cho gọn file nguồn; bản offline
// phải nhúng JSON thật, nếu không ngoài Toán tự sinh thì game không có câu nào.
function readDefBank() {
  const admin = fs.readFileSync(G("src/games/_tools/admin.html"), "utf8").replace(/\r\n/g, "\n");
  const m = admin.match(/<script type="application\/json" id="defBank">([\s\S]*?)<\/script>/);
  if (!m) throw new Error("Không tìm thấy khối #defBank trong src/games/_tools/admin.html");
  const bank = JSON.parse(m[1]);
  for (const k of ["viet", "eng", "sci", "geo"]) {
    if (!Array.isArray(bank[k]) || !bank[k].length) throw new Error(`#defBank thiếu mảng ${k}`);
  }
  // Escape dấu "<" để JSON không thể đóng sớm thẻ <script> khi nhúng vào HTML.
  return JSON.stringify(bank).replace(/</g, "\\u003c");
}

for (const [src, out] of PAIRS) {
  // Không escape hàng loạt: đây đã là HTML hoàn chỉnh, thẻ </script> thật mà đổi
  // thành <\/script> thì script không đóng được nữa.
  let raw = fs.readFileSync(G(src), "utf8").replace(/\r\n/g, "\n");
  if (raw.includes("__DEF_BANK__")) raw = raw.split("__DEF_BANK__").join(readDefBank());
  if (/__[A-Z_]{3,}__/.test(raw)) {
    throw new Error(`${src}: còn placeholder ${raw.match(/__[A-Z_]{3,}__/)[0]} chưa được thay`);
  }
  const opened = (raw.match(/<script(\s|>)/gi) || []).length;
  const closed = (raw.match(/<\/script>/gi) || []).length;
  if (opened !== closed) {
    throw new Error(`${src}: thẻ <script> mở ${opened} nhưng đóng ${closed} — có "</script" nằm trong chuỗi JS`);
  }
  if (/\bGameAPI\b|GAME_API_BASE|educational-games-lp4z\.onrender\.com/.test(raw)) {
    throw new Error(`${src}: dính API bridge của app — game offline phải chơi được không cần mạng`);
  }

  const html = raw.replace(/\s+$/, "") + "\n";
  fs.mkdirSync(path.dirname(G(out)), { recursive: true });
  fs.writeFileSync(G(out), html, "utf8");

  const kb = Buffer.byteLength(html) / 1024;
  console.log(`✔ ${out}`);
  console.log(`  ${kb.toFixed(1)} KB · ${html.split("\n").length} dòng · nguồn: ${src}`);
}
