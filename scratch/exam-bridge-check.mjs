/**
 * exam-bridge-check.mjs — kiểm chứng HỢP ĐỒNG TÍCH HỢP của một MẪU ĐỀ THI HTML
 * mà không cần trình duyệt: chạy script của file đề thi trong `vm` với DOM/canvas
 * giả lập, điều khiển đồng hồ ảo, và ghi lại toàn bộ postMessage hai chiều.
 *
 * Mô phỏng đúng những gì ExamPlayer.jsx + injectAnswerBridge.js làm:
 *   iframe → cha : ready / answer-recorded / game-over / exam-done
 *   cha → iframe : init {questions, playerName, title} / graded / time-up
 *
 * Dùng:  node scratch/exam-bridge-check.mjs [file.html ...]
 * (mặc định chạy cả 4 mẫu đã đăng ký trong templates.js)
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { injectAnswerBridge } from "../src/games/_shared/injectAnswerBridge.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const EXAM_DIR = path.join(ROOT, "src/games/examination");

const QUESTIONS = [
  { id: "q1", content: "2 + 2 bằng mấy?", inputMode: "single_choice", points: 3, timeLimit: 10,
    options: [{ id: "a", content: "3" }, { id: "b", content: "4" }, { id: "c", content: "5" }] },
  { id: "q2", content: "Chọn động vật biết bay", inputMode: "multiple", points: 2, timeLimit: 10,
    options: [{ id: "x", content: "Chim" }, { id: "y", content: "Cá" }, { id: "z", content: "Bướm" }] },
  { id: "q3", content: "Thủ đô của Việt Nam?", inputMode: "text", points: 2, timeLimit: 10 },
  { id: "q4", content: "Câu sẽ bị bỏ qua (hết giờ)", inputMode: "single_choice", points: 3, timeLimit: 8,
    options: [{ id: "a", content: "A" }, { id: "b", content: "B" }] },
  { id: "q5", content: "Câu cuối", inputMode: "single_choice", points: 5, timeLimit: 10,
    options: [{ id: "a", content: "A" }, { id: "b", content: "B" }] },
];

/* Đề "lạ" giáo viên có thể giao: thiếu inputMode/timeLimit/points, nhiều phương án,
   câu tự luận — đường code phải chịu được. */
const ODD_QUESTIONS = [
  { id: "o1", content: "Có bao nhiêu cách xếp 6 bạn thành một hàng?",
    options: ["a", "b", "c", "d", "e", "f"].map((k) => ({ id: k, content: "Phương án " + k.toUpperCase() })) },
  { id: "o2", content: "Viết cảm nhận của em về bài học", inputMode: "essay" },
];

/* ---------------- DOM giả ---------------- */
let OPS = [];          // ctx ops đã vẽ, để soi NaN
let NAN_ARGS = 0;
const NAN_OPS = new Set();
const B = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
const COORD_OPS = new Set(["arc", "ellipse", "fillText", "moveTo", "lineTo", "fillRect", "strokeRect", "translate"]);
function noteBox(k, args) {
  if (!COORD_OPS.has(k)) return;
  const [x, y] = args;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  B.x0 = Math.min(B.x0, x); B.y0 = Math.min(B.y0, y);
  B.x1 = Math.max(B.x1, x + (k === "fillRect" || k === "strokeRect" ? args[2] || 0 : 0));
  B.y1 = Math.max(B.y1, y + (k === "fillRect" || k === "strokeRect" ? args[3] || 0 : 0));
}
function resetBox() { B.x0 = B.y0 = 1e9; B.x1 = B.y1 = -1e9; }
function boxLabel(w, h) {
  if (B.x1 < B.x0) return "không có nét vẽ";
  const out = [];
  if (B.x0 < -12) out.push("tràn trái " + Math.round(B.x0));
  if (B.x1 > w + 12) out.push("tràn phải " + Math.round(B.x1 - w));
  if (B.y0 < -4) out.push("tràn trên " + Math.round(B.y0));
  if (B.y1 > h + 4) out.push("tràn dưới " + Math.round(B.y1 - h));
  return `x[${Math.round(B.x0)}..${Math.round(B.x1)}] y[${Math.round(B.y0)}..${Math.round(B.y1)}] trên ${w}×${h} · ${out.length ? out.join(", ") : "nằm trong khung"}`;
}
function makeCtx() {
  const target = {};
  return new Proxy(target, {
    get(t, k) {
      if (k === "canvas") return { width: 0, height: 0 };
      if (k === "measureText") return () => ({ width: 10 });
      if (k === "createLinearGradient" || k === "createRadialGradient")
        return () => ({ addColorStop() {} });
      if (k in t) return t[k];
      return (...args) => {
        OPS.push([String(k), args]);
        noteBox(String(k), args);
        for (const a of args) if (typeof a === "number" && !Number.isFinite(a)) {
          NAN_ARGS++;
          NAN_OPS.add(String(k) + "(" + args.map((x) => (typeof x === "number" ? x : "•")).join(",") + ")");
        }
        return undefined;
      };
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}

function makeEl(id) {
  const cls = new Set();
  const e = {
    id, _html: "", _text: "", _value: "", style: {}, dataset: {}, children: [], _ls: {},
    disabled: true, clientWidth: 600, clientHeight: 196, width: 0, height: 0,
    classList: {
      add: (...c) => c.forEach((x) => cls.add(x)),
      remove: (...c) => c.forEach((x) => cls.delete(x)),
      toggle: (c, f) => { const on = f === undefined ? !cls.has(c) : !!f; on ? cls.add(c) : cls.delete(c); return on; },
      contains: (c) => cls.has(c),
    },
    get className() { return [...cls].join(" "); },
    set className(v) { cls.clear(); String(v).split(/\s+/).filter(Boolean).forEach((x) => cls.add(x)); },
    get innerHTML() { return e._html; },
    set innerHTML(v) {
      e._html = String(v);
      /* id sinh động trong innerHTML (điểm, hạng, danh sách…) cũng phải được
         ghi nhận để bộ kiểm tra không báo nhầm thành selector sai */
      for (const m of e._html.matchAll(/id="([^"]+)"/g)) SEED.ids.add(m[1]);
      e.children = parseOpts(e._html, e);
    },
    get textContent() { return e._text; },
    set textContent(v) { e._text = String(v); },
    get value() { return e._value; },
    set value(v) { e._value = String(v); },
    addEventListener(t, f) { (e._ls[t] = e._ls[t] || []).push(f); },
    focus() {},
    closest(sel) { return cls.has("opt") && sel === ".opt" ? e : null; },
    getContext() { return e._ctx || (e._ctx = makeCtx()); },
    getBoundingClientRect() { return { width: e.clientWidth, height: e.clientHeight, top: 0, left: 0 }; },
    click() {
      const ev = { target: e, key: "Enter", preventDefault() {}, stopPropagation() {} };
      if (typeof e.onclick === "function") e.onclick(ev);
      let p = e._parent;
      while (p) { (p._ls.click || []).forEach((f) => f(ev)); p = p._parent; }
    },
  };
  return e;
}
function parseOpts(html, parent) {
  const out = [];
  const re = /class="opt([^"]*)"\s+data-id="([^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    const c = makeEl("opt:" + m[2]);
    c.className = "opt" + m[1];
    c.dataset.id = m[2];
    c._parent = parent;
    out.push(c);
  }
  return out;
}

/* Seed từ HTML thật: tập id có thật + class ban đầu của từng id.
   Stub TỰ TẠO phần tử khi selector không tìm thấy (khác trình duyệt), nên nhờ
   seed này mà selector sai chính tả vẫn bị phát hiện ở bước kiểm tra cuối. */
let SEED = { ids: new Set(), cls: {} };
const MISSING = new Set();

function makeDoc() {
  const store = new Map();
  const doc = {
    readyState: "complete", hidden: false, _ls: {},
    createElement: (t) => makeEl("<" + t + ">"),
    getElementById: (id) => doc.querySelector("#" + id),
    querySelector(sel) {
      if (sel[0] !== "#") {
        const els = doc.querySelectorAll(sel);
        return els[0] || null;
      }
      const id = sel.slice(1).split(/\s+/)[0];
      if (SEED.ids.size && !SEED.ids.has(id)) MISSING.add(sel);
      if (!store.has(id)) {
        const e = makeEl(id);
        if (SEED.cls[id]) e.className = SEED.cls[id];
        store.set(id, e);
      }
      return store.get(id);
    },
    querySelectorAll(sel) {
      const parts = sel.split(".").filter(Boolean);   // '.opt.sel' → ['opt','sel']
      let list = [];
      for (const el of store.values()) list = list.concat(el.children);
      list = list.filter((el) => parts.every((c) => el.classList.contains(c)));
      return list;
    },
    addEventListener(t, f) { (doc._ls[t] = doc._ls[t] || []).push(f); },
    _store: store,
  };
  return doc;
}

/* ---------------- sandbox + đồng hồ ảo ---------------- */
function makeSandbox() {
  const RD = Date;
  let now = 1000;
  const timers = [];
  const frames = [];
  let tid = 1;
  const messages = [];

  const sandbox = {};
  const win = {
    postMessage: (m) => { messages.push(m); },
    addEventListener: (t, f) => { (win._ls[t] = win._ls[t] || []).push(f); },
    _ls: {},
  };
  const doc = makeDoc();
  const ctx = {
    window: win, document: doc, console,
    devicePixelRatio: 2, innerWidth: 400, innerHeight: 800,
    scrollTo() {},
    addEventListener: win.addEventListener,
    requestAnimationFrame: (cb) => { frames.push(cb); return frames.length; },
    setTimeout: (fn, ms) => { const id = tid++; timers.push({ id, at: now + (ms || 0), fn, iv: 0 }); return id; },
    setInterval: (fn, ms) => { const id = tid++; timers.push({ id, at: now + (ms || 0), fn, iv: ms || 1 }); return id; },
    clearTimeout: (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); },
    clearInterval: (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); },
    Date: new Proxy(RD, {
      construct: (t, a) => new t(...a),
      get: (t, p) => (p === "now" ? () => now : Reflect.get(t, p)),
      apply: () => new RD().toString(),
    }),
  };
  win.parent = win;
  win.self = win; win.top = win;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  Object.assign(sandbox, ctx);

  return {
    sandbox, messages, win, doc,
    now: () => now,
    /** tiến `ms` giờ ảo, bắn timer đúng thứ tự rồi chạy 1 khung hình */
    advance(ms, step = 50) {
      const end = now + ms;
      let guard = 0;
      while (guard++ < 20000) {
        const due = timers.filter((t) => t.at <= end).sort((a, b) => a.at - b.at);
        if (!due.length) break;
        now = Math.max(now, due[0].at);
        for (const t of timers.filter((x) => x.at === now)) {
          if (t.iv) t.at = now + t.iv;
          else { const i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); }
          t.fn();
        }
      }
      now = end;
      const cbs = frames.splice(0, frames.length);
      for (const cb of cbs) cb(now);
      void step;
    },
    frames: (n) => { for (let i = 0; i < n; i++) { now += 16; frames.splice(0, frames.length).forEach((cb) => cb(now)); } },
    fireWin: (t, ev) => (win._ls[t] || []).forEach((f) => f(ev)),
    el: (id) => doc.querySelector("#" + id),
  };
}

/* ---------------- bộ chạy đề thi ---------------- */
/** Đọc id + class có thật trong HTML để stub không "cho qua" selector sai chính tả. */
function seedFrom(html) {
  const ids = new Set(), cls = {};
  for (const m of html.matchAll(/<(\w+)([^>]*)>/g)) {
    const id = /\bid="([^"]+)"/.exec(m[2]);
    if (!id) continue;
    ids.add(id[1]);
    const c = /\bclass="([^"]+)"/.exec(m[2]);
    if (c) cls[id[1]] = c[1];
  }
  return { ids, cls };
}
function loadTemplate(file) {
  const raw = fs.readFileSync(file, "utf8");
  const injected = injectAnswerBridge(raw);
  const scripts = [...injected.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  SEED = seedFrom(raw);
  const H = makeSandbox();
  /* chiều cao sân khấu thật (CSS) để hình học trong drawScene đúng như trên điện thoại */
  const cssH = /#cv\{[^}]*height:(\d+)px/.exec(raw);
  H.stageH = cssH ? +cssH[1] : 196;
  H.doc.querySelector("#cv").clientHeight = H.stageH;
  H.doc.querySelector("#cv").clientWidth = 366;   // chiều rộng khung iframe trên iPhone SE

  /* script bridge được chèn SAU script game (ExamPlayer chèn trước </body>),
     nên game phải tự thử lại markReady — đúng như thứ tự thật. */
  scripts.forEach((src, i) => {
    vm.runInContext(src, H.sandbox, { filename: path.basename(file) + "#script" + i });
  });
  /* export hàm nội bộ (top-level const/let không dính vào global) */
  vm.runInContext(
    "globalThis.__T={applyQuestions,renderQ,finishQ,collect,A,Q,submitToHost,reveal,openReview,resetRun,tower,SC,isTextMode,isMulti,valueOf," +
    "headXY:typeof headXY!=='undefined'?headXY:null,baseXY:typeof baseXY!=='undefined'?baseXY:null," +
    "trainXY:typeof trainXY!=='undefined'?trainXY:null,staX:typeof staX!=='undefined'?staX:null};",
    H.sandbox
  );
  return H;
}

const seen = (H, type) => H.messages.filter((m) => m.type === type);
const checks = [];
function ok(cond, label, extra = "") {
  checks.push({ pass: !!cond, label, extra });
  console.log(`  ${cond ? "OK  " : "FAIL"} ${label}${cond ? "" : "  → " + extra}`);
}

function runOne(file, { score = 7, max = 15 } = {}) {
  const name = path.basename(file);
  console.log(`\n=== ${name} ===`);
  MISSING.clear();
  let H;
  try { H = loadTemplate(file); }
  catch (e) { ok(false, "chạy được script", e.message); return H; }

  /* 1) bridge phải báo ready mà không cần ai gọi */
  H.advance(400);
  ok(seen(H, "ready").length >= 1, "iframe báo 'ready' lên frame cha", JSON.stringify(H.messages));

  /* 2) init rỗng → phải chặn nút bắt đầu, không crash */
  H.fireWin("message", { data: { type: "init", data: { questions: [] } } });
  ok(H.el("btnStart").disabled === true, "không có câu hỏi → nút bắt đầu bị khoá");

  /* 3) init thật */
  H.fireWin("message", {
    data: { type: "init", data: { questions: QUESTIONS, playerName: "Bạn Học Sinh", title: "Kiểm tra 15 phút" } },
  });
  ok(H.el("btnStart").disabled === false, "có câu hỏi → nút bắt đầu bật");
  ok(H.el("name").value === "Bạn Học Sinh", "nhận playerName từ frame cha");
  ok(/Kiểm tra 15 phút/.test(H.el("examTitle").textContent), "nhận title từ frame cha");
  ok(H.el("stQ").textContent === String(QUESTIONS.length), "đếm đủ số câu", String(H.el("stQ").textContent));
  ok(H.el("stP").textContent === "15", "cộng đúng điểm tối đa", String(H.el("stP").textContent));

  /* 4) vào trận */
  H.el("btnStart").click();
  ok(!H.el("s-quiz").classList.contains("hide"), "chuyển sang màn làm bài");
  const opts = () => H.doc.querySelectorAll(".opt");
  ok(opts().length === 3, "câu 1 render 3 phương án", String(opts().length));

  /* 5) câu 1: chọn B rồi chốt → answer-recorded với value là id */
  opts()[1].click();
  H.el("btnNext").click();
  H.advance(1600);
  let ar = seen(H, "answer-recorded");
  ok(ar.length === 1 && ar[0].data.questionId === "q1" && ar[0].data.value === "b",
    "gửi lên 'answer-recorded' {questionId:'q1', value:'b'}", JSON.stringify(ar));

  /* 6) câu 2 (multiple): chọn 2 phương án → value nối bằng dấu phẩy */
  ok(opts().every((o) => o.classList.contains("multi")), "câu nhiều đáp án hiện ô multi");
  opts()[0].click(); opts()[2].click();
  H.el("btnNext").click();
  H.advance(1600);
  ar = seen(H, "answer-recorded");
  ok(ar.length === 2 && ar[1].data.value === "x,z", "nhiều đáp án → value 'x,z'", JSON.stringify(ar[1]));

  /* 7) câu 3: tự luận → value là text */
  ok(H.el("txtWrap").classList.contains("hide") === false, "câu tự luận hiện ô nhập");
  H.el("txtIn").value = "  Hà Nội  ";
  H.el("btnNext").click();
  H.advance(1600);
  ar = seen(H, "answer-recorded");
  ok(ar.length === 3 && ar[2].data.value === "Hà Nội", "tự luận → value đã cắt khoảng trắng", JSON.stringify(ar[2]));

  /* 8) câu 4: KHÔNG trả lời, để hết giờ → value null, vẫn sang câu sau */
  H.advance(9000);
  ar = seen(H, "answer-recorded");
  ok(ar.length === 4 && ar[3].data.questionId === "q4" && ar[3].data.value === null,
    "hết giờ vẫn ghi nhận câu (value null)", JSON.stringify(ar[3]));

  /* 9) câu cuối → màn kiểm tra */
  H.advance(2000);
  opts()[0].click();
  H.el("btnNext").click();
  H.advance(1800);
  ok(!H.el("s-review").classList.contains("hide"), "xong câu cuối → màn rà soát");
  ok(/Chưa trả lời/.test(H.el("rvList").innerHTML) && /Hà Nội/.test(H.el("rvList").innerHTML),
    "danh sách rà soát hiện cả câu bỏ trống", H.el("rvList").innerHTML.slice(0, 80));

  /* 9b) cha báo time-up lúc ĐÃ nộp → không được gửi trùng game-over (đếm sau bước 10) */

  /* 10) nộp bài → game-over mang đủ 5 đáp án + totalQuestions */
  H.el("btnSubmit").click();
  const go = seen(H, "game-over");
  ok(go.length === 1, "nộp bài → gửi 'game-over'", String(go.length));
  const d = go[0]?.data || {};
  ok(Array.isArray(d.answers) && d.answers.length === 5, "game-over chứa 5 answers", JSON.stringify(d.answers));
  ok(d.answers.map((a) => a.questionId).join(",") === "q1,q2,q3,q4,q5", "đáp án theo đúng thứ tự câu",
    d.answers.map((a) => a.questionId).join(","));
  ok(d.answers[3].value === null && d.answers[0].value === "b" && d.answers[2].value === "Hà Nội",
    "giá trị từng câu đúng", JSON.stringify(d.answers));
  ok(d.totalQuestions === 5 && typeof d.timeUsed === "number", "kèm totalQuestions + timeUsed", JSON.stringify({ t: d.totalQuestions, u: d.timeUsed }));
  ok(d.answers.every((a) => typeof a.timeSpent === "number"), "mỗi câu có timeSpent", JSON.stringify(d.answers.map((a) => a.timeSpent)));
  const goCount = go.length;   // đã nộp 1 lần; mọi lần time-up sau đó không được gửi thêm


  /* 11) server chấm → graded {score,max} → animation chạy → exam-done */
  H.fireWin("message", { data: { type: "graded", data: { score, max } } });
  let waited = 0;
  while (!seen(H, "exam-done").length && waited < 20000) { H.advance(500); waited += 500; }
  ok(seen(H, "exam-done").length >= 1, "chạy xong tiết lộ điểm → báo 'exam-done'", `đợi ${waited}ms ảo`);
  ok(!H.el("s-result").classList.contains("hide"), "màn kết quả hiện ra");
  ok(H.el("cnt").textContent === String(score), "điểm hiển thị = điểm server, không tự tính",
    H.el("cnt").textContent);
  H.advance(3000);

  /* 12) cha bấm time-up MUỘN (đã nộp xong) → không gửi trùng */
  ok(seen(H, "game-over").length === goCount, "time-up sau khi đã nộp → không gửi game-over trùng",
    String(seen(H, "game-over").length));

  /* 13) vẽ không sinh NaN */
  H.frames(30);

  /* 13b) đối tượng chính của cảnh phải nằm trong khung sân khấu (366 × stageH) */
  const T = H.sandbox.__T;
  if (T.headXY && T.baseXY) {
    const [bx, by] = T.baseXY(), [hx, hy] = T.headXY();
    ok(bx > 0 && bx < 366 && by > 0 && by < H.stageH, "vườn: gốc cây trong khung", JSON.stringify([bx, by]));
    ok(hx > 20 && hx < 346 && hy > H.stageH * .12 && hy < H.stageH * .6, "vườn: ngọn cây (bông hoa) trong khung",
      JSON.stringify([Math.round(hx), Math.round(hy)]));
  }
  if (T.trainXY) {
    const [tx, ty] = T.trainXY();
    ok(ty > 0 && ty < H.stageH, "tàu: thân tàu trên mặt đất", String(Math.round(ty)));
    ok(tx - 46 - 5 * 35 >= -2, "tàu: nối đủ 5 toa vẫn không tràn mép trái", String(Math.round(tx - 46 - 175)));
    ok(tx + 28 <= 364, "tàu: đầu tàu không tràn mép phải", String(Math.round(tx + 28)));
    const near = Math.round(T.SC.pos);   // ga tàu đang đậu
    ok(Math.abs(T.staX(T.SC.pos) - 366 * .62) < 1, "tàu: ga luôn canh đúng dưới đầu tàu (ANCHOR = staX)",
      `ga @ ${Math.round(T.staX(T.SC.pos))}, đầu tàu @ ${Math.round(366 * .62)}`);
    ok(T.staX(near) <= 366 + 220, "tàu: ga kế tiếp nằm trong tầm một màn hình",
      String(Math.round(T.staX(near))));
  }

  /* 14) luồng dự phòng: cha hết giờ LÚC ĐANG làm bài → iframe phải tự nộp */
  const H2 = loadTemplate(file);
  H2.advance(400);
  H2.fireWin("message", { data: { type: "init", data: { questions: QUESTIONS, playerName: "A", title: "T" } } });
  H2.el("btnStart").click();
  H2.doc.querySelectorAll(".opt")[1].click();
  H2.el("btnNext").click();
  H2.advance(1600);
  H2.fireWin("message", { data: { type: "time-up", data: {} } });
  const go2 = seen(H2, "game-over");
  ok(go2.length === 1, "time-up lúc đang làm → tự nộp ngay", String(go2.length));
  ok(go2[0]?.data?.answers?.length === 5 && go2[0].data.answers[0].value === "b",
    "bài nộp khẩn có đủ 5 câu, câu đã làm giữ nguyên đáp án",
    JSON.stringify(go2[0]?.data?.answers));
  H2.fireWin("message", { data: { type: "graded", data: { score: 3, max: 15 } } });
  let w2 = 0;
  while (!seen(H2, "exam-done").length && w2 < 20000) { H2.advance(500); w2 += 500; }
  H2.frames(40);
  ok(seen(H2, "exam-done").length >= 1, "nộp khẩn xong vẫn báo 'exam-done'", `đợi ${w2}ms ảo`);

  /* 15) đề "lạ": 6 phương án, thiếu timeLimit/points, câu tự luận bỏ trống,
         server trả graded rỗng → không crash, không NaN, vẫn báo exam-done */
  const H3 = loadTemplate(file);
  H3.advance(400);
  H3.fireWin("message", { data: { type: "init", data: { questions: ODD_QUESTIONS, playerName: "", title: "" } } });
  ok(H3.el("stP").textContent === "0", "thiếu points → tổng điểm 0, không NaN", String(H3.el("stP").textContent));
  ok(H3.el("stT").textContent === "60", "thiếu timeLimit → mặc định 30s/câu", String(H3.el("stT").textContent));
  ok(H3.el("s-quiz").classList.contains("hide"), "lúc đầu màn làm bài đang ẩn");
  H3.el("btnStart").click();
  ok(H3.el("s-quiz").classList.contains("hide"), "chưa nhập tên → chưa cho vào làm bài");
  H3.el("name").value = "Bé Tester";
  H3.el("btnStart").click();
  ok(!H3.el("s-quiz").classList.contains("hide"), "có tên → vào làm bài");
  ok(H3.doc.querySelectorAll(".opt").length === 6, "câu 6 phương án render đủ", String(H3.doc.querySelectorAll(".opt").length));
  H3.doc.querySelectorAll(".opt")[5].click();
  H3.el("btnNext").click();
  H3.advance(1600);
  H3.el("btnNext").click();                       // câu tự luận bỏ trống
  H3.advance(1600);
  ok(!H3.el("s-review").classList.contains("hide"), "đề lạ vẫn đi tới màn rà soát");
  H3.el("btnSubmit").click();
  const go3 = seen(H3, "game-over");
  ok(go3[0]?.data?.answers.map((a) => String(a.value)).join("|") === "f|null",
    "đề lạ: câu chọn = 'f', câu trống = null", JSON.stringify(go3[0]?.data?.answers));
  H3.fireWin("message", { data: { type: "graded", data: {} } });   // server không gửi score/max
  let w3 = 0;
  while (!seen(H3, "exam-done").length && w3 < 20000) { H3.advance(500); w3 += 500; }
  ok(seen(H3, "exam-done").length >= 1, "graded rỗng → vẫn chạy hết và báo 'exam-done'", `đợi ${w3}ms ảo`);
  ok(H3.el("cnt").textContent === "0", "graded rỗng → hiện 0 điểm, không NaN", H3.el("cnt").textContent);
  H3.frames(40);

  ok(MISSING.size === 0, "mọi selector '#id' trong script có thật trong HTML", [...MISSING].join(", "));
  ok(NAN_ARGS === 0, "canvas không nhận toạ độ NaN", NAN_ARGS + " · " + [...NAN_OPS].slice(0, 6).join(" | "));
  console.log(`  (${OPS.length} lệnh vẽ · ` + boxLabel(366, H.stageH) + " — phần tràn là nền tô rộng, canvas tự cắt)");
  OPS = []; NAN_ARGS = 0; NAN_OPS.clear(); resetBox();
  return H;
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => path.join(EXAM_DIR, f))
  : ["thithap.html", "vuon-trithuc.html", "chuyen-tau-trithuc.html"].map((f) => path.join(EXAM_DIR, f));

for (const f of files) {
  try { runOne(f); }
  catch (e) { ok(false, "không ném lỗi khi chạy", (e && e.stack || "").split("\n").slice(0, 4).join(" | ")); }
}

const bad = checks.filter((c) => !c.pass);
console.log(`\n----- ${checks.length - bad.length}/${checks.length} kiểm tra đạt -----`);
process.exitCode = bad.length ? 1 : 0;
