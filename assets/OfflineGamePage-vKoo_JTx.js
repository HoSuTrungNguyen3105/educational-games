import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{Tt as r,t as i}from"./index-C8gMkciv.js";var a=e(t(),1),o=`<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
// src/games/src/math.js — Né Bóng

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
        root.innerHTML = \`<div class="panel center"><h2>Né Bóng</h2>
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  name: 'Bắn Bong Bóng',
  icon: '🫧',
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  name: 'Phòng Thí Nghiệm Vui',
  icon: '🧪',
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  name: 'Chạy Trốn Đồng Hồ',
  icon: '⏳',
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
// src/games/src/compare.js — Đấu Trường Bong Bóng

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
          <div class="qbox center"><div style="font-size:14px;opacity:.7">ĐẤU TRƯỜNG BONG BÓNG</div>
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
      name: 'Đấu Trường Bong Bóng',
      icon: '🫧',
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
// src/games/src/riddle.js — Cuộc Đua Tốc Độ

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
          <div style="font-size:14px;opacity:.7">CUỘC ĐUA TỐC ĐỘ</div>
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
      name: 'Cuộc Đua Tốc Độ',
      icon: '🏁',
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
  <title>Học Mà Chơi</title>
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
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>
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
  if (lvlEl) lvlEl.textContent = 'Cấp ' + lvl();
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
function finish({ id, score, xp, lines, replay, details = {} }) {
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
    "boss":   {"name": "Bọ Cạp Chúa",  "hp": 3200, "speed": 0.06, "dps": 80, "size": 1.7}
  },

  "plants": {
    "sunflower": {"name": "Hướng Dương",    "kind": "producer", "cost": 50,  "hp": 80,  "cooldown": 5,  "amount": 25, "every": 9, "first": 5},
    "shooter":   {"name": "Súp Lơ Bắn Hạt", "kind": "shooter",  "cost": 100, "hp": 80,  "cooldown": 5,  "damage": 20, "every": 1.5, "shots": 1},
    "wall":      {"name": "Dừa Tường",      "kind": "wall",     "cost": 50,  "hp": 600, "cooldown": 14},
    "bomb":      {"name": "Anh Đào Nổ",     "kind": "bomb",     "cost": 150, "hp": 50,  "cooldown": 25, "damage": 400, "radius": 1.5, "fuse": 1},
    "ice":       {"name": "Việt Quất Băng", "kind": "shooter",  "cost": 175, "hp": 80,  "cooldown": 6,  "damage": 20, "every": 1.5, "shots": 1, "slow": 0.5, "slowTime": 4},
    "mine":      {"name": "Khoai Bẫy",      "kind": "mine",     "cost": 25,  "hp": 50,  "cooldown": 18, "damage": 500, "arm": 8},
    "repeater":  {"name": "Xương Rồng Đôi", "kind": "shooter",  "cost": 200, "hp": 80,  "cooldown": 7,  "damage": 20, "every": 1.5, "shots": 2},
    "chili":     {"name": "Ớt Lửa",         "kind": "lane",     "cost": 125, "hp": 50,  "cooldown": 25, "damage": 400, "fuse": 0.8}
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
const MON_ICON = { worm: '🐛', beetle: '🪲', locust: '🦗', rat: '🐀', snail: '🐌', boss: '🦂' };
const PLANT_ICON = { sunflower: '🌻', shooter: '🥦', wall: '🥥', bomb: '🍒', ice: '🫐', mine: '🥔', repeater: '🌵', chili: '🌶️' };
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
  <h4>Nguồn cấu hình</h4>1) Cấu hình giáo viên gán trên máy chủ (<code>window.EG_CONFIG.plantvsanimal</code>) → 2) bản sửa trong máy học sinh → 3) mặc định trong file này.
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
const THEME_ICON = { day: '☀️', dusk: '🌇', night: '🌙' };
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
      <span>\${[...mons].map(m => (CFG.monsters[m] || {}).icon || '').join('')}</span><small>\${THEME_ICON[L.theme] || '☀️'} \${(L.plants || []).length} loại cây</small></div>
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
  night: { c1: '#2f6b4a', c2: '#37785a', base: ['#1d4433', '#12301f'], wall: '#8f8a96', tuft: 'rgba(10,50,30,.5)' }
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
  emoji(m.d.icon, x + xo, y, size, o);
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
  } else if (th === 'dusk') { ctx.fillStyle = 'rgba(255,120,50,.12)'; ctx.fillRect(0, 0, W, H); }
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
`,w=n(),T={math:o,memory:s,scramble:c,quiz:l,snake:u,flap:d,g2048:f,chem:p,clock:m,pattern:h,simon:g,anagram:_,stroop:v,sumseq:y,compare:b,riddle:x,shapecount:S,plantvsanimal:C};function E({gameId:e}){let t=(0,a.useRef)(null),n=(0,a.useMemo)(()=>i(e),[e]),o=T[e];return(0,a.useEffect)(()=>{let e=e=>{e.source===t.current?.contentWindow&&e.data?.type===`quit`&&r(`/`)};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[]),!n||!o?(0,w.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-paper`,children:(0,w.jsxs)(`div`,{className:`text-center`,children:[(0,w.jsx)(`div`,{className:`text-5xl`,children:`🤔`}),(0,w.jsx)(`p`,{className:`mt-3 font-display text-lg font-bold text-ink`,children:`Không tìm thấy game`}),(0,w.jsxs)(`p`,{className:`mt-1 text-sm text-slate-500`,children:[`id: `,String(e||`(rỗng)`)]}),(0,w.jsx)(`button`,{onClick:()=>r(`/`),className:`mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600 shadow-sm hover:bg-slate-200`,children:`← Về trang chủ`})]})}):(0,w.jsx)(`div`,{className:`fixed inset-0 bg-[#0c2a30]`,children:(0,w.jsx)(`iframe`,{ref:t,title:n.name,srcDoc:o,sandbox:`allow-scripts allow-same-origin`,className:`h-full w-full border-0`})})}export{E as default};