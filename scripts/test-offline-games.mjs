import fs from "node:fs";
import vm from "node:vm";

// ── Tokenizer theo đúng ngữ nghĩa HTML parser ───────────────────────────────
const strip = (h) => h.replace(/<!--[\s\S]*?-->/g, "");
function blocks(html) {
  const s = strip(html), out = [];
  let i = 0;
  while (true) {
    const o = s.indexOf("<" + "script", i); if (o === -1) break;
    const g = s.indexOf(">", o), attrs = s.slice(o + 7, g);
    const c = s.indexOf("</" + "script>", g); if (c === -1) break;
    out.push({ attrs, body: s.slice(g + 1, c) }); i = c + 9;
  }
  return out;
}

// ── DOM stub ────────────────────────────────────────────────────────────────
function makeCtx2d() {
  const noop = () => {};
  const c = new Proxy({}, {
    get: (t, k) => {
      if (k in t) return t[k];
      if (k === "canvas") return { width: 300, height: 300 };
      if (k === "measureText") return () => ({ width: 42 });
      if (k === "createLinearGradient") return () => ({ addColorStop: noop });
      if (k === "getImageData") return () => ({ data: new Uint8ClampedArray(4) });
      return noop;                       // moveTo, arc, fillRect, fillText, ...
    },
    set: (t, k, v) => { t[k] = v; return true; },
  });
  return c;
}

function makeDom() {
  const reg = new Map();
  const parseOpts = (html) => {
    const out = [];
    for (const m of String(html).matchAll(/<button[^>]*class="opt"[^>]*data-k="(\d)"[^>]*>([\s\S]*?)<\/button>/g)) {
      const n = mk("opt" + m[1]);
      n.dataset.k = m[1]; n._html = m[2]; n.textContent = m[2].replace(/<[^>]+>/g, "");
      n.classList.add("opt");
      out.push(n);
    }
    return out;
  };
  const mk = (key = "?") => ({
    _key: key, _html: "", textContent: "", value: "", hidden: false,
    dataset: {}, children: [], attrs: {}, width: 300, height: 300, clientWidth: 300, clientHeight: 300,
    offsetWidth: 300, offsetHeight: 30, style: new Proxy({}, { set: () => true, get: () => "" }),
    classList: { _s: new Set(),
      add(...c) { c.forEach((x) => this._s.add(x)); }, remove(...c) { c.forEach((x) => this._s.delete(x)); },
      toggle(c, v) { v === undefined ? (this._s.has(c) ? this._s.delete(c) : this._s.add(c)) : (v ? this._s.add(c) : this._s.delete(c)); },
      contains(c) { return this._s.has(c); } },
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = String(v); },
    appendChild(c) { this.children.push(c); return c; },
    append(...c) { this.children.push(...c); this._html += c.map((x) => x._html).join(""); },
    prepend(c) { this.children.unshift(c); },
    insertAdjacentHTML(_, v) { this._html += v; },
    remove() {}, setAttribute(k, v) { this.attrs[k] = v; },
    getAttribute(k) { return this.attrs[k] ?? null; }, hasAttribute() { return false; },
    addEventListener() {}, removeEventListener() {},
    querySelector: (s) => api.get(s),
    querySelectorAll: function () { return parseOpts(this._html); },
    closest: () => null, focus() {}, blur() {}, scrollIntoView() {},
    contains: () => false, cloneNode: () => mk(key), removeChild() {},
    getContext: () => makeCtx2d(),
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 300, height: 300, right: 300, bottom: 300 }),
    requestAnimationFrame: () => 0, ontouchstart: null, ontouchend: null, onclick: null,
  });
  const api = {
    _reg: reg,
    get(sel) { const k = String(sel); if (!reg.has(k)) reg.set(k, mk(k)); return reg.get(k); },
    getElementById: (id) => api.get("#" + id), querySelector: (s) => api.get(s), querySelectorAll: () => [],
    createElement: (t) => mk("<" + t + ">"), createTextNode: (t) => ({ textContent: t }),
    createDocumentFragment: () => mk("frag"), body: mk("body"), documentElement: mk("html"),
    addEventListener() {}, removeEventListener() {}, readyState: "complete",
  };
  return api;
}

function boot(html, savedMap) {
  const doc = makeDom();
  const saved = savedMap || new Map();
  const store = {
    getItem: (k) => (saved.has(k) ? saved.get(k) : null),
    setItem: (k, v) => saved.set(k, String(v)),
    removeItem: (k) => saved.delete(k), key: () => null, length: 0, clear: () => saved.clear(),
  };
  const posted = [];
  const sandbox = {
    document: doc, console,
    Math, JSON, Date, Number, Array, Object, String, Set, Map, Boolean, RegExp, Error, Promise,
    isFinite, parseInt, parseFloat, encodeURIComponent, decodeURIComponent, Infinity, NaN,
    localStorage: store, sessionStorage: store,
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    requestAnimationFrame: () => 0,
    fetch: async () => ({ ok: false, status: 503, json: async () => ({}) }),
    location: { hash: "", origin: "https://x", href: "https://x" }, history: { replaceState() {} },
    performance: { now: () => 0 }, addEventListener() {}, scrollTo() {},
    speechSynthesis: { cancel() {} }, Image: function () {}, innerWidth: 800, innerHeight: 600,
    parent: { postMessage: (m) => posted.push(m) },
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  sandbox.parent = sandbox.parent;      // parent !== window → giống iframe thật
  vm.createContext(sandbox);

  let err = null;
  for (const b of blocks(html)) {
    try { vm.runInContext(b.body, sandbox, { filename: "game" }); }
    catch (e) { if (!err) err = e; }
  }
  return { doc, sandbox, saved, posted, err };
}

// ── Test ────────────────────────────────────────────────────────────────────
const manifest = fs.readFileSync("src/games/src/manifest.js", "utf8");
const entries = [...manifest.matchAll(/\{ id: '([^']+)', name: '([^']+)', icon: '([^']*)', tag: '([^']+)', grad: '([^']+)', engine: '([^']+)'/g)]
  .map((m) => ({ id: m[1], name: m[2], icon: m[3], tag: m[4], grad: m[5], engine: m[6] }));

if (entries.length !== 18) { console.log(`✖ manifest có ${entries.length} game, mong đợi 18`); process.exit(1); }

let bad = 0;
const ok = (c, m) => { if (!c) { bad++; console.log("   ✖ " + m); } };

console.log(`=== Test ${entries.length} game offline ===\n`);
console.log("id".padEnd(12) + "KB    block  ext  boot  #game  stage  tiến độ        kết quả");
console.log("-".repeat(86));

for (const e of entries) {
  const file = `src/games/offline/${e.id}.html`;
  const html = fs.readFileSync(file, "utf8");
  const bs = blocks(html);

  // 1. Cấu trúc
  let jsBad = 0;
  for (const b of bs) {
    if (/type=["']application\/json["']/i.test(b.attrs)) continue;
    try { new vm.Script(b.body, { filename: e.id }); } catch { jsBad++; }
  }
  const ext = bs.filter((b) => /\bsrc\s*=/.test(b.attrs)).length;

  if (e.engine === "standalone") {
    const pass = jsBad === 0 && ext === 0 && !/\bGameAPI\b|GAME_API_BASE|educational-games-lp4z\.onrender\.com/.test(html)
      && html.includes("localStorage")
      && html.includes("vuon-thu-ho-run-v1") && html.includes("resumeSavedBtn");
    if (!pass) console.log(`   ${e.id}: jsLoi=${jsBad} ext=${ext} standalone HTML chưa độc lập/localStorage/API-free`);
    ok(pass, e.id);
    console.log(e.id.padEnd(12) + (Buffer.byteLength(html) / 1024).toFixed(0).padStart(3) + "KB standalone      " + (pass ? "✓" : "✖"));
    continue;
  }

  // 2. Boot
  const a = boot(html);
  const stage = a.doc.get("#stage")._html;
  const gameVisible = a.doc.get("#game").hidden === false;
  const hubHidden = a.doc.get("#hub").hidden === true;
  const title = a.doc.get("#gt").textContent;
  const hasReady = a.posted.some((m) => m.type === "ready");
  let localRunStorageOK = false;
  try {
    a.sandbox.saveOfflineRun("__probe", { level: 3, round: 4 });
    localRunStorageOK = a.sandbox.loadOfflineRun("__probe")?.round === 4;
    a.sandbox.clearOfflineRun("__probe");
  } catch { /* reported by progressOK below */ }

  // 3. Tiến độ: XP/điểm tốt nhất nằm ở key offline_<id> (single) hoặc offline_<id>_progress (mc)
  const keys = [...a.saved.keys()];
  const progKey = keys.find((k) => k.endsWith("_progress"));
  const hasOpts = /class="opt"/.test(stage);

  let progressOK = false;
  let answered = 0;
  let detail = "";

  if (e.engine === "mc") {
    // 3a. Ván mới: phải ghi tiến độ ngay khi vào game, và KHÔNG báo khôi phục
    progressOK = !!progKey && /class="opt"/.test(stage) && !/Đã khôi phục tiến độ/.test(stage);
    if (!progressOK) detail = `fresh: progKey=${!!progKey} opts=${/class="opt"/.test(stage)} banner=${/Đã khôi phục/.test(stage)}`;

    // 3b. Chơi thật: seed nhiều mạng để ván không kết thúc khi trả lời sai
    if (progressOK) {
      const pkey = `offline_${e.id}_progress`;
      const seeded = new Map([[pkey, JSON.stringify({
        game: e.id, name: e.name, icon: e.icon, level: 1, score: 0,
        correct: 0, answered: 0, lives: 99, updatedAt: Date.now(),
      })]]);
      const b = boot(html, seeded);
      if (b.err) { progressOK = false; detail = "lỗi boot: " + b.err.message; }
      else {
        for (let n = 0; n < 5 && progressOK; n++) {
          const before = JSON.parse(b.saved.get(pkey)).answered;
          const optsEl = b.doc.get("#opts");
          if (typeof optsEl.onclick !== "function") break;
          const btns = b.doc.get("#stage").querySelectorAll(".opt");
          if (!btns.length) break;
          const target = btns[0];
          optsEl.onclick({ target: { dataset: { k: "0" }, closest: (s) => (s === ".opt" ? target : null) } });
          const nx = b.doc.get("#nx");
          if (nx && nx.onclick) nx.onclick({ target: { closest: () => ({}) } });
          answered++;
          const raw = b.saved.get(pkey);
          if (!raw) { progressOK = false; detail = `câu ${n + 1}: tiến độ bị xoá giữa ván`; break; }
          if (JSON.parse(raw).answered <= before) { progressOK = false; detail = `câu ${n + 1}: answered không tăng`; break; }
        }

        // 3c. Khôi phục: mở lại với dữ liệu đã lưu
        if (progressOK && answered > 0) {
          const savedP = JSON.parse(b.saved.get(pkey));
          const b2 = boot(html, new Map(b.saved));
          const st2 = b2.doc.get("#stage")._html;
          if (b2.err) { progressOK = false; detail = "lỗi mở lại: " + b2.err.message; }
          else if (!/Đã khôi phục tiến độ/.test(st2)) { progressOK = false; detail = "mở lại không báo khôi phục"; }
          else if (!new RegExp("Män <b>" + savedP.level + "</b>|Màn <b>" + savedP.level + "</b>").test(st2)) {
            progressOK = false; detail = `khôi phục sai màn (đã lưu màn ${savedP.level})`;
          }
        }
      }
    }
  } else {
    // Game single: renderMe() phải chạy (đọc XP từ localStorage) và bấm Về sảnh phải gửi quit
    const lvlText = a.doc.get("#lvl").textContent;
    const backOk = typeof a.doc.get("#back").onclick === "function";
    progressOK = lvlText && backOk;
    if (!progressOK) detail = `lvl="${lvlText}" back=${backOk}`;
  }

  const pass = jsBad === 0 && ext === 0 && !/\bGameAPI\b|GAME_API_BASE|educational-games-lp4z\.onrender\.com/.test(html)
    && localRunStorageOK && !a.err && gameVisible && hubHidden && stage.length > 0
    && title === e.name && hasReady && progressOK;

  if (!pass) {
    console.log(`   ${e.id}: jsLoi=${jsBad} ext=${ext} err=${a.err ? a.err.message.slice(0, 50) : "-"} ` +
      `gameVisible=${gameVisible} hubHidden=${hubHidden} stageLen=${stage.length} title="${title}" ready=${hasReady}` +
      (detail ? ` | ${detail}` : ""));
  }
  ok(pass, e.id);

  console.log(
    e.id.padEnd(12) +
    (Buffer.byteLength(html) / 1024).toFixed(0).padStart(3) + "KB " +
    String(bs.length).padStart(5) +
    (ext ? "  CÓ" : "   0") +
    (a.err ? "  ✖  " : "  ✓  ") +
    (gameVisible ? "  ✓   " : "  ✖   ") +
    String(stage.length).padStart(6) + "  " +
    (e.engine === "mc" ? `MC ${answered} câu` : "single").padEnd(16) + "  " +
    (pass ? "✓" : "✖")
  );
}

console.log("-".repeat(86));
console.log(bad === 0 ? "✔ Cả 18 game: boot được, render game, có tiến độ cục bộ, không script ngoài/API" : `✖ ${bad} game lỗi`);
process.exit(bad ? 1 : 0);
