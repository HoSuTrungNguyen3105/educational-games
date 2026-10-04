
/**
 * game-core.js — Thư viện dùng chung cho 3 bộ mini-game
 *
 * Bao gồm:
 *   - Tiện ích ($, rnd, shuffle)
 *   - Trạng thái người chơi (S)
 *   - Âm thanh (soundOn, beep, sfx)
 *   - Bộ hẹn giờ & phím (T, onKey, cleanup)
 *   - Toast thông báo
 *   - Huy hiệu (BADGES, checkBadges)
 *   - XP & cấp (lvl, renderMe)
 *   - Sinh câu hỏi toán (genMath, makeOpts)
 *   - Canvas helper (fitCanvas)
 *   - Trắc nghiệm dùng chung (runMC)
 *   - finish() — xử lý kết thúc ván + gọi API
 *   - renderHub(), openGame() — để từng file override sau khi include
 *
 * Cách dùng trong mỗi HTML:
 *   <script src="game-core.js"><\/script>
 *   <script>
 *     // Khai báo GAMES riêng của file
 *     const GAMES = [...];
 *     // Gọi khởi động
 *     initCore({ games: GAMES, hubTitle: '...', hubDesc: '...' });
 *   <\/script>
 */

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
      setTimeout(() => toast(`${b.i} Huy hiệu mới: ${b.n}`), 900);
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
    if (rnd(0, 1)) { a = rnd(2, 20); b = rnd(1, 20); text = `${a} + ${b}`; ans = a + b; }
    else           { a = rnd(5, 25); b = rnd(1, a);  text = `${a} − ${b}`; ans = a - b; }
  } else if (level === 1) {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(2, 10); b = rnd(2, 10); text = `${a} × ${b}`; ans = a * b; }
    else if (t === 1) { a = rnd(20, 99); b = rnd(10, 60); text = `${a} + ${b}`; ans = a + b; }
    else if (t === 2) { a = rnd(40, 99); b = rnd(10, a);  text = `${a} − ${b}`; ans = a - b; }
    else              { b = rnd(2, 9); ans = rnd(2, 10); a = b * ans; text = `${a} ÷ ${b}`; }
  } else {
    const t = rnd(0, 3);
    if      (t === 0) { a = rnd(6, 15);  b = rnd(3, 12); text = `${a} × ${b}`; ans = a * b; }
    else if (t === 1) { b = rnd(3, 12); ans = rnd(4, 15); a = b * ans; text = `${a} ÷ ${b}`; }
    else if (t === 2) { a = rnd(2, 20); b = rnd(2, 9); c = rnd(2, 9); text = `${a} + ${b} × ${c}`; ans = a + b * c; }
    else {
      a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 20);
      text = `${a} × ${b} − ${c}`; ans = a * b - c;
      if (ans < 0) { text = `${a} × ${b} + ${c}`; ans = a * b + c; }
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
    root.innerHTML = `<div class="hud"><span>Câu <b>${i + 1}/${cfg.count}</b></span><span>⭐ <b>${score}</b></span><span>🔥 ${streak}</span></div>
      <div class="tbar"><i id="tb"></i></div>
      <div class="qbox">${cur.html}</div>
      <div class="opts" id="o">${cur.opts.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join('')}</div>
      <div id="ex"></div><div class="row" id="nx"></div>`;
    if (cur.after) cur.after();
  }
  function answer(k) {
    if (done) return; done = true;
    const btns = [...root.querySelectorAll('.opt')],
          ci   = cur.opts.findIndex(o => String(o) === String(cur.ans));
    btns[ci].classList.add('ok');
    if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
    else          { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
    $('#ex').innerHTML = `<div class="explain">💡 ${k === -1 ? 'Hết giờ! ' : ''}${cur.exp}</div>`;
    $('#nx').innerHTML = `<button class="btn" data-next="1">${i < cfg.count - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>`;
  }
  root.onclick = e => {
    const o = e.target.closest('.opt'), n = e.target.closest('[data-next]');
    if (o) answer(+o.dataset.k);
    else if (n) {
      i++;
      if (i < cfg.count) show();
      else {
        cfg.onEnd && cfg.onEnd(right);
        finish({ id: cfg.id, score, xp: Math.round(score / 4), lines: [`Đúng ${right}/${cfg.count} câu`], replay: cfg.replay });
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

/* ============ finish() — kết thúc ván & gọi API ============ */
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

  $('#modal').innerHTML = `<div class="panel result">
    <h2>${up ? 'Lên cấp ' + lvl() + '!' : 'Hoàn thành!'}</h2>
    <div class="big">${score}</div>
    <div class="stats">
      ${isBest ? '<span>🏆 Kỷ lục mới</span>' : ''}
      ${lines.map(l => `<span>${l}</span>`).join('')}
      <span>+${xp} XP</span>
    </div>
    <div class="row">
      <button class="btn" id="again">Chơi lại</button>
      <button class="btn alt ghost" id="home">Về sảnh</button>
    </div>
  </div>`;
  $('#modal').classList.add('on');

  $('#again').onclick = () => { $('#modal').classList.remove('on'); openGame(id); };
  $('#home').onclick  = () => { $('#modal').classList.remove('on'); renderHub(); };

  // Gửi kết quả lên server (không block UI)
  GameAPI.submitResult({ game: id, score, details }).then(serverData => {
    if (!serverData) return;
    // Cập nhật lại từ server (XP, cấp, huy hiệu)
    if (typeof serverData.totalXp === 'number') S.xp = serverData.totalXp;
    renderMe();
    _saveState();
    if (Array.isArray(serverData.newBadges)) {
      serverData.newBadges.forEach(b => {
        S.unlocked.add(b.id);
        setTimeout(() => toast(`${b.icon} Huy hiệu mới: ${b.name}`), 900);
      });
      _saveState();
    }
  }).catch(() => { /* lỗi mạng đã được xử lý trong api.js */ });
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
      return `<button class="tile" data-g="${g.id}" style="--c:${g.c}">
        <span class="orb">${g.icon}</span>
        <h3>${g.name}</h3>
        <p>${g.desc}</p>
        <span class="meta"><span class="tag">${g.tag}</span><span>${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
      </button>`;
    }
    return `<button class="tile" data-g="${g.id}" style="background:${g.color}">
      <span class="ic">${g.icon}</span>
      <h3>${g.name}</h3>
      <p>${g.desc}</p>
      <span class="meta"><span class="tag">${g.tag}</span><span>${S.best[g.id] ? 'Kỷ lục ' + S.best[g.id] : 'Chưa chơi'}</span></span>
    </button>`;
  }).join('');

  const badgesHtml = BADGES.map(b =>
    `<span class="bd ${S.unlocked.has(b.id) ? '' : 'off'}">${b.i} ${b.n}</span>`
  ).join('');

  $('#hub').innerHTML = `
    <div class="hero">
      <h2 id="hub-title"></h2>
      <p id="hub-desc"></p>
    </div>
    <div class="grid">${grid}</div>
    ${_showLeaderboardBtn()}
    <div class="badges"><b>Huy hiệu</b>${badgesHtml}</div>`;

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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
}

/* ============ Bảng xếp hạng ============ */
function _showLeaderboardBtn() {
  return `<div style="margin:18px 0 0;text-align:center">
    <button class="btn ghost" id="lb-btn" style="font-size:14px">🏆 Bảng xếp hạng</button>
  </div>`;
}

function _openLeaderboard() {
  const modal = $('#modal');
  modal.innerHTML = `<div class="panel result" style="max-width:520px;text-align:left">
    <h2 style="margin-bottom:12px">🏆 Bảng xếp hạng</h2>
    <div id="lb-tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>
    <div id="lb-body" style="font-size:14px">Đang tải...</div>
    <div class="row"><button class="btn alt ghost" id="lb-close">Đóng</button></div>
  </div>`;
  modal.classList.add('on');
  $('#lb-close').onclick = () => modal.classList.remove('on');

  const tabs = [{ label: 'XP tổng', key: 'xp' }, ..._GAMES.map(g => ({ label: g.name.split(' ').slice(0, 2).join(' '), key: g.id }))];
  let activeKey = 'xp';

  function renderTabs() {
    $('#lb-tabs').innerHTML = tabs.map(t =>
      `<button class="btn ${t.key === activeKey ? '' : 'ghost'}" style="font-size:12px;padding:6px 12px" data-lb="${t.key}">${t.label}</button>`
    ).join('');
  }

  async function loadTab(key) {
    activeKey = key; renderTabs();
    $('#lb-body').innerHTML = 'Đang tải...';
    try {
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          `<tr><td>${x.rank ?? i + 1}</td><td>${x.displayName}</td><td>${x.xp} XP</td><td>Cấp ${x.level}</td></tr>`
        );
      } else {
        const r = await GameAPI._get(`/api/mini/leaderboard/${key}?limit=20`);
        rows = (r.data || []).map((x, i) =>
          `<tr><td>${x.rank ?? i + 1}</td><td>${x.displayName}</td><td>${x.best} điểm</td><td></td></tr>`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? `<table style="width:100%;border-collapse:collapse">${rows.join('')}</table>`
        : '<p style="opacity:.6">Chưa có dữ liệu.</p>';
    } catch {
      $('#lb-body').innerHTML = '<p style="opacity:.6">Không thể tải bảng xếp hạng.</p>';
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

  // Tải hồ sơ từ server rồi render sảnh
  GameAPI.loadProfile().then(() => renderHub()).catch(() => renderHub());
}
