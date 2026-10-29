/**
 * vthConfig.js — bộ quy tắc của cấu hình Vườn Thủ Hộ (game plantvsanimal).
 *
 *Nguồn mặc định: khối `<script type="application/json" id="cfgDefault">` bên
 * trong src/games/offline/plantvsanimal.html — chính block mà game đọc khi mở
 * file trực tiếp. Lấy từ đó (thay vì chép tay sang một file JSON thứ hai) để
 * trang quản trị và game KHÔNG BAO GIỜ lệch bản mặc định.
 *
 * Trang admin dùng `validateVth()` y hệt game: JSON nào admin lưu được thì game
 * chắc chắn nạp được; game từ chối thì admin cũng không cho lưu.
 */
import GAME_HTML from "../games/offline/plantvsanimal.html?raw";

/** Key trong kho cấu hình server: GET/PUT /api/game-configs/<key>. */
export const VTH_CONFIG_KEY = "plantvsanimal";

const BLOCK = /<script type="application\/json" id="cfgDefault">([\s\S]*?)<\/script>/.exec(GAME_HTML);
if (!BLOCK) throw new Error("Không tìm thấy khối #cfgDefault trong plantvsanimal.html");

/** Bản mặc định nhúng trong game (monsters / plants / levels, không có emoji). */
export const DEF_VTH = JSON.parse(BLOCK[1]);

/* Icon do game tự tra theo id — JSON config chỉ gửi id + số liệu.
   Bảng dưới phải khớp MON_ICON / PLANT_ICON trong plantvsanimal.html. */
export const MON_ICON = { worm: "🐛", beetle: "🪲", locust: "🦗", rat: "🐀", snail: "🐌", boss: "🦂", zombie: "🧟", zombieCone: "🧟", bat: "🦇", vampire: "🧛", vampLord: "🧛" };
export const PLANT_ICON = { sunflower: "🌻", shooter: "🥦", wall: "🥥", bomb: "🍒", ice: "🫐", mine: "🥔", repeater: "🌵", chili: "🌶️", garlic: "🧄", gatling: "🫒", threepeater: "🪻", peashooter: "🫛", firepea: "🔥", sniper: "🎯" };

export const M_BASE = { icon: "👾", name: "Quái", hp: 100, speed: 0.2, dps: 20, size: 1 };
export const P_BASE = { icon: "🌱", name: "Cây", kind: "wall", cost: 50, hp: 80, cooldown: 5 };
export const KIND_DEF = {
  producer: { amount: 25, every: 9, first: 5 },
  shooter: { damage: 20, every: 1.5, shots: 1 },
  bomb: { damage: 400, radius: 1.5, fuse: 1 },
  lane: { damage: 400, fuse: 0.8 },
  mine: { damage: 500, arm: 8 },
  wall: {},
};
export const KIND_LABEL = {
  producer: "Sản xuất nắng", shooter: "Bắn", wall: "Tường", bomb: "Bom",
  lane: "Bom cả hàng", mine: "Mìn",
};
export const THEMES = { day: "Ban ngày", dusk: "Hoàng hôn", night: "Ban đêm" };

const clone = (v) => JSON.parse(JSON.stringify(v));

/** Nạp bản mặc định về dạng đầy đủ (mọi màn có timeline chuẩn hoá). */
export function defaultVth() {
  return { ...clone(DEF_VTH), levels: (DEF_VTH.levels || []).map(canonLevel) };
}

/** Ghép bản đang sửa với mặc định + giá trị nền, trả về số liệu dùng được. */
export function resolveCfg(u) {
  const cfg = { unlockAll: u.unlockAll !== false, monsters: {}, plants: {}, levels: Array.isArray(u.levels) ? u.levels : [] };
  new Set([...Object.keys(DEF_VTH.monsters), ...Object.keys(u.monsters || {})]).forEach((id) => {
    cfg.monsters[id] = Object.assign({}, M_BASE, DEF_VTH.monsters[id] || {}, (u.monsters || {})[id] || {});
    cfg.monsters[id].icon = cfg.monsters[id].emoji || cfg.monsters[id].icon || MON_ICON[id] || M_BASE.icon;
  });
  new Set([...Object.keys(DEF_VTH.plants), ...Object.keys(u.plants || {})]).forEach((id) => {
    const p = Object.assign({}, P_BASE, DEF_VTH.plants[id] || {}, (u.plants || {})[id] || {});
    const kd = KIND_DEF[p.kind] || {};
    Object.keys(kd).forEach((k) => { if (p[k] === undefined) p[k] = kd[k]; });
    p.icon = p.emoji || p.icon || PLANT_ICON[id] || P_BASE.icon;
    cfg.plants[id] = p;
  });
  return cfg;
}

/** Đúng luật mà gameplantvsanimal.html kiểm tra trước khi chấp nhận JSON. */
export function validateVth(u) {
  const er = [];
  if (!u || typeof u !== "object" || Array.isArray(u)) return ["JSON gốc phải là object { ... }"];
  if (!Array.isArray(u.levels) || !u.levels.length) er.push('"levels" phải là mảng có ít nhất 1 màn');
  const c = resolveCfg(u);
  Object.entries(c.monsters).forEach(([id, m]) => {
    if (!(m.hp > 0)) er.push(`Quái "${id}": "hp" phải > 0`);
    if (!(m.speed > 0)) er.push(`Quái "${id}": "speed" phải > 0 (ô/giây)`);
  });
  Object.entries(c.plants).forEach(([id, p]) => {
    if (!KIND_DEF[p.kind]) er.push(`Cây "${id}": "kind" không hợp lệ`);
    if (!(p.cost >= 0)) er.push(`Cây "${id}": "cost" phải >= 0`);
  });
  (u.levels || []).forEach((L, i) => {
    const n = "Màn " + (i + 1), rows = L.rows === undefined ? 5 : L.rows;
    if (!Number.isInteger(rows) || rows < 3 || rows > 6) er.push(`${n}: "rows" phải là số nguyên 3–6`);
    if (!Array.isArray(L.plants) || !L.plants.length) er.push(`${n}: thiếu "plants"`);
    else L.plants.forEach((p) => { if (!c.plants[p]) er.push(`${n}: cây "${p}" không tồn tại`); });
    if (!Array.isArray(L.timeline) || !L.timeline.length) { er.push(`${n}: thiếu "timeline"`); return; }
    L.timeline.forEach((e, j) => {
      const nn = `${n}, sự kiện #${j + 1}`;
      if (typeof e.t !== "number" || e.t < 0) er.push(`${nn}: "t" phải là số giây >= 0`);
      const specs = Array.isArray(e.spawn) ? e.spawn : (e.monster ? [e] : null);
      if (!specs && !e.banner) er.push(`${nn}: cần "monster" hoặc "spawn"`);
      (specs || []).forEach((s) => {
        if (!c.monsters[s.monster]) er.push(`${nn}: quái "${s.monster}" không tồn tại`);
        const r = s.row;
        if (r !== undefined && !(r === "random" || r === "all" || (Number.isInteger(r) && r >= 1 && r <= rows))) {
          er.push(`${nn}: "row" phải là 1..${rows}, "random" hoặc "all"`);
        }
      });
    });
  });
  return er;
}

/** Về dạng nội bộ: mọi sự kiện có `spawn: [...]`, sắp xếp theo thời gian. */
export function canonLevel(L) {
  const o = clone(L);
  o.timeline = (o.timeline || []).map((e) => {
    const specs = Array.isArray(e.spawn) ? e.spawn : (e.monster ? [{ monster: e.monster, row: e.row, count: e.count, gap: e.gap, delay: e.delay }] : []);
    const n = { t: e.t };
    if (e.banner) n.banner = e.banner;
    if (e.flag) n.flag = true;
    n.spawn = specs.map((s) => ({
      monster: s.monster,
      row: s.row === undefined ? "random" : s.row,
      count: s.count || 1,
      gap: s.gap === undefined ? 1.5 : s.gap,
      delay: s.delay || 0,
    }));
    return n;
  }).sort((a, b) => a.t - b.t);
  o.skySun = o.skySun || { first: 6, every: 9, amount: 25 };
  o.rows = o.rows || 5;
  o.theme = o.theme || "day";
  return o;
}

/** Trả về dạng gọn như JSON gốc: 1 quái 1 dòng, bỏ giá trị bằng mặc định. */
export function compactLevel(L) {
  const o = clone(L);
  o.timeline = L.timeline.map((e) => {
    if (e.spawn.length === 1 && !e.banner && !e.flag) {
      const s = e.spawn[0], n = { t: e.t, monster: s.monster, row: s.row };
      if (s.count > 1) n.count = s.count;
      if (s.count > 1 && s.gap !== 1.5) n.gap = s.gap;
      if (s.delay) n.delay = s.delay;
      return n;
    }
    const n = { t: e.t };
    if (e.banner) n.banner = e.banner;
    if (e.flag) n.flag = true;
    n.spawn = e.spawn.map((s) => {
      const r = { monster: s.monster, row: s.row };
      if (s.count > 1) r.count = s.count;
      if (s.count > 1 || s.gap !== 1.5) r.gap = s.gap;
      if (s.delay) r.delay = s.delay;
      return r;
    });
    return n;
  });
  return o;
}

export function vthOut(cfg) {
  return { ...clone(cfg), levels: (cfg.levels || []).map(compactLevel) };
}

/** In JSON một dòng trước, chỉ xuống dòng khi thực sự dài (giống bản trong game). */
export function prettyJ(v, ind = "") {
  const one = (x) => (x === null || typeof x !== "object" ? JSON.stringify(x)
    : Array.isArray(x) ? "[" + x.map(one).join(", ") + "]"
      : "{" + Object.keys(x).map((k) => JSON.stringify(k) + ": " + one(x[k])).join(", ") + "}");
  const s = one(v);
  if (s.length + ind.length <= 118 || v === null || typeof v !== "object") return s;
  const n = ind + "  ";
  return Array.isArray(v)
    ? "[\n" + v.map((x) => n + prettyJ(x, n)).join(",\n") + "\n" + ind + "]"
    : "{\n" + Object.keys(v).map((k) => n + JSON.stringify(k) + ": " + prettyJ(v[k], n)).join(",\n") + "\n" + ind + "}";
}

/** Màn mới hợp lệ tối thiểu để người dùng sửa tiếp. */
export function blankLevel() {
  return canonLevel({
    name: "Màn mới", theme: "day", rows: 5, startSun: 150,
    plants: ["sunflower", "shooter"],
    skySun: { first: 6, every: 9, amount: 25 },
    timeline: [{ t: 20, monster: "worm", row: "random" }],
  });
}

/** Một đợt quái trống, dùng cho nút "+ Thêm loại quái vào đợt này". */
export function blankSpawn(cfg) {
  const first = Object.keys(resolveCfg(cfg).monsters)[0] || "worm";
  return { monster: first, row: "random", count: 1, gap: 1.5, delay: 0 };
}

/** Số liệu tóm tắt một màn (hiện ở 4 thẻ thống kê). */
export function levelStats(L, c) {
  const rowsN = L.rows || 5;
  let cnt = 0, hp = 0, last = 0, boss = false;
  (L.timeline || []).forEach((e) => (e.spawn || []).forEach((s) => {
    const m = c.monsters[s.monster];
    if (!m) return;
    const n = (s.count || 1) * (s.row === "all" ? rowsN : 1);
    cnt += n;
    hp += n * m.hp;
    last = Math.max(last, e.t + (s.delay || 0) + (s.gap || 0) * ((s.count || 1) - 1));
    if (m.hp >= 1500) boss = true;
  }));
  return { cnt, hp, last, boss };
}
