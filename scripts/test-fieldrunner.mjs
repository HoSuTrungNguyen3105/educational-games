// scripts/test-fieldrunner.mjs — kiểm tra hệ thống 8 cánh đồng của fieldrunner:
// boot src/games/offline/fieldrunner.html
// trong vm + DOM giả, rồi chơi thật: chọn màn → xây trụ → đánh đợt → thắng → mở khoá màn.
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync("src/games/offline/fieldrunner.html", "utf8");

function blocks(h) {
  const s = h.replace(/<!--[\s\S]*?-->/g, "");
  const out = [];
  let i = 0;
  while (true) {
    const o = s.indexOf("<" + "script", i);
    if (o === -1) break;
    const g = s.indexOf(">", o);
    const c = s.indexOf("</" + "script>", g);
    if (c === -1) break;
    out.push(s.slice(g + 1, c));
    i = c + 9;
  }
  return out;
}

const noop = () => {};
function ctx2d() {
  const t = {};
  return new Proxy(t, {
    get: (_, k) => {
      if (k in t) return t[k];
      if (k === "canvas") return { width: 960, height: 600 };
      if (k === "measureText") return () => ({ width: 42 });
      if (k === "createLinearGradient" || k === "createRadialGradient")
        return () => ({ addColorStop: noop });
      if (k === "createPattern") return () => ({});
      if (k === "getImageData") return () => ({ data: new Uint8ClampedArray(4) });
      return noop;
    },
    set: (o, k, v) => ((o[k] = v), true),
  });
}

let nodeSeq = 0;
const registry = new Set();
const parentOf = new Map();
const VOID = new Set(["br", "img", "input", "hr", "meta", "link"]);

function mkNode(tag = "div") {
  const n = {
    tagName: String(tag).toUpperCase(),
    _html: "", textContent: "", value: "", hidden: false, title: "", type: "", _id: "",
    get id() { return this._id; },
    set id(v) { this._id = String(v); this.attrs.id = this._id; byId.set("#" + this._id, this); },
    get className() { return [...this.classList._s].join(" "); },
    set className(v) {
      this.classList._s.clear();
      String(v).split(/\s+/).filter(Boolean).forEach((c) => this.classList.add(c));
    },
    dataset: {}, children: [], attrs: {}, handlers: {},
    width: 960, height: 600, clientWidth: 960, clientHeight: 600,
    offsetWidth: 200, offsetHeight: 40,
    style: new Proxy({}, { set: () => true, get: () => "" }),
    classList: {
      _s: new Set(),
      add(...c) { c.forEach((x) => this._s.add(x)); },
      remove(...c) { c.forEach((x) => this._s.delete(x)); },
      toggle(c, v) { v === undefined ? (this._s.has(c) ? this._s.delete(c) : this._s.add(c)) : (v ? this._s.add(c) : this._s.delete(c)); },
      contains(c) { return this._s.has(c); },
    },
    get innerHTML() { return this._html; },
    set innerHTML(v) {
      this._html = String(v);
      for (const c of this.children) parentOf.delete(c);
      this.children = [];
      for (const c of parseNodes(this._html)) { parentOf.set(c, this); this.children.push(c); }
    },
    appendChild(c) {
      parentOf.set(c, this);
      this.children.push(c);
      for (const d of descendants(c)) if (d.id) byId.set("#" + d.id, d);
      if (c.id) byId.set("#" + c.id, c);
      return c;
    },
    append(...c) { c.forEach((x) => this.appendChild(x)); },
    insertAdjacentHTML(_, v) { this.innerHTML = this._html + v; },
    setAttribute(k, v) {
      this.attrs[k] = String(v);
      if (k === "id") this.id = String(v);
      if (k === "class") String(v).split(/\s+/).filter(Boolean).forEach((c) => this.classList.add(c));
      if (k === "hidden") this.hidden = true;
      if (/^data-/.test(k)) this.dataset[k.slice(5).replace(/-([a-z])/g, (m, x) => x.toUpperCase())] = String(v);
    },
    getAttribute(k) { return this.attrs[k] ?? null; },
    hasAttribute(k) { return k in this.attrs; },
    addEventListener(ev, fn) { (this.handlers[ev] ||= []).push(fn); },
    removeEventListener() {},
    querySelector(sel) {
      const hit = query(this, sel)[0];
      if (hit) return hit;
      // HTML tĩnh của game không được parse đầy đủ trong harness → bịa node
      // con để các dòng như `b.querySelector('.cd').style` chạy được.
      const c = mkNode((String(sel).match(/[a-zA-Z][\w-]*$/) || ["div"])[0]);
      this.appendChild(c);
      return c;
    },
    querySelectorAll(sel) { return query(this, sel); },
    closest(sel) {
      let p = this;
      while (p) { if (matches(p, sel)) return p; p = parentOf.get(p) || null; }
      return null;
    },
    get parentElement() {
      // Node tạo lười bởi getElementById không có cha — bịa một cha để game
      // đi ngược lên được (updUI đổi aria-valuenow trên .hud__meter).
      let p = parentOf.get(this);
      if (!p) { p = mkNode("div"); parentOf.set(this, p); p.children.push(this); }
      return p;
    },
    focus() {}, blur() {}, scrollIntoView() {},
    contains(c) { return descendants(this).includes(c); },
    removeChild(c) { this.children = this.children.filter((x) => x !== c); },
    remove() { removed.push(this); parentOf.delete(this); },
    getContext: () => ctx2d(),
    toDataURL: () => "data:,",
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 960, height: 600, right: 960, bottom: 600 }),
    onclick: null, oninput: null, ondblclick: null, ontouchstart: null, ontouchend: null,
    _seq: nodeSeq++,
  };
  registry.add(n);
  return n;
}

function descendants(root) {
  const out = [];
  const walk = (n) => { for (const c of n.children || []) { if (out.includes(c)) continue; out.push(c); walk(c); } };
  walk(root);
  return out;
}

function matches(n, sel) {
  return String(sel).split(",").map((s) => s.trim()).some((s) => {
    const m = /^([a-zA-Z]*)((?:[.#][\w-]+|\[[\w-]+="[^"]*"\])*)$/.exec(s);
    if (!m) return false;
    if (m[1] && n.tagName !== m[1].toUpperCase()) return false;
    return [...m[2].matchAll(/([.#])([\w-]+)|\[([\w-]+)="([^"]*)"\]/g)].every((p) => {
      if (p[1] === "#") return n.id === p[2];
      if (p[1] === ".") return n.classList.contains(p[2]);
      const want = p[3] === "data-a" ? n.dataset.a : n.attrs[p[3]];
      return want === p[4];
    });
  });
}

function query(root, sel) {
  const hits = descendants(root).filter((n) => n.tagName && matches(n, sel));
  return sel && /^#/.test(sel) ? hits.slice(0, 1) : hits;
}

/** Parser HTML tối giản: đủ tag/attr/class/id để game tra querySelector. */
function parseNodes(src) {
  const root = { children: [] };
  const stack = [root];
  const re = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[5] !== undefined) {
      const t = m[5].trim();
      const top = stack[stack.length - 1];
      if (t && top !== root) top.textContent += t;
      continue;
    }
    const [, close, tag, attrSrc, selfClose] = m;
    if (close) { if (stack.length > 1) stack.pop(); continue; }

    const n = mkNode(tag);
    const parent = stack[stack.length - 1];
    parent.children.push(n);
    parentOf.set(n, parent === root ? null : parent);

    for (const a of attrSrc.matchAll(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      n.setAttribute(a[1], a[3] ?? a[4] ?? a[5] ?? "");
    }
    if (n.attrs.id) byId.set("#" + n.attrs.id, n);
    if (!selfClose && !VOID.has(tag.toLowerCase())) stack.push(n);
  }
  return root.children;
}

const byId = new Map();
const removed = [];
const rootHandlers = {};
const doc = {
  readyState: "complete",
  body: mkNode("body"),
  documentElement: mkNode("html"),
  getElementById(id) { return byId.get("#" + id) ?? (byId.set("#" + id, mkNode()), byId.get("#" + id)); },
  querySelector(sel) { return doc.querySelectorAll(sel)[0] ?? null; },
  querySelectorAll(sel) {
    const roots = [...registry].filter((n) => !parentOf.has(n));
    return [...new Set(roots.flatMap((r) => descendants(r)).filter((n) => matches(n, sel)))];
  },
  createElement: (t) => mkNode(t),
  createTextNode: (t) => ({ textContent: t }),
  createDocumentFragment: () => mkNode("frag"),
  addEventListener(ev, fn) { (rootHandlers[ev] ||= []).push(fn); },
  removeEventListener() {},
};

const store = (init) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
    _map: m,
  };
};

const localStorage = store({ gq_coin_wallet_v1: JSON.stringify({ coins: 9000 }) });
const sessionStorage = store({});
let now = 0;
let rafCb = null;
const posted = [];

const sandbox = {
  document: doc, console,
  Math, JSON, Date, Number, Array, Object, String, Set, Map, WeakMap, Boolean, RegExp, Error,
  TypeError, Promise, Symbol, BigInt, Infinity, NaN, undefined,
  isFinite, isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
  Float64Array, Uint8ClampedArray, Int32Array,
  localStorage, sessionStorage,
  setTimeout: (fn) => { pendingTimers.push(fn); return 0; },
  clearTimeout: noop, setInterval: () => 0, clearInterval: noop,
  requestAnimationFrame: (cb) => { rafCb = cb; return 1; },
  cancelAnimationFrame: noop,
  performance: { now: () => now },
  Path2D: class { roundRect() {} rect() {} arc() {} moveTo() {} lineTo() {} closePath() {} },
  Image: function () { return mkNode("img"); },
  fetch: async () => ({ ok: false, status: 503, json: async () => ({}) }),
  location: { hash: "", origin: "https://x", href: "https://x", reload: noop, assign: noop },
  history: { replaceState() {}, pushState() {} },
  navigator: { onLine: true, userAgent: "node", maxTouchPoints: 0 },
  devicePixelRatio: 1, innerWidth: 1280, innerHeight: 800,
  matchMedia: () => ({ matches: false, addEventListener: noop, addListener: noop }),
  alert: noop, confirm: () => true,
  getComputedStyle: () => ({ getPropertyValue: () => "" }),
  addEventListener(ev, fn) { (rootHandlers[ev] ||= []).push(fn); },
  removeEventListener: noop,
  scrollTo: noop, URL, TextEncoder, Intl,
};
const pendingTimers = [];
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.self = sandbox;
sandbox.parent = { postMessage: (m) => posted.push(m) };
vm.createContext(sandbox);

const scriptBlocks = blocks(html);
let fail = 0;
const check = (cond, msg) => {
  console.log((cond ? "  \u2714 " : "  \u2716 ") + msg);
  if (!cond) fail++;
};

console.log(`\nfieldrunner smoke — ${scriptBlocks.length} khối script\n`);

// 1) Mọi khối script phải chạy không lỗi
let bootErr = null;
for (const [i, b] of scriptBlocks.entries()) {
  try { vm.runInContext(b, sandbox, { filename: `block${i}` }); }
  catch (e) { bootErr = `khối ${i}: ${e.message}\n${e.stack?.split("\n").slice(0, 4).join("\n")}`; break; }
}
check(!bootErr, "boot toàn bộ script" + (bootErr ? " — " + bootErr : ""));
if (bootErr) process.exit(1);

const run = (code) => vm.runInContext(code, sandbox, { filename: "probe" });
const LEVEL_WAVES = 18;

// 2) Màn chọn độ khó phải hiện, chưa vào game
check(!!doc.getElementById("gc-start"), "GC.start render màn chọn độ khó");
check(run("started") === false, "chưa bắt đầu ván khi mới boot");

// 3) Màn chọn cánh đồng
run("showMapSelect({ onPick: startMap, onDiff: function(){} })");
const maps = doc.getElementById("fr-maps");
check(!!maps && maps.children.length > 0, "showMapSelect dựng overlay #fr-maps");
run("closeMapSelect()");
check(!doc.getElementById("fr-maps").children.length || removed.length > 0, "closeMapSelect gỡ overlay");

// 4) Vào màn 2 (Vườn Cây) qua startMap
run("startMap(LEVELS[1])");
check(run("level.id") === "orchard", "startMap dựng đúng màn orchard");
check(run("TOTAL") === LEVEL_WAVES, `TOTAL = ${LEVEL_WAVES} đợt`);
check(run("started") === true, "started = true");
check(run("blocked[4][1]") === true, "địa hình cây đã bake vào blocked");
check(run("noBuild[1][4]") === false, "cổng vào không phải ô cầu");
check(run("isFinite(dist[0 + SR * COLS])"), "có đường đi từ cổng vào tới cổng ra");
check(run("Object.keys(TYPES).length") === 12, "thanh xây có 12 loại trụ");
check(run("mapUnlocked(1)") === false && run("mapUnlocked(0)") === true, "màn 2 còn khoá khi chưa thắng màn 1");

// 5) Xây trụ bằng đúng handler click của game
const cv = doc.getElementById("c");
const click = (c, r) => {
  const x = c * 40 + 20, y = r * 40 + 20;
  cv.handlers.click.forEach((fn) => fn({ clientX: x, clientY: y, preventDefault: noop }));
};
run("money = 5000; build = 'gun'");
click(3, 3);
check(run("towers.length") === 1, "click đặt được trụ ('gun')");
const before = run("money");
run("build = 'gun'");
click(4, 1); // ô cây → phải bị chặn
check(run("towers.length") === 1, "không đặt trụ lên vật cản địa hình");
check(run("money") === before, "bị chặn thì không mất tiền");
run("build = 'gun'");
click(0, run("SR")); // cổng vào
check(run("towers.length") === 1, "không đặt trụ lên cổng");

// 6) Đánh thật: chạy 1 đợt và tiến khung hình
run("startWave()");
check(run("waveActive") === true && run("spawnQ.length") > 0, "startWave xếp hàng sinh địch");
for (let i = 0; i < 900; i++) {
  now += 16.7;
  const cb = rafCb; rafCb = null;
  if (cb) cb(now);
}
check(run("enemies.length + spawnQ.length + pendingSpawns.length") > 0 || run("waveDone") > 0,
  "địch đã sinh / di chuyển trong 900 khung");
check(Number.isFinite(run("lives")) && run("lives") > 0, "mạng còn hợp lệ sau khi đánh");
check(run("typeof updUI") === "function", "updUI còn hoạt động");
console.log(`     → wave=${run("wave")} waveDone=${run("waveDone")}/${run("waveSpawn")} lives=${run("lives")} kills=${run("kills")} money=${run("money")}`);

// 7) HUD cập nhật
check(/^\d/.test(String(doc.getElementById("score").textContent)), `HUD điểm: "${doc.getElementById("score").textContent}"`);
check(String(doc.getElementById("total").textContent) === String(run("TOTAL")), "HUD tổng đợt khớp màn");
check(/Đồng|Vườn|Sông|Nông|Mỏ|Đầm|Cao|Mùa/.test(String(doc.getElementById("mapName").textContent)), `HUD tên màn: "${doc.getElementById("mapName").textContent}"`);

// 8) Thắng → sao + mở khoá màn kế
run("lives = D.lives; endGame(true)");
for (const fn of pendingTimers.splice(0)) fn();   // GC.result chạy trong setTimeout(650ms)
const rec = JSON.parse(localStorage.getItem("gc:fieldrunner:maps") || "{}");
check(rec.orchard?.cleared === true, "commitMapResult ghi orchard đã thắng");
check((rec.orchard?.stars ?? 0) >= 1, `nhận sao: ${rec.orchard?.stars}★ best=${rec.orchard?.best}`);
check(run("mapUnlocked(2)") === true && run("mapUnlocked(3)") === false, "mở khoá đúng màn kế tiếp");
check(!!doc.getElementById("gc-modal"), "GC.result hiện modal kết quả");
const modalHtml = doc.getElementById("gc-modal")._html;
check(/sao|⭐/.test(modalHtml), "modal hiện thông tin sao");
check(/Mở khoá/.test(modalHtml), "modal báo mở khoá cánh đồng mới");

// 9) Đổi màn giữa trận không nhân đôi vòng lặp
run("closeMapSelect(); startMap(LEVELS[0])");
const loopsBefore = run("runLoop.on");
run("startMap(LEVELS[3])");
check(loopsBefore === true && run("runLoop.on") === true && run("level.id") === "homestead", "startMap lại không tạo vòng lặp thứ hai");
check(run("towers.length") === 0, "đổi màn xoá sạch trụ đã xây");
check(run("blocked[7][7]") === false, "lưới địa hình dựng lại theo màn mới");

// 10) Cả 8 cánh đồng: dựng nền, vẽ địa hình, có đường đi, còn chỗ xây
const bridgeMap = { riverbank: true };
for (const [i, id] of run("LEVELS.map(l=>l.id)").entries()) {
  let err = null;
  try {
    run(`startMap(LEVELS[${i}]); money = 9000;`);
    for (let f = 0; f < 240; f++) { now += 16.7; const cb = rafCb; rafCb = null; if (cb) cb(now); }
    run("startWave()");
    for (let f = 0; f < 600; f++) { now += 16.7; const cb = rafCb; rafCb = null; if (cb) cb(now); }
  } catch (e) { err = e; }
  const st = run(`({sr:SR, gr:GR, path:dist[0+SR*COLS], cells:pathPts.length, nb:noBuild.flat().filter(Boolean).length, tw:towers.length})`);
  check(!err && Number.isFinite(st.path) && st.cells > 1 && st.tw === 0,
    `${String(i + 1).padStart(2)}. ${id.padEnd(11)} vào màn + 1 đợt · cổng ${st.sr}→${st.gr} · đường ${st.path} ô · ${st.cells} điểm vẽ · ${st.nb} ô không xây` + (err ? ` · LỖI: ${err.message}` : ""));
}

// 11) Cầu không xây được, nhưng địch vẫn qua
run("startMap(LEVELS[2])");   // Bờ Sông
const bridgeCell = run(`(function(){for(let c=0;c<COLS;c++)for(let r=0;r<ROWS;r++)if(noBuild[c][r]&&!blocked[c][r])return [c,r];return null})()`);
check(!!bridgeCell, "màn Bờ Sông có ô cầu (đi được, không xây được)");
if (bridgeCell) {
  run("build='gun'; money=9000");
  click(bridgeCell[0], bridgeCell[1]);
  check(run("towers.length") === 0, "không đặt trụ lên cầu");
  check(/không xây được/i.test(String(doc.getElementById("msg").textContent)), "báo lỗi: " + doc.getElementById("msg").textContent);
}

// 12) Menu cài đặt HUD + chọn màn giữa trận
run("toggleSettings()");
check(doc.getElementById("hudMenu").classList.contains("open"), "bánh răng mở menu cài đặt");
run("setSpeed(3)");
check(run("speed") === 3 && doc.getElementById("speed").textContent === "x3", "đổi tốc độ x3 từ menu");
run("toggleSettings()");
check(!doc.getElementById("hudMenu").classList.contains("open"), "đóng menu cài đặt");
run("openMapPicker()");
check(run("paused") === true && !!run("mapsRoot"), "🗺️ giữa trận: tạm dừng ván + mở màn chọn màn");
run(`mapsRoot.querySelector('.fr-map').onclick()`);
check(run("level.id") === "meadow" && !run("mapsRoot"), "chọn màn từ picker vào luôn màn đó");
run("openMapPicker()");
run(`mapsRoot.querySelector('[data-a="resume"]').onclick()`);
check(run("paused") === false && !run("mapsRoot"), "nút ▶ về ván đang chơi bỏ tạm dừng");
run("castFreeze(); toggleStrike(); if (aim) castStrike(400, 300);");
check(run("skill.freeze.cd") > 0, "đóng băng vào hồi chiêu");
check(run("over") === false && run("paused") === false, "kỹ năng không làm hỏng ván");

// 13) Thua: không cộng sao, không mở khoá
run("startMap(LEVELS[7]); lives = 1; endGame(false)");
for (const fn of pendingTimers.splice(0)) fn();
const last = JSON.parse(localStorage.getItem("gc:fieldrunner:maps") || "{}").harvest || {};
check(last.cleared !== true && !last.stars, "thua màn cuối → không sao, chưa phá đảo: " + JSON.stringify(last));
check(/bị tràn/.test(doc.getElementById("gc-modal")._html), "modal thua nêu tên màn");

// 14) Save tiến độ nằm trong key sync được (gc:fieldrunner:maps)
check([...localStorage._map.keys()].some((k) => k === "gc:fieldrunner:maps"), "key tiến độ: " + [...localStorage._map.keys()].join(", "));

console.log(fail ? `\n\u2716 ${fail} kiểm tra lỗi\n` : `\n✔ tất cả kiểm tra pass\n`);
process.exit(fail ? 1 : 0);
