#!/usr/bin/env node
// scripts/add-offline-back-button.mjs
//
// Chèn nút "Về trang chủ" vào TỪNG file HTML trong src/games/offline/.
//
//   node scripts/add-offline-back-button.mjs            ← áp cho game còn thiếu
//   node scripts/add-offline-back-button.mjs --all      ← ép áp cho tất cả
//   node scripts/add-offline-back-button.mjs --dry-run  ← chỉ xem kế hoạch
//
// Vì sao nhét thẳng vào HTML thay vì làm nút nổi ở React?
//   Nút nằm trong game sẽ ăn theo bảng màu, font và cách đổ bóng của chính
//   game đó → trông như là một phần của game, không phải lớp phủ của website.
//
// Mỗi file có bảng màu riêng (--ink / --wood / --night …) nên script đọc
// :root của file rồi tự sinh CSS tương ứng. File không khai báo biến thì dùng
// màu trong PALETTE bên dưới (đều lấy từ màu đang xuất hiện trong file đó).

import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve(process.cwd(), "src/games/offline");
const ALL = process.argv.includes("--all");
const DRY = process.argv.includes("--dry-run");
const MARKER = 'id="homeBackBtn"'; // thuộc tính HTML — dùng để kiểm tra đã chèn
const SEL = "#homeBackBtn"; // selector CSS — KHÔNG dùng MARKER ở đây

/**
 * Game đã có sẵn nút quay lại (17 game sinh từ lib/shell.html: `.back` /
 * `<button id="back">← Về sảnh</button>`, style 3px 3px 0 var(--ink)).
 * Không thêm nút thứ hai — chỉ bổ sung cho game còn thiếu.
 * Dùng --all nếu thật sự muốn ép thêm vào tất cả.
 */
const OWN_BACK = /id=["']back["']|class=["'][^"']*\bback\b|Về sảnh|Về trang chủ/;

/** Biến CSS của file → dùng làm viền/đổ bóng. Thứ tự ưu tiên. */
const INK_VARS = ["--wood", "--woodD", "--ink", "--night", "--dusk"];

/** File không có :root → lấy màu tối đang có sẵn trong file. */
const PALETTE = {
  "nhay-xoay": { ink: "#241250", bg: "#ffffff" },
  "pha-gach":  { ink: "#0b6a99", bg: "#ffffff" },
  "xep-khoi":  { ink: "#241250", bg: "#fffaf0" },
};

/** Nút sẽ ở góc trên trái — vị trí ít chạm HUD nhất. */
const POS = {
  top: "calc(env(safe-area-inset-top, 0px) + 10px)",
  left: "calc(env(safe-area-inset-left, 0px) + 10px)",
};

/** Đọc :root của file, tìm biến tối để làm viền + nền sáng. */
function readPalette(html, id) {
  if (PALETTE[id]) return PALETTE[id];
  const root = html.match(/:root\s*\{([\s\S]*?)\}/i)?.[1] || "";
  const vars = Object.fromEntries(
    [...root.matchAll(/--([a-z0-9_-]+)\s*:\s*([^;]+)/gi)].map((m) => [`--${m[1]}`, m[2].trim()])
  );
  const ink = INK_VARS.find((v) => vars[v]);
  if (!ink) return { ink: "#241250", bg: "#fffaf0" };
  return { ink: vars[ink], bg: vars["--paper"] || vars["--moon"] || "#fffaf0" };
}

function buildSnippet(ink, bg) {
  return `
<!-- Nút "Về trang chủ" — thêm bởi scripts/add-offline-back-button.mjs -->
<style>
  ${SEL} {
    position: fixed;
    z-index: 2147483000;
    top: ${POS.top};
    left: ${POS.left};
    width: 42px; height: 42px;
    border-radius: 14px;
    display: grid; place-items: center;
    cursor: pointer;
    font-family: inherit;
    font-size: 20px; font-weight: 800; line-height: 1;
    color: ${ink};
    background: ${bg};
    border: 3px solid ${ink};
    box-shadow: 0 4px 0 ${ink}, 0 8px 14px rgba(0, 0, 0, .22);
    transition: transform .12s, box-shadow .12s;
    -webkit-tap-highlight-color: transparent;
    user-select: none; -webkit-user-select: none;
  }
  ${SEL}:hover { filter: brightness(1.06); }
  ${SEL}:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 ${ink}, 0 3px 6px rgba(0, 0, 0, .22);
  }
  ${SEL}:focus-visible { outline: 3px solid #2f9bff; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { ${SEL} { transition: none; } }
</style>
<button ${MARKER} type="button" aria-label="Về trang chủ" title="Về trang chủ">
  <span aria-hidden="true">&#8592;</span>
</button>
<script>
  // Nút dùng chung cho mọi game offline: báo ngược lên React (OfflineGamePage)
  // để quay về trang chủ. Mở file .html trực tiếp thì tự điều hướng.
  (function () {
    var btn = document.getElementById("homeBackBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "quit", data: {} }, "*");
          return;
        }
      } catch (e) { /* rơi xuống cách tự điều hướng */ }
      try { window.location.href = "/"; } catch (e) { /* ignore */ }
    });
  })();
</script>
`;
}

if (!fs.existsSync(DIR)) {
  console.error(`✖ Không thấy thư mục: ${DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html")).sort();
const done = [];
const skipped = [];

for (const file of files) {
  const full = path.join(DIR, file);
  let html = fs.readFileSync(full, "utf8");

  if (html.includes(MARKER)) { skipped.push(`${file} (đã có nút về trang chủ)`); continue; }
  if (!ALL && OWN_BACK.test(html)) { skipped.push(`${file} (đã có nút quay lại riêng)`); continue; }

  const id = file.replace(/\.html$/, "");
  const pal = readPalette(html, id);

  // Chèn trước </body> để nút nằm trên cùng iframe.
  // Không neo "$" vì file thường kết thúc bằng "</body>\n</html>".
  const next = html.replace(/<\/body>/i, `${buildSnippet(pal.ink, pal.bg)}</body>`);
  if (next === html) { skipped.push(`${file} (không có </body>)`); continue; }

  if (!DRY) fs.writeFileSync(full, next, "utf8");
  done.push({ game: id, ...pal });
}

console.log(`\nThư mục: src/games/offline/ (${files.length} file)`);
if (done.length) {
  console.log(`\n✔ Đã chèn nút "Về trang chủ" vào ${done.length} game:`);
  console.table(done);
} else {
  console.log("\n✔ Mọi game đã có nút về trang chủ.");
}
if (skipped.length) console.log(`\nBỏ qua: ${skipped.join(", ")}`);
if (DRY && done.length) console.log("\n(DRY-RUN) chưa ghi file nào.");
console.log("\nNút dùng chung cho mọi game: OfflineGamePage nhận postMessage type='quit' → về trang chủ.");