/**
 * export-character-bodies.mjs — sinh ảnh fallback cho catalog nhân vật
 * (`src/config/characterBodies.js`) từ ĐÚNG nguồn artwork đang chạy thật:
 * dữ liệu SVG EG_DRESSUP (`src/games/_shared/lib/dressUpAvatarData.js`).
 *
 * Mỗi body được vẽ với "diện" chuẩn của chính nó (applyBody — cùng cách
 * ô Thân trong modal tuỳ chỉnh vẽ preview) rồi ghi ra
 * `public/avatars/bodies/<bodyId>.svg`. Đây là artwork thật của hệ thống,
 * không phải ảnh placeholder: file .riv (Rive) chưa tồn tại trong repo nên
 * CharacterStage chạy bằng các ảnh/lớp SVG này qua animation CSS.
 *
 * Chạy: `node scripts/export-character-bodies.mjs`
 * Script cũng KIỂM TRA hai chiều catalog ↔ EG_DRESSUP: body nào có trong
 * dữ liệu mà chưa khai trong `characterBodies.js` (hoặc ngược lại) thì báo
 * lỗi và thoát khác 0 — tránh catalog trôi khỏi dữ liệu thật.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Nạp EG_DRESSUP y như `src/lib/dressUpAvatar.js` làm phía client. */
function loadDressUp() {
  const dragon = readFileSync(path.join(root, "src/games/_shared/lib/dressUpDragon.js"), "utf8");
  const raw = readFileSync(path.join(root, "src/games/_shared/lib/dressUpAvatarData.js"), "utf8");
  const scope = {};
  const run = new Function(
    "window",
    "globalThis",
    `${dragon}\n${raw}\n;return (typeof window !== "undefined" && window.EG_DRESSUP) || globalThis.EG_DRESSUP;`
  );
  return run(scope, scope);
}

const api = loadDressUp();
const bodyIds = Object.keys(api.kid.bodies);

/* Đọc catalog hiện tại để đối chiếu (không sinh lại catalog — file config
 * là nguồn khai báo tĩnh theo đặc tả, script này chỉ sinh ẢNH + kiểm tra). */
const catalogPath = path.join(root, "src/config/characterBodies.js");
if (!existsSync(catalogPath)) {
  console.error(`Thiếu ${catalogPath} — tạo catalog trước rồi chạy lại script.`);
  process.exit(1);
}
const catalogSrc = readFileSync(catalogPath, "utf8");
const catalogIds = [...catalogSrc.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map((m) => m[1]);

const missingInCatalog = bodyIds.filter((id) => !catalogIds.includes(id));
const extraInCatalog = catalogIds.filter((id) => !bodyIds.includes(id));
if (missingInCatalog.length || extraInCatalog.length) {
  if (missingInCatalog.length) console.error("Body có dữ liệu nhưng chưa khai trong catalog:", missingInCatalog.join(", "));
  if (extraInCatalog.length) console.error("Catalog khai body không có dữ liệu thật:", extraInCatalog.join(", "));
  process.exit(1);
}

const outDir = path.join(root, "public/avatars/bodies");
mkdirSync(outDir, { recursive: true });

const base = api.kid.defaultsFor("boy");
let written = 0;
for (const id of bodyIds) {
  const state = api.applyBody(base, id);
  const svg = api.renderKid(state);
  if (!svg || !svg.startsWith("<svg")) {
    console.error(`Body ${id} không render được SVG.`);
    process.exit(1);
  }
  writeFileSync(path.join(outDir, `${id}.svg`), `${svg}\n`, "utf8");
  written += 1;
}
console.log(`Đã ghi ${written} ảnh fallback vào public/avatars/bodies/ và catalog khớp 100% với EG_DRESSUP (${bodyIds.length} body).`);
