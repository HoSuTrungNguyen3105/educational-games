#!/usr/bin/env node
// scripts/test-avatar-bodies.mjs
//
// Kiểm "linh kiện gắn vào thân có đồng bộ không" mà không cần mở trình duyệt:
//
//   1. Hình học dùng chung — mọi thân người phải vẽ đúng đường thân/chân/giày
//      của body_01, nên áo, quần, giày, mũ, kính để nguyên toạ độ là khớp.
//   2. Thứ tự lớp — áo choàng sau lưng vẽ TRƯỚC thân, phù hiệu/mũ/bốt vẽ SAU
//      áo quần (mặc áo thun lên Superman vẫn còn chữ S).
//   3. Luật state — thân tự mặc đồ (rider/superman) được bỏ áo/quần/giày,
//      body_01 thì bị ép lại vì thân đó không vẽ chân.
//   4. Allowlist server — mọi id frontend phải có trong
//      server/src/lib/outfitCatalog.js và sanitizeAvatar không được âm thầm
//      trả hồ sơ về body_01.
//   5. Render đủ tổ hợp thân × item: không văng lỗi, không "undefined"/"NaN",
//      thẻ <g> mở/đóng cân nhau.
//
//   npm run avatars:test

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const DATA = "src/games/_shared/lib/dressUpAvatarData.js";
const DRAGON = "src/games/_shared/lib/dressUpDragon.js";

let pass = 0;
const fails = [];
function check(name, ok, detail) {
  if (ok) { pass++; return; }
  fails.push(`${name}${detail ? ` — ${detail}` : ""}`);
}
function eq(name, got, want) {
  check(name, got === want, `mong ${want}, nhận ${got}`);
}

/** dressUpAvatarData.js là script cổ điển → chạy trong vm, giống hệt cách app tiêm vào game. */
function loadDressUp() {
  const root = {};
  const ctx = vm.createContext({ root, window: root, self: root, console });
  for (const file of [DRAGON, DATA]) {
    vm.runInContext(fs.readFileSync(path.resolve(ROOT, file), "utf8"), ctx, { filename: file });
  }
  if (!root.EG_DRESSUP) throw new Error(`Không lấy được EG_DRESSUP từ ${DATA}`);
  return root.EG_DRESSUP;
}

const api = loadDressUp();
const kid = api.kid;
const count = (svg, needle) => svg.split(needle).length - 1;

/* ---- hình học chuẩn của body_01 (512×700) — nếu ai sửa path trong data thì
 *   mấy chuỗi dưới đây phải sửa theo, đó là chủ đích: test buộc hai bên khớp. */
const GEO = {
  torso: 'M209 326 C221 318 237 314 256 314',
  leg: 'M194 492 L256 492 L256 632 C256 647 246 655 230 655',
  foot: 'M188 642 C202 637 224 637 243 642',
  /* bé gái là silhouette riêng (eo gọn, chân nhỏ) — quần/giày phải theo nó */
  girlLeg: 'M190 498 L256 498 L255 566 L254 630 C254 645 245 654 233 654',
  girlFoot: 'M206 636 C216 631 234 631 248 636',
  eye: 'cx="224" cy="210"',
  shirtCollar: 'M225 324 C232 344 280 344 287 324',
  helmetEye: 'rx="26" ry="20"',
  cape: 'M204 326 C232 348 280 348 308 326',
  scarf: 'M292 326 C340 350 360 408 352 468',
  shield: 'M256 322 L318 352 L256 440 L194 352 Z',
  belt: 'M180 476 C212 492 300 492 332 476',
};

const SUITS = ["body_rider_01", "body_superman_01"];
const humans = Object.keys(kid.bodies).filter((c) => kid.bodies[c].overlays !== false);

console.log(`Nguồn: ${DATA}\n`);

/* ================= 1. mọi thân người dùng chung khung + đường may ========= */
console.log("1. Hình học dùng chung (linh kiện khớp mọi thân)");
for (const code of humans) {
  const girl = code === "body_girl_01";
  const leg = girl ? GEO.girlLeg : GEO.leg;
  const foot = girl ? GEO.girlFoot : GEO.foot;
  const svg = api.renderKid(api.applyBody(kid.defaults, code));
  check(`  ${code}: có khung đầu/mắt chuẩn`, svg.includes(GEO.eye));
  check(`  ${code}: có đường thân 314–501`, svg.includes(GEO.torso));
  /* mặc quần jean + giày trắng → phải vẽ đúng hình chân/giày của thân đó */
  const dressed = api.renderKid(
    Object.assign(api.applyBody(kid.defaults, code), { shirt: "red", pants: "jeans", shoes: "white", dress: null }),
  );
  check(`  ${code}: quần jean gắn đúng cạp`, dressed.includes(leg));
  check(`  ${code}: giày gắn đúng mũi chân`, dressed.includes(foot));
}
/* Bé trai là chuẩn: chỉ 1 lần mỗi hình. Bộ đồ anh hùng vẽ thêm ống chân/mũi
 * chân trùng đúng toạ độ đó → 2 lần, và đó chính là cách nó khớp. */
const boy = api.renderKid(Object.assign({}, kid.defaults, { shoes: "white" }));
eq("  body_01: số lần hình bàn chân trái", count(boy, GEO.foot), 1);
for (const code of SUITS) {
  const svg = api.renderKid(Object.assign(api.applyBody(kid.defaults, code), { pants: "jeans", shoes: "white" }));
  eq(`  ${code}: bốt trùng đúng hình bàn chân`, count(svg, GEO.foot), 2);
  eq(`  ${code}: quần jean mặc đè đúng ống đồ`, count(svg, GEO.leg), 2);
}

/* ================= 2. thứ tự lớp ======================================== */
console.log("2. Thứ tự lớp (áo quần không che bộ đồ, bộ đồ không che mặt)");
const riderFull = api.renderKid(
  Object.assign(api.applyBody(kid.defaults, "body_rider_01"), {
    shirt: "red", pants: "black", shoes: "blue", hat: "hat_01", glasses: "glasses_01", acc: "acc_05", hair: "hair_02",
  }),
);
check("  rider: khăn sau lưng vẽ trước thân", riderFull.indexOf(GEO.scarf) < riderFull.indexOf(GEO.torso));
check("  rider: mũ bảo hiểm vẽ sau áo", riderFull.indexOf(GEO.shirtCollar) < riderFull.indexOf(GEO.helmetEye));
check("  rider: thắt lưng vẽ sau quần", riderFull.indexOf(GEO.leg) < riderFull.indexOf(GEO.belt));
check("  rider: ăng-ten thấp hơn mũ (mũ là lớp cuối)", riderFull.indexOf(GEO.helmetEye) < riderFull.indexOf('M158 176 C154 108 196 62 256 62'));

const supFull = api.renderKid(
  Object.assign(api.applyBody(kid.defaults, "body_superman_01"), {
    shirt: "yellow", pants: "jeans", shoes: "red", dress: null, hat: "hat_04",
  }),
);
check("  superman: áo choàng vẽ trước thân", supFull.indexOf(GEO.cape) < supFull.indexOf(GEO.torso));
check("  superman: phù hiệu vẽ sau áo", supFull.indexOf(GEO.shirtCollar) < supFull.indexOf(GEO.shield));
check("  superman: quần chip vẽ sau quần jean", supFull.indexOf(GEO.leg) < supFull.indexOf("M180 472 C212 490 300 490 332 472"));

/* ================= 3. luật state ======================================== */
console.log("3. Luật bỏ/mặc đồ theo thân");
for (const code of SUITS.concat("body_girl_01")) {
  const bare = api.sanitizeKid({ body: code, shirt: null, dress: null, pants: null, shoes: null });
  check(`  ${code}: được phép bỏ áo/quần/giày`, !bare.shirt && !bare.pants && !bare.shoes);
}
const forced = api.sanitizeKid({ body: "body_01", shirt: null, dress: null, pants: null, shoes: null });
check("  body_01: bị ép lại áo/quần/giày", !!forced.shirt && !!forced.pants && !!forced.shoes);
const alias = api.sanitizeKid({ body: "body_rider_khong_ton_tai" });
eq("  body lạ → về mặc định", alias.body, kid.defaults.body);
for (const code of Object.keys(kid.bodies)) {
  const look = api.applyBody({ ...kid.defaults, hat: "hat_02", glasses: "glasses_03", skin: "s3" }, code);
  /* chọn thân không được xoá mũ/kính bé đang đội; riêng rồng thì da/mặt/tóc
   * về mặc định vì rồng không nhận các lớp đó. */
  const wantSkin = kid.bodies[code].overlays !== false ? "s3" : kid.defaults.skin;
  check(`  applyBody(${code}): giữ mũ/kính, da ${wantSkin}`,
    look.hat === "hat_02" && look.glasses === "glasses_03" && look.skin === wantSkin,
    JSON.stringify(look));
}
for (const code of SUITS) {
  const look = api.applyBody(kid.defaults, code);
  check(`  ${code}: "diện" chuẩn là bỏ áo quần`, !look.shirt && !look.pants && !look.shoes, JSON.stringify(look));
}

/* ================= 4. allowlist server ================================= */
console.log("4. Frontend ↔ server outfitCatalog");
const server = await import(pathToFileURL(path.resolve(ROOT, "server/src/lib/outfitCatalog.js")).href);
const FE_IDS = {
  body: Object.keys(kid.bodies),
  skin: Object.keys(kid.skinTones),
  face: Object.keys(kid.faces),
  hair: Object.keys(kid.hairs),
  hairColor: Object.keys(kid.hairColors),
  shirt: Object.keys(kid.shirtColors),
  dress: Object.keys(kid.dressColors),
  pants: Object.keys(kid.pants),
  shoes: Object.keys(kid.shoes),
  glasses: Object.keys(kid.glasses),
  hat: Object.keys(kid.hats),
  acc: Object.keys(kid.accs),
};
for (const [field, ids] of Object.entries(FE_IDS)) {
  const allowed = server.AVATAR_FIELDS[field] || [];
  const missing = ids.filter((id) => !allowed.includes(id));
  check(`  ${field}: server nhận đủ id`, missing.length === 0, `thiếu ${missing.join(", ")}`);
  const ghost = allowed.filter((id) => id !== null && !ids.includes(id));
  check(`  ${field}: server không liệt id ma`, ghost.length === 0, `id ma ${ghost.join(", ")}`);
}
for (const code of Object.keys(kid.bodies)) {
  const feState = api.sanitizeKid(api.applyBody(kid.defaults, code));
  const back = server.sanitizeAvatar(feState);
  const drift = Object.keys(feState).filter((k) => String(feState[k]) !== String(back[k]));
  check(`  ${code}: lưu lên API rồi tải về không đổi`, drift.length === 0, drift.map((k) => `${k}: ${feState[k]}→${back[k]}`).join(", "));
}
check("  server: thân tự mặc đồ khớp frontend",
  SUITS.every((c) => server.AVATAR_SELF_CLOTHED_BODIES.includes(c)) &&
  server.AVATAR_SELF_CLOTHED_BODIES.every((c) => c === "body_girl_01" || SUITS.includes(c)));

/* ================= 5. render đủ tổ hợp ================================== */
console.log("5. Render mọi thân × mọi item");
let combos = 0;
const dirty = [];
for (const code of Object.keys(kid.bodies)) {
  const base = api.applyBody(kid.defaults, code);
  for (const tab of api.kidTabs(base)) {
    const cfg = api.kidTabCfg(tab.k, base);
    for (const id of (cfg.ids || []).concat(cfg.nullable ? [null] : [])) {
      const next = api.sanitizeKid({ ...base, [tab.k]: id });
      const svg = api.renderKid(next);
      combos++;
      const bad = !svg.startsWith('<svg') || !svg.endsWith('</svg>')
        || svg.includes("undefined") || svg.includes("NaN")
        || (svg.match(/<g\b/g) || []).length !== (svg.match(/<\/g>/g) || []).length;
      if (bad) dirty.push(`${code}/${tab.k}=${id}`);
    }
  }
}
check(`  ${combos} tổ hợp render sạch`, combos > 150 && dirty.length === 0, dirty.join(", "));
const dragonTabs = api.kidTabs(api.applyBody(kid.defaults, "body_dragon_01"));
eq("  rồng chỉ còn tab Thân", dragonTabs.length, 1);
check("  rider/superman giữ đủ đồ", api.kidTabs(api.applyBody(kid.defaults, "body_rider_01")).length >= 11);

/* ================= kết quả ============================================= */
console.log(`\n${fails.length ? "✖" : "✔"} ${pass}/${pass + fails.length} kiểm tra avatar khớp`);
for (const f of fails) console.log(`  ✖ ${f}`);
process.exit(fails.length ? 1 : 0);
