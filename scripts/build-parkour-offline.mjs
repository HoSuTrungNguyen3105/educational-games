#!/usr/bin/env node
// scripts/build-parkour-offline.mjs
//
// Sao chép 2 game parkour thành các file tự chứa trong src/games/offline/:
//
//   src/games/parkour/me-cung-thi.html → src/games/offline/me-cung-tri-thuc.html
//   src/games/parkour/thap-may.html    → src/games/offline/leo-thap-may.html
//
//   npm run games:build:parkour-offline
//
// Tên file = id game trong manifest → đường dẫn /offline/<id> và key save
// `offline:<id>` suy ra từ đây, nên hai tên đặt theo tiêu đề thật trong game
// ("Mê Cung Tri Thức", "Leo Tháp Mây") chứ không theo tên file gốc.
//
// Khác build-parkour-fps.mjs: Leo Tháp Mây dựng bằng three.js và lấy thư viện
// đó từ CDN, giống nhay-xoay.html đang có trong offline/. Vì vậy ở đây KHÔNG
// cấm <script src> — chỉ kiểm tra thẻ script đóng/mở khớp nhau và file không
// gọi thẳng API của app (game offline phải chơi được khi không có mạng).

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const PAIRS = [
  ["src/games/parkour/me-cung-thi.html", "src/games/offline/me-cung-tri-thuc.html"],
  ["src/games/parkour/thap-may.html", "src/games/offline/leo-thap-may.html"],
];

for (const [src, out] of PAIRS) {
  // Không escape hàng loạt: đây đã là HTML hoàn chỉnh, thẻ </script> thật mà đổi
  // thành <\/script> thì script không đóng được nữa.
  const raw = fs.readFileSync(G(src), "utf8").replace(/\r\n/g, "\n");
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
