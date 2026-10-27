#!/usr/bin/env node
// scripts/export-avatar-bodies.mjs
//
// Xuất SVG "thân" của avatar ra các file HTML tĩnh ở thư mục gốc dự án —
// một file cho MỌI thân có trong BODIES (thêm thân mới là tự có file mới):
//
//   body.html            · Bé trai      (body_01)
//   body-girl.html       · Bé gái       (body_girl_01)
//   body-rider.html      · Kamen Rider  (body_rider_01)
//   body-superman.html   · Superman     (body_superman_01)
//   body-kaiju.html      · Kaiju        (body_kaiju_01)
//   body-ghost.html      · Bóng ma      (body_ghost_01)
//   body-popstar.html    · Ngôi sao nhạc pop (body_popstar_01)
//   body-dragon.html     · Rồng xanh    (body_dragon_01)
//
// Những hình này chính là thứ modal "Tùy chỉnh Avatar" ở trang hồ sơ và 3 trang
// quản lí (/admin/body-custom, /admin/avatar-template, /admin/avatar-items) vẽ,
// vì tất cả đều đi qua renderKid() của cùng một nguồn dữ liệu:
// src/games/_shared/lib/dressUpAvatarData.js.
//
//   npm run avatars:export-bodies
//
// Chạy lại mỗi khi sửa SVG trong dressUpAvatarData.js để file tĩnh không cũ hơn app.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const DATA = "src/games/_shared/lib/dressUpAvatarData.js";
const DRAGON = "src/games/_shared/lib/dressUpDragon.js";

/** dressUpAvatarData.js là script cổ điển (không phải ES module) → chạy trong vm. */
function loadDressUp() {
  const root = {};
  const ctx = vm.createContext({ root, window: root, self: root, console });
  for (const file of [DRAGON, DATA]) {
    vm.runInContext(fs.readFileSync(path.resolve(ROOT, file), "utf8"), ctx, { filename: file });
  }
  if (!root.EG_DRESSUP) throw new Error(`Không lấy được EG_DRESSUP từ ${DATA}`);
  return root.EG_DRESSUP;
}

/** Tách thẻ thành nhiều dòng + thụt lề để đọc/diff được. */
function pretty(svg) {
  if (/<text[\s>]/i.test(svg)) return svg; // có text con → giữ nguyên, tránh vỡ nội dung
  let depth = 0;
  return svg
    .replace(/></g, ">\n<")
    .split("\n")
    .map((line) => {
      const closesFirst = /^<\//.test(line);
      if (closesFirst) depth = Math.max(0, depth - 1);
      const out = "  ".repeat(depth) + line;
      const opens = /^<[^!?/][^>]*[^/]>$/.test(line) && !/<\/(svg|g|defs)>$/.test(line);
      if (opens) depth++;
      return out;
    })
    .join("\n");
}

/** renderKid() xuất svg không có width/height → thêm vào để mở file là thấy ngay. */
function withSize(svg, w, h) {
  return svg.replace(/<svg\b([^>]*)>/, (m, attrs) => {
    let a = attrs;
    if (!/\bxmlns=/.test(a)) a += ' xmlns="http://www.w3.org/2000/svg"';
    if (!/\bwidth=/.test(a)) a += ` width="${w}"`;
    if (!/\bheight=/.test(a)) a += ` height="${h}"`;
    return `<svg${a}>`;
  });
}

const api = loadDressUp();
const { w, h } = api.kid.size;

/** body_01 → body.html · body_girl_01 → body-girl.html · body_rider_01 → body-rider.html */
function fileName(code) {
  const suffix = code.replace(/^body_/, "").replace(/_?\d+$/, "");
  return `body${suffix ? "-" + suffix.replace(/_/g, "-") : ""}.html`;
}

console.log(`Nguồn: ${DATA}\n`);
for (const code of Object.keys(api.kid.bodies)) {
  const body = api.kid.bodies[code];
  const file = fileName(code);

  const state = api.applyBody({ ...api.kid.defaults }, code);
  const svg = pretty(withSize(api.renderKid(state), w, h)) + "\n";

  fs.writeFileSync(path.resolve(ROOT, file), svg, "utf8");
  console.log(`  ✔ ${file.padEnd(20)} ${body.n} · ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}
console.log("\nMở từng file bằng trình duyệt để xem thân đã lưu.");
