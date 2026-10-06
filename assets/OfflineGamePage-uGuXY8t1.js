import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{Tt as r,t as i}from"./index-C30NW2jW.js";var a=e(t(),1),o=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: math — nội dung riêng của file này -->
    <script>
// src/games/src/math.js — Săn Trái Cây

    function mathGame(root) {
      const id = 'math';
      const icons = ['🍓', '🍋', '🍇', '🍉', '🍒', '🍍', '🥝', '🍑'];
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        const target = icons[rnd(0, icons.length - 1)];
        const bubbles = Array.from({ length: 12 }, () => icons[rnd(0, icons.length - 1)]);
        bubbles[rnd(0, bubbles.length - 1)] = target;
        return { score: 0, combo: 0, bestCombo: 0, seconds: 45, target, bubbles };
      }

      function renderIntro() {
        root.innerHTML = \`<div class="panel center"><h2>Săn Trái Cây 🍓</h2>
          <p class="hint">Tìm và chạm thật nhanh vào món ăn đang được gọi. Chơi trong 45 giây!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>\`;
        root.onclick = e => {
          if (!e.target.closest('[data-start]')) return;
          start(fresh());
        };
      }

      function start(state) {
        T.clear();
        const game = state;
        const save = () => saveOfflineRun(id, game);
        const board = () => {
          game.target = icons[rnd(0, icons.length - 1)];
          game.bubbles = Array.from({ length: 12 }, () => icons[rnd(0, icons.length - 1)]);
          game.bubbles[rnd(0, game.bubbles.length - 1)] = game.target;
        };
        function paint() {
          root.innerHTML = \`<div class="hud"><span>⭐ <b>\${game.score}</b></span><span>🔥 \${game.combo} · tốt nhất \${game.bestCombo}</span><span>⏱ <b>\${game.seconds}</b> giây</span></div>
            <div class="qbox">Tìm món này: <span style="font-size:38px">\${game.target}</span></div>
            <div class="opts" style="grid-template-columns:repeat(3,1fr)">\${game.bubbles.map((icon, i) => \`<button class="opt" data-i="\${i}" style="font-size:32px;min-height:70px">\${icon}</button>\`).join('')}</div>\`;
        }
        root.onclick = e => {
          const button = e.target.closest('[data-i]');
          if (!button) return;
          if (game.bubbles[+button.dataset.i] === game.target) {
            game.score += 10 + Math.min(game.combo, 10);
            game.combo++;
            game.bestCombo = Math.max(game.bestCombo, game.combo);
            sfx.ok();
          } else {
            game.combo = 0;
            game.score = Math.max(0, game.score - 3);
            sfx.bad();
          }
          board();
          save();
          paint();
        };
        save();
        paint();
        T.int(() => {
          game.seconds--;
          if (game.seconds <= 0) {
            T.clear();
            clearOfflineRun(id);
            if (game.bestCombo >= 10) S.flags.f10 = true;
            finish({
              id, score: game.score, xp: 0,
              lines: [\`\${game.score} điểm\`, \`Chuỗi tốt nhất: \${game.bestCombo}\`],
              replay: mathGame, details: { bestCombo: game.bestCombo }
            });
            return;
          }
          save();
          paint();
        }, 1000);
      }

      if (saved && Array.isArray(saved.bubbles) && saved.bubbles.length === 12 && saved.seconds > 0) start(saved);
      else renderIntro();
    }

startSingleGame({
  id: 'math',
  name: 'Săn Trái Cây',
  icon: '🍓',
  storageKey: 'offline_math',
  mount: mathGame,
  badges: [
      { id: 'f10', n: 'Chuỗi x10', i: '🫧', ok: () => !!S.flags.f10 },
  ],
});
    <\/script>
</body>
</html>
`,s=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: memory — nội dung riêng của file này -->
    <script>
// src/games/src/memory.js — Ghép Cặp Hình
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    const ICONS = ['🐱', '🐶', '🐸', '🐼', '🦊', '🐵', '🐰', '🐻', '🍓', '🍋', '🍇', '🍉', '🚀', '🎈', '🎸', '🎧', '⚽', '🎲', '🌙', '⭐'];

    function memoryGame(root) {
      const saved = typeof loadOfflineRun === 'function' ? loadOfflineRun('memory') : null;
      const resumable = saved && saved.version === 1 && Array.isArray(saved.pairs) &&
        saved.pairs.length === 8 && Array.isArray(saved.cards) && saved.cards.length === 16 &&
        saved.cards.every(card => card && Number.isInteger(card.p) && typeof card.t === 'string') &&
        Array.isArray(saved.open) && saved.open.length <= 1 && saved.open.every(i => Number.isInteger(i) && i >= 0 && i < 16) &&
        Array.isArray(saved.matched) && Number.isFinite(saved.moves) && Number.isFinite(saved.secs);
      const pairs = resumable ? saved.pairs : shuffle(ICONS).slice(0, 8);
      const cards = resumable ? saved.cards : shuffle(pairs.flatMap((icon, i) => [{ p: i, t: icon }, { p: i, t: icon }]));
      let open = resumable ? saved.open : [];
      let moves = resumable ? saved.moves : 0;
      let matchedPairs = new Set(resumable ? saved.matched : []);
      let matched = matchedPairs.size, secs = resumable ? saved.secs : 0, lock = false;

      function checkpoint() {
        if (typeof saveOfflineRun === 'function') {
          saveOfflineRun('memory', {
            version: 1, pairs, cards, open, matched: [...matchedPairs], moves, secs,
          });
        }
      }
      root.innerHTML = \`<div class="hud"><span>👣 <b id="mv">0</b> lượt</span><span>🧩 <b id="pr">0</b>/8</span><span>⏱ <b id="tm">0</b>s</span></div>
    <div class="mem" id="mem">\${cards.map((c, i) => \`<button class="mc" data-i="\${i}" aria-label="Thẻ \${i + 1}"><div class="in"><div class="f">❓</div><div class="b">\${c.t}</div></div></button>\`).join('')}</div>
    <p class="hint">Lật hai thẻ để tìm các biểu tượng giống nhau.</p>\`;
      const els = [...root.querySelectorAll('.mc')];
      $('#mv').textContent = moves;
      $('#pr').textContent = matched;
      $('#tm').textContent = secs;
      els.forEach((el, i) => {
        if (matchedPairs.has(cards[i].p)) el.classList.add('done');
        else if (open.includes(i)) el.classList.add('flip');
      });
      if (!resumable && saved && typeof clearOfflineRun === 'function') clearOfflineRun('memory');
      checkpoint();
      T.int(() => { secs++; $('#tm').textContent = secs; checkpoint() }, 1000);
      root.onclick = e => {
        const el = e.target.closest('.mc'); if (!el || lock) return;
        const i = +el.dataset.i;
        if (el.classList.contains('flip') || el.classList.contains('done')) return;
        el.classList.add('flip'); sfx.tick();
        open.push(i);
        if (open.length === 1) checkpoint();
        if (open.length === 2) {
          moves++; $('#mv').textContent = moves; lock = true;
          const [a, b] = open;
          if (cards[a].p === cards[b].p) {
            T.set(() => {
              els[a].classList.add('done'); els[b].classList.add('done'); matchedPairs.add(cards[a].p); matched = matchedPairs.size; $('#pr').textContent = matched; sfx.ok(); open = []; lock = false;
              checkpoint();
              if (matched === 8) {
                const score = Math.max(20, 300 - moves * 8 - secs);
                if (moves <= 11) S.flags.memGold = true;
                T.clear();
                if (typeof clearOfflineRun === 'function') clearOfflineRun('memory');
                finish({
                  id: 'memory', score, xp: Math.round(score / 5) + 10,
                  lines: [\`\${moves} lượt lật\`, \`\${secs} giây\`],
                  replay: memoryGame,
                  details: { moves, secs }
                });
              }
            }, 450);
          } else {
            T.set(() => { els[a].classList.remove('flip'); els[b].classList.remove('flip'); open = []; lock = false; checkpoint() }, 900);
          }
        }
      };
    }

    /* ============ GAME 3: XẾP CHỮ ============ */
startSingleGame({
  id: 'memory',
  name: 'Ghép Cặp Hình',
  icon: '🃏',
  storageKey: 'offline_memory',
  mount: memoryGame,
  badges: [
      { id: 'memGold', n: 'Lật thẻ vàng', i: '🟡', ok: () => !!S.flags.memGold },
  ],
});
    <\/script>
</body>
</html>
`,c=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: scramble — nội dung riêng của file này -->
    <script>
// src/games/src/scramble.js — Săn Kho Báu
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    const WORDS = ['kẹo', 'mèo', 'nhạc', 'mưa', 'kem', 'phim', 'vui', 'gấu', 'bánh', 'trà', 'sóng', 'mơ', 'chơi', 'cười', 'nắng', 'mây', 'sách', 'cá', 'hoa', 'đêm'];

    function scrambleGame(root) {
      const saved = typeof loadOfflineRun === 'function' ? loadOfflineRun('scramble') : null;
      const resumable = saved && saved.version === 1 && Array.isArray(saved.words) &&
        saved.words.length === 8 && Number.isInteger(saved.i) && saved.i >= 0 && saved.i < 8 &&
          Array.isArray(saved.tiles) && saved.tiles.every(tile => tile && typeof tile.ch === 'string' && typeof tile.used === 'boolean') &&
          Array.isArray(saved.ans) && Number.isFinite(saved.score) && Number.isFinite(saved.solved);
      const words = resumable ? saved.words : shuffle(WORDS).slice(0, 8);
      let i = resumable ? saved.i : 0;
      let score = resumable ? saved.score : 0;
      let solved = resumable ? saved.solved : 0;
      let w, tiles, ans, hintsWord = 0, busy = false;

      function checkpoint() {
        if (typeof saveOfflineRun === 'function') {
          saveOfflineRun('scramble', {
            version: 1, words, i, score, solved, tiles, ans, hintsWord,
          });
        }
      }
      function newRound() {
        w = words[i]; const L = [...w.toLocaleUpperCase('vi')];
        let t; do { t = shuffle(L) } while (t.join('') === L.join(''));
        tiles = t.map(ch => ({ ch, used: false })); ans = []; hintsWord = 0; busy = false; render();
        checkpoint();
      }
      function render() {
        root.innerHTML = \`<div class="hud"><span>Từ <b>\${i + 1}/\${words.length}</b></span><span>⭐ <b>\${score}</b></span></div>
      <div class="qbox txt"><div>XẾP CHỮ VUI<small></small><span style="font-family:var(--head);font-size:1.5em;font-weight:800">\${[...w].length} chữ cái</span><small>Xếp các ô chữ thành một từ quen thuộc.</small></div></div>
      <div class="slots" id="slots">\${[...w].map((_, k) => { const t = ans[k] !== undefined ? tiles[ans[k]].ch : ''; return \`<button class="slot \${t ? 'fill' : ''}" data-s="\${k}">\${t}</button>\` }).join('')}</div>
      <div class="tiles">\${tiles.map((t, k) => \`<button class="tl" data-t="\${k}" \${t.used ? 'disabled' : ''}>\${t.ch}</button>\`).join('')}</div>
      <div class="row"><button class="btn alt" data-a="hint">💡 Gợi ý (−4 điểm)</button><button class="btn alt" data-a="skip">Bỏ qua</button></div>\`;
      }
      function add(k) {
        if (busy || tiles[k].used || ans.length >= [...w].length) return;
        tiles[k].used = true; ans.push(k); sfx.tick(); render();
        if (ans.length === [...w].length) check();
        else checkpoint();
      }
      function check() {
        const guess = ans.map(k => tiles[k].ch).join('').toLocaleLowerCase('vi');
        busy = true;
        if (guess === w) {
          const pts = Math.max(5, 15 - hintsWord * 4); score += pts; solved++; sfx.ok();
          $('#slots').classList.add('win');
          if (i + 1 < words.length) {
            i++;
            w = words[i]; const L = [...w.toLocaleUpperCase('vi')];
            let t; do { t = shuffle(L) } while (t.join('') === L.join(''));
            tiles = t.map(ch => ({ ch, used: false })); ans = []; hintsWord = 0;
            checkpoint();
            T.set(() => { busy = false; render() }, 1100);
          } else {
            if (typeof clearOfflineRun === 'function') clearOfflineRun('scramble');
            T.set(end, 1100);
          }
        } else {
          sfx.bad(); $('#slots').classList.add('err');
          T.set(() => { tiles.forEach(t => t.used = false); ans = []; busy = false; checkpoint(); render() }, 450);
        }
      }
      function hint() {
        if (busy) return;
        const target = [...w.toLocaleUpperCase('vi')];
        let ok = ans.every((k, n) => tiles[k].ch === target[n]);
        if (!ok) { tiles.forEach(t => t.used = false); ans = [] }
        const need = target[ans.length];
        const k = tiles.findIndex(t => !t.used && t.ch === need);
        if (k < 0) return;
        hintsWord++; score = Math.max(0, score - 4); add(k);
      }
      function end() {
        if (typeof clearOfflineRun === 'function') clearOfflineRun('scramble');
        finish({
          id: 'scramble', score, xp: Math.round(score / 3) + solved,
          lines: [\`Giải được \${solved}/\${words.length} từ\`],
          replay: scrambleGame,
          details: { solved }
        });
      }
      root.onclick = e => {
        const t = e.target.closest('[data-t]'), s = e.target.closest('[data-s]'), a = e.target.closest('[data-a]');
        if (t) add(+t.dataset.t);
        else if (s && !busy) { const k = +s.dataset.s; if (ans[k] !== undefined) { const idx = ans.splice(k, 1)[0]; tiles[idx].used = false; checkpoint(); render() } }
        else if (a) {
          if (a.dataset.a === 'hint') hint();
          else if (!busy) { i++; i < words.length ? newRound() : end() }
        }
      };
      onKey = e => {
        if (busy) return;
        if (e.key === 'Backspace' && ans.length) { const idx = ans.pop(); tiles[idx].used = false; checkpoint(); render(); return }
        if ([...e.key].length === 1) { const key = e.key.toLocaleUpperCase('vi'); const k = tiles.findIndex(t => !t.used && t.ch === key); if (k >= 0) add(k) }
      };
      if (resumable) {
        w = words[i];
        tiles = saved.tiles;
        ans = saved.ans;
        hintsWord = saved.hintsWord || 0;
        render();
      } else {
        if (saved && typeof clearOfflineRun === 'function') clearOfflineRun('scramble');
        newRound();
      }
    }

    /* ============ GAME: XẾP CHỮ VUI ============ */
startSingleGame({
  id: 'scramble',
  name: 'Săn Kho Báu',
  icon: '🗺️',
  storageKey: 'offline_scramble',
  mount: scrambleGame,
  badges: [
      { id: 'word10', n: 'Xếp 8 từ', i: '🧩', ok: () => !!S.flags.w10 },
  ],
});
    <\/script>
</body>
</html>
`,l=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: quiz — nội dung riêng của file này -->
    <script>
// src/games/src/quiz.js — Chọn Nhanh, Chọn Vui

    function quizGame(root) {
      const id = 'quiz';
      const picks = [
        ['Đi biển cả ngày', 'Ở nhà thư giãn cả ngày'],
        ['Ăn bánh pizza vào bữa sáng', 'Ăn kem vào bữa tối'],
        ['Có một chú rồng bé xíu', 'Có một chú khủng long tí hon'],
        ['Nhảy như robot', 'Đi bộ như cua'],
        ['Phòng toàn gối mềm', 'Phòng toàn thú bông'],
        ['Mưa kẹo dẻo', 'Mưa bỏng ngô'],
        ['Du lịch bằng khinh khí cầu', 'Du lịch bằng tàu ngầm'],
        ['Tóc đổi màu theo tâm trạng', 'Giày phát nhạc khi đi'],
        ['Một tuần chỉ ăn món mình thích', 'Một tuần chỉ xem phim hài'],
        ['Có cửa bí mật trong phòng', 'Có cầu trượt ngay ngoài cửa']
      ];
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        return { deck: shuffle(picks.map((_, i) => i)), round: 0, score: 0, streak: 0, seconds: 60, votes: [] };
      }

      function intro() {
        root.innerHTML = \`<div class="panel center"><h2>Chọn Nhanh, Chọn Vui 🎉</h2>
          <p class="hint">Chọn nhanh bên nào hợp gu của bạn. Không có đúng hay sai — chỉ chơi cho vui!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>\`;
        root.onclick = e => { if (e.target.closest('[data-start]')) start(fresh()); };
      }

      function start(game) {
        T.clear();
        function save() { saveOfflineRun(id, game); }
        function finishGame() {
          T.clear();
          clearOfflineRun(id);
          S.flags.perfect = true;
          finish({
            id, score: game.score, xp: 0,
            lines: [\`Bạn đã chọn \${game.round} lượt\`, \`Chuỗi chọn liên tiếp: \${game.streak}\`],
            replay: quizGame, details: { votes: game.votes, score: game.score }
          });
        }
        function paint() {
          if (game.round >= game.deck.length || game.seconds <= 0) { finishGame(); return; }
          const pair = picks[game.deck[game.round]];
          root.innerHTML = \`<div class="hud"><span>🎉 Lượt <b>\${game.round + 1}/10</b></span><span>⭐ <b>\${game.score}</b></span><span>⏱ <b>\${game.seconds}</b> giây</span></div>
            <div class="qbox txt">Bạn chọn gì?</div>
            <div class="opts one">\${pair.map((choice, i) => \`<button class="opt" data-choice="\${i}" style="min-height:90px;font-size:20px">\${choice}</button>\`).join('')}</div>
            <p class="hint">Chọn theo gu của bạn — không cần nghĩ lâu!</p>\`;
        }
        root.onclick = e => {
          const button = e.target.closest('[data-choice]');
          if (!button || game.round >= game.deck.length) return;
          const choice = +button.dataset.choice;
          game.votes.push(choice);
          game.round++;
          game.streak++;
          game.score += 10 + Math.min(game.streak, 10);
          sfx.ok();
          save();
          paint();
        };
        save();
        paint();
        T.int(() => {
          game.seconds--;
          if (game.seconds <= 0) finishGame();
          else {
            const timer = root.querySelector('.hud span:last-child b');
            if (timer) timer.textContent = game.seconds;
            save();
          }
        }, 1000);
      }

      if (saved && Array.isArray(saved.deck) && Array.isArray(saved.votes) &&
          saved.deck.length === picks.length && saved.seconds > 0 && saved.round >= 0 && saved.round < picks.length) start(saved);
      else intro();
    }

startSingleGame({
  id: 'quiz',
  name: 'Chọn Một Vui',
  icon: '🎉',
  storageKey: 'offline_quiz',
  mount: quizGame,
  badges: [
      { id: 'perfect', n: 'Tay chọn nhanh', i: '🎉', ok: () => S.games >= 1 },
  ],
});
    <\/script>
</body>
</html>
`,u=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: snake — nội dung riêng của file này -->
    <script>
// src/games/src/snake.js — Neon Snake

    function snakeGame(root) {
      const N = 15;
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span>Dài <b id="ln">3</b></span></div>
    <canvas id="cv"></canvas>
    <div class="dpad"><button class="u" data-d="u">▲</button><button class="l" data-d="l">◀</button><button class="d" data-d="d">▼</button><button class="r" data-d="r">▶</button></div>
    <p class="hint">Ăn trái cây phát sáng để rắn dài thêm, tránh tự cắn vào mình. Vuốt, dùng phím mũi tên hoặc chạm nút điều hướng.</p>\`;
      const cv = $('#cv'), ctx = cv.getContext('2d');
      const size = Math.floor(Math.min(root.clientWidth - 8, 450) / N) * N;
      cv.width = cv.height = size; cv.style.width = cv.style.height = size + 'px';
      const cell = size / N;
      const saved = loadOfflineRun('snake');
      let snake, dir, queue, started, food, score, lives, speed;

      function spawnFood() {
        const open = [];
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          if (!snake.some(s => s.x === x && s.y === y)) open.push({ x, y });
        }
        return open.length ? open[rnd(0, open.length - 1)] : null;
      }
      function freshSnake() {
        snake = [{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }];
        dir = { x: 1, y: 0 }; queue = []; started = false; food = spawnFood();
      }
      function saveRun() {
        saveOfflineRun('snake', { snake, dir, queue, started, food, score, lives, speed });
      }
      if (saved && Array.isArray(saved.snake) && saved.snake.length &&
          saved.snake.every(s => Number.isInteger(s.x) && Number.isInteger(s.y) && s.x >= 0 && s.x < N && s.y >= 0 && s.y < N) &&
          saved.dir && Number.isInteger(saved.score) && Number.isInteger(saved.lives)) {
        snake = saved.snake; dir = saved.dir; queue = Array.isArray(saved.queue) ? saved.queue : [];
        started = !!saved.started; food = saved.food; score = saved.score; lives = saved.lives;
        speed = Number.isFinite(saved.speed) ? saved.speed : 190;
        if (!food || !Number.isInteger(food.x) || !Number.isInteger(food.y) ||
            snake.some(s => s.x === food.x && s.y === food.y)) food = spawnFood();
      } else {
        score = 0; lives = 3; speed = 190; freshSnake();
      }

      const $sc = $('#sc'), $lv = $('#lv'), $ln = $('#ln');
      function hud() {
        $sc.textContent = score; $lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';
        $ln.textContent = snake.length;
      }
      function setDir(dx, dy) {
        const last = queue.length ? queue[queue.length - 1] : dir;
        if ((last.x === -dx && last.y === -dy) || (last.x === dx && last.y === dy)) return;
        if (queue.length < 2) queue.push({ x: dx, y: dy });
        started = true; saveRun();
      }
      const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
      root.onclick = e => { const b = e.target.closest('[data-d]'); if (b) setDir(...DIRS[b.dataset.d]) };
      onKey = e => {
        const m = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r' }[e.key];
        if (m) { e.preventDefault(); setDir(...DIRS[m]) }
      };
      let sx, sy;
      cv.ontouchstart = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY };
      cv.ontouchend = e => {
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
        if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1);
      };

      function finishRun() {
        T.clear(); clearOfflineRun('snake');
        finish({ id: 'snake', score, lines: [\`Rắn dài \${snake.length}\`, \`\${score} điểm\`],
          replay: snakeGame, details: { length: snake.length } });
      }
      function loseLife() {
        lives--; sfx.bad();
        if (lives <= 0) { finishRun(); return false; }
        freshSnake(); hud(); saveRun(); return true;
      }
      function tick() {
        if (started) {
          if (queue.length) dir = queue.shift();
          const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
          if (snake.some(s => s.x === h.x && s.y === h.y)) {
            if (!loseLife()) return;
          } else {
            snake.unshift(h);
            if (food && h.x === food.x && h.y === food.y) {
              score += 10; sfx.ok(); speed = Math.max(95, speed - 4); food = spawnFood();
            } else snake.pop();
            hud(); saveRun();
          }
        }
        draw(); T.set(tick, speed);
      }
      function draw() {
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          ctx.fillStyle = (x + y) % 2 ? '#fff6d9' : '#fffdf3'; ctx.fillRect(x * cell, y * cell, cell, cell);
        }
        if (food) {
          const cx = food.x * cell + cell / 2, cy = food.y * cell + cell / 2;
          ctx.fillStyle = '#ff6b57'; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(cx, cy, cell * .38, 0, 7); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#56bd72'; ctx.fillRect(cx - 2, cy - cell * .48, 4, cell * .18);
        }
        snake.forEach((s, k) => {
          const pad = k ? cell * .1 : cell * .04;
          ctx.fillStyle = k ? (k % 2 ? '#2fc9a5' : '#27b393') : '#1c1b3a'; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * .28); ctx.fill(); if (k) ctx.stroke();
        });
        const h = snake[0]; ctx.fillStyle = '#fff';
        [[.3, .35], [.7, .35]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.arc(h.x * cell + cell * ex, h.y * cell + cell * ey, cell * .12, 0, 7); ctx.fill() });
        if (!started) {
          ctx.fillStyle = 'rgba(28,27,58,.78)'; ctx.fillRect(0, size / 2 - 28, size, 56);
          ctx.fillStyle = '#fff'; ctx.font = \`700 \${Math.max(14, size / 24)}px Be Vietnam Pro,system-ui,sans-serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('Vuốt hoặc bấm hướng để bắt đầu', size / 2, size / 2);
        }
      }
      hud(); draw(); saveRun(); T.set(tick, speed);
    }

    startSingleGame({
      id: 'snake',
      name: 'Rắn Săn Mồi',
      icon: '🐍',
      storageKey: 'offline_snake',
      mount: snakeGame,
    });
    <\/script>
</body>
</html>
`,d=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: flap — nội dung riêng của file này -->
    <script>
// src/games/src/flap.js — Sky Hopper

    function flapGame(root) {
      const W = Math.min(root.clientWidth, 420), H = Math.round(W * 1.4), s = H / 560;
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span>🔥 <b id="cb">0</b></span></div><canvas id="cv"></canvas>
    <p class="hint">Chạm màn hình hoặc nhấn phím cách để vỗ cánh qua các khe. Bay được bao lâu tùy bạn!</p>\`;

      const cv = $('#cv'), ctx = fitCanvas(cv, W, H);
      const br = 15 * s, bx = W * .26, GY = H - 34 * s, TOP = 76 * s;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#5ec2ff'); bgGrad.addColorStop(1, '#d8f5ff');
      const $sc = $('#sc'), $lv = $('#lv'), $cb = $('#cb');
      const saved = loadOfflineRun('flap');
      let y, vy, ready, score, lives, combo, best, n, wall, t, flash = 0, saveClock = 0;
      const clouds = saved && Array.isArray(saved.clouds) ? saved.clouds :
        Array.from({ length: 5 }, () => ({ x: Math.random() * W, y: Math.random() * (H * .6) + 70 * s, r: 20 + Math.random() * 24, v: 8 + Math.random() * 14 }));
      const speed = () => (115 + Math.min(n, 15) * 4) * s;

      function hud() {
        $sc.textContent = score; $lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔'; $cb.textContent = combo;
      }
      function newWall() {
        const zone = GY - TOP, gap = Math.min(zone * .34, 126 * s);
        const cy = TOP + gap / 2 + Math.random() * (zone - gap);
        wall = { x: W + 20, w: 64 * s, top: cy - gap / 2, bot: cy + gap / 2, done: false };
      }
      function saveRun() {
        saveOfflineRun('flap', { y, vy, ready, score, lives, combo, best, n, wall, t, clouds });
      }
      if (saved && Number.isFinite(saved.y) && Number.isFinite(saved.score) && saved.wall &&
          Number.isFinite(saved.wall.x) && Number.isFinite(saved.wall.top) && Number.isFinite(saved.wall.bot)) {
        ({ y, vy, ready, score, lives, combo, best, n, wall, t } = saved);
        vy = Number.isFinite(vy) ? vy : 0; ready = !!ready;
        lives = Number.isInteger(lives) ? lives : 3; combo = Number.isInteger(combo) ? combo : 0;
        best = Number.isInteger(best) ? best : 0; n = Number.isInteger(n) ? n : 0; t = Number.isFinite(t) ? t : 0;
      } else {
        y = H / 2; vy = 0; ready = true; score = 0; lives = 3; combo = 0; best = 0; n = 0; t = 0; newWall();
      }

      function finishRun() {
        clearOfflineRun('flap');
        finish({ id: 'flap', score, lines: [\`Đã vượt \${n} cổng\`, \`Chuỗi dài nhất \${best}\`],
          replay: flapGame, details: { gates: n, bestCombo: best } });
      }
      function hurt() {
        lives--; combo = 0; sfx.bad(); flash = .3; hud();
        if (lives <= 0) { finishRun(); return true; }
        ready = true; y = H / 2; vy = 0; newWall(); saveRun(); return false;
      }
      function flap() {
        if (ready) ready = false;
        vy = -430 * s; sfx.flap(); saveRun();
      }
      cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
      onKey = e => {
        if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
      };
      hud(); saveRun();

      T.loop(dt => {
        t += dt; saveClock += dt;
        for (const c of clouds) { c.x -= c.v * dt; if (c.x < -60) c.x = W + 60; }
        if (flash > 0) flash -= dt;
        if (ready) { y = H / 2 + Math.sin(t * 5) * 8 * s; draw(); }
        else {
          vy += 1500 * s * dt; y += vy * dt;
          if (y < br) { y = br; vy = Math.max(vy, 0); }
          wall.x -= speed() * dt;
          if (y + br > GY) { if (hurt()) return; draw(); }
          else if (bx + br > wall.x && bx - br < wall.x + wall.w && !(y - br > wall.top && y + br < wall.bot)) {
            if (hurt()) return; draw();
          } else {
            if (!wall.done && bx > wall.x + wall.w / 2) {
              wall.done = true; combo++; best = Math.max(best, combo); n++;
              score += 10 + Math.min(combo, 10) * 2; sfx.ok(); hud(); saveRun();
            }
            if (wall.x + wall.w < -10) { newWall(); saveRun(); }
            draw();
          }
        }
        if (saveClock >= 1) { saveClock = 0; saveRun(); }
      });

      function draw() {
        ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        for (const c of clouds) {
          ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.arc(c.x + c.r * .9, c.y + 4, c.r * .75, 0, 7);
          ctx.arc(c.x - c.r * .9, c.y + 6, c.r * .65, 0, 7); ctx.fill();
        }
        ctx.strokeStyle = '#14683b'; ctx.lineWidth = 3;
        for (const [a, b] of [[0, wall.top], [wall.bot, GY]]) {
          if (b - a <= 0) continue;
          ctx.fillStyle = '#2fbf71'; ctx.beginPath(); ctx.roundRect(wall.x, a - 6, wall.w, b - a + 12, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(wall.x + 8, a, 7, b - a);
        }
        ctx.fillStyle = '#d9a441'; ctx.fillRect(0, GY, W, H - GY);
        ctx.fillStyle = '#4caf50'; ctx.fillRect(0, GY, W, 8 * s);
        ctx.save(); ctx.translate(bx, y); ctx.rotate(Math.max(-.5, Math.min(.9, vy / (700 * s))));
        ctx.fillStyle = '#ffc233'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, br, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff9a3c'; ctx.beginPath(); ctx.ellipse(-br * .3, br * .15 + Math.sin(t * 25) * 3, br * .55, br * .32, -.3, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(br * .35, -br * .3, br * .34, 0, 7); ctx.fill();
        ctx.fillStyle = '#0b2227'; ctx.beginPath(); ctx.arc(br * .45, -br * .3, br * .15, 0, 7); ctx.fill();
        ctx.fillStyle = '#ff6f59'; ctx.beginPath(); ctx.moveTo(br * .8, 0); ctx.lineTo(br * 1.5, br * .15); ctx.lineTo(br * .8, br * .4); ctx.fill();
        ctx.restore();
        if (ready) {
          ctx.fillStyle = 'rgba(12,42,48,.7)'; ctx.beginPath(); ctx.roundRect(W / 2 - 100, H / 2 + 40 * s, 200, 40, 20); ctx.fill();
          ctx.fillStyle = '#ffc233'; ctx.font = '700 16px Lexend,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('Chạm để bay', W / 2, H / 2 + 40 * s + 21);
        }
        if (flash > 0) { ctx.fillStyle = \`rgba(255,93,108,\${flash * 1.3})\`; ctx.fillRect(0, 0, W, H); }
      }
    }

    startSingleGame({
      id: 'flap',
      name: 'Chim Bay Tự Do',
      icon: '🐦',
      storageKey: 'offline_flap',
      mount: flapGame,
    });
    <\/script>
</body>
</html>
`,f=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: g2048 — nội dung riêng của file này -->
    <script>
// src/games/src/g2048.js — Fruit Merge

    function game2048(root) {
      const COLORS = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#b5d8ff', '#8fb8ff', '#c3a6ff', '#ff9de2', '#ffd166', '#ffc233'];
      const FRUITS = ['🍒', '🍓', '🍊', '🍋', '🍇', '🍉', '🍍', '🥝', '🥭', '🍎', '🍐'];
      const saved = loadOfflineRun('g2048');
      let b = saved && Array.isArray(saved.board) && saved.board.length === 16 &&
        saved.board.every(v => Number.isSafeInteger(v) && v >= 0) ? saved.board : Array(16).fill(0);
      let score = Number.isSafeInteger(saved && saved.score) && saved.score >= 0 ? saved.score : 0;
      let over = !!(saved && saved.over), newIdx = -1;

      function add() {
        const empty = [];
        for (let i = 0; i < 16; i++) if (!b[i]) empty.push(i);
        if (!empty.length) return;
        const p = empty[rnd(0, empty.length - 1)];
        b[p] = Math.random() < .9 ? 2 : 4; newIdx = p;
      }
      function saveRun() { saveOfflineRun('g2048', { board: b, score, over }); }
      if (!saved || !Array.isArray(saved.board) || saved.board.length !== 16 ||
          !saved.board.every(v => Number.isSafeInteger(v) && v >= 0)) { add(); add(); }

      function slide(line) {
        const a = line.filter(Boolean);
        let gain = 0;
        for (let i = 0; i < a.length - 1; i++) {
          if (a[i] === a[i + 1]) { a[i] *= 2; gain += a[i]; a.splice(i + 1, 1); }
        }
        while (a.length < 4) a.push(0);
        return { a, gain };
      }
      function canMove() {
        if (b.includes(0)) return true;
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
          const v = b[r * 4 + c];
          if ((c < 3 && b[r * 4 + c + 1] === v) || (r < 3 && b[(r + 1) * 4 + c] === v)) return true;
        }
        return false;
      }
      function finishRun() {
        const mx = Math.max(...b);
        const fruitTier = Math.max(0, Math.round(Math.log2(mx)) - 1);
        clearOfflineRun('g2048');
        finish({ id: 'g2048', score, lines: [\`Trái cây cao nhất: \${FRUITS[Math.min(fruitTier, FRUITS.length - 1)]}\`, \`\${score} điểm\`],
          replay: game2048, details: { fruitTier } });
      }
      function move(dir) {
        if (over) return;
        let moved = false, gain = 0;
        const nb = b.slice();
        for (let k = 0; k < 4; k++) {
          const idx = [0, 1, 2, 3].map(j => dir < 2 ? k * 4 + j : j * 4 + k);
          if (dir % 2 === 1) idx.reverse();
          const { a, gain: g } = slide(idx.map(i => b[i]));
          idx.forEach((i, j) => { if (nb[i] !== a[j]) moved = true; nb[i] = a[j]; });
          gain += g;
        }
        if (!moved) return;
        b = nb; score += gain; add(); sfx.tick(); render();
        if (!canMove()) { over = true; render(); saveRun(); T.set(finishRun, 900); }
        else saveRun();
      }

      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span>Ghép hai trái cây giống nhau</span></div>
    <div class="b48" id="bd"></div>
    <p class="hint">Vuốt hoặc dùng phím mũi tên để trượt các ô. Ghép trái cây giống nhau để tạo loại mới.</p>
    <div class="row"><button class="btn ghost" id="stop">Kết thúc ván</button></div>\`;
      const $sc = $('#sc'), $bd = $('#bd');
      function render() {
        $sc.textContent = score;
        let html = '';
        for (let i = 0; i < 16; i++) {
          const v = b[i];
          if (!v) { html += '<div class="t48"></div>'; continue; }
          const k = Math.max(0, Math.round(Math.log2(v)) - 1);
          html += \`<div class="t48 \${i === newIdx ? 'n' : ''}" style="background:\${COLORS[Math.min(k, COLORS.length - 1)]};font-size:clamp(22px,7vw,40px)">\${FRUITS[Math.min(k, FRUITS.length - 1)]}</div>\`;
        }
        $bd.innerHTML = html; newIdx = -1;
      }
      render(); saveRun();
      onKey = e => {
        const m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[e.key];
        if (m !== undefined) { e.preventDefault(); move(m); }
      };
      let sx, sy;
      $bd.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      $bd.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);
      });
      let px, py;
      $bd.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; } });
      $bd.addEventListener('pointerup', e => {
        if (e.pointerType !== 'mouse' || px === undefined) return;
        const dx = e.clientX - px, dy = e.clientY - py; px = undefined;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);
      });
      root.onclick = e => {
        if (e.target.closest('#stop') && !over) { over = true; finishRun(); }
      };
      if (over) T.set(finishRun, 900);
    }

    startSingleGame({
      id: 'g2048',
      name: 'Vườn Trái Cây',
      icon: '🍉',
      storageKey: 'offline_g2048',
      mount: game2048,
    });
    <\/script>
</body>
</html>
`,p=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: chem — nội dung riêng của file này -->
    <script>
// src/games/src/chem.js — Săn Ánh Đèn

    function chemGame(root) {
      const id = 'chem';
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        return { score: 0, combo: 0, bestCombo: 0, seconds: 45, lit: [rnd(0, 8)] };
      }

      function intro() {
        root.innerHTML = \`<div class="panel center"><h2>Săn Ánh Đèn</h2>
          <p class="hint">Chạm vào những ô đang sáng trước khi chúng vụt tắt. Gom điểm thật nhanh!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>\`;
        root.onclick = e => { if (e.target.closest('[data-start]')) start(fresh()); };
      }

      function start(game) {
        T.clear();
        const save = () => saveOfflineRun(id, game);
        function shuffleLights() {
          const count = rnd(1, 3), picks = [];
          while (picks.length < count) {
            const spot = rnd(0, 8);
            if (!picks.includes(spot)) picks.push(spot);
          }
          game.lit = picks;
        }
        function paint() {
          root.innerHTML = \`<div class="hud"><span>⭐ <b>\${game.score}</b></span><span>🔥 \${game.combo} · tốt nhất \${game.bestCombo}</span><span>⏱ <b>\${game.seconds}</b> giây</span></div>
            <div class="qbox">Bắt lấy ánh đèn! ✨</div>
            <div class="opts" style="grid-template-columns:repeat(3,1fr)">\${Array.from({ length: 9 }, (_, i) => \`<button class="opt" data-i="\${i}" style="min-height:78px;font-size:30px;background:\${game.lit.includes(i) ? 'var(--amber)' : '#fff6df'}">\${game.lit.includes(i) ? '✨' : '·'}</button>\`).join('')}</div>\`;
        }
        root.onclick = e => {
          const button = e.target.closest('[data-i]');
          if (!button) return;
          if (game.lit.includes(+button.dataset.i)) {
            game.score += 5 + Math.min(game.combo, 8);
            game.combo++;
            game.bestCombo = Math.max(game.bestCombo, game.combo);
            sfx.ok();
          } else {
            game.combo = 0;
            sfx.bad();
          }
          shuffleLights();
          save();
          paint();
        };
        save();
        paint();
        T.int(() => {
          game.seconds--;
          if (game.seconds <= 0) {
            T.clear();
            clearOfflineRun(id);
            S.flags.chem = true;
            finish({
              id, score: game.score, xp: 0,
              lines: [\`\${game.score} điểm\`, \`Chuỗi tốt nhất: \${game.bestCombo}\`],
              replay: chemGame, details: { bestCombo: game.bestCombo }
            });
            return;
          }
          save();
          paint();
        }, 1000);
      }

      if (saved && Array.isArray(saved.lit) && saved.lit.every(n => Number.isInteger(n) && n >= 0 && n <= 8) && saved.seconds > 0) start(saved);
      else intro();
    }

startSingleGame({
  id: 'chem',
  name: 'Tiệc Ánh Sáng',
  icon: '✨',
  storageKey: 'offline_chem',
  mount: chemGame,
  badges: [
      { id: 'chem', n: 'Săn đèn', i: '✨', ok: () => !!S.flags.chem },
  ],
});
    <\/script>
</body>
</html>
`,m=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: clock — nội dung riêng của file này -->
    <script>
// src/games/src/clock.js — Phản Xạ Chớp Nhoáng

    function clockGame(root) {
      const id = 'clock';
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        return { round: 0, score: 0, falseStarts: 0, reactions: [], phase: 'ready', waitLeft: 0, goElapsed: 0 };
      }

      function intro() {
        root.innerHTML = \`<div class="panel center"><h2>Phản Xạ Chớp Nhoáng</h2>
          <p class="hint">Chờ màn hình chuyển xanh rồi chạm ngay. Chơi 5 lượt, càng nhanh càng tốt!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>\`;
        root.onclick = e => { if (e.target.closest('[data-start]')) start(fresh()); };
      }

      function start(game) {
        T.clear();
        let readyAt = game.phase === 'go' ? Date.now() : 0;
        let ticks = 0;
        function save() {
          const state = { ...game };
          saveOfflineRun(id, state);
        }
        function paint() {
          const waiting = game.phase === 'wait';
          const go = game.phase === 'go';
          root.innerHTML = \`<div class="hud"><span>🏁 Lượt <b>\${game.round}/5</b></span><span>⭐ <b>\${game.score}</b></span><span>⚠️ Chạm sớm: \${game.falseStarts}</span></div>
            <button class="btn" data-action="tap" style="width:100%;min-height:220px;font-size:clamp(26px,7vw,42px);background:\${go ? 'var(--lime)' : 'var(--sky)'};color:#0b2227">
              <span id="signal">\${go ? 'CHẠM NGAY!' : waiting ? 'ĐỢI TÍN HIỆU…' : 'CHẠM ĐỂ BẮT ĐẦU'}</span>
            </button>
            <p class="hint" id="note">\${go ? 'Nhanh!' : waiting ? 'Đừng chạm vội!' : 'Sẵn sàng?'}</p>\`;
        }
        function beginWait() {
          game.phase = 'wait';
          game.waitLeft = rnd(8, 24) / 10;
          game.goElapsed = 0;
          readyAt = 0;
          save();
          paint();
        }
        root.onclick = e => {
          if (!e.target.closest('[data-action="tap"]')) return;
          if (game.phase === 'ready') {
            beginWait();
          } else if (game.phase === 'wait') {
            game.falseStarts++;
            game.waitLeft = rnd(10, 28) / 10;
            sfx.bad();
            save();
            const note = root.querySelector('#note');
            if (note) note.textContent = 'Quá sớm! Chờ tín hiệu xanh.';
          } else if (game.phase === 'go') {
            const reaction = Math.max(0, Date.now() - readyAt);
            game.reactions.push(reaction);
            game.score += Math.max(0, 1000 - reaction);
            game.round++;
            sfx.ok();
            if (game.round >= 5) {
              T.clear();
              clearOfflineRun(id);
              S.flags.clock = true;
              const average = Math.round(game.reactions.reduce((a, b) => a + b, 0) / game.reactions.length);
              finish({
                id, score: game.score, xp: 0,
                lines: [\`Điểm: \${game.score}\`, \`Phản xạ trung bình: \${average} mili giây\`],
                replay: clockGame, details: { reactions: game.reactions, falseStarts: game.falseStarts }
              });
              return;
            }
            beginWait();
          }
        };
        if (game.phase === 'go') readyAt = Date.now() - (game.goElapsed || 0);
        paint();
        save();
        T.int(() => {
          ticks++;
          if (game.phase === 'wait') {
            game.waitLeft -= .1;
            if (game.waitLeft <= 0) {
              game.phase = 'go';
              game.goElapsed = 0;
              readyAt = Date.now();
              sfx.tick();
              paint();
              save();
            } else {
              const signal = root.querySelector('#signal');
              if (signal && ticks % 5 === 0) signal.textContent = \`ĐỢI... \${Math.ceil(game.waitLeft)}\`;
              if (ticks % 5 === 0) save();
            }
          } else if (game.phase === 'go') {
            game.goElapsed = (game.goElapsed || 0) + 100;
            if (ticks % 5 === 0) save();
          }
        }, 100);
      }

      if (saved && Number.isInteger(saved.round) && saved.round >= 0 && saved.round < 5 && Array.isArray(saved.reactions)) {
        start(saved);
      } else intro();
    }

startSingleGame({
  id: 'clock',
  name: 'Chạm Đúng Nhịp',
  icon: '🚦',
  storageKey: 'offline_clock',
  mount: clockGame,
  badges: [
      { id: 'clock', n: 'Cao thủ phản xạ', i: '⚡', ok: () => !!S.flags.clock },
  ],
});
    <\/script>
</body>
</html>
`,h=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: pattern — nội dung riêng của file này -->
    <script>
// src/games/src/pattern.js — Săn Sao

    function patternGame(root) {
      const id = 'pattern';
      const colors = [
        ['🍓', '#ff6f59'], ['🍋', '#ffd166'], ['🍇', '#b18cff'], ['🍀', '#b7e34a']
      ];
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        return { sequence: [rnd(0, 3)], inputIndex: 0, lives: 3, score: 0, phase: 'showing' };
      }

      function intro() {
        root.innerHTML = \`<div class="panel center"><h2>Săn Sao</h2>
          <p class="hint">Nhìn các ô sáng lên rồi chạm theo nhịp. Xem chuỗi dài bao nhiêu bạn giữ được!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>\`;
        root.onclick = e => { if (e.target.closest('[data-start]')) start(fresh()); };
      }

      function start(game) {
        T.clear();
        const save = () => saveOfflineRun(id, game);
        function paint() {
          const status = game.phase === 'input' ? 'Đến lượt bạn!' : 'Nhìn theo nhịp…';
          root.innerHTML = \`<div class="hud"><span>🎵 Nhịp <b>\${game.sequence.length}</b></span><span>⭐ <b>\${game.score}</b></span><span>\${'❤️'.repeat(game.lives)}</span></div>
            <div class="qbox" id="status">\${status}</div>
            <div class="opts" style="grid-template-columns:repeat(2,1fr)">\${colors.map(([icon, color], i) => \`<button class="opt" data-pad="\${i}" style="min-height:100px;font-size:36px;background:\${color}">\${icon}</button>\`).join('')}</div>\`;
        }
        function light(index, on) {
          const pad = root.querySelector(\`[data-pad="\${index}"]\`);
          if (pad) pad.style.filter = on ? 'brightness(1.45)' : '';
        }
        function finishGame() {
          T.clear();
          clearOfflineRun(id);
          S.flags.pat = true;
          finish({
            id, score: game.score, xp: 0,
            lines: [\`Bạn đã giữ được \${game.sequence.length - 1} nhịp\`, \`Điểm: \${game.score}\`],
            replay: patternGame, details: { rounds: game.sequence.length - 1, score: game.score }
          });
        }
        function playSequence() {
          T.clear();
          game.phase = 'showing';
          game.inputIndex = 0;
          save();
          let index = 0;
          const pulse = () => {
            if (index >= game.sequence.length) {
              game.phase = 'input';
              save();
              const status = root.querySelector('#status');
              if (status) status.textContent = 'Đến lượt bạn!';
              return;
            }
            const padIndex = game.sequence[index];
            light(padIndex, true);
            sfx.tick();
            T.set(() => {
              light(padIndex, false);
              index++;
              T.set(pulse, 180);
            }, 360);
          };
          T.set(pulse, 350);
        }
        root.onclick = e => {
          const button = e.target.closest('[data-pad]');
          if (!button || game.phase !== 'input') return;
          const picked = +button.dataset.pad;
          light(picked, true);
          light(picked, false);
          if (picked !== game.sequence[game.inputIndex]) {
            game.lives--;
            sfx.bad();
            if (game.lives <= 0) { finishGame(); return; }
            game.phase = 'showing';
            save();
            const status = root.querySelector('#status');
            if (status) status.textContent = 'Tập trung — nghe lại nhịp!';
            T.set(playSequence, 450);
            return;
          }
          game.inputIndex++;
          sfx.ok();
          if (game.inputIndex === game.sequence.length) {
            game.score += game.sequence.length * 10;
            game.sequence.push(rnd(0, 3));
            game.inputIndex = 0;
            game.phase = 'showing';
            save();
            const status = root.querySelector('#status');
            if (status) status.textContent = 'Tuyệt! Chuỗi mới…';
            T.set(playSequence, 400);
          } else save();
        };
        paint();
        if (game.phase === 'input') save();
        else playSequence();
      }

      if (saved && Array.isArray(saved.sequence) && saved.sequence.length > 0 &&
          saved.sequence.every(n => Number.isInteger(n) && n >= 0 && n < 4) &&
          Number.isInteger(saved.lives) && saved.lives > 0) start(saved);
      else intro();
    }

startSingleGame({
  id: 'pattern',
  name: 'Săn Sao',
  icon: '⭐',
  storageKey: 'offline_pattern',
  mount: patternGame,
  badges: [
      { id: 'pat', n: 'Nhớ nhịp', i: '🎵', ok: () => !!S.flags.pat },
  ],
});
    <\/script>
</body>
</html>
`,g=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: simon — nội dung riêng của file này -->
    <script>
// src/games/src/simon.js — Sound & Color

    function simonGame(root) {
      const PADS = [
        ['var(--sky)', '▲', 392],
        ['var(--coral)', '●', 494],
        ['var(--amber)', '■', 587],
        ['var(--lime)', '★', 698]
      ];
      const saved = loadOfflineRun('simon');
      let seq = saved && Array.isArray(saved.seq) && saved.seq.every(i => Number.isInteger(i) && i >= 0 && i < 4) ? saved.seq : [];
      let step = 0, phase = 'show', score = Number.isSafeInteger(saved && saved.score) ? saved.score : 0;

      root.innerHTML = \`<div class="hud"><span>Vòng <b id="rd">1</b></span><span>⭐ <b id="sc">0</b></span></div>
    <div class="qbox" id="st" style="font-family:var(--head);font-size:24px;font-weight:800">Sẵn sàng!</div>
    <div class="simon">\${PADS.map((p, i) => \`<button class="pd" data-p="\${i}" style="background:\${p[0]}" aria-label="Nút \${i + 1}">\${p[1]}</button>\`).join('')}</div>
    <p class="hint">Nghe và nhìn dãy màu, sau đó lặp lại theo đúng thứ tự. Mỗi vòng sẽ thêm một âm thanh.</p>\`;
      const pads = [...root.querySelectorAll('.pd')];
      const $rd = $('#rd'), $sc = $('#sc'), $st = $('#st');
      function saveRun() { saveOfflineRun('simon', { seq, step, score, phase }); }
      const flash = (i, ms) => {
        pads[i].classList.add('on');
        beep(PADS[i][2], ms / 1000, 'triangle', .09);
        T.set(() => pads[i].classList.remove('on'), ms);
      };
      function showRound(addStep) {
        if (addStep) seq.push(rnd(0, 3));
        step = 0; phase = 'show'; $rd.textContent = seq.length;
        $st.textContent = 'Hãy nghe và nhìn...'; saveRun();
        const gap = Math.max(230, 520 - seq.length * 22), on = Math.max(160, gap * .6);
        seq.forEach((p, k) => T.set(() => flash(p, on), 700 + k * gap));
        T.set(() => { phase = 'input'; $st.textContent = 'Đến lượt bạn!'; saveRun(); }, 700 + seq.length * gap);
      }
      function finishRun() {
        T.clear(); clearOfflineRun('simon');
        const rounds = Math.max(0, seq.length - 1);
        finish({ id: 'simon', score, lines: [\`Đã chơi \${rounds} vòng\`],
          replay: simonGame, details: { rounds } });
      }
      root.onclick = e => {
        const b = e.target.closest('[data-p]');
        if (!b || phase !== 'input') return;
        const i = +b.dataset.p; flash(i, 180);
        if (i !== seq[step]) {
          phase = 'over'; sfx.bad(); $st.textContent = 'Kết thúc ván!'; saveRun();
          T.set(finishRun, 900); return;
        }
        step++; saveRun();
        if (step === seq.length) {
          phase = 'wait'; score += seq.length * 10; $sc.textContent = score;
          $st.textContent = 'Hay lắm!'; T.set(sfx.ok, 200); saveRun();
          T.set(() => showRound(true), 1100);
        }
      };
      $sc.textContent = score;
      if (saved && saved.phase === 'over') finishRun();
      else if (seq.length) {
        if (saved && saved.phase === 'wait') T.set(() => showRound(true), 700);
        else if (saved && saved.phase === 'input') {
          phase = 'input';
          step = Math.min(Math.max(0, saved.step || 0), seq.length - 1);
          $rd.textContent = seq.length;
          $st.textContent = 'Đến lượt bạn!';
          saveRun();
        } else showRound(false);
      } else T.set(() => showRound(true), 700);
    }

    startSingleGame({
      id: 'simon',
      name: 'Giai Điệu Sắc Màu',
      icon: '🎵',
      storageKey: 'offline_simon',
      mount: simonGame,
    });
    <\/script>
</body>
</html>
`,_=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: anagram — nội dung riêng của file này -->
    <script>
// src/games/src/anagram.js — Mê Cung Ký Tự

    function anagramGame(root) {
      const id = 'anagram';
      const words = ['kẹo', 'mèo', 'nhạc', 'mưa', 'kem', 'phim', 'vui', 'gấu', 'bánh', 'trà', 'sóng', 'mơ', 'chơi', 'cười', 'nắng', 'mây'];
      const saved = loadOfflineRun(id);
      const valid = saved && Array.isArray(saved.deck) && saved.deck.length === 8 &&
        saved.deck.every(word => words.includes(word)) && Number.isInteger(saved.round) &&
        saved.round >= 0 && saved.round < 8 && Number.isInteger(saved.score) &&
        Array.isArray(saved.tiles) && saved.tiles.every(tile => typeof tile === 'string') &&
        Array.isArray(saved.picked) && saved.picked.every(i => Number.isInteger(i) && i >= 0 && i < saved.tiles.length);
      let game = valid ? saved : fresh();
      let locked = false;

      function fresh() {
        clearOfflineRun(id);
        const deck = shuffle(words).slice(0, 8);
        return { deck, round: 0, score: 0, tiles: anagramShuffle(deck[0]), picked: [] };
      }
      function anagramShuffle(word) {
        const chars = [...word.toLocaleUpperCase('vi')];
        let result = shuffle(chars);
        if (result.join('') === chars.join('')) result = [...chars].reverse();
        return result;
      }
      function save() { saveOfflineRun(id, game); }
      function render() {
        const word = game.deck[game.round];
        root.innerHTML = \`<div class="hud"><span>🗝️ <b>\${game.round + 1}</b>/8</span><span>⭐ <b>\${game.score}</b></span></div>
          <div class="qbox center"><div style="font-size:30px">🧩</div><div style="font-size:20px;margin-top:6px">Mê Cung Ký Tự</div><p class="hint">Ghép các mảnh chữ để mở rương.</p>
            <div style="font-size:14px;opacity:.7">\${[...word].length} mảnh</div></div>
          <div class="slots" id="anagramSlots">\${[...word].map((_, i) => {
            const tileIndex = game.picked[i];
            return \`<button class="slot \${tileIndex === undefined ? '' : 'fill'}" data-slot="\${i}">\${tileIndex === undefined ? '' : game.tiles[tileIndex]}</button>\`;
          }).join('')}</div>
          <div class="tiles">\${game.tiles.map((tile, i) => \`<button class="tl" data-tile="\${i}" \${game.picked.includes(i) ? 'disabled' : ''}>\${tile}</button>\`).join('')}</div>
          <div class="row"><button class="btn alt" data-clear="1">↩️ Gỡ chữ</button><button class="btn alt" data-skip="1">⏭️ Bỏ qua</button><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>\`;
        save();
      }
      function advanceRound(solved) {
        if (solved) game.score += 10;
        game.round++;
        if (game.round >= game.deck.length) {
          clearOfflineRun(id);
          finish({ id, score: game.score, lines: [\`Đã mở \${game.deck.length} rương\`, \`\${game.score} điểm\`],
            replay: anagramGame, details: { rounds: game.deck.length, score: game.score } });
          return;
        }
        game.tiles = anagramShuffle(game.deck[game.round]);
        game.picked = [];
        locked = false;
        render();
      }
      root.onclick = e => {
        const restart = e.target.closest('[data-restart]');
        if (restart) { T.clear(); game = fresh(); locked = false; render(); return; }
        if (locked) return;
        if (e.target.closest('[data-clear]')) { game.picked = []; sfx.tick(); render(); return; }
        if (e.target.closest('[data-skip]')) { advanceRound(false); return; }
        const tile = e.target.closest('[data-tile]');
        if (!tile || game.picked.includes(+tile.dataset.tile)) return;
        game.picked.push(+tile.dataset.tile);
        sfx.tick();
        render();
        const word = game.deck[game.round].toLocaleUpperCase('vi');
        if (game.picked.length === [...word].length) {
          locked = true;
          const guess = game.picked.map(i => game.tiles[i]).join('');
          if (guess === word) {
            sfx.ok();
            advanceRound(true);
          } else {
            sfx.bad();
            game.picked = [];
            save();
            T.set(() => { game.picked = []; locked = false; render(); }, 500);
          }
        }
      };
      if (!valid && saved) clearOfflineRun(id);
      render();
    }

    startSingleGame({
      id: 'anagram',
      name: 'Mê Cung Ký Tự',
      icon: '🧩',
      storageKey: 'offline_anagram',
      mount: anagramGame,
    });
    <\/script>
</body>
</html>
`,v=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: stroop — nội dung riêng của file này -->
    <script>
// src/games/src/stroop.js — Color Pop

    function colorPopGame(root) {
      const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#f97316'];
      const saved = loadOfflineRun('stroop');
      let target, options, score, streak, bestStreak, lives, remaining, ended = false;
      if (saved && Number.isInteger(saved.target) && saved.target >= 0 && saved.target < COLORS.length &&
          Array.isArray(saved.options) && saved.options.length === 4 && saved.options.every(i => Number.isInteger(i) && i >= 0 && i < COLORS.length) &&
          Number.isInteger(saved.score) && Number.isInteger(saved.streak) && Number.isInteger(saved.bestStreak) &&
          Number.isInteger(saved.lives) && Number.isInteger(saved.remaining)) {
        ({ target, options, score, streak, bestStreak, lives, remaining } = saved);
      } else {
        score = 0; streak = 0; bestStreak = 0; lives = 3; remaining = 45;
        newRound();
      }
      function newRound() {
        target = rnd(0, COLORS.length - 1);
        options = shuffle([target, ...shuffle(COLORS.map((_, i) => i).filter(i => i !== target)).slice(0, 3)]);
      }
      function saveRun() { saveOfflineRun('stroop', { target, options, score, streak, bestStreak, lives, remaining }); }
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span>⏱ <b id="tm">45</b>s</span><span>❤️ <b id="lv">3</b></span></div>
    <div class="qbox" style="text-align:center"><div>SẮC MÀU</div><div style="font-size:20px;margin-top:8px">Tìm màu giống với mẫu</div><div id="target" style="height:74px;width:74px;border-radius:20px;margin:18px auto 4px;border:4px solid white;box-shadow:0 5px 18px #0003"></div></div>
    <div class="row" id="choices" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px"></div>
    <p class="hint">Chạm vào màu giống với mẫu trước khi hết giờ. Tạo chuỗi liên tiếp để nhận thêm điểm!</p>\`;
      const $sc = $('#sc'), $tm = $('#tm'), $lv = $('#lv'), $target = $('#target'), $choices = $('#choices');
      function render() {
        $sc.textContent = score; $tm.textContent = remaining; $lv.textContent = lives;
        $target.style.background = COLORS[target];
        $choices.innerHTML = options.map((color, i) =>
          \`<button class="btn" data-color="\${color}" aria-label="Lựa chọn màu \${i + 1}" style="height:86px;background:\${COLORS[color]};border:4px solid white;box-shadow:0 5px 14px #0002"></button>\`
        ).join('');
      }
      function finishRun() {
        if (ended) return;
        ended = true; T.clear(); clearOfflineRun('stroop');
        finish({ id: 'stroop', score, lines: [\`\${score} điểm\`, \`Chuỗi dài nhất \${bestStreak}\`],
          replay: colorPopGame, details: { score, bestStreak } });
      }
      $choices.addEventListener('click', e => {
        const button = e.target.closest('[data-color]');
        if (!button || ended) return;
        const chosen = COLORS.indexOf(button.dataset.color);
        if (chosen === target) { streak++; bestStreak = Math.max(bestStreak, streak); score += 10 + Math.min(streak - 1, 10) * 2; sfx.ok(); }
        else { streak = 0; lives--; sfx.bad(); }
        if (lives <= 0) { finishRun(); return; }
        newRound(); render(); saveRun();
      });
      render(); saveRun();
      function timerTick() {
        if (ended) return;
        remaining--; $tm.textContent = remaining; saveRun();
        if (remaining <= 0) { finishRun(); return; }
        T.set(timerTick, 1000);
      }
      T.set(timerTick, 1000);
    }

    startSingleGame({
      id: 'stroop',
      name: 'Sắc Màu Tốc Độ',
      icon: '🎨',
      storageKey: 'offline_stroop',
      mount: colorPopGame,
    });
    <\/script>
</body>
</html>
`,y=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: sumseq — nội dung riêng của file này -->
    <script>
// src/games/src/sumseq.js — Nhịp Điệu Ánh Sáng

    function lightRhythmGame(root) {
      const id = 'sumseq';
      const pads = [['🍓', '#ff6f59'], ['🍋', '#ffd166'], ['🍇', '#b18cff'], ['🍀', '#b7e34a']];
      const saved = loadOfflineRun(id);
      const valid = saved && Array.isArray(saved.beats) && saved.beats.length > 0 &&
        saved.beats.every(i => Number.isInteger(i) && i >= 0 && i < pads.length) &&
        Number.isInteger(saved.step) && saved.step >= 0 && saved.step < saved.beats.length &&
        Number.isInteger(saved.score) && Number.isInteger(saved.misses) && saved.misses >= 0 &&
        ['show', 'input'].includes(saved.phase);
      let game = valid ? saved : fresh();
      let closed = false;
      root.innerHTML = \`<div class="hud"><span>🎶 Nhịp <b id="rhythmRound">1</b></span><span>⭐ <b id="rhythmScore">0</b></span><span>💫 <b id="rhythmMiss">0</b>/3</span></div>
        <div class="qbox center" id="rhythmStatus">Đón nhịp ánh sáng!</div>
        <div class="opts" style="grid-template-columns:repeat(2,1fr)">\${pads.map(([icon, color], i) =>
          \`<button class="opt" data-pad="\${i}" style="min-height:100px;font-size:36px;background:\${color}">\${icon}</button>\`).join('')}</div>
        <p class="hint">Nhìn nhịp sáng lên rồi chạm lại theo đúng nhịp.</p>
        <div class="row"><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>\`;
      const padEls = [...root.querySelectorAll('[data-pad]')];
      const status = $('#rhythmStatus');
      function fresh() {
        clearOfflineRun(id);
        return { beats: [rnd(0, pads.length - 1)], step: 0, score: 0, misses: 0, phase: 'show' };
      }
      function save() { saveOfflineRun(id, game); }
      function flash(index, duration = 320) {
        padEls[index].style.filter = 'brightness(1.6)';
        beep([392, 494, 587, 698][index], duration / 1000, 'triangle', .08);
        T.set(() => { padEls[index].style.filter = ''; }, duration);
      }
      function showBeat() {
        if (closed) return;
        game.phase = 'show';
        game.step = 0;
        status.textContent = 'Nhìn và nghe nhịp…';
        save();
        const gap = Math.max(260, 520 - game.beats.length * 10);
        game.beats.forEach((beat, i) => T.set(() => flash(beat), 350 + i * gap));
        T.set(() => {
          if (closed) return;
          game.phase = 'input';
          status.textContent = 'Đến lượt bạn!';
          save();
        }, 350 + game.beats.length * gap);
      }
      function updateHud() {
        $('#rhythmRound').textContent = game.beats.length;
        $('#rhythmScore').textContent = game.score;
        $('#rhythmMiss').textContent = game.misses;
      }
      function finishRun() {
        if (closed) return;
        closed = true;
        T.clear();
        clearOfflineRun(id);
        finish({ id, score: game.score, lines: [\`Giữ được \${game.beats.length - 1} nhịp\`, \`\${game.score} điểm\`],
          replay: lightRhythmGame, details: { rounds: game.beats.length - 1, score: game.score } });
      }
      function restart() {
        closed = false;
        T.clear();
        game = fresh();
        updateHud();
        showBeat();
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) { restart(); return; }
        const button = e.target.closest('[data-pad]');
        if (!button || closed || game.phase !== 'input') return;
        const chosen = +button.dataset.pad;
        flash(chosen, 160);
        if (chosen !== game.beats[game.step]) {
          game.misses++;
          updateHud();
          sfx.bad();
          if (game.misses >= 3) { finishRun(); return; }
          game.step = 0;
          game.phase = 'show';
          save();
          status.textContent = 'Nhịp trượt — nghe lại!';
          T.set(showBeat, 650);
          return;
        }
        game.step++;
        sfx.tick();
        if (game.step === game.beats.length) {
          game.score += game.beats.length * 10;
          game.beats.push(rnd(0, pads.length - 1));
          game.step = 0;
          updateHud();
          status.textContent = 'Tuyệt! Nhịp mới…';
          save();
          T.set(showBeat, 650);
        } else save();
      };
      if (!valid && saved) clearOfflineRun(id);
      updateHud();
      save();
      if (game.phase === 'show') showBeat();
      else status.textContent = 'Đến lượt bạn!';
    }

    startSingleGame({
      id: 'sumseq',
      name: 'Nhịp Điệu Ánh Sáng',
      icon: '🎆',
      storageKey: 'offline_sumseq',
      mount: lightRhythmGame,
    });
    <\/script>
</body>
</html>
`,b=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: compare — nội dung riêng của file này -->
    <script>
// src/games/src/compare.js — Oẳn Tù Tì

    function bubbleDuelGame(root) {
      const id = 'compare';
      const moves = ['✊', '✋', '✌️'];
      const beats = [2, 0, 1];
      const saved = loadOfflineRun(id);
      const valid = saved && Number.isInteger(saved.round) && saved.round >= 0 && saved.round < 10 &&
        Number.isInteger(saved.wins) && Number.isInteger(saved.ties) && Number.isInteger(saved.losses) &&
        Number.isInteger(saved.cpu) && saved.cpu >= 0 && saved.cpu < moves.length &&
        (saved.lastCpu === undefined || (Number.isInteger(saved.lastCpu) && saved.lastCpu >= 0 && saved.lastCpu < moves.length)) &&
        ['ready', 'reveal'].includes(saved.phase);
      let game = valid ? saved : fresh();
      let closed = false;

      function fresh() {
        clearOfflineRun(id);
        return { round: 0, wins: 0, ties: 0, losses: 0, cpu: rnd(0, 2), phase: 'ready', message: 'Ra đòn!' };
      }
      function save() { saveOfflineRun(id, game); }
      function render() {
        root.innerHTML = \`<div class="hud"><span>🥊 Trận <b>\${game.round + 1}</b>/10</span><span>🏆 <b>\${game.wins}</b></span></div>
          <div class="qbox center"><div style="font-size:14px;opacity:.7">OẲN TÙ TÌ</div>
            <div style="font-size:54px;margin:12px 0">\${game.phase === 'ready' ? '🫧' : moves[game.lastCpu]}</div>
            <div id="duelMessage">\${game.message}</div>
            <p class="hint">Thắng \${game.wins} · Hòa \${game.ties} · Thua \${game.losses}</p></div>
          <div class="opts" style="grid-template-columns:repeat(3,1fr)">\${moves.map((move, i) =>
            \`<button class="opt" data-move="\${i}" style="min-height:86px;font-size:36px">\${move}</button>\`).join('')}</div>
          <p class="hint">Oẳn tù tì đấu với máy — chọn biểu tượng của bạn.</p>
          <div class="row">\${game.phase === 'reveal' ? '<button class="btn" data-next="1">Trận tiếp theo ➡️</button>' : ''}
            <button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>\`;
        root.querySelectorAll('[data-move]').forEach(button => { button.disabled = game.phase !== 'ready'; });
        save();
      }
      function finishRun() {
        if (closed) return;
        closed = true;
        clearOfflineRun(id);
        const score = game.wins * 10 + game.ties * 3;
        finish({ id, score, lines: [\`Thắng \${game.wins} · Hòa \${game.ties} · Thua \${game.losses}\`],
          replay: bubbleDuelGame, details: { wins: game.wins, ties: game.ties, losses: game.losses } });
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) {
          T.clear();
          closed = false;
          game = fresh();
          render();
          return;
        }
        if (closed) return;
        if (e.target.closest('[data-next]') && game.phase === 'reveal') {
          game.phase = 'ready';
          game.message = 'Ra đòn!';
          render();
          return;
        }
        const button = e.target.closest('[data-move]');
        if (!button || game.phase !== 'ready') return;
        const player = +button.dataset.move;
        game.lastCpu = game.cpu;
        if (player === game.cpu) {
          game.ties++;
          game.message = \`Hòa! Cả hai ra \${moves[player]}.\`;
          sfx.tick();
        } else if (beats[player] === game.cpu) {
          game.wins++;
          game.message = \`Bạn thắng! \${moves[player]} đánh bại \${moves[game.cpu]}.\`;
          sfx.ok();
        } else {
          game.losses++;
          game.message = \`Máy thắng lượt này.\`;
          sfx.bad();
        }
        game.round++;
        game.phase = 'reveal';
        if (game.round >= 10) { finishRun(); return; }
        game.cpu = rnd(0, 2);
        render();
      };
      if (!valid && saved) clearOfflineRun(id);
      render();
    }

    startSingleGame({
      id: 'compare',
      name: 'Oẳn Tù Tì',
      icon: '✊',
      storageKey: 'offline_compare',
      mount: bubbleDuelGame,
    });
    <\/script>
</body>
</html>
`,x=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: riddle — nội dung riêng của file này -->
    <script>
// src/games/src/riddle.js — Phản Xạ Đèn Xanh

    function speedRaceGame(root) {
      const id = 'riddle';
      const saved = loadOfflineRun(id);
      const valid = saved && Number.isInteger(saved.score) && Number.isInteger(saved.lives) &&
        saved.lives > 0 && saved.lives <= 3 && Number.isFinite(saved.remaining) &&
        saved.remaining > 0 && ['red', 'green'].includes(saved.light) &&
        Number.isFinite(saved.greenAt) && Number.isFinite(saved.changeAt);
      let game = valid ? saved : fresh();
      let ended = false;

      function fresh() {
        clearOfflineRun(id);
        const now = Date.now();
        return { score: 0, lives: 3, remaining: 30, light: 'red', greenAt: 0, changeAt: now + nextDelay() };
      }
      function nextDelay() { return 700 + Math.floor(Math.random() * 1500); }
      function save() { saveOfflineRun(id, game); }
      root.innerHTML = \`<div class="hud"><span>🏁 <b id="raceScore">0</b></span><span>⏱ <b id="raceTime">30</b>s</span><span>❤️ <b id="raceLives">3</b></span></div>
        <div class="qbox center" style="padding:24px 12px">
          <div style="font-size:14px;opacity:.7">PHẢN XẠ ĐÈN XANH</div>
          <div id="trafficLight" style="width:100px;height:100px;border-radius:50%;margin:18px auto;background:#f44336;border:8px solid #ffffff55;box-shadow:0 0 30px #f4433670"></div>
          <div id="raceStatus" style="font-size:20px;font-weight:800">Chờ đèn xanh!</div>
        </div>
        <button class="btn" data-react="1" style="width:100%;min-height:78px;font-size:20px">🏎️ NHẤN ĐỂ ĐUA</button>
        <p class="hint">Phản xạ thật nhanh khi đèn xanh bật. Đèn đỏ thì chờ!</p>
        <div class="row"><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>\`;
      const light = $('#trafficLight'), status = $('#raceStatus');
      function paint() {
        $('#raceScore').textContent = game.score;
        $('#raceTime').textContent = Math.max(0, Math.ceil(game.remaining));
        $('#raceLives').textContent = game.lives;
        const green = game.light === 'green';
        light.style.background = green ? '#32d583' : '#f44336';
        light.style.boxShadow = \`0 0 30px \${green ? '#32d583' : '#f44336'}70\`;
        status.textContent = green ? 'GO! GO! GO!' : 'Chờ đèn xanh!';
      }
      function finishRun() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        finish({ id, score: game.score, lines: [\`\${game.score} phản xạ\`, \`Còn \${game.lives} mạng\`],
          replay: speedRaceGame, details: { score: game.score, lives: game.lives } });
      }
      function tick() {
        if (ended) return;
        const now = Date.now();
        const elapsed = (now - game.lastTick) / 1000;
        game.lastTick = now;
        game.remaining = Math.max(0, game.remaining - elapsed);
        if (game.light === 'red' && now >= game.changeAt) {
          game.light = 'green';
          game.greenAt = now;
        } else if (game.light === 'green' && now - game.greenAt >= 850) {
          game.light = 'red';
          game.changeAt = now + nextDelay();
        }
        paint();
        if (game.remaining <= 0 || game.lives <= 0) { finishRun(); return; }
        save();
        T.set(tick, 100);
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) {
          T.clear();
          ended = false;
          game = fresh();
          game.lastTick = Date.now();
          paint();
          save();
          T.set(tick, 100);
          return;
        }
        if (!e.target.closest('[data-react]') || ended) return;
        const now = Date.now();
        if (game.light === 'green') {
          const reaction = now - game.greenAt;
          game.score += reaction < 280 ? 5 : reaction < 500 ? 3 : 1;
          game.light = 'red';
          game.changeAt = now + nextDelay();
          sfx.ok();
          status.textContent = \`Xuất phát! \${reaction} ms\`;
        } else {
          game.lives--;
          game.changeAt = now + nextDelay();
          sfx.bad();
          status.textContent = 'Xuất phát sớm! Chờ đèn xanh.';
        }
        paint();
        save();
      };
      if (!valid && saved) clearOfflineRun(id);
      game.lastTick = Date.now();
      paint();
      save();
      T.set(tick, 100);
    }

    startSingleGame({
      id: 'riddle',
      name: 'Phản Xạ Đèn Xanh',
      icon: '🚦',
      storageKey: 'offline_riddle',
      mount: speedRaceGame,
    });
    <\/script>
</body>
</html>
`,S=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Góc Giải Trí</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
    rel="stylesheet">
  <style>
    :root {
      --ink: #1c1b3a;
      --paper: #fbf8ef;
      --line: #e6e0cc;
      --sun: #ffc93c;
      --tomato: #ff6b57;
      --mint: #2fc9a5;
      --sky: #4b9dff;
      --lilac: #a184ff;
      --ok: #22b573;
      --bad: #f0483e;
      --shadow: 4px 4px 0 var(--ink);
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent
    }

    html,
    body {
      margin: 0
    }

    body {
      font-family: var(--body);
      color: var(--ink);
      background-color: var(--paper);
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 100vh;
    }

    #app {
      max-width: 980px;
      margin: 0 auto;
      padding: 14px 14px 60px
    }

    button {
      font-family: inherit;
      color: inherit;
      cursor: pointer
    }

    h1,
    h2,
    h3 {
      font-family: var(--head);
      margin: 0;
      line-height: 1.1
    }

    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px
    }

    .logo {
      font-family: var(--head);
      font-weight: 800;
      font-size: 30px;
      letter-spacing: -.5px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .logo i {
      font-style: normal;
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      background: var(--sun);
      border: 3px solid var(--ink);
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--ink);
      transform: rotate(-6deg)
    }

    .me {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .lvl {
      font-family: var(--head);
      font-weight: 800;
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 17px
    }

    .xp {
      width: 130px;
      height: 16px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden
    }

    .xp i {
      display: block;
      height: 100%;
      width: 0;
      background: var(--mint);
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)
    }

    .snd {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 3px solid var(--ink);
      background: #fff;
      font-size: 18px
    }

    .hero {
      display: flex;
      gap: 18px;
      align-items: end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 6px 0 20px
    }

    .hero h2 {
      font-size: clamp(30px, 6vw, 52px);
      font-weight: 800;
      letter-spacing: -1px;
      max-width: 14ch
    }

    .hero p {
      margin: 0;
      max-width: 34ch;
      font-size: 15px;
      line-height: 1.5;
      color: #4b4a6b
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px
    }

    .tile {
      text-align: left;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 190px;
      position: relative;
      transition: transform .12s, box-shadow .12s;
      background: #fff
    }

    .tile:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--ink)
    }

    .tile:active {
      transform: translate(3px, 3px);
      box-shadow: 1px 1px 0 var(--ink)
    }

    .tile .ic {
      font-size: 44px;
      line-height: 1
    }

    .tile h3 {
      font-size: 26px;
      font-weight: 800
    }

    .tile p {
      margin: 0;
      font-size: 14px;
      line-height: 1.45
    }

    .tile .meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700
    }

    .tag {
      background: var(--ink);
      color: #fff;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 12px;
      font-weight: 700
    }

    .badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 26px;
      align-items: center
    }

    .badges b {
      font-family: var(--head);
      font-size: 20px;
      margin-right: 4px
    }

    .bd {
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      background: #fff
    }

    .bd.off {
      opacity: .38;
      filter: grayscale(1);
      border-style: dashed
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px
    }

    .back {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 14px;
      padding: 8px 14px;
      font-weight: 700;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .bar h2 {
      font-size: 28px;
      font-weight: 800
    }

    .stage {
      max-width: 640px;
      margin: 0 auto
    }

    .panel {
      background: #fff;
      border: 3px solid var(--ink);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow)
    }

    .center {
      text-align: center
    }

    .row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px
    }

    .btn {
      border: 3px solid var(--ink);
      background: var(--sun);
      border-radius: 14px;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, box-shadow .1s
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink)
    }

    .btn.alt,
    .btn.ghost {
      background: #fff
    }

    .btn.sky {
      background: var(--sky);
      color: #fff
    }

    .hud {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 16px
    }

    .hud span {
      background: #fff;
      border: 2.5px solid var(--ink);
      border-radius: 12px;
      padding: 5px 12px
    }

    .timebar {
      height: 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 14px
    }

    .timebar i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--tomato);
      transition: width .1s linear
    }

    .qbox {
      background: var(--ink);
      color: #fff;
      border-radius: 20px;
      padding: 22px 16px;
      text-align: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(34px, 9vw, 56px);
      margin-bottom: 14px;
      min-height: 96px;
      display: grid;
      place-items: center
    }

    .qbox.txt {
      font-size: clamp(20px, 4.6vw, 26px);
      font-weight: 600;
      line-height: 1.3;
      font-family: var(--body);
      text-align: left;
      place-items: center start;
      padding: 18px
    }

    .qbox small {
      display: block;
      font-size: 14px;
      font-weight: 500;
      opacity: .75;
      margin-top: 4px;
      font-family: var(--body)
    }

    .opts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px
    }

    .opts.one {
      grid-template-columns: 1fr
    }

    .opt {
      border: 3px solid var(--ink);
      background: #fff;
      border-radius: 16px;
      padding: 16px 10px;
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(22px, 5vw, 30px);
      box-shadow: 3px 3px 0 var(--ink);
      transition: transform .1s, background .15s
    }

    .opts.one .opt {
      font-family: var(--body);
      font-weight: 600;
      font-size: 17px;
      text-align: left;
      padding: 14px 16px
    }

    .opt:active {
      transform: translate(3px, 3px)
    }

    .opt.ok {
      background: var(--ok);
      color: #fff
    }

    .opt.bad {
      background: var(--bad);
      color: #fff;
      animation: shake .3s
    }

    .opt.gone {
      opacity: .25;
      pointer-events: none
    }

    @keyframes shake {
      25% {
        transform: translateX(-6px)
      }

      75% {
        transform: translateX(6px)
      }
    }

    .explain {
      margin-top: 14px;
      background: #fff7d6;
      border: 3px solid var(--ink);
      border-radius: 16px;
      padding: 12px 14px;
      font-size: 15px;
      line-height: 1.5
    }

    .pop {
      animation: pop .35s
    }

    @keyframes pop {
      0% {
        transform: scale(.8)
      }

      60% {
        transform: scale(1.08)
      }

      100% {
        transform: scale(1)
      }
    }

    .mem {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px
    }

    .mc {
      perspective: 700px;
      aspect-ratio: 1/1.05;
      border: 0;
      background: none;
      padding: 0
    }

    .mc .in {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform .35s
    }

    .mc.flip .in {
      transform: rotateY(180deg)
    }

    .mc .f,
    .mc .b {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 3px solid var(--ink);
      border-radius: 14px;
      display: grid;
      place-items: center;
      padding: 4px;
      text-align: center
    }

    .mc .f {
      background: var(--lilac);
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .mc .b {
      transform: rotateY(180deg);
      font-family: var(--head);
      font-weight: 800;
      font-size: clamp(14px, 3.6vw, 20px);
      line-height: 1.1;
      word-break: break-word
    }

    .mc .b.en {
      background: #cfe4ff
    }

    .mc .b.vi {
      background: #c6f3e6
    }

    .mc.done .b {
      background: var(--ok);
      color: #fff
    }

    .slots {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 6px 0 18px
    }

    .slot {
      width: 46px;
      height: 56px;
      border: 3px dashed var(--ink);
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      background: #fff;
      padding: 0
    }

    .slot.fill {
      border-style: solid;
      background: var(--sun);
      box-shadow: 2px 2px 0 var(--ink)
    }

    .slots.win .slot {
      background: var(--ok);
      color: #fff
    }

    .slots.err {
      animation: shake .35s
    }

    .tiles {
      display: flex;
      gap: 9px;
      justify-content: center;
      flex-wrap: wrap
    }

    .tl {
      width: 52px;
      height: 58px;
      border: 3px solid var(--ink);
      border-radius: 12px;
      background: #fff;
      font-family: var(--head);
      font-weight: 800;
      font-size: 28px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .tl:disabled {
      opacity: .2;
      box-shadow: none
    }

    canvas {
      display: block;
      margin: 0 auto;
      border: 3px solid var(--ink);
      border-radius: 16px;
      touch-action: none;
      background: #fff;
      max-width: 100%
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-template-rows: repeat(2, 58px);
      gap: 8px;
      justify-content: center;
      margin-top: 14px
    }

    .dpad button {
      border: 3px solid var(--ink);
      border-radius: 14px;
      background: #fff;
      font-size: 22px;
      box-shadow: 3px 3px 0 var(--ink)
    }

    .dpad button:active {
      transform: translate(2px, 2px)
    }

    .dpad .u {
      grid-column: 2
    }

    .dpad .l {
      grid-row: 2;
      grid-column: 1
    }

    .dpad .d {
      grid-row: 2;
      grid-column: 2
    }

    .dpad .r {
      grid-row: 2;
      grid-column: 3
    }

    .hint {
      text-align: center;
      font-size: 13px;
      color: #5b5a7a;
      margin: 10px 0 0
    }

    #modal {
      position: fixed;
      inset: 0;
      background: rgba(28, 27, 58, .6);
      display: none;
      place-items: center;
      padding: 18px;
      z-index: 20
    }

    #modal.on {
      display: grid
    }

    .result {
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: pop .4s
    }

    .result h2 {
      font-size: 34px;
      font-weight: 800
    }

    .big {
      font-family: var(--head);
      font-weight: 800;
      font-size: 64px;
      line-height: 1;
      margin: 8px 0
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0
    }

    .stats span {
      background: var(--paper);
      border: 2.5px solid var(--ink);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 700;
      font-size: 14px
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translate(-50%, 120px);
      background: var(--ink);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-weight: 700;
      z-index: 30;
      transition: transform .4s;
      max-width: 90vw;
      text-align: center
    }

    #toast.on {
      transform: translate(-50%, 0)
    }

    @media (prefers-reduced-motion:reduce) {
      * {
        animation: none !important;
        transition: none !important
      }
    }

    button:focus-visible {
      outline: 4px solid var(--sky);
      outline-offset: 2px
    }
  </style>
</head>

<body>
  <div id="app">
    <div class="top">
      <div class="logo"><i>🎮</i>Góc Giải Trí</div>
      <div class="me">
        <span class="lvl" id="lvl">Cấp 1</span>
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>
      </div>
    </div>
    <div id="hub"></div>
    <div id="game" hidden>
      <div class="bar"><button class="back" id="back">← Về sảnh</button>
        <h2 id="gt"></h2>
      </div>
      <div class="stage" id="stage"></div>
    </div>
  </div>
  <div id="modal"></div>
  <div id="toast"></div>


    <!-- core.js: tiện ích, tiến độ localStorage, âm thanh, bộ đếm, canvas -->
    <script>
/* ============ Tiện ích ============ */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============ Trạng thái người chơi (lưu localStorage) ============ */
const S = {
  xp: 0, games: 0, best: {}, flags: {},
  played: new Set(), unlocked: new Set()
};
const XP_PER_LVL = 120;
const lvl = () => Math.floor(S.xp / XP_PER_LVL) + 1;

/* ============ localStorage persistence ============ */
let _storageKey = '';

function _saveState() {
  if (!_storageKey) return;
  try {
    const data = {
      xp: S.xp, games: S.games, best: S.best, flags: S.flags,
      played: [...S.played], unlocked: [...S.unlocked]
    };
    localStorage.setItem(_storageKey, JSON.stringify(data));
  } catch (e) { /* quota exceeded hoặc private mode */ }
}

function _loadState() {
  if (!_storageKey) return;
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.xp === 'number') S.xp = data.xp;
    if (typeof data.games === 'number') S.games = data.games;
    if (data.best && typeof data.best === 'object') S.best = data.best;
    if (data.flags && typeof data.flags === 'object') S.flags = data.flags;
    if (Array.isArray(data.played)) S.played = new Set(data.played);
    if (Array.isArray(data.unlocked)) S.unlocked = new Set(data.unlocked);
  } catch (e) { /* parse error — bỏ qua */ }
}

const _runPrefix = 'offline_run_';
function saveOfflineRun(id, state) {
  if (!id || !state || typeof state !== 'object') throw new TypeError('Tiến độ game không hợp lệ');
  try {
    localStorage.setItem(_runPrefix + id, JSON.stringify({ version: 1, updatedAt: Date.now(), state }));
  } catch (e) {
    toast('Không thể lưu ván chơi trên thiết bị này.');
    console.error(\`[offline] Không thể lưu tiến độ "\${id}"\`, e);
  }
}

function loadOfflineRun(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(_runPrefix + id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.state || typeof saved.state !== 'object') {
      localStorage.removeItem(_runPrefix + id);
      return null;
    }
    return saved.state;
  } catch (e) {
    toast('Không thể đọc tiến độ đã lưu.');
    console.error(\`[offline] Không thể đọc tiến độ "\${id}"\`, e);
    return null;
  }
}

function clearOfflineRun(id) {
  if (!id) return;
  try {
    localStorage.removeItem(_runPrefix + id);
  } catch (e) {
    toast('Không thể xóa tiến độ trên thiết bị này.');
    console.error(\`[offline] Không thể xóa tiến độ "\${id}"\`, e);
  }
}

/* ============ Âm thanh ============ */
let soundOn = true, actx;

function beep(f, d = .12, type = 'sine', v = .07) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d);
    o.stop(actx.currentTime + d);
  } catch (e) { /* ignore */ }
}

const sfx = {
  ok()  { beep(660, .1); setTimeout(() => beep(880, .14), 90); },
  bad() { beep(150, .25, 'sawtooth', .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110)); },
  tick(){ beep(520, .05, 'square', .03); },
  flap(){ beep(420, .07, 'triangle', .05); }
};

/* Nút tắt/bật âm thanh — tự kết nối khi DOM sẵn sàng */
function _bindSoundBtn() {
  const btn = $('#snd');
  if (btn) btn.onclick = () => { soundOn = !soundOn; btn.textContent = soundOn ? '🔊' : '🔇'; };
}

/* ============ Bộ hẹn giờ & phím ============ */
const T = {
  ids: [], ints: [], stops: [],
  set(fn, ms)  { const id = setTimeout(fn, ms);  this.ids.push(id);   return id; },
  int(fn, ms)  { const id = setInterval(fn, ms); this.ints.push(id);  return id; },
  loop(fn) {
    let last = performance.now(), run = true;
    const step = t => {
      if (!run) return;
      const dt = Math.min(.05, (t - last) / 1000);
      last = t; fn(dt);
      if (run) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this.stops.push(() => { run = false; });
  },
  clear() {
    this.ids.forEach(clearTimeout);
    this.ints.forEach(clearInterval);
    this.stops.forEach(f => f());
    this.ids = []; this.ints = []; this.stops = [];
  }
};

let onKey = null;
window.addEventListener('keydown', e => { if (onKey) onKey(e); });

function cleanup() {
  T.clear();
  onKey = null;
  const stage = $('#stage');
  if (stage) { stage.onclick = null; stage.ontouchstart = null; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
}

/* ============ Canvas helper ============ */
function fitCanvas(cv, w, h) {
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width  = Math.round(w * d);
  cv.height = Math.round(h * d);
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  return c;
}

/* ============ Toast thông báo ============ */
let _toastT;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ============ Huy hiệu ============ */
// Mảng BADGES được từng file khai báo bổ sung qua initCore({ badges })
// File này khai báo set mặc định hợp nhất cho tất cả game
let BADGES = [];

function checkBadges() {
  BADGES.forEach(b => {
    if (!S.unlocked.has(b.id) && b.ok()) {
      S.unlocked.add(b.id);
      setTimeout(() => toast(\`\${b.i} Huy hiệu mới: \${b.n}\`), 900);
    }
  });
}

/* ============ XP & Cấp ============ */
function renderMe() {
  const lvlEl = $('#lvl'), xpEl = $('#xpb');
  if (lvlEl) lvlEl.textContent = 'Hạng ' + lvl();
  if (xpEl)  xpEl.style.width  = ((S.xp % XP_PER_LVL) / XP_PER_LVL * 100) + '%';
}

/* ============ Sinh câu hỏi toán ============ */
function genMath(level) {
  let a, b, c, text, ans;
  if (level === 0) {
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = \`\${a} + \${b}\`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = \`\${a} − \${b}\`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = \`\${a} + \${b}\`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = \`\${a} − \${b}\`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = \`\${a} ÷ \${b}\`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = \`\${a} × \${b}\`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = \`\${a} ÷ \${b}\`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = \`\${a} + \${b} × \${c}\`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = \`\${a} × \${b} − \${c}\`; ans = a * b - c;
      if (ans < 0) { text = \`\${a} × \${b} + \${c}\`; ans = a * b + c; }
    }
  }
  return { text, ans };
}

function makeOpts(ans, n) {
  const set = new Set([ans]);
  const spread = Math.max(3, Math.round(Math.abs(ans) * .2));
  let guard = 0;
  while (set.size < n && guard++ < 200) {
    const v = ans + rnd(1, spread) * (rnd(0, 1) ? 1 : -1);
    if (v >= 0) set.add(v);
  }
  let k = 1;
  while (set.size < n) set.add(ans + k++);
  return shuffle([...set]);
}

/* ============ Trắc nghiệm dùng chung (Đồng hồ, Quy luật) ============ */
function runMC(root, cfg) {
  let i = 0, score = 0, right = 0, streak = 0, time = cfg.secs, done = false, cur;
  function show() {
    cur = cfg.make(i); done = false; time = cfg.secs;
    root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/\${cfg.count}</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">\${cur.html}</div>
      <div class="opts" id="o">\${cur.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o}</button>\`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>\`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${cur.exp}</div>\`;
    $('#nx').innerHTML = \`<button class="btn" data-next="1">\${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [\`Đúng \${right}/\${cfg.count} câu\`], replay: cfg.replay });
      }
    }
  };
  T.int(() => {
    if (done) return;
    time -= .1;
    const tb = $('#tb');
    if (tb) tb.style.width = Math.max(0, time / cfg.secs * 100) + '%';
    if (time <= 0) answer(-1);
  }, 100);
  show();
}

/* ============ finish() — kết thúc ván ============ */
/**
 * Gọi khi một ván kết thúc.
 * @param {{ id, score, xp, lines, replay, details? }} opts
 */
function finish({ id, score, xp = 0, lines, replay, details = {} }) {
  cleanup();

  // Cập nhật state client ngay (không chờ mạng)
  const before = lvl();
  S.xp   += xp;
  S.games++;
  S.played.add(id);
  const isBest = score > (S.best[id] || 0);
  if (isBest) S.best[id] = score;
  checkBadges();
  renderMe();
  _saveState(); // ← Lưu tiến độ vào localStorage
  const up = lvl() > before;
  sfx.win();

  $('#modal').innerHTML = \`<div class="panel result">
    <h2>\${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">\${score}</div>
    <div class="stats">
      \${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      \${lines.map(l => \`<span>\${l}</span>\`).join('')}
      <span>+\${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>\`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  clearOfflineRun(id);
}

/* ============ renderHub & openGame (được override bởi mỗi file) ============ */
// Các hàm này được khai báo ở đây nhưng thực sự được gán lại trong initCore()
// khi mỗi file HTML gọi initCore({ games, hubTitle, hubDesc, badges })
let _GAMES = [];

function renderHub() {
  cleanup();
  $('#game').hidden = true;
  $('#hub').hidden  = false;
  $('#modal').classList.remove('on');
  const grid = _GAMES.map(g => {
    // Hỗ trợ cả style game1 (color field) và game2/3 (c field với orb)
    const usesOrb = !!g.icon && !g.color;
    if (usesOrb) {
      return \`<button class="tile" data-g="\${g.id}" style="--c:\${g.c}">
        <span class="orb">\${g.icon}</span>
        <h3>\${g.name}</h3>
        <p>\${g.desc}</p>
        <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>\`;
    }
    return \`<button class="tile" data-g="\${g.id}" style="background:\${g.color}">
      <span class="ic">\${g.icon}</span>
      <h3>\${g.name}</h3>
      <p>\${g.desc}</p>
      <span class="meta"><span class="tag">\${g.tag}</span><span>\${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>\`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    \`<span class="bd \${S.unlocked.has(b.id) ? '' : 'off'}">\${b.i} \${b.n}</span>\`
  ).join('');

  $('#hub').innerHTML = \`
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">\${grid}</div>
    \${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>\${badgesHtml}</div>\`;

  // Điền lại title/desc từ biến đã lưu
  if ($('#hub-title')) $('#hub-title').textContent = _hubTitle;
  if ($('#hub-desc'))  $('#hub-desc').textContent  = _hubDesc;

  renderMe();
}

function openGame(id) {
  cleanup();
  const g = _GAMES.find(x => x.id === id);
  if (!g) return;
  $('#hub').hidden  = true;
  $('#game').hidden = false;
  $('#gt').textContent = g.name;
  $('#modal').classList.remove('on');
  g.fn($('#stage'));
  window.scrollTo(0, 0);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return \`<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>\`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = \`<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>\`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      \`<button class="btn \${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="\${t.key}">\${t.label}</button>\`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      const rows = key === 'xp'
        ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.xp} XP</td><td>Cấp \${lvl()}</td></tr>\`]
        : S.best[key] !== undefined
          ? [\`<tr><td>1</td><td>Bạn</td><td>\${S.best[key]} điểm</td><td></td></tr>\`]
          : [];
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
        : '<p style="opacity:.6">Chưa có kỷ lục trên thiết bị này.</p>';
    } catch (e) {
      console.error('[offline] Không thể hiển thị kỷ lục cục bộ', e);
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể hiển thị kỷ lục.</p>';
    }
  }

  $('#lb-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-lb]');
    if (btn) loadTab(btn.dataset.lb);
  });

  loadTab('xp');
}

/* ============ initCore — điểm khởi động của mỗi file ============ */
let _hubTitle = '', _hubDesc = '';

/**
 * Gọi một lần ở cuối mỗi file HTML, sau khi khai báo GAMES.
 *
 * @param {object} opts
 * @param {Array}  opts.games    — mảng GAMES của file đó
 * @param {string} opts.hubTitle — tiêu đề sảnh
 * @param {string} opts.hubDesc  — mô tả sảnh
 * @param {Array}  [opts.badges] — huy hiệu bổ sung (merge vào BADGES chung)
 */
function initCore({ games, hubTitle = '', hubDesc = '', badges = [], storageKey = '' }) {
  _GAMES    = games;
  _hubTitle = hubTitle;
  _hubDesc  = hubDesc;
  BADGES    = badges;
  _storageKey = storageKey || '';

  // Khôi phục tiến độ từ localStorage
  _loadState();

  _bindSoundBtn();

  // Kết nối hub click
  const hub = $('#hub');
  if (hub) hub.onclick = e => { const t = e.target.closest('[data-g]'); if (t) openGame(t.dataset.g); };
  const backBtn = $('#back');
  if (backBtn) backBtn.onclick = renderHub;

  // Nút leaderboard (gắn sau khi renderHub tạo ra)
  document.addEventListener('click', e => {
    if (e.target.closest('#lb-btn')) _openLeaderboard();
  });

  renderHub();
}
    <\/script>

    <!-- Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
    <script>
// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận \`root\` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(\`[single] game "\${id}" không có hàm mount\`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || \`offline_\${id}\`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
    <\/script>

    <!-- Game: shapecount — nội dung riêng của file này -->
    <script>
// src/games/src/shapecount.js — Bắt Vật Thể

    function catchObjectsGame(root) {
      const id = 'shapecount';
      const objects = ['🐱', '🐶', '🐸', '🐼', '🦊', '🐵', '🐰', '🐻', '🍓', '🍋', '🍇', '🍉', '🚀', '🎈', '🎸', '🎧'];
      const saved = loadOfflineRun(id);
      const valid = saved && Number.isInteger(saved.score) && Number.isInteger(saved.lives) &&
        saved.lives > 0 && saved.lives <= 3 && Number.isFinite(saved.remaining) && saved.remaining > 0 &&
        typeof saved.target === 'string' && objects.includes(saved.target) &&
        Array.isArray(saved.field) && saved.field.length === 16 && saved.field.every(item => objects.includes(item)) &&
        saved.field.filter(item => item === saved.target).length === 1;
      let game = valid ? saved : fresh();
      let ended = false;

      function fresh() {
        clearOfflineRun(id);
        const target = objects[rnd(0, objects.length - 1)];
        return { score: 0, lives: 3, remaining: 30, target, field: makeField(target) };
      }
      function makeField(target) {
        const otherObjects = objects.filter(item => item !== target);
        const field = shuffle([...shuffle(otherObjects).slice(0, 15), target]);
        return field;
      }
      function save() { saveOfflineRun(id, game); }
      function render() {
        root.innerHTML = \`<div class="hud"><span>⭐ <b id="catchScore">\${game.score}</b></span><span>⏱ <b id="catchTime">\${Math.ceil(game.remaining)}</b>s</span><span>❤️ <b id="catchLives">\${game.lives}</b></span></div>
          <div class="qbox center"><div style="font-size:13px;opacity:.7">BẮT VẬT THỂ</div>
            <div style="font-size:16px;margin-top:6px">Chạm nhanh vào vật thể mục tiêu</div>
            <div id="catchTarget" style="font-size:46px;margin:8px auto">\${game.target}</div></div>
          <div class="opts" style="grid-template-columns:repeat(4,1fr);gap:7px">\${game.field.map((item, i) =>
            \`<button class="opt" data-object="\${i}" style="min-height:64px;font-size:29px">\${item}</button>\`).join('')}</div>
          <p class="hint">Bắt đúng để ghi điểm, tránh chạm nhầm. Nhanh tay trước khi hết giờ!</p>
          <div class="row"><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>\`;
      }
      function updateHud() {
        $('#catchScore').textContent = game.score;
        $('#catchTime').textContent = Math.max(0, Math.ceil(game.remaining));
        $('#catchLives').textContent = game.lives;
        $('#catchTarget').textContent = game.target;
      }
      function finishRun() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        finish({ id, score: game.score, lines: [\`Bắt được \${game.score / 10} vật thể\`, \`Còn \${game.lives} mạng\`],
          replay: catchObjectsGame, details: { catches: game.score / 10, lives: game.lives } });
      }
      function tick() {
        if (ended) return;
        game.remaining = Math.max(0, game.remaining - 1);
        updateHud();
        if (game.remaining <= 0 || game.lives <= 0) { finishRun(); return; }
        save();
        T.set(tick, 1000);
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) {
          T.clear();
          ended = false;
          game = fresh();
          render();
          save();
          T.set(tick, 1000);
          return;
        }
        if (ended) return;
        const object = e.target.closest('[data-object]');
        if (!object) return;
        if (game.field[+object.dataset.object] === game.target) {
          game.score += 10;
          sfx.ok();
          const next = objects[rnd(0, objects.length - 1)];
          game.target = next;
          game.field = makeField(next);
          render();
        } else {
          game.lives--;
          sfx.bad();
          updateHud();
          if (game.lives <= 0) { finishRun(); return; }
        }
        save();
      };
      if (!valid && saved) clearOfflineRun(id);
      render();
      save();
      T.set(tick, 1000);
    }

    startSingleGame({
      id: 'shapecount',
      name: 'Bắt Vật Thể',
      icon: '🎯',
      storageKey: 'offline_shapecount',
      mount: catchObjectsGame,
    });
    <\/script>
</body>
</html>
`,C=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Chém Trái Cây</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  :root{--ink:#241309}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  html,body{height:100%;overflow:hidden;background:#13212e;color:#fff;font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif;touch-action:none}
  canvas{position:fixed;inset:0;display:block;touch-action:none}
  button{font-family:inherit;cursor:pointer}
  button:focus-visible{outline:3px solid #ffe066;outline-offset:2px}
  #hud{position:fixed;top:0;left:0;right:0;display:none;justify-content:space-between;align-items:flex-start;pointer-events:none;
    padding:calc(env(safe-area-inset-top) + 10px) calc(env(safe-area-inset-right) + 14px) 0 calc(env(safe-area-inset-left) + 14px);z-index:5}
  #hud.on{display:flex}
  #score{font-size:56px;font-weight:800;line-height:.95;text-shadow:0 4px 0 rgba(0,0,0,.35),0 0 22px rgba(255,255,255,.25)}
  #best{font-size:15px;font-weight:700;opacity:.8;margin-top:2px}
  #lives{font-size:30px;letter-spacing:3px;text-align:right;line-height:1}
  #lives .x{opacity:.28;filter:grayscale(1)}
  #timer{font-size:44px;font-weight:800;text-align:right;line-height:1;text-shadow:0 3px 0 rgba(0,0,0,.35)}
  #pauseBtn{pointer-events:auto;margin-top:8px;width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,.4);background:rgba(255,255,255,.14);color:#fff;font-size:18px;float:right}
  #pop{position:fixed;left:50%;top:34%;transform:translate(-50%,0);opacity:0;pointer-events:none;font-size:46px;font-weight:800;font-style:italic;white-space:nowrap;z-index:6;
    text-shadow:0 4px 0 #7a2a00,0 0 26px rgba(255,200,80,.9)}
  #pop.show{animation:pop 1.1s ease-out}
  @keyframes pop{0%{opacity:0;transform:translate(-50%,14px) scale(.5)}15%{opacity:1;transform:translate(-50%,0) scale(1.18)}28%{transform:translate(-50%,0) scale(1)}78%{opacity:1}100%{opacity:0;transform:translate(-50%,-34px)}}
  .screen{position:fixed;inset:0;z-index:20;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;pointer-events:none;
    padding:calc(env(safe-area-inset-top) + 10px) 16px calc(env(safe-area-inset-bottom) + 14px)}
  .screen.show{display:flex}
  .screen>*{pointer-events:auto}
  .logo{font-size:clamp(46px,14vw,80px);font-weight:800;font-style:italic;line-height:.9;text-align:center;transform:skewX(-6deg);pointer-events:none;
    text-shadow:0 3px 0 #ff9e1f,0 6px 0 #e4571b,0 9px 0 #8f2d0b,0 14px 22px rgba(0,0,0,.55)}
  .logo small{display:block;font-size:.27em;letter-spacing:2px;font-style:normal;margin-top:10px;color:#ffe9b8;text-shadow:0 2px 0 rgba(0,0,0,.5)}
  .modes{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
  .mode{width:150px;padding:16px 10px 12px;border-radius:50%/42%;border:0;color:#fff;text-align:center;box-shadow:0 8px 0 rgba(0,0,0,.35),0 14px 20px rgba(0,0,0,.4);transition:transform .12s}
  .mode:active{transform:translateY(6px);box-shadow:0 2px 0 rgba(0,0,0,.35)}
  .mode.cl{background:radial-gradient(circle at 35% 25%,#ff9f6e,#e8452c)}
  .mode.zen{background:radial-gradient(circle at 35% 25%,#7ee0a4,#1f9d6a)}
  .mode b{display:block;font-size:24px;font-weight:800;line-height:1}
  .mode span{display:block;font-size:30px;margin:4px 0}
  .mode small{font-size:14px;font-weight:700;opacity:.95}
  .panel{width:min(100%,420px);padding:12px 14px;border-radius:22px;background:rgba(8,16,26,.62);border:2px solid rgba(255,255,255,.14);backdrop-filter:blur(8px);
    display:flex;flex-direction:column;gap:8px;align-items:center}
  .blades{display:flex;gap:8px}
  .blade{width:58px;height:58px;border-radius:14px;border:2px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;font-size:12px;font-weight:800;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;line-height:1}
  .blade i{display:block;width:34px;height:6px;border-radius:6px}
  .blade.sel{border-color:#ffe066;box-shadow:0 0 0 3px rgba(255,224,102,.4)}
  .blade.lock{opacity:.5}
  .stats{display:flex;gap:16px;font-size:14px;font-weight:700;opacity:.9;text-align:center}
  .stats b{display:block;font-size:20px;font-weight:800;color:#ffe066}
  .btn{border:0;font-weight:800;font-size:22px;color:var(--ink);padding:10px 30px;border-radius:99px;background:linear-gradient(#ffe37a,#f5b52c);box-shadow:0 5px 0 #b8781a,0 9px 14px rgba(0,0,0,.35);font-style:italic}
  .btn:active{transform:translateY(4px);box-shadow:0 1px 0 #b8781a}
  .btn.alt{background:linear-gradient(#e8f3ff,#a9c6e8);box-shadow:0 5px 0 #6b8bb0,0 9px 14px rgba(0,0,0,.35)}
  .btn.alt:active{box-shadow:0 1px 0 #6b8bb0}
  .btn.sm{font-size:16px;padding:7px 18px}
  .card{width:min(100%,360px);padding:20px 22px;border-radius:26px;background:rgba(8,16,26,.82);border:2px solid rgba(255,255,255,.2);backdrop-filter:blur(10px);text-align:center;
    display:flex;flex-direction:column;gap:6px;align-items:center;box-shadow:0 14px 40px rgba(0,0,0,.5)}
  .card h2{font-size:34px;font-weight:800;font-style:italic;color:#ffd84a;line-height:1}
  .card .big{font-size:60px;font-weight:800;line-height:1}
  .card .sm{font-size:16px;font-weight:600;opacity:.85}
  #over,#pause{background:rgba(5,10,18,.5);pointer-events:auto}
  .col{display:flex;flex-direction:column;gap:10px;width:100%;margin-top:6px}
  @media (max-height:520px){.logo{font-size:40px}.mode{width:120px;padding:10px 6px}.mode span{font-size:22px}.card{padding:12px 16px}.card .big{font-size:38px}.panel{padding:8px}}
  @media (prefers-reduced-motion:reduce){#pop.show{animation:none;opacity:1}}
</style>
</head>
<body>
<canvas id="c"></canvas>

<div id="hud">
  <div><div id="score">0</div><div id="best"></div></div>
  <div><div id="lives"></div><div id="timer"></div><button id="pauseBtn" aria-label="Tạm dừng">⏸</button></div>
</div>
<div id="pop"></div>

<div class="screen show" id="menu">
  <div class="logo">CHÉM<br>TRÁI CÂY<small>VUỐT NHANH · TRÁNH BOM · LẬP KỶ LỤC</small></div>
  <div class="modes">
    <button class="mode cl" id="mClassic"><span>🍉</span><b>Cổ điển</b><small id="bestC">Kỷ lục 0</small></button>
    <button class="mode zen" id="mZen"><span>🍃</span><b>Thư giãn</b><small id="bestZ">Kỷ lục 0</small></button>
  </div>
  <div class="panel">
    <div class="blades" id="blades"></div>
    <div class="stats"><div><b id="stFruit">0</b>trái đã chém</div><div><b id="stGames">0</b>ván đã chơi</div><div><b id="stCombo">0</b>combo cao nhất</div></div>
    <div class="stats" style="font-size:12px;opacity:.7"><div id="stHint">Cổ điển: 3 mạng, tránh 💣 · Thư giãn: 90 giây, không có bom</div></div>
  </div>
</div>

<div class="screen" id="over">
  <div class="card"><h2 id="oTitle">Hết lượt!</h2><div class="sm">Điểm của bạn</div><div class="big" id="oScore">0</div><div class="sm" id="oInfo"></div>
    <div class="col"><button class="btn" id="againBtn">CHƠI LẠI</button><button class="btn alt sm" id="overMenu">☰ Menu</button></div></div>
</div>
<div class="screen" id="pause">
  <div class="card"><h2>Tạm dừng</h2><div class="col"><button class="btn" id="resumeBtn">TIẾP TỤC</button><button class="btn alt sm" id="pauseMenu">☰ Về menu</button></div></div>
</div>

<script>
(() => {
'use strict';
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const EMO = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

/* ---------- Lưu tiến trình ---------- */
const KEY = 'chem-trai-cay-v1'; let mem = null;
const load = () => { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} return mem ? JSON.parse(mem) : {}; };
const S = Object.assign({ best: { classic: 0, zen: 0 }, total: 0, games: 0, combo: 0, blade: 0, sfx: true }, load());
S.best = Object.assign({ classic: 0, zen: 0 }, S.best);
const save = () => { const s = JSON.stringify(S); try { localStorage.setItem(KEY, s); } catch (e) { mem = s; } };

/* ---------- Dữ liệu ---------- */
const FRUITS = [
  { e: '🍉', c: '#ff4d6d', r: 1.18 }, { e: '🍊', c: '#ff9f1c', r: 1 }, { e: '🍎', c: '#ef476f', r: 1 }, { e: '🍋', c: '#ffe14d', r: .95 },
  { e: '🍍', c: '#ffd23f', r: 1.1 }, { e: '🍇', c: '#9d4edd', r: .95 }, { e: '🥝', c: '#8ac926', r: .92 }, { e: '🍓', c: '#ff5d8f', r: .9 },
  { e: '🍑', c: '#ffb3a7', r: .95 }, { e: '🥭', c: '#ffb703', r: 1 }
];
const BLADES = [
  { n: 'Trắng', need: 0, grad: i => \`hsl(200,80%,\${88 - i * 3}%)\`, glow: '#8fe3ff' },
  { n: 'Lửa', need: 100, grad: i => \`hsl(\${28 + i * 3},100%,\${58 + i}%)\`, glow: '#ff8a1f' },
  { n: 'Băng', need: 250, grad: i => \`hsl(\${185 + i * 2},100%,\${70 - i}%)\`, glow: '#38e1ff' },
  { n: 'Cầu vồng', need: 500, grad: i => \`hsl(\${(performance.now() / 8 + i * 28) % 360},100%,62%)\`, glow: '#ffffff' }
];

/* ---------- Âm thanh ---------- */
let ac = null;
const audio = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ac && ac.state === 'suspended') ac.resume(); };
function tone(f, d = .15, v = .1, type = 'sine', delay = 0, slide = 0) {
  if (!ac || !S.sfx) return; const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .05);
}
function noise(d = .2, v = .12, cut = 2000, hp = false) {
  if (!ac || !S.sfx) return; const len = Math.floor(ac.sampleRate * d), buf = ac.createBuffer(1, len, ac.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ac.createBufferSource(); s.buffer = buf; const f = ac.createBiquadFilter(); f.type = hp ? 'highpass' : 'lowpass'; f.frequency.value = cut; const g = ac.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(ac.destination); s.start();
}
let lastW = 0;
const sfx = {
  whoosh: () => { const n = performance.now(); if (n - lastW > 130) { lastW = n; noise(.18, .06, 3500, true); } },
  slice: () => { noise(.12, .14, 900); tone(500 + Math.random() * 300, .1, .07, 'triangle', 0, 200); },
  gold: () => [880, 1175, 1568].forEach((f, i) => tone(f, .25, .09, 'triangle', i * .06)),
  bomb: () => { noise(.8, .35, 900); tone(90, .6, .22, 'sawtooth', 0, -50); },
  ice: () => { [1568, 1319, 1047].forEach((f, i) => tone(f, .3, .07, 'sine', i * .05)); noise(.3, .05, 5000, true); },
  miss: () => tone(160, .25, .12, 'sine', 0, -80),
  combo: n => [0, 1, 2].forEach(i => tone(660 * Math.pow(1.19, i + Math.min(n, 4)), .18, .08, 'triangle', i * .06)),
  over: () => [392, 330, 262].forEach((f, i) => tone(f, .4, .12, 'sawtooth', i * .22)),
  tap: () => tone(620, .07, .06, 'triangle')
};

/* ---------- Canvas ---------- */
const cv = $('c'), ctx = cv.getContext('2d'); let W = 0, H = 0, DPR = 1, R0 = 40, GRAV = 1300, bgC = document.createElement('canvas');
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  R0 = clamp(Math.min(W, H) * .085, 30, 62); GRAV = H * 1.55;
  bgC.width = W * DPR; bgC.height = H * DPR; const g = bgC.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#1f3447'); gr.addColorStop(.6, '#142637'); gr.addColorStop(1, '#0d1a27'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.globalAlpha = .06; g.strokeStyle = '#fff'; g.lineWidth = 1; for (let y = 0; y < H; y += 26) { g.beginPath(); g.moveTo(0, y + Math.sin(y) * 3); g.lineTo(W, y + Math.cos(y) * 3); g.stroke(); }
  g.globalAlpha = 1; const vg = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, Math.max(W, H) * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
window.addEventListener('resize', resize); resize();

/* ---------- Trạng thái ---------- */
let state = 'menu', mode = 'classic', score = 0, lives = 3, timeLeft = 90, T = 0, shake = 0, flash = 0, slowT = 0, timeScale = 1, spawnT = 1, spawnQ = [], playT = 0;
let fruits = [], halves = [], parts = [], splats = [], trail = [], pops = [], missMarks = [], runFruit = 0, runCombo = 0, swipeHits = 0, down = false, lastPt = null, ptsInSwipe = [];

function popText(t) { const p = $('pop'); p.textContent = t; p.classList.remove('show'); void p.offsetWidth; p.classList.add('show'); }
function updateHud() {
  $('score').textContent = score; $('best').textContent = 'Kỷ lục ' + Math.max(S.best[mode], score);
  $('lives').innerHTML = mode === 'classic' ? Array.from({ length: 3 }, (_, i) => \`<span class="\${i < lives ? '' : 'x'}">❤️</span>\`).join('') : '';
  $('timer').textContent = mode === 'zen' ? Math.ceil(timeLeft) : '';
}

/* ---------- Sinh trái cây ---------- */
function launch(kind) {
  const r = R0 * (kind === 'fruit' || kind === 'gold' ? pick(FRUITS).r : 1); const f = kind === 'fruit' || kind === 'gold' ? pick(FRUITS) : null;
  const x0 = rand(W * .12, W * .88), y0 = H + r + 6, apex = rand(H * .16, H * .52), vy = -Math.sqrt(2 * GRAV * (y0 - apex)), tf = 2 * Math.abs(vy) / GRAV, tx = rand(W * .2, W * .8);
  fruits.push({ kind, f, x: x0, y: y0, vx: (tx - x0) / tf, vy, r, rot: rand(0, 6.28), vr: rand(-4, 4), age: 0 });
}
function spawnWave() {
  const d = clamp(playT / 90, 0, 1.4), n = 1 + Math.floor(Math.random() * (1.6 + d * 2.6));
  for (let i = 0; i < n; i++) {
    let kind = 'fruit', r = Math.random();
    if (mode === 'classic' && r < .07 + d * .08) kind = 'bomb'; else if (r > .94 && r < .965) kind = 'ice'; else if (r > .965) kind = 'gold';
    spawnQ.push({ at: T + i * rand(.08, .22), kind });
  }
}

/* ---------- Cắt ---------- */
function splat(x, y, col, n = 1) {
  for (let i = 0; i < n; i++) splats.push({ x: x + rand(-18, 18), y: y + rand(-18, 18), r: rand(14, 34), c: col, life: 7, drops: Array.from({ length: 3 }, () => ({ a: rand(0, 6.28), d: rand(10, 36), s: rand(2, 6) })) });
  if (splats.length > 40) splats.splice(0, splats.length - 40);
}
function sliceFruit(f, ang) {
  f.dead = true;
  if (f.kind === 'bomb') { boom(f); return; }
  const col = f.f ? f.f.c : '#9be7ff', e = f.f ? f.f.e : '🧊';
  if (f.kind === 'ice') { slowT = 4; sfx.ice(); popText('❄️ CHẬM LẠI!'); flash = .35; } else if (f.kind === 'gold') { sfx.gold(); score += 5; popText('⭐ +5'); } else sfx.slice();
  if (f.kind !== 'ice') { score += 1; runFruit++; S.total++; }
  swipeHits++;
  const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2), sp = 160;
  [-1, 1].forEach(s => halves.push({ x: f.x, y: f.y, vx: f.vx * .5 + nx * s * sp, vy: f.vy * .5 + ny * s * sp - 60, rot: f.rot, vr: f.vr + s * rand(2, 5), r: f.r, e, ang: ang - f.rot, side: s, life: 3, gold: f.kind === 'gold' }));
  for (let i = 0; i < 14; i++) { const a = rand(0, 6.28), v = rand(120, 460); parts.push({ x: f.x, y: f.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, life: rand(.5, 1), max: 1, r: rand(2.5, 6.5), c: col }); }
  splat(f.x, f.y, col, 1);
  updateHud();
}
function boom(f) {
  shake = 22; flash = 1; sfx.bomb();
  for (let i = 0; i < 40; i++) { const a = rand(0, 6.28), v = rand(200, 760); parts.push({ x: f.x, y: f.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(.5, 1.1), max: 1.1, r: rand(3, 9), c: pick(['#ffdd66', '#ff8a3a', '#ff4a2a', '#fff']) }); }
  pops.push({ x: f.x, y: f.y, r: 0, life: .55, max: .55 });
  if (mode === 'classic') setTimeout(() => endGame('Bùm! Dính bom 💣'), 500); else { score = Math.max(0, score - 10); popText('💣 -10'); updateHud(); }
}
function segHit(f, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy; let t = l2 ? ((f.x - a.x) * dx + (f.y - a.y) * dy) / l2 : 0; t = clamp(t, 0, 1);
  return Math.hypot(a.x + dx * t - f.x, a.y + dy * t - f.y) < f.r * 1.05;
}

/* ---------- Vào / thoát ván ---------- */
function startGame(m) {
  mode = m; state = 'play'; score = 0; lives = 3; timeLeft = 90; playT = 0; fruits = []; halves = []; parts = []; splats = []; spawnQ = []; missMarks = []; slowT = 0; timeScale = 1; spawnT = .8; runFruit = 0; runCombo = 0;
  $('menu').classList.remove('show'); $('over').classList.remove('show'); $('pause').classList.remove('show'); $('hud').classList.add('on'); updateHud(); S.games++; save();
}
function endGame(msg) {
  if (state !== 'play') return; state = 'over'; sfx.over(); const nb = score > S.best[mode]; if (nb) S.best[mode] = score; S.combo = Math.max(S.combo, runCombo); save(); unlockCheck();
  $('hud').classList.remove('on'); $('oTitle').textContent = nb && score > 0 ? '🏆 Kỷ lục mới!' : msg; $('oScore').textContent = score;
  $('oInfo').textContent = \`Đã chém \${runFruit} trái · Kỷ lục \${S.best[mode]}\`; setTimeout(() => $('over').classList.add('show'), 350);
}
let unlockedMsg = '';
function unlockCheck() { /* dao mở khóa theo kỷ lục cổ điển + thư giãn */ }
function toMenu() { state = 'menu'; ['over', 'pause'].forEach(i => $(i).classList.remove('show')); $('hud').classList.remove('on'); renderMenu(); $('menu').classList.add('show'); fruits = []; halves = []; }
const bestAll = () => Math.max(S.best.classic, S.best.zen);
function renderMenu() {
  $('bestC').textContent = 'Kỷ lục ' + S.best.classic; $('bestZ').textContent = 'Kỷ lục ' + S.best.zen;
  $('stFruit').textContent = S.total.toLocaleString('vi-VN'); $('stGames').textContent = S.games; $('stCombo').textContent = S.combo;
  const box = $('blades'); box.innerHTML = '';
  BLADES.forEach((b, i) => {
    const ok = bestAll() >= b.need, el = document.createElement('button'); el.className = 'blade' + (S.blade === i ? ' sel' : '') + (ok ? '' : ' lock');
    el.innerHTML = \`<i style="background:linear-gradient(90deg,transparent,\${b.glow},#fff)"></i>\${ok ? b.n : '🔒 ' + b.need}\`; el.setAttribute('aria-label', 'Dao ' + b.n);
    el.onclick = () => { audio(); if (!ok) { tone(200, .15, .08, 'sawtooth'); return; } S.blade = i; save(); sfx.tap(); renderMenu(); }; box.appendChild(el);
  });
}
$('mClassic').onclick = () => { audio(); sfx.tap(); startGame('classic'); }; $('mZen').onclick = () => { audio(); sfx.tap(); startGame('zen'); };
$('againBtn').onclick = () => { audio(); startGame(mode); }; $('overMenu').onclick = toMenu; $('pauseMenu').onclick = toMenu;
$('pauseBtn').onclick = () => { if (state !== 'play') return; state = 'pause'; $('pause').classList.add('show'); }; $('resumeBtn').onclick = () => { state = 'play'; $('pause').classList.remove('show'); };
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'play') { state = 'pause'; $('pause').classList.add('show'); } });

/* ---------- Nhập liệu ---------- */
function pt(e) { return { x: e.clientX, y: e.clientY, t: performance.now() }; }
window.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; audio(); down = true; lastPt = pt(e); trail = [lastPt]; swipeHits = 0; ptsInSwipe = []; });
window.addEventListener('pointermove', e => {
  if (!down) return; const p = pt(e); trail.push(p); if (trail.length > 14) trail.shift();
  const dt = Math.max(1, p.t - lastPt.t) / 1000, dx = p.x - lastPt.x, dy = p.y - lastPt.y, dist = Math.hypot(dx, dy), speed = dist / dt;
  if ((state === 'play' || state === 'menu') && dist > 5 && speed > 320) {
    sfx.whoosh(); const ang = Math.atan2(dy, dx);
    for (const f of fruits) if (!f.dead && segHit(f, lastPt, p)) sliceFruit(f, ang);
  }
  lastPt = p;
});
function endSwipe() {
  down = false;
  if (state === 'play' && swipeHits >= 3) { const b = swipeHits; score += b; runCombo = Math.max(runCombo, b); sfx.combo(b); popText(\`COMBO x\${b}  +\${b}\`); updateHud(); }
  swipeHits = 0;
}
window.addEventListener('pointerup', endSwipe); window.addEventListener('pointercancel', endSwipe);

/* ---------- Cập nhật ---------- */
function update(dt0) {
  T += dt0;
  if (state === 'menu') { spawnT -= dt0; if (spawnT <= 0) { spawnT = rand(.9, 1.6); launch('fruit'); } }
  if (state !== 'play' && state !== 'menu' && state !== 'over') return;
  slowT = Math.max(0, slowT - dt0); timeScale = lerp(timeScale, slowT > 0 ? .38 : 1, Math.min(1, dt0 * 6));
  const dt = dt0 * timeScale; shake = Math.max(0, shake - dt0 * 40); flash = Math.max(0, flash - dt0 * 2.2);
  if (state === 'play') {
    playT += dt; spawnT -= dt;
    if (spawnT <= 0) { spawnWave(); spawnT = clamp(1.5 - playT * .012, .62, 1.5) * rand(.85, 1.15); }
    if (mode === 'zen') { timeLeft -= dt0; if (timeLeft <= 0) { timeLeft = 0; updateHud(); endGame('Hết giờ!'); } else if (Math.abs(timeLeft - Math.round(timeLeft)) < dt0) updateHud(); }
  }
  for (let i = spawnQ.length - 1; i >= 0; i--) if (T >= spawnQ[i].at) { launch(spawnQ[i].kind); spawnQ.splice(i, 1); }
  fruits.forEach(f => { f.age += dt; f.vy += GRAV * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.rot += f.vr * dt; });
  for (let i = fruits.length - 1; i >= 0; i--) {
    const f = fruits[i]; if (f.dead) { fruits.splice(i, 1); continue; }
    if (f.vy > 0 && f.y - f.r > H) {
      if (state === 'play' && mode === 'classic' && (f.kind === 'fruit' || f.kind === 'gold')) { lives--; sfx.miss(); missMarks.push({ x: clamp(f.x, 30, W - 30), life: 1 }); shake = 6; updateHud(); if (lives <= 0) endGame('Rơi mất rồi!'); }
      fruits.splice(i, 1);
    } else if (f.x < -f.r * 3 || f.x > W + f.r * 3) fruits.splice(i, 1);
  }
  halves.forEach(h => { h.vy += GRAV * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.vr * dt; h.life -= dt; }); halves = halves.filter(h => h.life > 0 && h.y < H + 200);
  parts.forEach(p => { p.vy += GRAV * .8 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }); parts = parts.filter(p => p.life > 0);
  splats.forEach(s => s.life -= dt0); splats = splats.filter(s => s.life > 0);
  pops.forEach(p => { p.life -= dt0; p.r = (1 - p.life / p.max) * Math.max(W, H) * .8; }); pops = pops.filter(p => p.life > 0);
  missMarks.forEach(m => m.life -= dt0 * .7); missMarks = missMarks.filter(m => m.life > 0);
  const now = performance.now(); trail = trail.filter(p => now - p.t < 180 || (down && p === trail[trail.length - 1]));
}

/* ---------- Vẽ ---------- */
function emoji(e, x, y, size) { ctx.font = \`\${size}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, x, y); }
function draw() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.save(); if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
  ctx.drawImage(bgC, 0, 0, W, H);
  splats.forEach(s => {
    ctx.globalAlpha = clamp(s.life / 3, 0, .5); ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    s.drops.forEach(d => { ctx.beginPath(); ctx.arc(s.x + Math.cos(d.a) * (s.r + d.d), s.y + Math.sin(d.a) * (s.r + d.d), d.s, 0, 6.283); ctx.fill(); });
  });
  ctx.globalAlpha = 1;
  missMarks.forEach(m => { ctx.globalAlpha = clamp(m.life, 0, 1); ctx.fillStyle = '#ff4d4d'; ctx.font = \`800 \${R0 * 1.1}px "Baloo 2",sans-serif\`; ctx.textAlign = 'center'; ctx.fillText('✖', m.x, H - 24); }); ctx.globalAlpha = 1;
  halves.forEach(h => {
    ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.rot); ctx.globalAlpha = clamp(h.life, 0, 1); ctx.rotate(h.ang);
    ctx.beginPath(); if (h.side > 0) ctx.rect(-h.r * 2, -h.r * 2, h.r * 4, h.r * 2); else ctx.rect(-h.r * 2, 0, h.r * 4, h.r * 2); ctx.clip();
    ctx.rotate(-h.ang); emoji(h.e, 0, 0, h.r * 2.1); ctx.rotate(h.ang);
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-h.r, 0); ctx.lineTo(h.r, 0); ctx.stroke(); ctx.restore();
  });
  fruits.forEach(f => {
    ctx.save(); ctx.translate(f.x, f.y);
    if (f.kind === 'gold') { const g = ctx.createRadialGradient(0, 0, f.r * .3, 0, 0, f.r * 1.7); g.addColorStop(0, 'rgba(255,224,102,.8)'); g.addColorStop(1, 'rgba(255,200,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, f.r * 1.7, 0, 6.283); ctx.fill(); }
    else if (f.kind === 'bomb') { const a = .35 + .35 * Math.abs(Math.sin(T * 8)), g = ctx.createRadialGradient(0, 0, f.r * .4, 0, 0, f.r * 1.6); g.addColorStop(0, \`rgba(255,60,40,\${a})\`); g.addColorStop(1, 'rgba(255,60,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, f.r * 1.6, 0, 6.283); ctx.fill(); }
    else if (f.kind === 'ice') { const g = ctx.createRadialGradient(0, 0, f.r * .3, 0, 0, f.r * 1.6); g.addColorStop(0, 'rgba(120,230,255,.7)'); g.addColorStop(1, 'rgba(120,230,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, f.r * 1.6, 0, 6.283); ctx.fill(); }
    else { ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.arc(2, 5, f.r * .95, 0, 6.283); ctx.fill(); }
    ctx.rotate(f.rot); emoji(f.kind === 'bomb' ? '💣' : f.kind === 'ice' ? '🧊' : f.f.e, 0, 0, f.r * 2.1); ctx.restore();
  });
  parts.forEach(p => { ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * clamp(p.life / p.max, .3, 1), 0, 6.283); ctx.fill(); }); ctx.globalAlpha = 1;
  pops.forEach(p => { ctx.globalAlpha = clamp(p.life / p.max, 0, 1) * .6; ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.stroke(); }); ctx.globalAlpha = 1;
  // lưỡi dao
  if (trail.length > 1) {
    const bl = BLADES[S.blade] || BLADES[0]; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = bl.glow; ctx.shadowBlur = 14;
    for (let i = 1; i < trail.length; i++) { const k = i / trail.length; ctx.strokeStyle = bl.grad(i); ctx.lineWidth = 2 + k * 11; ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke(); }
    ctx.shadowBlur = 0;
  }
  if (slowT > 0) { ctx.fillStyle = \`rgba(120,220,255,\${.1 + .05 * Math.sin(T * 6)})\`; ctx.fillRect(0, 0, W, H); }
  if (flash > 0) { ctx.fillStyle = \`rgba(255,255,255,\${flash * .85})\`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
let last = performance.now();
function loop(now) { const dt = Math.min(.04, (now - last) / 1000); last = now; if (state !== 'pause') update(dt); draw(); requestAnimationFrame(loop); }
renderMenu(); requestAnimationFrame(loop);
})();
<\/script>
</body>
</html>
`,w=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Hũ Trái Cây</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  :root{--ink:#3a2f5b;--pink:#ff8fb1;--sky:#8fd0ff;--mint:#a8ecc9;--lemon:#ffe08a;--grape:#b79cf5}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  html,body{height:100%;overflow:hidden;color:var(--ink);font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif;
    background:linear-gradient(170deg,#ffd6e7 0%,#e6dcff 50%,#cfe9ff 100%)}
  canvas{position:fixed;inset:0;width:100%;height:100%;display:block;touch-action:none}
  .hud{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:stretch;gap:10px;
    padding:calc(env(safe-area-inset-top) + 10px) 14px 0;pointer-events:none}
  .box{background:rgba(255,255,255,.62);border-radius:18px;padding:6px 14px;min-width:84px;text-align:center;
    backdrop-filter:blur(6px);display:flex;flex-direction:column;justify-content:center}
  .box small{font-size:13px;font-weight:500;opacity:.7;line-height:1.1}
  .box b{font-size:26px;font-weight:800;line-height:1.05}
  .next span{display:inline-flex;width:38px;height:38px;border-radius:50%;align-items:center;justify-content:center;
    font-size:24px;margin:2px auto 0}
  #hint{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 84px);transform:translateX(-50%);width:max-content;
    max-width:92vw;text-align:center;font-size:15px;padding:5px 14px;border-radius:99px;background:rgba(255,255,255,.55);
    transition:opacity .6s;pointer-events:none}
  #hint.hide{opacity:0}
  .foot{position:fixed;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:8px;
    padding:0 10px calc(env(safe-area-inset-bottom) + 12px)}
  #evo{display:flex;align-items:center;gap:1px;padding:5px 8px;border-radius:99px;background:rgba(255,255,255,.55);font-size:19px}
  #evo i{font-style:normal;opacity:.95}
  #evo u{text-decoration:none;font-size:11px;opacity:.5;margin:0 -1px}
  .foot button{border:0;cursor:pointer;font:inherit;font-weight:700;font-size:16px;color:var(--ink);
    background:var(--lemon);border-radius:99px;padding:9px 16px;transition:transform .15s,opacity .2s}
  .foot button:active{transform:scale(.95)}
  .foot button:disabled{opacity:.45}
  #snd{background:rgba(255,255,255,.7);padding:9px 12px}
  button:focus-visible{outline:3px solid var(--grape);outline-offset:2px}
  #over{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(58,47,91,.35);backdrop-filter:blur(3px)}
  #over.show{display:flex}
  .card{background:#fff;border-radius:28px;padding:26px 28px;text-align:center;max-width:min(88vw,340px);box-shadow:0 12px 40px rgba(58,47,91,.25)}
  .card h2{font-size:28px;font-weight:800}
  .card p{font-size:17px;margin-top:6px;line-height:1.35}
  .card .big{font-size:38px;font-weight:800;color:#ff6b8f;margin:6px 0 2px}
  .card button{margin-top:16px;border:0;cursor:pointer;font:inherit;font-weight:800;font-size:19px;color:#fff;
    background:linear-gradient(135deg,#ff8fb1,#b79cf5);border-radius:99px;padding:11px 28px}
  #pop{position:fixed;left:50%;top:38%;transform:translate(-50%,0);opacity:0;pointer-events:none;font-weight:800;font-size:26px;
    color:#ff6b8f;text-shadow:0 2px 0 #fff;transition:opacity .4s,transform .6s}
  #pop.show{opacity:1;transform:translate(-50%,-18px)}
</style>
</head>
<body>
<canvas id="c"></canvas>

<div class="hud">
  <div class="box"><small>Điểm</small><b id="score">0</b></div>
  <div class="box next"><small>Tiếp theo</small><span id="next"></span></div>
  <div class="box"><small>Cao nhất</small><b id="best">0</b></div>
</div>
<div id="hint">Trượt ngón tay để ngắm, nhấc tay để thả. Hai quả giống nhau chạm nhau sẽ nhập lại!</div>
<div id="pop"></div>

<div class="foot">
  <div id="evo" aria-label="Thứ tự tiến hóa của trái cây"></div>
  <button id="shake">Lắc hũ</button>
  <button id="snd" aria-label="Bật hoặc tắt âm thanh">🔊</button>
</div>

<div id="over">
  <div class="card">
    <h2>Hũ đầy rồi!</h2>
    <div class="big" id="finalScore">0</div>
    <p id="tip"></p>
    <button id="again">Chơi lại</button>
  </div>
</div>

<script>
(() => {
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];

const FR = [
  { e: '🫐', c: '#a9b8ff', p: 'Việt quất' }, { e: '🍓', c: '#ff9aab' }, { e: '🍇', c: '#c9a8f5' },
  { e: '🍊', c: '#ffbd7a' }, { e: '🍎', c: '#ff8585' }, { e: '🍐', c: '#dcef8d' },
  { e: '🍑', c: '#ffc9b0' }, { e: '🍍', c: '#ffe680' }, { e: '🍈', c: '#c4f0a0' }, { e: '🍉', c: '#7edc98' }
];
const RF = [0.045, 0.058, 0.072, 0.087, 0.102, 0.12, 0.14, 0.16, 0.185, 0.21];
const SC = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880];
const TIPS = ['Nhìn ra xa 20 giây để mắt được nghỉ nhé.', 'Uống một ngụm nước nào.', 'Vươn vai một cái thật dài nhé.',
  'Chơi vui lắm! Nghỉ tay một chút rồi chơi tiếp.', 'Hít sâu, thở ra thật chậm nhé.'];

/* ---- âm thanh ---- */
let ac = null, soundOn = true;
function initAudio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } }
function note(f, d = 0.9, v = 0.13, type = 'sine') {
  if (!ac || !soundOn) return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.05);
}
$('snd').onclick = e => { initAudio(); soundOn = !soundOn; e.currentTarget.textContent = soundOn ? '🔊' : '🔇'; };

/* ---- bố cục ---- */
let W, H, DPR, L, R, TOP, B, JW, JH, S = 0, DANGER;
const bodies = [], parts = [], floats = [];
const rad = l => JW * RF[l];
function layout() {
  const oL = L, oB = B, oS = S;
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  JW = Math.min(W - 24, 420);
  B = H - 84 - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0);
  JH = Math.min(JW * 1.5, B - 135);
  TOP = B - JH; L = (W - JW) / 2; R = L + JW; S = JW / 360; DANGER = TOP + JH * 0.13;
  if (oS && bodies.length) {
    const k = S / oS;
    bodies.forEach(b => { b.x = L + (b.x - oL) * k; b.y = B - (oB - b.y) * k; b.r = rad(b.l); b.vx *= k; b.vy *= k; });
  }
}

/* ---- trạng thái ---- */
const SKEY = 'hu-trai-cay-v1';
const loadBest = () => { try { const o = JSON.parse(localStorage.getItem(SKEY)); return (o && o.best) || 0; } catch (e) { return 0; } };
const saveBest = v => { try { localStorage.setItem(SKEY, JSON.stringify({ best: v })); } catch (e) {} };
let score = 0, best = loadBest(), nextL = 0, cd = 0, aimX = 0, over = false, dangerT = 0, shakeCd = 0, dropped = 0, curL = 0;
function randLevel() { return pick([0, 0, 0, 1, 1, 2, 3]); }
function setNext() {
  const n = $('next'); n.textContent = FR[nextL].e; n.style.background = FR[nextL].c;
}
function reset() {
  bodies.length = 0; parts.length = 0; floats.length = 0;
  score = 0; over = false; dangerT = 0; cd = 0.3; dropped = 0;
  curL = randLevel(); nextL = randLevel(); setNext();
  $('score').textContent = 0; $('over').classList.remove('show'); aimX = W / 2;
}
function addScore(n) {
  score += n; $('score').textContent = score;
  if (score > best) { best = score; $('best').textContent = best; saveBest(best); }
}
function showPop(t) {
  const p = $('pop'); p.textContent = t; p.classList.remove('show'); void p.offsetWidth; p.classList.add('show');
  clearTimeout(showPop.t); showPop.t = setTimeout(() => p.classList.remove('show'), 1200);
}

/* ---- thả trái cây ---- */
function drop() {
  if (over || cd > 0) return;
  const r = rad(curL);
  const x = Math.max(L + r, Math.min(R - r, aimX));
  bodies.push({ x, y: TOP - r - 6, vx: 0, vy: 160 * S, l: curL, r, landed: false, age: 0, pop: 0, dead: false });
  note(SC[curL] / 2, 0.35, 0.08, 'triangle');
  curL = nextL; nextL = randLevel(); setNext();
  cd = 0.55;
  if (++dropped === 3) $('hint').classList.add('hide');
}

/* ---- vật lý ---- */
const G = 1500;
function collide(a, b, merges) {
  const dx = b.x - a.x, dy = b.y - a.y, min = a.r + b.r;
  if (Math.abs(dx) > min || Math.abs(dy) > min) return;
  const d = Math.hypot(dx, dy);
  if (d >= min || d < 1e-4) return;
  const nx = dx / d, ny = dy / d, ov = min - d;
  const ma = a.r * a.r, mb = b.r * b.r, tm = ma + mb;
  a.x -= nx * ov * mb / tm; a.y -= ny * ov * mb / tm;
  b.x += nx * ov * ma / tm; b.y += ny * ov * ma / tm;
  const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (rv < 0) {
    const inv = 1 / ma + 1 / mb, j = -(1.08) * rv / inv;
    a.vx -= j * nx / ma; a.vy -= j * ny / ma; b.vx += j * nx / mb; b.vy += j * ny / mb;
    const tx = -ny, ty = nx, vt = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty, jt = -vt * 0.12 / inv;
    a.vx -= jt * tx / ma; a.vy -= jt * ty / ma; b.vx += jt * tx / mb; b.vy += jt * ty / mb;
  }
  a.landed = b.landed = true;
  if (a.l === b.l && !a.dead && !b.dead) merges.push([a, b]);
}
function step(dt) {
  const sub = 4, h = dt / sub, merges = [], g = G * S;
  for (let s = 0; s < sub; s++) {
    for (const b of bodies) {
      b.vy += g * h; b.x += b.vx * h; b.y += b.vy * h; b.vx *= 0.9994; b.vy *= 0.9994;
      if (b.x - b.r < L) { b.x = L + b.r; if (b.vx < 0) b.vx *= -0.15; b.landed = true; }
      if (b.x + b.r > R) { b.x = R - b.r; if (b.vx > 0) b.vx *= -0.15; b.landed = true; }
      if (b.y + b.r > B) { b.y = B - b.r; if (b.vy > 0) b.vy *= -0.1; b.vx *= 0.985; b.landed = true; }
    }
    for (let it = 0; it < 2; it++)
      for (let i = 0; i < bodies.length; i++)
        for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j], merges);
  }
  for (const [a, b] of merges) {
    if (a.dead || b.dead) continue;
    a.dead = b.dead = true;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    if (a.l === FR.length - 1) {
      addScore(500); showPop('Siêu dưa hấu! +500');
      note(SC[9], 1.6, 0.16); note(SC[7], 1.6, 0.12); note(SC[5], 1.6, 0.1);
      burst(mx, my, FR[9].c, 26); floats.push({ x: mx, y: my, t: '+500', life: 1.2 });
    } else {
      const nl = a.l + 1, pts = (nl) * 10;
      bodies.push({ x: mx, y: my, vx: (a.vx + b.vx) / 2, vy: (a.vy + b.vy) / 2, l: nl, r: rad(nl), landed: true, age: 1, pop: 1, dead: false });
      addScore(pts); burst(mx, my, FR[nl].c, 10); floats.push({ x: mx, y: my, t: '+' + pts, life: 1 });
      note(SC[nl], 1.0, 0.14); if (nl >= 5) note(SC[nl - 2], 1.2, 0.08);
      if (nl === 9) showPop('Dưa hấu! 🍉');
    }
  }
  for (let i = bodies.length - 1; i >= 0; i--) if (bodies[i].dead) bodies.splice(i, 1);
}
function burst(x, y, c, n) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, 6.283), v = rand(60, 220) * S;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: 1, c, r: rand(2, 5) });
  }
}

/* ---- cập nhật ---- */
let shakeTxt = '';
function update(dt) {
  if (cd > 0) cd -= dt;
  if (shakeCd > 0) {
    shakeCd -= dt;
    const t = shakeCd > 0 ? 'Lắc hũ ' + Math.ceil(shakeCd) : 'Lắc hũ';
    if (t !== shakeTxt) { $('shake').textContent = t; $('shake').disabled = shakeCd > 0; shakeTxt = t; }
  }
  if (!over) {
    step(dt);
    let danger = false;
    for (const b of bodies) {
      b.age += dt; if (b.pop > 0) b.pop = Math.max(0, b.pop - dt * 4);
      if (b.landed && b.age > 0.9 && b.y - b.r < DANGER && Math.hypot(b.vx, b.vy) < 30 * S) danger = true;
    }
    dangerT = danger ? dangerT + dt : Math.max(0, dangerT - dt * 2);
    if (dangerT > 2.6) endGame();
  }
  parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * S * dt; p.life -= dt * 1.7; });
  for (let i = parts.length - 1; i >= 0; i--) if (parts[i].life <= 0) parts.splice(i, 1);
  floats.forEach(f => { f.y -= 40 * dt; f.life -= dt * 1.2; });
  for (let i = floats.length - 1; i >= 0; i--) if (floats[i].life <= 0) floats.splice(i, 1);
}
function endGame() {
  over = true; $('finalScore').textContent = score + ' điểm'; $('tip').textContent = pick(TIPS);
  $('over').classList.add('show'); note(SC[2], 1.5, 0.1); note(SC[0], 2, 0.1);
}

/* ---- vẽ ---- */
function drawFruit(x, y, l, r, scale = 1, alpha = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.globalAlpha = alpha;
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, '#ffffff'); g.addColorStop(.35, FR[l].c); g.addColorStop(1, FR[l].c);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = \`\${r * 1.35}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif\`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#000';
  ctx.fillText(FR[l].e, 0, r * 0.06);
  ctx.restore();
}
function jarPath() {
  const rr = 14;
  ctx.beginPath(); ctx.moveTo(L, TOP); ctx.lineTo(L, B - rr); ctx.arcTo(L, B, L + rr, B, rr);
  ctx.lineTo(R - rr, B); ctx.arcTo(R, B, R, B - rr, rr); ctx.lineTo(R, TOP);
}
let T = 0;
function draw() {
  ctx.clearRect(0, 0, W, H);
  // kính sau
  jarPath(); ctx.lineTo(L, TOP); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill();
  // vạch cảnh báo
  const warn = dangerT > 0;
  ctx.save(); ctx.setLineDash([10, 9]); ctx.lineWidth = 3;
  ctx.strokeStyle = warn ? \`rgba(255,107,143,\${0.5 + 0.5 * Math.sin(T * 10)})\` : 'rgba(58,47,91,.18)';
  ctx.beginPath(); ctx.moveTo(L + 6, DANGER); ctx.lineTo(R - 6, DANGER); ctx.stroke(); ctx.restore();
  // đường ngắm và quả đang cầm
  if (!over) {
    const r = rad(curL), x = Math.max(L + r, Math.min(R - r, aimX));
    if (cd <= 0) {
      ctx.save(); ctx.setLineDash([3, 9]); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(58,47,91,.28)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, TOP - 6); ctx.lineTo(x, B); ctx.stroke(); ctx.restore();
    }
    drawFruit(x, TOP - r - 6, curL, r, 1, cd > 0 ? Math.max(0, 1 - cd / 0.55) : 1);
  }
  bodies.forEach(b => drawFruit(b.x, b.y, b.l, b.r, 1 + 0.2 * b.pop));
  // viền kính trước
  jarPath(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.strokeStyle = 'rgba(183,156,245,.55)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(L + 14, TOP + 30); ctx.lineTo(L + 14, TOP + JH * 0.45); ctx.stroke();
  // hạt
  parts.forEach(p => { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life + .5, 0, 6.283); ctx.fill(); });
  ctx.globalAlpha = 1;
  ctx.font = '800 22px "Baloo 2",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  floats.forEach(f => {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life)); ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.strokeText(f.t, f.x, f.y);
    ctx.fillStyle = '#ff6b8f'; ctx.fillText(f.t, f.x, f.y);
  });
  ctx.globalAlpha = 1;
}

/* ---- điều khiển ---- */
const setAim = e => { aimX = e.clientX; };
cv.addEventListener('pointerdown', e => { initAudio(); setAim(e); });
cv.addEventListener('pointermove', setAim);
cv.addEventListener('pointerup', e => { setAim(e); drop(); });
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') aimX -= 24; if (e.key === 'ArrowRight') aimX += 24;
  if (e.key === ' ') { e.preventDefault(); drop(); }
});
$('shake').onclick = () => {
  initAudio(); if (over || shakeCd > 0) return;
  bodies.forEach(b => { b.vy = -rand(220, 460) * S; b.vx = rand(-140, 140) * S; b.landed = false; b.age = 0; });
  note(SC[4], 0.5, 0.08, 'triangle'); shakeCd = 5;
};
$('again').onclick = () => { initAudio(); reset(); };
window.addEventListener('resize', layout);

/* thanh tiến hóa */
$('evo').innerHTML = FR.map((f, i) => \`<i>\${f.e}</i>\${i < FR.length - 1 ? '<u>›</u>' : ''}\`).join('');

layout(); reset();
let last = performance.now();
(function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000); last = now; T += dt;
  update(dt); draw(); requestAnimationFrame(loop);
})(last);
})();
<\/script>
</body>
</html>
`,T=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Xếp Khối Màu</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  html,body{height:100%;overflow:hidden;color:#fff;font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif;touch-action:none;
    background:radial-gradient(ellipse at 50% 0%,#4b2a8f 0,#27144f 55%,#150a30 100%)}
  canvas{position:fixed;inset:0;display:block;touch-action:none}
  button{font-family:inherit;cursor:pointer}
  button:focus-visible{outline:3px solid #ffe066;outline-offset:2px}
  #top{position:fixed;top:0;left:0;right:0;display:flex;align-items:flex-start;justify-content:space-between;pointer-events:none;z-index:5;
    padding:calc(env(safe-area-inset-top) + 8px) calc(env(safe-area-inset-right) + 14px) 0 calc(env(safe-area-inset-left) + 14px)}
  .side{width:84px;font-weight:800;line-height:1.05}
  .side small{display:block;font-size:12px;opacity:.7;font-weight:700}
  .side b{font-size:22px;color:#ffe066}
  .mid{text-align:center;line-height:1}
  #score{font-size:58px;font-weight:800;text-shadow:0 4px 0 rgba(0,0,0,.35),0 0 24px rgba(180,140,255,.55);transition:transform .15s}
  #score.b{transform:scale(1.16)}
  #combo{height:24px;font-size:18px;font-weight:800;color:#ff9be8;opacity:0;transition:opacity .2s}
  #combo.on{opacity:1}
  #menuBtn{pointer-events:auto;width:42px;height:42px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);color:#fff;font-size:18px;float:right}
  .screen{position:fixed;inset:0;z-index:20;display:none;align-items:center;justify-content:center;background:rgba(10,4,28,.62);backdrop-filter:blur(4px);padding:20px}
  .screen.show{display:flex;animation:fade .3s}
  @keyframes fade{from{opacity:0}}
  .card{width:min(100%,360px);padding:22px 24px;border-radius:28px;text-align:center;background:linear-gradient(#3a2278,#241250);border:2px solid rgba(255,255,255,.2);
    box-shadow:0 16px 50px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:8px;align-items:center}
  .card h2{font-size:34px;font-weight:800;line-height:1;font-style:italic;color:#ffd84a;text-shadow:0 3px 0 rgba(0,0,0,.4)}
  .card .big{font-size:60px;font-weight:800;line-height:1}
  .card .sm{font-size:16px;font-weight:600;opacity:.85}
  .col{display:flex;flex-direction:column;gap:10px;width:100%;margin-top:6px}
  .btn{border:0;font-weight:800;font-size:22px;color:#241250;padding:11px 26px;border-radius:16px;background:linear-gradient(#ffe37a,#f5b52c);box-shadow:0 5px 0 #b8781a,0 9px 14px rgba(0,0,0,.35);font-style:italic}
  .btn:active{transform:translateY(4px);box-shadow:0 1px 0 #b8781a}
  .btn.alt{background:linear-gradient(#e6dcff,#b7a2f0);box-shadow:0 5px 0 #7a63c0,0 9px 14px rgba(0,0,0,.35)}
  .btn.alt:active{box-shadow:0 1px 0 #7a63c0}
  .btn.sm{font-size:16px;padding:8px 18px}
  .stats{display:flex;gap:14px;font-size:13px;font-weight:700;opacity:.9}
  .stats b{display:block;font-size:20px;color:#ffe066}
  @media (max-height:560px){#score{font-size:40px}.card{padding:14px 18px}.card .big{font-size:40px}}
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="top">
  <div class="side"><small>KỶ LỤC</small><b id="best">0</b></div>
  <div class="mid"><div id="score">0</div><div id="combo"></div></div>
  <div class="side"><button id="menuBtn" aria-label="Menu">☰</button></div>
</div>

<div class="screen" id="start">
  <div class="card"><h2>Xếp Khối Màu</h2><div class="sm">Kéo khối vào bảng, lấp đầy hàng hoặc cột để xóa!</div>
    <div class="stats"><div><b id="stBest">0</b>kỷ lục</div><div><b id="stGames">0</b>ván</div><div><b id="stLines">0</b>hàng xóa</div></div>
    <div class="col"><button class="btn" id="contBtn">▶ Tiếp tục (<span id="contScore">0</span> điểm)</button><button class="btn alt" id="newBtn">Ván mới</button></div></div>
</div>
<div class="screen" id="over">
  <div class="card"><h2 id="oTitle">Hết chỗ rồi!</h2><div class="sm">Điểm của bạn</div><div class="big" id="oScore">0</div><div class="sm" id="oInfo"></div>
    <div class="col"><button class="btn" id="againBtn">CHƠI LẠI</button></div></div>
</div>
<div class="screen" id="menu">
  <div class="card"><h2>Tạm dừng</h2>
    <div class="col"><button class="btn" id="resumeBtn">Tiếp tục</button><button class="btn alt sm" id="restartBtn">↺ Ván mới</button><button class="btn alt sm" id="sndBtn">🔊 Âm thanh: Bật</button></div></div>
</div>

<script>
(() => {
'use strict';
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const N = 8;

/* ---------- Lưu ---------- */
const KEY = 'xep-khoi-v1'; let mem = null;
const load = () => { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} return mem ? JSON.parse(mem) : {}; };
const S = Object.assign({ best: 0, games: 0, lines: 0, maxCombo: 0, sfx: true, save: null }, load());
const persist = () => { const s = JSON.stringify(S); try { localStorage.setItem(KEY, s); } catch (e) { mem = s; } };

/* ---------- Khối ---------- */
const SHAPES = [
  ['X'], ['XX'], ['XXX'], ['XXXX'], ['XXXXX'], ['X', 'X'], ['X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X', 'X'],
  ['XX', 'XX'], ['XXX', 'XXX', 'XXX'], ['XXX', 'XXX'], ['XX', 'XX', 'XX'],
  ['X.', 'XX'], ['.X', 'XX'], ['XX', 'X.'], ['XX', '.X'],
  ['X..', 'X..', 'XXX'], ['..X', '..X', 'XXX'], ['XXX', 'X..', 'X..'], ['XXX', '..X', '..X'],
  ['XXX', '.X.'], ['.X.', 'XXX'], ['X.', 'XX', 'X.'], ['.X', 'XX', '.X'],
  ['XX.', '.XX'], ['.XX', 'XX.'], ['.X', 'XX', 'X.'], ['X.', 'XX', '.X']
].map(rows => { const cells = []; rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === 'X') cells.push([y, x]); })); return { rows, cells, h: rows.length, w: rows[0].length }; });
const COLORS = ['#ff5d73', '#ff9f43', '#ffd93d', '#4cd964', '#2dd4bf', '#4dabf7', '#9775fa', '#f06595'];

/* ---------- Âm thanh ---------- */
let ac = null;
const audio = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ac && ac.state === 'suspended') ac.resume(); };
function tone(f, d = .15, v = .1, type = 'sine', delay = 0, slide = 0) {
  if (!ac || !S.sfx) return; const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .05);
}
const sfx = {
  pick: () => tone(500, .06, .05, 'triangle'),
  place: () => { tone(200, .12, .12, 'triangle', 0, -60); tone(300, .1, .06, 'sine', .03); },
  bad: () => tone(160, .15, .08, 'sawtooth', 0, -50),
  clear: (n, c) => { for (let i = 0; i < Math.min(5, n + 2); i++) tone(520 * Math.pow(1.122, i * 2 + Math.min(c, 5)), .25, .1, 'triangle', i * .06); },
  over: () => [330, 262, 196].forEach((f, i) => tone(f, .4, .12, 'sawtooth', i * .2)),
  best: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .4, .1, 'triangle', i * .1))
};
const vib = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

/* ---------- Trạng thái ---------- */
let grid, tray, score = 0, combo = 0, noClear = 0, over = false, newBest = false;
let drag = null, parts = [], cellFx = [], floats = [], shake = 0, flashLines = [];
const cv = $('c'), ctx = cv.getContext('2d'); let W = 0, H = 0, DPR = 1, cell = 40, bx = 0, by = 0, trayY = 0, trayH = 0, trayCell = 24;

function newGame() {
  grid = Array.from({ length: N }, () => Array(N).fill(-1)); score = 0; combo = 0; noClear = 0; over = false; newBest = false; parts = []; cellFx = []; floats = [];
  tray = genTray(); S.games++; hudUpdate(); persistGame();
}
function persistGame() { S.save = over ? null : { grid, tray: tray.map(t => t && { s: t.s, c: t.c }), score, combo, noClear }; persist(); }
function restore(sv) { grid = sv.grid; tray = sv.tray.map(t => t && { s: t.s, c: t.c }); score = sv.score; combo = sv.combo || 0; noClear = sv.noClear || 0; over = false; hudUpdate(); }

/* ---------- Sinh khối công bằng ---------- */
const occupied = () => grid.reduce((a, r) => a + r.filter(v => v >= 0).length, 0);
function canPlace(sh, gy, gx) { return SHAPES[sh].cells.every(([y, x]) => { const r = gy + y, c = gx + x; return r >= 0 && c >= 0 && r < N && c < N && grid[r][c] < 0; }); }
function fitsAnywhere(sh) { for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (canPlace(sh, y, x)) return true; return false; }
function randShape() {
  const fill = occupied() / 64, w = SHAPES.map(s => Math.pow(s.cells.length, -fill * 1.5) * (s.cells.length === 1 ? .6 : 1)), sum = w.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum; for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; } return 0;
}
function genTray() {
  let t; for (let k = 0; k < 40; k++) { t = [0, 1, 2].map(() => ({ s: randShape(), c: Math.floor(Math.random() * COLORS.length) })); if (t.some(p => fitsAnywhere(p.s))) return t; }
  return t;
}

/* ---------- Bố cục ---------- */
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const top = ($('top').offsetHeight || 96) + 4;
  cell = Math.floor(Math.min((W - 24) / N, (H - top - 150) / N, 78)); cell = Math.max(cell, 26);
  bx = Math.round((W - cell * N) / 2); by = Math.round(top + 8 + Math.max(0, (H - top - 150 - cell * N) / 3));
  trayY = by + cell * N + 12; trayH = H - trayY - 8; trayCell = Math.max(14, Math.min(cell * .62, (W / 3 - 18) / 5, (trayH - 12) / 5));
}
window.addEventListener('resize', resize); resize();

/* ---------- Vẽ khối ---------- */
function shade(hex, k) { const n = parseInt(hex.slice(1), 16), f = v => clamp(Math.round(v + (k > 0 ? (255 - v) * k : v * k)), 0, 255); return \`rgb(\${f(n >> 16)},\${f((n >> 8) & 255)},\${f(n & 255)})\`; }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function block(x, y, s, col, a = 1, scale = 1) {
  const p = s * (1 - scale) / 2, q = s * scale, g = Math.max(1, s * .05); ctx.globalAlpha = a;
  const gr = ctx.createLinearGradient(0, y, 0, y + s); gr.addColorStop(0, shade(col, .35)); gr.addColorStop(.5, col); gr.addColorStop(1, shade(col, -.28));
  ctx.fillStyle = gr; rr(x + p + g, y + p + g, q - 2 * g, q - 2 * g, s * .2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.38)'; rr(x + p + s * .14, y + p + s * .1, q - s * .28, q * .22, s * .1); ctx.fill();
  ctx.strokeStyle = shade(col, -.45); ctx.lineWidth = 1.2; rr(x + p + g, y + p + g, q - 2 * g, q - 2 * g, s * .2); ctx.stroke(); ctx.globalAlpha = 1;
}

/* ---------- Đặt khối ---------- */
function anchor() {
  const sh = SHAPES[tray[drag.i].s], off = cell * 2.0, tx = drag.x - sh.w * cell / 2, ty = drag.y - off - sh.h * cell / 2;
  return { gx: Math.round((tx - bx) / cell), gy: Math.round((ty - by) / cell), px: tx, py: ty };
}
function linesIf(sh, gy, gx) {
  const g2 = grid.map(r => r.slice()); SHAPES[sh].cells.forEach(([y, x]) => { g2[gy + y][gx + x] = 99; });
  const rows = [], cols = []; for (let i = 0; i < N; i++) { if (g2[i].every(v => v >= 0)) rows.push(i); if (g2.every(r => r[i] >= 0)) cols.push(i); } return { rows, cols };
}
function place(i, gy, gx) {
  const t = tray[i], sh = SHAPES[t.s]; sh.cells.forEach(([y, x]) => { grid[gy + y][gx + x] = t.c; });
  tray[i] = null; let gained = sh.cells.length; sfx.place();
  const rows = [], cols = []; for (let k = 0; k < N; k++) { if (grid[k].every(v => v >= 0)) rows.push(k); if (grid.every(r => r[k] >= 0)) cols.push(k); }
  const L = rows.length + cols.length;
  if (L > 0) {
    combo = noClear < 3 && combo > 0 ? combo + 1 : 1; noClear = 0;
    const set = new Set(); rows.forEach(r => { for (let c = 0; c < N; c++) set.add(r * N + c); }); cols.forEach(c => { for (let r = 0; r < N; r++) set.add(r * N + c); });
    set.forEach(k => { const r = (k / N) | 0, c = k % N; cellFx.push({ r, c, col: COLORS[grid[r][c]] || '#fff', t: 0 }); for (let q = 0; q < 3; q++) parts.push({ x: bx + (c + .5) * cell, y: by + (r + .5) * cell, vx: rand(-260, 260), vy: rand(-380, 60), life: rand(.5, 1), max: 1, s: rand(4, 9) * cell / 44, col: COLORS[grid[r][c]] || '#fff', rot: rand(0, 6) }); });
    set.forEach(k => { grid[(k / N) | 0][k % N] = -1; });
    const bonus = Math.round(L * (L + 1) / 2 * 10 * (1 + .5 * (combo - 1))); gained += bonus; S.lines += L; S.maxCombo = Math.max(S.maxCombo, combo);
    sfx.clear(L, combo); vib(L > 1 ? 40 : 20); shake = Math.min(14, 3 + L * 2.5);
    const words = L >= 4 ? 'HUYỀN THOẠI!' : L === 3 ? 'SIÊU HẠNG!' : L === 2 ? 'TUYỆT VỜI!' : combo >= 3 ? 'LIÊN HOÀN!' : '';
    floats.push({ x: bx + cell * N / 2, y: by + cell * N * .42, t: '+' + bonus, s: 1, life: 1.2, c: '#fff' });
    if (words) floats.push({ x: bx + cell * N / 2, y: by + cell * N * .28, t: words, s: 1.25, life: 1.4, c: '#ffd84a' });
    if (combo >= 2) floats.push({ x: bx + cell * N / 2, y: by + cell * N * .58, t: 'Combo x' + combo, s: .9, life: 1.2, c: '#ff9be8' });
    if (grid.every(r => r.every(v => v < 0))) { gained += 100; floats.push({ x: bx + cell * N / 2, y: by + cell * N * .7, t: 'SẠCH BẢNG +100', s: 1.1, life: 1.6, c: '#7dffb0' }); }
  } else { noClear++; if (noClear >= 3) combo = 0; }
  score += gained; if (score > S.best && !newBest && S.best > 0) { newBest = true; sfx.best(); floats.push({ x: W / 2, y: by - 6, t: '🏆 KỶ LỤC MỚI!', s: 1, life: 1.6, c: '#ffe066' }); }
  if (tray.every(t => !t)) tray = genTray();
  hudUpdate(); const dead = !tray.some(t => t && fitsAnywhere(t.s));
  if (dead) { setTimeout(gameOver, 650); over = true; } persistGame();
}
function gameOver() {
  sfx.over(); if (score > S.best) S.best = score; S.save = null; persist(); hudUpdate();
  $('oTitle').textContent = newBest && score > 0 ? '🏆 Kỷ lục mới!' : 'Hết chỗ rồi!'; $('oScore').textContent = score.toLocaleString('vi-VN'); $('oInfo').textContent = \`Kỷ lục: \${S.best.toLocaleString('vi-VN')}\`;
  $('over').classList.add('show');
}
function hudUpdate() {
  $('score').textContent = score.toLocaleString('vi-VN'); $('best').textContent = Math.max(S.best, score).toLocaleString('vi-VN');
  const c = $('combo'); c.textContent = combo >= 2 ? \`🔥 Combo x\${combo}\` : ''; c.classList.toggle('on', combo >= 2);
  const s = $('score'); s.classList.add('b'); setTimeout(() => s.classList.remove('b'), 130);
}

/* ---------- Nhập liệu ---------- */
cv.addEventListener('pointerdown', e => {
  audio(); if (over || document.querySelector('.screen.show')) return;
  if (e.clientY >= trayY - 10) { const i = Math.min(2, Math.floor(e.clientX / (W / 3))); if (tray[i]) { drag = { i, x: e.clientX, y: e.clientY, k: 0 }; sfx.pick(); try { cv.setPointerCapture(e.pointerId); } catch (er) {} } }
});
cv.addEventListener('pointermove', e => { if (drag) { drag.x = e.clientX; drag.y = e.clientY; } });
function drop() {
  if (!drag) return; const a = anchor(), t = tray[drag.i];
  if (t && canPlace(t.s, a.gy, a.gx)) place(drag.i, a.gy, a.gx); else if (drag.y < trayY - 20) { sfx.bad(); floats.push({ x: drag.x, y: drag.y - cell * 2, t: 'Không đặt được', s: .7, life: .9, c: '#ff9a9a' }); }
  drag = null;
}
cv.addEventListener('pointerup', drop); cv.addEventListener('pointercancel', () => { drag = null; });

/* ---------- Menu ---------- */
function showStart() {
  $('stBest').textContent = S.best; $('stGames').textContent = S.games; $('stLines').textContent = S.lines;
  if (S.save && S.save.score >= 0) { $('contScore').textContent = S.save.score; $('contBtn').style.display = ''; } else $('contBtn').style.display = 'none';
  $('start').classList.add('show');
}
$('contBtn').onclick = () => { audio(); restore(S.save); $('start').classList.remove('show'); };
$('newBtn').onclick = () => { audio(); newGame(); $('start').classList.remove('show'); };
$('againBtn').onclick = () => { audio(); $('over').classList.remove('show'); newGame(); };
$('menuBtn').onclick = () => { audio(); $('sndBtn').textContent = '🔊 Âm thanh: ' + (S.sfx ? 'Bật' : 'Tắt'); $('menu').classList.add('show'); };
$('resumeBtn').onclick = () => $('menu').classList.remove('show');
$('restartBtn').onclick = () => { $('menu').classList.remove('show'); S.save = null; newGame(); };
$('sndBtn').onclick = () => { S.sfx = !S.sfx; persist(); $('sndBtn').textContent = '🔊 Âm thanh: ' + (S.sfx ? 'Bật' : 'Tắt'); };

/* ---------- Vẽ & vòng lặp ---------- */
function draw(dt) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H); ctx.save(); if (shake > .2) { ctx.translate(rand(-shake, shake), rand(-shake, shake)); shake *= .88; }
  // bảng
  const pad = 8; ctx.fillStyle = 'rgba(10,5,30,.55)'; rr(bx - pad, by - pad, cell * N + pad * 2, cell * N + pad * 2, 18); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 2; rr(bx - pad, by - pad, cell * N + pad * 2, cell * N + pad * 2, 18); ctx.stroke();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { ctx.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.055)' : 'rgba(255,255,255,.1)'; rr(bx + c * cell + 2, by + r * cell + 2, cell - 4, cell - 4, cell * .16); ctx.fill(); }
  // xem trước
  let prev = null;
  if (drag && tray[drag.i]) { const a = anchor(), t = tray[drag.i]; if (canPlace(t.s, a.gy, a.gx)) { prev = { a, t, l: linesIf(t.s, a.gy, a.gx) }; } }
  if (prev) {
    ctx.fillStyle = 'rgba(255,255,255,.22)'; prev.l.rows.forEach(r => { rr(bx, by + r * cell, cell * N, cell, 8); ctx.fill(); }); prev.l.cols.forEach(c => { rr(bx + c * cell, by, cell, cell * N, 8); ctx.fill(); });
  }
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c] >= 0) block(bx + c * cell, by + r * cell, cell, COLORS[grid[r][c]]);
  if (prev) SHAPES[prev.t.s].cells.forEach(([y, x]) => block(bx + (prev.a.gx + x) * cell, by + (prev.a.gy + y) * cell, cell, COLORS[prev.t.c], .5));
  // hiệu ứng xóa
  cellFx.forEach(f => { f.t += dt; const k = clamp(f.t / .38, 0, 1); ctx.globalAlpha = 1 - k; block(bx + f.c * cell, by + f.r * cell, cell, '#ffffff', 1 - k, 1 + k * .35); ctx.globalAlpha = 1; }); cellFx = cellFx.filter(f => f.t < .38);
  // khay
  for (let i = 0; i < 3; i++) {
    const t = tray[i]; if (!t) continue; const sh = SHAPES[t.s], isDrag = drag && drag.i === i, cx = (i + .5) * W / 3, cy = trayY + trayH / 2;
    if (isDrag) { ctx.globalAlpha = .25; }
    const s = trayCell; sh.cells.forEach(([y, x]) => block(cx - sh.w * s / 2 + x * s, cy - sh.h * s / 2 + y * s, s, COLORS[t.c], isDrag ? .3 : 1)); ctx.globalAlpha = 1;
  }
  if (drag && tray[drag.i]) {
    drag.k = Math.min(1, drag.k + dt * 10); const t = tray[drag.i], sh = SHAPES[t.s], a = anchor(), s = lerp(trayCell, cell, drag.k);
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8;
    sh.cells.forEach(([y, x]) => block(drag.x - sh.w * s / 2 + x * s, drag.y - cell * 2 - sh.h * s / 2 + y * s, s, COLORS[t.c], .96)); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  }
  // hạt
  parts.forEach(p => { p.vy += 1100 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; p.rot += dt * 8; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.col; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore(); });
  parts = parts.filter(p => p.life > 0); ctx.globalAlpha = 1;
  floats.forEach(f => { f.life -= dt; f.y -= 34 * dt; ctx.globalAlpha = clamp(f.life * 1.6, 0, 1); ctx.font = \`800 \${Math.round(cell * .62 * f.s)}px "Baloo 2",sans-serif\`; ctx.textAlign = 'center'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(30,10,70,.9)'; ctx.strokeText(f.t, f.x, f.y); ctx.fillStyle = f.c; ctx.fillText(f.t, f.x, f.y); });
  floats = floats.filter(f => f.life > 0); ctx.globalAlpha = 1; ctx.restore();
}
let last = performance.now();
function loop(now) { const dt = Math.min(.04, (now - last) / 1000); last = now; draw(dt); requestAnimationFrame(loop); }

grid = Array.from({ length: N }, () => Array(N).fill(-1)); tray = [null, null, null];
if (S.save && S.save.grid) restore(S.save);
hudUpdate(); showStart(); requestAnimationFrame(loop);
})();
<\/script>
</body>
</html>
`,E=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Phá Gạch Neon</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  html,body{height:100%;overflow:hidden;background:#070b1f;color:#fff;font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif;touch-action:none}
  canvas{position:fixed;inset:0;display:block;touch-action:none}
  button{font-family:inherit;cursor:pointer}
  button:focus-visible{outline:3px solid #7df9ff;outline-offset:2px}
  #hud{position:fixed;top:0;left:0;right:0;display:none;align-items:center;justify-content:space-between;pointer-events:none;z-index:5;gap:8px;
    padding:calc(env(safe-area-inset-top) + 8px) calc(env(safe-area-inset-right) + 12px) 0 calc(env(safe-area-inset-left) + 12px)}
  #hud.on{display:flex}
  .hl{font-size:15px;font-weight:800;opacity:.85;min-width:84px;line-height:1.05;text-shadow:0 0 10px #38bdf8}
  .hl small{display:block;font-size:12px;opacity:.7}
  #score{font-size:34px;font-weight:800;text-shadow:0 0 18px #7df9ff,0 3px 0 rgba(0,0,0,.5);flex:1;text-align:center;line-height:1}
  #mult{font-size:14px;color:#ff9bf3;font-weight:800;display:block;min-height:16px}
  .hr{display:flex;align-items:center;gap:8px;min-width:84px;justify-content:flex-end;pointer-events:auto}
  #lives{font-size:20px;letter-spacing:1px}
  #pauseBtn{width:38px;height:38px;border-radius:50%;border:2px solid rgba(125,249,255,.6);background:rgba(8,20,50,.6);color:#fff;font-size:16px;box-shadow:0 0 12px rgba(56,189,248,.5)}
  #say{position:fixed;left:50%;top:44%;transform:translate(-50%,0);opacity:0;pointer-events:none;font-size:34px;font-weight:800;font-style:italic;white-space:nowrap;z-index:6;
    text-shadow:0 0 22px currentColor,0 3px 0 rgba(0,0,0,.6)}
  #say.show{animation:say 1.3s ease-out}
  @keyframes say{0%{opacity:0;transform:translate(-50%,16px) scale(.6)}15%{opacity:1;transform:translate(-50%,0) scale(1.12)}28%{transform:translate(-50%,0) scale(1)}78%{opacity:1}100%{opacity:0;transform:translate(-50%,-34px)}}
  #tip{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 24px);transform:translateX(-50%);z-index:6;pointer-events:none;font-size:17px;font-weight:700;padding:7px 18px;
    border-radius:99px;background:rgba(8,20,50,.7);border:1.5px solid rgba(125,249,255,.5);opacity:0;transition:opacity .4s;white-space:nowrap;text-shadow:0 0 8px #38bdf8}
  #tip.show{opacity:1}
  .screen{position:fixed;inset:0;z-index:20;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;
    padding:calc(env(safe-area-inset-top) + 12px) 16px calc(env(safe-area-inset-bottom) + 14px);overflow-y:auto}
  .screen.show{display:flex;animation:fade .3s}
  @keyframes fade{from{opacity:0}}
  .logo{font-size:clamp(44px,13vw,76px);font-weight:800;font-style:italic;line-height:.9;text-align:center;color:#fff;
    text-shadow:0 0 12px #7df9ff,0 0 30px #38bdf8,0 0 60px #6366f1,0 4px 0 #0b1b4a}
  .logo small{display:block;font-size:.28em;letter-spacing:2px;font-style:normal;margin-top:8px;color:#c7f6ff;text-shadow:0 0 10px #38bdf8}
  .lv{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;width:min(100%,400px)}
  .lvb{position:relative;aspect-ratio:1;border-radius:16px;border:2px solid rgba(125,249,255,.55);background:linear-gradient(rgba(30,60,140,.55),rgba(12,22,70,.7));color:#fff;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 0 14px rgba(56,189,248,.3),inset 0 0 14px rgba(99,102,241,.25);transition:transform .12s}
  .lvb:active{transform:scale(.94)}
  .lvb b{font-size:28px;font-weight:800;line-height:1;text-shadow:0 0 12px #7df9ff}
  .lvb span{font-size:13px;letter-spacing:1px;line-height:1}
  .lvb.lock{opacity:.4;filter:grayscale(.6)}
  .lvb.cur{border-color:#ffe066;box-shadow:0 0 18px rgba(255,224,102,.7),inset 0 0 14px rgba(255,200,60,.25)}
  .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center}
  .btn{border:0;font-weight:800;font-size:22px;color:#06122e;padding:11px 30px;border-radius:99px;background:linear-gradient(#a5f3fc,#38bdf8);
    box-shadow:0 5px 0 #0b6a99,0 0 22px rgba(56,189,248,.65);font-style:italic}
  .btn:active{transform:translateY(4px);box-shadow:0 1px 0 #0b6a99,0 0 16px rgba(56,189,248,.6)}
  .btn.alt{background:linear-gradient(#e0e7ff,#a5b4fc);box-shadow:0 5px 0 #4f46e5,0 0 18px rgba(129,140,248,.6)}
  .btn.alt:active{box-shadow:0 1px 0 #4f46e5}
  .btn.sm{font-size:15px;padding:7px 16px}
  .stats{display:flex;gap:18px;font-size:13px;font-weight:700;opacity:.9;text-align:center}
  .stats b{display:block;font-size:22px;color:#ffe066;text-shadow:0 0 10px #f59e0b}
  .card{width:min(100%,360px);padding:22px 24px;border-radius:28px;text-align:center;background:rgba(10,18,56,.88);border:2px solid rgba(125,249,255,.5);
    box-shadow:0 0 40px rgba(56,189,248,.4),inset 0 0 30px rgba(99,102,241,.2);backdrop-filter:blur(10px);display:flex;flex-direction:column;gap:8px;align-items:center}
  .card h2{font-size:34px;font-weight:800;font-style:italic;line-height:1;color:#ffe066;text-shadow:0 0 18px #f59e0b}
  .card .big{font-size:56px;font-weight:800;line-height:1;text-shadow:0 0 18px #7df9ff}
  .card .sm{font-size:16px;font-weight:600;opacity:.9}
  .stars{font-size:46px;letter-spacing:6px;line-height:1}
  .col{display:flex;flex-direction:column;gap:10px;width:100%;margin-top:6px}
  #pause,#over,#clear{background:rgba(4,8,28,.6);backdrop-filter:blur(3px)}
  @media (max-height:560px){.logo{font-size:40px}.lv{width:min(100%,520px);grid-template-columns:repeat(6,1fr);gap:6px}.lvb b{font-size:20px}.card{padding:12px 16px}.card .big{font-size:36px}.stars{font-size:32px}}
  @media (prefers-reduced-motion:reduce){#say.show{animation:none;opacity:1}}
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="hud">
  <div class="hl"><small>MÀN</small><span id="lvName">1</span></div>
  <div id="score">0<span id="mult"></span></div>
  <div class="hr"><div id="lives"></div><button id="pauseBtn" aria-label="Tạm dừng">⏸</button></div>
</div>
<div id="say"></div><div id="tip"></div>

<div class="screen show" id="menu">
  <div class="logo">PHÁ GẠCH<br>NEON<small>CHỌN MÀN · THU 3 SAO</small></div>
  <button class="btn" id="contBtn">▶ CHƠI TIẾP · MÀN 1</button>
  <div class="lv" id="lvGrid"></div>
  <div class="stats"><div><b id="stStars">0</b>sao</div><div><b id="stBest">0</b>điểm cao nhất</div><div><b id="stBricks">0</b>gạch đã phá</div></div>
  <div class="row"><button class="btn alt sm" id="sndBtn">🔊 Âm thanh</button></div>
</div>
<div class="screen" id="clear">
  <div class="card"><h2>Hoàn thành!</h2><div class="stars" id="cStars">⭐⭐⭐</div><div class="sm">Điểm</div><div class="big" id="cScore">0</div><div class="sm" id="cInfo"></div>
    <div class="col"><button class="btn" id="nextBtn">MÀN TIẾP ▶</button><button class="btn alt sm" id="clearRetry">↺ Chơi lại màn này</button><button class="btn alt sm" id="clearMenu">☰ Chọn màn</button></div></div>
</div>
<div class="screen" id="over">
  <div class="card"><h2>Hết mạng!</h2><div class="sm">Điểm</div><div class="big" id="oScore">0</div><div class="sm" id="oInfo"></div>
    <div class="col"><button class="btn" id="retryBtn">CHƠI LẠI</button><button class="btn alt sm" id="overMenu">☰ Chọn màn</button></div></div>
</div>
<div class="screen" id="pause">
  <div class="card"><h2>Tạm dừng</h2><div class="col"><button class="btn" id="resumeBtn">TIẾP TỤC</button><button class="btn alt sm" id="pauseRetry">↺ Chơi lại</button><button class="btn alt sm" id="pauseMenu">☰ Chọn màn</button></div></div>
</div>

<script>
(() => {
'use strict';
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const COLS = 10;

/* ---------- Lưu tiến trình ---------- */
const KEY = 'pha-gach-v1'; let mem = null;
const load = () => { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} return mem ? JSON.parse(mem) : {}; };
const S = Object.assign({ unlocked: 1, lv: {}, best: 0, bricks: 0, last: 0, sfx: true }, load());
const persist = () => { const s = JSON.stringify(S); try { localStorage.setItem(KEY, s); } catch (e) { mem = s; } };

/* ---------- Màn chơi ---------- */
const LEVELS = [
  ['Khởi động', ['..........', '1111111111', '1111111111', '1111111111']],
  ['Kim cương', ['....11....', '...1111...', '..111111..', '.11111111.', '..111111..', '...1111...', '....11....']],
  ['Hai tầng', ['1111111111', '2222222222', '..........', '1111111111', '2222222222']],
  ['Hàng rào thép', ['1111111111', '1111111111', '1111111111', 'S.S.S.S.S.', '2222222222']],
  ['Nổ tung', ['1111111111', '1E111111E1', '1111111111', '11E1111E11', '1111111111']],
  ['Kim tự tháp', ['....SS....', '...2222...', '..222222..', '.22222222.', '1111111111']],
  ['Mê cung', ['2222222222', '2........2', '2.111111.2', '2.1EEEE1.2', '2.111111.2', '2........2', 'SSSS..SSSS']],
  ['Trái tim', ['.11....11.', '1221..1221', '1222222221', '1222222221', '.12222221.', '..122221..', '...1221...', '....11....']],
  ['Cầu thang', ['S.........', '1S........', '11S.......', '111S......', '1111S.....', '11111S....', '111111S...', '2222222S..']],
  ['Pháo hoa', ['3E3E3E3E3E', '1111111111', '2222222222', '1111111111', 'E3E3E3E3E3']],
  ['Pháo đài', ['SSSSSSSSSS', 'S33333333S', 'S32222223S', 'S32111123S', 'S32222223S', 'S33333333S', 'SSSS..SSSS']],
  ['Trùm cuối', ['3E3333333E', '3222222223', '2E1E11E1E2', '1111111111', 'S.S.S.S.S.', '3333333333']]
];
const POW = { E: { c: '#4ade80', t: 'Mở rộng!' }, M: { c: '#22d3ee', t: 'Nhiều bóng!' }, F: { c: '#fb923c', t: 'Bóng lửa!' }, L: { c: '#f472b6', t: 'Súng laser!' }, S: { c: '#60a5fa', t: 'Bóng chậm!' }, H: { c: '#f87171', t: '+1 mạng!' } };

/* ---------- Âm thanh ---------- */
let ac = null;
const audio = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ac && ac.state === 'suspended') ac.resume(); };
function tone(f, d = .12, v = .1, type = 'sine', delay = 0, slide = 0) {
  if (!ac || !S.sfx) return; const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .05);
}
function noise(d = .3, v = .15, cut = 1500) {
  if (!ac || !S.sfx) return; const len = Math.floor(ac.sampleRate * d), buf = ac.createBuffer(1, len, ac.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ac.createBufferSource(); s.buffer = buf; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cut; const g = ac.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(ac.destination); s.start();
}
let lastL = 0;
const sfx = {
  paddle: () => tone(260, .09, .12, 'triangle', 0, 120), wall: () => tone(190, .05, .05, 'triangle'),
  hit: row => tone(420 + (row || 0) * 50, .08, .08, 'square'), steel: () => tone(900, .06, .06, 'triangle', 0, -300),
  brk: row => { tone(520 + (row || 0) * 60, .12, .1, 'triangle', 0, 200); tone(780 + (row || 0) * 60, .14, .06, 'sine', .04); },
  boom: () => { noise(.45, .22, 1100); tone(100, .35, .15, 'sawtooth', 0, -50); },
  pow: () => [660, 880, 1175].forEach((f, i) => tone(f, .18, .08, 'triangle', i * .06)),
  laser: () => { const n = performance.now(); if (n - lastL > 100) { lastL = n; tone(1400, .08, .05, 'sawtooth', 0, -900); } },
  life: () => { tone(220, .35, .14, 'sawtooth', 0, -120); noise(.25, .1, 600); },
  win: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, .4, .1, 'triangle', i * .1)),
  over: () => [330, 262, 196].forEach((f, i) => tone(f, .4, .12, 'sawtooth', i * .22)),
  tap: () => tone(620, .07, .06, 'triangle')
};
const vib = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

/* ---------- Canvas ---------- */
const cv = $('c'), ctx = cv.getContext('2d'); let W = 0, H = 0, DPR = 1, bw = 40, bh = 18, topY = 70, pY = 0, bgStars = [];
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  bw = (W - 16) / COLS; bh = clamp(bw * .44, 15, 30); topY = 66 + (parseFloat(getComputedStyle($('hud')).paddingTop) || 8); pY = H - Math.max(78, H * .11) - 6;
  bgStars = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .3, s: Math.random() * .5 + .1, p: Math.random() * 6 }));
  if (G) layoutBricks();
}

/* ---------- Trạng thái ---------- */
let state = 'menu', G = null, T = 0, shake = 0, flash = 0, down = false, ptrX = 0, moved = 0, parts = [], floats = [], bolts = [], caps = [];
function tip(t, ms = 4000) { const e = $('tip'); e.textContent = t; e.classList.add('show'); clearTimeout(tip.t); tip.t = setTimeout(() => e.classList.remove('show'), ms); }
function say(t, c = '#7df9ff') { const e = $('say'); e.textContent = t; e.style.color = c; e.classList.remove('show'); void e.offsetWidth; e.classList.add('show'); }

function layoutBricks() { G.bricks.forEach(b => { b.x = 8 + b.c * bw; b.y = topY + 24 + b.r * (bh + 3); b.w = bw - 3; b.h = bh; }); }
function startLevel(i) {
  const [name, map] = LEVELS[i]; S.last = i; persist();
  const bricks = []; map.forEach((row, r) => { for (let c = 0; c < COLS; c++) { const ch = row[c] || '.'; if (ch === '.') continue; bricks.push({ r, c, kind: ch === 'S' ? 'S' : ch === 'E' ? 'E' : 'N', hp: ch === 'S' ? 99 : ch === 'E' ? 1 : +ch, max: ch === 'S' ? 99 : ch === 'E' ? 1 : +ch, hue: (r * 38 + i * 31) % 360, alive: true, hit: 0 }); } });
  G = { i, name, bricks, score: 0, lives: 3, hits: 0, pw: clamp(W * .21, 76, 150), px: W / 2, tx: W / 2, balls: [], fx: { E: 0, F: 0, L: 0, S: 0 }, laserT: 0, ended: false, levelLost: false, destroyed: 0 };
  G.balls.push(newBall()); G.total = bricks.filter(b => b.kind !== 'S').length; layoutBricks(); parts = []; floats = []; bolts = []; caps = []; shake = 0; flash = 0;
  state = 'play'; ['menu', 'clear', 'over', 'pause'].forEach(s => $(s).classList.remove('show')); $('hud').classList.add('on'); $('lvName').textContent = \`\${i + 1} · \${name}\`; hud();
  say(\`MÀN \${i + 1}\`, '#ffe066'); if (i === 0) tip('Kéo ngón tay để di chuyển thanh · Chạm để bắn bóng', 6000);
}
const spd0 = () => H * (.6 + Math.min(G.i, 11) * .018) * (G.fx.S > 0 ? .72 : 1);
function newBall() { return { x: 0, y: 0, vx: 0, vy: 0, r: clamp(bw * .17, 6, 11), stuck: true, trail: [] }; }
function paddleW() { return G.pw * (G.fx.E > 0 ? 1.55 : 1); }
function hud() {
  $('score').firstChild.nodeValue = G.score.toLocaleString('vi-VN'); $('lives').textContent = '❤️'.repeat(Math.max(0, G.lives));
  const m = mult(); $('mult').textContent = m > 1 ? \`COMBO x\${m}\` : '';
}
const mult = () => Math.min(5, 1 + Math.floor(G.hits / 4));
function launch() { let any = false; G.balls.forEach(b => { if (b.stuck) { b.stuck = false; const a = rand(-.3, .3), s = spd0(); b.vx = Math.sin(a) * s; b.vy = -Math.cos(a) * s; any = true; sfx.paddle(); } }); return any; }

/* ---------- Hiệu ứng ---------- */
function burst(x, y, col, n = 10, spd = 260) { for (let i = 0; i < n; i++) { const a = rand(0, 6.283), v = rand(.3, 1) * spd; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: rand(.4, .9), max: .9, s: rand(2.5, 6), c: col }); } }
function addScore(n, x, y) { const m = mult(); const v = n * m; G.score += v; floats.push({ x, y, t: '+' + v, life: .8, c: m > 1 ? '#ff9bf3' : '#fff' }); }

/* ---------- Gạch bị phá ---------- */
function brickColor(b) { return b.kind === 'S' ? '#94a3b8' : b.kind === 'E' ? '#fb923c' : b.hp >= 3 ? '#fb7185' : b.hp === 2 ? '#a78bfa' : \`hsl(\${b.hue},90%,60%)\`; }
function destroy(b, chain = 0) {
  if (!b.alive) return; b.alive = false; G.destroyed++; S.bricks++; G.hits++; const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  addScore(10 * b.max, cx, cy); burst(cx, cy, brickColor(b), 10); sfx.brk(b.r);
  if (Math.random() < .17 && b.kind !== 'E') caps.push({ x: cx, y: cy, k: pick(['E', 'M', 'F', 'L', 'S', 'H', 'E', 'M']) });
  if (b.kind === 'E') {
    sfx.boom(); shake = 10; flash = .3; burst(cx, cy, '#ffb347', 26, 420);
    G.bricks.forEach(o => { if (o.alive && o.kind !== 'S' && Math.abs(o.x + o.w / 2 - cx) < bw * 1.6 && Math.abs(o.y + o.h / 2 - cy) < (bh + 3) * 1.7) { o.hp = 0; setTimeout(() => destroy(o, chain + 1), 70 + chain * 40); } });
  }
  hud(); checkClear();
}
function hitBrick(b, ball) {
  if (b.kind === 'S') { sfx.steel(); b.hit = .15; return false; }
  if (ball && G.fx.F > 0) { b.hp = 0; } else b.hp--; b.hit = .15; sfx.hit(b.r);
  if (b.hp <= 0) { destroy(b); return true; } hud(); return false;
}
function checkClear() { if (!G.ended && G.bricks.every(b => !b.alive || b.kind === 'S')) { G.ended = true; setTimeout(winLevel, 650); } }
function winLevel() {
  state = 'clear'; sfx.win(); vib(40); const stars = G.lives >= 3 && !G.levelLost ? 3 : G.lives >= 2 ? 2 : 1, key = String(G.i), cur = S.lv[key] || { stars: 0, best: 0 };
  S.lv[key] = { stars: Math.max(cur.stars, stars), best: Math.max(cur.best, G.score) }; S.unlocked = Math.max(S.unlocked, Math.min(LEVELS.length, G.i + 2)); S.best = Math.max(S.best, G.score); persist();
  $('cStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars); $('cScore').textContent = G.score.toLocaleString('vi-VN'); $('cInfo').textContent = G.score >= cur.best && cur.best ? '🏆 Kỷ lục màn mới!' : \`Kỷ lục màn: \${S.lv[key].best.toLocaleString('vi-VN')}\`;
  $('nextBtn').style.display = G.i + 1 < LEVELS.length ? '' : 'none'; $('hud').classList.remove('on'); $('clear').classList.add('show');
}
function loseGame() {
  state = 'over'; sfx.over(); S.best = Math.max(S.best, G.score); persist(); $('hud').classList.remove('on'); $('oScore').textContent = G.score.toLocaleString('vi-VN'); $('oInfo').textContent = \`Màn \${G.i + 1} · \${G.name}\`; $('over').classList.add('show');
}

/* ---------- Cập nhật ---------- */
function substep(b, dt) {
  const r = b.r; b.x += b.vx * dt; b.y += b.vy * dt;
  if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx); sfx.wall(); } if (b.x > W - r) { b.x = W - r; b.vx = -Math.abs(b.vx); sfx.wall(); } if (b.y < topY - 4 + r) { b.y = topY - 4 + r; b.vy = Math.abs(b.vy); sfx.wall(); }
  const pw = paddleW();
  if (b.vy > 0 && b.y + r >= pY && b.y - r <= pY + 14 && Math.abs(b.x - G.px) <= pw / 2 + r) {
    const t = clamp((b.x - G.px) / (pw / 2), -1, 1), a = t * 1.05, s = spd0(); b.vx = Math.sin(a) * s; b.vy = -Math.cos(a) * s; b.y = pY - r; G.hits = 0; hud(); sfx.paddle(); burst(b.x, pY, '#7df9ff', 4, 120);
  }
  for (const k of G.bricks) {
    if (!k.alive) continue; const cx = k.x + k.w / 2, cy = k.y + k.h / 2, ox = k.w / 2 + r - Math.abs(b.x - cx), oy = k.h / 2 + r - Math.abs(b.y - cy);
    if (ox > 0 && oy > 0) {
      const killed = hitBrick(k, b), pierce = G.fx.F > 0 && k.kind !== 'S';
      if (!pierce || !killed && k.kind === 'S') { if (ox < oy) { b.vx = (b.x < cx ? -1 : 1) * Math.abs(b.vx); b.x += (b.x < cx ? -ox : ox); } else { b.vy = (b.y < cy ? -1 : 1) * Math.abs(b.vy); b.y += (b.y < cy ? -oy : oy); } }
      break;
    }
  }
}
function applyPower(k) {
  sfx.pow(); const p = POW[k]; say(p.t, p.c); burst(G.px, pY, p.c, 16, 260); G.hits += 2;
  if (k === 'E') G.fx.E = 14; else if (k === 'F') G.fx.F = 12; else if (k === 'L') { G.fx.L = 11; } else if (k === 'S') G.fx.S = 12; else if (k === 'H') { G.lives = Math.min(5, G.lives + 1); hud(); }
  else if (k === 'M') { const base = G.balls.filter(b => !b.stuck); const src = base[0] || G.balls[0]; for (let i = 0; i < 2; i++) { const a = (i ? 1 : -1) * .5, sp = Math.hypot(src.vx, src.vy) || spd0(); const nb = newBall(); nb.stuck = false; nb.x = src.x; nb.y = src.y; const ang = Math.atan2(src.vx, -src.vy) + a; nb.vx = Math.sin(ang) * sp; nb.vy = -Math.cos(ang) * sp; G.balls.push(nb); } }
}
function update(dt) {
  T += dt; shake = Math.max(0, shake - dt * 30); flash = Math.max(0, flash - dt * 2);
  if (state !== 'play') return;
  G.px += (clamp(G.tx, paddleW() / 2, W - paddleW() / 2) - G.px) * Math.min(1, dt * 28);
  Object.keys(G.fx).forEach(k => { if (G.fx[k] > 0) { G.fx[k] -= dt; if (k === 'S' && G.fx[k] <= 0) G.balls.forEach(b => { if (!b.stuck) { const s = Math.hypot(b.vx, b.vy) || 1, n = spd0(); b.vx *= n / s; b.vy *= n / s; } }); } });
  for (let bi = G.balls.length - 1; bi >= 0; bi--) {
    const b = G.balls[bi];
    if (b.stuck) { b.x = G.px; b.y = pY - b.r - 2; continue; }
    const sp = Math.hypot(b.vx, b.vy), n = Math.max(1, Math.ceil(sp * dt / (b.r * .6))), h = dt / n;
    for (let k = 0; k < n; k++) substep(b, h);
    const s2 = Math.hypot(b.vx, b.vy), want = spd0(); if (s2 > 0) { const f = lerp(1, want / s2, Math.min(1, dt * 4)); b.vx *= f; b.vy *= f; }
    if (Math.abs(b.vy) < want * .22) b.vy = (b.vy < 0 ? -1 : 1) * want * .22;
    b.trail.push({ x: b.x, y: b.y }); if (b.trail.length > 9) b.trail.shift();
    if (b.y - b.r > H) G.balls.splice(bi, 1);
  }
  if (!G.balls.length && !G.ended) {
    G.lives--; G.levelLost = true; G.hits = 0; sfx.life(); shake = 14; vib(60); flash = .4; hud();
    if (G.lives <= 0) { G.ended = true; setTimeout(loseGame, 500); } else { G.balls.push(newBall()); G.fx = { E: 0, F: 0, L: 0, S: 0 }; tip('Chạm để bắn bóng', 2500); }
  }
  if (G.fx.L > 0) { G.laserT -= dt; if (G.laserT <= 0) { G.laserT = .28; const pw = paddleW(); [-1, 1].forEach(s => bolts.push({ x: G.px + s * (pw / 2 - 8), y: pY - 6 })); sfx.laser(); } }
  bolts.forEach(b => { b.y -= H * 1.5 * dt; for (const k of G.bricks) { if (k.alive && b.x > k.x && b.x < k.x + k.w && b.y > k.y && b.y < k.y + k.h) { hitBrick(k, null); b.dead = true; break; } } if (b.y < topY - 6) b.dead = true; }); bolts = bolts.filter(b => !b.dead);
  caps.forEach(c => { c.y += H * .27 * dt; if (c.y > pY - 6 && c.y < pY + 24 && Math.abs(c.x - G.px) < paddleW() / 2 + 14) { c.dead = true; applyPower(c.k); } else if (c.y > H + 20) c.dead = true; }); caps = caps.filter(c => !c.dead);
  G.bricks.forEach(k => { if (k.hit > 0) k.hit -= dt; });
  parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 700 * dt; p.life -= dt; }); parts = parts.filter(p => p.life > 0);
  floats.forEach(f => { f.y -= 40 * dt; f.life -= dt; }); floats = floats.filter(f => f.life > 0);
}

/* ---------- Vẽ ---------- */
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function drawBg() {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1038'); g.addColorStop(.6, '#0b0f2c'); g.addColorStop(1, '#05071a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(99,102,241,.14)'; ctx.lineWidth = 1; const off = (T * 18) % 40;
  for (let y = off; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  bgStars.forEach(s => { ctx.globalAlpha = .3 + .6 * Math.abs(Math.sin(T * s.s + s.p)); ctx.fillStyle = '#c7d2fe'; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, 6.283); ctx.fill(); }); ctx.globalAlpha = 1;
}
function drawBrick(k) {
  const col = brickColor(k), g = ctx.createLinearGradient(0, k.y, 0, k.y + k.h);
  if (k.kind === 'S') { g.addColorStop(0, '#cbd5e1'); g.addColorStop(.5, '#94a3b8'); g.addColorStop(1, '#64748b'); } else { g.addColorStop(0, '#fff'); g.addColorStop(.18, col); g.addColorStop(1, col); }
  ctx.globalAlpha = k.hit > 0 ? .75 : 1; ctx.fillStyle = g; rr(k.x, k.y, k.w, k.h, 4); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.2; rr(k.x + .5, k.y + .5, k.w - 1, k.h - 1, 4); ctx.stroke();
  if (k.kind === 'S') { ctx.fillStyle = 'rgba(30,41,59,.7)'; [6, k.w - 6].forEach(x => { ctx.beginPath(); ctx.arc(k.x + x, k.y + k.h / 2, 1.8, 0, 6.283); ctx.fill(); }); }
  else if (k.kind === 'E') { ctx.font = \`\${k.h * .85}px "Apple Color Emoji","Segoe UI Emoji",sans-serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = .75 + .25 * Math.sin(T * 8); ctx.fillText('💥', k.x + k.w / 2, k.y + k.h / 2 + 1); }
  else if (k.max > 1) { ctx.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < k.hp; i++) { ctx.beginPath(); ctx.arc(k.x + k.w / 2 + (i - (k.hp - 1) / 2) * 6, k.y + k.h / 2, 1.8, 0, 6.283); ctx.fill(); } }
  ctx.globalAlpha = 1;
}
function draw() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.save(); if (shake > .3) ctx.translate(rand(-shake, shake), rand(-shake, shake)); drawBg();
  if (G && (state === 'play' || state === 'clear' || state === 'over' || state === 'pause')) {
    G.bricks.forEach(k => { if (k.alive) drawBrick(k); });
    caps.forEach(c => { const p = POW[c.k]; ctx.shadowColor = p.c; ctx.shadowBlur = 12; ctx.fillStyle = p.c; rr(c.x - 15, c.y - 10, 30, 20, 10); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#06122e'; ctx.font = '800 14px "Baloo 2",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.k === 'H' ? '♥' : c.k, c.x, c.y + 1); });
    bolts.forEach(b => { ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 10; ctx.fillStyle = '#ffd6f3'; ctx.fillRect(b.x - 1.5, b.y - 9, 3, 18); ctx.shadowBlur = 0; });
    const pw = paddleW(), px = G.px - pw / 2, pg = ctx.createLinearGradient(0, pY, 0, pY + 14); pg.addColorStop(0, '#e0fbff'); pg.addColorStop(1, G.fx.L > 0 ? '#f472b6' : '#22d3ee');
    ctx.shadowColor = G.fx.L > 0 ? '#f472b6' : '#22d3ee'; ctx.shadowBlur = 16; ctx.fillStyle = pg; rr(px, pY, pw, 14, 7); ctx.fill(); ctx.shadowBlur = 0;
    if (G.fx.L > 0) { ctx.fillStyle = '#fff'; [px + 4, px + pw - 10].forEach(x => ctx.fillRect(x, pY - 7, 6, 8)); }
    G.balls.forEach(b => {
      const fire = G.fx.F > 0; b.trail.forEach((t, i) => { ctx.globalAlpha = i / b.trail.length * .4; ctx.fillStyle = fire ? '#fb923c' : '#7df9ff'; ctx.beginPath(); ctx.arc(t.x, t.y, b.r * (.4 + i / b.trail.length * .6), 0, 6.283); ctx.fill(); }); ctx.globalAlpha = 1;
      ctx.shadowColor = fire ? '#fb923c' : '#7df9ff'; ctx.shadowBlur = 16; ctx.fillStyle = fire ? '#ffd9a0' : '#fff'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
    });
    parts.forEach(p => { ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.c; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }); ctx.globalAlpha = 1;
    floats.forEach(f => { ctx.globalAlpha = clamp(f.life * 1.6, 0, 1); ctx.font = '800 17px "Baloo 2",sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = f.c; ctx.fillText(f.t, f.x, f.y); }); ctx.globalAlpha = 1;
    // thanh hiệu ứng
    let ix = 10; [['E', 'Rộng'], ['F', 'Lửa'], ['L', 'Laser'], ['S', 'Chậm']].forEach(([k, n]) => { if (G.fx[k] > 0) { ctx.fillStyle = POW[k].c; ctx.globalAlpha = .9; rr(ix, H - 22, 56, 14, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = '#06122e'; ctx.font = '800 10px "Baloo 2",sans-serif'; ctx.textAlign = 'left'; ctx.fillText(n + ' ' + Math.ceil(G.fx[k]), ix + 7, H - 12); ix += 62; } });
  }
  if (flash > 0) { ctx.fillStyle = \`rgba(255,255,255,\${flash * .5})\`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}

/* ---------- Nhập liệu ---------- */
window.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; audio(); down = true; ptrX = e.clientX; moved = 0; });
window.addEventListener('pointermove', e => {
  if (state !== 'play' || !G) return; if (e.pointerType === 'mouse') { G.tx = e.clientX; return; }
  if (down) { const dx = e.clientX - ptrX; G.tx += dx * 1.3; moved += Math.abs(dx); } ptrX = e.clientX;
});
window.addEventListener('pointerup', e => { if (down && state === 'play' && G && moved < 12 && !e.target.closest('button')) launch(); down = false; });
window.addEventListener('pointercancel', () => { down = false; });
window.addEventListener('keydown', e => { if (state !== 'play' || !G) return; if (e.key === 'ArrowLeft') G.tx -= 50; if (e.key === 'ArrowRight') G.tx += 50; if (e.key === ' ') { e.preventDefault(); launch(); } });

/* ---------- Menu ---------- */
function renderMenu() {
  const grid = $('lvGrid'); grid.innerHTML = ''; let stars = 0;
  LEVELS.forEach((l, i) => {
    const ok = i < S.unlocked, st = (S.lv[i] || {}).stars || 0; stars += st; const b = document.createElement('button'); b.className = 'lvb' + (ok ? '' : ' lock') + (i === Math.min(S.last, S.unlocked - 1) ? ' cur' : '');
    b.innerHTML = \`<b>\${ok ? i + 1 : '🔒'}</b><span>\${ok ? '⭐'.repeat(st) + '☆'.repeat(3 - st) : ''}</span>\`; b.setAttribute('aria-label', 'Màn ' + (i + 1));
    b.onclick = () => { audio(); if (!ok) { tone(200, .15, .08, 'sawtooth'); return; } sfx.tap(); startLevel(i); }; grid.appendChild(b);
  });
  $('stStars').textContent = stars; $('stBest').textContent = S.best.toLocaleString('vi-VN'); $('stBricks').textContent = S.bricks.toLocaleString('vi-VN');
  const cur = Math.min(S.last, S.unlocked - 1); $('contBtn').textContent = \`▶ CHƠI TIẾP · MÀN \${cur + 1}\`; $('contBtn').onclick = () => { audio(); sfx.tap(); startLevel(cur); };
  $('sndBtn').textContent = '🔊 Âm thanh: ' + (S.sfx ? 'Bật' : 'Tắt');
}
function toMenu() { state = 'menu'; G = null; ['clear', 'over', 'pause'].forEach(s => $(s).classList.remove('show')); $('hud').classList.remove('on'); renderMenu(); $('menu').classList.add('show'); }
$('sndBtn').onclick = () => { S.sfx = !S.sfx; persist(); renderMenu(); };
$('nextBtn').onclick = () => { audio(); startLevel(G.i + 1); }; $('clearRetry').onclick = $('retryBtn').onclick = $('pauseRetry').onclick = () => { audio(); startLevel(G.i); };
$('clearMenu').onclick = $('overMenu').onclick = $('pauseMenu').onclick = toMenu;
$('pauseBtn').onclick = () => { if (state !== 'play') return; state = 'pause'; $('pause').classList.add('show'); }; $('resumeBtn').onclick = () => { state = 'play'; $('pause').classList.remove('show'); };
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'play') { state = 'pause'; $('pause').classList.add('show'); } });

let last = performance.now();
function loop(now) { const dt = Math.min(.033, (now - last) / 1000); last = now; update(dt); draw(); requestAnimationFrame(loop); }
window.addEventListener('resize', resize); resize(); renderMenu(); requestAnimationFrame(loop);
})();
<\/script>
</body>
</html>
`,D=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Nhảy Xoáy</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  html,body{height:100%;overflow:hidden;font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif;color:#fff;background:#7ee8fa}
  #bg{position:fixed;inset:0;background:linear-gradient(180deg,#7ee8fa,#eec0c6);transition:opacity .6s}
  .orb{position:fixed;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.55),rgba(255,255,255,.08));
    filter:blur(2px);animation:float 14s ease-in-out infinite;pointer-events:none}
  .orb:nth-child(2){width:120px;height:120px;left:6%;top:18%}
  .orb:nth-child(3){width:70px;height:70px;right:10%;top:34%;animation-delay:-4s;animation-duration:11s}
  .orb:nth-child(4){width:170px;height:170px;left:62%;top:66%;animation-delay:-8s;animation-duration:17s}
  .orb:nth-child(5){width:54px;height:54px;left:14%;top:72%;animation-delay:-2s;animation-duration:12s}
  @keyframes float{50%{transform:translateY(-28px) translateX(10px)}}
  #stage{position:fixed;inset:0}
  #stage canvas{display:block;width:100%;height:100%;touch-action:none}

  /* HUD */
  #hud{position:fixed;top:0;left:0;right:0;padding:calc(env(safe-area-inset-top) + 10px) 14px 0;pointer-events:none;
    display:flex;flex-direction:column;align-items:center;gap:6px;transition:opacity .3s}
  #hud.off{opacity:0}
  .row{width:100%;display:flex;justify-content:space-between;align-items:center}
  .ib{pointer-events:auto;width:44px;height:44px;border-radius:50%;border:0;cursor:pointer;font-size:19px;color:#fff;
    background:rgba(255,255,255,.28);backdrop-filter:blur(8px);box-shadow:inset 0 0 0 2px rgba(255,255,255,.55),0 4px 10px rgba(0,0,0,.12);
    transition:transform .12s}
  .ib:active{transform:scale(.9)}
  #score{font-size:68px;font-weight:800;line-height:1;text-shadow:0 4px 0 rgba(0,0,0,.16),0 0 24px rgba(255,255,255,.35);
    transition:transform .15s}
  #score.b{transform:scale(1.18)}
  .prog{display:flex;align-items:center;gap:8px;width:min(78vw,340px)}
  .node{width:32px;height:32px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;font-size:15px;
    background:rgba(255,255,255,.3);box-shadow:inset 0 0 0 2px rgba(255,255,255,.7);text-shadow:0 1px 0 rgba(0,0,0,.15)}
  .node.now{background:#fff;color:#ff6a8a;text-shadow:none}
  .bar{flex:1;height:12px;border-radius:12px;background:rgba(255,255,255,.3);overflow:hidden;box-shadow:inset 0 0 0 2px rgba(255,255,255,.5)}
  .bar i{display:block;height:100%;width:0;border-radius:12px;background:linear-gradient(90deg,#fff,#ffe8a3)}
  #best{font-size:14px;font-weight:700;opacity:.9;text-shadow:0 1px 0 rgba(0,0,0,.15)}
  #pop{position:fixed;left:50%;top:32%;transform:translate(-50%,0) scale(.6);opacity:0;pointer-events:none;font-size:44px;font-weight:800;
    text-shadow:0 4px 0 rgba(0,0,0,.2),0 0 26px rgba(255,190,80,.8);white-space:nowrap}
  #pop.show{animation:popIn 1s ease-out}
  @keyframes popIn{0%{opacity:0;transform:translate(-50%,10px) scale(.5)}18%{opacity:1;transform:translate(-50%,0) scale(1.15)}
    30%{transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-40px) scale(1)}}

  /* Màn hình */
  .screen{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
    padding:20px;text-align:center;opacity:0;pointer-events:none;transition:opacity .35s;background:rgba(40,20,70,.22);backdrop-filter:blur(3px)}
  .screen.show{opacity:1;pointer-events:auto}
  .title{font-size:clamp(58px,17vw,92px);font-weight:800;line-height:.9;letter-spacing:1px;
    text-shadow:0 2px 0 #ff9ec0,0 5px 0 #ff6a9a,0 8px 0 #d94a7b,0 12px 0 rgba(0,0,0,.18),0 0 40px rgba(255,255,255,.5)}
  .sub{font-size:19px;font-weight:600;opacity:.95;text-shadow:0 2px 0 rgba(0,0,0,.15)}
  .btn{border:0;cursor:pointer;font:inherit;font-weight:800;font-size:26px;color:#fff;padding:12px 44px;border-radius:99px;
    background:linear-gradient(#ff8fb1,#ff5a8a);box-shadow:0 7px 0 #c93a68,0 14px 22px rgba(0,0,0,.22);text-shadow:0 2px 0 rgba(0,0,0,.2);
    transition:transform .1s,box-shadow .1s;animation:pulse 1.8s ease-in-out infinite}
  .btn:active{transform:translateY(5px);box-shadow:0 2px 0 #c93a68,0 6px 10px rgba(0,0,0,.2)}
  .btn.alt{background:linear-gradient(#ffe37a,#ffb92e);box-shadow:0 7px 0 #c98a10,0 14px 22px rgba(0,0,0,.22);color:#6a3d00;text-shadow:none}
  .btn.alt:active{box-shadow:0 2px 0 #c98a10}
  @keyframes pulse{50%{transform:scale(1.05)}}
  .panel{background:rgba(255,255,255,.22);border-radius:30px;padding:22px 34px;backdrop-filter:blur(12px);
    box-shadow:inset 0 0 0 2px rgba(255,255,255,.55),0 16px 40px rgba(0,0,0,.2);min-width:min(80vw,300px)}
  .panel h2{font-size:38px;font-weight:800;line-height:1;text-shadow:0 3px 0 rgba(0,0,0,.15)}
  .panel .big{font-size:60px;font-weight:800;line-height:1.1;text-shadow:0 4px 0 rgba(0,0,0,.15)}
  .panel .sm{font-size:17px;font-weight:600;opacity:.95}
  .hand{font-size:44px;animation:swipe 1.8s ease-in-out infinite}
  @keyframes swipe{0%,100%{transform:translateX(-46px) rotate(-14deg)}50%{transform:translateX(46px) rotate(14deg)}}
  .stars{font-size:42px;letter-spacing:6px}
  button:focus-visible{outline:3px solid #fff;outline-offset:3px}
  @media (prefers-reduced-motion:reduce){.orb,.btn,.hand{animation:none}}
</style>
</head>
<body>
<div id="bg"></div>
<div class="orb"></div><div class="orb"></div><div class="orb"></div><div class="orb"></div>
<div id="stage"></div>

<div id="hud" class="off">
  <div class="row">
    <button class="ib" id="pauseBtn" aria-label="Tạm dừng">⏸</button>
    <div id="score">0</div>
    <button class="ib" id="sndBtn" aria-label="Bật hoặc tắt âm thanh">🔊</button>
  </div>
  <div class="prog"><div class="node now" id="nA">1</div><div class="bar"><i id="fill"></i></div><div class="node" id="nB">2</div></div>
  <div id="best"></div>
</div>
<div id="pop"></div>

<div class="screen show" id="menu">
  <div class="title">NHẢY<br>XOÁY</div>
  <div class="sub">Kéo ngang để xoay tháp, tìm khe hở cho bóng rơi!</div>
  <div class="hand">👆</div>
  <button class="btn" id="playBtn">CHƠI</button>
  <div class="sub" id="menuBest"></div>
</div>

<div class="screen" id="dead">
  <div class="panel"><h2>Ối! Chạm vùng đỏ 💥</h2><div class="sm" style="margin-top:8px">Điểm của bạn</div>
    <div class="big" id="dScore">0</div><div class="sm" id="dBest"></div></div>
  <button class="btn" id="retryBtn">CHƠI LẠI</button>
</div>

<div class="screen" id="win">
  <div class="panel"><div class="stars">⭐⭐⭐</div><h2 id="wTitle">Hoàn thành!</h2>
    <div class="big" id="wScore">0</div><div class="sm" id="wBest"></div></div>
  <button class="btn alt" id="nextBtn">MÀN TIẾP THEO</button>
</div>

<div class="screen" id="pauseS">
  <div class="panel"><h2>Tạm dừng</h2><div class="sm" style="margin-top:8px">Nghỉ một chút nhé</div></div>
  <button class="btn" id="resumeBtn">TIẾP TỤC</button>
  <button class="btn alt" id="restartBtn" style="font-size:20px;padding:9px 30px;animation:none">Chơi lại màn này</button>
</div>

<script>
(() => {
const $ = id => document.getElementById(id);
if (typeof THREE === 'undefined') {
  $('menu').innerHTML = '<div class="panel"><h2>Cần kết nối mạng</h2><div class="sm" style="margin-top:8px">Game 3D cần tải thư viện đồ họa.<br>Hãy bật mạng rồi mở lại nhé.</div></div>';
  return;
}
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- Hằng số ---------- */
const N = 12, SEGA = Math.PI * 2 / N, R = 3.0, RI = 0.8, TH = 0.42, SP = 2.9, BR = 0.3, RBALL = 2.05;
const G = -42, JUMP = 12.2, EPS = 0.012;
const THEMES = [
  { a: '#7ee8fa', b: '#eec0c6', hue: 200, ball: 0xff4d6d },
  { a: '#f6d365', b: '#fda085', hue: 335, ball: 0x2d7bff },
  { a: '#a18cd1', b: '#fbc2eb', hue: 160, ball: 0xffd23f },
  { a: '#0f2027', b: '#2c5364', hue: 45,  ball: 0x3ef0d0 },
  { a: '#84fab0', b: '#8fd3f4', hue: 285, ball: 0xff5470 },
  { a: '#fccb90', b: '#d57eeb', hue: 190, ball: 0xffffff },
  { a: '#43cea2', b: '#185a9d', hue: 20,  ball: 0xfff275 },
  { a: '#ff9966', b: '#ff5e62', hue: 230, ball: 0x27e3b0 }
];

/* ---------- Lưu ---------- */
const KEY = 'nhay-xoay-v1'; let mem = null;
function loadSave() { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} return mem ? JSON.parse(mem) : { best: 0, level: 1 }; }
function writeSave() { const s = JSON.stringify(sv); try { localStorage.setItem(KEY, s); } catch (e) { mem = s; } }
const sv = Object.assign({ best: 0, level: 1 }, loadSave());

/* ---------- Âm thanh ---------- */
let ac = null, soundOn = true;
function audio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ac && ac.state === 'suspended') ac.resume(); }
function tone(f, d = .15, v = .12, type = 'sine', delay = 0, slide = 0) {
  if (!ac || !soundOn) return;
  const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .05);
}
function noise(d = .3, v = .15, cut = 1800) {
  if (!ac || !soundOn) return;
  const len = Math.floor(ac.sampleRate * d), buf = ac.createBuffer(1, len, ac.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ac.createBufferSource(); s.buffer = buf;
  const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cut;
  const g = ac.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(ac.destination); s.start();
}
const vib = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
let bn = 0;
const sfx = {
  bounce: () => { tone(470 + (bn++ % 4) * 45, .13, .13, 'sine', 0, -190); },
  fire: () => { tone(300, .35, .1, 'sawtooth', 0, 500); },
  smash: () => { noise(.4, .28, 3200); tone(190, .3, .16, 'sawtooth', 0, -120); vib(25); },
  die: () => { tone(320, .55, .16, 'sawtooth', 0, -260); noise(.3, .18, 900); vib(60); },
  win: () => [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, .5, .11, 'triangle', i * .09)),
  tap: () => tone(600, .08, .07, 'triangle')
};
$('sndBtn').onclick = () => { audio(); soundOn = !soundOn; $('sndBtn').textContent = soundOn ? '🔊' : '🔇'; };

/* ---------- Three.js ---------- */
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, .1, 200);
scene.add(new THREE.HemisphereLight(0xffffff, 0x8f9ccc, .9));
const dl = new THREE.DirectionalLight(0xffffff, .85); dl.position.set(6, 12, 9); scene.add(dl);
const dl2 = new THREE.DirectionalLight(0xffd6f0, .25); dl2.position.set(-8, 4, -6); scene.add(dl2);

let camDist = 18;
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h); camera.aspect = w / h;
  const hf = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect);
  camDist = Math.max(13, 3.6 / Math.tan(hf / 2));
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize); resize();

/* hình học đoạn vòng */
const segGeo = [];
for (let k = 0; k < N; k++) {
  const a0 = k * SEGA + EPS, a1 = (k + 1) * SEGA - EPS, s = new THREE.Shape();
  s.moveTo(Math.cos(a0) * RI, Math.sin(a0) * RI);
  s.absarc(0, 0, R, a0, a1, false);
  s.lineTo(Math.cos(a1) * RI, Math.sin(a1) * RI);
  s.absarc(0, 0, RI, a1, a0, true);
  const g = new THREE.ExtrudeGeometry(s, { depth: TH, bevelEnabled: false, curveSegments: 8 });
  g.rotateX(-Math.PI / 2); g.translate(0, -TH, 0); segGeo.push(g);
}
const dangerMat = new THREE.MeshPhongMaterial({ color: 0xe8384f, emissive: 0x3a0008, shininess: 80, specular: 0x666666 });
const ballMat = new THREE.MeshPhongMaterial({ color: 0xff4d6d, shininess: 120, specular: 0xffffff });
const ball = new THREE.Mesh(new THREE.SphereGeometry(BR, 32, 24), ballMat);
ball.position.z = RBALL; scene.add(ball);
const splatGeo = new THREE.CircleGeometry(1, 20); splatGeo.rotateX(-Math.PI / 2);

/* hạt */
const pool = [];
{ const g = new THREE.BoxGeometry(.13, .13, .13);
  for (let i = 0; i < 110; i++) { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffffff })); m.visible = false; scene.add(m); pool.push({ m, v: new THREE.Vector3(), life: 0, max: 1 }); } }
let pi = 0;
function spawn(pos, color, n, spd, up = 3, life = .8) {
  for (let i = 0; i < n; i++) {
    const p = pool[pi++ % pool.length], a = rand(0, 6.283), s = rand(.3, 1) * spd;
    p.m.position.copy(pos); p.m.material.color.setHex(color); p.m.visible = true; p.m.scale.setScalar(rand(.7, 1.4));
    p.v.set(Math.cos(a) * s, rand(0, 1) * up + up * .3, Math.sin(a) * s); p.life = p.max = life * rand(.7, 1.1);
  }
}
function updateParticles(dt) {
  pool.forEach(p => { if (p.life <= 0) return; p.life -= dt; if (p.life <= 0) { p.m.visible = false; return; }
    p.v.y -= 16 * dt; p.m.position.addScaledVector(p.v, dt); p.m.rotation.x += dt * 8; p.m.rotation.y += dt * 6;
    p.m.scale.multiplyScalar(1 - dt * 1.4); });
}

/* ---------- Trạng thái ---------- */
let tower = null, rings = [], debris = [], mats = [], theme = THEMES[0];
let level = sv.level, score = 0, levelStartScore = 0, nRings = 10;
let state = 'menu', rot = 0, T = 0, keyDir = 0;
let vy = 0, fallCount = 0, fire = false, sq = 0, camY = 0, camFocus = 0, finishY = 0, menuPhase = 0;
const UP = new THREE.Vector3(0, 1, 0);

function genTypes(i) {
  const t = Array(N).fill('solid'), L = level;
  const gl = L <= 2 ? 3 : (Math.random() < Math.max(.2, .85 - L * .07) ? 3 : 2);
  const gs = Math.floor(Math.random() * N);
  for (let k = 0; k < gl; k++) t[(gs + k) % N] = 'gap';
  if (L >= 4 && Math.random() < Math.min(.5, .1 + L * .03)) {
    for (let tr = 0; tr < 10; tr++) { const k = Math.floor(Math.random() * N); if (t[k] === 'solid' && t[(k + 1) % N] === 'solid' && t[(k + N - 1) % N] === 'solid') { t[k] = 'gap'; break; } }
  }
  if (i >= 2) {
    let d = 0; const p = Math.min(.9, .12 + L * .07);
    if (Math.random() < p) d = 1; if (L >= 3 && Math.random() < L * .04) d++; if (L >= 7 && Math.random() < .35) d++;
    for (let c = 0; c < d; c++) {
      const len = 1 + (Math.random() < .45 ? 1 : 0), free = t.filter(x => x === 'solid').length;
      if (free - len < 3) break;
      const starts = [];
      if (Math.random() < .5) starts.push((gs + gl) % N, (gs - len + N) % N);
      for (let tr = 0; tr < 12; tr++) starts.push(Math.floor(Math.random() * N));
      for (const s0 of starts) {
        let ok = true; for (let k = 0; k < len; k++) if (t[(s0 + k) % N] !== 'solid') ok = false;
        if (ok) { for (let k = 0; k < len; k++) t[(s0 + k) % N] = 'danger'; break; }
      }
    }
  }
  return t;
}

function buildLevel() {
  if (tower) { scene.remove(tower); mats.forEach(m => m.dispose()); mats = []; }
  debris.forEach(d => scene.remove(d.m)); debris = [];
  pool.forEach(p => { p.life = 0; p.m.visible = false; });
  tower = new THREE.Group(); scene.add(tower); rings = [];
  theme = THEMES[(level - 1) % THEMES.length];
  $('bg').style.background = \`linear-gradient(180deg,\${theme.a},\${theme.b})\`;
  ballMat.color.setHex(theme.ball); ballMat.emissive.setHex(0x000000);
  nRings = 8 + Math.min(level, 12) * 2;
  for (let i = 0; i < nRings; i++) {
    const types = genTypes(i), g = new THREE.Group(); g.position.y = -i * SP;
    const mat = new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(((theme.hue + i * 5) % 360) / 360, .62, .62), shininess: 70, specular: 0x555555 });
    mats.push(mat);
    const segs = types.map((ty, k) => { if (ty === 'gap') return null; const m = new THREE.Mesh(segGeo[k], ty === 'danger' ? dangerMat : mat); g.add(m); return m; });
    tower.add(g); rings.push({ i, Y: -i * SP, types, segs, group: g, passed: false, smashed: false, finish: false });
  }
  // sàn đích
  finishY = -nRings * SP;
  const fg = new THREE.Group(); fg.position.y = finishY;
  const gm = new THREE.MeshPhongMaterial({ color: 0xffd54a, emissive: 0x6b4200, shininess: 110, specular: 0xffffff }); mats.push(gm);
  const dg = new THREE.CylinderGeometry(R + .45, R + .45, .7, 56); dg.translate(0, -.35, 0);
  fg.add(new THREE.Mesh(dg, gm)); tower.add(fg);
  rings.push({ i: nRings, Y: finishY, types: [], segs: [], group: fg, passed: false, smashed: false, finish: true });
  // cột
  const H = (nRings + 1) * SP + SP * 3;
  const cm = new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(theme.hue / 360, .25, .9), shininess: 60, specular: 0x666666 }); mats.push(cm);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(.95, .95, H, 40), cm); col.position.y = SP * 2 - H / 2; tower.add(col);
  $('nA').textContent = level; $('nB').textContent = level + 1;
}

function resetBall(toPlay) {
  ball.position.y = 1.6; ball.visible = true; ball.scale.set(1, 1, 1); vy = 0; fallCount = 0; fire = false; sq = 0;
  ballMat.color.setHex(theme.ball); ballMat.emissive.setHex(0x000000);
  camFocus = camY = ball.position.y; rot = Math.random() * 6.283; tower.rotation.y = rot;
  state = toPlay ? 'play' : 'menu';
}

function hud() {
  $('score').textContent = score;
  $('best').textContent = 'Cao nhất: ' + Math.max(sv.best, score);
}
let popT;
function pop(msg) { const p = $('pop'); p.textContent = msg; p.classList.remove('show'); void p.offsetWidth; p.classList.add('show'); }
function bumpScore() { const s = $('score'); s.classList.add('b'); setTimeout(() => s.classList.remove('b'), 130); }
function addScore(n) { score += n; if (score > sv.best) { sv.best = score; } hud(); bumpScore(); }

/* ---------- Luật chơi ---------- */
function ballAngle() { let a = Math.atan2(-Math.cos(rot), -Math.sin(rot)); if (a < 0) a += Math.PI * 2; return a; }
function addSplat(ring) {
  const m = new THREE.Mesh(splatGeo, new THREE.MeshBasicMaterial({ color: fire ? 0xff8a1e : theme.ball, transparent: true, opacity: .9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.scale.setScalar(rand(.3, .42)); m.position.set(-RBALL * Math.sin(rot), .012, RBALL * Math.cos(rot)); ring.group.add(m);
  mats.push(m.material);
}
function smash(ring) {
  ring.smashed = true;
  ring.segs.forEach((m, k) => {
    if (!m) return; scene.attach(m);
    const ang = (k + .5) * SEGA, dir = new THREE.Vector3(Math.cos(ang), 0, -Math.sin(ang)).applyAxisAngle(UP, rot).multiplyScalar(rand(3, 6.5));
    dir.y = rand(4, 9); debris.push({ m, v: dir, s: new THREE.Vector3(rand(-7, 7), rand(-7, 7), rand(-7, 7)), life: 1.3 });
  });
  ring.group.visible = false;
  spawn(ball.position, 0xffb347, 26, 5, 5, .9); spawn(ball.position, 0xffffff, 12, 4, 4, .7);
  sfx.smash(); pop('💥 BÙM!'); addScore(5);
  fire = false; fallCount = 0; ballMat.color.setHex(theme.ball); ballMat.emissive.setHex(0x000000); vy = -8;
}
function doBounce(ring) {
  ball.position.y = ring.Y + BR; vy = JUMP; fallCount = 0; sq = 1;
  addSplat(ring); sfx.bounce(); spawn(new THREE.Vector3(0, ring.Y + .1, RBALL), theme.ball, 7, 2.4, 2.4, .5);
}
function die() {
  state = 'dead'; ball.visible = false; sfx.die();
  spawn(ball.position, theme.ball, 34, 6, 6, 1); spawn(ball.position, 0xffffff, 12, 5, 5, .8);
  setTimeout(() => {
    $('dScore').textContent = score; $('dBest').textContent = 'Cao nhất: ' + sv.best; writeSave(); show('dead');
  }, 850);
}
function win(ring) {
  state = 'win'; ball.position.y = ring.Y + BR; vy = 0; sfx.win(); vib(40);
  for (let k = 0; k < 6; k++) setTimeout(() => {
    const cols = [0xff6a9a, 0xffe37a, 0x7bd4ff, 0x9bf07a, 0xc9a8ff];
    spawn(new THREE.Vector3(rand(-2, 2), ring.Y + .5, rand(-1, 3)), cols[k % 5], 24, 6, 9, 1.4);
  }, k * 120);
  sv.level = level + 1; writeSave();
  setTimeout(() => { $('wTitle').textContent = 'Màn ' + level + ' hoàn thành!'; $('wScore').textContent = score; $('wBest').textContent = 'Cao nhất: ' + sv.best; show('win'); }, 1100);
}
function physics(dt) {
  const prev = ball.position.y;
  vy = Math.max(-32, vy + G * dt); ball.position.y += vy * dt;
  const seg = Math.floor(ballAngle() / SEGA) % N;
  for (const ring of rings) {
    if (ring.passed || ring.smashed) continue;
    const Y = ring.Y, pb = prev - BR, nb = ball.position.y - BR;
    if (vy < 0 && pb >= Y - .001 && nb <= Y) {
      if (ring.finish) { win(ring); return; }
      const ty = ring.types[seg];
      if (ty === 'gap') continue;
      if (fire) smash(ring);
      else if (ty === 'danger') die();
      else doBounce(ring);
      return;
    }
    if (!ring.finish && nb < Y - TH - .05) {
      ring.passed = true; addScore(1); fallCount++;
      if (fallCount === 3 && !fire) { fire = true; sfx.fire(); pop('🔥 SIÊU TỐC!'); ballMat.color.setHex(0xff8a1e); ballMat.emissive.setHex(0xa02800); }
    }
  }
}

/* ---------- Điều khiển ---------- */
let dragging = false, lastX = 0;
window.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; dragging = true; lastX = e.clientX; audio(); });
window.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; if (state === 'play' || state === 'menu') rot += dx * .012; });
window.addEventListener('pointerup', () => dragging = false);
window.addEventListener('pointercancel', () => dragging = false);
window.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') keyDir = -1; if (e.key === 'ArrowRight') keyDir = 1; });
window.addEventListener('keyup', e => { if (e.key === 'ArrowLeft' && keyDir < 0) keyDir = 0; if (e.key === 'ArrowRight' && keyDir > 0) keyDir = 0; });

/* ---------- Màn hình ---------- */
const screens = ['menu', 'dead', 'win', 'pauseS'];
function show(id) { screens.forEach(s => $(s).classList.toggle('show', s === id)); $('hud').classList.toggle('off', id === 'menu'); }
function hideAll() { screens.forEach(s => $(s).classList.remove('show')); $('hud').classList.remove('off'); }
function startLevel(play) { buildLevel(); resetBall(play); score = levelStartScore; hud(); }
$('playBtn').onclick = () => { audio(); sfx.tap(); hideAll(); state = 'play'; };
$('retryBtn').onclick = () => { audio(); sfx.tap(); hideAll(); startLevel(true); };
$('nextBtn').onclick = () => { audio(); sfx.tap(); level++; levelStartScore = score; hideAll(); startLevel(true); };
$('pauseBtn').onclick = () => { if (state !== 'play') return; audio(); sfx.tap(); state = 'pause'; show('pauseS'); $('hud').classList.remove('off'); };
$('resumeBtn').onclick = () => { sfx.tap(); hideAll(); state = 'play'; };
$('restartBtn').onclick = () => { sfx.tap(); hideAll(); startLevel(true); };

/* ---------- Vòng lặp ---------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(1 / 30, (now - last) / 1000); last = now; T += dt;
  if (keyDir && (state === 'play' || state === 'menu')) rot += keyDir * 3.2 * dt;
  if (state === 'menu') { rot += .5 * dt; menuPhase += dt;
    vy += G * dt; ball.position.y += vy * dt;
    if (ball.position.y - BR <= 0) { ball.position.y = BR; vy = JUMP; sq = 1; } }
  else if (state === 'play') { physics(dt * .5); if (state === 'play') physics(dt * .5); }
  tower.rotation.y = rot;
  // bóng: giãn / nén
  sq = Math.max(0, sq - dt * 5);
  const stretch = state === 'play' || state === 'menu' ? clamp(Math.abs(vy) * .008, 0, .22) : 0;
  const sy = 1 - sq * .32 + stretch * (vy < 0 ? 1 : .5), sxz = 1 + sq * .2 - stretch * .4;
  ball.scale.set(sxz, sy, sxz);
  if (fire && state === 'play') spawn(ball.position, Math.random() < .5 ? 0xffa53a : 0xffe36b, 1, .6, 1, .35);
  // camera: chỉ đi xuống
  if (state === 'play' || state === 'menu' || state === 'pause') { if (state === 'play') camFocus = Math.min(camFocus, ball.position.y); }
  const targetY = state === 'menu' ? 1.2 : camFocus;
  camY += (targetY - camY) * Math.min(1, dt * 7);
  camera.position.set(0, camY + 6.6, camDist); camera.lookAt(0, camY - 1.9, 0);
  // ẩn vòng ngoài tầm nhìn
  rings.forEach(r => { if (!r.smashed) r.group.visible = r.Y < camY + 11 && r.Y > camY - 26; });
  // mảnh vỡ
  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i]; d.life -= dt; d.v.y -= 26 * dt; d.m.position.addScaledVector(d.v, dt);
    d.m.rotation.x += d.s.x * dt; d.m.rotation.y += d.s.y * dt; d.m.rotation.z += d.s.z * dt;
    d.m.scale.multiplyScalar(1 - dt * .9);
    if (d.life <= 0) { scene.remove(d.m); debris.splice(i, 1); }
  }
  updateParticles(dt);
  // tiến độ
  $('fill').style.width = clamp(-(ball.position.y - 1.6) / (-finishY - 1.6) * 100, 0, 100) + '%';
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

buildLevel(); resetBall(false); hud();
$('menuBest').textContent = sv.best ? 'Cao nhất: ' + sv.best + ' · Màn ' + sv.level : '';
requestAnimationFrame(frame);
})();
<\/script>
</body>
</html>
`,O=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Nông Trại Vui</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --wood:#8a5a3c;--woodD:#5e3b25;--paper:#fff7e0;--paperD:#f0dcae;--ink:#4a2f1d;
    --grass:#5dbb4a;--grassD:#37872f;--gold:#ffcf4a;--goldD:#d39420;--red:#e9584b;--redD:#b23a30;
  }
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  html,body{height:100%;overflow:hidden;background:#58b9f5;color:var(--ink);
    font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif}
  canvas{position:fixed;inset:0;width:100%;height:100%;display:block;touch-action:none}
  button{font-family:inherit}
  button:focus-visible{outline:3px solid #2f9bff;outline-offset:2px}

  /* HUD */
  #hud{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;
    padding:calc(env(safe-area-inset-top) + 10px) 10px 0;pointer-events:none}
  .pill{background:linear-gradient(#fffaf0,#fff0c8);border:3px solid var(--wood);border-radius:20px;
    box-shadow:0 4px 0 var(--woodD),0 8px 14px rgba(0,0,0,.18);color:var(--ink)}
  .lvl{display:flex;align-items:center;gap:8px;padding:4px 14px 4px 4px;min-width:150px}
  .badge{width:42px;height:42px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;font-size:21px;
    color:#7a4300;background:radial-gradient(circle at 35% 30%,#ffec95,#ffb52e);border:3px solid #b9791f;
    box-shadow:inset 0 -3px 0 rgba(0,0,0,.12)}
  .lvInfo{flex:1;min-width:0;line-height:1.05}
  .lvInfo b{font-size:15px;font-weight:800}
  .xpbar{height:10px;border-radius:10px;background:#e7d3a0;overflow:hidden;border:1px solid rgba(94,59,37,.35);margin:2px 0 1px}
  .xpbar i{display:block;height:100%;width:0;background:linear-gradient(#9be16d,#4fb23b);border-radius:10px;transition:width .5s}
  .lvInfo small{font-size:12px;font-weight:600;opacity:.75}
  .rightHud{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
  .coinp{display:flex;align-items:center;gap:8px;padding:6px 16px 6px 8px;font-size:22px;font-weight:800;min-width:110px;justify-content:flex-start}
  .coinp.bump,.fab.bump{animation:bump .35s}
  @keyframes bump{40%{transform:scale(1.14)}}
  .coin{display:inline-block;width:26px;height:26px;border-radius:50%;flex:none;position:relative;
    background:radial-gradient(circle at 35% 30%,#fff3a6,#ffc21f 55%,#e29a12);border:2px solid #b9791f}
  .coin::after{content:"";position:absolute;inset:4px;border-radius:50%;border:2px solid rgba(185,121,31,.55)}
  .coin.sm{width:18px;height:18px;border-width:2px}.coin.sm::after{inset:3px;border-width:1.5px}
  .round{pointer-events:auto;width:40px;height:40px;border-radius:50%;border:3px solid var(--wood);cursor:pointer;
    background:linear-gradient(#fffaf0,#fff0c8);box-shadow:0 3px 0 var(--woodD);font-size:18px}
  #tip{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 74px);transform:translateX(-50%);width:max-content;max-width:88vw;
    text-align:center;font-size:15px;font-weight:600;padding:5px 16px;border-radius:99px;background:rgba(255,250,235,.92);
    border:2px solid var(--wood);pointer-events:none;transition:opacity .4s;box-shadow:0 3px 0 rgba(94,59,37,.5)}
  #tip.hide{opacity:0}
  #toast{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 122px);transform:translate(-50%,-8px);opacity:0;
    width:max-content;max-width:88vw;text-align:center;font-size:17px;font-weight:700;padding:9px 18px;border-radius:18px;
    background:#3b2a1c;color:#fff4d6;pointer-events:none;transition:opacity .3s,transform .3s;z-index:5;box-shadow:0 6px 16px rgba(0,0,0,.3)}
  #toast.show{opacity:1;transform:translate(-50%,0)}

  /* nút bên phải */
  #side{position:fixed;right:10px;top:calc(env(safe-area-inset-top) + 130px);display:flex;flex-direction:column;gap:12px}
  .fab{position:relative;width:60px;border:0;background:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0;color:var(--ink)}
  .fab .ic{width:56px;height:56px;border-radius:18px;display:grid;place-items:center;font-size:28px;
    background:linear-gradient(#ffe487,#ffbd35);border:3px solid #b9791f;box-shadow:0 4px 0 #8a5a12,0 8px 12px rgba(0,0,0,.18);
    transition:transform .12s}
  .fab:active .ic{transform:translateY(3px);box-shadow:0 1px 0 #8a5a12}
  .fab span.tx{font-size:12.5px;font-weight:800;margin-top:6px;padding:0 8px;border-radius:99px;background:rgba(255,250,235,.92);
    border:2px solid var(--wood)}
  .fab .dot{position:absolute;top:-4px;right:0;min-width:22px;height:22px;padding:0 5px;border-radius:99px;background:var(--red);
    color:#fff;font-size:12px;font-weight:800;display:none;place-items:center;border:2px solid #fff}
  .fab .dot.on{display:grid}

  /* thanh dưới */
  #bar{position:fixed;left:0;right:0;bottom:0;padding:14px 8px calc(env(safe-area-inset-bottom) + 10px);
    background:repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 2px,transparent 2px 46px),linear-gradient(#a6714a,#7d4d2f);
    border-top:5px solid #c99b6b;border-radius:26px 26px 0 0;box-shadow:0 -6px 20px rgba(0,0,0,.25)}
  #slots{display:flex;gap:9px;overflow-x:auto;padding:14px 8px 6px;scrollbar-width:none;scroll-snap-type:x proximity}
  #slots::-webkit-scrollbar{display:none}
  .slot{flex:0 0 auto;width:64px;height:76px;border-radius:17px;border:3px solid #b98b5e;cursor:pointer;position:relative;
    background:linear-gradient(#fff9e6,#f6e3b8);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
    box-shadow:0 4px 0 #5e3b25;transition:transform .15s,box-shadow .15s;scroll-snap-align:center;color:var(--ink)}
  .slot .em{font-size:30px;line-height:1}
  .slot .lb{font-size:12px;font-weight:700;line-height:1}
  .slot.sel{transform:translateY(-9px);border-color:#5dbb4a;box-shadow:0 4px 0 #37872f,0 0 0 4px rgba(122,214,90,.45)}
  .slot.lock{filter:grayscale(1) brightness(.92);opacity:.75}
  .slot .cnt{position:absolute;top:-8px;right:-7px;min-width:24px;height:24px;padding:0 5px;border-radius:99px;background:var(--red);
    color:#fff;font-size:13px;font-weight:800;display:grid;place-items:center;border:2px solid #fff}
  .slot .meter{position:absolute;left:8px;right:8px;bottom:6px;height:6px;border-radius:6px;background:#cfe6f5;overflow:hidden}
  .slot .meter b{display:block;height:100%;width:0;background:linear-gradient(#7fd4ff,#2f9bff)}
  .slot.w .lb{margin-bottom:6px}

  /* bảng chợ */
  #sheet{position:fixed;inset:0;display:flex;align-items:flex-end;justify-content:center;pointer-events:none;
    background:rgba(40,25,10,0);transition:background .3s;z-index:10}
  #sheet.open{pointer-events:auto;background:rgba(40,25,10,.5)}
  .panel{width:min(100%,560px);height:min(82vh,720px);display:flex;flex-direction:column;background:var(--paper);
    border-radius:28px 28px 0 0;border:4px solid var(--wood);border-bottom:0;transform:translateY(105%);
    transition:transform .38s cubic-bezier(.2,.9,.25,1.05);box-shadow:0 -10px 40px rgba(0,0,0,.35)}
  #sheet.open .panel{transform:none}
  .ph{display:flex;align-items:center;gap:10px;padding:14px 16px 8px}
  .ph h2{flex:1;font-size:26px;font-weight:800;line-height:1}
  .ph .coinp{min-width:0;padding:4px 12px 4px 6px;font-size:18px;box-shadow:0 3px 0 var(--woodD)}
  .x{width:40px;height:40px;border-radius:50%;border:3px solid var(--redD);background:linear-gradient(#ff8a7d,var(--red));
    color:#fff;font-size:18px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 var(--redD)}
  .tabs{display:flex;gap:6px;padding:4px 14px 8px}
  .tab{flex:1;border:0;cursor:pointer;font-weight:800;font-size:14px;padding:8px 2px;border-radius:14px;
    background:var(--paperD);color:var(--ink);transition:background .2s}
  .tab.on{background:linear-gradient(#7bd45d,#4aa93a);color:#fff;box-shadow:0 3px 0 var(--grassD);text-shadow:0 1px 0 rgba(0,0,0,.25)}
  #sBody{flex:1;overflow-y:auto;padding:6px 14px calc(env(safe-area-inset-bottom) + 24px);-webkit-overflow-scrolling:touch}
  .row{display:flex;align-items:center;gap:12px;padding:10px;border-radius:18px;background:#fff;border:2px solid var(--paperD);
    margin-bottom:10px;box-shadow:0 3px 0 var(--paperD)}
  .row.lockrow{opacity:.6}
  .ico{width:56px;height:56px;border-radius:16px;flex:none;display:grid;place-items:center;font-size:32px;
    background:linear-gradient(#eaf8d9,#cdeeb0);border:2px solid #b8dc98}
  .info{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.15}
  .info b{font-size:17px;font-weight:800}
  .info small{font-size:13px;font-weight:600;opacity:.75}
  .info .tag{display:inline-block;align-self:flex-start;background:#ff7a3d;color:#fff;font-size:11.5px;font-weight:800;
    padding:1px 8px;border-radius:99px;margin-top:3px;opacity:1}
  .acts{display:flex;flex-direction:column;gap:6px;align-items:stretch}
  .btn{border:0;cursor:pointer;font-weight:800;font-size:15px;color:#fff;padding:7px 14px;border-radius:14px;
    background:linear-gradient(#7bd45d,#4aa93a);box-shadow:0 4px 0 var(--grassD);text-shadow:0 1px 0 rgba(0,0,0,.25);
    display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;transition:transform .1s}
  .btn:active{transform:translateY(3px);box-shadow:0 1px 0 var(--grassD)}
  .btn.gold{background:linear-gradient(#ffdf6b,#ffbb2e);color:#6a3d00;text-shadow:none;box-shadow:0 4px 0 var(--goldD)}
  .btn.gold:active{box-shadow:0 1px 0 var(--goldD)}
  .btn.off{filter:grayscale(.9);opacity:.6}
  .btn.big{font-size:18px;padding:11px 20px;width:100%}
  .empty{text-align:center;padding:40px 10px;font-weight:700;opacity:.7;font-size:17px}
  .sumcard{display:flex;align-items:center;gap:10px;padding:12px;border-radius:18px;margin-bottom:12px;
    background:linear-gradient(#fff3c4,#ffe28a);border:2px solid #e2b94a;font-weight:700}
  .sumcard .grow{flex:1;line-height:1.15}
  .prog{height:8px;border-radius:8px;background:#e8dcc0;overflow:hidden;margin-top:5px}
  .prog i{display:block;height:100%;background:linear-gradient(#9be16d,#4fb23b)}
  .av{width:56px;height:56px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:32px;
    background:linear-gradient(#cfeaff,#a9d6ff);border:2px solid #86bde8}
  .chips{display:flex;gap:6px;margin-top:4px;flex-wrap:wrap}
  .chip{display:inline-flex;align-items:center;gap:4px;background:#fff6d6;border:2px solid #f0d47c;border-radius:99px;
    font-size:13px;font-weight:800;padding:0 8px}

  /* hộp thoại */
  #dlg{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(40,25,10,.55);z-index:20;padding:20px}
  #dlg.show{display:flex}
  .card{width:min(100%,360px);text-align:center;background:var(--paper);border:4px solid var(--wood);border-radius:28px;
    padding:22px 22px 20px;box-shadow:0 14px 40px rgba(0,0,0,.4);animation:pop .45s cubic-bezier(.2,1.3,.4,1)}
  @keyframes pop{from{transform:scale(.7);opacity:0}to{transform:none;opacity:1}}
  .card .em{font-size:56px;line-height:1.1}
  .card h3{font-size:28px;font-weight:800;line-height:1.1;margin-top:2px}
  .card .tx{font-size:17px;font-weight:600;margin:8px 0 14px;line-height:1.35}
  .card .two{display:flex;gap:10px}
  .card .two .btn{flex:1}
  .card .btn.cancel{background:linear-gradient(#e6d8b8,#cdb98c);box-shadow:0 4px 0 #a08f66;color:var(--ink);text-shadow:none}
  @media (prefers-reduced-motion:reduce){.card{animation:none}.panel{transition:none}}
</style>
</head>
<body>
<canvas id="c"></canvas>

<div id="hud">
  <div class="pill lvl"><div class="badge" id="lvNum">1</div>
    <div class="lvInfo"><b>Nông dân nhí</b><div class="xpbar"><i id="xpFill"></i></div><small id="xpTxt"></small></div></div>
  <div class="rightHud">
    <div class="pill coinp" id="coinP"><span class="coin"></span><b id="coins">0</b></div>
    <button class="round" id="snd" aria-label="Bật hoặc tắt âm thanh">🔊</button>
  </div>
</div>
<div id="tip"></div>
<div id="toast" role="status" aria-live="polite"></div>

<div id="side">
  <button class="fab" id="btnShop" aria-label="Mở chợ"><span class="ic">🛒</span><span class="tx">Chợ</span></button>
  <button class="fab" id="btnOrders" aria-label="Đơn hàng"><span class="ic">📜</span><span class="tx">Đơn hàng</span><span class="dot" id="dotOrders">!</span></button>
  <button class="fab" id="btnBarn" aria-label="Kho hàng"><span class="ic">📦</span><span class="tx">Kho</span><span class="dot" id="dotBarn">0</span></button>
</div>

<div id="bar"><div id="slots"></div></div>

<div id="sheet">
  <div class="panel" role="dialog" aria-modal="true">
    <div class="ph"><h2 id="sTitle">Chợ</h2>
      <div class="pill coinp"><span class="coin sm"></span><b id="sCoins">0</b></div>
      <button class="x" id="sClose" aria-label="Đóng">✕</button></div>
    <div class="tabs" id="sTabs"></div>
    <div id="sBody"></div>
  </div>
</div>

<div id="dlg"><div class="card" id="dlgCard"></div></div>

<script>
(() => {
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const fmt = n => Math.floor(n).toLocaleString('vi-VN');
const tfmt = s => { s = Math.ceil(s); if (s < 60) return s + ' giây'; const m = Math.floor(s / 60), r = s % 60; return m + ' phút' + (r ? ' ' + r + 's' : ''); };
const EMO = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

/* ================= Dữ liệu ================= */
const FR = [
  { e: '🍓', n: 'Dâu tây', grow: 12, seed: 4, sell: 9, xp: 4, lv: 1 },
  { e: '🍅', n: 'Cà chua', grow: 25, seed: 9, sell: 20, xp: 8, lv: 2 },
  { e: '🍇', n: 'Nho', grow: 45, seed: 18, sell: 42, xp: 14, lv: 3 },
  { e: '🍋', n: 'Chanh', grow: 60, seed: 25, sell: 58, xp: 19, lv: 4 },
  { e: '🍊', n: 'Cam', grow: 80, seed: 34, sell: 82, xp: 26, lv: 5 },
  { e: '🍉', n: 'Dưa hấu', grow: 110, seed: 55, sell: 140, xp: 38, lv: 7 },
  { e: '🍍', n: 'Dứa', grow: 150, seed: 85, sell: 215, xp: 54, lv: 9 },
  { e: '🥭', n: 'Xoài', grow: 200, seed: 130, sell: 340, xp: 76, lv: 11 },
  { e: '🍑', n: 'Đào', grow: 260, seed: 190, sell: 500, xp: 104, lv: 13 },
  { e: '🍎', n: 'Táo đỏ', grow: 330, seed: 280, sell: 740, xp: 142, lv: 15 }
];
const PETS = [
  { id: 'hen', e: '🐔', n: 'Gà mái', d: 'Đẻ trứng bán được 7 xu mỗi 25 giây', price: 120, lv: 3, sz: .3 },
  { id: 'bee', e: '🐝', n: 'Đàn ong', d: 'Cây lớn nhanh hơn 12%', price: 260, lv: 5, sz: .2 },
  { id: 'duck', e: '🦆', n: 'Vịt con', d: 'Giá bán nông sản tăng 10%', price: 500, lv: 6, sz: .3 },
  { id: 'dog', e: '🐕', n: 'Chó cún', d: 'Nhận thêm 20% kinh nghiệm', price: 420, lv: 7, sz: .36 },
  { id: 'cat', e: '🐈', n: 'Mèo mướp', d: 'Bình tưới đầy nhanh gấp đôi', price: 650, lv: 9, sz: .32 },
  { id: 'cow', e: '🐄', n: 'Bò sữa', d: 'Cho sữa bán được 45 xu mỗi phút', price: 1400, lv: 12, sz: .5 }
];
const NAMES = [['Cô Lan', '👩‍🌾'], ['Chú Tư', '👨‍🌾'], ['Bé Na', '👧'], ['Bà Sáu', '👵'], ['Anh Hùng', '🧑‍🍳'], ['Cô Mai', '👩‍🍳'], ['Ông Ba', '👴'], ['Bé Bi', '🧒']];
const N = 5, START_UNLOCK = [6, 7, 11, 12], KEY = 'nong-trai-vui-v1';

/* ================= Lưu game ================= */
let mem = null;
function load() { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} return mem ? JSON.parse(mem) : null; }
function save() { S.saved = Date.now(); const s = JSON.stringify(S); try { localStorage.setItem(KEY, s); } catch (e) { mem = s; } }
function defState() {
  return {
    v: 1, coins: 40, xp: 0, lv: 1, sel: 0, sound: true, tut: true, fert: 1, tankLv: 0, refLv: 0, water: 6, hot: -1, hotT: 0, saved: Date.now(),
    plots: Array.from({ length: N * N }, (_, i) => ({ u: START_UNLOCK.includes(i), crop: -1, prog: 0, wet: 0 })),
    seeds: FR.map((_, i) => i === 0 ? 5 : 0), fruits: FR.map(() => 0), pets: {}, orders: []
  };
}
const saved = load();
let S = defState();
if (saved) {
  Object.assign(S, saved);
  S.plots = defState().plots.map((p, i) => Object.assign(p, (saved.plots || [])[i] || {}));
  S.seeds = FR.map((_, i) => (saved.seeds || [])[i] || 0);
  S.fruits = FR.map((_, i) => (saved.fruits || [])[i] || 0);
  S.pets = saved.pets || {}; S.orders = saved.orders || [];
}

/* ================= Công thức ================= */
const maxTank = () => 6 + 3 * S.tankLv;
const refillEvery = () => (6 - 0.8 * S.refLv) / (S.pets.cat ? 2 : 1);
const growMul = () => 1 + (S.pets.bee ? .12 : 0);
const sellMul = () => 1 + (S.pets.duck ? .1 : 0);
const xpMul = () => 1 + (S.pets.dog ? .2 : 0);
const priceOf = i => Math.round(FR[i].sell * sellMul() * (S.hot === i ? 1.3 : 1));
const xpNeed = l => Math.round(30 + l * l * 9);
const unlockedCount = () => S.plots.filter(p => p.u).length;
const landPrice = () => Math.round(30 * Math.pow(1.3, unlockedCount() - 4) / 5) * 5;
const totalFruit = () => S.fruits.reduce((a, b) => a + b, 0);

/* ================= Âm thanh ================= */
let ac = null;
function ensureAudio() {
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (ac && ac.state === 'suspended') ac.resume();
}
function tone(f, d = .3, v = .1, type = 'sine', delay = 0) {
  if (!ac || !S.sound) return;
  const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .05);
}
function noise(d = .25, v = .05, hp = 2500) {
  if (!ac || !S.sound) return;
  const len = Math.floor(ac.sampleRate * d), buf = ac.createBuffer(1, len, ac.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource(); src.buffer = buf;
  const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ac.createGain(); g.gain.value = v;
  src.connect(f); f.connect(g); g.connect(ac.destination); src.start();
}
const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
const sfx = {
  tap: () => tone(440, .08, .05, 'triangle'),
  plant: () => { tone(196, .18, .12, 'triangle'); tone(261.63, .25, .08, 'sine', .06); },
  harvest: () => { const b = pick(PENTA); tone(b, .3, .1, 'triangle'); tone(b * 1.5, .4, .08, 'sine', .07); },
  coin: () => { tone(988, .12, .08, 'triangle'); tone(1319, .3, .08, 'triangle', .07); },
  water: () => { noise(.35, .07, 3000); tone(700, .15, .03, 'sine', .05); },
  buy: () => { tone(523, .1, .09, 'triangle'); tone(784, .22, .09, 'triangle', .08); },
  err: () => { tone(220, .18, .09, 'sawtooth'); tone(180, .22, .07, 'sawtooth', .1); },
  ready: () => tone(1174, .35, .05, 'sine'),
  fert: () => { tone(660, .12, .08, 'triangle'); tone(990, .2, .08, 'triangle', .08); tone(1320, .3, .06, 'sine', .16); },
  level: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, .5, .1, 'triangle', i * .11)),
  bird: () => { const b = rand(2400, 3300); tone(b, .08, .025); tone(b * 1.2, .1, .025, 'sine', .1); tone(b * .9, .09, .02, 'sine', .22); }
};

/* ================= Giao diện DOM ================= */
let toastT;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }
function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
let lastCoins = -1;
function renderHud() {
  $('coins').textContent = fmt(S.coins); $('sCoins').textContent = fmt(S.coins);
  if (lastCoins >= 0 && S.coins > lastCoins) bump($('coinP'));
  lastCoins = S.coins;
  $('lvNum').textContent = S.lv;
  const need = xpNeed(S.lv); $('xpFill').style.width = clamp(S.xp / need * 100, 0, 100) + '%';
  $('xpTxt').textContent = fmt(S.xp) + ' / ' + fmt(need) + ' XP';
  const tf = totalFruit(), d = $('dotBarn'); d.textContent = tf > 99 ? '99+' : tf; d.classList.toggle('on', tf > 0);
  $('dotOrders').classList.toggle('on', S.orders.some(o => S.fruits[o.f] >= o.qty));
}
function renderSlots() {
  const box = $('slots'), sl = box.scrollLeft;
  let h = \`<button class="slot w \${S.sel === 'water' ? 'sel' : ''}" data-sel="water" aria-label="Bình tưới nước"><span class="em">💧</span><span class="lb" id="wLb"></span><span class="meter"><b id="wMeter"></b></span></button>\`;
  h += \`<button class="slot \${S.sel === 'fert' ? 'sel' : ''}" data-sel="fert" aria-label="Phân bón"><span class="em">✨</span><span class="lb">Phân bón</span>\${S.fert > 0 ? \`<span class="cnt">\${S.fert}</span>\` : ''}</button>\`;
  FR.forEach((f, i) => {
    const lock = f.lv > S.lv;
    h += \`<button class="slot \${lock ? 'lock' : ''} \${S.sel === i ? 'sel' : ''}" data-sel="\${i}" aria-label="Hạt \${f.n}"><span class="em">\${lock ? '🔒' : f.e}</span><span class="lb">\${lock ? 'Cấp ' + f.lv : f.seed + ' xu'}</span>\${!lock && S.seeds[i] > 0 ? \`<span class="cnt">\${S.seeds[i]}</span>\` : ''}</button>\`;
  });
  box.innerHTML = h; box.scrollLeft = sl; updateMeter();
}
function updateMeter() {
  const l = $('wLb'), m = $('wMeter'); if (!l) return;
  l.textContent = Math.floor(S.water) + '/' + maxTank();
  m.style.width = clamp(S.water / maxTank() * 100, 0, 100) + '%';
}
$('slots').addEventListener('click', e => {
  const b = e.target.closest('[data-sel]'); if (!b) return; ensureAudio();
  const v = b.dataset.sel, val = (v === 'water' || v === 'fert') ? v : +v;
  if (typeof val === 'number' && FR[val].lv > S.lv) { toast('🔒 ' + FR[val].n + ' mở khóa ở cấp ' + FR[val].lv); sfx.err(); return; }
  S.sel = val; sfx.tap(); renderSlots();
});
function updateTip() {
  const tip = $('tip');
  if (!S.tut) { tip.classList.add('hide'); return; }
  const crops = S.plots.filter(p => p.u && p.crop >= 0);
  let t;
  if (!crops.length) t = 'Chọn 🍓 ở thanh dưới rồi chạm vào ô đất để gieo hạt!';
  else if (crops.some(p => p.prog >= FR[p.crop].grow)) t = 'Cây chín rồi! Chạm vào cây để thu hoạch nhé.';
  else t = 'Chọn 💧 rồi chạm vào cây để tưới, cây sẽ lớn nhanh hơn!';
  tip.textContent = t; tip.classList.remove('hide');
}
function refreshUI() { renderHud(); renderSlots(); updateTip(); if (sheetMode) renderSheet(); }

/* ================= Chợ (bảng trượt) ================= */
let sheetMode = null, sheetTab = 'seeds';
const TABS = [['seeds', '🌱 Hạt giống'], ['sell', '💰 Bán'], ['pets', '🐾 Vật nuôi'], ['up', '⚙️ Nâng cấp']];
function openSheet(mode, tab) { ensureAudio(); sheetMode = mode; if (tab) sheetTab = tab; $('sheet').classList.add('open'); renderSheet(); sfx.tap(); }
function closeSheet() { sheetMode = null; $('sheet').classList.remove('open'); }
$('sClose').onclick = closeSheet;
$('sheet').addEventListener('click', e => { if (e.target.id === 'sheet') closeSheet(); });
$('btnShop').onclick = () => openSheet('shop', 'seeds');
$('btnBarn').onclick = () => openSheet('shop', 'sell');
$('btnOrders').onclick = () => openSheet('orders');
$('snd').onclick = () => { ensureAudio(); S.sound = !S.sound; $('snd').textContent = S.sound ? '🔊' : '🔇'; save(); };

const coinI = '<span class="coin sm"></span>';
function renderSheet() {
  if (!sheetMode) return;
  const body = $('sBody'), st = body.scrollTop;
  const isShop = sheetMode === 'shop';
  $('sTitle').textContent = isShop ? 'Chợ Nông Sản' : 'Đơn hàng';
  $('sTabs').style.display = isShop ? 'flex' : 'none';
  if (isShop) $('sTabs').innerHTML = TABS.map(([k, l]) => \`<button class="tab \${sheetTab === k ? 'on' : ''}" data-tab="\${k}">\${l}</button>\`).join('');
  let h = '';
  if (!isShop) h = viewOrders();
  else if (sheetTab === 'seeds') h = viewSeeds();
  else if (sheetTab === 'sell') h = viewSell();
  else if (sheetTab === 'pets') h = viewPets();
  else h = viewUp();
  body.innerHTML = h; body.scrollTop = st; $('sCoins').textContent = fmt(S.coins);
}
$('sTabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; sheetTab = b.dataset.tab; $('sBody').scrollTop = 0; sfx.tap(); renderSheet(); });

function viewSeeds() {
  return FR.map((f, i) => {
    const lock = f.lv > S.lv;
    const acts = lock ? '' : \`<button class="btn \${S.coins < f.seed ? 'off' : ''}" data-act="seed" data-i="\${i}" data-n="1">×1 \${coinI}\${f.seed}</button>
      <button class="btn gold \${S.coins < f.seed * 5 ? 'off' : ''}" data-act="seed" data-i="\${i}" data-n="5">×5 \${coinI}\${f.seed * 5}</button>\`;
    return \`<div class="row \${lock ? 'lockrow' : ''}"><div class="ico">\${lock ? '🔒' : f.e}</div>
      <div class="info"><b>Hạt \${f.n}</b><small>\${lock ? 'Mở khóa ở cấp ' + f.lv : \`Lớn sau \${tfmt(f.grow)} · +\${f.xp} XP\`}</small>
      \${lock ? '' : \`<small>Bán \${priceOf(i)} xu · Đang có \${S.seeds[i]} hạt</small>\`}</div><div class="acts">\${acts}</div></div>\`;
  }).join('') + '<p class="empty" style="padding:6px 0 0;font-size:14px">Hết hạt vẫn gieo được: game sẽ tự mua hạt cho bạn nếu đủ xu.</p>';
}
function viewSell() {
  const idx = FR.map((_, i) => i).filter(i => FR[i].lv <= S.lv);
  let total = 0; idx.forEach(i => total += priceOf(i) * S.fruits[i]);
  let h = '';
  if (S.hot >= 0) h += \`<div class="sumcard"><span style="font-size:34px">🔥</span><div class="grow">Chợ đang thu mua <b>\${FR[S.hot].e} \${FR[S.hot].n}</b> giá cao hơn 30%!</div></div>\`;
  if (total > 0) h += \`<button class="btn gold big" data-act="sellall" style="margin-bottom:12px">Bán tất cả · +\${fmt(total)} \${coinI}</button>\`;
  else h += '<div class="empty">📦 Kho đang trống.<br>Hãy thu hoạch trái cây nhé!</div>';
  h += idx.map(i => {
    const f = FR[i], c = S.fruits[i];
    return \`<div class="row"><div class="ico" style="background:linear-gradient(#fff1cf,#ffe0a0);border-color:#f0cf85">\${f.e}</div>
      <div class="info"><b>\${f.n}</b><small>Có \${c} quả · \${priceOf(i)} xu/quả</small>\${S.hot === i ? '<span class="tag">🔥 Giá hot +30%</span>' : ''}</div>
      <div class="acts"><button class="btn \${c < 1 ? 'off' : ''}" data-act="sell" data-i="\${i}" data-n="1">Bán 1</button>
      <button class="btn gold \${c < 1 ? 'off' : ''}" data-act="sell" data-i="\${i}" data-n="all">Bán hết</button></div></div>\`;
  }).join('');
  return h;
}
function viewPets() {
  return PETS.map((p, k) => {
    const own = S.pets[p.id], lock = p.lv > S.lv;
    const act = own ? '<span class="chip">Đã có ✓</span>' : lock ? '<span class="chip">Cấp ' + p.lv + '</span>' :
      \`<button class="btn gold \${S.coins < p.price ? 'off' : ''}" data-act="pet" data-i="\${k}">\${coinI}\${fmt(p.price)}</button>\`;
    return \`<div class="row \${lock && !own ? 'lockrow' : ''}"><div class="ico" style="background:linear-gradient(#ffe9f0,#ffd0e0);border-color:#f3b5cb">\${lock && !own ? '🔒' : p.e}</div>
      <div class="info"><b>\${p.n}</b><small>\${lock && !own ? 'Mở khóa ở cấp ' + p.lv : p.d}</small></div><div class="acts">\${act}</div></div>\`;
  }).join('');
}
function viewUp() {
  const tc = 60 * Math.pow(2, S.tankLv), rc = 80 * Math.pow(2, S.refLv);
  const pr = (lv) => \`<div class="prog"><i style="width:\${lv / 5 * 100}%"></i></div>\`;
  return \`<div class="row"><div class="ico" style="background:linear-gradient(#dff2ff,#b6dfff);border-color:#93c9f0">🪣</div>
    <div class="info"><b>Bình tưới lớn</b><small>Sức chứa \${maxTank()} lần tưới · Cấp \${S.tankLv}/5</small>\${pr(S.tankLv)}</div>
    <div class="acts">\${S.tankLv >= 5 ? '<span class="chip">Tối đa</span>' : \`<button class="btn gold \${S.coins < tc ? 'off' : ''}" data-act="tank">\${coinI}\${fmt(tc)}</button>\`}</div></div>
  <div class="row"><div class="ico" style="background:linear-gradient(#dff2ff,#b6dfff);border-color:#93c9f0">🚰</div>
    <div class="info"><b>Vòi nước nhanh</b><small>Đầy 1 lần tưới sau \${refillEvery().toFixed(1)} giây · Cấp \${S.refLv}/5</small>\${pr(S.refLv)}</div>
    <div class="acts">\${S.refLv >= 5 ? '<span class="chip">Tối đa</span>' : \`<button class="btn gold \${S.coins < rc ? 'off' : ''}" data-act="ref">\${coinI}\${fmt(rc)}</button>\`}</div></div>
  <div class="row"><div class="ico" style="background:linear-gradient(#fff6c9,#ffe98a);border-color:#f0d160">✨</div>
    <div class="info"><b>Phân bón thần kỳ</b><small>Cây lớn thêm 40% ngay lập tức</small><small>Đang có \${S.fert}</small></div>
    <div class="acts"><button class="btn \${S.coins < 20 ? 'off' : ''}" data-act="fert" data-n="1">×1 \${coinI}20</button>
    <button class="btn gold \${S.coins < 90 ? 'off' : ''}" data-act="fert" data-n="5">×5 \${coinI}90</button></div></div>
  <div class="row"><div class="ico" style="background:linear-gradient(#eaf8d9,#cdeeb0);border-color:#b8dc98">🌾</div>
    <div class="info"><b>Mở rộng đất</b><small>Chạm vào ô cỏ 🔒 trên nông trại để mua thêm đất (\${unlockedCount()}/\${N * N} ô).</small></div>
    <div class="acts">\${unlockedCount() >= N * N ? '<span class="chip">Đủ rồi</span>' : \`<span class="chip">\${coinI}\${fmt(landPrice())}</span>\`}</div></div>\`;
}
function viewOrders() {
  return '<div class="sumcard"><span style="font-size:32px">🧺</span><div class="grow">Dân làng đang cần trái cây. Giao đủ hàng để nhận thưởng lớn hơn giá chợ!</div></div>' +
    S.orders.map((o, k) => {
      const have = S.fruits[o.f], ok = have >= o.qty, f = FR[o.f];
      return \`<div class="row"><div class="av">\${o.av}</div>
        <div class="info"><b>\${o.nm} cần \${o.qty} × \${f.e}</b><small>Trong kho: \${have}/\${o.qty} \${f.n}</small>
        <div class="chips"><span class="chip">\${coinI}\${fmt(o.coins)}</span><span class="chip">⭐ \${o.xp} XP</span></div>
        <div class="prog"><i style="width:\${clamp(have / o.qty * 100, 0, 100)}%"></i></div></div>
        <div class="acts"><button class="btn gold \${ok ? '' : 'off'}" data-act="deliver" data-i="\${k}">Giao</button></div></div>\`;
    }).join('');
}

$('sBody').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; ensureAudio();
  const a = b.dataset.act, i = +b.dataset.i, n = b.dataset.n;
  if (a === 'seed') {
    const f = FR[i], q = +n, cost = f.seed * q;
    if (S.coins < cost) { toast('Chưa đủ xu 🪙'); sfx.err(); return; }
    S.coins -= cost; S.seeds[i] += q; sfx.buy();
  } else if (a === 'sell') {
    const q = n === 'all' ? S.fruits[i] : Math.min(+n, S.fruits[i]); if (q < 1) { sfx.err(); return; }
    S.fruits[i] -= q; S.coins += priceOf(i) * q; sfx.coin();
  } else if (a === 'sellall') {
    let t = 0; FR.forEach((_, i) => { t += priceOf(i) * S.fruits[i]; S.fruits[i] = 0; }); S.coins += t; sfx.coin(); toast('Đã bán tất cả! +' + fmt(t) + ' 🪙');
  } else if (a === 'pet') {
    const p = PETS[i]; if (S.coins < p.price) { toast('Chưa đủ xu 🪙'); sfx.err(); return; }
    S.coins -= p.price; S.pets[p.id] = true; syncPets(); sfx.buy(); setTimeout(sfx.level, 150); toast(p.e + ' ' + p.n + ' đã về nông trại!');
  } else if (a === 'tank' || a === 'ref') {
    const lvKey = a === 'tank' ? 'tankLv' : 'refLv', cost = (a === 'tank' ? 60 : 80) * Math.pow(2, S[lvKey]);
    if (S.coins < cost) { toast('Chưa đủ xu 🪙'); sfx.err(); return; }
    S.coins -= cost; S[lvKey]++; sfx.buy();
  } else if (a === 'fert') {
    const q = +n, cost = q === 1 ? 20 : 90; if (S.coins < cost) { toast('Chưa đủ xu 🪙'); sfx.err(); return; }
    S.coins -= cost; S.fert += q; sfx.buy();
  } else if (a === 'deliver') {
    const o = S.orders[i]; if (!o || S.fruits[o.f] < o.qty) { toast('Chưa đủ hàng trong kho'); sfx.err(); return; }
    S.fruits[o.f] -= o.qty; S.coins += o.coins; sfx.coin(); toast(o.av + ' cảm ơn bạn! +' + fmt(o.coins) + ' 🪙');
    addXp(o.xp, true); S.orders[i] = makeOrder();
  }
  save(); refreshUI();
});

/* ================= Hộp thoại ================= */
let dlgOk = null;
function dialog({ emoji, title, html, ok = 'Tuyệt vời!', cancel, onOk }) {
  dlgOk = onOk || null;
  $('dlgCard').innerHTML = \`<div class="em">\${emoji}</div><h3>\${title}</h3><div class="tx">\${html}</div>
    <div class="two">\${cancel ? \`<button class="btn cancel" data-d="no">\${cancel}</button>\` : ''}<button class="btn gold" data-d="ok">\${ok}</button></div>\`;
  $('dlg').classList.add('show');
}
$('dlg').addEventListener('click', e => {
  const b = e.target.closest('[data-d]'); if (!b) return;
  $('dlg').classList.remove('show');
  if (b.dataset.d === 'ok' && dlgOk) dlgOk(); dlgOk = null;
});

/* ================= Cấp độ, đơn hàng ================= */
function makeOrder() {
  const un = FR.map((_, i) => i).filter(i => FR[i].lv <= S.lv);
  const f = pick(un.flatMap(i => Array(i + 1).fill(i)));
  const qty = clamp(Math.round(rand(3, 7) * Math.pow(.88, f)), 2, 8);
  const [nm, av] = pick(NAMES);
  return { nm, av, f, qty, coins: Math.round(qty * FR[f].sell * rand(1.6, 2)), xp: Math.round(qty * FR[f].xp * .6) };
}
function addXp(n, silent) {
  S.xp += n * xpMul();
  while (S.xp >= xpNeed(S.lv)) {
    S.xp -= xpNeed(S.lv); S.lv++;
    const bonus = S.lv * 15; S.coins += bonus;
    const un = [...FR.filter(f => f.lv === S.lv).map(f => f.e + ' Hạt ' + f.n), ...PETS.filter(p => p.lv === S.lv).map(p => p.e + ' ' + p.n)];
    sfx.level(); confetti();
    dialog({ emoji: '🎉', title: 'Lên cấp ' + S.lv + '!', html: \`Bạn được thưởng <b>\${bonus} 🪙</b>\` + (un.length ? '<br>Mới mở khóa: ' + un.join(', ') : '') });
  }
}

/* ================= Thế giới (canvas) ================= */
const cv = $('c'), ctx = cv.getContext('2d');
let W, H, DPR, tw, th, fieldCX, gy0, horizon, fieldTop, fieldH, T = 0, rain = 0, rainF = 0, rainCd = rand(70, 150);
const DAYLEN = 360, DAY0 = DAYLEN * .32;
let rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };

// yếu tố trang trí cố định
const grass = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), s: rand(.6, 1.2) }));
const flowers = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), c: pick(['#ff8fb1', '#fff', '#ffe066', '#c9a8f5']) }));
const stars = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random() * .9, r: rand(.5, 1.5), p: rand(0, 6) }));
const clouds = Array.from({ length: 5 }, (_, i) => ({ x: Math.random(), y: .05 + Math.random() * .16, s: rand(.7, 1.3), v: rand(.004, .012) }));
const flies = Array.from({ length: 16 }, () => ({ x: Math.random(), y: Math.random(), p: rand(0, 6), vx: rand(-.02, .02), vy: rand(-.01, .01) }));
const drops = Array.from({ length: 110 }, () => ({ x: Math.random(), y: Math.random(), v: rand(.9, 1.5) }));

function layout() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const barH = $('bar').offsetHeight + 8, topH = 100;
  horizon = H * .29;
  tw = Math.min((W - 24) / N, 118, ((H - barH - topH - 30) / N) / .55);
  th = tw * .55;
  fieldCX = W / 2 - Math.min(14, W * .02);
  fieldH = N * th + tw * .1;
  const aTop = Math.max(horizon + H * .04, topH + 30), aBot = H - barH - 6;
  fieldTop = aTop + Math.max(0, (aBot - aTop - fieldH) / 2);
  gy0 = fieldTop + th / 2;
}
const tp = (r, c) => ({ x: fieldCX + (c - r) * tw / 2, y: gy0 + (c + r) * th / 2 });
function hitTile(px, py) {
  const a = (px - fieldCX) / (tw / 2), b = (py - gy0 + tw * .1) / (th / 2);
  const c = Math.round((a + b) / 2), r = Math.round((b - a) / 2);
  return (r < 0 || c < 0 || r >= N || c >= N) ? -1 : r * N + c;
}

/* ---- ánh sáng ngày đêm ---- */
const phase = () => ((T + DAY0) % DAYLEN) / DAYLEN;
const light = () => clamp(.5 + .8 * Math.sin(2 * Math.PI * (phase() - .25)), 0, 1);
const mixC = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = c => \`rgb(\${c[0]},\${c[1]},\${c[2]})\`;
const NT = [11, 20, 54], NB = [40, 54, 112], DT = [88, 185, 245], DB = [207, 238, 255];

/* ---- hạt, chữ bay, trái cây bay ---- */
const fx = [];
const floatText = (x, y, txt, col = '#fff') => fx.push({ k: 't', x, y, txt, col, life: 1.4 });
function spark(x, y, n, cols, spd = 90, up = 40) {
  for (let i = 0; i < n; i++) { const a = rand(0, 6.283), v = rand(.3, 1) * spd; fx.push({ k: 's', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - up, life: 1, c: pick(cols), r: rand(2, 4.5) }); }
}
function confetti() {
  for (let i = 0; i < 80; i++) fx.push({ k: 'c', x: rand(0, W), y: -10, vx: rand(-40, 40), vy: rand(80, 240), r: rand(0, 6), vr: rand(-8, 8), s: rand(5, 9), life: 3, c: pick(['#ff8fb1', '#ffe066', '#7bd45d', '#6fc8ff', '#c9a8f5', '#ff9d5c']) });
}
function flyTo(e, x0, y0, targetEl, onEnd) {
  const r = targetEl.getBoundingClientRect();
  fx.push({ k: 'f', e, x0, y0, x1: r.left + r.width / 2, y1: r.top + r.height / 2, t: 0, dur: .75, onEnd, el: targetEl });
}
function drawFx(dt) {
  for (let i = fx.length - 1; i >= 0; i--) {
    const p = fx[i];
    if (p.k === 't') { p.y -= 34 * dt; p.life -= dt; ctx.globalAlpha = clamp(p.life * 1.4, 0, 1); ctx.font = \`800 20px "Baloo 2",sans-serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(60,35,15,.85)'; ctx.strokeText(p.txt, p.x, p.y); ctx.fillStyle = p.col; ctx.fillText(p.txt, p.x, p.y); ctx.globalAlpha = 1; }
    else if (p.k === 's') { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 220 * dt; p.life -= dt * 1.5; ctx.globalAlpha = clamp(p.life, 0, 1); ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life + .5, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
    else if (p.k === 'c') { p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.life -= dt * .6; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = clamp(p.life, 0, 1); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); ctx.globalAlpha = 1; }
    else if (p.k === 'f') { p.t += dt / p.dur; const e = 1 - Math.pow(1 - clamp(p.t, 0, 1), 2);
      const x = p.x0 + (p.x1 - p.x0) * e, y = p.y0 + (p.y1 - p.y0) * e - Math.sin(Math.PI * e) * 90;
      ctx.font = \`\${30 - 8 * e}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.e, x, y);
      if (p.t >= 1) { p.life = 0; if (p.onEnd) p.onEnd(); if (p.el) bump(p.el.closest('.fab') || p.el); } }
    if (p.life <= 0 || (p.k === 'f' && p.t >= 1) || (p.k === 'c' && p.y > H + 20)) fx.splice(i, 1);
  }
}

/* ---- vật nuôi ---- */
const walkers = []; const petT = { hen: 0, cow: 0 }; let bees = 0;
function bounds() {
  return { x0: 24, x1: W - 24, y0: horizon + H * .1, y1: Math.min(H - $('bar').offsetHeight - 20, fieldTop + fieldH + tw * .4) };
}
function syncPets() {
  PETS.forEach(p => {
    if (!S.pets[p.id]) return;
    if (p.id === 'bee') { bees = 4; return; }
    if (walkers.find(w => w.id === p.id)) return;
    const b = bounds(); const w = { id: p.id, e: p.e, sz: p.sz, x: rand(b.x0, b.x1), y: rand(b.y0, b.y1), tx: 0, ty: 0, sp: rand(22, 40), face: 1, wait: rand(0, 2), moving: false, ph: rand(0, 6) };
    w.tx = w.x; w.ty = w.y; walkers.push(w); spark(w.x, w.y, 14, ['#fff', '#ffe066', '#ff8fb1'], 110);
  });
}
function updateWalkers(dt) {
  const b = bounds();
  walkers.forEach(w => {
    w.x = clamp(w.x, b.x0, b.x1); w.y = clamp(w.y, b.y0, b.y1);
    if (w.wait > 0) { w.wait -= dt; w.moving = false; if (w.wait <= 0) { w.tx = rand(b.x0, b.x1); w.ty = rand(b.y0, b.y1); } return; }
    const dx = w.tx - w.x, dy = w.ty - w.y, d = Math.hypot(dx, dy);
    if (d < 4) { w.wait = rand(1.5, 5); return; }
    w.moving = true; w.x += dx / d * w.sp * dt; w.y += dy / d * w.sp * dt; if (Math.abs(dx) > 3) w.face = dx > 0 ? -1 : 1;
  });
  if (S.pets.hen) { petT.hen += dt; if (petT.hen >= 25) { petT.hen = 0; const w = walkers.find(w => w.id === 'hen'); S.coins += 7; if (w) floatText(w.x, w.y - tw * .3, '🥚 +7', '#ffe066'); sfx.coin(); renderHud(); save(); } }
  if (S.pets.cow) { petT.cow += dt; if (petT.cow >= 60) { petT.cow = 0; const w = walkers.find(w => w.id === 'cow'); S.coins += 45; if (w) floatText(w.x, w.y - tw * .45, '🥛 +45', '#ffe066'); sfx.coin(); renderHud(); save(); } }
}
function drawWalker(w) {
  const s = tw * w.sz * 1.15, bob = w.moving ? -Math.abs(Math.sin(T * 11 + w.ph)) * 3 : Math.sin(T * 2 + w.ph) * .6;
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(w.x, w.y, s * .42, s * .14, 0, 0, 6.283); ctx.fill();
  ctx.save(); ctx.translate(w.x, w.y - s * .48 + bob); ctx.scale(w.face, 1);
  ctx.font = \`\${s}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(w.e, 0, 0); ctx.restore();
}
function drawBees() {
  if (!bees) return;
  for (let i = 0; i < bees; i++) {
    const a = T * (.9 + i * .23) + i * 1.7, x = fieldCX + Math.cos(a) * tw * (1.3 + i * .25), y = fieldTop + fieldH * .45 + Math.sin(a * 1.3) * th * 1.6 - tw * .3;
    ctx.font = \`\${tw * .2}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🐝', x, y);
  }
}

/* ---- cảnh nền ---- */
function drawSky(L) {
  const top = mixC(NT, DT, L); let bot = mixC(NB, DB, L);
  const warm = clamp(1 - Math.abs(L - .5) * 3, 0, 1); bot = mixC(bot, [255, 160, 110], warm * .55);
  const g = ctx.createLinearGradient(0, 0, 0, horizon * 1.25); g.addColorStop(0, rgb(top)); g.addColorStop(1, rgb(bot));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, horizon * 1.3);
  if (L < .5) { ctx.fillStyle = '#fff'; stars.forEach(s => { ctx.globalAlpha = clamp((.5 - L) * 2, 0, 1) * (.5 + .5 * Math.sin(T * 1.5 + s.p)); ctx.beginPath(); ctx.arc(s.x * W, s.y * horizon, s.r, 0, 6.283); ctx.fill(); }); ctx.globalAlpha = 1; }
  const p = phase(), arc = q => ({ x: W * (.1 + .8 * q), y: horizon * .95 - Math.sin(Math.PI * q) * horizon * .72 });
  if (p >= .25 && p <= .75) {
    const s = arc((p - .25) * 2), gl = ctx.createRadialGradient(s.x, s.y, 4, s.x, s.y, 70);
    gl.addColorStop(0, 'rgba(255,240,170,.9)'); gl.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(s.x, s.y, 70, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#fff4b8'; ctx.beginPath(); ctx.arc(s.x, s.y, 22, 0, 6.283); ctx.fill();
  } else {
    const m = arc((((p < .25 ? p + 1 : p) - .75)) * 2), gl = ctx.createRadialGradient(m.x, m.y, 4, m.x, m.y, 60);
    gl.addColorStop(0, 'rgba(230,240,255,.55)'); gl.addColorStop(1, 'rgba(230,240,255,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(m.x, m.y, 60, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#f6f3e2'; ctx.beginPath(); ctx.arc(m.x, m.y, 17, 0, 6.283); ctx.fill();
    ctx.fillStyle = 'rgba(190,190,170,.5)'; ctx.beginPath(); ctx.arc(m.x - 5, m.y - 3, 4, 0, 6.283); ctx.arc(m.x + 5, m.y + 5, 3, 0, 6.283); ctx.fill();
  }
  ctx.fillStyle = \`rgba(255,255,255,\${.35 + L * .55})\`;
  clouds.forEach(c => {
    const x = ((c.x + T * c.v) % 1.3 - .15) * W, y = c.y * H, s = 34 * c.s;
    ctx.beginPath(); ctx.ellipse(x, y, s * 1.4, s * .5, 0, 0, 6.283); ctx.ellipse(x - s * .7, y + s * .1, s * .8, s * .4, 0, 0, 6.283);
    ctx.ellipse(x + s * .8, y + s * .12, s * .9, s * .42, 0, 0, 6.283); ctx.ellipse(x + s * .1, y - s * .3, s * .8, s * .5, 0, 0, 6.283); ctx.fill();
  });
}
function hillPath(off, amp, base) {
  ctx.beginPath(); ctx.moveTo(0, horizon + 40);
  for (let x = 0; x <= W + 10; x += 10) ctx.lineTo(x, base - Math.sin(x * .011 + off) * amp - Math.sin(x * .029 + off * 2) * amp * .35);
  ctx.lineTo(W, horizon + 40); ctx.closePath();
}
function drawGround() {
  hillPath(1, 20, horizon - 14); ctx.fillStyle = '#8ccf86'; ctx.fill();
  hillPath(3.4, 14, horizon + 2); ctx.fillStyle = '#74c46f'; ctx.fill();
  const g = ctx.createLinearGradient(0, horizon, 0, H); g.addColorStop(0, '#8adb72'); g.addColorStop(1, '#4da14b');
  ctx.fillStyle = g; ctx.fillRect(0, horizon + 6, W, H - horizon);
  ctx.fillStyle = 'rgba(255,255,255,.05)'; for (let y = horizon + 10, k = 0; y < H; y += 30, k++) if (k % 2) ctx.fillRect(0, y, W, 30);
  const gh = H - horizon - 10;
  grass.forEach(t => { const x = t.x * W, y = horizon + 16 + t.y * gh; ctx.strokeStyle = 'rgba(46,120,50,.45)'; ctx.lineWidth = 1.6; ctx.beginPath();
    ctx.moveTo(x - 4 * t.s, y); ctx.lineTo(x - 2 * t.s, y - 7 * t.s); ctx.moveTo(x, y); ctx.lineTo(x, y - 9 * t.s); ctx.moveTo(x + 4 * t.s, y); ctx.lineTo(x + 2 * t.s, y - 7 * t.s); ctx.stroke(); });
  flowers.forEach(f => { const x = f.x * W, y = horizon + 20 + f.y * gh; ctx.fillStyle = f.c; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffd54a'; ctx.beginPath(); ctx.arc(x, y, 1, 0, 6.283); ctx.fill(); });
}
function drawTrees() {
  [[.04, 1, '🌳'], [.3, .8, '🌲'], [.6, .95, '🌳'], [.86, 1.05, '🌲'], [.97, .8, '🌳']].forEach(([fx_, s, e]) => {
    ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.beginPath(); ctx.ellipse(fx_ * W, horizon + 16, 22 * s, 6 * s, 0, 0, 6.283); ctx.fill();
    ctx.font = \`\${58 * s}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(e, fx_ * W, horizon + 16);
  });
}
function drawBarn() {
  const s = Math.min(W * .27, 112), x = W * .2, y = horizon + Math.max(34, H * .06), w = s, h = s * .72;
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(x, y + 2, w * .62, h * .1, 0, 0, 6.283); ctx.fill();
  const bg = ctx.createLinearGradient(0, y - h, 0, y); bg.addColorStop(0, '#d9574a'); bg.addColorStop(1, '#b53f34');
  ctx.fillStyle = bg; ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1.5; for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + i * w / 8, y - h); ctx.lineTo(x - w / 2 + i * w / 8, y); ctx.stroke(); }
  ctx.fillStyle = '#7a4a35'; ctx.beginPath(); ctx.moveTo(x - w * .62, y - h + 2); ctx.lineTo(x, y - h - s * .5); ctx.lineTo(x + w * .62, y - h + 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5c3524'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#ffe9a8'; rr(x - w * .11, y - h - s * .2, w * .22, s * .16, 3); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  const dw = w * .4, dh = h * .62; ctx.fillStyle = '#9e3329'; ctx.fillRect(x - dw / 2, y - dh, dw, dh); ctx.strokeStyle = '#fff5e0'; ctx.lineWidth = 2.5; ctx.strokeRect(x - dw / 2, y - dh, dw, dh);
  ctx.beginPath(); ctx.moveTo(x - dw / 2, y - dh); ctx.lineTo(x + dw / 2, y); ctx.moveTo(x + dw / 2, y - dh); ctx.lineTo(x - dw / 2, y); ctx.stroke();
  ctx.font = \`\${s * .3}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('🌾', x + w * .5, y + 2); ctx.fillText('🪵', x - w * .55, y + 2);
}
function quad(pts, fill) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
const flashes = {};
function drawTile(r, c) {
  const i = r * N + c, p = S.plots[i], { x, y } = tp(r, c), w = tw * .97, h = th * .97, d = tw * .09;
  if (p.u) {
    quad([x - w / 2, y, x, y + h / 2, x, y + h / 2 + d, x - w / 2, y + d], '#63401f');
    quad([x, y + h / 2, x + w / 2, y, x + w / 2, y + d, x, y + h / 2 + d], '#75492a');
    const wet = p.wet > 0 ? clamp(p.wet / 4, 0, 1) : 0, g = ctx.createLinearGradient(x, y - h / 2, x, y + h / 2);
    g.addColorStop(0, wet ? '#7c4c2b' : '#b07240'); g.addColorStop(1, wet ? '#5d3820' : '#8e5a32');
    quad([x, y - h / 2, x + w / 2, y, x, y + h / 2, x - w / 2, y], g);
    ctx.strokeStyle = 'rgba(60,30,10,.22)'; ctx.lineWidth = 1.6;
    for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(x - w * .28 + k * w * .12, y - h * .2 + k * h * .12 - h * .12); ctx.lineTo(x + w * .18 + k * w * .12, y + h * .16 + k * h * .12 - h * .12); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x, y - h / 2); ctx.lineTo(x + w / 2, y); ctx.stroke();
    if (p.wet > 0) { ctx.fillStyle = \`rgba(160,220,255,\${.5 * clamp(p.wet / 4, 0, 1) * (.6 + .4 * Math.sin(T * 5 + i))})\`; ctx.beginPath(); ctx.ellipse(x, y, w * .2, h * .18, 0, 0, 6.283); ctx.fill(); }
  } else {
    quad([x - w / 2, y, x, y + h / 2, x, y + h / 2 + d * .5, x - w / 2, y + d * .5], '#4c9a49');
    quad([x, y + h / 2, x + w / 2, y, x + w / 2, y + d * .5, x, y + h / 2 + d * .5], '#57a955');
    quad([x, y - h / 2, x + w / 2, y, x, y + h / 2, x - w / 2, y], 'rgba(160,230,130,.95)');
    ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y - h * .42); ctx.lineTo(x + w * .43, y); ctx.lineTo(x, y + h * .42); ctx.lineTo(x - w * .43, y); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = .85; ctx.font = \`\${tw * .27}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔒', x, y - 1); ctx.globalAlpha = 1;
  }
  const fl = flashes[i]; if (fl > 0) { ctx.fillStyle = \`rgba(255,255,255,\${fl * .5})\`; quad([x, y - h / 2, x + w / 2, y, x, y + h / 2, x - w / 2, y], ctx.fillStyle); }
}
function drawCrop(x, y, p, i) {
  const fr = FR[p.crop], f = p.prog / fr.grow, ready = f >= 1, s = tw;
  const bob = ready ? Math.sin(T * 4 + i) * s * .02 : 0, sway = Math.sin(T * 1.4 + i * 1.7) * s * .012;
  if (ready) { const gl = ctx.createRadialGradient(x, y, 2, x, y, s * .42); gl.addColorStop(0, 'rgba(255,240,150,.75)'); gl.addColorStop(1, 'rgba(255,240,150,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.ellipse(x, y, s * .42, s * .24, 0, 0, 6.283); ctx.fill(); }
  ctx.save(); ctx.translate(x + sway, y + bob);
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(0, 0, s * .2, s * .07, 0, 0, 6.283); ctx.fill();
  if (f < .16) {
    const z = s * (.22 + f * 1.1); ctx.font = \`\${z}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('🌱', 0, 2);
  } else {
    const g = clamp((f - .1) / .6, 0, 1), b = s * (.13 + .17 * g);
    [['#3b9d4b', -.6, -.55, .78], ['#4fb85b', .6, -.5, .78], ['#66cc6d', 0, -.95, .82]].forEach(([c, ox, oy, k]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(ox * b, oy * b, b * k, b * k * .85, 0, 0, 6.283); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(-.25 * b, -1.15 * b, b * .3, b * .2, -.5, 0, 6.283); ctx.fill();
    const fg = clamp((f - .5) / .5, 0, 1);
    if (fg > 0) {
      const n = fg > .75 ? 3 : fg > .4 ? 2 : 1, fs = s * (.13 + .22 * fg);
      ctx.font = \`\${fs}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      [[-.62, -.55], [.62, -.5], [0, -1.05]].slice(0, n).forEach(([ox, oy]) => ctx.fillText(fr.e, ox * b * 1.05, oy * b * 1.05 - fs * .12));
    }
  }
  ctx.restore();
  if (!ready) {
    const bw = tw * .34, bx = x - bw / 2, by = y + th * .2;
    ctx.fillStyle = 'rgba(60,35,15,.55)'; rr(bx, by, bw, 6, 3); ctx.fill();
    ctx.fillStyle = p.wet > 0 ? '#6cc8ff' : '#8fdc5f'; rr(bx + 1, by + 1, Math.max(3, (bw - 2) * f), 4, 2); ctx.fill();
  } else if (Math.random() < .03) spark(x + rand(-tw * .2, tw * .2), y - tw * rand(.1, .4), 1, ['#fff7b0', '#fff'], 20, 20);
}
function drawRain(dt) {
  if (rainF < .01) return;
  ctx.strokeStyle = \`rgba(200,225,255,\${.55 * rainF})\`; ctx.lineWidth = 1.5; ctx.beginPath();
  drops.forEach(d => { d.y += d.v * dt * 1.6; d.x -= dt * .05; if (d.y > 1) { d.y = -.05; d.x = Math.random() * 1.1; }
    const x = d.x * W, y = d.y * H; ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 14); });
  ctx.stroke();
}

function draw(dt) {
  const L = light();
  ctx.clearRect(0, 0, W, H);
  drawSky(L); drawGround(); drawTrees(); drawBarn();
  ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.ellipse(fieldCX, fieldTop + fieldH * .52, N * tw * .56, fieldH * .58, 0, 0, 6.283); ctx.fill();
  const order = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) order.push([r, c]);
  order.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach(([r, c]) => drawTile(r, c));
  const ents = [];
  S.plots.forEach((p, i) => { if (p.u && p.crop >= 0) { const { x, y } = tp((i / N) | 0, i % N); ents.push({ y: y + 1, d: () => drawCrop(x, y, p, i) }); } });
  walkers.forEach(w => ents.push({ y: w.y, d: () => drawWalker(w) }));
  ents.sort((a, b) => a.y - b.y).forEach(e => e.d());
  drawBees();
  if (rainF > .01) { ctx.fillStyle = \`rgba(70,90,125,\${.24 * rainF})\`; ctx.fillRect(0, 0, W, H); }
  ctx.fillStyle = \`rgba(12,22,70,\${(1 - L) * .5})\`; ctx.fillRect(0, 0, W, H);
  if (L < .45) {
    ctx.globalCompositeOperation = 'lighter';
    flies.forEach(f => { f.x += f.vx * dt + Math.sin(T + f.p) * .0006; f.y += f.vy * dt + Math.cos(T * .8 + f.p) * .0006;
      if (f.x < 0) f.x = 1; if (f.x > 1) f.x = 0; if (f.y < .35) f.y = .95; if (f.y > .97) f.y = .4;
      const x = f.x * W, y = f.y * H, a = clamp((.45 - L) * 3, 0, 1) * (.4 + .6 * Math.sin(T * 2 + f.p)), g = ctx.createRadialGradient(x, y, 0, x, y, 12);
      g.addColorStop(0, \`rgba(255,240,150,\${a})\`); g.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.283); ctx.fill(); });
    ctx.globalCompositeOperation = 'source-over';
  }
  drawRain(dt);
  drawFx(dt);
}

/* ================= Hành động trên nông trại ================= */
function centerOf(i) { return tp((i / N) | 0, i % N); }
function plantAt(i, f) {
  const p = S.plots[i], fr = FR[f];
  if (fr.lv > S.lv) { toast('🔒 ' + fr.n + ' mở khóa ở cấp ' + fr.lv); sfx.err(); return; }
  const { x, y } = centerOf(i);
  if (S.seeds[f] > 0) S.seeds[f]--;
  else if (S.coins >= fr.seed) { S.coins -= fr.seed; floatText(x, y - tw * .5, '-' + fr.seed + ' 🪙', '#ffb0a0'); }
  else { toast('Chưa đủ xu để mua hạt ' + fr.e); sfx.err(); openSheet('shop', 'seeds'); return; }
  p.crop = f; p.prog = 0; p.wet = 0; p.rd = false; flashes[i] = 1;
  spark(x, y, 10, ['#b07240', '#8e5a32', '#7bd45d'], 70, 60); sfx.plant(); save(); refreshUI();
}
function harvestAt(i) {
  const p = S.plots[i], fr = FR[p.crop], { x, y } = centerOf(i), f = p.crop, q = Math.random() < .3 ? 2 : 1;
  p.crop = -1; p.prog = 0; p.rd = false; p.wet = 0; S.tut = S.tut && false;
  spark(x, y - tw * .2, 14, ['#fff7b0', '#ffe066', '#fff'], 120, 70); sfx.harvest();
  floatText(x, y - tw * .55, '+' + q + ' ' + fr.e, '#fff');
  for (let k = 0; k < q; k++) setTimeout(() => flyTo(fr.e, x + rand(-8, 8), y - tw * .3, $('btnBarn'), () => { S.fruits[f]++; renderHud(); if (sheetMode) renderSheet(); }), k * 120);
  addXp(fr.xp); save(); refreshUI();
}
function waterAt(i) {
  const p = S.plots[i], { x, y } = centerOf(i);
  if (S.water < 1) { toast('Bình tưới hết nước, đợi một chút nhé 💧'); sfx.err(); return; }
  S.water -= 1; p.wet = 14; sfx.water(); flashes[i] = .8;
  for (let k = 0; k < 12; k++) fx.push({ k: 's', x: x + rand(-tw * .2, tw * .2), y: y - tw * .6, vx: rand(-15, 15), vy: rand(20, 80), life: 1, c: pick(['#8fd4ff', '#c4ebff', '#5fb8f5']), r: rand(2, 3.5) });
  updateMeter();
}
function fertAt(i) {
  const p = S.plots[i], fr = FR[p.crop], { x, y } = centerOf(i);
  if (S.fert < 1) { toast('Hết phân bón rồi, mua thêm ở Chợ nhé ✨'); sfx.err(); openSheet('shop', 'up'); return; }
  S.fert--; p.prog = Math.min(fr.grow, p.prog + fr.grow * .4); sfx.fert(); spark(x, y - tw * .3, 18, ['#fff7b0', '#ffe066', '#b6f5a0'], 110, 60); save(); refreshUI();
}
function buyLand(i) {
  const price = landPrice(), { x, y } = centerOf(i);
  dialog({ emoji: '🌾', title: 'Mở rộng đất', html: \`Mua ô đất này với giá <b>\${fmt(price)} 🪙</b>?<br>Bạn đang có \${fmt(S.coins)} 🪙\`, ok: 'Mua ngay', cancel: 'Để sau',
    onOk: () => {
      if (S.coins < price) { toast('Chưa đủ xu 🪙'); sfx.err(); return; }
      S.coins -= price; S.plots[i].u = true; sfx.buy(); spark(x, y, 22, ['#7bd45d', '#ffe066', '#fff'], 130, 70); flashes[i] = 1; save(); refreshUI();
    } });
}
cv.addEventListener('pointerdown', e => {
  ensureAudio();
  if (sheetMode || $('dlg').classList.contains('show')) return;
  const i = hitTile(e.clientX, e.clientY); if (i < 0) return;
  const p = S.plots[i], { x, y } = centerOf(i);
  if (!p.u) { buyLand(i); return; }
  if (p.crop >= 0) {
    const fr = FR[p.crop];
    if (p.prog >= fr.grow) { harvestAt(i); return; }
    if (S.sel === 'water') { waterAt(i); return; }
    if (S.sel === 'fert') { fertAt(i); return; }
    const rate = growMul() * (p.wet > 0 ? 1.8 : 1);
    floatText(x, y - tw * .6, '⏳ ' + tfmt((fr.grow - p.prog) / rate), '#fff'); flashes[i] = .6; sfx.tap(); return;
  }
  if (S.sel === 'water' || S.sel === 'fert') { toast('Hãy chọn một loại hạt ở thanh dưới để gieo 🌱'); return; }
  plantAt(i, S.sel);
});

/* ================= Vòng lặp trò chơi ================= */
let uiT = 0, saveT = 0, birdT = rand(6, 12), hotFirst = true;
function update(dt) {
  const lightNow = light();
  S.plots.forEach((p, i) => {
    if (!p.u) return;
    if (p.wet > 0) p.wet = Math.max(0, p.wet - dt);
    if (p.crop >= 0) {
      const fr = FR[p.crop];
      if (p.prog < fr.grow) { const boost = Math.max(rain > 0 ? 2 : 1, p.wet > 0 ? 1.8 : 1); p.prog = Math.min(fr.grow, p.prog + dt * growMul() * boost); }
      if (p.prog >= fr.grow && !p.rd) { p.rd = true; sfx.ready(); const { x, y } = centerOf(i); spark(x, y - tw * .3, 8, ['#fff7b0', '#fff'], 60, 50); updateTip(); }
    }
    if (flashes[i] > 0) flashes[i] = Math.max(0, flashes[i] - dt * 2.5);
  });
  S.water = Math.min(maxTank(), S.water + dt / refillEvery());
  rainCd -= dt;
  if (rain > 0) { rain -= dt; if (rain <= 0) { rain = 0; toast('☀️ Mưa tạnh rồi!'); } }
  else if (rainCd <= 0) { rain = 16; rainCd = rand(150, 270); toast('🌧️ Trời mưa! Cây lớn nhanh gấp đôi'); }
  rainF += ((rain > 0 ? 1 : 0) - rainF) * Math.min(1, dt * 1.2);
  S.hotT -= dt;
  if (S.hotT <= 0) {
    const un = FR.map((_, i) => i).filter(i => FR[i].lv <= S.lv), prev = S.hot;
    S.hot = pick(un.length > 1 ? un.filter(i => i !== prev) : un); S.hotT = 150;
    if (!hotFirst) toast('🔥 Chợ đang thu mua ' + FR[S.hot].e + ' giá cao!'); hotFirst = false;
    if (sheetMode) renderSheet();
  }
  birdT -= dt; if (birdT <= 0) { birdT = rand(8, 16); if (lightNow > .55 && rain <= 0) sfx.bird(); }
  updateWalkers(dt);
  uiT += dt; if (uiT > .25) { uiT = 0; updateMeter(); if (S.tut) updateTip(); }
  saveT += dt; if (saveT > 6) { saveT = 0; save(); }
}

function init() {
  $('snd').textContent = S.sound ? '🔊' : '🔇';
  while (S.orders.length < 3) S.orders.push(makeOrder());
  if (saved) {
    const away = clamp((Date.now() - (saved.saved || Date.now())) / 1000, 0, 6 * 3600);
    if (away > 8) {
      let done = 0;
      S.plots.forEach(p => { if (p.u && p.crop >= 0) { const fr = FR[p.crop]; const was = p.prog >= fr.grow; p.prog = Math.min(fr.grow, p.prog + away * growMul()); if (!was && p.prog >= fr.grow) done++; } });
      S.water = Math.min(maxTank(), S.water + away / refillEvery());
      if (done) setTimeout(() => toast('🎉 Chào mừng trở lại! ' + done + ' cây đã chín'), 600);
    }
  }
  S.plots.forEach(p => { p.rd = p.crop >= 0 && p.prog >= FR[p.crop].grow; });
  layout(); syncPets(); refreshUI();
}
window.addEventListener('resize', () => { layout(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
window.addEventListener('pagehide', save);

init();
let last = performance.now();
(function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt;
  update(dt); draw(dt); requestAnimationFrame(loop);
})(last);
})();
<\/script>
</body>
</html>
`,k=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Góc thư giãn</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700&display=swap" rel="stylesheet">
<style>
  :root{
    --night:#1b2142; --dusk:#2c2a5a; --peach:#ffb98a; --mint:#8fd6b5;
    --lav:#bfa8f0; --moon:#fff3cf; --pink:#ff9ec0;
  }
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body{height:100%;overflow:hidden;background:var(--night);color:var(--moon);
    font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif}
  canvas{position:fixed;inset:0;width:100%;height:100%;display:block;touch-action:none}
  .top{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:flex-start;
    padding:calc(env(safe-area-inset-top) + 14px) 16px 0;pointer-events:none}
  .brand h1{font-size:22px;font-weight:700;line-height:1.1;letter-spacing:.2px}
  .brand p{font-size:15px;opacity:.75;margin-top:2px}
  #sound{pointer-events:auto;width:44px;height:44px;border-radius:50%;border:0;cursor:pointer;
    background:rgba(255,243,207,.14);color:var(--moon);font-size:20px;backdrop-filter:blur(6px)}
  .bottom{position:fixed;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;gap:12px;
    padding:0 12px calc(env(safe-area-inset-bottom) + 14px);pointer-events:none}
  #hint{font-size:16px;padding:7px 16px;border-radius:99px;background:rgba(27,33,66,.55);
    backdrop-filter:blur(6px);text-align:center;max-width:92vw}
  nav{pointer-events:auto;display:flex;gap:4px;padding:5px;border-radius:99px;
    background:rgba(255,243,207,.12);backdrop-filter:blur(8px)}
  nav button{border:0;cursor:pointer;font:inherit;font-size:16px;font-weight:500;color:var(--moon);
    padding:9px 16px;border-radius:99px;background:transparent;transition:background .25s,color .25s}
  nav button[aria-selected="true"]{background:var(--peach);color:var(--night);font-weight:700}
  button:focus-visible{outline:3px solid var(--mint);outline-offset:2px}
  #toast{position:fixed;left:50%;top:22%;transform:translate(-50%,10px);opacity:0;pointer-events:none;
    max-width:min(86vw,420px);text-align:center;font-size:20px;line-height:1.35;padding:16px 22px;border-radius:22px;
    background:rgba(255,243,207,.92);color:var(--night);transition:opacity .5s,transform .5s;font-weight:500}
  #toast.show{opacity:1;transform:translate(-50%,0)}
  @media (prefers-reduced-motion:reduce){#toast{transition:none}}
</style>
</head>
<body>
<canvas id="c"></canvas>

<div class="top">
  <div class="brand">
    <h1>Góc thư giãn</h1>
    <p id="stat"></p>
  </div>
  <button id="sound" aria-label="Bật hoặc tắt âm thanh">🔊</button>
</div>

<div id="toast" role="status" aria-live="polite"></div>

<div class="bottom">
  <div id="hint"></div>
  <nav role="tablist" aria-label="Chọn trò chơi">
    <button role="tab" data-g="garden" aria-selected="true">Vườn đêm</button>
    <button role="tab" data-g="bubbles" aria-selected="false">Bong bóng</button>
    <button role="tab" data-g="breathe" aria-selected="false">Hít thở</button>
  </nav>
</div>

<script>
(() => {
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const statEl = document.getElementById('stat');
const hintEl = document.getElementById('hint');
const toastEl = document.getElementById('toast');
let W = 0, H = 0, DPR = 1, T = 0, current = null;

const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const easeSine = x => (1 - Math.cos(Math.PI * x)) / 2;
const easeBack = x => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);

/* ---------- Âm thanh (nốt ngũ cung, êm dịu) ---------- */
const SC = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880];
let ac = null, soundOn = true, padGain = null;
function initAudio() {
  if (ac) return;
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  padGain = ac.createGain();
  padGain.gain.value = soundOn ? 0.03 : 0;
  padGain.connect(ac.destination);
  [130.81, 196, 261.63, 329.63].forEach((f, i) => {
    const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const g = ac.createGain(); const base = 0.5 / (i + 1); g.gain.value = base;
    const l = ac.createOscillator(); l.frequency.value = 0.07 + i * 0.03;
    const lg = ac.createGain(); lg.gain.value = base * 0.5;
    l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(padGain);
    o.start(); l.start();
  });
}
function note(f, d = 1.2, v = 0.11) {
  if (!ac || !soundOn) return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g); g.connect(ac.destination);
  o.start(t); o.stop(t + d + 0.05);
}
document.getElementById('sound').addEventListener('click', e => {
  initAudio();
  soundOn = !soundOn;
  if (padGain) padGain.gain.value = soundOn ? 0.03 : 0;
  e.currentTarget.textContent = soundOn ? '🔊' : '🔇';
});

/* ---------- Lời nhắn nhẹ nhàng ---------- */
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 4200);
}
const TIPS = [
  'Bạn đã cố gắng rất nhiều hôm nay.',
  'Uống một ngụm nước nhé.',
  'Nhìn ra xa 20 giây để mắt được nghỉ.',
  'Vươn vai một cái thật dài nào.',
  'Hít sâu… rồi thở ra thật chậm.',
  'Nghỉ ngơi cũng là một phần của việc học.',
  'Ngồi thẳng lưng, thả lỏng đôi vai.',
  'Mỉm cười một chút, không cần lý do.'
];

/* ---------- GAME 1: Vườn đêm ---------- */
const garden = {
  plants: [], flies: [], stars: [], count: 0, attract: null, lastX: -999, lastY: -999,
  hint: 'Chạm vào đất để gieo hạt. Kéo ngón tay để trồng cả luống hoa.',
  groundY() { return H * 0.62; },
  init() {
    this.flies = Array.from({ length: 26 }, () => ({
      x: rand(0, W), y: rand(H * 0.3, H * 0.9), vx: 0, vy: 0, ph: rand(0, 6.28)
    }));
    this.stars = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random() * 0.55, r: rand(.3, 1.4), ph: rand(0, 6) }));
  },
  addPlant(x, y) {
    const gy = this.groundY();
    const depth = (y - gy) / (H - gy);
    this.plants.push({
      x, y, type: Math.floor(Math.random() * 4), hue: pick([340, 30, 270, 190, 50, 310]),
      h: rand(50, 100) * (0.6 + depth * 0.7), t: 0, ph: rand(0, 6.28), petals: 5 + Math.floor(Math.random() * 4)
    });
    if (this.plants.length > 70) this.plants.shift();
    this.count++;
    note(pick(SC), 1.8);
  },
  down(x, y) {
    if (y < this.groundY()) { this.attract = { x, y, t: 2.5 }; note(SC[7], 1.4, .06); return; }
    this.addPlant(x, y); this.lastX = x; this.lastY = y;
  },
  move(x, y, isDown) {
    this.attract = { x, y, t: 0.6 };
    if (isDown && y > this.groundY() && Math.hypot(x - this.lastX, y - this.lastY) > 46) {
      this.addPlant(x, y); this.lastX = x; this.lastY = y;
    }
  },
  update(dt) {
    this.plants.forEach(p => p.t += dt);
    if (this.attract) { this.attract.t -= dt; if (this.attract.t <= 0) this.attract = null; }
    this.flies.forEach(f => {
      f.vx += rand(-.5, .5) * 0.6; f.vy += rand(-.5, .5) * 0.6;
      if (this.attract) {
        const dx = this.attract.x - f.x, dy = this.attract.y - f.y, d = Math.hypot(dx, dy) + 1;
        f.vx += dx / d * 0.9; f.vy += dy / d * 0.9;
      }
      f.vx *= 0.96; f.vy *= 0.96;
      f.x += f.vx * 60 * dt * 0.5; f.y += f.vy * 60 * dt * 0.5;
      if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
      f.y = Math.max(H * 0.15, Math.min(H * 0.95, f.y));
    });
    return '🌼 ' + this.count + ' bông hoa';
  },
  draw() {
    const gy = this.groundY();
    let g = ctx.createLinearGradient(0, 0, 0, gy);
    g.addColorStop(0, '#141a3a'); g.addColorStop(.6, '#2c2a5a'); g.addColorStop(1, '#5a4a7a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    this.stars.forEach(s => {
      ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(T * 0.8 + s.ph));
      ctx.fillStyle = '#fff3cf';
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, 6.283); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // trăng
    const mx = W * 0.78, my = H * 0.16, mr = Math.min(W, H) * 0.06;
    let mg = ctx.createRadialGradient(mx, my, mr * .5, mx, my, mr * 4);
    mg.addColorStop(0, 'rgba(255,243,207,.35)'); mg.addColorStop(1, 'rgba(255,243,207,0)');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr * 4, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#fff3cf'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.283); ctx.fill();
    // đồi xa
    ctx.fillStyle = '#3b3570';
    ctx.beginPath(); ctx.moveTo(0, gy);
    for (let x = 0; x <= W; x += 12) ctx.lineTo(x, gy - 34 - Math.sin(x * 0.008 + 1) * 26 - Math.sin(x * 0.02) * 8);
    ctx.lineTo(W, gy + 2); ctx.lineTo(0, gy + 2); ctx.fill();
    // đất
    g = ctx.createLinearGradient(0, gy, 0, H);
    g.addColorStop(0, '#2f5b57'); g.addColorStop(1, '#173a3c');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, gy);
    for (let x = 0; x <= W; x += 12) ctx.lineTo(x, gy - Math.sin(x * 0.012 + 2) * 8);
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    // cây theo độ sâu
    [...this.plants].sort((a, b) => a.y - b.y).forEach(p => this.drawPlant(p));
    // đom đóm
    ctx.globalCompositeOperation = 'lighter';
    this.flies.forEach(f => {
      const a = 0.45 + 0.45 * Math.sin(T * 2 + f.ph);
      const rg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 14);
      rg.addColorStop(0, \`rgba(255,240,150,\${a})\`); rg.addColorStop(1, 'rgba(255,240,150,0)');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(f.x, f.y, 14, 0, 6.283); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
  },
  drawPlant(p) {
    const e = 1 - Math.pow(1 - Math.min(1, p.t / 2.4), 3);
    const b = Math.min(1, Math.max(0, (p.t - 1.5) / 1.3));
    const eb = b > 0 ? easeBack(b) : 0;
    const sway = Math.sin(T * 1.1 + p.ph) * 5 * e;
    const tx = p.x + sway, ty = p.y - p.h * e;
    // gò đất
    ctx.fillStyle = '#25443f';
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 9, 3.5, 0, 0, 6.283); ctx.fill();
    // thân
    ctx.strokeStyle = '#6fbf8f'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
    ctx.quadraticCurveTo(p.x + sway * 0.2, p.y - p.h * e * 0.55, tx, ty); ctx.stroke();
    // lá
    const lx = p.x + sway * 0.12, ly = p.y - p.h * e * 0.42, ls = 7 * e;
    ctx.fillStyle = '#7fd0a0';
    [-1, 1].forEach(s => { ctx.beginPath(); ctx.ellipse(lx + s * ls, ly, ls, ls * .45, s * -0.5, 0, 6.283); ctx.fill(); });
    if (eb <= 0) return;
    const s = eb * (0.8 + p.h / 130);
    ctx.save(); ctx.translate(tx, ty);
    ctx.rotate(sway * 0.02);
    if (p.type === 0) {
      ctx.fillStyle = \`hsl(\${p.hue},85%,80%)\`;
      for (let i = 0; i < p.petals; i++) {
        ctx.save(); ctx.rotate(i * 6.283 / p.petals);
        ctx.beginPath(); ctx.ellipse(0, -10 * s, 4.5 * s, 10 * s, 0, 0, 6.283); ctx.fill(); ctx.restore();
      }
      ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(0, 0, 5 * s, 0, 6.283); ctx.fill();
    } else if (p.type === 1) {
      ctx.fillStyle = \`hsl(\${p.hue},80%,70%)\`;
      [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 5 * s, -8 * s, 5 * s, 10 * s, d * 0.25, 0, 6.283); ctx.fill(); });
      ctx.fillStyle = \`hsl(\${p.hue},85%,78%)\`;
      ctx.beginPath(); ctx.ellipse(0, -10 * s, 5.5 * s, 11.5 * s, 0, 0, 6.283); ctx.fill();
    } else if (p.type === 2) {
      ctx.globalCompositeOperation = 'lighter';
      const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, 30 * s);
      rg.addColorStop(0, \`hsla(\${p.hue},95%,75%,.95)\`);
      rg.addColorStop(.4, \`hsla(\${p.hue},90%,65%,.35)\`);
      rg.addColorStop(1, \`hsla(\${p.hue},90%,60%,0)\`);
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, 30 * s, 0, 6.283); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#fff8e0'; ctx.beginPath(); ctx.arc(0, 0, 5 * s, 0, 6.283); ctx.fill();
    } else {
      ctx.fillStyle = \`hsl(\${p.hue},75%,76%)\`;
      for (let i = 0; i < 6; i++) {
        const a = i * 6.283 / 6;
        ctx.beginPath(); ctx.arc(Math.cos(a) * 8 * s, Math.sin(a) * 8 * s, 5.5 * s, 0, 6.283); ctx.fill();
      }
      ctx.fillStyle = '#fff3cf'; ctx.beginPath(); ctx.arc(0, 0, 4.5 * s, 0, 6.283); ctx.fill();
    }
    ctx.restore();
  }
};

/* ---------- GAME 2: Bong bóng ---------- */
const bubbles = {
  list: [], parts: [], popped: 0, spawn: 0,
  hint: 'Chạm hoặc lướt qua bong bóng. Bong bóng có ✦ giấu một lời nhắn nhỏ.',
  init() { this.list = []; this.parts = []; for (let i = 0; i < 9; i++) this.add(true); },
  add(initial) {
    const r = rand(24, 60);
    this.list.push({
      x: rand(r, Math.max(r + 1, W - r)), y: initial ? rand(0, H) : H + r, r,
      vy: rand(18, 46), ph: rand(0, 6.28), hue: pick([190, 280, 330, 160, 40, 220]),
      special: Math.random() < 0.13
    });
  },
  hit(x, y) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const b = this.list[i];
      if (Math.hypot(x - b.x, y - b.y) < b.r) { this.pop(i); return true; }
    }
    return false;
  },
  down(x, y) { this.hit(x, y); },
  move(x, y, isDown) { if (isDown) this.hit(x, y); },
  pop(i) {
    const b = this.list.splice(i, 1)[0];
    for (let k = 0; k < 12; k++) {
      const a = rand(0, 6.283), v = rand(40, 120);
      this.parts.push({ x: b.x, y: b.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, hue: b.hue });
    }
    this.popped++;
    const idx = Math.max(0, Math.min(9, Math.round(9 - (b.r - 24) / 36 * 9)));
    note(SC[idx], 1.4, .1);
    if (b.special) toast(pick(TIPS));
  },
  update(dt) {
    this.spawn -= dt;
    if (this.spawn <= 0 && this.list.length < 18) { this.add(false); this.spawn = rand(.5, 1.1); }
    this.list.forEach(b => { b.y -= b.vy * dt; b.x += Math.sin(T * .8 + b.ph) * 14 * dt; });
    this.list = this.list.filter(b => b.y > -b.r * 2);
    this.parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .95; p.vy *= .95; p.life -= dt * 1.6; });
    this.parts = this.parts.filter(p => p.life > 0);
    return '🫧 ' + this.popped + ' bong bóng';
  },
  draw() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1f3f6b'); g.addColorStop(.55, '#2b6a86'); g.addColorStop(1, '#3f9a9a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // tia sáng mờ
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const x = W * (0.2 + i * 0.3) + Math.sin(T * .2 + i) * 30;
      const lg = ctx.createLinearGradient(x, 0, x + 80, H * .8);
      lg.addColorStop(0, 'rgba(200,255,240,.10)'); lg.addColorStop(1, 'rgba(200,255,240,0)');
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 40, 0); ctx.lineTo(x + 160, H * .8); ctx.lineTo(x + 20, H * .8); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    this.list.forEach(b => {
      const rg = ctx.createRadialGradient(b.x - b.r * .3, b.y - b.r * .3, b.r * .1, b.x, b.y, b.r);
      rg.addColorStop(0, 'rgba(255,255,255,.45)');
      rg.addColorStop(.6, \`hsla(\${b.hue},80%,80%,.12)\`);
      rg.addColorStop(1, \`hsla(\${b.hue},85%,75%,.38)\`);
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
      ctx.strokeStyle = \`hsla(\${b.hue},90%,88%,.65)\`; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.beginPath(); ctx.ellipse(b.x - b.r * .42, b.y - b.r * .42, b.r * .2, b.r * .11, -0.7, 0, 6.283); ctx.fill();
      if (b.special) {
        ctx.fillStyle = '#ffd9a8'; ctx.font = \`700 \${b.r * .8}px "Baloo 2",sans-serif\`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('✦', b.x, b.y + 2);
      }
    });
    this.parts.forEach(p => {
      ctx.fillStyle = \`hsla(\${p.hue},90%,88%,\${Math.max(0, p.life)})\`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.life + .5, 0, 6.283); ctx.fill();
    });
  }
};

/* ---------- GAME 3: Hít thở ---------- */
const breathe = {
  t: 0, lastPh: -1, cycles: 0, motes: [],
  hint: 'Nhìn vào vòng tròn. Hít vào khi nó nở ra, thở ra khi nó thu lại.',
  init() { this.motes = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), s: rand(.4, 1.6), v: rand(.006, .02), ph: rand(0, 6) })); },
  state() {
    const t = this.t % 14;
    if (t < 4) return { ph: 0, lvl: easeSine(t / 4), rem: 4 - t };
    if (t < 8) return { ph: 1, lvl: 1, rem: 8 - t };
    return { ph: 2, lvl: 1 - easeSine((t - 8) / 6), rem: 14 - t };
  },
  down() {}, move() {},
  update(dt) {
    this.t += dt;
    const s = this.state();
    if (s.ph !== this.lastPh) {
      if (s.ph === 0 && this.lastPh === 2) {
        this.cycles++;
        if (this.cycles % 5 === 0) toast('Tuyệt lắm! Bạn vừa hít thở đều ' + this.cycles + ' nhịp.');
      }
      note([SC[2], SC[4], SC[0]][s.ph], 2.5, .09);
      this.lastPh = s.ph;
    }
    this.motes.forEach(m => { m.y -= m.v * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } });
    return '🌬️ ' + this.cycles + ' nhịp thở';
  },
  draw() {
    const { ph, lvl, rem } = this.state();
    const cx = W / 2, cy = H * 0.44, m = Math.min(W, H);
    const r = m * 0.13 + (m * 0.30 - m * 0.13) * lvl;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, \`hsl(\${235 + lvl * 20},45%,\${14 + lvl * 6}%)\`);
    g.addColorStop(1, \`hsl(\${262 - lvl * 40},40%,\${24 + lvl * 8}%)\`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,243,207,.5)';
    this.motes.forEach(mo => {
      ctx.globalAlpha = .25 + .35 * Math.abs(Math.sin(T + mo.ph));
      ctx.beginPath(); ctx.arc(mo.x * W, mo.y * H, mo.s, 0, 6.283); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 4; i >= 0; i--) {
      ctx.fillStyle = \`hsla(\${170 + i * 25},70%,65%,\${0.15 - i * 0.026})\`;
      ctx.beginPath(); ctx.arc(cx, cy, r * (1 + i * 0.22), 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    const cg = ctx.createRadialGradient(cx - r * .25, cy - r * .3, r * .1, cx, cy, r);
    cg.addColorStop(0, 'hsla(190,75%,86%,.95)'); cg.addColorStop(1, 'hsla(255,65%,76%,.85)');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#1b2142'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = \`700 \${Math.max(22, m * 0.06)}px "Baloo 2",sans-serif\`;
    ctx.fillText(['Hít vào', 'Giữ nhẹ', 'Thở ra'][ph], cx, cy - m * 0.015);
    ctx.font = \`500 \${Math.max(16, m * 0.04)}px "Baloo 2",sans-serif\`;
    ctx.globalAlpha = .7; ctx.fillText(Math.ceil(rem), cx, cy + m * 0.045); ctx.globalAlpha = 1;
  }
};

/* ---------- Điều khiển chung ---------- */
const games = { garden, bubbles, breathe };
const inited = {};
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
function select(name) {
  current = games[name];
  if (!inited[name]) { current.init(); inited[name] = true; }
  hintEl.textContent = current.hint;
  document.querySelectorAll('nav button').forEach(b =>
    b.setAttribute('aria-selected', b.dataset.g === name ? 'true' : 'false'));
  toastEl.classList.remove('show');
}
document.querySelectorAll('nav button').forEach(b =>
  b.addEventListener('click', () => { initAudio(); select(b.dataset.g); }));

let isDown = false;
cv.addEventListener('pointerdown', e => { initAudio(); isDown = true; current.down(e.clientX, e.clientY); });
cv.addEventListener('pointermove', e => current.move(e.clientX, e.clientY, isDown));
window.addEventListener('pointerup', () => isDown = false);
window.addEventListener('pointercancel', () => isDown = false);
window.addEventListener('resize', resize);

let last = performance.now(), lastStat = '';
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
  const s = current.update(dt);
  if (s !== lastStat) { statEl.textContent = s; lastStat = s; }
  current.draw();
  requestAnimationFrame(loop);
}

resize();
select('garden');
requestAnimationFrame(loop);
})();
<\/script>
</body>
</html>
`,A=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Trung Tâm Game</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  :root{--ink:#1d1340}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body{min-height:100%;color:#fff;font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif;
    background:radial-gradient(ellipse at 20% 0%,#5b34c9 0,transparent 55%),radial-gradient(ellipse at 90% 10%,#ff4d8d 0,transparent 45%),linear-gradient(#1d1048,#0e0824) fixed}
  body{padding:calc(env(safe-area-inset-top) + 18px) calc(env(safe-area-inset-right) + 16px) calc(env(safe-area-inset-bottom) + 28px) calc(env(safe-area-inset-left) + 16px)}
  .wrap{max-width:980px;margin:0 auto}
  header{text-align:center;margin-bottom:18px}
  h1{font-size:clamp(40px,10vw,68px);font-weight:800;font-style:italic;line-height:.95;transform:skewX(-5deg);
    text-shadow:0 3px 0 #ffb300,0 6px 0 #ff7a00,0 9px 0 #c2410c,0 14px 24px rgba(0,0,0,.5)}
  .sub{font-size:17px;font-weight:600;opacity:.85;margin-top:12px}
  .sum{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:16px 0 6px}
  .chip{padding:8px 16px;border-radius:99px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.22);font-weight:800;font-size:15px;backdrop-filter:blur(6px)}
  .chip b{color:#ffe066;font-size:18px}
  .cont{display:none;margin:14px auto 4px;width:min(100%,420px)}
  .cont.on{display:flex}
  .cont a{flex:1;text-align:center;text-decoration:none;color:#241250;font-weight:800;font-size:22px;font-style:italic;padding:12px 20px;border-radius:18px;
    background:linear-gradient(#a6ff6b,#38c92b);box-shadow:0 6px 0 #1f8f16,0 12px 20px rgba(0,0,0,.35)}
  .cont a:active{transform:translateY(4px);box-shadow:0 2px 0 #1f8f16}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin-top:18px}
  .card{position:relative;display:flex;flex-direction:column;gap:6px;padding:16px 16px 14px;border-radius:24px;text-decoration:none;color:#fff;overflow:hidden;
    border:2px solid rgba(255,255,255,.2);box-shadow:0 10px 24px rgba(0,0,0,.35);transition:transform .15s;min-height:168px}
  .card:active{transform:scale(.97)}
  @media (hover:hover){.card:hover{transform:translateY(-4px)}}
  .card::after{content:"";position:absolute;right:-30px;top:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.12)}
  .card .ic{font-size:44px;line-height:1;filter:drop-shadow(0 4px 4px rgba(0,0,0,.3))}
  .card h3{font-size:22px;font-weight:800;line-height:1.05}
  .card .tag{align-self:flex-start;font-size:11.5px;font-weight:800;padding:1px 9px;border-radius:99px;background:rgba(0,0,0,.28);letter-spacing:.3px}
  .card p{font-size:14px;font-weight:600;opacity:.92;line-height:1.25;flex:1}
  .card .st{font-size:14px;font-weight:800;padding:5px 10px;border-radius:12px;background:rgba(0,0,0,.3);align-self:stretch}
  .card .st.none{opacity:.6;font-weight:600}
  .new{position:absolute;top:12px;right:12px;z-index:2;font-size:11px;font-weight:800;padding:2px 9px;border-radius:99px;background:#ffe066;color:#3a2200}
  .tools{margin-top:26px;padding:16px;border-radius:22px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.18);text-align:center}
  .tools h2{font-size:20px;font-weight:800;margin-bottom:4px}
  .tools p{font-size:14px;opacity:.8;font-weight:600;margin-bottom:10px;line-height:1.3}
  .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
  .btn{border:0;cursor:pointer;font-family:inherit;font-weight:800;font-size:16px;color:#241250;padding:9px 18px;border-radius:14px;background:linear-gradient(#ffe37a,#f5b52c);box-shadow:0 4px 0 #b8781a}
  .btn:active{transform:translateY(3px);box-shadow:0 1px 0 #b8781a}
  .btn.alt{background:linear-gradient(#e6dcff,#b7a2f0);box-shadow:0 4px 0 #7a63c0}
  .btn.red{background:linear-gradient(#ffb0a8,#ff6b5e);box-shadow:0 4px 0 #b3362b;color:#3a0500}
  #msg{margin-top:10px;font-weight:700;font-size:14px;min-height:20px;color:#9bffb8}
  footer{text-align:center;opacity:.6;font-size:13px;margin-top:20px;font-weight:600}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>TRUNG TÂM<br>GAME</h1>
    <div class="sub">Chơi, thư giãn, lập kỷ lục. Tiến trình tự lưu trong trình duyệt của bạn.</div>
    <div class="sum" id="sum"></div>
    <div class="cont" id="cont"><a id="contA" href="#">▶ Chơi tiếp</a></div>
  </header>
  <div class="grid" id="grid"></div>

  <div class="tools">
    <h2>💾 Sao lưu tiến trình</h2>
    <p>Tiến trình lưu theo từng trình duyệt. Hãy tải file sao lưu để chuyển sang máy khác hoặc phòng khi lỡ xóa dữ liệu trình duyệt.</p>
    <div class="row">
      <button class="btn" id="bExport">⬇️ Tải file sao lưu</button>
      <button class="btn alt" id="bImport">📂 Khôi phục từ file</button>
      <button class="btn red" id="bReset">🗑 Xóa toàn bộ</button>
      <input type="file" id="file" accept=".json,application/json" hidden>
    </div>
    <div id="msg" role="status"></div>
  </div>
  <footer>Mở các file game cùng một thư mục để các nút bên trên hoạt động.</footer>
</div>

<script>
(() => {
'use strict';
const $ = id => document.getElementById(id);
const HUB = 'trung-tam-game-v1';
const rd = k => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
const raw = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const n = v => (v || 0).toLocaleString('vi-VN');
const sumStars = o => Object.values((o && o.lv) || {}).reduce((a, b) => a + (b.stars || 0), 0);

const GAMES = [
  { f: 'chem-trai-cay.html', ic: '🍉', n: 'Chém Trái Cây', tag: 'HÀNH ĐỘNG', c: ['#ff7a45', '#e8312f'], d: 'Vuốt nhanh để chém trái cây, né bom, mở khóa các loại dao.', isNew: 1,
    k: 'chem-trai-cay-v1', st: s => \`🏆 \${n(Math.max(s.best?.classic, s.best?.zen))} · \${n(s.total)} trái đã chém\`, score: s => Math.max(s.best?.classic || 0, s.best?.zen || 0) },
  { f: 'xep-khoi.html', ic: '🧩', n: 'Xếp Khối Màu', tag: 'GIẢI ĐỐ', c: ['#8b5cf6', '#ec4899'], d: 'Kéo thả khối vào bảng 8×8, lấp đầy hàng cột để nổ combo.', isNew: 1,
    k: 'xep-khoi-v1', st: s => \`🏆 \${n(s.best)} · \${n(s.games)} ván\${s.save ? ' · đang chơi dở' : ''}\`, score: s => s.best || 0 },
  { f: 'pha-gach.html', ic: '🧱', n: 'Phá Gạch Neon', tag: '12 MÀN', c: ['#06b6d4', '#4f46e5'], d: 'Đỡ bóng, phá gạch, hứng vật phẩm, thu đủ 3 sao mỗi màn.', isNew: 1,
    k: 'pha-gach-v1', st: s => \`⭐ \${sumStars(s)}/\${12 * 3} · mở tới màn \${s.unlocked || 1}\`, score: s => s.best || 0 },
  { f: 'metro-rush.html', ic: '🚆', n: 'Metro Rush', tag: '3D · CHẠY VÔ TẬN', c: ['#f97316', '#9333ea'], d: 'Chạy trốn bảo vệ, nhảy qua tàu, thu xu và mở khóa nhân vật.',
    k: 'metro-rush-v1', st: s => \`🏆 \${n(s.best)} · 🪙 \${n(s.coins)}\`, score: s => s.best || 0 },
  { f: 'vuon-thu-ho.html', ic: '🌻', n: 'Vườn Thủ Hộ', tag: 'PHÒNG THỦ', c: ['#65a30d', '#15803d'], d: 'Trồng cây đuổi sâu bọ. Cấu hình quái bằng JSON theo ý bạn.',
    k: 'vuon-thu-ho-prog-v1', st: s => \`⭐ đã thắng \${Object.keys(s.cleared || {}).length} màn\`, score: () => 0 },
  { f: 'nhay-xoay.html', ic: '🌀', n: 'Nhảy Xoáy', tag: '3D · ARCADE', c: ['#22d3ee', '#ec4899'], d: 'Xoay tháp cho bóng rơi xuyên khe hở, né vùng đỏ.',
    k: 'nhay-xoay-v1', st: s => \`🏆 \${n(s.best)} · màn \${s.level || 1}\`, score: s => s.best || 0 },
  { f: 'nong-trai-vui.html', ic: '🚜', n: 'Nông Trại Vui', tag: 'NÔNG TRẠI', c: ['#84cc16', '#ca8a04'], d: 'Trồng 10 loại quả, mua bán, nuôi thú, giao đơn hàng.',
    k: 'nong-trai-vui-v1', st: s => \`Cấp \${s.lv || 1} · 🪙 \${n(s.coins)}\`, score: () => 0 },
  { f: 'hu-trai-cay.html', ic: '🍇', n: 'Hũ Trái Cây', tag: 'XẾP & GỘP', c: ['#fb7185', '#f59e0b'], d: 'Thả trái cây, hai quả giống nhau gộp thành quả lớn hơn.',
    k: 'hu-trai-cay-v1', st: s => \`🏆 \${n(s.best)}\`, score: s => s.best || 0 },
  { f: 'noi-ong-nuoc.html', ic: '🚰', n: 'Nối Ống Nước', tag: 'GIẢI ĐỐ', c: ['#38bdf8', '#34d399'], d: 'Xoay ống dẫn nước tưới cây, màn chơi vô hạn.',
    k: 'noi-ong-nuoc-v1', st: s => \`Màn \${s.level || 1}\`, score: () => 0 },
  { f: 'goc-thu-gian.html', ic: '🌿', n: 'Góc Thư Giãn', tag: 'THƯ GIÃN', c: ['#6366f1', '#14b8a6'], d: 'Vườn đêm, bong bóng, hít thở. Nghỉ ngơi sau giờ học.',
    k: null, st: () => '', score: () => 0 }
];

function render() {
  const g = $('grid'); g.innerHTML = ''; let totalBest = 0, played = 0;
  GAMES.forEach(x => {
    const s = x.k ? rd(x.k) : null; if (s) { played++; totalBest += x.score(s); }
    let stat = ''; if (x.k) { try { stat = s ? x.st(s) : ''; } catch (e) { stat = ''; } }
    const a = document.createElement('a'); a.className = 'card'; a.href = x.f; a.style.background = \`linear-gradient(145deg,\${x.c[0]},\${x.c[1]})\`;
    a.innerHTML = \`\${x.isNew ? '<span class="new">MỚI</span>' : ''}<div class="ic">\${x.ic}</div><h3>\${x.n}</h3><span class="tag">\${x.tag}</span><p>\${x.d}</p>
      \${x.k ? \`<div class="st \${stat ? '' : 'none'}">\${stat || 'Chưa chơi · bắt đầu thôi!'}</div>\` : ''}\`;
    a.addEventListener('click', () => { try { localStorage.setItem(HUB, JSON.stringify({ last: x.f, name: x.n })); } catch (e) {} });
    g.appendChild(a);
  });
  $('sum').innerHTML = \`<div class="chip">🎮 <b>\${GAMES.length}</b> trò chơi</div><div class="chip">✅ Đã chơi <b>\${played}</b></div>\`;
  const h = rd(HUB); if (h && h.last) { $('cont').classList.add('on'); $('contA').href = h.last; $('contA').textContent = '▶ Chơi tiếp: ' + h.name; }
}
const msg = (t, bad) => { const m = $('msg'); m.textContent = t; m.style.color = bad ? '#ffb0a8' : '#9bffb8'; };
$('bExport').onclick = () => {
  const data = {}; GAMES.forEach(x => { if (x.k) { const r = raw(x.k); if (r) data[x.k] = r; } });
  ['vuon-thu-ho-cfg-v1', HUB].forEach(k => { const r = raw(k); if (r) data[k] = r; });
  if (!Object.keys(data).length) { msg('Chưa có tiến trình nào để sao lưu.', true); return; }
  const blob = new Blob([JSON.stringify({ app: 'trung-tam-game', v: 1, at: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tien-trinh-game.json'; document.body.appendChild(a); a.click(); a.remove(); msg('Đã tạo file sao lưu.');
};
$('bImport').onclick = () => $('file').click();
$('file').onchange = e => {
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => {
    try { const j = JSON.parse(r.result); if (!j || j.app !== 'trung-tam-game' || !j.data) throw new Error('bad'); let c = 0; Object.entries(j.data).forEach(([k, v]) => { if (typeof v === 'string') { localStorage.setItem(k, v); c++; } }); msg(\`Đã khôi phục \${c} mục tiến trình.\`); render(); }
    catch (er) { msg('File không hợp lệ hoặc trình duyệt chặn lưu trữ.', true); }
  }; r.readAsText(f); e.target.value = '';
};
$('bReset').onclick = () => {
  if (!confirm('Xóa toàn bộ tiến trình của tất cả game? Không thể hoàn tác.')) return;
  try { GAMES.forEach(x => x.k && localStorage.removeItem(x.k)); ['vuon-thu-ho-cfg-v1', HUB, 'xep-khoi-v1'].forEach(k => localStorage.removeItem(k)); msg('Đã xóa toàn bộ tiến trình.'); render(); } catch (e) { msg('Không xóa được.', true); }
};
render();
})();
<\/script>
</body>
</html>
`,j=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Vườn Thủ Hộ</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{--wood:#5b3b22;--woodD:#3a2414;--gold:#c9964f;--paper:#fff7dc;--ink:#3b2412;--sun:#ffe066;--grass:#6fbf55;--red:#e0483d}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  html,body{height:100%;overflow:hidden;background:#243b1e;color:#fff;font-family:"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif;touch-action:none}
  canvas{position:fixed;inset:0;display:block;z-index:1;touch-action:none}
  button{font-family:inherit;cursor:pointer}
  button:focus-visible{outline:3px solid #9be16d;outline-offset:2px}

  /* ===== Thanh trên ===== */
  #top{position:fixed;top:0;left:0;right:0;display:none;align-items:center;gap:6px;z-index:5;
    padding:5px calc(env(safe-area-inset-right) + 8px) 5px calc(env(safe-area-inset-left) + 8px);
    background:repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 40px),linear-gradient(#6b4527,#3a2414);
    border-bottom:3px solid var(--gold);box-shadow:0 4px 14px rgba(0,0,0,.45)}
  #top.on{display:flex}
  #sunBox{display:flex;align-items:center;gap:5px;min-width:74px;padding:3px 12px 3px 6px;border-radius:16px;background:#1f1108;
    border:2px solid var(--gold);font-size:23px;font-weight:800;color:var(--sun);box-shadow:inset 0 2px 6px rgba(0,0,0,.6);flex:none}
  #sunBox .ic{font-size:26px;filter:drop-shadow(0 0 6px #ffcf3a)}
  #sunBox.bump{animation:bump .3s}#sunBox.shake{animation:shake .3s}
  @keyframes bump{40%{transform:scale(1.15)}}
  @keyframes shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
  #packets{display:flex;gap:4px;flex:1 1 auto;min-width:0}
  .packet{position:relative;flex:0 1 50px;min-width:36px;height:52px;border-radius:9px;border:2px solid #8a5a2c;overflow:hidden;
    background:linear-gradient(#fffbea,#f0dca6);box-shadow:0 3px 0 #2a170a;display:flex;flex-direction:column;align-items:center;
    justify-content:center;touch-action:none;transition:transform .12s,filter .2s}
  .packet .pe{font-size:25px;line-height:1;margin-top:1px}
  .packet .pc{font-size:11.5px;font-weight:800;color:#5b3b22;line-height:1;margin-top:2px;background:rgba(255,224,102,.75);border-radius:6px;padding:0 5px}
  .packet .cd{position:absolute;left:0;right:0;top:0;height:0;background:rgba(20,10,0,.62);pointer-events:none}
  .packet.dim{filter:brightness(.62) saturate(.7)}
  .packet.sel{transform:translateY(-3px);border-color:#9be16d;box-shadow:0 3px 0 #2a170a,0 0 0 3px rgba(155,225,109,.7),0 0 16px rgba(155,225,109,.7)}
  .tool{flex:none;width:48px;height:52px;border-radius:9px;border:2px solid #8a5a2c;background:linear-gradient(#e7edf3,#a9b4c0);
    box-shadow:0 3px 0 #2a170a;font-size:22px;color:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
  .tool small{font-size:10px;font-weight:800;margin-top:2px}
  .tool.on{border-color:#9be16d;box-shadow:0 3px 0 #2a170a,0 0 0 3px rgba(155,225,109,.7)}
  #progWrap{flex:0 1 150px;min-width:80px;display:flex;flex-direction:column;gap:2px}
  #lvName{font-size:11.5px;font-weight:700;color:#f6dfae;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}
  #prog{position:relative;height:16px;border-radius:9px;background:#1f1108;border:2px solid var(--gold);box-shadow:inset 0 2px 5px rgba(0,0,0,.6)}
  #progFill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:7px;background:linear-gradient(#b6f26f,#4fa93a)}
  #progHead{position:absolute;top:50%;left:0;transform:translate(-50%,-52%);font-size:19px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}
  #flags i{position:absolute;top:-6px;font-style:normal;font-size:13px;transform:translateX(-50%)}
  .ib{flex:none;width:40px;height:40px;border-radius:50%;border:2px solid var(--gold);background:linear-gradient(#7a5230,#4a2f19);
    color:#ffe9b8;font-size:17px;font-weight:800;box-shadow:0 3px 0 #2a170a}
  .ib:active{transform:translateY(2px);box-shadow:0 1px 0 #2a170a}

  /* ===== Thông báo ===== */
  #banner{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%) scale(.6);opacity:0;pointer-events:none;z-index:6;width:max-content;max-width:92vw;
    text-align:center;font-size:clamp(26px,6vw,46px);font-weight:800;color:#ffe9b8;letter-spacing:.5px;
    text-shadow:0 3px 0 #7a1d12,0 0 22px rgba(255,80,40,.75),0 5px 12px rgba(0,0,0,.6)}
  #banner.show{animation:banner 2.6s ease-out}
  #banner.warn{color:#ffb4a8}
  @keyframes banner{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.12)}
    22%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-62%) scale(1)}}
  #hint{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:6;pointer-events:none;width:max-content;max-width:90vw;text-align:center;
    font-size:15px;font-weight:600;padding:6px 16px;border-radius:99px;background:rgba(30,18,8,.82);border:2px solid var(--gold);color:#ffe9b8;
    opacity:0;transition:opacity .4s}
  #hint.show{opacity:1}
  #toast{position:fixed;left:50%;top:76px;transform:translate(-50%,-6px);z-index:30;pointer-events:none;width:max-content;max-width:90vw;
    text-align:center;font-size:16px;font-weight:700;padding:7px 16px;border-radius:14px;background:#2b190c;color:#ffe9b8;border:2px solid var(--gold);
    opacity:0;transition:opacity .25s,transform .25s;white-space:pre-line}
  #toast.show{opacity:1;transform:translate(-50%,0)}

  /* ===== Màn hình phủ ===== */
  .screen{position:fixed;inset:0;z-index:20;display:none;align-items:center;justify-content:center;
    padding:calc(env(safe-area-inset-top) + 8px) calc(env(safe-area-inset-right) + 14px) 8px calc(env(safe-area-inset-left) + 14px)}
  .screen.show{display:flex;animation:fade .3s}
  @keyframes fade{from{opacity:0}}
  #menu{background:radial-gradient(ellipse at 20% 110%,#3f8f3a 0,transparent 55%),radial-gradient(ellipse at 90% 120%,#2f7a34 0,transparent 50%),
    linear-gradient(#ffb56b 0,#f88f5a 22%,#6cb857 62%,#2e6b2f 100%);gap:18px;align-items:stretch}
  .menuL{flex:0 0 42%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;text-align:center}
  .logo{font-size:clamp(40px,9.5vw,72px);font-weight:800;line-height:.9;color:#fff8d8;
    text-shadow:0 3px 0 #e87d2a,0 6px 0 #b8541a,0 9px 0 #7c3410,0 14px 18px rgba(0,0,0,.45)}
  .logoIc{font-size:clamp(34px,7vw,52px);letter-spacing:6px;filter:drop-shadow(0 4px 4px rgba(0,0,0,.35))}
  .tag{font-size:15px;font-weight:600;color:#fff4d0;text-shadow:0 2px 0 rgba(0,0,0,.35)}
  .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  .btn{border:0;font-weight:800;font-size:17px;color:#fff;padding:9px 20px;border-radius:99px;background:linear-gradient(#8fdc63,#4aa33a);
    box-shadow:0 5px 0 #2d6b23,0 9px 14px rgba(0,0,0,.3);text-shadow:0 2px 0 rgba(0,0,0,.25);transition:transform .1s}
  .btn:active{transform:translateY(4px);box-shadow:0 1px 0 #2d6b23}
  .btn.gold{background:linear-gradient(#ffe37a,#f5b52c);color:#5b3300;text-shadow:none;box-shadow:0 5px 0 #b8781a,0 9px 14px rgba(0,0,0,.3)}
  .btn.gold:active{box-shadow:0 1px 0 #b8781a}
  .btn.dark{background:linear-gradient(#7a5230,#4a2f19);box-shadow:0 5px 0 #2a170a,0 9px 14px rgba(0,0,0,.3)}
  .btn.dark:active{box-shadow:0 1px 0 #2a170a}
  .btn.sm{font-size:14px;padding:7px 14px}
  .menuR{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center}
  .menuR h3{font-size:19px;font-weight:800;margin-bottom:6px;text-shadow:0 2px 0 rgba(0,0,0,.35)}
  #cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:9px;overflow-y:auto;max-height:calc(100vh - 90px);padding:4px 4px 10px 2px;touch-action:pan-y}
  .card{display:flex;align-items:center;gap:10px;text-align:left;padding:9px 12px;border-radius:16px;border:3px solid #8a5a2c;color:var(--ink);
    background:linear-gradient(#fffbea,#f2dfae);box-shadow:0 4px 0 #3a2414,0 8px 12px rgba(0,0,0,.25);transition:transform .12s}
  .card:active{transform:translateY(3px);box-shadow:0 1px 0 #3a2414}
  .card .num{flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:22px;color:#fff;
    background:radial-gradient(circle at 35% 30%,#8fdc63,#3f9a2e);border:3px solid #2d6b23;text-shadow:0 2px 0 rgba(0,0,0,.3)}
  .card.night .num{background:radial-gradient(circle at 35% 30%,#7a86d6,#2a3480);border-color:#1a2260}
  .card.dusk .num{background:radial-gradient(circle at 35% 30%,#ffb066,#d0602a);border-color:#8a3a12}
  .card .ci{min-width:0;flex:1;line-height:1.1}
  .card .ci b{font-size:16px;font-weight:800;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .card .ci span{font-size:15px;letter-spacing:1px}
  .card .ci small{display:block;font-size:12px;font-weight:600;opacity:.7;margin-top:2px}
  .card .st{flex:none;font-size:20px}
  .panel{background:linear-gradient(#fff7dc,#f0dcaa);color:var(--ink);border:4px solid #8a5a2c;border-radius:24px;padding:16px 26px;text-align:center;
    box-shadow:0 12px 40px rgba(0,0,0,.5);min-width:min(80vw,320px)}
  .panel h2{font-size:32px;font-weight:800;line-height:1}
  .panel p{font-size:16px;font-weight:600;margin:6px 0 12px;opacity:.85}
  #pause,#win,#lose{background:rgba(20,10,0,.6);flex-direction:column;gap:12px;backdrop-filter:blur(3px)}
  #rotate{z-index:40;background:#1d3a1a;flex-direction:column;gap:14px;text-align:center}
  #rotate .em{font-size:80px;animation:rot 2s ease-in-out infinite}
  @keyframes rot{0%,20%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}
  #rotate p{font-size:22px;font-weight:700}

  /* ===== Trình sửa JSON ===== */
  #editor{background:rgba(18,10,4,.94);flex-direction:column;align-items:stretch;gap:8px;z-index:25}
  .edHead{display:flex;align-items:center;justify-content:space-between;gap:10px}
  .edHead h2{font-size:20px;font-weight:800}
  .edBody{flex:1;min-height:0;display:flex;gap:10px}
  #cfgText{flex:1;min-width:0;resize:none;border-radius:12px;border:2px solid var(--gold);background:#120a04;color:#c9f3b0;padding:10px;
    font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre;overflow:auto;user-select:text;-webkit-user-select:text;touch-action:pan-x pan-y;tab-size:2}
  .edDoc{flex:0 0 34%;overflow-y:auto;font-size:13px;line-height:1.35;background:rgba(255,255,255,.07);border-radius:12px;padding:10px;touch-action:pan-y;
    user-select:text;-webkit-user-select:text}
  .edDoc b{color:#ffe066}.edDoc code{background:rgba(0,0,0,.4);padding:0 4px;border-radius:4px;color:#c9f3b0}
  .edDoc h4{font-size:14px;margin:8px 0 3px;color:#9be16d}
  #cfgErr{color:#ff9d8f;font-size:13px;font-weight:600;white-space:pre-line;max-height:64px;overflow:auto;min-height:0}
  @media (max-width:640px){.edDoc{display:none}.menuL{flex-basis:36%}}
  @media (prefers-reduced-motion:reduce){#banner.show{animation:none;opacity:1;transform:translate(-50%,-50%)}#rotate .em{animation:none}}

  /* ===== Nâng cấp giao diện ===== */
  #top{background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 38px),linear-gradient(#7a4c2a,#3a2414);border-bottom:4px solid #e0b25f;box-shadow:0 6px 18px rgba(0,0,0,.55),inset 0 2px 0 rgba(255,255,255,.18)}
  .packet{border-radius:12px;border:2px solid #b07a3c;background:linear-gradient(#fffdf0,#f1dba0 70%,#e2c27a);box-shadow:0 4px 0 #2a170a,inset 0 2px 0 #fff}
  .packet:hover{transform:translateY(-2px)}
  .packet .pc{background:linear-gradient(#ffe98a,#f2b634);color:#4a2a00;box-shadow:0 1px 0 rgba(0,0,0,.25)}
  #sunBox{background:radial-gradient(circle at 30% 20%,#3a2410,#170b04);box-shadow:inset 0 2px 8px #000,0 0 14px rgba(255,200,60,.35)}
  #progFill{background:linear-gradient(#d4ff8a,#58b43f 60%,#3c8c2c);box-shadow:0 0 10px rgba(150,240,90,.6)}
  .btn{letter-spacing:.3px;border:2px solid rgba(255,255,255,.28);position:relative;overflow:hidden}
  .btn::after{content:"";position:absolute;left:8%;right:8%;top:3px;height:38%;border-radius:99px;background:linear-gradient(rgba(255,255,255,.4),rgba(255,255,255,0))}
  .card{border:3px solid #a06b30;border-radius:18px;background:linear-gradient(#fffdf0,#f0d9a2);transition:transform .15s,box-shadow .15s}
  .card:hover{transform:translateY(-3px) rotate(-.4deg);box-shadow:0 7px 0 #3a2414,0 14px 18px rgba(0,0,0,.3)}
  .card.grave .num{background:radial-gradient(circle at 35% 30%,#8fd0a0,#2d6a4a);border-color:#173a2a}
  .card.castle .num{background:radial-gradient(circle at 35% 30%,#d070a0,#5a1f5a);border-color:#2e0f34}
  .card .ci span img{width:22px;height:22px;margin-right:2px;vertical-align:middle;filter:drop-shadow(0 1px 1px rgba(0,0,0,.4))}
  .logo{animation:logoFloat 3.2s ease-in-out infinite}
  @keyframes logoFloat{50%{transform:translateY(-6px) rotate(-1deg)}}
  .panel{border:5px solid #b07a3c;border-radius:28px;background:linear-gradient(#fffbe6,#efd49a);box-shadow:0 0 0 4px #3a2414,0 18px 50px rgba(0,0,0,.6);animation:pop .35s cubic-bezier(.2,1.4,.4,1)}
  @keyframes pop{from{transform:scale(.7);opacity:0}}
  #banner{font-size:clamp(30px,7vw,54px);letter-spacing:1px}
  #banner.warn{color:#ffd0c8;text-shadow:0 3px 0 #5a0f0f,0 0 28px rgba(255,40,40,.9),0 6px 14px rgba(0,0,0,.7)}
  #toast,#hint{border-radius:16px;box-shadow:0 6px 16px rgba(0,0,0,.4)}
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="safe" style="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)"></div>

<div id="top">
  <div id="sunBox"><span class="ic">☀️</span><b id="sunNum">0</b></div>
  <div id="packets"></div>
  <button class="tool" id="shovel" aria-label="Xẻng nhổ cây">⛏️<small>Xẻng</small></button>
  <div id="progWrap"><div id="lvName"></div><div id="prog"><div id="progFill"></div><div id="flags"></div><span id="progHead">🐛</span></div></div>
  <button class="ib" id="speedBtn" aria-label="Tốc độ">1×</button>
  <button class="ib" id="pauseBtn" aria-label="Tạm dừng">⏸</button>
</div>
<div id="banner"></div>
<div id="hint"></div>
<div id="toast"></div>

<div class="screen show" id="menu">
  <div class="menuL">
    <div class="logoIc">🌻🥦🍒</div>
    <div class="logo">VƯỜN<br>THỦ HỘ</div>
    <div class="tag">Trồng cây, thu nắng, đuổi sâu bọ khỏi vườn!</div>
    <div class="row" style="margin-top:6px">
      <button class="btn sm" id="resumeSavedBtn" hidden>▶ Tiếp tục ván đang chơi</button>
      <button class="btn dark sm" id="exitAppBtn">← Về danh sách game</button>
      <button class="btn gold sm" id="btnCfg">⚙️ Cấu hình JSON</button>
      <button class="btn dark sm" id="btnMusic">🎵 Nhạc: Bật</button>
      <button class="btn dark sm" id="btnSfx">🔊 Âm: Bật</button>
    </div>
  </div>
  <div class="menuR"><h3>Chọn màn chơi</h3><div id="cards"></div></div>
</div>

<div class="screen" id="pause">
  <div class="panel"><h2>Tạm dừng</h2><p>Vườn vẫn đợi bạn đó!</p>
    <div class="row"><button class="btn" id="resumeBtn">▶ Tiếp tục</button><button class="btn gold" id="restartBtn">↺ Chơi lại</button></div>
    <div class="row" style="margin-top:10px"><button class="btn dark sm" id="pMusic">🎵 Nhạc</button><button class="btn dark sm" id="pSfx">🔊 Âm</button>
      <button class="btn dark sm" id="menuBtn">☰ Về menu</button></div></div>
</div>
<div class="screen" id="win">
  <div class="panel"><h2>🏆 Chiến thắng!</h2><p id="winTxt"></p>
    <div class="row"><button class="btn gold" id="nextBtn">Màn tiếp ▶</button><button class="btn dark" id="winMenu">☰ Menu</button></div></div>
</div>
<div class="screen" id="lose">
  <div class="panel"><h2>😱 Quái vào nhà rồi!</h2><p>Đừng nản, thử chọn cây khác nhé.</p>
    <div class="row"><button class="btn gold" id="retryBtn">↺ Thử lại</button><button class="btn dark" id="loseMenu">☰ Menu</button></div></div>
</div>

<div class="screen" id="editor">
  <div class="edHead"><h2>⚙️ Cấu hình quái &amp; màn chơi (JSON)</h2><button class="btn dark sm" id="cfgClose">✕ Đóng</button></div>
  <div class="edBody"><textarea id="cfgText" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
    <div class="edDoc" id="cfgDoc"></div></div>
  <div id="cfgErr"></div>
  <div class="row" style="justify-content:flex-start">
    <button class="btn sm" id="cfgApply">✅ Áp dụng</button>
    <button class="btn gold sm" id="cfgReset">↺ Mặc định</button>
    <button class="btn dark sm" id="cfgCopy">📋 Sao chép</button>
    <button class="btn dark sm" id="cfgDown">⬇️ Tải xuống</button>
    <button class="btn dark sm" id="cfgLoad">📂 Nạp file</button>
    <input type="file" id="cfgFile" accept=".json,application/json" hidden>
  </div>
</div>

<div class="screen" id="rotate"><div class="em">📱</div><p>Xoay ngang điện thoại để chơi nhé!</p></div>

<!-- ============ CẤU HÌNH MẶC ĐỊNH (id + số liệu, KHÔNG có emoji — icon nằm ở MON_ICON/PLANT_ICON) ============ -->
<script type="application/json" id="cfgDefault">
{
  "unlockAll": true,

  "monsters": {
    "worm":   {"name": "Sâu Bò",       "hp": 100,  "speed": 0.20, "dps": 20, "size": 1.0},
    "beetle": {"name": "Bọ Giáp",      "hp": 260,  "speed": 0.17, "dps": 22, "size": 1.05},
    "locust": {"name": "Châu Chấu",    "hp": 90,   "speed": 0.42, "dps": 16, "size": 0.95},
    "rat":    {"name": "Chuột Nhảy",   "hp": 150,  "speed": 0.30, "dps": 20, "size": 1.0, "jump": true},
    "snail":  {"name": "Ốc Sên Khiên", "hp": 520,  "speed": 0.09, "dps": 25, "size": 1.1},
    "boss":   {"name": "Bọ Cạp Chúa",  "hp": 3200, "speed": 0.06, "dps": 80, "size": 1.7},
    "zombie":     {"name": "Zombie",             "hp": 220,  "speed": 0.16, "dps": 22, "size": 1.1},
    "zombieCone": {"name": "Zombie Nón Cối",     "hp": 520,  "speed": 0.15, "dps": 24, "size": 1.15},
    "bat":        {"name": "Dơi Quỷ",            "hp": 70,   "speed": 0.55, "dps": 14, "size": 0.9},
    "vampire":    {"name": "Ma Cà Rồng",         "hp": 480,  "speed": 0.20, "dps": 30, "size": 1.1, "jump": true},
    "vampLord":   {"name": "Bá Tước Ma Cà Rồng", "hp": 4500, "speed": 0.06, "dps": 90, "size": 1.75}
  },

  "plants": {
    "sunflower": {"name": "Hướng Dương",    "kind": "producer", "cost": 50,  "hp": 80,  "cooldown": 5,  "amount": 25, "every": 9, "first": 5},
    "shooter":   {"name": "Súp Lơ Bắn Hạt", "kind": "shooter",  "cost": 100, "hp": 80,  "cooldown": 5,  "damage": 20, "every": 1.5, "shots": 1},
    "wall":      {"name": "Dừa Tường",      "kind": "wall",     "cost": 50,  "hp": 600, "cooldown": 14},
    "bomb":      {"name": "Anh Đào Nổ",     "kind": "bomb",     "cost": 150, "hp": 50,  "cooldown": 25, "damage": 400, "radius": 1.5, "fuse": 1},
    "ice":       {"name": "Việt Quất Băng", "kind": "shooter",  "cost": 175, "hp": 80,  "cooldown": 6,  "damage": 20, "every": 1.5, "shots": 1, "slow": 0.5, "slowTime": 4},
    "mine":      {"name": "Khoai Bẫy",      "kind": "mine",     "cost": 25,  "hp": 50,  "cooldown": 18, "damage": 500, "arm": 8},
    "repeater":  {"name": "Xương Rồng Đôi", "kind": "shooter",  "cost": 200, "hp": 80,  "cooldown": 7,  "damage": 20, "every": 1.5, "shots": 2},
    "chili":     {"name": "Ớt Lửa",         "kind": "lane",     "cost": 125, "hp": 50, "cooldown": 25, "damage": 400, "fuse": 0.8},
    "garlic":    {"name": "Tỏi Xua Quỷ",    "kind": "wall",     "cost": 75,  "hp": 1000, "cooldown": 16}
  },

  "levels": [
    {
      "name": "Vườn Trước Nhà", "theme": "day", "rows": 5, "startSun": 150,
      "plants": ["sunflower", "shooter"],
      "skySun": {"first": 6, "every": 9, "amount": 25},
      "timeline": [
        {"t": 20, "monster": "worm", "row": "random"},
        {"t": 40, "monster": "worm", "row": "random"},
        {"t": 58, "monster": "worm", "row": "random", "count": 2, "gap": 5},
        {"t": 85, "banner": "Một đợt quái lớn đang kéo tới!", "flag": true, "spawn": [
          {"monster": "worm", "row": "all"},
          {"monster": "worm", "row": "random", "count": 3, "gap": 3, "delay": 4}
        ]}
      ]
    },
    {
      "name": "Vườn Sau Nhà", "theme": "day", "rows": 5, "startSun": 150,
      "plants": ["sunflower", "shooter", "wall", "bomb"],
      "skySun": {"first": 6, "every": 9, "amount": 25},
      "timeline": [
        {"t": 15, "monster": "worm", "row": "random"},
        {"t": 28, "monster": "worm", "row": "random", "count": 2, "gap": 4},
        {"t": 45, "monster": "beetle", "row": "random"},
        {"t": 62, "monster": "worm", "row": "random", "count": 3, "gap": 3},
        {"t": 80, "monster": "beetle", "row": "random", "count": 2, "gap": 6},
        {"t": 100, "banner": "Một đợt quái lớn đang kéo tới!", "flag": true, "spawn": [
          {"monster": "beetle", "row": "all"},
          {"monster": "worm", "row": "random", "count": 4, "gap": 2.5, "delay": 3}
        ]}
      ]
    },
    {
      "name": "Hoàng Hôn Bên Hàng Rào", "theme": "dusk", "rows": 5, "startSun": 200,
      "plants": ["sunflower", "shooter", "wall", "bomb", "ice", "mine"],
      "skySun": {"first": 8, "every": 11, "amount": 25},
      "timeline": [
        {"t": 12, "monster": "worm", "row": "random"},
        {"t": 22, "monster": "locust", "row": "random"},
        {"t": 34, "monster": "rat", "row": "random"},
        {"t": 46, "monster": "worm", "row": "random", "count": 2, "gap": 3},
        {"t": 60, "monster": "locust", "row": "random", "count": 3, "gap": 2},
        {"t": 76, "monster": "beetle", "row": "random", "count": 2, "gap": 5},
        {"t": 92, "banner": "Một đợt quái lớn đang kéo tới!", "flag": true, "spawn": [
          {"monster": "rat", "row": "all"},
          {"monster": "locust", "row": "random", "count": 4, "gap": 1.5, "delay": 3},
          {"monster": "beetle", "row": "random", "count": 2, "gap": 6, "delay": 5}
        ]}
      ]
    },
    {
      "name": "Đêm Sương Mù", "theme": "night", "rows": 5, "startSun": 250,
      "plants": ["sunflower", "shooter", "wall", "bomb", "ice", "mine", "repeater", "chili"],
      "skySun": {"first": 0, "every": 0, "amount": 25},
      "timeline": [
        {"t": 20, "monster": "worm", "row": "random", "count": 2, "gap": 3},
        {"t": 35, "monster": "snail", "row": "random"},
        {"t": 55, "monster": "rat", "row": "random", "count": 2, "gap": 4},
        {"t": 75, "monster": "beetle", "row": "random", "count": 2, "gap": 3},
        {"t": 95, "banner": "Quái đang kéo đến từ trong sương!", "flag": true, "spawn": [
          {"monster": "snail", "row": "random", "count": 2, "gap": 8},
          {"monster": "locust", "row": "all", "delay": 2}
        ]},
        {"t": 125, "banner": "Đợt cuối! Giữ vững hàng phòng thủ!", "flag": true, "spawn": [
          {"monster": "worm", "row": "all", "count": 2, "gap": 6},
          {"monster": "beetle", "row": "random", "count": 4, "gap": 3, "delay": 3},
          {"monster": "snail", "row": "random", "count": 2, "gap": 10, "delay": 5}
        ]}
      ]
    },
    {
      "name": "Bọ Cạp Chúa", "theme": "dusk", "rows": 5, "startSun": 300,
      "plants": ["sunflower", "shooter", "wall", "bomb", "ice", "mine", "repeater", "chili"],
      "skySun": {"first": 8, "every": 10, "amount": 25},
      "timeline": [
        {"t": 15, "monster": "worm", "row": "random", "count": 3, "gap": 3},
        {"t": 35, "monster": "beetle", "row": "random", "count": 2, "gap": 4},
        {"t": 55, "monster": "rat", "row": "random", "count": 3, "gap": 3},
        {"t": 80, "banner": "Một đợt quái lớn đang kéo tới!", "flag": true, "spawn": [
          {"monster": "locust", "row": "all", "count": 2, "gap": 4},
          {"monster": "snail", "row": "random", "count": 2, "gap": 6, "delay": 4}
        ]},
        {"t": 115, "banner": "BỌ CẠP CHÚA XUẤT HIỆN!", "flag": true, "spawn": [
          {"monster": "boss", "row": 3},
          {"monster": "beetle", "row": "all", "delay": 6},
          {"monster": "worm", "row": "random", "count": 6, "gap": 2, "delay": 10}
        ]}
      ]
    },
    {
      "name": "Nghĩa Địa Zombie", "theme": "grave", "rows": 5, "startSun": 250,
      "plants": ["sunflower", "shooter", "wall", "garlic", "bomb", "ice", "mine", "repeater", "chili"],
      "skySun": {"first": 10, "every": 12, "amount": 25},
      "timeline": [
        {"t": 15, "monster": "zombie", "row": "random"},
        {"t": 32, "monster": "zombie", "row": "random", "count": 2, "gap": 4},
        {"t": 52, "monster": "zombieCone", "row": "random"},
        {"t": 70, "monster": "zombie", "row": "random", "count": 3, "gap": 3},
        {"t": 90, "banner": "Zombie trỗi dậy từ mộ!", "flag": true, "spawn": [
          {"monster": "zombie", "row": "all"},
          {"monster": "zombieCone", "row": "random", "count": 2, "gap": 5, "delay": 4}
        ]},
        {"t": 120, "banner": "Đợt cuối: bầy zombie kéo đến!", "flag": true, "spawn": [
          {"monster": "zombie", "row": "all", "count": 2, "gap": 6},
          {"monster": "zombieCone", "row": "random", "count": 3, "gap": 4, "delay": 3},
          {"monster": "bat", "row": "random", "count": 4, "gap": 2, "delay": 8}
        ]}
      ]
    },
    {
      "name": "Lâu Đài Ma Cà Rồng", "theme": "castle", "rows": 5, "startSun": 300,
      "plants": ["sunflower", "shooter", "wall", "garlic", "bomb", "ice", "mine", "repeater", "chili"],
      "skySun": {"first": 12, "every": 14, "amount": 25},
      "timeline": [
        {"t": 15, "monster": "bat", "row": "random", "count": 3, "gap": 2},
        {"t": 35, "monster": "vampire", "row": "random"},
        {"t": 55, "monster": "zombieCone", "row": "random", "count": 2, "gap": 4},
        {"t": 75, "monster": "vampire", "row": "random", "count": 2, "gap": 5},
        {"t": 100, "banner": "Bầy dơi đang tràn vào lâu đài!", "flag": true, "spawn": [
          {"monster": "bat", "row": "all", "count": 2, "gap": 3},
          {"monster": "vampire", "row": "random", "count": 2, "gap": 6, "delay": 4}
        ]},
        {"t": 135, "banner": "Đợt cuối! Giữ vững hàng phòng thủ!", "flag": true, "spawn": [
          {"monster": "vampire", "row": "all", "count": 2, "gap": 7},
          {"monster": "zombieCone", "row": "random", "count": 3, "gap": 4, "delay": 3},
          {"monster": "bat", "row": "random", "count": 6, "gap": 1.5, "delay": 6}
        ]}
      ]
    },
    {
      "name": "Bá Tước Ma Cà Rồng", "theme": "castle", "rows": 5, "startSun": 350,
      "plants": ["sunflower", "shooter", "wall", "garlic", "bomb", "ice", "mine", "repeater", "chili"],
      "skySun": {"first": 10, "every": 12, "amount": 25},
      "timeline": [
        {"t": 15, "monster": "zombie", "row": "random", "count": 3, "gap": 3},
        {"t": 35, "monster": "vampire", "row": "random", "count": 2, "gap": 5},
        {"t": 60, "monster": "bat", "row": "random", "count": 5, "gap": 2},
        {"t": 85, "banner": "Một đợt quái lớn đang kéo tới!", "flag": true, "spawn": [
          {"monster": "zombieCone", "row": "all"},
          {"monster": "vampire", "row": "random", "count": 3, "gap": 5, "delay": 4}
        ]},
        {"t": 120, "banner": "BÁ TƯỚC MA CÀ RỒNG XUẤT HIỆN!", "flag": true, "spawn": [
          {"monster": "vampLord", "row": 3},
          {"monster": "bat", "row": "all", "delay": 6},
          {"monster": "zombie", "row": "random", "count": 6, "gap": 2, "delay": 10}
        ]}
      ]
    }
  ]
}
<\/script>

<script>
(() => {
'use strict';
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const EMO = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const COLS = 9;

/* ================= Lưu trữ ================= */
const CK = 'vuon-thu-ho-cfg-v1', PK = 'vuon-thu-ho-prog-v1', RK = 'vuon-thu-ho-run-v1'; const memS = {};
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return memS[k] || null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { memS[k] = v; console.error('Không thể lưu dữ liệu game vào localStorage.', e); } };

/* ================= Cấu hình JSON ================= */
const DEF = JSON.parse($('cfgDefault').textContent);

/* Icon nằm ở đây, KHÔNG nằm trong JSON config — config chỉ gửi id + số liệu.
   Thêm quái/cây mới: thêm id vào config, icon tự lấy theo id (thêm id mới thì thêm ở bảng dưới). */
const MON_ICON = { worm: '🐛', beetle: '🪲', locust: '🦗', rat: '🐀', snail: '🐌', boss: '🦂', zombie: '🧟', zombieCone: '🧟', bat: '🦇', vampire: '🧛', vampLord: '🧛' };
const PLANT_ICON = { sunflower: '🌻', shooter: '🥦', wall: '🥥', bomb: '🍒', ice: '🫐', mine: '🥔', repeater: '🌵', chili: '🌶️', garlic: '🧄' };
const M_BASE = { icon: '👾', name: 'Quái', hp: 100, speed: .2, dps: 20, size: 1 };
const P_BASE = { icon: '🌱', name: 'Cây', kind: 'wall', cost: 50, hp: 80, cooldown: 5 };
const KIND_DEF = {
  producer: { amount: 25, every: 9, first: 5 }, shooter: { damage: 20, every: 1.5, shots: 1 },
  bomb: { damage: 400, radius: 1.5, fuse: 1 }, lane: { damage: 400, fuse: .8 }, mine: { damage: 500, arm: 8 }, wall: {}
};
function resolve(u) {
  const cfg = { unlockAll: u.unlockAll !== false, monsters: {}, plants: {}, levels: Array.isArray(u.levels) ? u.levels : [] };
  new Set([...Object.keys(DEF.monsters), ...Object.keys(u.monsters || {})]).forEach(id => {
    cfg.monsters[id] = Object.assign({}, M_BASE, DEF.monsters[id] || {}, (u.monsters || {})[id] || {});
    cfg.monsters[id].icon = cfg.monsters[id].emoji || MON_ICON[id] || M_BASE.icon;
  });
  new Set([...Object.keys(DEF.plants), ...Object.keys(u.plants || {})]).forEach(id => {
    const p = Object.assign({}, P_BASE, DEF.plants[id] || {}, (u.plants || {})[id] || {});
    const kd = KIND_DEF[p.kind] || {}; Object.keys(kd).forEach(k => { if (p[k] === undefined) p[k] = kd[k]; });
    p.icon = p.emoji || PLANT_ICON[id] || P_BASE.icon;
    cfg.plants[id] = p;
  });
  return cfg;
}
function validate(u) {
  const er = [];
  if (!u || typeof u !== 'object' || Array.isArray(u)) return ['JSON gốc phải là một object { ... }'];
  if (!Array.isArray(u.levels) || !u.levels.length) er.push('"levels" phải là mảng có ít nhất 1 màn chơi');
  const c = resolve(u);
  Object.entries(c.monsters).forEach(([id, m]) => {
    if (!(m.hp > 0)) er.push(\`Quái "\${id}": "hp" phải là số > 0\`);
    if (!(m.speed > 0)) er.push(\`Quái "\${id}": "speed" phải là số > 0 (đơn vị: ô/giây)\`);
  });
  Object.entries(c.plants).forEach(([id, p]) => {
    if (!KIND_DEF[p.kind]) er.push(\`Cây "\${id}": "kind" không hợp lệ (producer, shooter, wall, bomb, lane, mine)\`);
    if (!(p.cost >= 0)) er.push(\`Cây "\${id}": "cost" phải là số >= 0\`);
  });
  (u.levels || []).forEach((L, i) => {
    const n = 'Màn ' + (i + 1), rows = L.rows === undefined ? 5 : L.rows;
    if (!Number.isInteger(rows) || rows < 3 || rows > 6) er.push(\`\${n}: "rows" phải là số nguyên từ 3 đến 6\`);
    if (!Array.isArray(L.plants) || !L.plants.length) er.push(\`\${n}: thiếu danh sách "plants"\`);
    else L.plants.forEach(p => { if (!c.plants[p]) er.push(\`\${n}: cây "\${p}" không tồn tại\`); });
    if (!Array.isArray(L.timeline) || !L.timeline.length) { er.push(\`\${n}: thiếu "timeline"\`); return; }
    L.timeline.forEach((e, j) => {
      const nn = \`\${n}, sự kiện #\${j + 1}\`;
      if (typeof e.t !== 'number' || e.t < 0) er.push(\`\${nn}: "t" phải là số giây >= 0\`);
      const specs = Array.isArray(e.spawn) ? e.spawn : (e.monster ? [e] : null);
      if (!specs && !e.banner) er.push(\`\${nn}: cần "monster" hoặc "spawn"\`);
      (specs || []).forEach(s => {
        if (!c.monsters[s.monster]) er.push(\`\${nn}: quái "\${s.monster}" không tồn tại\`);
        const r = s.row;
        if (r !== undefined && !(r === 'random' || r === 'all' || (Number.isInteger(r) && r >= 1 && r <= rows))) er.push(\`\${nn}: "row" phải là 1..\${rows}, "random" hoặc "all"\`);
      });
    });
  });
  return er;
}
/* Cấu hình chỉnh trong game được lưu cục bộ; nếu chưa có thì dùng mặc định. */
let userCfg = DEF, CFG;
(function loadCfg() {
  const s = lsGet(CK);
  if (s) { try { const u = JSON.parse(s); if (!validate(u).length) { userCfg = u; return; } } catch (e) {} }
  userCfg = DEF;
})();
CFG = resolve(userCfg);

function one(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(one).join(', ') + ']';
  return '{' + Object.keys(v).map(k => JSON.stringify(k) + ': ' + one(v[k])).join(', ') + '}';
}
function pretty(v, ind = '') {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  const s = one(v); if (s.length + ind.length <= 118) return s;
  const n = ind + '  ';
  if (Array.isArray(v)) return '[\\n' + v.map(x => n + pretty(x, n)).join(',\\n') + '\\n' + ind + ']';
  return '{\\n' + Object.keys(v).map(k => n + JSON.stringify(k) + ': ' + pretty(v[k], n)).join(',\\n') + '\\n' + ind + '}';
}
function docHtml() {
  const c = CFG;
  return \`<h4>Thứ tự quái ra</h4>Mỗi màn có <code>timeline</code>: danh sách sự kiện, mỗi sự kiện chạy tại giây <code>t</code>. Sự kiện nhỏ nhất ra trước.
  <h4>Một sự kiện</h4><code>{"t": 30, "monster": "worm", "row": 2, "count": 3, "gap": 2}</code><br>
  <b>t</b>: giây kể từ khi bắt đầu<br><b>monster</b>: id quái<br><b>row</b>: 1..5 (từ trên xuống), <code>"random"</code> hoặc <code>"all"</code><br>
  <b>count</b>: số lượng (mặc định 1)<br><b>gap</b>: giây giữa các con (mặc định 1.5)<br><b>delay</b>: chờ thêm bao nhiêu giây
  <h4>Nhiều loại quái cùng đợt</h4><code>{"t": 90, "banner": "Đợt lớn!", "flag": true, "spawn": [ {...}, {...} ]}</code><br>
  <b>banner</b>: chữ hiện giữa màn hình<br><b>flag</b>: đánh dấu cờ trên thanh tiến độ
  <h4>Quái có sẵn</h4>\${Object.entries(c.monsters).map(([id, m]) => \`\${m.icon} <code>\${id}</code> \${m.name}\`).join('<br>')}
  <h4>Cây có sẵn</h4>\${Object.entries(c.plants).map(([id, p]) => \`\${p.icon} <code>\${id}</code> \${p.name}\`).join('<br>')}
  <h4>Tạo quái / cây mới</h4>Thêm id mới vào <code>monsters</code> hoặc <code>plants</code> (đủ name, hp, speed…) rồi dùng trong timeline. Tốc độ <b>speed</b> tính bằng ô/giây.
  <b>Icon không nằm trong JSON</b> — game lấy icon theo id từ bảng <code>MON_ICON</code> / <code>PLANT_ICON</code> trong file plantvsanimal.html.
  <h4>Nguồn cấu hình</h4>Cấu hình mặc định được đồng bộ từ <code>src/games/plantandanimal.json</code> và nhúng trong game để vẫn chơi được offline. Bản áp dụng trên thiết bị được lưu trong localStorage; dùng <b>Mặc định</b> rồi <b>Áp dụng</b> để nạp cấu hình mới.
  <h4>Sao chép ra ngoài</h4>Dùng nút Sao chép hoặc Tải xuống để lưu file plantvsanimal.json.\`;
}

/* ================= Âm thanh ================= */
let ac = null, sfxOn = true, musicOn = true;
function ensureAudio() {
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} if (ac) { mNext = ac.currentTime + .1; musicTick(); } }
  if (ac && ac.state === 'suspended') ac.resume();
}
function toneAt(f, when, d = .2, v = .1, type = 'sine', slide = 0) {
  const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, when);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), when + d);
  g.gain.setValueAtTime(.0001, when); g.gain.exponentialRampToValueAtTime(v, when + .012); g.gain.exponentialRampToValueAtTime(.0001, when + d);
  o.connect(g); g.connect(ac.destination); o.start(when); o.stop(when + d + .05);
}
const tone = (f, d, v, type, delay = 0, slide = 0) => { if (ac && sfxOn) toneAt(f, ac.currentTime + delay, d, v, type, slide); };
function noise(d = .2, v = .12, cut = 2000, delay = 0) {
  if (!ac || !sfxOn) return;
  const len = Math.floor(ac.sampleRate * d), buf = ac.createBuffer(1, len, ac.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ac.createBufferSource(); s.buffer = buf; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cut;
  const g = ac.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(ac.destination); s.start(ac.currentTime + delay);
}
const lastT = {};
const gate = (k, ms) => { const n = performance.now(); if (n - (lastT[k] || 0) < ms) return false; lastT[k] = n; return true; };
const sfx = {
  shoot: () => gate('shoot', 60) && tone(560, .09, .07, 'triangle', 0, -250),
  hit: () => gate('hit', 50) && noise(.05, .07, 1600),
  splat: () => { noise(.16, .12, 900); tone(180, .15, .08, 'sine', 0, -90); },
  plant: () => { tone(170, .16, .14, 'triangle', 0, -60); tone(260, .2, .08, 'sine', .05); },
  sun: () => { tone(988, .1, .08, 'triangle'); tone(1319, .25, .09, 'triangle', .07); },
  boom: () => { noise(.6, .3, 1400); tone(120, .5, .2, 'sawtooth', 0, -80); },
  err: () => { tone(200, .15, .1, 'sawtooth'); tone(160, .2, .08, 'sawtooth', .1); },
  crunch: () => gate('crunch', 260) && noise(.07, .1, 2600),
  mower: () => noise(.9, .12, 700),
  jump: () => tone(400, .25, .08, 'triangle', 0, 400),
  alarm: () => { tone(330, .3, .12, 'square'); tone(262, .35, .12, 'square', .3); tone(330, .3, .12, 'square', .65); },
  win: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, .5, .12, 'triangle', i * .12)),
  lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, .55, .12, 'sawtooth', i * .3)),
  tap: () => tone(620, .07, .06, 'triangle'),
  pop: () => tone(760, .08, .07, 'sine', 0, 200)
};
let mStep = 0, mNext = 0;
const STEP = .25, BASS = [130.8, 110, 87.3, 98], PENT = [523.25, 587.33, 659.25, 784, 880, 1046.5];
function musicTick() {
  if (!ac) return;
  if (musicOn && !document.hidden) {
    while (mNext < ac.currentTime + .25) {
      const s = mStep % 32, bar = Math.floor(s / 8);
      if (s % 4 === 0) toneAt(BASS[bar], mNext, .5, .05, 'triangle');
      if (s % 2 === 0 && Math.random() < .55) toneAt(pick(PENT), mNext, .3, .028, 'sine');
      if (s % 8 === 4) toneAt(BASS[bar] * 2, mNext, .35, .03, 'sine');
      mNext += STEP; mStep++;
    }
  } else mNext = ac.currentTime + .1;
  setTimeout(musicTick, 80);
}
function syncSoundBtns() {
  $('btnMusic').textContent = '🎵 Nhạc: ' + (musicOn ? 'Bật' : 'Tắt'); $('btnSfx').textContent = '🔊 Âm: ' + (sfxOn ? 'Bật' : 'Tắt');
  $('pMusic').textContent = '🎵 Nhạc: ' + (musicOn ? 'Bật' : 'Tắt'); $('pSfx').textContent = '🔊 Âm: ' + (sfxOn ? 'Bật' : 'Tắt');
}
const togMusic = () => { ensureAudio(); musicOn = !musicOn; syncSoundBtns(); };
const togSfx = () => { ensureAudio(); sfxOn = !sfxOn; syncSoundBtns(); };
$('btnMusic').onclick = $('pMusic').onclick = togMusic; $('btnSfx').onclick = $('pSfx').onclick = togSfx;

/* ================= Giao diện chung ================= */
let toastT;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }
function banner(msg, warn) { const b = $('banner'); b.textContent = msg; b.classList.toggle('warn', !!warn); b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }
let hintT; function hint(msg, ms = 7000) { const h = $('hint'); h.textContent = msg; h.classList.add('show'); clearTimeout(hintT); hintT = setTimeout(() => h.classList.remove('show'), ms); }
const SCREENS = ['menu', 'pause', 'win', 'lose', 'editor'];
function showScreen(id) { SCREENS.forEach(s => $(s).classList.toggle('show', s === id)); }
function bumpEl(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

/* ================= Menu ================= */
let prog = { cleared: {} };
{ const s = lsGet(PK); if (s) { try { prog = JSON.parse(s); } catch (e) {} } }
const THEME_ICON = { day: '☀️', dusk: '🌇', night: '🌙', grave: '🪦', castle: '🏰' };
function buildMenu() {
  const savedRun = readRunCheckpoint();
  const continueBtn = $('resumeSavedBtn');
  continueBtn.hidden = !savedRun;
  continueBtn.onclick = savedRun ? resumeSavedRun : null;
  const box = $('cards'); box.innerHTML = '';
  CFG.levels.forEach((L, i) => {
    const unlocked = CFG.unlockAll || i === 0 || prog.cleared[i - 1] || prog.cleared[i];
    const b = document.createElement('button'); b.className = 'card ' + (L.theme || 'day');
    b.disabled = !unlocked; if (!unlocked) b.style.opacity = .55;
    const mons = new Set(); (L.timeline || []).forEach(e => (Array.isArray(e.spawn) ? e.spawn : (e.monster ? [e] : [])).forEach(s => mons.add(s.monster)));
    b.innerHTML = \`<div class="num">\${i + 1}</div><div class="ci"><b>\${L.name || 'Màn ' + (i + 1)}</b>
      <span>\${[...mons].map(monImg).join('')}</span><small>\${THEME_ICON[L.theme] || '☀️'} \${(L.plants || []).length} loại cây</small></div>
      <div class="st">\${prog.cleared[i] ? '⭐' : unlocked ? '▶️' : '🔒'}</div>\`;
    b.onclick = () => { ensureAudio(); sfx.tap(); play(i); };
    box.appendChild(b);
  });
}

/* ================= Trạng thái trận đấu ================= */
const cv = $('c'), ctx = cv.getContext('2d'), bg = document.createElement('canvas');
let W = 0, H = 0, DPR = 1, cw = 60, ch = 60, ox = 60, oy = 60, safeL = 0, safeR = 0, ROWS = 5;
let G = null, ptr = { x: 0, y: 0, down: false, type: 'touch' }, drag = null, T = 0;
let saveAcc = 0;
function readRunCheckpoint() {
  const raw = lsGet(RK);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    const state = saved?.state;
    if (saved?.version === 1 && Number.isInteger(saved.li) && saved.li >= 0 &&
        saved.li < CFG.levels.length && state && state.phase !== 'done' &&
        Number.isFinite(state.time) && Array.isArray(state.plants) &&
        state.plants.length >= 3 && state.plants.length <= 6 &&
        state.plants.every(row => Array.isArray(row) && row.length === COLS) &&
        Array.isArray(state.monsters) && Array.isArray(state.bullets) &&
        Array.isArray(state.suns) && Array.isArray(state.events) &&
        Array.isArray(state.queue) && Array.isArray(state.timers)) return saved;
  } catch (e) { console.error('Không thể đọc tiến độ Vườn Thủ Hộ.', e); }
  try { localStorage.removeItem(RK); } catch (e) { console.error('Không thể xóa tiến độ lỗi.', e); }
  return null;
}
function saveRunCheckpoint() {
  if (!G || G.phase === 'done') return;
  try { localStorage.setItem(RK, JSON.stringify({ version: 1, li: G.li, state: G })); }
  catch (e) { console.error('Không thể lưu ván Vườn Thủ Hộ vào localStorage.', e); toast('Không thể lưu ván chơi trên thiết bị này.'); }
}
function resumeSavedRun() {
  const saved = readRunCheckpoint();
  if (!saved) return;
  const state = saved.state;
  state.L = CFG.levels[saved.li];
  state.paused = false;
  state.autoPaused = false;
  state.plants = (state.plants || []).map(row => row.map(p => p ? { ...p, d: CFG.plants[p.id] } : null));
  state.monsters = (state.monsters || []).map(m => ({ ...m, d: CFG.monsters[m.id] }));
  if (state.plants.some(row => row.some(p => p && !p.d)) || state.monsters.some(m => !m.d)) {
    try { localStorage.removeItem(RK); } catch (e) { console.error('Không thể xóa tiến độ không tương thích.', e); }
    buildMenu();
    toast('Ván đã lưu không còn tương thích với cấu hình hiện tại.');
    return;
  }
  G = state;
  ROWS = state.plants.length;
  $('top').classList.add('on');
  $('speedBtn').textContent = G.speed + '×';
  $('shovel').classList.toggle('on', !!G.shovel);
  layout(); buildPackets(); buildBg(); showScreen(null); checkOrient();
  hint(\`Đã khôi phục màn \${G.li + 1} từ lần chơi trước.\`);
}
const THEMES = {
  day:   { c1: '#63b24f', c2: '#74c25c', base: ['#3f8a37', '#2d6e2c'], wall: '#d9b98c', tuft: 'rgba(30,100,35,.35)' },
  dusk:  { c1: '#58a24f', c2: '#66b25e', base: ['#37753a', '#25572c'], wall: '#c9a77d', tuft: 'rgba(25,85,40,.4)' },
  night: { c1: '#2f6b4a', c2: '#37785a', base: ['#1d4433', '#12301f'], wall: '#8f8a96', tuft: 'rgba(10,50,30,.5)' },
  grave: { c1: '#4a6b4a', c2: '#547a54', base: ['#2a3d33', '#16241d'], wall: '#6f7a74', tuft: 'rgba(10,40,25,.5)' },
  castle: { c1: '#4b3f5c', c2: '#564a6b', base: ['#2a1f3a', '#150e22'], wall: '#6a5a7a', tuft: 'rgba(20,10,40,.5)' }
};

function normEvents(tl) {
  const evs = (tl || []).map(e => {
    const specs = (Array.isArray(e.spawn) ? e.spawn : (e.monster ? [e] : [])).map(s => ({ monster: s.monster, row: s.row === undefined ? 'random' : s.row, count: Math.max(1, s.count | 0 || 1), gap: s.gap === undefined ? 1.5 : +s.gap, delay: +s.delay || 0 }));
    return { t: +e.t || 0, banner: e.banner, flag: !!e.flag, specs };
  }).sort((a, b) => a.t - b.t);
  let end = 1;
  evs.forEach(e => { end = Math.max(end, e.t); e.specs.forEach(s => { end = Math.max(end, e.t + s.delay + s.gap * (s.count - 1)); }); });
  return { evs, end };
}
function newGame(li) {
  const L = CFG.levels[li]; ROWS = clamp(L.rows | 0 || 5, 3, 6);
  const ne = normEvents(L.timeline);
  return {
    li, L, time: 0, sun: L.startSun === undefined ? 150 : L.startSun, plants: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    monsters: [], bullets: [], suns: [], fx: [], timers: [], queue: [], events: ne.evs, endT: ne.end, ei: 0, cd: {}, sel: null, shovel: false,
    speed: 1, paused: false, autoPaused: false, phase: 'ready', readyT: 2.3, shake: 0, skyT: (L.skySun && L.skySun.every > 0) ? (L.skySun.first || 6) : 1e9,
    mowers: Array.from({ length: ROWS }, (_, r) => ({ row: r, u: -.62, state: 0, used: false })), endDelay: 0, killed: 0, planted: 0, stage: 0,
    flies: Array.from({ length: 16 }, () => ({ x: Math.random(), y: Math.random(), p: rand(0, 6) })), clouds: [{ x: .1, y: .3, s: 1 }, { x: .6, y: .7, s: 1.4 }]
  };
}

/* ================= Bố cục & nền ================= */
function layout() {
  DPR = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
  cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const cs = getComputedStyle($('safe')); safeL = parseFloat(cs.paddingLeft) || 0; safeR = parseFloat(cs.paddingRight) || 0;
  const topH = $('top').classList.contains('on') ? $('top').offsetHeight : 58;
  oy = topH + 6; const availW = W - safeL - safeR - 8; cw = availW / (COLS + 2.05);
  ch = Math.min((H - oy - 6) / ROWS, cw * 1.3); ox = safeL + 4 + .95 * cw;
  if (G) buildBg();
}
function buildBg() {
  bg.width = W * DPR; bg.height = H * DPR; const g = bg.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  const th = THEMES[G.L.theme] || THEMES.day; let s = 7331; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, th.base[0]); gr.addColorStop(1, th.base[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const lh = ch * ROWS, lw = cw * COLS;
  // nhà bên trái
  g.fillStyle = th.wall; g.fillRect(0, oy, ox, lh);
  g.strokeStyle = 'rgba(80,50,30,.25)'; g.lineWidth = 1;
  for (let y = oy; y < oy + lh; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(ox, y); g.stroke(); const off = ((y - oy) / 16 | 0) % 2 ? 0 : 12; for (let x = off; x < ox; x += 24) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 16); g.stroke(); } }
  for (let r = 0; r < ROWS; r++) {
    const cy = oy + (r + .5) * ch;
    if (r === (ROWS >> 1)) { g.fillStyle = '#6b3f22'; g.fillRect(safeL + 4, cy - ch * .38, ox - safeL - 30, ch * .76); g.fillStyle = '#ffd36b'; g.beginPath(); g.arc(ox - 36, cy, 3.5, 0, 6.283); g.fill(); }
    else if (r % 2 === 0 || ROWS <= 3) { g.fillStyle = G.L.theme === 'night' ? '#ffdf8a' : '#9fd4f0'; g.fillRect(safeL + 10, cy - ch * .2, ox - safeL - 40, ch * .4); g.strokeStyle = '#6b3f22'; g.lineWidth = 3; g.strokeRect(safeL + 10, cy - ch * .2, ox - safeL - 40, ch * .4); }
  }
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(ox - 6, oy, 6, lh);
  // cỏ
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = ox + c * cw, y = oy + r * ch; g.fillStyle = (r + c) % 2 ? th.c1 : th.c2; g.fillRect(x, y, cw + .5, ch + .5);
    g.strokeStyle = th.tuft; g.lineWidth = 1.4;
    for (let k = 0; k < 5; k++) { const tx = x + rnd() * cw, ty = y + ch * .2 + rnd() * ch * .75; g.beginPath(); g.moveTo(tx - 3, ty); g.lineTo(tx - 1.5, ty - 6); g.moveTo(tx, ty); g.lineTo(tx, ty - 8); g.moveTo(tx + 3, ty); g.lineTo(tx + 1.5, ty - 6); g.stroke(); }
  }
  const sh = g.createLinearGradient(ox, 0, ox + cw * .5, 0); sh.addColorStop(0, 'rgba(0,0,0,.25)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(ox, oy, cw * .5, lh);
  // bên phải: đường đất + bụi cây
  const rx = ox + lw; const rg = g.createLinearGradient(rx, 0, W, 0); rg.addColorStop(0, 'rgba(120,85,50,.0)'); rg.addColorStop(.4, 'rgba(120,85,50,.55)'); rg.addColorStop(1, 'rgba(90,60,35,.85)');
  g.fillStyle = rg; g.fillRect(rx, oy, W - rx, lh);
  for (let i = 0; i < ROWS * 3; i++) { const bx = rx + cw * (.9 + rnd() * 1.1), by = oy + rnd() * lh; g.fillStyle = \`rgba(\${30 + rnd() * 20 | 0},\${90 + rnd() * 40 | 0},\${35},.9)\`; g.beginPath(); g.arc(bx, by, cw * (.16 + rnd() * .16), 0, 6.283); g.fill(); }
  const vg = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, Math.max(W, H) * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.4)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}

/* ================= Vẽ emoji ================= */
const tc = document.createElement('canvas'), tx = tc.getContext('2d');
function emoji(e, x, y, size, o = {}) {
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.sx || o.sy) ctx.scale(o.sx || 1, o.sy || 1);
  ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
  if (o.tint) {
    const s = Math.ceil(size * 1.6), px = Math.ceil(s * DPR); tc.width = tc.height = px; tx.setTransform(DPR, 0, 0, DPR, 0, 0); tx.clearRect(0, 0, s, s);
    tx.font = \`\${size}px \${EMO}\`; tx.textAlign = 'center'; tx.textBaseline = 'middle'; tx.fillText(e, s / 2, s / 2);
    tx.globalCompositeOperation = 'source-atop'; tx.globalAlpha = o.tintA || .5; tx.fillStyle = o.tint; tx.fillRect(0, 0, s, s); tx.globalAlpha = 1; tx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tc, -s / 2, -s / 2, s, s);
  } else { ctx.font = \`\${size}px \${EMO}\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, 0, 0); }
  ctx.restore();
}
const shadow = (x, y, rx, ry, a = .28) => { ctx.fillStyle = \`rgba(0,0,0,\${a})\`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.283); ctx.fill(); };
const px = u => ox + u * cw, py = v => oy + v * ch;

/* ================= SVG quái ================= */
const svgWrap = body => \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\${body}</svg>\`;
const OUTLINE = '#2a1a10';
const SVG_SPRITES = {
  zombie: svgWrap(\`<ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".2"/><path d="M44 70v20M58 70v20" stroke="#34456b" stroke-width="11" stroke-linecap="round"/><path d="M40 92h10M56 92h10" stroke="\${OUTLINE}" stroke-width="7" stroke-linecap="round"/><path d="M34 46q16-6 30 0l4 28-8-4-6 6-6-6-6 6-6-6-6 4z" fill="#7a4fa0" stroke="\${OUTLINE}" stroke-width="3"/><path d="M38 52L10 56M40 62L14 68" stroke="#8fbf6a" stroke-width="9" stroke-linecap="round"/><circle cx="46" cy="30" r="18" fill="#a6d67f" stroke="\${OUTLINE}" stroke-width="3"/><path d="M34 16l4 6 5-7 5 7 6-5" fill="#4a3320" stroke="\${OUTLINE}" stroke-width="2"/><circle cx="39" cy="30" r="6" fill="white"/><circle cx="53" cy="29" r="4.5" fill="white"/><circle cx="38" cy="31" r="2.5"/><circle cx="52" cy="30" r="2"/><path d="M34 41l4-3 4 3 4-3 4 3 4-3" stroke="\${OUTLINE}" stroke-width="2.5" fill="#5a1a1a"/>\`),
  zombieCone: svgWrap(\`<path d="M29 20L46 0l20 20z" fill="#f08a2a" stroke="\${OUTLINE}" stroke-width="3"/><path d="M35 13h24M32 18h29" stroke="white" stroke-width="3"/><ellipse cx="47" cy="20" rx="20" ry="4" fill="#d46a14" stroke="\${OUTLINE}" stroke-width="2.5"/><g transform="translate(0,8)">\${'<path d="M44 70v20M58 70v20" stroke="#34456b" stroke-width="11" stroke-linecap="round"/><path d="M34 46q16-6 30 0l4 28-8-4-6 6-6-6-6 6-6-6-6 4z" fill="#7a4fa0" stroke="#2a1a10" stroke-width="3"/><circle cx="46" cy="30" r="18" fill="#a6d67f" stroke="#2a1a10" stroke-width="3"/><circle cx="39" cy="30" r="6" fill="white"/><circle cx="53" cy="29" r="4.5" fill="white"/><path d="M34 41l4-3 4 3 4-3 4 3" stroke="#2a1a10" stroke-width="2.5"/>'}</g>\`),
  bat: svgWrap(\`<ellipse cx="50" cy="94" rx="20" ry="3" fill="#000" opacity=".18"/><path d="M50 52L22 28 4 40l10 6-6 14 14-4 8 10 8-6zM50 52l28-24 18 12-10 6 6 14-14-4-8 10-8-6z" fill="#5a3a8a" stroke="\${OUTLINE}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="50" cy="56" rx="15" ry="17" fill="#3a2460" stroke="\${OUTLINE}" stroke-width="3"/><path d="M38 44l-3-14 10 8M62 44l3-14-10 8" fill="#3a2460" stroke="\${OUTLINE}" stroke-width="3"/><circle cx="44" cy="52" r="4" fill="#ff3a4a"/><circle cx="56" cy="52" r="4" fill="#ff3a4a"/><path d="M44 62q6 5 12 0" stroke="\${OUTLINE}" stroke-width="2.5" fill="white"/>\`),
  vampire: svgWrap(\`<ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".22"/><path d="M34 44L14 92h66L66 44z" fill="#1c1428" stroke="\${OUTLINE}" stroke-width="3"/><path d="M44 50l6 30 6-30z" fill="#e8dfe8"/><path d="M36 46l14 8-4-14zM64 46L50 54l4-14z" fill="#b0123a" stroke="\${OUTLINE}" stroke-width="2"/><circle cx="48" cy="30" r="17" fill="#ece3f0" stroke="\${OUTLINE}" stroke-width="3"/><path d="M31 28q2-18 18-17 14 0 16 14-8-8-18-8-8 0-16 11z" fill="#14101c" stroke="\${OUTLINE}" stroke-width="2.5"/><ellipse cx="41" cy="30" rx="4.5" ry="5.5" fill="white"/><circle cx="40" cy="31" r="2.6" fill="#d40f2e"/><ellipse cx="55" cy="29" rx="4" ry="5" fill="white"/><circle cx="54" cy="30" r="2.4" fill="#d40f2e"/><path d="M37 40q8 5 16 0M40 40l2 6 2-5M49 41l2 6 2-6" stroke="\${OUTLINE}" stroke-width="2.5" fill="#fff"/>\`),
  vampLord: svgWrap(\`<path d="M32 16l4-10 7 7 6-10 6 10 7-7 3 10z" fill="#f5c542" stroke="\${OUTLINE}" stroke-width="2.5"/><circle cx="49" cy="10" r="2.5" fill="#d40f2e"/><g transform="translate(0,3)"><path d="M34 44L14 92h66L66 44z" fill="#7a0f2a" stroke="\${OUTLINE}" stroke-width="3"/><path d="M44 50l6 30 6-30z" fill="#e8dfe8"/><path d="M36 46l14 8-4-14zM64 46L50 54l4-14z" fill="#b0123a" stroke="\${OUTLINE}" stroke-width="2"/><circle cx="48" cy="30" r="17" fill="#ece3f0" stroke="\${OUTLINE}" stroke-width="3"/><path d="M31 28q2-18 18-17 14 0 16 14-8-8-18-8-8 0-16 11z" fill="#14101c" stroke="\${OUTLINE}" stroke-width="2.5"/><circle cx="41" cy="30" r="4" fill="#d40f2e"/><circle cx="55" cy="29" r="4" fill="#d40f2e"/></g>\`)
};
const SVG_IMAGES = {};
function svgImage(id) {
  if (!SVG_SPRITES[id]) return null;
  if (!SVG_IMAGES[id]) {
    const image = new Image();
    image.src = \`data:image/svg+xml;charset=utf-8,\${encodeURIComponent(SVG_SPRITES[id])}\`;
    SVG_IMAGES[id] = image;
  }
  return SVG_IMAGES[id];
}
function monImg(id) {
  const image = svgImage(id);
  return image ? \`<img alt="" src="\${image.src}">\` : (CFG.monsters[id] || {}).icon || '';
}
function drawMonsterSprite(id, icon, x, y, size, options) {
  const image = svgImage(id);
  if (!image || !image.complete || !image.naturalWidth) { emoji(icon, x, y, size, options); return; }
  ctx.save(); ctx.translate(x, y); if (options.rot) ctx.rotate(options.rot);
  ctx.scale(options.sx || 1, options.sy || 1); ctx.globalAlpha = options.alpha === undefined ? 1 : options.alpha;
  const spriteSize = size * 1.3;
  if (options.tint) {
    const pixels = Math.ceil(spriteSize * DPR); tc.width = tc.height = pixels;
    tx.setTransform(DPR, 0, 0, DPR, 0, 0); tx.clearRect(0, 0, spriteSize, spriteSize);
    tx.drawImage(image, 0, 0, spriteSize, spriteSize); tx.globalCompositeOperation = 'source-atop';
    tx.globalAlpha = options.tintA || .5; tx.fillStyle = options.tint; tx.fillRect(0, 0, spriteSize, spriteSize);
    tx.globalAlpha = 1; tx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tc, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
  } else ctx.drawImage(image, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
  ctx.restore();
}

/* ================= Hiệu ứng ================= */
function part(x, y, n, cols, spd = 120, up = 60, life = .7, r = 3.5, grav = 260) {
  for (let i = 0; i < n; i++) { const a = rand(0, 6.283), s = rand(.3, 1) * spd; G.fx.push({ k: 'p', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - up, life: life * rand(.7, 1.1), max: life, c: pick(cols), r: rand(r * .6, r * 1.3), g: grav }); }
}
const floatText = (x, y, t, c = '#fff') => G.fx.push({ k: 't', x, y, t, c, life: 1.1, max: 1.1 });
function boom(x, y, rad, col = '#ffb43a') { G.fx.push({ k: 'b', x, y, rad, life: .55, max: .55, c: col }); part(x, y, 22, ['#ffdd66', '#ff9a3a', '#ff5a2a', '#fff'], 260, 80, .8, 4.5); G.shake = Math.max(G.shake, 9); sfx.boom(); }
function confetti() { for (let i = 0; i < 90; i++) G.fx.push({ k: 'c', x: rand(0, W), y: rand(-60, -5), vx: rand(-50, 50), vy: rand(80, 220), r: rand(0, 6), vr: rand(-8, 8), s: rand(6, 10), life: 4, max: 4, c: pick(['#ff8fb1', '#ffe066', '#9be16d', '#6fc8ff', '#c9a8ff', '#ff9d5c']) }); }

/* ================= Nắng ================= */
function addSun(u, v, val, mode) {
  const s = { u, v, val, mode, age: 0, life: 9, state: mode === 'sky' ? 'fall' : 'pop', tv: 0, vu: 0, vv: 0 };
  if (mode === 'sky') { s.tv = clamp(v + rand(1.2, 3.6), .5, ROWS - .4); s.v = -.4; s.vv = .5; }
  else { s.vu = rand(-.5, .5); s.vv = -2.3; s.tv = v + rand(.15, .5); }
  G.suns.push(s);
}
function collectSun(s) {
  const r = $('sunNum').getBoundingClientRect();
  s.state = 'collect'; s.ct = 0; s.x0 = px(s.u); s.y0 = py(s.v); s.x1 = r.left + r.width / 2 - 20; s.y1 = r.top + r.height / 2; sfx.sun();
}
function collectAt(x, y) {
  let got = false; const R = Math.max(30, cw * .36);
  for (const s of G.suns) { if (s.state === 'collect') continue; if (Math.hypot(px(s.u) - x, py(s.v) - y) < R) { collectSun(s); got = true; } }
  return got;
}

/* ================= Cây ================= */
function packetOk(id) { const d = CFG.plants[id]; return (G.cd[id] || 0) <= 0 && G.sun >= d.cost; }
function pickPacket(id, e) {
  if (!G || G.paused || G.phase === 'done') return;
  const d = CFG.plants[id];
  if ((G.cd[id] || 0) > 0) { sfx.err(); toast('⏳ ' + d.name + ' đang hồi'); return; }
  if (G.sun < d.cost) { sfx.err(); bumpEl($('sunBox'), 'shake'); toast('Chưa đủ nắng ☀️'); return; }
  G.shovel = false; $('shovel').classList.remove('on');
  if (G.sel === id) { G.sel = null; drag = null; sfx.tap(); return; }
  G.sel = id; drag = { id, x0: e.clientX, y0: e.clientY, moved: false }; ptr.x = e.clientX; ptr.y = e.clientY; sfx.tap();
}
function cellAt(x, y) {
  const c = Math.floor((x - ox) / cw), r = Math.floor((y - oy) / ch);
  return (r < 0 || c < 0 || r >= ROWS || c >= COLS) ? null : { row: r, col: c };
}
function plantAt(row, col, id) {
  const d = CFG.plants[id]; if (!d) return false;
  if (G.plants[row][col]) { toast('Ô này đã có cây'); sfx.err(); return false; }
  if (G.sun < d.cost) { sfx.err(); bumpEl($('sunBox'), 'shake'); toast('Chưa đủ nắng ☀️'); return false; }
  if ((G.cd[id] || 0) > 0) { sfx.err(); return false; }
  G.sun -= d.cost; G.cd[id] = d.cooldown; G.planted++;
  G.plants[row][col] = { id, d, row, col, hp: d.hp, maxHp: d.hp, alive: true, ph: rand(0, 6), flash: 0, recoil: 0, cdT: (d.every || 1) * .5, tt: d.first === undefined ? d.every : d.first, fuse: d.fuse, armT: d.arm, armed: false, wob: 0, born: 0 };
  part(px(col + .5), py(row + .85), 10, ['#7a5230', '#5b3b22', '#8fdc63'], 90, 50, .5, 3); sfx.plant();
  G.fx.push({ k: 'r', x: px(col + .5), y: py(row + .85), rad: cw * .5, life: .4, max: .4, c: '#d9ffb0' });
  G.sel = null; drag = null; $('hint').classList.remove('show'); return true;
}
function removePlant(p, silent) {
  G.plants[p.row][p.col] = null; p.alive = false;
  if (!silent) part(px(p.col + .5), py(p.row + .6), 14, ['#8fdc63', '#5fb84a', '#3f8a37'], 140, 60, .6, 4);
}
function blast(cu, row, radius, rowRange, dmg) {
  G.monsters.forEach(m => { if (!m.dying && Math.abs(m.row - row) <= rowRange && Math.abs(m.u - cu) <= radius) dmgMonster(m, dmg, { fire: true }); });
  boom(px(cu), py(row + .5), radius * cw);
}
function updatePlant(p, dt) {
  const d = p.d; p.flash = Math.max(0, p.flash - dt); p.recoil = Math.max(0, p.recoil - dt * 6); p.wob = Math.max(0, p.wob - dt * 4); p.born += dt;
  if (d.kind === 'producer') {
    p.tt -= dt; if (p.tt <= 0) { p.tt = d.every; addSun(p.col + .5 + rand(-.1, .1), p.row + .35, d.amount, 'flower'); }
  } else if (d.kind === 'shooter') {
    p.cdT -= dt;
    const has = G.monsters.some(m => m.row === p.row && !m.dying && m.u > p.col + .4 && m.u < COLS + .6);
    if (has && p.cdT <= 0) {
      p.cdT = d.every; p.recoil = 1;
      for (let k = 0; k < (d.shots || 1); k++) G.timers.push({ at: G.time + k * .13, row: p.row, col: p.col });
    }
  } else if (d.kind === 'bomb') {
    p.fuse -= dt; if (p.fuse <= 0) { const cu = p.col + .5, r = p.row; removePlant(p, true); blast(cu, r, d.radius || 1.5, Math.round(d.radius || 1.5) > 1 ? 1 : 0, d.damage); }
  } else if (d.kind === 'lane') {
    p.fuse -= dt; if (p.fuse <= 0) {
      const r = p.row; removePlant(p, true);
      G.monsters.forEach(m => { if (m.row === r && !m.dying && m.u < COLS + 1) dmgMonster(m, d.damage, { fire: true }); });
      G.fx.push({ k: 'l', row: r, life: .8, max: .8 }); G.shake = Math.max(G.shake, 6); sfx.boom();
    }
  } else if (d.kind === 'mine') {
    if (!p.armed) { p.armT -= dt; if (p.armT <= 0) { p.armed = true; part(px(p.col + .5), py(p.row + .6), 10, ['#ffe066', '#fff'], 90, 60, .5, 3); sfx.pop(); } }
    else if (G.monsters.some(m => m.row === p.row && !m.dying && Math.abs(m.u - (p.col + .5)) < .7)) { const cu = p.col + .5, r = p.row; removePlant(p, true); blast(cu, r, 1.05, 0, d.damage); }
  }
}

/* ================= Quái ================= */
function spawnMonster(id, row) {
  const d = CFG.monsters[id]; if (!d) return;
  G.monsters.push({ id, d, row, u: COLS + .75 + rand(0, .2), hp: d.hp, maxHp: d.hp, slow: 0, slowT: 0, state: 'walk', jumped: false, ph: rand(0, 6), flash: 0, dying: 0, eat: false, size: d.size || 1, jt: 0, ju0: 0, ju1: 0 });
}
function dmgMonster(m, amt, o = {}) {
  if (m.dying) return; m.hp -= amt; m.flash = .1;
  if (o.slow) { m.slow = Math.max(m.slow, o.slow); m.slowT = Math.max(m.slowT, o.slowT || 3); }
  if (m.hp <= 0) killMonster(m, o);
}
function killMonster(m, o = {}) {
  m.dying = .7; m.hp = 0; G.killed++; m.fling = !!o.fling;
  G.fx.push({ k: 'r', x: px(m.u), y: py(m.row + .5), rad: cw * .6, life: .45, max: .45, c: '#fff3a0' });
  part(px(m.u), py(m.row + .5), 14, ['#9ad14b', '#f4e04d', '#fff', '#c7e86b'], 170, 80, .7, 4); sfx.splat();
}
function updateMonster(m, dt) {
  const anim = m.state === 'walk' ? 5 + m.d.speed * 12 : 9; m.ph += dt * anim;
  if (m.flash > 0) m.flash -= dt; if (m.slowT > 0) { m.slowT -= dt; if (m.slowT <= 0) m.slow = 0; }
  if (m.dying > 0) { m.dying -= dt; return; }
  if (m.state === 'jump') { m.jt += dt / .75; const k = clamp(m.jt, 0, 1); m.u = lerp(m.ju0, m.ju1, k); if (k >= 1) m.state = 'walk'; return; }
  const mu = m.u - .28 * m.size, col = Math.floor(mu);
  const plant = (col >= 0 && col < COLS) ? G.plants[m.row][col] : null;
  if (plant) {
    if (m.d.jump && !m.jumped) { m.jumped = true; m.state = 'jump'; m.jt = 0; m.ju0 = m.u; m.ju1 = m.u - 1.6; sfx.jump(); return; }
    m.eat = true; plant.hp -= m.d.dps * dt; plant.flash = .1; plant.wob = 1; sfx.crunch();
    if (plant.hp <= 0) removePlant(plant);
    return;
  }
  m.eat = false; m.u -= m.d.speed * (1 - m.slow) * dt;
  const mw = G.mowers[m.row];
  if (mu < .15 && mw && !mw.state && !mw.used) { mw.state = 1; mw.used = true; sfx.mower(); }
  if (mu < -.55 && !(mw && mw.state === 1)) endGame(false);
}

/* ================= Vòng cập nhật ================= */
function updateFx(dt) {
  for (let i = G.fx.length - 1; i >= 0; i--) {
    const f = G.fx[i]; f.life -= dt;
    if (f.k === 'p') { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += f.g * dt; }
    else if (f.k === 't') f.y -= 28 * dt;
    else if (f.k === 'c') { f.x += f.vx * dt; f.y += f.vy * dt; f.r += f.vr * dt; }
    if (f.life <= 0) G.fx.splice(i, 1);
  }
}
function update(dt) {
  if (!G || G.paused) return;
  if (G.phase === 'done') { updateFx(dt); G.shake = Math.max(0, G.shake - dt * 30); return; }
  dt *= G.speed; G.time += dt; G.shake = Math.max(0, G.shake - dt * 30);
  if (G.readyT > 0) {
    const before = G.readyT; G.readyT -= dt;
    if (before === 2.3) banner('Sẵn sàng...'); if (before > 1.15 && G.readyT <= 1.15) banner('Trồng cây đi!');
  }
  // dòng thời gian
  while (G.ei < G.events.length && G.time >= G.events[G.ei].t) {
    const ev = G.events[G.ei++]; G.stage++;
    if (ev.banner) { banner(ev.banner, true); sfx.alarm(); }
    ev.specs.forEach(s => {
      for (let k = 0; k < s.count; k++) {
        const due = ev.t + s.delay + k * s.gap;
        if (s.row === 'all') for (let r = 0; r < ROWS; r++) G.queue.push({ due, monster: s.monster, row: r });
        else G.queue.push({ due, monster: s.monster, row: s.row === 'random' ? -1 : clamp(s.row - 1, 0, ROWS - 1) });
      }
    });
  }
  for (let i = G.queue.length - 1; i >= 0; i--) {
    const q = G.queue[i]; if (G.time >= q.due) { spawnMonster(q.monster, q.row < 0 ? Math.floor(Math.random() * ROWS) : q.row); G.queue.splice(i, 1); }
  }
  for (let i = G.timers.length - 1; i >= 0; i--) if (G.time >= G.timers[i].at) {
    const t = G.timers[i]; G.timers.splice(i, 1);
    const p = G.plants[t.row]?.[t.col];
    if (!p?.alive) continue;
    const d = p.d;
    G.bullets.push({ row: p.row, u: p.col + .78, pu: p.col + .78, dmg: d.damage, slow: d.slow || 0, slowT: d.slowTime || 3, style: d.slow ? 'ice' : ((d.shots || 1) > 1 ? 'spike' : 'seed') });
    sfx.shoot();
  }
  // nắng từ trời
  const ss = G.L.skySun;
  if (ss && ss.every > 0) { G.skyT -= dt; if (G.skyT <= 0) { G.skyT = ss.every * rand(.85, 1.15); addSun(rand(.4, COLS - .4), 0, ss.amount || 25, 'sky'); } }
  // hồi chiêu
  Object.keys(G.cd).forEach(k => { if (G.cd[k] > 0) G.cd[k] = Math.max(0, G.cd[k] - dt); });
  // cây
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const p = G.plants[r][c]; if (p) updatePlant(p, dt); }
  // quái
  G.monsters.forEach(m => updateMonster(m, dt));
  G.monsters = G.monsters.filter(m => !(m.hp <= 0 && m.dying <= 0));
  // đạn
  for (let i = G.bullets.length - 1; i >= 0; i--) {
    const b = G.bullets[i]; b.pu = b.u; b.u += 5.5 * dt; let tg = null;
    for (const m of G.monsters) {
      if (m.row !== b.row || m.dying) continue; const lo = m.u - .3 * m.size, hi = m.u + .3 * m.size;
      if (b.u >= lo && b.pu <= hi && (!tg || m.u < tg.u)) tg = m;
    }
    if (tg) { dmgMonster(tg, b.dmg, { slow: b.slow, slowT: b.slowT }); part(px(b.u), py(b.row + .5), 5, b.style === 'ice' ? ['#bfe6ff', '#fff'] : ['#b6f26f', '#fff'], 80, 30, .3, 2.5); sfx.hit(); G.bullets.splice(i, 1); }
    else if (b.u > COLS + 1.2) G.bullets.splice(i, 1);
  }
  // máy cắt cỏ
  G.mowers.forEach(mw => {
    if (mw.state !== 1) return; mw.u += 7 * dt;
    G.monsters.forEach(m => { if (m.row === mw.row && !m.dying && Math.abs(m.u - mw.u) < .65) killMonster(m, { fling: true }); });
    if (mw.u > COLS + 2) mw.state = 2;
  });
  // nắng
  for (let i = G.suns.length - 1; i >= 0; i--) {
    const s = G.suns[i]; s.age += dt;
    if (s.state === 'fall') { s.v += s.vv * dt; if (s.v >= s.tv) { s.v = s.tv; s.state = 'rest'; } }
    else if (s.state === 'pop') { s.u += s.vu * dt; s.v += s.vv * dt; s.vv += 6.5 * dt; if (s.vv > 0 && s.v >= s.tv) { s.v = s.tv; s.state = 'rest'; } }
    else if (s.state === 'rest') { s.life -= dt; if (s.life <= 0) G.suns.splice(i, 1); }
    else if (s.state === 'collect') { s.ct += dt / .5; if (s.ct >= 1) { G.sun += s.val; bumpEl($('sunBox'), 'bump'); G.suns.splice(i, 1); } }
  }
  updateFx(dt);
  // thắng / thua
  if (G.ei >= G.events.length && !G.queue.length && !G.monsters.length && G.readyT <= 0) { G.endDelay += dt; if (G.endDelay > 1.2) endGame(true); } else G.endDelay = 0;
  saveAcc += dt;
  if (saveAcc >= 1) { saveAcc = 0; saveRunCheckpoint(); }
}
function endGame(win) {
  if (!G || G.phase === 'done') return; G.phase = 'done'; G.sel = null; drag = null;
  try { localStorage.removeItem(RK); } catch (e) { console.error('Không thể xóa checkpoint Vườn Thủ Hộ.', e); }
  if (win) {
    confetti(); sfx.win(); prog.cleared[G.li] = true; lsSet(PK, JSON.stringify(prog));
    const last = G.li + 1 >= CFG.levels.length;
    $('winTxt').textContent = \`Bạn đã bảo vệ "\${G.L.name || 'khu vườn'}" và hạ \${G.killed} con quái!\`;
    $('nextBtn').style.display = last ? 'none' : ''; setTimeout(() => showScreen('win'), 1400);
  } else { sfx.lose(); banner('QUÁI VÀO NHÀ RỒI!', true); setTimeout(() => showScreen('lose'), 1600); }
}

/* ================= Vẽ ================= */
function drawPlant(p) {
  const d = p.d, x = px(p.col + .5), y = py(p.row + .5), s = Math.min(cw, ch) * .88;
  shadow(x, y + s * .34, s * .34, s * .1);
  const rot = Math.sin(T * 2 + p.ph) * .05 + Math.sin(T * 30) * .05 * p.wob; let sx = 1, sy = 1, dy = 0, o = {};
  const pop = clamp(p.born / .3, 0, 1); const ps = 1 - Math.pow(1 - pop, 3); sx *= .5 + .5 * ps; sy *= .5 + .5 * ps;
  if (d.kind === 'producer') {
    const k = clamp(1 - p.tt / 1.3, 0, 1);
    if (k > 0) { const g = ctx.createRadialGradient(x, y, 2, x, y, s * .7); g.addColorStop(0, \`rgba(255,230,100,\${k * .7})\`); g.addColorStop(1, 'rgba(255,230,100,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * .7, 0, 6.283); ctx.fill(); }
    sx *= 1 + k * .1; sy *= 1 + k * .1;
  } else if (d.kind === 'shooter') { sx *= 1 - p.recoil * .16; sy *= 1 + p.recoil * .13; }
  else if (d.kind === 'bomb') {
    const k = 1 - clamp(p.fuse / (d.fuse || 1), 0, 1); sx *= 1 + k * .55; sy *= 1 + k * .55;
    if (Math.sin(T * 30) > 0) { o.tint = '#ff3a2a'; o.tintA = k * .7; }
  } else if (d.kind === 'lane') {
    const k = 1 - clamp(p.fuse / (d.fuse || .8), 0, 1); sx *= 1 + k * .3; sy *= 1 + k * .3; dy = Math.sin(T * 50) * 2 * k;
    const g = ctx.createRadialGradient(x, y, 2, x, y, s * .8); g.addColorStop(0, \`rgba(255,120,40,\${k * .7})\`); g.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * .8, 0, 6.283); ctx.fill();
  } else if (d.kind === 'mine') {
    ctx.fillStyle = '#6b4526'; ctx.beginPath(); ctx.ellipse(x, y + s * .28, s * .3, s * .12, 0, 0, 6.283); ctx.fill();
    if (!p.armed) { emoji(d.icon, x, y + s * .12, s * .42, { alpha: .8 }); ctx.fillStyle = '#8b5a2f'; ctx.beginPath(); ctx.ellipse(x, y + s * .26, s * .32, s * .1, 0, 0, Math.PI); ctx.fill(); return; }
    sy *= 1 + Math.abs(Math.sin(T * 6)) * .06; if (Math.sin(T * 8) > 0) { ctx.fillStyle = '#ff3a2a'; ctx.beginPath(); ctx.arc(x + s * .18, y - s * .15, 3, 0, 6.283); ctx.fill(); }
  }
  if (p.flash > 0) { o.tint = '#ffffff'; o.tintA = .55; }
  emoji(d.icon, x, y + dy - s * .04, s, Object.assign({ rot, sx, sy }, o));
  if (d.kind === 'wall') {
    const r = p.hp / p.maxHp; ctx.strokeStyle = 'rgba(60,35,15,.75)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    if (r < .66) { ctx.beginPath(); ctx.moveTo(x - s * .1, y - s * .3); ctx.lineTo(x - s * .02, y - s * .1); ctx.lineTo(x - s * .14, y + s * .05); ctx.stroke(); }
    if (r < .33) { ctx.beginPath(); ctx.moveTo(x + s * .15, y - s * .25); ctx.lineTo(x + s * .05, y - s * .02); ctx.lineTo(x + s * .18, y + s * .18); ctx.moveTo(x - s * .2, y + s * .1); ctx.lineTo(x - s * .05, y + s * .2); ctx.stroke(); }
  }
}
function drawMonster(m) {
  const x = px(m.u), y0 = py(m.row + .5), size = ch * .9 * m.size;
  shadow(x, y0 + size * .32, size * .32, size * .09);
  let rot = Math.sin(m.ph) * .09, hop = Math.abs(Math.sin(m.ph)) * size * .05, xo = 0, alpha = 1;
  if (m.eat) { rot = Math.sin(m.ph * 2) * .14; xo = Math.sin(m.ph * 4) * 2; hop = 0; }
  if (m.state === 'jump') { const k = clamp(m.jt, 0, 1); hop = Math.sin(k * Math.PI) * size * .9; rot = -k * 6.283 * .9; }
  let y = y0 - size * .05 - hop;
  if (m.dying > 0) { const k = 1 - m.dying / .7; alpha = 1 - k; rot = m.fling ? k * 9 : k * 1.4; y -= m.fling ? Math.sin(k * Math.PI) * size * .8 : -k * size * .12; xo = m.fling ? k * cw * 1.5 : 0; }
  const o = { rot, alpha };
  if (m.flash > 0) { o.tint = '#ffffff'; o.tintA = .65; } else if (m.slowT > 0) { o.tint = '#59b8ff'; o.tintA = .4; }
  if (m.dying <= 0 && !m.eat && m.state !== 'jump') { const w = Math.sin(m.ph * 2); o.sx = 1 + w * .04; o.sy = 1 - w * .04; }
  drawMonsterSprite(m.id, m.d.icon, x + xo, y, size, o);
  if (m.dying <= 0) {
    if (m.slowT > 0) emoji('❄️', x, y - size * .55, size * .28, { alpha: .9 });
    if (m.hp < m.maxHp && (m.maxHp >= 200 || m.maxHp >= 1000)) {
      const bw = size * .7, bx = x - bw / 2, by = y0 - size * .62;
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(bx - 1, by - 1, bw + 2, 7); ctx.fillStyle = m.hp / m.maxHp > .4 ? '#8fdc63' : '#ff6a4a'; ctx.fillRect(bx, by, bw * clamp(m.hp / m.maxHp, 0, 1), 5);
    }
  }
}
function drawBullet(b) {
  const x = px(b.u), y = py(b.row + .5) - ch * .12;
  if (b.style === 'ice') { const g = ctx.createRadialGradient(x, y, 1, x, y, 9); g.addColorStop(0, '#fff'); g.addColorStop(.5, '#7cc8ff'); g.addColorStop(1, 'rgba(90,170,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill(); }
  else if (b.style === 'spike') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f6f0a8'; ctx.strokeStyle = '#7a8a2a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-5, -3.5); ctx.lineTo(-3, 0); ctx.lineTo(-5, 3.5); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
  else { const g = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 7); g.addColorStop(0, '#e6ffc0'); g.addColorStop(1, '#4fa93a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(30,90,20,.6)'; ctx.lineWidth = 1; ctx.stroke(); }
}
function drawMower(mw) {
  if (mw.state === 2) return; const x = px(mw.u), y = py(mw.row + .55), s = Math.min(cw, ch) * .62, sh = mw.state === 1 ? Math.sin(T * 60) * 1.5 : 0;
  shadow(x, y + s * .42, s * .5, s * .1);
  ctx.save(); ctx.translate(x, y + sh);
  ctx.fillStyle = '#d63a2f'; ctx.strokeStyle = '#7a1d12'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-s * .5, s * .25); ctx.lineTo(-s * .45, -s * .12); ctx.quadraticCurveTo(0, -s * .3, s * .45, -s * .1); ctx.lineTo(s * .5, s * .25); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-s * .4, -s * .05); ctx.lineTo(-s * .7, -s * .5); ctx.lineTo(-s * .5, -s * .55); ctx.stroke();
  ctx.fillStyle = '#2c2c2c'; [-.28, .3].forEach(dx => { ctx.beginPath(); ctx.arc(s * dx, s * .3, s * .17, 0, 6.283); ctx.fill(); ctx.fillStyle = '#9a9a9a'; ctx.beginPath(); ctx.arc(s * dx, s * .3, s * .07, 0, 6.283); ctx.fill(); ctx.fillStyle = '#2c2c2c'; });
  ctx.restore();
}
function drawSun(s) {
  let x = px(s.u), y = py(s.v), a = 1, k = 1;
  if (s.state === 'collect') { const t = 1 - Math.pow(1 - clamp(s.ct, 0, 1), 3); x = lerp(s.x0, s.x1, t); y = lerp(s.y0, s.y1, t) - Math.sin(t * Math.PI) * 30; k = 1 - t * .35; }
  if (s.state === 'rest' && s.life < 2) a = .4 + .6 * Math.abs(Math.sin(s.life * 6));
  const r = Math.max(15, cw * .2) * k, bob = s.state === 'rest' ? Math.sin(T * 3 + s.age) * 2 : 0; y += bob;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  const g = ctx.createRadialGradient(0, 0, r * .3, 0, 0, r * 2.1); g.addColorStop(0, 'rgba(255,230,90,.75)'); g.addColorStop(1, 'rgba(255,200,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 2.1, 0, 6.283); ctx.fill();
  ctx.rotate(T * .8); ctx.fillStyle = '#ffd23a';
  for (let i = 0; i < 10; i++) { ctx.rotate(6.283 / 10); ctx.beginPath(); ctx.moveTo(r * .9, -r * .16); ctx.lineTo(r * 1.5, 0); ctx.lineTo(r * .9, r * .16); ctx.closePath(); ctx.fill(); }
  const b = ctx.createRadialGradient(-r * .3, -r * .3, 1, 0, 0, r); b.addColorStop(0, '#fffbd0'); b.addColorStop(.6, '#ffe45c'); b.addColorStop(1, '#f5a91b'); ctx.fillStyle = b; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
  ctx.restore();
}
function drawFx() {
  G.fx.forEach(f => {
    if (f.k === 'p') { ctx.globalAlpha = clamp(f.life / f.max, 0, 1); ctx.fillStyle = f.c; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * clamp(f.life / f.max, .2, 1), 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
    else if (f.k === 't') { ctx.globalAlpha = clamp(f.life * 1.5, 0, 1); ctx.font = '800 20px "Baloo 2",sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(40,20,5,.85)'; ctx.strokeText(f.t, f.x, f.y); ctx.fillStyle = f.c; ctx.fillText(f.t, f.x, f.y); ctx.globalAlpha = 1; }
    else if (f.k === 'b') {
      const k = 1 - f.life / f.max, r = f.rad * (.35 + k * .9); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r); g.addColorStop(0, \`rgba(255,240,180,\${1 - k})\`); g.addColorStop(.5, \`rgba(255,140,50,\${(1 - k) * .8})\`); g.addColorStop(1, 'rgba(255,60,20,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, 6.283); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
    } else if (f.k === 'l') {
      const k = 1 - f.life / f.max, y = py(f.row + .5), front = COLS * clamp(k * 1.6, 0, 1);
      for (let c = 0; c <= front; c += .55) emoji('🔥', px(c), y - Math.abs(Math.sin(T * 14 + c * 3)) * 6, ch * (.9 + .15 * Math.sin(T * 20 + c)), { alpha: clamp(f.life / f.max * 1.5, 0, 1) });
    } else if (f.k === 'r') { const k = 1 - f.life / f.max; ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.c; ctx.lineWidth = 1 + 4 * (1 - k); ctx.beginPath(); ctx.ellipse(f.x, f.y, f.rad * (.3 + k), f.rad * (.3 + k) * .45, 0, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
    } else if (f.k === 'c') { ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.r); ctx.globalAlpha = clamp(f.life, 0, 1); ctx.fillStyle = f.c; ctx.fillRect(-f.s / 2, -f.s / 4, f.s, f.s / 2); ctx.restore(); }
  });
}
function render() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H); if (!G) return;
  ctx.save(); if (G.shake > 0) ctx.translate(rand(-1, 1) * G.shake, rand(-1, 1) * G.shake);
  ctx.drawImage(bg, 0, 0, W, H);
  const th = G.L.theme || 'day', lh = ch * ROWS;
  if (th === 'day') { ctx.fillStyle = 'rgba(0,0,0,.05)'; G.clouds.forEach(c => { const x = ((c.x + T * .012 * c.s) % 1.4 - .2) * W, y = oy + c.y * lh; ctx.beginPath(); ctx.ellipse(x, y, cw * 2.2 * c.s, ch * .9 * c.s, 0, 0, 6.283); ctx.fill(); }); }
  // ô đang chọn
  const hoverOk = G.sel && (ptr.type === 'mouse' || ptr.down || (drag && drag.moved)) && !G.paused;
  const hc = hoverOk ? cellAt(ptr.x, ptr.y) : null;
  if (hc) { ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(ox + hc.col * cw, oy + hc.row * ch, cw, ch); }
  if (G.shovel && ptr.type === 'mouse') { const c = cellAt(ptr.x, ptr.y); if (c && G.plants[c.row][c.col]) { ctx.fillStyle = 'rgba(255,90,60,.3)'; ctx.fillRect(ox + c.col * cw, oy + c.row * ch, cw, ch); } }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) { const p = G.plants[r][c]; if (p) drawPlant(p); }
    drawMower(G.mowers[r]);
    G.monsters.filter(m => m.row === r).sort((a, b) => b.u - a.u).forEach(drawMonster);
    G.bullets.forEach(b => { if (b.row === r) drawBullet(b); });
  }
  if (hc && G.sel && !G.plants[hc.row][hc.col]) emoji(CFG.plants[G.sel].icon, px(hc.col + .5), py(hc.row + .5), Math.min(cw, ch) * .88, { alpha: .55 });
  if (th === 'night') {
    ctx.fillStyle = 'rgba(8,16,60,.38)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    G.flies.forEach(f => { const x = (f.x + Math.sin(T * .3 + f.p) * .02) * W, y = oy + (f.y + Math.cos(T * .4 + f.p) * .02) * lh, a = .3 + .7 * Math.abs(Math.sin(T * 1.6 + f.p));
      const g = ctx.createRadialGradient(x, y, 0, x, y, 11); g.addColorStop(0, \`rgba(255,240,140,\${a})\`); g.addColorStop(1, 'rgba(255,240,140,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.283); ctx.fill(); });
    ctx.globalCompositeOperation = 'source-over';
  } else if (th === 'dusk') { ctx.fillStyle = 'rgba(255,120,50,.12)'; ctx.fillRect(0, 0, W, H);
  } else if (th === 'grave' || th === 'castle') {
    const gv = th === 'grave';
    ctx.fillStyle = gv ? 'rgba(10,40,30,.34)' : 'rgba(40,10,50,.4)'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) {
      const x = ((T * .02 * (i + 1) + i * .27) % 1.5 - .25) * W, y = oy + (.15 + i * .24) * lh;
      const fog = ctx.createRadialGradient(x, y, 0, x, y, cw * 3);
      fog.addColorStop(0, gv ? 'rgba(190,230,210,.2)' : 'rgba(230,190,230,.17)'); fog.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = fog; ctx.fillRect(x - cw * 3, y - cw * 3, cw * 6, cw * 6);
    }
    const mx = W - cw * .9, my = oy + ch * .6, mist = ctx.createRadialGradient(mx, my, 2, mx, my, cw * 1.4);
    mist.addColorStop(0, gv ? 'rgba(255,255,230,.9)' : 'rgba(255,170,190,.85)');
    mist.addColorStop(.25, gv ? 'rgba(255,255,230,.35)' : 'rgba(255,120,160,.3)'); mist.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = mist; ctx.beginPath(); ctx.arc(mx, my, cw * 1.4, 0, 6.283); ctx.fill();
  }
  G.suns.forEach(drawSun);
  if (drag && drag.moved && G.sel) emoji(CFG.plants[G.sel].icon, ptr.x, ptr.y - 20, Math.min(cw, ch) * 1.05, { alpha: .9 });
  drawFx();
  ctx.restore();
}

/* ================= Giao diện trong trận ================= */
function buildPackets() {
  const box = $('packets'); box.innerHTML = '';
  G.L.plants.forEach(id => {
    const d = CFG.plants[id], b = document.createElement('button'); b.className = 'packet'; b.dataset.id = id; b.setAttribute('aria-label', \`\${d.name}, \${d.cost} nắng\`);
    b.innerHTML = \`<span class="pe">\${d.icon}</span><span class="pc">\${d.cost}</span><i class="cd"></i>\`; box.appendChild(b);
  });
  $('lvName').textContent = \`Màn \${G.li + 1}: \${G.L.name || ''}\`;
  const fl = $('flags'); fl.innerHTML = '';
  G.events.forEach(e => { if (e.flag) { const i = document.createElement('i'); i.textContent = '🚩'; i.style.left = clamp(e.t / G.endT * 100, 4, 96) + '%'; fl.appendChild(i); } });
}
let uiAcc = 0;
function updateUi(dt) {
  if (!G) return; uiAcc += dt; if (uiAcc < .08) return; uiAcc = 0;
  $('sunNum').textContent = Math.floor(G.sun);
  document.querySelectorAll('.packet').forEach(b => {
    const id = b.dataset.id, d = CFG.plants[id], cd = G.cd[id] || 0;
    b.querySelector('.cd').style.height = (cd > 0 ? cd / d.cooldown * 100 : 0) + '%';
    b.classList.toggle('dim', cd > 0 || G.sun < d.cost); b.classList.toggle('sel', G.sel === id);
  });
  const f = clamp(G.time / G.endT, 0, 1); $('progFill').style.width = f * 100 + '%'; $('progHead').style.left = clamp(f * 100, 3, 97) + '%';
}

/* ================= Vào / thoát trận ================= */
function play(li) {
  const L = CFG.levels[li]; if (!L) return; G = newGame(li);
  saveAcc = 0;
  $('top').classList.add('on'); $('speedBtn').textContent = '1×'; $('shovel').classList.remove('on');
  layout(); buildPackets(); buildBg(); showScreen(null); checkOrient();
  saveRunCheckpoint();
  if (li === 0) hint('Chạm gói hạt phía trên, rồi chạm ô cỏ để trồng. Nhớ nhặt ☀️ nắng nhé!', 9000);
  else if (!(L.skySun && L.skySun.every > 0)) hint('Màn này không có nắng rơi từ trời. Hãy trồng thật nhiều hướng dương!', 8000);
}
function toMenu() { saveRunCheckpoint(); G = null; $('top').classList.remove('on'); $('hint').classList.remove('show'); buildMenu(); showScreen('menu'); }

/* ================= Nhập liệu ================= */
cv.addEventListener('pointerdown', e => {
  ensureAudio(); ptr.x = e.clientX; ptr.y = e.clientY; ptr.down = true; ptr.type = e.pointerType || 'touch';
  if (!G || G.paused || G.phase === 'done') return;
  if (collectAt(e.clientX, e.clientY)) return;
  const c = cellAt(e.clientX, e.clientY); if (!c) { G.sel = null; return; }
  if (G.shovel) { const p = G.plants[c.row][c.col]; if (p) { removePlant(p); sfx.pop(); G.shovel = false; $('shovel').classList.remove('on'); } return; }
  if (G.sel) plantAt(c.row, c.col, G.sel);
});
cv.addEventListener('pointermove', e => { if (ptr.down && G && !G.paused) collectAt(e.clientX, e.clientY); });
window.addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.type = e.pointerType || ptr.type; if (drag && !drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 14) drag.moved = true; });
window.addEventListener('pointerup', e => {
  ptr.down = false;
  if (drag) { if (drag.moved && G && !G.paused) { const c = cellAt(e.clientX, e.clientY); if (c) plantAt(c.row, c.col, drag.id); else { G.sel = null; } } drag = null; }
});
window.addEventListener('pointercancel', () => { ptr.down = false; drag = null; });
$('packets').addEventListener('pointerdown', e => { const b = e.target.closest('.packet'); if (!b || !G) return; e.preventDefault(); ensureAudio(); pickPacket(b.dataset.id, e); });
$('shovel').onclick = () => { if (!G || G.paused || G.phase === 'done') return; ensureAudio(); G.shovel = !G.shovel; G.sel = null; $('shovel').classList.toggle('on', G.shovel); sfx.tap(); if (G.shovel) toast('Chạm vào cây để nhổ bỏ'); };
$('speedBtn').onclick = () => { if (!G) return; ensureAudio(); G.speed = G.speed === 1 ? 2 : 1; $('speedBtn').textContent = G.speed + '×'; sfx.tap(); };
$('pauseBtn').onclick = () => { if (!G || G.phase === 'done') return; ensureAudio(); G.paused = true; saveRunCheckpoint(); syncSoundBtns(); showScreen('pause'); };
$('resumeBtn').onclick = () => { if (G) G.paused = false; showScreen(null); };
$('restartBtn').onclick = () => { play(G.li); };
$('retryBtn').onclick = () => { play(G.li); };
$('nextBtn').onclick = () => { play(G.li + 1); };
$('menuBtn').onclick = $('winMenu').onclick = $('loseMenu').onclick = toMenu;
$('exitAppBtn').onclick = () => {
  if (G && G.phase !== 'done') saveRunCheckpoint();
  if (window.parent !== window) window.parent.postMessage({ type: 'quit' }, '*');
  else window.location.href = '/';
};

/* ================= Trình sửa JSON ================= */
function cfgErr(msg) { $('cfgErr').textContent = msg; }
$('btnCfg').onclick = () => { ensureAudio(); $('cfgText').value = pretty(userCfg); $('cfgDoc').innerHTML = docHtml(); cfgErr(''); showScreen('editor'); };
$('cfgClose').onclick = () => showScreen('menu');
$('cfgApply').onclick = () => {
  let u; try { u = JSON.parse($('cfgText').value); } catch (e) { cfgErr('JSON sai cú pháp: ' + e.message); return; }
  const er = validate(u); if (er.length) { cfgErr(er.slice(0, 6).join('\\n') + (er.length > 6 ? \`\\n... và \${er.length - 6} lỗi nữa\` : '')); return; }
  userCfg = u; CFG = resolve(u); lsSet(CK, JSON.stringify(u)); buildMenu(); showScreen('menu');
  toast('✅ Đã áp dụng cấu hình mới');
};
$('cfgReset').onclick = () => { $('cfgText').value = pretty(DEF); cfgErr('Đã nạp cấu hình mặc định. Bấm "Áp dụng" để dùng.'); };
$('cfgCopy').onclick = async () => { try { await navigator.clipboard.writeText($('cfgText').value); toast('Đã sao chép JSON'); } catch (e) { $('cfgText').select(); toast('Hãy chọn và sao chép thủ công'); } };
$('cfgDown').onclick = () => { const b = new Blob([$('cfgText').value], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'plantvsanimal.json'; document.body.appendChild(a); a.click(); a.remove(); };
$('cfgLoad').onclick = () => $('cfgFile').click();
$('cfgFile').onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $('cfgText').value = r.result; cfgErr('Đã nạp file. Bấm "Áp dụng" để dùng.'); }; r.readAsText(f); e.target.value = ''; };

/* ================= Hướng màn hình ================= */
function checkOrient() {
  const portrait = window.innerHeight > window.innerWidth;
  $('rotate').classList.toggle('show', portrait);
  if (G && G.phase !== 'done') { if (portrait && !G.paused) { G.paused = true; G.autoPaused = true; } else if (!portrait && G.autoPaused) { G.paused = false; G.autoPaused = false; } }
}
window.addEventListener('resize', () => { layout(); checkOrient(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && G && G.phase !== 'done' && !G.paused && !$('rotate').classList.contains('show')) { G.paused = true; saveRunCheckpoint(); syncSoundBtns(); showScreen('pause'); } });
window.addEventListener('beforeunload', saveRunCheckpoint);
window.addEventListener('pagehide', saveRunCheckpoint);

/* ================= Vòng lặp ================= */
let last = performance.now();
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt;
  update(dt); updateUi(dt); render(); requestAnimationFrame(loop);
}
buildMenu(); syncSoundBtns(); layout(); checkOrient();
requestAnimationFrame(loop);
})();
<\/script>
</body>
</html>
`,M=n(),N={math:o,memory:s,scramble:c,quiz:l,snake:u,flap:d,g2048:f,chem:p,clock:m,pattern:h,simon:g,anagram:_,stroop:v,sumseq:y,compare:b,riddle:x,shapecount:S,"chem-trai-cay":C,"hu-trai-cay":w,"xep-khoi":T,"pha-gach":E,"nhay-xoay":D,"nong-trai-vui":O,"goc-thu-gian":k,"trung-tam-game":A,plantvsanimal:j};function P({gameId:e}){let t=(0,a.useRef)(null),n=(0,a.useMemo)(()=>i(e),[e]),o=N[e];return(0,a.useEffect)(()=>{let e=e=>{e.source===t.current?.contentWindow&&e.data?.type===`quit`&&r(`/`)};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[]),!n||!o?(0,M.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-paper`,children:(0,M.jsxs)(`div`,{className:`text-center`,children:[(0,M.jsx)(`div`,{className:`text-5xl`,children:`🤔`}),(0,M.jsx)(`p`,{className:`mt-3 font-display text-lg font-bold text-ink`,children:`Không tìm thấy game`}),(0,M.jsxs)(`p`,{className:`mt-1 text-sm text-slate-500`,children:[`id: `,String(e||`(rỗng)`)]}),(0,M.jsx)(`button`,{onClick:()=>r(`/`),className:`mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600 shadow-sm hover:bg-slate-200`,children:`← Về trang chủ`})]})}):(0,M.jsx)(`div`,{className:`fixed inset-0 bg-[#0c2a30]`,children:(0,M.jsx)(`iframe`,{ref:t,title:n.name,srcDoc:o,sandbox:`allow-scripts allow-same-origin`,className:`h-full w-full border-0`})})}export{P as default};