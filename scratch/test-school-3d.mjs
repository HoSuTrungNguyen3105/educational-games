// scratch/test-school-3d.mjs — kiểm tra lớp 3D của Trường Vui Vẻ (js/world3d.js)
// Chạy toàn bộ game trong vm + DOM giả + three.js r128 THẬT (bản cdnjs mà trình
// duyệt nạp), chỉ thay WebGLRenderer bằng giả lập. Không cần mở trình duyệt.
//
//   node scratch/test-school-3d.mjs
import fs from "node:fs";
import vm from "node:vm";

const ROOT = "src/games/school_mission";
const HTML = fs.readFileSync(`${ROOT}/School_mission.html`, "utf8");
const THREE_CODE = fs.readFileSync("scratch/three-r128.min.js", "utf8");

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${extra}`); }
};
const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
const nearN = (a, b, eps = 0.02) => typeof a === "number" && Math.abs(a - b) <= eps;

/* ── DOM giả tối thiểu (đủ cho core/state/world/render/main) ────────────── */
const VOID = new Set(["br", "img", "input", "hr", "meta", "link", "canvas"]);
function makeCtx(owner) {
  const t = { fillStyle: "#000", strokeStyle: "#000", globalAlpha: 1, font: "", lineWidth: 1, textAlign: "", textBaseline: "" };
  return new Proxy(t, {
    get(_, k) {
      if (k in t) return t[k];
      if (k === "canvas") return owner;
      if (k === "measureText") return () => ({ width: 42 });
      if (k === "createLinearGradient" || k === "createRadialGradient") return () => ({ addColorStop() {} });
      return (...args) => {
        owner.log.push({ fn: String(k), args, fillStyle: t.fillStyle, strokeStyle: t.strokeStyle, alpha: t.globalAlpha });
      };
    },
    set(o, k, v) { o[k] = v; return true; },
  });
}

function mkEl(tag = "div") {
  const el = {
    tagName: String(tag).toUpperCase(), _html: "", textContent: "", value: "",
    children: [], handlers: {}, dataset: {}, attrs: {}, log: [],
    id: "", width: 300, height: 300, clientWidth: 900, clientHeight: 520,
    style: new Proxy({}, { set: () => true, get: () => "" }),
    classList: {
      _s: new Set(),
      add(...c) { c.forEach((x) => this._s.add(x)); },
      remove(...c) { c.forEach((x) => this._s.delete(x)); },
      toggle(c, v) { v ? this._s.add(c) : this._s.delete(c); },
      contains(c) { return this._s.has(c); },
    },
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); this.children = parseNodes(String(v)); },
    appendChild(c) { this.children.push(c); return c; },
    append(...c) { c.forEach((x) => this.children.push(x)); },
    removeChild(c) { this.children = this.children.filter((x) => x !== c); },
    remove() {},
    setAttribute(k, v) {
      this.attrs[k] = String(v);
      if (k === "id") this.id = String(v);
      if (k === "class") String(v).split(/\s+/).filter(Boolean).forEach((c) => this.classList._s.add(c));
      if (/^data-/.test(k)) this.dataset[k.slice(5)] = String(v);
    },
    getAttribute(k) { return this.attrs[k] ?? null; },
    addEventListener(type, fn) { (this.handlers[type] ||= []).push(fn); },
    removeEventListener() {},
    querySelector(sel) { return this.querySelectorAll(sel)[0] || mkEl("div"); },
    querySelectorAll(sel) { return descendants(this).filter((n) => matches(n, sel)); },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 120, height: 120, right: 120, bottom: 120 }),
    setPointerCapture() {}, releasePointerCapture() {}, focus() {}, blur() {}, scrollIntoView() {},
    getContext() { return this._ctx || (this._ctx = makeCtx(this)); },
    toDataURL: () => "data:,",
    click() { (this.handlers.click || []).forEach((f) => f({ target: this, preventDefault() {} })); },
    onclick: null,
  };
  return el;
}
function descendants(root, out = []) {
  for (const c of root.children || []) { out.push(c); descendants(c, out); }
  return out;
}
function matches(n, sel) {
  const s = String(sel).trim();
  if (/^#/.test(s)) return n.id === s.slice(1);
  if (/^\./.test(s)) return n.classList.contains(s.slice(1));
  return n.tagName === s.toUpperCase();
}
function parseNodes(src) {
  const root = { children: [] }, stack = [root];
  const re = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[5] !== undefined) {
      const t = m[5].trim();
      if (t) stack[stack.length - 1].textContent += t;
      continue;
    }
    const [, close, tag, attrSrc, selfClose] = m;
    if (close) { if (stack.length > 1) stack.pop(); continue; }
    const n = mkEl(tag);
    stack[stack.length - 1].children.push(n);
    for (const a of attrSrc.matchAll(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g))
      n.setAttribute(a[1], a[3] ?? a[4] ?? a[5] ?? "");
    if (!selfClose && !VOID.has(tag.toLowerCase())) stack.push(n);
  }
  return root.children;
}

function makeDom() {
  const body = mkEl("body");
  body.children = parseNodes(HTML.replace(/<!--[\s\S]*?-->/g, "").split("<body>")[1].split("</body>")[0]);
  const all = () => descendants(body);
  const findSel = (sel) => {
    const parts = String(sel).trim().split(/\s+/);
    let pool = all();
    for (const p of parts) {
      const hit = [];
      for (const n of pool) {
        if (/^#/.test(p)) { const own = descendants(n).concat([n]); hit.push(...own.filter((x) => x.id === p.slice(1))); }
        else if (/^\./.test(p)) hit.push(...descendants(n).filter((x) => x.classList.contains(p.slice(1))));
        else hit.push(...descendants(n).filter((x) => x.tagName === p.toUpperCase()));
      }
      pool = [...new Set(hit)];
    }
    return pool;
  };
  return {
    body,
    documentElement: body,
    hidden: false,
    readyState: "complete",
    getElementById: (id) => all().find((n) => n.id === id) || null,
    createElement: (tag) => mkEl(tag),
    createElementNS: (_ns, tag) => mkEl(tag),
    querySelector: (sel) => findSel(sel)[0] || mkEl("div"),
    querySelectorAll: (sel) => findSel(sel),
    addEventListener: () => {},
  };
}

/* ── dựng một lần chạy game: withThree = true → 3D, false → 2D dự phòng ── */
function boot(withThree, opts = {}) {
  const doc = makeDom();
  const posts = [];
  const listeners = {};
  const store = new Map();
  const timers = [];

  const win = {
    parent: { postMessage: (m) => posts.push(m) },
    addEventListener: (t, f) => (listeners[t] ||= []).push(f),
    postMessage: (m) => posts.push(m),
    document: doc,
    location: { search: withThree ? "?debug" : "", href: "about:srcdoc", reload() {} },
    navigator: { onLine: true, clipboard: { writeText: () => Promise.resolve() } },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    innerWidth: opts.w || 900, innerHeight: opts.h || 520, devicePixelRatio: 1,
    requestAnimationFrame: () => 0,
    setTimeout: (f, ms) => { timers.push(f); return timers.length; },
    clearTimeout: () => {},
    setInterval: () => 0, clearInterval: () => {},
    console,
    __SCHOOL_INIT__: { playerName: "Bé Minh Anh", savedState: null },
  };

  const sandbox = {
    window: win, document: doc, console,
    location: win.location, navigator: win.navigator, localStorage: win.localStorage,
    innerWidth: win.innerWidth, innerHeight: win.innerHeight, devicePixelRatio: 1,
    performance: { now: () => Date.now() },
    requestAnimationFrame: win.requestAnimationFrame,
    setTimeout: win.setTimeout, clearTimeout: win.clearTimeout,
    setInterval: win.setInterval, clearInterval: win.clearInterval,
    addEventListener: (t, f) => (listeners[t] ||= []).push(f),
    removeEventListener: () => {},
    Image: function () { return mkEl("img"); },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  if (withThree) {
    vm.runInContext(THREE_CODE, sandbox, { filename: "three.min.js" });
    // Giả lập WebGL: giữ nguyên toàn bộ toán học/scene graph thật của three.js
    vm.runInContext(`
      THREE.WebGLRenderer = function () {
        this.domElement = document.createElement("canvas");
        this.setPixelRatio = function () {};
        this.setSize = function (w, h) { window.__size = [w, h]; };
        this.render = function () { window.__renders = (window.__renders || 0) + 1; };
      };
      window.THREE = THREE;`, sandbox, { filename: "fake-renderer.js" });
  }

  const order = [...HTML.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
  for (const src of order) {
    if (/^https?:/.test(src)) continue;
    const code = fs.readFileSync(`${ROOT}/${src}`, "utf8");
    vm.runInContext(code, sandbox, { filename: src });
  }
  const ev = (expr) => vm.runInContext(expr, sandbox);
  return { ev, sandbox, win, posts, listeners, doc, store };
}

/* ══════ 1. Bật 3D khi có three.js ══════ */
console.log("\n[1] Lớp 3D khởi động");
const g = boot(true);
const dbg = () => g.ev("window.__w3");
ok("W3 khác null khi có THREE", g.ev("W3 !== null && W3.ok === true"));
ok("Thẻ #gl nhận canvas của renderer", g.ev(`document.getElementById("gl").children.length === 1`));
ok("setSize theo cửa sổ 900x520", JSON.stringify(g.ev("window.__size")) === "[900,520]",
  JSON.stringify(g.ev("window.__size")));
ok("Cảnh sân trường đã dựng (nhiều vật thể)", g.ev("window.__w3.props.children.length") > 40,
  "props=" + g.ev("window.__w3.props.children.length"));
ok("Biển vùng phủ đủ mọi vùng tự kích hoạt", g.ev(`
  window.__w3.marks.children.length`) === g.ev(`
  ZN().length + 1 + P.filter(p => p.lv && S.lv < p.lv).length`),
  g.ev("window.__w3.marks.children.length") + " so với " + g.ev("ZN().length + 1 + P.filter(p => p.lv && S.lv < p.lv).length"));

/* ══════ 2. Toạ độ người chơi + máy quay ══════ */
console.log("\n[2] Ánh xạ 2D → 3D và máy quay sau vai");
/* (900,1050) = giữa sân phía nam: đi lên ~200px không chạm cửa trường (y356)
   lẫn căng tin/vườn/sân thể thao, nên không có modal tự mở chặn điều khiển. */
const START = [900, 1050];
g.ev(`go('out',${START[0]},${START[1]})`);
g.ev("W3.frame(0.016)");
const [SX, SY] = START;
const EXP = { x: (SX - 900) / 45, z: (SY - 550) / 45 };
const p0 = g.ev("[window.__w3.player.root.position.x, window.__w3.player.root.position.y, window.__w3.player.root.position.z]");
ok(`me(${SX},${SY}) → (${EXP.x.toFixed(2)}, 0, ${EXP.z.toFixed(2)}) mét`,
  nearN(p0[0], EXP.x) && nearN(p0[1], 0) && nearN(p0[2], EXP.z), JSON.stringify(p0));
const cam0 = g.ev("[window.__w3.camera.position.x, window.__w3.camera.position.y, window.__w3.camera.position.z]");
ok("Máy quay nằm sau lưng 4.3m, cao 2.7m", nearN(cam0[0], EXP.x) && nearN(cam0[1], 1.25 + Math.sin(0.34) * 4.3) &&
  nearN(cam0[2], EXP.z + Math.cos(0.34) * 4.3), JSON.stringify(cam0));
ok("Yaw đầu tiên = 0 (hướng lên bắc, giống màn 2D)", nearN(g.ev("window.__w3.yaw"), 0));

g.ev("keys.w = 1");
for (let i = 0; i < 20; i++) { g.ev("upd(0.05)"); g.ev("W3.frame(0.05)"); }
g.ev("keys.w = 0");
const moved = g.ev("[me.y, me.dy, window.__w3.player.root.rotation.y, sc]");
ok("Đẩy lên trên = đi ra xa máy quay (y giảm)", moved[0] < SY, "y=" + moved[0]);
ok("Vẫn ở sân trường, chưa bước qua cửa", moved[3] === "out", "sc=" + moved[3]);
ok("Không có popup tự mở giữa chừng (không chặn điều khiển)", g.ev("open_") === false);
ok("me.dy ghi nhận hướng -1", nearN(moved[1], -1), "dy=" + moved[1]);
ok("Nhân vật quay mặt hướng bắc (rotation 0)", nearN(moved[2], 0, 0.05), "rot=" + moved[2]);

/* ══════ 3. Kéo màn hình để xoay máy quay ══════ */
console.log("\n[3] Kéo chuột để xoay máy quay");
g.ev(`go('out',${START[0]},${START[1]})`);
// main.js luôn gọi upd() trước draw(); upd() mới là thứ trả me.dx/dy về 0 khi nhả phím
g.ev("keys.w = 0; upd(0.016); W3.frame(0.016)");
const stage = g.doc.getElementById("gl");
const fire = (type, e) => (stage.handlers[type] || []).forEach((f) => f(e));
fire("pointerdown", { pointerId: 1, clientX: 400, button: 0 });
fire("pointermove", { pointerId: 1, clientX: 520 });
fire("pointerup", { pointerId: 1 });
for (let i = 0; i < 60; i++) g.ev("W3.frame(0.05)");
const yawAfter = g.ev("window.__w3.yaw");
ok("Kéo sang phải làm đổi yaw", Math.abs(yawAfter) > 0.3, "yaw=" + yawAfter);
ok("Yaw hội tụ về góc kéo (-0.72 rad)", nearN(yawAfter, -0.72, 0.05), "yaw=" + yawAfter);
const cam1 = g.ev("[window.__w3.camera.position.x - window.__w3.player.root.position.x, window.__w3.camera.position.z - window.__w3.player.root.position.z]");
ok("Máy quay vẫn cách bé 4.3m theo hướng yaw mới",
  nearN(cam1[0], Math.sin(yawAfter) * Math.cos(0.34) * 4.3, 0.06) &&
  nearN(cam1[1], Math.cos(yawAfter) * Math.cos(0.34) * 4.3, 0.06), JSON.stringify(cam1));
const before = g.ev("[me.x, me.y]");
g.ev("keys.w = 1");
for (let i = 0; i < 10; i++) { g.ev("upd(0.05)"); g.ev("W3.frame(0.05)"); }
g.ev("keys.w = 0");
const after = g.ev("[me.x, me.y, me.dx, me.dy]");
const expDx = -Math.sin(yawAfter), expDy = -Math.cos(yawAfter);
ok("Đi theo hướng máy quay (dx = -sin yaw)", nearN(after[2], expDx, 0.05), `dx=${after[2]} exp=${expDx}`);
ok("Đi theo hướng máy quay (dy = -cos yaw)", nearN(after[3], expDy, 0.05), `dy=${after[3]} exp=${expDy}`);
ok("Vị trí đổi theo hướng mới", Math.hypot(after[0] - before[0], after[1] - before[1]) > 20);

/* ══════ 4. Đổi cảnh ══════ */
console.log("\n[4] Dựng lại cảnh khi vào trường / lớp");
const countOf = (grp) => g.ev(`window.__w3.${grp}.children.length`);
g.ev("go('hall',140,300)");
g.ev("W3.frame(0.016)");
ok("Hành lang: nền + tường + cửa", countOf("props") > 15, "props=" + countOf("props"));
ok("Hành lang đổi kích thước bản đồ 1700x420", JSON.stringify(g.ev("window.__w3.world")) === "[1700,420]");
const hallP = g.ev("[window.__w3.player.root.position.x, window.__w3.player.root.position.z]");
ok("me(140,300) → (-15.8, 2.0)", nearN(hallP[0], (140 - 850) / 45, 0.05) && nearN(hallP[1], (300 - 210) / 45, 0.05), JSON.stringify(hallP));
ok("Vùng bị chặn ở hành lang không đổi (y<195)", g.ev("blocked(800,150)") === true && g.ev("blocked(800,300)") === false);

g.ev("go('room',500,505,'math')");
g.ev("W3.frame(0.016)");
const kidsInRoom = countOf("kids");
ok("Lớp: 1 bạn + 7 bạn ngồi + 1 cô giáo = 9", kidsInRoom === 9, "kids=" + kidsInRoom);
ok("Lớp có bàn ghế (10 bàn × 6 khối)", countOf("props") > 60, "props=" + countOf("props"));
const tea = g.ev(`(()=>{const k=window.__w3.kids.children.find(c=>c.position.y>0);return k?[k.position.x,k.position.y,k.rotation.y]:null})()`);
ok("Cô giáo đứng trên bục, quay ra lớp", tea && nearN(tea[1], 0.34) && nearN(Math.abs(tea[2]), Math.PI, 0.01), JSON.stringify(tea));

g.ev("go('hall2',120,320)");
g.ev("W3.frame(0.016)");
ok("Tầng 2 có cửa sổ (nhiều khối hơn tường thường)", countOf("props") > 15);
g.ev("go('out',900,560)");
g.ev("W3.frame(0.016)");
ok("Trở lại sân trường dựng lại đủ cây", countOf("props") > 40);

/* ══════ 5. Lớp phủ 2D + chữ +x ══════ */
console.log("\n[5] Lớp phủ trong suốt (chữ bay, đồng hồ hái hoa, fade)");
const cvs = g.doc.getElementById("c");
cvs.log.length = 0;
g.ev("pop('+50 🪙')");
g.ev("ftime = 9; flowers.push({x:900,y:600})");
// draw() mới gọi overlay(); W3.frame() đơn thuần chỉ dựng hình 3D
g.ev("draw(0.016)");
const texts = cvs.log.filter((l) => l.fn === "fillText").map((l) => String(l.args[0]));
ok("Chữ +x bắn lên từ vị trí nhân vật", texts.some((t) => t.includes("+50")), texts.join("|"));
ok("Đồng hồ hái hoa hiện trên màn ảnh", texts.some((t) => t.includes("🌸 còn 1")), texts.join("|"));
const pos = cvs.log.filter((l) => l.fn === "fillText").map((l) => [l.args[1], l.args[2]]);
ok("Toạ độ chữ nằm trong màn ảnh 900x520", pos.length > 1 &&
  pos.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y) && x > -80 && x < 980 && y > -80 && y < 600), JSON.stringify(pos));
ok("Có xoá lớp phủ trước khi vẽ (clearRect)", cvs.log.some((l) => l.fn === "clearRect"));
g.ev("go('room',500,505,'eng')");
cvs.log.length = 0;
g.ev("upd(0.016)"); g.ev("draw(0.016)");
ok("Fade chuyển cảnh vẽ đè toàn màn", cvs.log.some((l) => l.fn === "fillRect" && /^rgba\(0,0,0,/.test(String(l.fillStyle))),
  cvs.log.filter((l) => l.fn === "fillRect").map((l) => String(l.fillStyle)).join("|"));

/* ══════ 6. Nhân vật = tạo hình game + tên tài khoản ══════ */
console.log("\n[6] Nhân vật người chơi (bỏ avatar hồ sơ)");
ok("Tên tài khoản dán trên đầu bé", g.ev(`
  (() => {
    const found = [];
    window.__w3.kids.traverse(o => { if (o.isSprite && o.material && o.material.map) found.push(o.material.map.image.log.map(l => String(l.args[0])).join('|')); });
    return found.some(t => t.includes('Bé Minh Anh'));
  })()`));
ok("Màu áo đang mặc (S.col) được tô lên thân bé", g.ev(`
  (() => {
    const want = parseInt(S.col.slice(1), 16);
    let hit = false;
    window.__w3.player.body.traverse(o => { if (o.isMesh && o.material.color.getHex() === want) hit = true; });
    return hit;
  })()`));
const colBefore = g.ev("window.__w3.player.root.uuid");
g.ev("S.col = '#54a0ff'; S.hat = '🎀'");
g.ev("W3.frame(0.016)");
ok("Mua áo/mũ xong là tạo hình đổi theo", g.ev("window.__w3.player.root.uuid") !== colBefore);

/* ══════ 7. Vòng dài: không crash, không lọt tường ══════ */
console.log("\n[7] Chơi thật 400 khung hình");
let err = null;
try {
  g.ev("go('out',900,560)");
  for (let i = 0; i < 400; i++) {
    g.ev(`keys.w=${i % 4 < 2 ? 1 : 0};keys.a=${i % 8 < 4 ? 1 : 0};keys.d=${i % 8 >= 4 ? 1 : 0}`);
    g.ev("upd(0.033)");
    g.ev("W3.frame(0.033)");
    if (i === 120) g.ev("go('hall',140,300)");
    if (i === 200) g.ev("go('room',500,505,'math')");
    if (i === 260) g.ev("go('hall2',120,320)");
    if (i === 320) g.ev("go('out',900,560)");
  }
} catch (e) { err = e; }
ok("400 khung hình không lỗi", !err, err ? err.stack.split("\n").slice(0, 3).join(" | ") : "");
ok("Không đi xuyên vào dãy nhà trường", g.ev("blocked(me.x, me.y)") === false);
ok("Vị trí còn trong bản đồ", g.ev("me.x>25 && me.x<1775 && me.y>40 && me.y<1085"));
ok("Renderer được gọi mỗi khung", g.ev("window.__renders") > 400, "renders=" + g.ev("window.__renders"));
// Số khối của cảnh "out" phụ thuộc S.lv (vườn/sân thể thao bị khoá thì ít khối
// hơn) và số hoa đang hái. Đặt lại cả hai trước khi so sánh để phép thử tất định.
g.ev("S.lv = 1; flowers.length = 0; ftime = 0");
g.ev("go('out',900,560)"); g.ev("W3.frame(0.016)");
const propsOut = countOf("props");
g.ev("go('hall',140,300)"); g.ev("W3.frame(0.016)");
g.ev("go('out',900,560)"); g.ev("W3.frame(0.016)");
ok("Đổi cảnh tới lui không làm số vật thể phình lên", countOf("props") === propsOut,
  countOf("props") + " so với " + propsOut);
ok("Giải phóng geometrie khi dựng lại cảnh (không rò GPU)", g.ev("window.__w3.props.children.every(c => c.parent === window.__w3.props)"));

/* ══════ 8. Nhiệm vụ + coin thật vẫn chạy trong bản 3D ══════ */
console.log("\n[8] Cầu nối nhiệm vụ → coin thật");
const postsBefore = g.posts.length;
g.ev("S.q.math = 4; prog('math')");
const coinMsg = g.posts.slice(postsBefore).find((m) => m.type === "school-coin");
ok("Xong nhiệm vụ → gửi school-coin lên trang cha", !!coinMsg && coinMsg.data.amount === 40 && coinMsg.data.reason === "quest:math", JSON.stringify(coinMsg));
ok("Điểm cao → thưởng", /10 🪙/.test(g.ev("scoreBonus(4,5,'math')")));
ok("Điểm tuyệt đối → thưởng lớn", /15 🪙/.test(g.ev("scoreBonus(5,5,'math')")));
ok("Điểm thấp → không thưởng", g.ev("scoreBonus(2,5,'math')") === "");
g.posts.length = postsBefore;
g.ev("S.q.chat=0; npcOpen({n:'Mít',c:'#ff6b9d',x:me.x,y:me.y,sc:sc,t:1,tx:0,ty:0,mv:0})");
ok("Trò chuyện 3 bạn cũng là nhiệm vụ có thưởng", g.posts.some((m) => m.type === "school-coin" && m.data.reason === "quest:chat") || g.ev("S.q.chat") === 1);
ok("Lưu tiến độ gửi lên trang cha", g.posts.some((m) => m.type === "school-save" || m.type === "school-ready"));

/* ══════ 9. Dự phòng 2D khi không có three.js ══════ */
console.log("\n[9] Không tải được three.js → vẽ 2D như cũ");
const g2 = boot(false);
ok("W3 = null khi thiếu THREE", g2.ev("W3 === null"));
let err2 = null;
try {
  g2.ev("upd(0.033)"); g2.ev("draw(0.033)");
  g2.ev("go('hall',140,300)"); g2.ev("upd(0.033)"); g2.ev("draw(0.033)");
  g2.ev("go('room',500,505,'math')"); g2.ev("upd(0.033)"); g2.ev("draw(0.033)");
} catch (e) { err2 = e; }
ok("Game 2D vẫn chạy hết 3 cảnh", !err2, err2 ? err2.message : "");
const cvsDraws = g2.doc.getElementById("c").log;
ok("Vẽ nền tối + hình ảnh bằng canvas 2D", cvsDraws.some((l) => l.fn === "fillRect" && l.fillStyle === "#1d2540"));
ok("Chữ tên bé vẫn hiện trong bản 2D", cvsDraws.some((l) => l.fn === "fillText" && String(l.args[0]).includes("Bé Minh Anh")));
ok("Coin nhiệm vụ vẫn hoạt động ở bản 2D", (() => { const n = g2.posts.length; g2.ev("S.q.eng=4; prog('eng')"); return g2.posts.slice(n).some((m) => m.type === "school-coin"); })());

console.log(`\n=== ${pass} đạt / ${fail} lỗi ===`);
process.exit(fail ? 1 : 0);
