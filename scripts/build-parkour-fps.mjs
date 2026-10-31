#!/usr/bin/env node
// scripts/build-parkour-fps.mjs
//
// Sao chép src/games/parkour/parkour-tri-thuc-3d/ParkourTriThuc3D.html
// (đã tự chứa: css + js nội tuyến) thành src/games/offline/first-person-parkour.html
//
//   npm run games:build:parkour-fps
//
// Thư mục offline/ là nơi OfflineGamePage quét bằng import.meta.glob, nên game
// muốn chơi trong app phải có một file .html tự chứa ở đó. Tên file = id game
// trong manifest → đường dẫn /offline/parkour-tri-thuc-3d và key save
// `offline:parkour-tri-thuc-3d` đều suy ra từ đây.

import fs from "node:fs";
import path from "node:path";

const G = (p) => path.resolve(process.cwd(), p);
const SRC = "src/games/parkour/parkour-tri-thuc-3d/ParkourTriThuc3D.html";
const OUT = "src/games/offline/first-person-parkour.html";

// Không escape hàng loạt: đây đã là HTML hoàn chỉnh, thẻ </script> thật mà đổi
// thành <\/script> thì script không đóng được nữa. Chỉ cần kiểm tra số thẻ mở/đóng
// khớp nhau — lệch nghĩa là có chuỗi "</script" nằm trong code JS.
const raw = fs.readFileSync(G(SRC), "utf8").replace(/\r\n/g, "\n");
const opened = (raw.match(/<script(\s|>)/gi) || []).length;
const closed = (raw.match(/<\/script>/gi) || []).length;
if (opened !== closed) {
  throw new Error(`Thẻ <script> mở ${opened} nhưng đóng ${closed} — có "</script" nằm trong chuỗi JS`);
}
if (/<script[^>]*\bsrc\s*=/i.test(raw)) {
  throw new Error("Còn <script src> — file sẽ không chạy trong iframe srcDoc của app");
}

const html = raw.replace(/\s+$/, "") + "\n";

fs.mkdirSync(path.dirname(G(OUT)), { recursive: true });
fs.writeFileSync(G(OUT), html, "utf8");

const kb = Buffer.byteLength(html) / 1024;
console.log(`✔ ${OUT}`);
console.log(`  ${kb.toFixed(1)} KB · ${html.split("\n").length} dòng · nguồn: ${SRC}`);
