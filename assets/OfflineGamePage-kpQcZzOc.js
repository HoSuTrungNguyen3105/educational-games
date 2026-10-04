import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{t as r}from"./userAuth.store-COqc4sg8.js";import{Ct as i,t as a}from"./index-DhAsDNL1.js";import o from"./HtmlGameLoader-35yNEaEo.js";var s=e(t(),1),c=`<!DOCTYPE html>
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: math — nội dung riêng của file này -->
    <script>
// src/games/src/math.js — Đua Toán (Toán)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    function speak(t) {
      if (!soundOn || !('speechSynthesis' in window)) return;
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85; speechSynthesis.speak(u) } catch (e) { }
    }

    /* ============ Dữ liệu từ vựng & quiz ============ */

    function mathGame(root) {
      root.innerHTML = \`<div class="panel center"><h2>Chọn độ khó</h2>
    <p class="hint">60 giây. Đúng liên tiếp để nhân điểm và được cộng thêm giờ.</p>
    <div class="row" style="flex-direction:column">
      <button class="btn" data-l="0">Dễ · Cộng trừ trong 25</button>
      <button class="btn sky" data-l="1">Vừa · Nhân chia bảng cửu chương</button>
      <button class="btn" style="background:var(--tomato);color:#fff" data-l="2">Khó · Phép tính nhiều bước</button>
    </div></div>\`;
      root.onclick = e => { const b = e.target.closest('[data-l]'); if (b) run(+b.dataset.l) };
      function run(level) {
        root.onclick = null;
        let score = 0, combo = 0, maxCombo = 0, right = 0, total = 0, time = 60, q, lock = false;
        root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="cb">🔥 x1</span><span>⏱ <b id="tm">60</b>s</span></div>
      <div class="timebar"><i id="tb"></i></div><div class="qbox" id="q"></div><div class="opts" id="o"></div>\`;
        const next = () => {
          q = genMath(level); const opts = makeOpts(q.ans, 4);
          $('#q').textContent = q.text + ' = ?'; $('#q').classList.remove('pop'); void $('#q').offsetWidth; $('#q').classList.add('pop');
          $('#o').innerHTML = opts.map(v => \`<button class="opt" data-v="\${v}">\${v}</button>\`).join('');
          lock = false;
        };
        const mult = () => Math.min(4, 1 + Math.floor(combo / 5));
        const hud = () => { $('#sc').textContent = score; $('#cb').textContent = \`🔥 x\${mult()} (\${combo})\`; $('#tm').textContent = Math.ceil(time); $('#tb').style.width = Math.min(100, time / 60 * 100) + '%' };
        root.onclick = e => {
          const b = e.target.closest('.opt'); if (!b || lock) return; lock = true; total++;
          if (+b.dataset.v === q.ans) {
            right++; combo++; maxCombo = Math.max(maxCombo, combo); score += 10 * mult(); sfx.ok(); b.classList.add('ok');
            if (combo % 5 === 0) { time = Math.min(75, time + 2); toast('⏱ +2 giây! Chuỗi ' + combo) }
            if (combo >= 10) S.flags.combo10 = true;
          } else {
            combo = 0; time = Math.max(0, time - 2); sfx.bad(); b.classList.add('bad');
            [...root.querySelectorAll('.opt')].find(x => +x.dataset.v === q.ans).classList.add('ok');
          }
          hud(); T.set(next, combo ? 250 : 600);
        };
        T.int(() => {
          time -= .1; hud();
          if (time <= 0) {
            T.clear();
            finish({
              id: 'math', score, xp: Math.round(score / 8) + (right ? 5 : 0),
              lines: [\`Đúng \${right}/\${total} câu\`, \`Chuỗi dài nhất \${maxCombo}\`],
              replay: mathGame,
              details: { level, right, total, maxCombo }
            });
          }
        }, 100);
        next(); hud();
      }
    }

    /* ============ GAME 2: LẬT THẺ ANH – VIỆT ============ */
startSingleGame({
  id: 'math',
  name: 'Đua Toán',
  icon: '➕',
  storageKey: 'offline_math',
  mount: mathGame,
  badges: [
      { id: 'f10', n: '10 câu đúng', i: '✅', ok: () => S.games >= 1 },
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: memory — nội dung riêng của file này -->
    <script>
// src/games/src/memory.js — Lật Thẻ Anh – Việt (Tiếng Anh)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    function speak(t) {
      if (!soundOn || !('speechSynthesis' in window)) return;
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85; speechSynthesis.speak(u) } catch (e) { }
    }

    /* ============ Dữ liệu từ vựng & quiz ============ */

    const WORDS = [
      ['apple', 'quả táo'], ['book', 'quyển sách'], ['teacher', 'giáo viên'], ['school', 'trường học'], ['friend', 'bạn bè'],
      ['water', 'nước'], ['happy', 'vui vẻ'], ['family', 'gia đình'], ['house', 'ngôi nhà'], ['cat', 'con mèo'],
      ['dog', 'con chó'], ['sun', 'mặt trời'], ['moon', 'mặt trăng'], ['tree', 'cái cây'], ['flower', 'bông hoa'],
      ['river', 'dòng sông'], ['mountain', 'ngọn núi'], ['computer', 'máy tính'], ['bicycle', 'xe đạp'], ['breakfast', 'bữa sáng'],
      ['rainbow', 'cầu vồng'], ['elephant', 'con voi'], ['library', 'thư viện'], ['umbrella', 'cái ô'], ['window', 'cửa sổ'],
      ['chicken', 'con gà'], ['orange', 'quả cam'], ['yellow', 'màu vàng'], ['garden', 'khu vườn'], ['kitchen', 'nhà bếp'],
      ['pencil', 'bút chì'], ['bridge', 'cây cầu'], ['planet', 'hành tinh'], ['butterfly', 'con bướm'], ['holiday', 'kỳ nghỉ']
    ].map(([en, vi]) => ({ en, vi }));


    function memoryGame(root) {
      const pairs = shuffle(WORDS).slice(0, 8);
      const cards = shuffle(pairs.flatMap((w, i) => [{ p: i, t: w.en, l: 'en' }, { p: i, t: w.vi, l: 'vi' }]));
      let open = [], lock = false, moves = 0, matched = 0, secs = 0;
      root.innerHTML = \`<div class="hud"><span>👣 <b id="mv">0</b> lượt</span><span>🧩 <b id="pr">0</b>/8</span><span>⏱ <b id="tm">0</b>s</span></div>
    <div class="mem" id="mem">\${cards.map((c, i) => \`<button class="mc" data-i="\${i}" aria-label="Thẻ \${i + 1}"><div class="in"><div class="f">❓</div><div class="b \${c.l}">\${c.t}</div></div></button>\`).join('')}</div>
    <p class="hint">Tìm cặp từ tiếng Anh và nghĩa tiếng Việt. Chạm thẻ tiếng Anh để nghe phát âm.</p>\`;
      const els = [...root.querySelectorAll('.mc')];
      T.int(() => { secs++; $('#tm').textContent = secs }, 1000);
      root.onclick = e => {
        const el = e.target.closest('.mc'); if (!el || lock) return;
        const i = +el.dataset.i;
        if (el.classList.contains('flip') || el.classList.contains('done')) return;
        el.classList.add('flip'); sfx.tick();
        if (cards[i].l === 'en') speak(cards[i].t);
        open.push(i);
        if (open.length === 2) {
          moves++; $('#mv').textContent = moves; lock = true;
          const [a, b] = open;
          if (cards[a].p === cards[b].p && cards[a].l !== cards[b].l) {
            T.set(() => {
              els[a].classList.add('done'); els[b].classList.add('done'); matched++; $('#pr').textContent = matched; sfx.ok(); open = []; lock = false;
              if (matched === 8) {
                const score = Math.max(20, 300 - moves * 8 - secs);
                if (moves <= 11) S.flags.memGold = true;
                T.clear();
                finish({
                  id: 'memory', score, xp: Math.round(score / 5) + 10,
                  lines: [\`\${moves} lượt lật\`, \`\${secs} giây\`],
                  replay: memoryGame,
                  details: { moves, secs }
                });
              }
            }, 450);
          } else {
            T.set(() => { els[a].classList.remove('flip'); els[b].classList.remove('flip'); open = []; lock = false }, 900);
          }
        }
      };
    }

    /* ============ GAME 3: XẾP CHỮ ============ */
startSingleGame({
  id: 'memory',
  name: 'Lật Thẻ Anh – Việt',
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: scramble — nội dung riêng của file này -->
    <script>
// src/games/src/scramble.js — Xếp Chữ (Tiếng Anh)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    function speak(t) {
      if (!soundOn || !('speechSynthesis' in window)) return;
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85; speechSynthesis.speak(u) } catch (e) { }
    }

    /* ============ Dữ liệu từ vựng & quiz ============ */

    const WORDS = [
      ['apple', 'quả táo'], ['book', 'quyển sách'], ['teacher', 'giáo viên'], ['school', 'trường học'], ['friend', 'bạn bè'],
      ['water', 'nước'], ['happy', 'vui vẻ'], ['family', 'gia đình'], ['house', 'ngôi nhà'], ['cat', 'con mèo'],
      ['dog', 'con chó'], ['sun', 'mặt trời'], ['moon', 'mặt trăng'], ['tree', 'cái cây'], ['flower', 'bông hoa'],
      ['river', 'dòng sông'], ['mountain', 'ngọn núi'], ['computer', 'máy tính'], ['bicycle', 'xe đạp'], ['breakfast', 'bữa sáng'],
      ['rainbow', 'cầu vồng'], ['elephant', 'con voi'], ['library', 'thư viện'], ['umbrella', 'cái ô'], ['window', 'cửa sổ'],
      ['chicken', 'con gà'], ['orange', 'quả cam'], ['yellow', 'màu vàng'], ['garden', 'khu vườn'], ['kitchen', 'nhà bếp'],
      ['pencil', 'bút chì'], ['bridge', 'cây cầu'], ['planet', 'hành tinh'], ['butterfly', 'con bướm'], ['holiday', 'kỳ nghỉ']
    ].map(([en, vi]) => ({ en, vi }));


    function scrambleGame(root) {
      const words = shuffle(WORDS).slice(0, 8);
      let i = 0, score = 0, solved = 0, w, tiles, ans, hintsWord = 0, busy = false;
      function load() {
        w = words[i]; const L = [...w.en.toUpperCase()];
        let t; do { t = shuffle(L) } while (t.join('') === L.join(''));
        tiles = t.map(ch => ({ ch, used: false })); ans = []; hintsWord = 0; busy = false; render();
      }
      function render() {
        root.innerHTML = \`<div class="hud"><span>Từ <b>\${i + 1}/\${words.length}</b></span><span>⭐ <b>\${score}</b></span></div>
      <div class="qbox txt"><div>Nghĩa tiếng Việt<small></small><span style="font-family:var(--head);font-size:1.5em;font-weight:800">\${w.vi}</span><small>\${w.en.length} chữ cái. Sắp xếp thành từ tiếng Anh.</small></div></div>
      <div class="slots" id="slots">\${[...w.en].map((_, k) => { const t = ans[k] !== undefined ? tiles[ans[k]].ch : ''; return \`<button class="slot \${t ? 'fill' : ''}" data-s="\${k}">\${t}</button>\` }).join('')}</div>
      <div class="tiles">\${tiles.map((t, k) => \`<button class="tl" data-t="\${k}" \${t.used ? 'disabled' : ''}>\${t.ch}</button>\`).join('')}</div>
      <div class="row"><button class="btn alt" data-a="hint">💡 Gợi ý (−4 điểm)</button><button class="btn alt" data-a="skip">Bỏ qua</button></div>\`;
      }
      function add(k) {
        if (busy || tiles[k].used || ans.length >= w.en.length) return;
        tiles[k].used = true; ans.push(k); sfx.tick(); render();
        if (ans.length === w.en.length) check();
      }
      function check() {
        const guess = ans.map(k => tiles[k].ch).join('').toLowerCase();
        busy = true;
        if (guess === w.en) {
          const pts = Math.max(5, 15 - hintsWord * 4); score += pts; solved++; sfx.ok(); speak(w.en);
          $('#slots').classList.add('win');
          T.set(() => { i++; i < words.length ? load() : end() }, 1100);
        } else {
          sfx.bad(); $('#slots').classList.add('err');
          T.set(() => { tiles.forEach(t => t.used = false); ans = []; busy = false; render() }, 450);
        }
      }
      function hint() {
        if (busy) return;
        const target = [...w.en.toUpperCase()];
        let ok = ans.every((k, n) => tiles[k].ch === target[n]);
        if (!ok) { tiles.forEach(t => t.used = false); ans = [] }
        const need = target[ans.length];
        const k = tiles.findIndex(t => !t.used && t.ch === need);
        if (k < 0) return;
        hintsWord++; score = Math.max(0, score - 4); add(k);
      }
      function end() {
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
        else if (s && !busy) { const k = +s.dataset.s; if (ans[k] !== undefined) { const idx = ans.splice(k, 1)[0]; tiles[idx].used = false; render() } }
        else if (a) {
          if (a.dataset.a === 'hint') hint();
          else if (!busy) { i++; i < words.length ? load() : end() }
        }
      };
      onKey = e => {
        if (busy) return;
        if (e.key === 'Backspace' && ans.length) { const idx = ans.pop(); tiles[idx].used = false; render(); return }
        if (/^[a-zA-Z]$/.test(e.key)) { const k = tiles.findIndex(t => !t.used && t.ch === e.key.toUpperCase()); if (k >= 0) add(k) }
      };
      load();
    }

    /* ============ GAME 4: ĐỐ VUI KHOA HỌC ============ */
startSingleGame({
  id: 'scramble',
  name: 'Xếp Chữ',
  icon: '🔤',
  storageKey: 'offline_scramble',
  mount: scrambleGame,
  badges: [
      { id: 'word10', n: 'Xếp 10 từ', i: '🔤', ok: () => !!S.flags.w10 },
  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: quiz — nội dung riêng của file này -->
    <script>
// src/games/src/quiz.js — Đố Vui Khoa Học (Khoa học)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    const QUIZ = [
      { q: 'Hành tinh nào gần Mặt Trời nhất?', o: ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa'], e: 'Sao Thủy cách Mặt Trời trung bình khoảng 58 triệu km.' },
      { q: 'Nước tinh khiết sôi ở bao nhiêu độ C (ở mực nước biển)?', o: ['100°C', '90°C', '80°C', '120°C'], e: 'Ở áp suất khí quyển bình thường, nước sôi ở 100°C.' },
      { q: 'Cơ quan nào bơm máu đi khắp cơ thể?', o: ['Tim', 'Phổi', 'Gan', 'Thận'], e: 'Tim co bóp liên tục để đẩy máu đến mọi bộ phận.' },
      { q: 'Khí nào cây xanh hấp thụ để quang hợp?', o: ['Khí cacbonic (CO₂)', 'Khí oxi (O₂)', 'Khí nitơ (N₂)', 'Khí hiđro (H₂)'], e: 'Cây dùng CO₂, nước và ánh sáng để tạo chất dinh dưỡng và thải ra oxi.' },
      { q: 'Đại dương nào lớn nhất thế giới?', o: ['Thái Bình Dương', 'Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'], e: 'Thái Bình Dương chiếm khoảng một phần ba diện tích bề mặt Trái Đất.' },
      { q: 'Trái Đất quay quanh Mặt Trời một vòng mất khoảng bao lâu?', o: ['1 năm', '1 tháng', '1 tuần', '1 ngày'], e: 'Một vòng quanh Mặt Trời khoảng 365 ngày, tức là một năm.' },
      { q: 'Động vật nào sau đây là động vật có vú sống dưới nước?', o: ['Cá voi', 'Cá mập', 'Cá ngừ', 'Cá chép'], e: 'Cá voi thở bằng phổi và nuôi con bằng sữa nên là động vật có vú.' },
      { q: 'Đỉnh núi nào cao nhất Việt Nam?', o: ['Fansipan', 'Bà Nà', 'Tam Đảo', 'Yên Tử'], e: 'Fansipan cao khoảng 3.143 m, được gọi là "nóc nhà Đông Dương".' },
      { q: 'Kim loại nào ở thể lỏng ở nhiệt độ phòng?', o: ['Thủy ngân', 'Sắt', 'Đồng', 'Nhôm'], e: 'Thủy ngân nóng chảy ở khoảng -39°C nên luôn lỏng ở nhiệt độ thường.' },
      { q: 'Di sản thiên nhiên thế giới nào nằm ở tỉnh Quảng Ninh?', o: ['Vịnh Hạ Long', 'Phong Nha - Kẻ Bàng', 'Vịnh Nha Trang', 'Đảo Phú Quốc'], e: 'Vịnh Hạ Long nổi tiếng với hàng nghìn đảo đá vôi.' },
      { q: 'Số nguyên tố nhỏ nhất là số nào?', o: ['2', '1', '3', '0'], e: 'Số nguyên tố có đúng hai ước là 1 và chính nó. Số 2 là số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất.' },
      { q: 'Ánh sáng hay âm thanh truyền nhanh hơn?', o: ['Ánh sáng', 'Âm thanh', 'Bằng nhau', 'Tùy ngày'], e: 'Vì vậy ta thấy tia chớp trước rồi mới nghe tiếng sấm.' },
      { q: 'Bộ phận nào của cây hút nước và muối khoáng từ đất?', o: ['Rễ', 'Lá', 'Thân', 'Hoa'], e: 'Rễ có nhiều lông hút giúp cây hút nước và muối khoáng.' },
      { q: 'Công thức hóa học của nước là gì?', o: ['H₂O', 'CO₂', 'O₂', 'NaCl'], e: 'Mỗi phân tử nước gồm 2 nguyên tử hiđro và 1 nguyên tử oxi.' },
      { q: 'Hành tinh nào được gọi là "hành tinh đỏ"?', o: ['Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương'], e: 'Bề mặt Sao Hỏa chứa nhiều oxit sắt nên có màu đỏ gỉ.' },
      { q: 'Ai là tác giả của Truyện Kiều?', o: ['Nguyễn Du', 'Nguyễn Trãi', 'Hồ Xuân Hương', 'Nguyễn Đình Chiểu'], e: 'Nguyễn Du (1765-1820) là đại thi hào của dân tộc.' },
      { q: 'Xương nào dài nhất trong cơ thể người?', o: ['Xương đùi', 'Xương sườn', 'Xương cánh tay', 'Xương sống'], e: 'Xương đùi vừa dài vừa chắc, chịu sức nặng của cả cơ thể.' },
      { q: 'Loài chim nào không biết bay và sống ở vùng cực Nam?', o: ['Chim cánh cụt', 'Đà điểu', 'Chim én', 'Chim bồ câu'], e: 'Chim cánh cụt dùng đôi cánh như mái chèo để bơi rất giỏi.' },
      { q: 'Tổng ba góc trong một tam giác bằng bao nhiêu độ?', o: ['180°', '90°', '360°', '270°'], e: 'Với mọi tam giác, tổng ba góc luôn bằng 180°.' },
      { q: 'Cầu vồng thường được nói là có mấy màu?', o: ['7 màu', '5 màu', '6 màu', '9 màu'], e: 'Đỏ, cam, vàng, lục, lam, chàm, tím.' },
      { q: 'Đơn vị đo lực trong hệ SI là gì?', o: ['Niutơn (N)', 'Kilôgam (kg)', 'Mét (m)', 'Giây (s)'], e: 'Đơn vị được đặt theo tên nhà khoa học Isaac Newton.' },
      { q: 'Mặt Trăng là gì của Trái Đất?', o: ['Vệ tinh tự nhiên', 'Một ngôi sao', 'Một hành tinh', 'Một sao chổi'], e: 'Mặt Trăng quay quanh Trái Đất và phản chiếu ánh sáng Mặt Trời.' }
    ];

    /* ============ GAME 1: ĐUA TOÁN ============ */

    function quizGame(root) {
      const qs = shuffle(QUIZ).slice(0, 10).map(q => ({ ...q, opts: shuffle(q.o.map((t, k) => ({ t, c: k === 0 }))) }));
      let i = 0, score = 0, right = 0, streak = 0, fifty = true, time = 15, done = false;
      function show() {
        const q = qs[i]; done = false; time = 15;
        root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/10</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>
      <div class="timebar"><i id="tb"></i></div>
      <div class="qbox txt">\${q.q}</div>
      <div class="opts one" id="o">\${q.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o.t}</button>\`).join('')}</div>
      <div class="row" id="ll"><button class="btn alt" data-ll="1" \${fifty ? '' : 'disabled'}>✂️ 50:50</button></div>
      <div id="ex"></div>\`;
      }
      function answer(k) {
        if (done) return; done = true;
        const q = qs[i], btns = [...root.querySelectorAll('.opt')];
        btns.forEach(b => b.classList.remove('gone'));
        const ci = q.opts.findIndex(o => o.c);
        btns[ci].classList.add('ok');
        if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
        else { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
        $('#ll').innerHTML = \`<button class="btn" data-next="1">\${i < 9 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;
        $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${q.e}</div>\`;
      }
      root.onclick = e => {
        const o = e.target.closest('.opt'), l = e.target.closest('[data-ll]'), n = e.target.closest('[data-next]');
        if (o) answer(+o.dataset.k);
        else if (l && fifty && !done) {
          fifty = false; const q = qs[i];
          const wrong = shuffle(q.opts.map((x, k) => k).filter(k => !q.opts[k].c)).slice(0, 2);
          const btns = [...root.querySelectorAll('.opt')]; wrong.forEach(k => btns[k].classList.add('gone'));
          l.disabled = true;
        } else if (n) {
          i++;
          if (i < 10) show();
          else {
            if (right === 10) S.flags.perfect = true;
            T.clear();
            finish({
              id: 'quiz', score, xp: Math.round(score / 4),
              lines: [\`Đúng \${right}/10 câu\`],
              replay: quizGame,
              details: { right }
            });
          }
        }
      };
      T.int(() => {
        if (done) return;
        time -= .1; const tb = $('#tb'); if (tb) tb.style.width = Math.max(0, time / 15 * 100) + '%';
        if (time <= 0) answer(-1);
      }, 100);
      show();
    }

    /* ============ GAME 5: RẮN SĂN ĐÁP ÁN ============ */
startSingleGame({
  id: 'quiz',
  name: 'Đố Vui Khoa Học',
  icon: '🔬',
  storageKey: 'offline_quiz',
  mount: quizGame,
  badges: [
      { id: 'perfect', n: 'Trả lời 10/10', i: '🎯', ok: () => !!S.flags.perfect },
  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: snake — nội dung riêng của file này -->
    <script>
// src/games/src/snake.js — Rắn Săn Đáp Án (Toán · Phản xạ)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    function snakeGame(root) {
      const N = 15;
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span>Dài <b id="ln">3</b></span></div>
    <div class="qbox" id="q" style="min-height:74px;font-size:clamp(28px,7vw,44px)"></div>
    <canvas id="cv"></canvas>
    <div class="dpad"><button class="u" data-d="u">▲</button><button class="l" data-d="l">◀</button><button class="d" data-d="d">▼</button><button class="r" data-d="r">▶</button></div>
    <p class="hint">Điều khiển rắn ăn đáp án đúng. Vuốt, dùng phím mũi tên hoặc bấm nút.</p>\`;
      const cv = $('#cv'), ctx = cv.getContext('2d');
      const size = Math.floor(Math.min(root.clientWidth - 8, 450) / N) * N;
      cv.width = cv.height = size; cv.style.width = cv.style.height = size + 'px';
      const cell = size / N;
      let snake, dir, queue, started, foods, q, score = 0, lives = 3, correct = 0, speed = 190;
      const level = () => correct < 6 ? 0 : 1;
      function reset() { snake = [{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }]; dir = { x: 1, y: 0 }; queue = []; started = false; placeFoods() }
      function free(x, y) { return !snake.some(s => s.x === x && s.y === y) && !(foods || []).some(f => f.x === x && f.y === y) }
      function newQ() {
        q = genMath(level());
        const opts = makeOpts(q.ans, 3);
        $('#q').textContent = q.text + ' = ?';
        return opts;
      }
      function placeFoods(opts) {
        if (!opts) { if (!q) opts = newQ(); else opts = foods ? foods.map(f => f.v) : newQ() }
        foods = [];
        opts.forEach(v => {
          let x, y, g = 0;
          do { x = rnd(0, N - 1); y = rnd(0, N - 1); g++ } while ((!free(x, y) || Math.abs(x - snake[0].x) + Math.abs(y - snake[0].y) < 4) && g < 300);
          foods.push({ x, y, v, c: v === q.ans });
        });
      }
      function setDir(dx, dy) {
        const last = queue.length ? queue[queue.length - 1] : dir;
        if ((last.x === -dx && last.y === -dy) || (last.x === dx && last.y === dy)) return;
        if (queue.length < 2) queue.push({ x: dx, y: dy });
        started = true;
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
      function loseLife() {
        lives--; sfx.bad(); $('#lv').textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';
        if (lives <= 0) {
          T.clear();
          finish({
            id: 'snake', score, xp: Math.round(score / 6),
            lines: [\`Ăn đúng \${correct} đáp án\`, \`Rắn dài \${snake.length}\`],
            replay: snakeGame,
            details: { correct, length: snake.length }
          });
          return false;
        }
        return true;
      }
      function tick() {
        if (started) {
          if (queue.length) dir = queue.shift();
          const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
          if (snake.some(s => s.x === h.x && s.y === h.y)) { if (!loseLife()) return; reset(); }
          else {
            snake.unshift(h);
            const fi = foods.findIndex(f => f.x === h.x && f.y === h.y);
            if (fi >= 0) {
              if (foods[fi].c) { score += 15; correct++; sfx.ok(); speed = Math.max(95, speed - 6); placeFoods(newQ()); }
              else { foods.splice(fi, 1); snake.pop(); if (!loseLife()) return; }
            } else snake.pop();
          }
          $('#sc').textContent = score; $('#ln').textContent = snake.length;
        }
        draw(); T.set(tick, speed);
      }
      function draw() {
        for (let y = 0; y < N; y++)for (let x = 0; x < N; x++) { ctx.fillStyle = (x + y) % 2 ? '#fff6d9' : '#fffdf3'; ctx.fillRect(x * cell, y * cell, cell, cell) }
        foods.forEach((f, k) => {
          const cx = f.x * cell + cell / 2, cy = f.y * cell + cell / 2;
          ctx.fillStyle = ['#4b9dff', '#a184ff', '#ff6b57'][k % 3]; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(cx, cy, cell * .46, 0, 7); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = \`800 \${cell * (String(f.v).length > 2 ? .42 : .52)}px Baloo 2,system-ui,sans-serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(f.v, cx, cy + 1);
        });
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
          ctx.fillText('Vuốt hoặc bấm mũi tên để bắt đầu', size / 2, size / 2);
        }
      }
      reset(); draw(); T.set(tick, speed);
    }

    /* ============ Khởi động ============ */
startSingleGame({
  id: 'snake',
  name: 'Rắn Săn Đáp Án',
  icon: '🐍',
  storageKey: 'offline_snake',
  mount: snakeGame,
  badges: [
      { id: 'snake20', n: 'Ăn 20 món', i: '🐍', ok: () => (S.flags.snakeEat || 0) >= 20 },
  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: flap — nội dung riêng của file này -->
    <script>
// src/games/src/flap.js — Chim Bay Qua Cổng (Toán · Phản xạ)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function flapGame(root) {
      const W = Math.min(root.clientWidth, 420), H = Math.round(W * 1.4), s = H / 560;
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span id="cb">🔥 0</span></div><canvas id="cv"></canvas>
    <p class="hint">Chạm màn hình (hoặc phím cách) để vỗ cánh. Chỉ bay qua khe có đáp án đúng!</p>\`;

      const cv = $('#cv'), ctx = fitCanvas(cv, W, H);
      const br = 15 * s, bx = W * .26, GY = H - 34 * s, TOP = 76 * s;

      // Cache gradient nền + DOM ref (trước đây tạo mới mỗi frame / mỗi lần hud)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#5ec2ff');
      bgGrad.addColorStop(1, '#d8f5ff');

      const $sc = $('#sc'), $lv = $('#lv'), $cb = $('#cb');

      let y = H / 2, vy = 0, ready = true, score = 0, lives = 3, combo = 0, best = 0, n = 0, q, wall, t = 0, flash = 0;

      const clouds = Array.from({ length: 5 }, () => ({
        x: Math.random() * W,
        y: Math.random() * (H * .6) + 70 * s,
        r: 20 + Math.random() * 24,
        v: 8 + Math.random() * 14
      }));

      const speed = () => (115 + Math.min(n, 15) * 4) * s;

      function hud() {
        $sc.textContent = score;
        $lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';
        $cb.textContent = '🔥 ' + combo;
      }

      function newWall() {
        const m = genMath(n < 4 ? 0 : n < 10 ? 1 : 2);
        q = { text: m.text + ' = ?', ans: m.ans };
        const opts = makeOpts(m.ans, 3), zone = (GY - TOP) / 3, gh = Math.min(zone * .68, 120 * s);
        wall = {
          x: W + 20, w: 64 * s, done: false,
          gaps: opts.map((v, k) => {
            const cy = TOP + zone * k + zone / 2 + (Math.random() - .5) * zone * .16;
            return { v, top: cy - gh / 2, bot: cy + gh / 2, c: v === m.ans };
          })
        };
      }

      function hurt() {
        lives--; combo = 0; sfx.bad(); flash = .3; hud();
        if (lives <= 0) {
          finish({
            id: 'flap', score, xp: Math.round(score / 6),
            lines: [\`Qua \${n} cổng đúng\`, \`Chuỗi tốt nhất \${best}\`],
            replay: flapGame, details: { gates: n, bestCombo: best }
          });
          return true;
        }
        ready = true; y = H / 2; vy = 0; newWall();
        return false;
      }

      function flap() {
        if (ready) ready = false;
        vy = -430 * s;
        sfx.flap();
      }

      cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
      onKey = e => {
        if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
      };

      newWall(); hud();

      T.loop(dt => {
        t += dt;
        for (const c of clouds) { c.x -= c.v * dt; if (c.x < -60) c.x = W + 60; }
        if (flash > 0) flash -= dt;

        if (ready) { y = H / 2 + Math.sin(t * 5) * 8 * s; draw(); return; }

        vy += 1500 * s * dt; y += vy * dt;
        if (y < br) { y = br; vy = Math.max(vy, 0); }
        wall.x -= speed() * dt;

        if (y + br > GY) { if (hurt()) return; draw(); return; }

        if (bx + br > wall.x && bx - br < wall.x + wall.w) {
          if (!wall.gaps.find(g => y - br > g.top && y + br < g.bot)) {
            if (hurt()) return; draw(); return;
          }
        }

        if (!wall.done && bx > wall.x + wall.w / 2) {
          wall.done = true;
          const g = wall.gaps.find(g => y > g.top && y < g.bot);
          if (g && g.c) {
            combo++; best = Math.max(best, combo); n++;
            score += 10 + Math.min(combo, 10) * 2;
            sfx.ok();
            if (n >= 10) S.flags.flap = true;
            hud();
          } else {
            if (hurt()) return; draw(); return;
          }
        }

        if (wall.x + wall.w < -10) newWall();
        draw();
      });

      function draw() {
        // nền (gradient đã cache)
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // mây
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        for (const c of clouds) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, 7);
          ctx.arc(c.x + c.r * .9, c.y + 4, c.r * .75, 0, 7);
          ctx.arc(c.x - c.r * .9, c.y + 6, c.r * .65, 0, 7);
          ctx.fill();
        }

        // cổng
        const segs = [];
        let prev = 0;
        for (const g of wall.gaps) { segs.push([prev, g.top]); prev = g.bot; }
        segs.push([prev, GY]);

        ctx.strokeStyle = '#14683b'; ctx.lineWidth = 3;
        for (const [a, b] of segs) {
          if (b - a <= 0) continue;
          ctx.fillStyle = '#2fbf71';
          ctx.beginPath(); ctx.roundRect(wall.x, a - 6, wall.w, b - a + 12, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(wall.x + 8, a, 7, b - a);
        }

        for (const g of wall.gaps) {
          const cy = (g.top + g.bot) / 2;
          ctx.fillStyle = 'rgba(12,42,48,.78)';
          ctx.beginPath(); ctx.roundRect(wall.x + 2, cy - 16 * s, wall.w - 4, 32 * s, 10); ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = \`800 \${Math.round(22 * s)}px Baloo 2,system-ui,sans-serif\`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(g.v, wall.x + wall.w / 2, cy + 1);
        }

        // đất
        ctx.fillStyle = '#d9a441'; ctx.fillRect(0, GY, W, H - GY);
        ctx.fillStyle = '#4caf50'; ctx.fillRect(0, GY, W, 8 * s);

        // chim
        ctx.save();
        ctx.translate(bx, y);
        ctx.rotate(Math.max(-.5, Math.min(.9, vy / (700 * s))));
        ctx.fillStyle = '#ffc233'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, br, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff9a3c';
        ctx.beginPath(); ctx.ellipse(-br * .3, br * .15 + Math.sin(t * 25) * 3, br * .55, br * .32, -.3, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(br * .35, -br * .3, br * .34, 0, 7); ctx.fill();
        ctx.fillStyle = '#0b2227';
        ctx.beginPath(); ctx.arc(br * .45, -br * .3, br * .15, 0, 7); ctx.fill();
        ctx.fillStyle = '#ff6f59';
        ctx.beginPath(); ctx.moveTo(br * .8, 0); ctx.lineTo(br * 1.5, br * .15); ctx.lineTo(br * .8, br * .4); ctx.fill();
        ctx.restore();

        // câu hỏi
        ctx.fillStyle = 'rgba(12,42,48,.88)';
        ctx.beginPath(); ctx.roundRect(12, 10, W - 24, 54 * s + 6, 16); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let fs = 34;
        do {
          ctx.font = \`800 \${fs}px Baloo 2,system-ui,sans-serif\`;
          fs--;
        } while (ctx.measureText(q.text).width > W - 60 && fs > 14);
        ctx.fillText(q.text, W / 2, 10 + (54 * s + 6) / 2);

        if (ready) {
          ctx.fillStyle = 'rgba(12,42,48,.7)';
          ctx.beginPath(); ctx.roundRect(W / 2 - 100, H / 2 + 40 * s, 200, 40, 20); ctx.fill();
          ctx.fillStyle = '#ffc233';
          ctx.font = '700 16px Lexend,system-ui,sans-serif';
          ctx.fillText('Chạm để bay', W / 2, H / 2 + 40 * s + 21);
        }
        if (flash > 0) {
          ctx.fillStyle = \`rgba(255,93,108,\${flash * 1.3})\`;
          ctx.fillRect(0, 0, W, H);
        }
      }
    }

    /* ============ GAME 2: 2048 LŨY THỪA ============ */
startSingleGame({
  id: 'flap',
  name: 'Chim Bay Qua Cổng',
  icon: '🐦',
  storageKey: 'offline_flap',
  mount: flapGame,
  badges: [
      { id: 'flap10', n: 'Qua 10 cổng', i: '🐦', ok: () => !!S.flags.flap },
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: g2048 — nội dung riêng của file này -->
    <script>
// src/games/src/g2048.js — 2048 Lũy Thừa (Logic)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function game2048(root) {
      let b = Array(16).fill(0), score = 0, over = false, newIdx = -1;

      const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
      const sup = k => String(k).split('').map(d => SUP[+d]).join('');
      const PAL = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#b5d8ff', '#8fb8ff', '#c3a6ff', '#ff9de2', '#ffd166', '#ffc233'];

      function add() {
        const empty = [];
        for (let i = 0; i < 16; i++) if (!b[i]) empty.push(i);
        if (!empty.length) return;
        const p = empty[rnd(0, empty.length - 1)];
        b[p] = Math.random() < .9 ? 2 : 4;
        newIdx = p;
      }

      function slide(line) {
        const a = [];
        for (const v of line) if (v) a.push(v);
        let gain = 0;
        for (let i = 0; i < a.length - 1; i++) {
          if (a[i] === a[i + 1]) { a[i] *= 2; gain += a[i]; a.splice(i + 1, 1); }
        }
        while (a.length < 4) a.push(0);
        return { a, gain };
      }

      function canMove() {
        if (b.includes(0)) return true;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const v = b[r * 4 + c];
            if ((c < 3 && b[r * 4 + c + 1] === v) || (r < 3 && b[(r + 1) * 4 + c] === v)) return true;
          }
        }
        return false;
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
        if (Math.max(...b) >= 256) S.flags.t256 = true;
        if (!canMove()) { over = true; T.set(end, 900); }
      }

      function end() {
        const mx = Math.max(...b);
        finish({
          id: 'g2048', score,
          xp: Math.min(80, Math.round(score / 25)) + Math.round(Math.log2(mx)) * 2,
          lines: [\`Ô lớn nhất \${mx} = 2\${sup(Math.round(Math.log2(mx)))}\`],
          replay: game2048, details: { maxTile: mx }
        });
      }

      function render() {
        $sc.textContent = score;
        let html = '';
        for (let i = 0; i < 16; i++) {
          const v = b[i];
          if (!v) { html += '<div class="t48"></div>'; continue; }
          const k = Math.round(Math.log2(v));
          const fs = v < 100 ? 34 : v < 1000 ? 28 : v < 10000 ? 22 : 18;
          html += \`<div class="t48 \${i === newIdx ? 'n' : ''}" style="background:\${PAL[Math.min(k - 1, PAL.length - 1)]};font-size:\${fs}px">\${v}<small>2\${sup(k)}</small></div>\`;
        }
        $bd.innerHTML = html;
        newIdx = -1;
      }

      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span>Gộp hai ô giống nhau</span></div>
    <div class="b48" id="bd"></div>
    <p class="hint">Vuốt hoặc dùng phím mũi tên. Mỗi ô ghi thêm dạng lũy thừa của 2 ở góc dưới.</p>
    <div class="row"><button class="btn ghost" id="stop">Kết thúc &amp; nhận XP</button></div>\`;

      const $sc = $('#sc'), $bd = $('#bd');
      add(); add(); render();

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
        if (e.target.closest('#stop') && !over) { over = true; end(); }
      };
    }

    /* ============ GAME 3: NHÀ HÓA HỌC NHÍ ============ */
startSingleGame({
  id: 'g2048',
  name: '2048 Lũy Thừa',
  icon: '🔢',
  storageKey: 'offline_g2048',
  mount: game2048,
  badges: [
      { id: 't256', n: 'Đạt ô 256', i: '🔢', ok: () => !!S.flags.t256 },
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: chem — nội dung riêng của file này -->
    <script>
// src/games/src/chem.js — Nhà Hóa Học Nhí (Hóa học)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function chemGame(root) {
      const ATOMS = [
        ['H', '#eaf0ff', '#0b2227'], ['O', '#ff6f59', '#0b2227'], ['C', '#3d4a55', '#ffffff'],
        ['N', '#6ec6ff', '#0b2227'], ['Na', '#b18cff', '#0b2227'], ['Cl', '#b7e34a', '#0b2227']
      ];
      const MOLS = [
        { name: 'Nước', f: { H: 2, O: 1 }, s: 'H₂O' },
        { name: 'Khí cacbonic', f: { C: 1, O: 2 }, s: 'CO₂' },
        { name: 'Khí metan (khí biogas)', f: { C: 1, H: 4 }, s: 'CH₄' },
        { name: 'Khí amoniac', f: { N: 1, H: 3 }, s: 'NH₃' },
        { name: 'Muối ăn', f: { Na: 1, Cl: 1 }, s: 'NaCl' },
        { name: 'Axit clohiđric', f: { H: 1, Cl: 1 }, s: 'HCl' },
        { name: 'Khí oxi', f: { O: 2 }, s: 'O₂' },
        { name: 'Khí hiđro', f: { H: 2 }, s: 'H₂' },
        { name: 'Hiđro peroxit (nước oxi già)', f: { H: 2, O: 2 }, s: 'H₂O₂' },
        { name: 'Khí nitơ', f: { N: 2 }, s: 'N₂' },
        { name: 'Khí cacbon monoxit', f: { C: 1, O: 1 }, s: 'CO' }
      ];

      const list = shuffle(MOLS).slice(0, 8);
      const col = Object.fromEntries(ATOMS.map(a => [a[0], a]));

      let i = 0, score = 0, solved = 0, wrong = 0, totalWrong = 0, flask = [], busy = false;

      const total = m => Object.values(m.f).reduce((a, b) => a + b, 0);
      const chip = (a, k) => \`<button class="atom" data-r="\${k}" style="background:\${col[a][1]};color:\${col[a][2]}" aria-label="Bỏ \${a}">\${a}</button>\`;

      function render(msg) {
        const m = list[i];
        root.innerHTML = \`<div class="hud"><span>Chất <b>\${i + 1}/8</b></span><span>⭐ <b>\${score}</b></span><span>\${wrong < 3 ? '❤️'.repeat(3 - wrong) : '💔'}</span></div>
      <div class="qbox"><small style="color:var(--mute)">Hãy tạo ra</small><br><b style="font-family:var(--head);font-size:28px">\${m.name}</b>
      \${wrong >= 1 ? \`<br><span class="pill" style="margin-top:8px">Gợi ý: có tất cả \${total(m)} nguyên tử</span>\` : ''}</div>
      <div class="flask" id="fl">\${flask.map(chip).join('') || '<span class="hint">Chạm nguyên tử bên dưới để thả vào bình</span>'}</div>
      <div class="row atoms">\${ATOMS.map(([s, bg, fg]) => \`<button class="atom big" data-a="\${s}" style="background:\${bg};color:\${fg}" aria-label="Nguyên tử \${s}">\${s}</button>\`).join('')}</div>
      \${msg || \`<div class="row"><button class="btn ghost" data-x="clear">Đổ đi</button><button class="btn" data-x="mix">🧪 Trộn!</button></div><p class="hint">Chạm nguyên tử trong bình để bỏ ra.</p>\`}\`;
      }

      function next() {
        i++;
        if (i >= 8) {
          if (totalWrong === 0) S.flags.chem = true;
          finish({
            id: 'chem', score,
            xp: Math.round(score / 3) + solved * 2,
            lines: [\`Tạo đúng \${solved}/8 chất\`, \`\${totalWrong} lần sai\`],
            replay: chemGame, details: { solved, totalWrong }
          });
          return;
        }
        flask = []; wrong = 0; busy = false; render();
      }

      function mix() {
        const m = list[i];
        const cnt = {};
        for (const a of flask) cnt[a] = (cnt[a] || 0) + 1;
        const keys = new Set([...Object.keys(cnt), ...Object.keys(m.f)]);
        let good = true;
        for (const k of keys) if ((cnt[k] || 0) !== (m.f[k] || 0)) { good = false; break; }
        busy = true;

        if (good) {
          const pts = Math.max(8, 20 - wrong * 6);
          score += pts; solved++; sfx.ok();
          render(\`<div class="qbox pop" style="margin-top:14px"><b style="font-family:var(--head);font-size:30px;color:var(--lime)">\${m.s}</b><br>Chính xác! +\${pts} điểm</div>\`);
          T.set(next, 1600);
        } else {
          wrong++; totalWrong++; sfx.bad();
          if (wrong >= 3) {
            render(\`<div class="qbox" style="margin-top:14px">Công thức đúng là <b style="font-family:var(--head);font-size:28px;color:var(--amber)">\${m.s}</b></div>\`);
            T.set(next, 2200);
          } else {
            busy = false; render();
            $('#fl').classList.add('shake');
          }
        }
      }

      root.onclick = e => {
        if (busy) return;
        const a = e.target.closest('[data-a]');
        const r = e.target.closest('[data-r]');
        const x = e.target.closest('[data-x]');
        if (a) {
          if (flask.length < 6) { flask.push(a.dataset.a); sfx.tick(); render(); }
        } else if (r) {
          flask.splice(+r.dataset.r, 1); render();
        } else if (x) {
          if (x.dataset.x === 'clear') { flask = []; render(); }
          else if (flask.length) mix();
          else toast('Hãy thả nguyên tử vào bình trước');
        }
      };

      render();
    }

    /* ============ GAME 4: ĐỒNG HỒ THỜI GIAN ============ */
startSingleGame({
  id: 'chem',
  name: 'Nhà Hóa Học Nhí',
  icon: '⚗️',
  storageKey: 'offline_chem',
  mount: chemGame,
  badges: [
      { id: 'chem', n: 'Nhà hóa học', i: '⚗️', ok: () => !!S.flags.chem },
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: clock — nội dung riêng của file này -->
    <script>
// src/games/src/clock.js — Đồng Hồ Thời Gian (Toán · Xem giờ)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function clockGame(root) {
      const fmt = (h, m) => \`\${h}:\${String(m).padStart(2, '0')}\`;
      const qs = Array.from({ length: 10 }, (_, i) => {
        const h = rnd(1, 12);
        const m = i < 4 ? [0, 30][rnd(0, 1)] : i < 7 ? [0, 15, 30, 45][rnd(0, 3)] : rnd(0, 11) * 5;
        return { h, m };
      });

      function options(h, m) {
        const set = new Set([fmt(h, m)]);
        const c = [
          fmt(h, (m + 30) % 60),
          fmt(h === 12 ? 1 : h + 1, m),
          fmt(h === 1 ? 12 : h - 1, m),
          fmt(h, (m + 5) % 60),
          fmt(h, (m + 55) % 60),
          fmt(h, (m + 15) % 60),
          fmt(m / 5 || 12, (h % 12) * 5)
        ];
        for (const x of shuffle(c)) { if (set.size < 4) set.add(x); }
        while (set.size < 4) set.add(fmt(rnd(1, 12), rnd(0, 11) * 5));
        return shuffle([...set]);
      }

      function draw(cv, h, m) {
        const S_ = 240, ctx = fitCanvas(cv, S_, S_), c = S_ / 2, R = 108;

        ctx.fillStyle = '#fff6df'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.fill(); ctx.stroke();

        for (let k = 0; k < 60; k++) {
          const a = k * 6 * Math.PI / 180, l = k % 5 ? 5 : 11;
          ctx.lineWidth = k % 5 ? 1.5 : 3;
          ctx.strokeStyle = '#0b2227';
          ctx.beginPath();
          ctx.moveTo(c + Math.sin(a) * (R - 6), c - Math.cos(a) * (R - 6));
          ctx.lineTo(c + Math.sin(a) * (R - 6 - l), c - Math.cos(a) * (R - 6 - l));
          ctx.stroke();
        }

        ctx.fillStyle = '#0b2227';
        ctx.font = '800 22px Baloo 2,system-ui,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let k = 1; k <= 12; k++) {
          const a = k * 30 * Math.PI / 180;
          ctx.fillText(k, c + Math.sin(a) * R * .74, c - Math.cos(a) * R * .74 + 1);
        }

        const hand = (ang, len, w, colr) => {
          ctx.strokeStyle = colr; ctx.lineWidth = w; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(c, c);
          ctx.lineTo(c + Math.sin(ang) * len, c - Math.cos(ang) * len);
          ctx.stroke();
        };
        hand(((h % 12) + m / 60) * 30 * Math.PI / 180, R * .47, 9, '#15434b');
        hand(m * 6 * Math.PI / 180, R * .74, 5, '#ff6f59');

        ctx.fillStyle = '#0b2227';
        ctx.beginPath(); ctx.arc(c, c, 7, 0, 7); ctx.fill();
      }

      root.innerHTML = '';
      runMC(root, {
        id: 'clock', replay: clockGame, count: 10, secs: 15,
        make(i) {
          const { h, m } = qs[i], ans = fmt(h, m);
          return {
            html: \`<canvas id="ck"></canvas><div class="hint" style="margin-top:10px">Đồng hồ đang chỉ mấy giờ? (kim ngắn chỉ giờ, kim dài chỉ phút)</div>\`,
            after() { draw($('#ck'), h, m); },
            opts: options(h, m), ans,
            exp: m === 0
              ? \`Kim dài chỉ số 12 nên là \${h} giờ đúng: \${ans}.\`
              : \`Kim ngắn chỉ gần số \${h} nên là \${h} giờ. Kim dài chỉ số \${m / 5} nên là \${m} phút. Vậy là \${ans}.\`
          };
        },
        onEnd(r) { if (r === 10) S.flags.clock = true; },
        details(right) { return { right }; }
      });
    }

    /* ============ GAME 5: QUY LUẬT SỐ ============ */
startSingleGame({
  id: 'clock',
  name: 'Đồng Hồ Thời Gian',
  icon: '🕒',
  storageKey: 'offline_clock',
  mount: clockGame,
  badges: [
      { id: 'clock', n: 'Xem giờ 10/10', i: '🕒', ok: () => !!S.flags.clock },
  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: pattern — nội dung riêng của file này -->
    <script>
// src/games/src/pattern.js — Thám Tử Quy Luật (Toán · Tư duy)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function patternGame(root) {
      function genSeq(n) {
        const t = n < 3 ? rnd(0, 1) : n < 7 ? rnd(0, 4) : rnd(0, 6);
        let seq = [], rule = '';

        if (t === 0) {
          const a = rnd(1, 20), d = rnd(2, 9);
          seq = [...Array(6)].map((_, i) => a + d * i);
          rule = \`Mỗi số bằng số đứng trước cộng \${d}.\`;
        } else if (t === 1) {
          const d = rnd(2, 8), a = rnd(40, 70);
          seq = [...Array(6)].map((_, i) => a - d * i);
          rule = \`Mỗi số bằng số đứng trước trừ \${d}.\`;
        } else if (t === 2) {
          const r = rnd(2, 3), a = rnd(1, 3);
          seq = [...Array(6)].map((_, i) => a * r ** i);
          rule = \`Mỗi số bằng số đứng trước nhân \${r}.\`;
        } else if (t === 3) {
          const o = rnd(0, 3);
          seq = [...Array(6)].map((_, i) => (i + 1) ** 2 + o);
          rule = o ? \`Đây là dãy số chính phương 1, 4, 9, 16, ... cộng thêm \${o}.\` : 'Đây là dãy số chính phương: 1², 2², 3², 4², ...';
        } else if (t === 4) {
          const a = rnd(1, 5), d0 = rnd(1, 3);
          let v = a; seq = [v];
          for (let i = 1; i < 6; i++) { v += d0 + i - 1; seq.push(v); }
          rule = \`Hiệu hai số liên tiếp tăng dần: +\${d0}, +\${d0 + 1}, +\${d0 + 2}, ...\`;
        } else if (t === 5) {
          const a = rnd(1, 4), b = rnd(2, 6);
          seq = [a, b];
          for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
          rule = 'Mỗi số bằng tổng của hai số đứng ngay trước nó.';
        } else {
          const a = rnd(20, 30), p = rnd(4, 9), m = rnd(1, p - 2);
          seq = [a];
          for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + (i % 2 ? p : -m));
          rule = \`Luân phiên cộng \${p} rồi trừ \${m}.\`;
        }
        return { seq, h: rnd(2, 5), rule };
      }

      root.innerHTML = '';
      runMC(root, {
        id: 'pattern', replay: patternGame, count: 10, secs: 20,
        make(i) {
          const { seq, h, rule } = genSeq(i);
          const ans = seq[h];
          return {
            html: \`<div class="hint" style="margin:0 0 12px">Tìm số còn thiếu theo quy luật</div>
          <div class="seq">\${seq.map((v, k) => \`<div class="chip \${k === h ? 'q' : ''}">\${k === h ? '?' : v}</div>\`).join('')}</div>\`,
            opts: makeOpts(ans, 4), ans,
            exp: \`\${rule} Số cần tìm là \${ans}.\`
          };
        },
        onEnd(r) { if (r === 10) S.flags.pat = true; },
        details(right) { return { right }; }
      });
    }

    /* ============ GAME 6: NHỚ DÃY MÀU ============ */
startSingleGame({
  id: 'pattern',
  name: 'Thám Tử Quy Luật',
  icon: '🕵️',
  storageKey: 'offline_pattern',
  mount: patternGame,
  badges: [
      { id: 'pat', n: 'Tìm ra quy luật', i: '🕵️', ok: () => !!S.flags.pat },
  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑥ Game: simon — nội dung riêng của file này -->
    <script>
// src/games/src/simon.js — Nhớ Dãy Màu (Trí nhớ)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function simonGame(root) {
      const PADS = [
        ['var(--sky)', '▲', 392],
        ['var(--coral)', '●', 494],
        ['var(--amber)', '■', 587],
        ['var(--lime)', '★', 698]
      ];
      let seq = [], step = 0, phase = 'show', score = 0;

      root.innerHTML = \`<div class="hud"><span>Vòng <b id="rd">1</b></span><span>⭐ <b id="sc">0</b></span></div>
    <div class="qbox" id="st" style="font-family:var(--head);font-size:24px;font-weight:800">Sẵn sàng?</div>
    <div class="simon">\${PADS.map((p, i) => \`<button class="pd" data-p="\${i}" style="background:\${p[0]}" aria-label="Ô \${i + 1}">\${p[1]}</button>\`).join('')}</div>
    <p class="hint">Xem dãy sáng lên, rồi bấm lại đúng thứ tự. Mỗi vòng thêm một bước.</p>\`;

      const pads = [...root.querySelectorAll('.pd')];
      const $rd = $('#rd'), $sc = $('#sc'), $st = $('#st');

      const flash = (i, ms) => {
        pads[i].classList.add('on');
        beep(PADS[i][2], ms / 1000, 'triangle', .09);
        T.set(() => pads[i].classList.remove('on'), ms);
      };

      function round() {
        seq.push(rnd(0, 3));
        step = 0; phase = 'show';
        $rd.textContent = seq.length;
        $st.textContent = 'Xem kỹ...';

        const gap = Math.max(230, 520 - seq.length * 22);
        const on = Math.max(160, gap * .6);
        seq.forEach((p, k) => T.set(() => flash(p, on), 700 + k * gap));
        T.set(() => { phase = 'input'; $st.textContent = 'Đến lượt bạn!'; }, 700 + seq.length * gap);
      }

      root.onclick = e => {
        const b = e.target.closest('[data-p]');
        if (!b || phase !== 'input') return;
        const i = +b.dataset.p;
        flash(i, 180);
        if (i !== seq[step]) {
          phase = 'over'; sfx.bad();
          $st.textContent = 'Sai rồi!';
          const rounds = seq.length - 1;
          if (rounds >= 8) S.flags.simon = true;
          T.set(() => finish({
            id: 'simon', score,
            xp: Math.round(score / 4) + rounds,
            lines: [\`Nhớ được \${rounds} bước\`],
            replay: simonGame, details: { rounds }
          }), 900);
          return;
        }
        step++;
        if (step === seq.length) {
          phase = 'wait';
          score += seq.length * 10;
          $sc.textContent = score;
          $st.textContent = 'Chính xác!';
          T.set(sfx.ok, 200);
          T.set(round, 1100);
        }
      };

      T.set(round, 700);
    }

    /* ============ Khởi động ============ */
startSingleGame({
  id: 'simon',
  name: 'Nhớ Dãy Màu',
  icon: '🎵',
  storageKey: 'offline_simon',
  mount: simonGame,
  badges: [
      { id: 'simon', n: 'Nhớ 8 vòng', i: '🧠', ok: () => !!S.flags.simon },
  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑤ Engine chung cho các game dạng câu hỏi (tiến độ lưu sau từng câu) -->
    <script>
// lib/mcengine.js — engine chung cho các game dạng "trả lời câu hỏi theo màn".
//
// 6 game (đảo chữ, đuổi màu, chuỗi số, so sánh, đố vui, đếm nhanh) dùng chung
// engine này. Mỗi file game chỉ cần đăng ký đúng 1 maker:
//
//   MC_MAKERS.<id> = function (level) { return { html, opts, ans, exp, style }; };
//   startMcGame('<id>', { name, icon, badges });
//
// Engine đảm nhiệm: vòng lặp màn, điểm, mạng, thanh thời gian và —
// QUAN TRỌNG — ghi/nhận tiến độ vào localStorage sau TỪNG câu để đóng tab
// rồi mở lại vẫn chơi tiếp đúng chỗ (game offline, không có API để hỏi).

const MC_LEVEL_STEP = 3;    // số câu đúng để lên màn
const MC_RUN_SECS = 25;     // giây cho mỗi câu
const MC_START_LIVES = 3;
const MC_PROGRESS_TTL = 30 * 24 * 60 * 60 * 1000;

/** Registry maker, mỗi file game tự đăng ký 1 hàm. */
const MC_MAKERS = {};

/** Game đang chại + metadata, dùng để dựng khoá tiến độ. */
let MC_META = { id: "mc", name: "Game", icon: "🎮" };
let mcRun = null;

function mcProgressKey() { return \`offline_\${MC_META.id}_progress\`; }

// ── Lớp tiến độ ─────────────────────────────────────────────────────────────
const MC_PROGRESS = {
  data: null,

  read() {
    try {
      const raw = localStorage.getItem(mcProgressKey());
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object" || !d.game) return null;
      if (d.updatedAt && Date.now() - d.updatedAt > MC_PROGRESS_TTL) { this.clear(); return null; }
      return d;
    } catch { return null; }
  },

  refresh() { this.data = this.read(); return this.data; },

  write(d) {
    d.updatedAt = Date.now();
    this.data = d;
    try { localStorage.setItem(mcProgressKey(), JSON.stringify(d)); } catch (e) { /* private mode */ }
    return d;
  },

  save(patch) { return this.write({ ...(this.data || {}), ...patch }); },

  clear() {
    this.data = null;
    try { localStorage.removeItem(mcProgressKey()); } catch (e) { /* ignore */ }
  },

  ago() {
    if (!this.data?.updatedAt) return "";
    const m = Math.floor((Date.now() - this.data.updatedAt) / 60000);
    if (m < 1) return "vừa xong";
    if (m < 60) return \`\${m} phút trước\`;
    const h = Math.floor(m / 60);
    if (h < 24) return \`\${h} giờ trước\`;
    return \`\${Math.floor(h / 24)} ngày trước\`;
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Chọn 1 phần tử ngẫu nhiên. */
function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

/** Lấy n phần tử ngẫu nhiên không trùng nhau. */
function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

/** Sinh n đáp án sai khác đáp án đúng. */
function distractors(pool, right, n = 3) {
  return sample([...new Set(pool.filter((x) => x !== right))], n);
}

/** Hiện số mạng: tối đa 5 tim, vượt quá thì ghi thêm số. */
function mcHearts(n) {
  const v = Math.max(0, Math.floor(n) || 0);
  return "❤️".repeat(Math.min(5, v)) + (v > 5 ? \` <b>+\${v - 5}</b>\` : "");
}

/** Ghi tiến độ ván hiện tại xuống localStorage. */
function mcPersist() {
  if (!mcRun) return;
  MC_PROGRESS.save({
    game: mcRun.id, name: MC_META.name, icon: MC_META.icon,
    level: mcRun.level, score: mcRun.score, correct: mcRun.correct,
    answered: mcRun.answered, lives: mcRun.lives,
  });
}

// ── Vòng lặp ván ────────────────────────────────────────────────────────────
function mcNextQuestion() {
  if (!mcRun) return;

  while (mcRun.correct >= MC_LEVEL_STEP) {
    mcRun.correct -= MC_LEVEL_STEP;
    mcRun.level += 1;
    mcRun.score += 25;
    sfx.win();
    toast(\`🎉 Lên màn \${mcRun.level}!\`);
  }
  if (mcRun.lives <= 0) { mcEndRun(); return; }

  mcRun.locked = false;
  mcRun.time = MC_RUN_SECS;
  mcRun.cur = MC_MAKERS[mcRun.id](mcRun.level);
  mcPersist();
  mcRender();
  mcStartTimer();
}

function mcStartTimer() {
  T.int(() => {
    if (!mcRun || mcRun.locked) return;
    mcRun.time -= 0.1;
    const bar = $("#tb");
    if (bar) bar.style.width = Math.max(0, (mcRun.time / MC_RUN_SECS) * 100) + "%";
    if (mcRun.time <= 0) mcAnswer(-1);       // hết giờ = trả lời sai
  }, 100);
}

function mcRender() {
  const c = mcRun.cur;
  const resumed = mcRun.justResumed;
  mcRun.justResumed = false;

  $("#stage").innerHTML = \`
    <div class="hud">
      <span>Màn <b>\${mcRun.level}</b></span>
      <span>⭐ <b>\${mcRun.score}</b></span>
      <span>💗 \${mcHearts(mcRun.lives)}</span>
      <span>🔥 <b>\${mcRun.correct}/\${MC_LEVEL_STEP}</b></span>
    </div>
    <div class="tbar"><i id="tb" style="width:100%"></i></div>
    \${resumed ? \`<div class="explain" style="border-left:3px solid var(--amber)">
        ▶ Đã khôi phục tiến độ từ localStorage — màn \${mcRun.level}, \${mcRun.score} ⭐</div>\` : ""}
    <div class="qbox">\${c.html}</div>
    <div class="opts" id="opts">
      \${c.opts.map((o, k) => \`<button class="opt" data-k="\${k}" \${c.style ? \`style="\${c.style[k]}"\` : ""}>\${o}</button>\`).join("")}
    </div>
    <div id="ex"></div>
    <div class="row" id="nx"></div>\`;

  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt");
    if (b) mcAnswer(+b.dataset.k);
  };
}

/** Trả lời. k = -1 nghĩa là hết giờ. */
function mcAnswer(k) {
  if (!mcRun || mcRun.locked) return;
  mcRun.locked = true;

  const c = mcRun.cur;
  const btns = [...document.querySelectorAll("#opts .opt")];
  const right = k >= 0 && String(c.opts[k]) === String(c.ans);
  const ci = c.opts.findIndex((o) => String(o) === String(c.ans));

  if (ci >= 0 && btns[ci]) btns[ci].classList.add("ok");
  if (right) {
    mcRun.correct++; mcRun.streak++;
    mcRun.score += 10 + Math.ceil(mcRun.time) + (mcRun.streak >= 3 ? 5 : 0);
    S.flags.mcRight = (S.flags.mcRight || 0) + 1;
    sfx.ok();
  } else {
    mcRun.streak = 0;
    mcRun.lives -= 1;
    S.flags.mcWrong = (S.flags.mcWrong || 0) + 1;
    sfx.bad();
    if (k >= 0 && btns[k]) btns[k].classList.add("bad");
  }
  mcRun.answered += 1;

  const ex = $("#ex"), nx = $("#nx");
  if (ex) ex.innerHTML = \`<div class="explain">\${right ? "✅ Chính xác!" : (k < 0 ? "⏰ Hết giờ!" : "❌ Chưa đúng.")} \${c.exp}</div>\`;
  if (nx) {
    const over = mcRun.lives <= 0;
    nx.innerHTML = over
      ? \`<button class="btn" data-next="1">Xem kết quả</button>\`
      : \`<button class="btn" data-next="1">\${mcRun.correct >= MC_LEVEL_STEP ? "Lên màn! →" : "Câu tiếp theo →"}</button>\`;
    nx.onclick = () => { if (mcRun) mcNextQuestion(); };
  }

  mcPersist();          // ← lưu sau MỖI câu
}

function mcEndRun() {
  if (!mcRun) return;
  const snap = mcRun;
  mcRun = null;
  MC_PROGRESS.clear();   // hết ván → không cần giữ tiến độ dang dở
  sfx.win();
  finish({
    id: snap.id,
    score: snap.score,
    xp: snap.answered * 5,
    lines: [\`Màn cao nhất: \${snap.level}\`, \`Câu đúng: \${snap.correct}\`, \`Đã trả lời: \${snap.answered} câu\`],
    replay: false,
    details: { level: snap.level, answered: snap.answered },
  });
}

/**
 * Khởi động game dạng MC.
 * @param {string} id     khoá trong MC_MAKERS
 * @param {object} meta   { name, icon, badges }
 */
function startMcGame(id, meta) {
  if (typeof MC_MAKERS[id] !== "function") {
    console.error(\`[mcengine] chưa đăng ký maker cho "\${id}"\`);
    return;
  }
  MC_META = { id, name: meta.name, icon: meta.icon || "🎮" };

  // Đọc tiến độ TỪ ĐĨA — không tin biến trong bộ nhớ, để vào thẳng URL game
  // (F5, bookmark) vẫn khôi phục được.
  const saved = MC_PROGRESS.refresh();
  const keep = saved && saved.game === id;

  mcRun = {
    id,
    level: keep ? Math.max(1, saved.level || 1) : 1,
    score: keep ? (saved.score || 0) : 0,
    correct: keep ? (saved.correct || 0) : 0,
    answered: keep ? (saved.answered || 0) : 0,
    lives: keep && Number.isFinite(saved.lives) ? Math.max(1, saved.lives) : MC_START_LIVES,
    streak: 0, locked: false, cur: null, time: MC_RUN_SECS,
    justResumed: !!keep,
  };

  startSingleGame({
    id, name: meta.name, icon: meta.icon,
    storageKey: \`offline_\${id}\`,
    mount: () => { mcPersist(); mcNextQuestion(); },
    badges: meta.badges || [],
  });
}

// Lưu nốt khi đóng tab / đổi trang
window.addEventListener("beforeunload", () => { if (mcRun) mcPersist(); });
window.addEventListener("pagehide", () => { if (mcRun) mcPersist(); });

/** Kiểm tra tiến độ trong console: MC_PROGRESS.refresh() */
if (typeof window !== "undefined") window.MC_PROGRESS = MC_PROGRESS;
    <\/script>

    <!-- ⑥ Game: anagram — nội dung riêng của file này -->
    <script>
// src/games/src/anagram.js — Đảo Chữ Nhí (Tiếng Anh)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const WORDS = [
      ['apple', 'quả táo'], ['dog', 'con chó'], ['book', 'quyển sách'], ['sun', 'mặt trời'],
      ['bag', 'cái cặp'], ['car', 'ô tô'], ['fish', 'con cá'], ['bird', 'con chim'],
      ['milk', 'sữa'], ['tree', 'cây'], ['star', 'ngôi sao'], ['rain', 'mưa'],
      ['snow', 'tuyết'], ['cake', 'bánh'], ['duck', 'vịt'], ['moon', 'mặt trăng'],
      ['ship', 'con thuyền'], ['frog', 'con ếch'], ['lion', 'sư tử'], ['leaf', 'chiếc lá'],
      ['clock', 'đồng hồ'], ['desk', 'bàn học'], ['hand', 'bàn tay'], ['king', 'vua'],
    ];

    function scramble(word) {
      if (word.length < 3) return word;
      for (let i = 0; i < 12; i++) {
        const a = shuffle(word.split('')).join('');
        if (a !== word) return a;
      }
      return word.split('').reverse().join('');
    }

    /** Chọn 1 phần tử ngẫu nhiên. Tên riêng để không đụng hàm tiện ích của game-core. */
    function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

    /** Lấy n phần tử ngẫu nhiên không trùng nhau. */
    function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

    /** Sinh 3 đáp án sai cho 1 đáp án đúng. */
    function distractors(pool, right, n = 3) {
      return sample([...new Set(pool.filter(x => x !== right))], n);
    }

    /* ══════════════════════════════════════════════════════════════════════════
       CÁC MINI-GAME — mỗi game có make(level) trả về 1 câu hỏi
       ══════════════════════════════════════════════════════════════════════ */


MC_MAKERS.anagram = function anagram(level) {
        const pool = WORDS.slice(0, Math.min(WORDS.length, 6 + level * 4));
        const [en, vi] = pickOne(pool);
        const all = WORDS.map(w => w[0]);
        const opts = shuffle([en, ...distractors(all, en)]);
        return {
          html: \`<div style="font-size:11px;opacity:.7">XẾP LẠI TỪ</div>
                 <div style="font-size:34px;letter-spacing:8px;font-weight:800">\${scramble(en)}</div>
                 <div style="font-size:14px;opacity:.85;margin-top:6px">Nghĩa: \${vi}</div>\`,
          opts, ans: en,
          exp: \`Từ đúng là <b>\${en}</b> — \${vi}.\`,
        };
      },
startMcGame('anagram', {
  name: 'Đảo Chữ Nhí',
  icon: '🧩',
  badges: [

  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑤ Engine chung cho các game dạng câu hỏi (tiến độ lưu sau từng câu) -->
    <script>
// lib/mcengine.js — engine chung cho các game dạng "trả lời câu hỏi theo màn".
//
// 6 game (đảo chữ, đuổi màu, chuỗi số, so sánh, đố vui, đếm nhanh) dùng chung
// engine này. Mỗi file game chỉ cần đăng ký đúng 1 maker:
//
//   MC_MAKERS.<id> = function (level) { return { html, opts, ans, exp, style }; };
//   startMcGame('<id>', { name, icon, badges });
//
// Engine đảm nhiệm: vòng lặp màn, điểm, mạng, thanh thời gian và —
// QUAN TRỌNG — ghi/nhận tiến độ vào localStorage sau TỪNG câu để đóng tab
// rồi mở lại vẫn chơi tiếp đúng chỗ (game offline, không có API để hỏi).

const MC_LEVEL_STEP = 3;    // số câu đúng để lên màn
const MC_RUN_SECS = 25;     // giây cho mỗi câu
const MC_START_LIVES = 3;
const MC_PROGRESS_TTL = 30 * 24 * 60 * 60 * 1000;

/** Registry maker, mỗi file game tự đăng ký 1 hàm. */
const MC_MAKERS = {};

/** Game đang chại + metadata, dùng để dựng khoá tiến độ. */
let MC_META = { id: "mc", name: "Game", icon: "🎮" };
let mcRun = null;

function mcProgressKey() { return \`offline_\${MC_META.id}_progress\`; }

// ── Lớp tiến độ ─────────────────────────────────────────────────────────────
const MC_PROGRESS = {
  data: null,

  read() {
    try {
      const raw = localStorage.getItem(mcProgressKey());
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object" || !d.game) return null;
      if (d.updatedAt && Date.now() - d.updatedAt > MC_PROGRESS_TTL) { this.clear(); return null; }
      return d;
    } catch { return null; }
  },

  refresh() { this.data = this.read(); return this.data; },

  write(d) {
    d.updatedAt = Date.now();
    this.data = d;
    try { localStorage.setItem(mcProgressKey(), JSON.stringify(d)); } catch (e) { /* private mode */ }
    return d;
  },

  save(patch) { return this.write({ ...(this.data || {}), ...patch }); },

  clear() {
    this.data = null;
    try { localStorage.removeItem(mcProgressKey()); } catch (e) { /* ignore */ }
  },

  ago() {
    if (!this.data?.updatedAt) return "";
    const m = Math.floor((Date.now() - this.data.updatedAt) / 60000);
    if (m < 1) return "vừa xong";
    if (m < 60) return \`\${m} phút trước\`;
    const h = Math.floor(m / 60);
    if (h < 24) return \`\${h} giờ trước\`;
    return \`\${Math.floor(h / 24)} ngày trước\`;
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Chọn 1 phần tử ngẫu nhiên. */
function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

/** Lấy n phần tử ngẫu nhiên không trùng nhau. */
function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

/** Sinh n đáp án sai khác đáp án đúng. */
function distractors(pool, right, n = 3) {
  return sample([...new Set(pool.filter((x) => x !== right))], n);
}

/** Hiện số mạng: tối đa 5 tim, vượt quá thì ghi thêm số. */
function mcHearts(n) {
  const v = Math.max(0, Math.floor(n) || 0);
  return "❤️".repeat(Math.min(5, v)) + (v > 5 ? \` <b>+\${v - 5}</b>\` : "");
}

/** Ghi tiến độ ván hiện tại xuống localStorage. */
function mcPersist() {
  if (!mcRun) return;
  MC_PROGRESS.save({
    game: mcRun.id, name: MC_META.name, icon: MC_META.icon,
    level: mcRun.level, score: mcRun.score, correct: mcRun.correct,
    answered: mcRun.answered, lives: mcRun.lives,
  });
}

// ── Vòng lặp ván ────────────────────────────────────────────────────────────
function mcNextQuestion() {
  if (!mcRun) return;

  while (mcRun.correct >= MC_LEVEL_STEP) {
    mcRun.correct -= MC_LEVEL_STEP;
    mcRun.level += 1;
    mcRun.score += 25;
    sfx.win();
    toast(\`🎉 Lên màn \${mcRun.level}!\`);
  }
  if (mcRun.lives <= 0) { mcEndRun(); return; }

  mcRun.locked = false;
  mcRun.time = MC_RUN_SECS;
  mcRun.cur = MC_MAKERS[mcRun.id](mcRun.level);
  mcPersist();
  mcRender();
  mcStartTimer();
}

function mcStartTimer() {
  T.int(() => {
    if (!mcRun || mcRun.locked) return;
    mcRun.time -= 0.1;
    const bar = $("#tb");
    if (bar) bar.style.width = Math.max(0, (mcRun.time / MC_RUN_SECS) * 100) + "%";
    if (mcRun.time <= 0) mcAnswer(-1);       // hết giờ = trả lời sai
  }, 100);
}

function mcRender() {
  const c = mcRun.cur;
  const resumed = mcRun.justResumed;
  mcRun.justResumed = false;

  $("#stage").innerHTML = \`
    <div class="hud">
      <span>Màn <b>\${mcRun.level}</b></span>
      <span>⭐ <b>\${mcRun.score}</b></span>
      <span>💗 \${mcHearts(mcRun.lives)}</span>
      <span>🔥 <b>\${mcRun.correct}/\${MC_LEVEL_STEP}</b></span>
    </div>
    <div class="tbar"><i id="tb" style="width:100%"></i></div>
    \${resumed ? \`<div class="explain" style="border-left:3px solid var(--amber)">
        ▶ Đã khôi phục tiến độ từ localStorage — màn \${mcRun.level}, \${mcRun.score} ⭐</div>\` : ""}
    <div class="qbox">\${c.html}</div>
    <div class="opts" id="opts">
      \${c.opts.map((o, k) => \`<button class="opt" data-k="\${k}" \${c.style ? \`style="\${c.style[k]}"\` : ""}>\${o}</button>\`).join("")}
    </div>
    <div id="ex"></div>
    <div class="row" id="nx"></div>\`;

  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt");
    if (b) mcAnswer(+b.dataset.k);
  };
}

/** Trả lời. k = -1 nghĩa là hết giờ. */
function mcAnswer(k) {
  if (!mcRun || mcRun.locked) return;
  mcRun.locked = true;

  const c = mcRun.cur;
  const btns = [...document.querySelectorAll("#opts .opt")];
  const right = k >= 0 && String(c.opts[k]) === String(c.ans);
  const ci = c.opts.findIndex((o) => String(o) === String(c.ans));

  if (ci >= 0 && btns[ci]) btns[ci].classList.add("ok");
  if (right) {
    mcRun.correct++; mcRun.streak++;
    mcRun.score += 10 + Math.ceil(mcRun.time) + (mcRun.streak >= 3 ? 5 : 0);
    S.flags.mcRight = (S.flags.mcRight || 0) + 1;
    sfx.ok();
  } else {
    mcRun.streak = 0;
    mcRun.lives -= 1;
    S.flags.mcWrong = (S.flags.mcWrong || 0) + 1;
    sfx.bad();
    if (k >= 0 && btns[k]) btns[k].classList.add("bad");
  }
  mcRun.answered += 1;

  const ex = $("#ex"), nx = $("#nx");
  if (ex) ex.innerHTML = \`<div class="explain">\${right ? "✅ Chính xác!" : (k < 0 ? "⏰ Hết giờ!" : "❌ Chưa đúng.")} \${c.exp}</div>\`;
  if (nx) {
    const over = mcRun.lives <= 0;
    nx.innerHTML = over
      ? \`<button class="btn" data-next="1">Xem kết quả</button>\`
      : \`<button class="btn" data-next="1">\${mcRun.correct >= MC_LEVEL_STEP ? "Lên màn! →" : "Câu tiếp theo →"}</button>\`;
    nx.onclick = () => { if (mcRun) mcNextQuestion(); };
  }

  mcPersist();          // ← lưu sau MỖI câu
}

function mcEndRun() {
  if (!mcRun) return;
  const snap = mcRun;
  mcRun = null;
  MC_PROGRESS.clear();   // hết ván → không cần giữ tiến độ dang dở
  sfx.win();
  finish({
    id: snap.id,
    score: snap.score,
    xp: snap.answered * 5,
    lines: [\`Màn cao nhất: \${snap.level}\`, \`Câu đúng: \${snap.correct}\`, \`Đã trả lời: \${snap.answered} câu\`],
    replay: false,
    details: { level: snap.level, answered: snap.answered },
  });
}

/**
 * Khởi động game dạng MC.
 * @param {string} id     khoá trong MC_MAKERS
 * @param {object} meta   { name, icon, badges }
 */
function startMcGame(id, meta) {
  if (typeof MC_MAKERS[id] !== "function") {
    console.error(\`[mcengine] chưa đăng ký maker cho "\${id}"\`);
    return;
  }
  MC_META = { id, name: meta.name, icon: meta.icon || "🎮" };

  // Đọc tiến độ TỪ ĐĨA — không tin biến trong bộ nhớ, để vào thẳng URL game
  // (F5, bookmark) vẫn khôi phục được.
  const saved = MC_PROGRESS.refresh();
  const keep = saved && saved.game === id;

  mcRun = {
    id,
    level: keep ? Math.max(1, saved.level || 1) : 1,
    score: keep ? (saved.score || 0) : 0,
    correct: keep ? (saved.correct || 0) : 0,
    answered: keep ? (saved.answered || 0) : 0,
    lives: keep && Number.isFinite(saved.lives) ? Math.max(1, saved.lives) : MC_START_LIVES,
    streak: 0, locked: false, cur: null, time: MC_RUN_SECS,
    justResumed: !!keep,
  };

  startSingleGame({
    id, name: meta.name, icon: meta.icon,
    storageKey: \`offline_\${id}\`,
    mount: () => { mcPersist(); mcNextQuestion(); },
    badges: meta.badges || [],
  });
}

// Lưu nốt khi đóng tab / đổi trang
window.addEventListener("beforeunload", () => { if (mcRun) mcPersist(); });
window.addEventListener("pagehide", () => { if (mcRun) mcPersist(); });

/** Kiểm tra tiến độ trong console: MC_PROGRESS.refresh() */
if (typeof window !== "undefined") window.MC_PROGRESS = MC_PROGRESS;
    <\/script>

    <!-- ⑥ Game: stroop — nội dung riêng của file này -->
    <script>
// src/games/src/stroop.js — Đuổi Màu (Tập trung)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const COLORS = { 'Đỏ': '#ef4444', 'Xanh dương': '#3b82f6', 'Vàng': '#eab308', 'Xanh lá': '#22c55e', 'Tím': '#a855f7', 'Cam': '#f97316' };

MC_MAKERS.stroop = function stroop(level) {
        const names = Object.keys(COLORS);
        const say = pickOne(names);                              // chữ trong câu lệnh
        const wrong = names.filter(n => n !== say);
        const answerColor = pickOne(names);                      // màu cần tìm
        const grid = shuffle([answerColor, ...sample(wrong, 3)]);
        const idx = grid.indexOf(answerColor);
        return {
          html: \`<div style="font-size:11px;opacity:.7">ĐUỔI MÀU</div>
                 <div style="font-size:22px;margin-top:8px">Chọn ô có màu
                   <b style="color:\${COLORS[say]};text-shadow:0 0 6px \${COLORS[say]}">\${say}</b></div>
                 <div style="font-size:12px;opacity:.6;margin-top:6px">Đọc CHỮ, đừng nhìn màu ô</div>\`,
          opts: grid.map((_, i) => String(i + 1)),
          style: grid.map(g => \`background:\${COLORS[g]};color:#fff;border:0;font-size:20px;font-weight:900;height:74px\`),
          ans: String(idx + 1),
          exp: \`Ô <b>\${idx + 1}</b> mới là màu <b>\${answerColor}</b>.\`,
        };
      },
startMcGame('stroop', {
  name: 'Đuổi Màu',
  icon: '🎨',
  badges: [

  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑤ Engine chung cho các game dạng câu hỏi (tiến độ lưu sau từng câu) -->
    <script>
// lib/mcengine.js — engine chung cho các game dạng "trả lời câu hỏi theo màn".
//
// 6 game (đảo chữ, đuổi màu, chuỗi số, so sánh, đố vui, đếm nhanh) dùng chung
// engine này. Mỗi file game chỉ cần đăng ký đúng 1 maker:
//
//   MC_MAKERS.<id> = function (level) { return { html, opts, ans, exp, style }; };
//   startMcGame('<id>', { name, icon, badges });
//
// Engine đảm nhiệm: vòng lặp màn, điểm, mạng, thanh thời gian và —
// QUAN TRỌNG — ghi/nhận tiến độ vào localStorage sau TỪNG câu để đóng tab
// rồi mở lại vẫn chơi tiếp đúng chỗ (game offline, không có API để hỏi).

const MC_LEVEL_STEP = 3;    // số câu đúng để lên màn
const MC_RUN_SECS = 25;     // giây cho mỗi câu
const MC_START_LIVES = 3;
const MC_PROGRESS_TTL = 30 * 24 * 60 * 60 * 1000;

/** Registry maker, mỗi file game tự đăng ký 1 hàm. */
const MC_MAKERS = {};

/** Game đang chại + metadata, dùng để dựng khoá tiến độ. */
let MC_META = { id: "mc", name: "Game", icon: "🎮" };
let mcRun = null;

function mcProgressKey() { return \`offline_\${MC_META.id}_progress\`; }

// ── Lớp tiến độ ─────────────────────────────────────────────────────────────
const MC_PROGRESS = {
  data: null,

  read() {
    try {
      const raw = localStorage.getItem(mcProgressKey());
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object" || !d.game) return null;
      if (d.updatedAt && Date.now() - d.updatedAt > MC_PROGRESS_TTL) { this.clear(); return null; }
      return d;
    } catch { return null; }
  },

  refresh() { this.data = this.read(); return this.data; },

  write(d) {
    d.updatedAt = Date.now();
    this.data = d;
    try { localStorage.setItem(mcProgressKey(), JSON.stringify(d)); } catch (e) { /* private mode */ }
    return d;
  },

  save(patch) { return this.write({ ...(this.data || {}), ...patch }); },

  clear() {
    this.data = null;
    try { localStorage.removeItem(mcProgressKey()); } catch (e) { /* ignore */ }
  },

  ago() {
    if (!this.data?.updatedAt) return "";
    const m = Math.floor((Date.now() - this.data.updatedAt) / 60000);
    if (m < 1) return "vừa xong";
    if (m < 60) return \`\${m} phút trước\`;
    const h = Math.floor(m / 60);
    if (h < 24) return \`\${h} giờ trước\`;
    return \`\${Math.floor(h / 24)} ngày trước\`;
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Chọn 1 phần tử ngẫu nhiên. */
function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

/** Lấy n phần tử ngẫu nhiên không trùng nhau. */
function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

/** Sinh n đáp án sai khác đáp án đúng. */
function distractors(pool, right, n = 3) {
  return sample([...new Set(pool.filter((x) => x !== right))], n);
}

/** Hiện số mạng: tối đa 5 tim, vượt quá thì ghi thêm số. */
function mcHearts(n) {
  const v = Math.max(0, Math.floor(n) || 0);
  return "❤️".repeat(Math.min(5, v)) + (v > 5 ? \` <b>+\${v - 5}</b>\` : "");
}

/** Ghi tiến độ ván hiện tại xuống localStorage. */
function mcPersist() {
  if (!mcRun) return;
  MC_PROGRESS.save({
    game: mcRun.id, name: MC_META.name, icon: MC_META.icon,
    level: mcRun.level, score: mcRun.score, correct: mcRun.correct,
    answered: mcRun.answered, lives: mcRun.lives,
  });
}

// ── Vòng lặp ván ────────────────────────────────────────────────────────────
function mcNextQuestion() {
  if (!mcRun) return;

  while (mcRun.correct >= MC_LEVEL_STEP) {
    mcRun.correct -= MC_LEVEL_STEP;
    mcRun.level += 1;
    mcRun.score += 25;
    sfx.win();
    toast(\`🎉 Lên màn \${mcRun.level}!\`);
  }
  if (mcRun.lives <= 0) { mcEndRun(); return; }

  mcRun.locked = false;
  mcRun.time = MC_RUN_SECS;
  mcRun.cur = MC_MAKERS[mcRun.id](mcRun.level);
  mcPersist();
  mcRender();
  mcStartTimer();
}

function mcStartTimer() {
  T.int(() => {
    if (!mcRun || mcRun.locked) return;
    mcRun.time -= 0.1;
    const bar = $("#tb");
    if (bar) bar.style.width = Math.max(0, (mcRun.time / MC_RUN_SECS) * 100) + "%";
    if (mcRun.time <= 0) mcAnswer(-1);       // hết giờ = trả lời sai
  }, 100);
}

function mcRender() {
  const c = mcRun.cur;
  const resumed = mcRun.justResumed;
  mcRun.justResumed = false;

  $("#stage").innerHTML = \`
    <div class="hud">
      <span>Màn <b>\${mcRun.level}</b></span>
      <span>⭐ <b>\${mcRun.score}</b></span>
      <span>💗 \${mcHearts(mcRun.lives)}</span>
      <span>🔥 <b>\${mcRun.correct}/\${MC_LEVEL_STEP}</b></span>
    </div>
    <div class="tbar"><i id="tb" style="width:100%"></i></div>
    \${resumed ? \`<div class="explain" style="border-left:3px solid var(--amber)">
        ▶ Đã khôi phục tiến độ từ localStorage — màn \${mcRun.level}, \${mcRun.score} ⭐</div>\` : ""}
    <div class="qbox">\${c.html}</div>
    <div class="opts" id="opts">
      \${c.opts.map((o, k) => \`<button class="opt" data-k="\${k}" \${c.style ? \`style="\${c.style[k]}"\` : ""}>\${o}</button>\`).join("")}
    </div>
    <div id="ex"></div>
    <div class="row" id="nx"></div>\`;

  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt");
    if (b) mcAnswer(+b.dataset.k);
  };
}

/** Trả lời. k = -1 nghĩa là hết giờ. */
function mcAnswer(k) {
  if (!mcRun || mcRun.locked) return;
  mcRun.locked = true;

  const c = mcRun.cur;
  const btns = [...document.querySelectorAll("#opts .opt")];
  const right = k >= 0 && String(c.opts[k]) === String(c.ans);
  const ci = c.opts.findIndex((o) => String(o) === String(c.ans));

  if (ci >= 0 && btns[ci]) btns[ci].classList.add("ok");
  if (right) {
    mcRun.correct++; mcRun.streak++;
    mcRun.score += 10 + Math.ceil(mcRun.time) + (mcRun.streak >= 3 ? 5 : 0);
    S.flags.mcRight = (S.flags.mcRight || 0) + 1;
    sfx.ok();
  } else {
    mcRun.streak = 0;
    mcRun.lives -= 1;
    S.flags.mcWrong = (S.flags.mcWrong || 0) + 1;
    sfx.bad();
    if (k >= 0 && btns[k]) btns[k].classList.add("bad");
  }
  mcRun.answered += 1;

  const ex = $("#ex"), nx = $("#nx");
  if (ex) ex.innerHTML = \`<div class="explain">\${right ? "✅ Chính xác!" : (k < 0 ? "⏰ Hết giờ!" : "❌ Chưa đúng.")} \${c.exp}</div>\`;
  if (nx) {
    const over = mcRun.lives <= 0;
    nx.innerHTML = over
      ? \`<button class="btn" data-next="1">Xem kết quả</button>\`
      : \`<button class="btn" data-next="1">\${mcRun.correct >= MC_LEVEL_STEP ? "Lên màn! →" : "Câu tiếp theo →"}</button>\`;
    nx.onclick = () => { if (mcRun) mcNextQuestion(); };
  }

  mcPersist();          // ← lưu sau MỖI câu
}

function mcEndRun() {
  if (!mcRun) return;
  const snap = mcRun;
  mcRun = null;
  MC_PROGRESS.clear();   // hết ván → không cần giữ tiến độ dang dở
  sfx.win();
  finish({
    id: snap.id,
    score: snap.score,
    xp: snap.answered * 5,
    lines: [\`Màn cao nhất: \${snap.level}\`, \`Câu đúng: \${snap.correct}\`, \`Đã trả lời: \${snap.answered} câu\`],
    replay: false,
    details: { level: snap.level, answered: snap.answered },
  });
}

/**
 * Khởi động game dạng MC.
 * @param {string} id     khoá trong MC_MAKERS
 * @param {object} meta   { name, icon, badges }
 */
function startMcGame(id, meta) {
  if (typeof MC_MAKERS[id] !== "function") {
    console.error(\`[mcengine] chưa đăng ký maker cho "\${id}"\`);
    return;
  }
  MC_META = { id, name: meta.name, icon: meta.icon || "🎮" };

  // Đọc tiến độ TỪ ĐĨA — không tin biến trong bộ nhớ, để vào thẳng URL game
  // (F5, bookmark) vẫn khôi phục được.
  const saved = MC_PROGRESS.refresh();
  const keep = saved && saved.game === id;

  mcRun = {
    id,
    level: keep ? Math.max(1, saved.level || 1) : 1,
    score: keep ? (saved.score || 0) : 0,
    correct: keep ? (saved.correct || 0) : 0,
    answered: keep ? (saved.answered || 0) : 0,
    lives: keep && Number.isFinite(saved.lives) ? Math.max(1, saved.lives) : MC_START_LIVES,
    streak: 0, locked: false, cur: null, time: MC_RUN_SECS,
    justResumed: !!keep,
  };

  startSingleGame({
    id, name: meta.name, icon: meta.icon,
    storageKey: \`offline_\${id}\`,
    mount: () => { mcPersist(); mcNextQuestion(); },
    badges: meta.badges || [],
  });
}

// Lưu nốt khi đóng tab / đổi trang
window.addEventListener("beforeunload", () => { if (mcRun) mcPersist(); });
window.addEventListener("pagehide", () => { if (mcRun) mcPersist(); });

/** Kiểm tra tiến độ trong console: MC_PROGRESS.refresh() */
if (typeof window !== "undefined") window.MC_PROGRESS = MC_PROGRESS;
    <\/script>

    <!-- ⑥ Game: sumseq — nội dung riêng của file này -->
    <script>
// src/games/src/sumseq.js — Chuỗi Số (Toán)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

MC_MAKERS.sumseq = function sumseq(level) {
        const kind = rnd(4);
        const step = rnd(2, 6 + level);
        const start = rnd(1, 20);
        let seq, ans, exp;
        if (kind === 0) {                      // cộng đều
          seq = [start, start + step, start + step * 2, start + step * 3];
          ans = start + step * 4;
          exp = \`Mỗi số cộng thêm \${step}.\`;
        } else if (kind === 1) {               // giảm đều
          seq = [20 + step * 3, 20 + step * 2, 20 + step, 20];
          ans = Math.max(0, 20 - step);
          exp = \`Mỗi số trừ \${step}.\`;
        } else if (kind === 2) {               // chính phương
          const b = rnd(2, 3 + level);
          seq = [b * b, (b + 1) * (b + 1), (b + 2) * (b + 2), (b + 3) * (b + 3)];
          ans = (b + 4) * (b + 4);
          exp = \`Là các số chính phương liên tiếp từ \${b}.\`;
        } else {                               // nhân 2
          seq = [2, 4, 8, 16];
          ans = 32;
          exp = 'Mỗi số nhân đôi.';
        }
        const wrong = distractors([ans - 1, ans + 1, ans + step, ans - step, ans + 10, ans - 10, ans + 2], String(ans)).map(Number);
        const opts = shuffle([String(ans), ...wrong.slice(0, 3).map(String)]);
        return {
          html: \`<div style="font-size:11px;opacity:.7">CHUỖI SỐ</div>
                 <div style="font-size:28px;font-weight:800;margin-top:8px">\${seq.join('  ·  ')}  ·  ?</div>
                 <div style="font-size:12px;opacity:.6;margin-top:6px">Điền số tiếp theo</div>\`,
          opts, ans: String(ans), exp,
        };
      },
startMcGame('sumseq', {
  name: 'Chuỗi Số',
  icon: '➕',
  badges: [

  ],
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑤ Engine chung cho các game dạng câu hỏi (tiến độ lưu sau từng câu) -->
    <script>
// lib/mcengine.js — engine chung cho các game dạng "trả lời câu hỏi theo màn".
//
// 6 game (đảo chữ, đuổi màu, chuỗi số, so sánh, đố vui, đếm nhanh) dùng chung
// engine này. Mỗi file game chỉ cần đăng ký đúng 1 maker:
//
//   MC_MAKERS.<id> = function (level) { return { html, opts, ans, exp, style }; };
//   startMcGame('<id>', { name, icon, badges });
//
// Engine đảm nhiệm: vòng lặp màn, điểm, mạng, thanh thời gian và —
// QUAN TRỌNG — ghi/nhận tiến độ vào localStorage sau TỪNG câu để đóng tab
// rồi mở lại vẫn chơi tiếp đúng chỗ (game offline, không có API để hỏi).

const MC_LEVEL_STEP = 3;    // số câu đúng để lên màn
const MC_RUN_SECS = 25;     // giây cho mỗi câu
const MC_START_LIVES = 3;
const MC_PROGRESS_TTL = 30 * 24 * 60 * 60 * 1000;

/** Registry maker, mỗi file game tự đăng ký 1 hàm. */
const MC_MAKERS = {};

/** Game đang chại + metadata, dùng để dựng khoá tiến độ. */
let MC_META = { id: "mc", name: "Game", icon: "🎮" };
let mcRun = null;

function mcProgressKey() { return \`offline_\${MC_META.id}_progress\`; }

// ── Lớp tiến độ ─────────────────────────────────────────────────────────────
const MC_PROGRESS = {
  data: null,

  read() {
    try {
      const raw = localStorage.getItem(mcProgressKey());
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object" || !d.game) return null;
      if (d.updatedAt && Date.now() - d.updatedAt > MC_PROGRESS_TTL) { this.clear(); return null; }
      return d;
    } catch { return null; }
  },

  refresh() { this.data = this.read(); return this.data; },

  write(d) {
    d.updatedAt = Date.now();
    this.data = d;
    try { localStorage.setItem(mcProgressKey(), JSON.stringify(d)); } catch (e) { /* private mode */ }
    return d;
  },

  save(patch) { return this.write({ ...(this.data || {}), ...patch }); },

  clear() {
    this.data = null;
    try { localStorage.removeItem(mcProgressKey()); } catch (e) { /* ignore */ }
  },

  ago() {
    if (!this.data?.updatedAt) return "";
    const m = Math.floor((Date.now() - this.data.updatedAt) / 60000);
    if (m < 1) return "vừa xong";
    if (m < 60) return \`\${m} phút trước\`;
    const h = Math.floor(m / 60);
    if (h < 24) return \`\${h} giờ trước\`;
    return \`\${Math.floor(h / 24)} ngày trước\`;
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Chọn 1 phần tử ngẫu nhiên. */
function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

/** Lấy n phần tử ngẫu nhiên không trùng nhau. */
function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

/** Sinh n đáp án sai khác đáp án đúng. */
function distractors(pool, right, n = 3) {
  return sample([...new Set(pool.filter((x) => x !== right))], n);
}

/** Hiện số mạng: tối đa 5 tim, vượt quá thì ghi thêm số. */
function mcHearts(n) {
  const v = Math.max(0, Math.floor(n) || 0);
  return "❤️".repeat(Math.min(5, v)) + (v > 5 ? \` <b>+\${v - 5}</b>\` : "");
}

/** Ghi tiến độ ván hiện tại xuống localStorage. */
function mcPersist() {
  if (!mcRun) return;
  MC_PROGRESS.save({
    game: mcRun.id, name: MC_META.name, icon: MC_META.icon,
    level: mcRun.level, score: mcRun.score, correct: mcRun.correct,
    answered: mcRun.answered, lives: mcRun.lives,
  });
}

// ── Vòng lặp ván ────────────────────────────────────────────────────────────
function mcNextQuestion() {
  if (!mcRun) return;

  while (mcRun.correct >= MC_LEVEL_STEP) {
    mcRun.correct -= MC_LEVEL_STEP;
    mcRun.level += 1;
    mcRun.score += 25;
    sfx.win();
    toast(\`🎉 Lên màn \${mcRun.level}!\`);
  }
  if (mcRun.lives <= 0) { mcEndRun(); return; }

  mcRun.locked = false;
  mcRun.time = MC_RUN_SECS;
  mcRun.cur = MC_MAKERS[mcRun.id](mcRun.level);
  mcPersist();
  mcRender();
  mcStartTimer();
}

function mcStartTimer() {
  T.int(() => {
    if (!mcRun || mcRun.locked) return;
    mcRun.time -= 0.1;
    const bar = $("#tb");
    if (bar) bar.style.width = Math.max(0, (mcRun.time / MC_RUN_SECS) * 100) + "%";
    if (mcRun.time <= 0) mcAnswer(-1);       // hết giờ = trả lời sai
  }, 100);
}

function mcRender() {
  const c = mcRun.cur;
  const resumed = mcRun.justResumed;
  mcRun.justResumed = false;

  $("#stage").innerHTML = \`
    <div class="hud">
      <span>Màn <b>\${mcRun.level}</b></span>
      <span>⭐ <b>\${mcRun.score}</b></span>
      <span>💗 \${mcHearts(mcRun.lives)}</span>
      <span>🔥 <b>\${mcRun.correct}/\${MC_LEVEL_STEP}</b></span>
    </div>
    <div class="tbar"><i id="tb" style="width:100%"></i></div>
    \${resumed ? \`<div class="explain" style="border-left:3px solid var(--amber)">
        ▶ Đã khôi phục tiến độ từ localStorage — màn \${mcRun.level}, \${mcRun.score} ⭐</div>\` : ""}
    <div class="qbox">\${c.html}</div>
    <div class="opts" id="opts">
      \${c.opts.map((o, k) => \`<button class="opt" data-k="\${k}" \${c.style ? \`style="\${c.style[k]}"\` : ""}>\${o}</button>\`).join("")}
    </div>
    <div id="ex"></div>
    <div class="row" id="nx"></div>\`;

  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt");
    if (b) mcAnswer(+b.dataset.k);
  };
}

/** Trả lời. k = -1 nghĩa là hết giờ. */
function mcAnswer(k) {
  if (!mcRun || mcRun.locked) return;
  mcRun.locked = true;

  const c = mcRun.cur;
  const btns = [...document.querySelectorAll("#opts .opt")];
  const right = k >= 0 && String(c.opts[k]) === String(c.ans);
  const ci = c.opts.findIndex((o) => String(o) === String(c.ans));

  if (ci >= 0 && btns[ci]) btns[ci].classList.add("ok");
  if (right) {
    mcRun.correct++; mcRun.streak++;
    mcRun.score += 10 + Math.ceil(mcRun.time) + (mcRun.streak >= 3 ? 5 : 0);
    S.flags.mcRight = (S.flags.mcRight || 0) + 1;
    sfx.ok();
  } else {
    mcRun.streak = 0;
    mcRun.lives -= 1;
    S.flags.mcWrong = (S.flags.mcWrong || 0) + 1;
    sfx.bad();
    if (k >= 0 && btns[k]) btns[k].classList.add("bad");
  }
  mcRun.answered += 1;

  const ex = $("#ex"), nx = $("#nx");
  if (ex) ex.innerHTML = \`<div class="explain">\${right ? "✅ Chính xác!" : (k < 0 ? "⏰ Hết giờ!" : "❌ Chưa đúng.")} \${c.exp}</div>\`;
  if (nx) {
    const over = mcRun.lives <= 0;
    nx.innerHTML = over
      ? \`<button class="btn" data-next="1">Xem kết quả</button>\`
      : \`<button class="btn" data-next="1">\${mcRun.correct >= MC_LEVEL_STEP ? "Lên màn! →" : "Câu tiếp theo →"}</button>\`;
    nx.onclick = () => { if (mcRun) mcNextQuestion(); };
  }

  mcPersist();          // ← lưu sau MỖI câu
}

function mcEndRun() {
  if (!mcRun) return;
  const snap = mcRun;
  mcRun = null;
  MC_PROGRESS.clear();   // hết ván → không cần giữ tiến độ dang dở
  sfx.win();
  finish({
    id: snap.id,
    score: snap.score,
    xp: snap.answered * 5,
    lines: [\`Màn cao nhất: \${snap.level}\`, \`Câu đúng: \${snap.correct}\`, \`Đã trả lời: \${snap.answered} câu\`],
    replay: false,
    details: { level: snap.level, answered: snap.answered },
  });
}

/**
 * Khởi động game dạng MC.
 * @param {string} id     khoá trong MC_MAKERS
 * @param {object} meta   { name, icon, badges }
 */
function startMcGame(id, meta) {
  if (typeof MC_MAKERS[id] !== "function") {
    console.error(\`[mcengine] chưa đăng ký maker cho "\${id}"\`);
    return;
  }
  MC_META = { id, name: meta.name, icon: meta.icon || "🎮" };

  // Đọc tiến độ TỪ ĐĨA — không tin biến trong bộ nhớ, để vào thẳng URL game
  // (F5, bookmark) vẫn khôi phục được.
  const saved = MC_PROGRESS.refresh();
  const keep = saved && saved.game === id;

  mcRun = {
    id,
    level: keep ? Math.max(1, saved.level || 1) : 1,
    score: keep ? (saved.score || 0) : 0,
    correct: keep ? (saved.correct || 0) : 0,
    answered: keep ? (saved.answered || 0) : 0,
    lives: keep && Number.isFinite(saved.lives) ? Math.max(1, saved.lives) : MC_START_LIVES,
    streak: 0, locked: false, cur: null, time: MC_RUN_SECS,
    justResumed: !!keep,
  };

  startSingleGame({
    id, name: meta.name, icon: meta.icon,
    storageKey: \`offline_\${id}\`,
    mount: () => { mcPersist(); mcNextQuestion(); },
    badges: meta.badges || [],
  });
}

// Lưu nốt khi đóng tab / đổi trang
window.addEventListener("beforeunload", () => { if (mcRun) mcPersist(); });
window.addEventListener("pagehide", () => { if (mcRun) mcPersist(); });

/** Kiểm tra tiến độ trong console: MC_PROGRESS.refresh() */
if (typeof window !== "undefined") window.MC_PROGRESS = MC_PROGRESS;
    <\/script>

    <!-- ⑥ Game: compare — nội dung riêng của file này -->
    <script>
// src/games/src/compare.js — Ai Nhiều Hơn? (So sánh)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const NAMES = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Huy', 'Lan', 'Mai', 'Nam', 'Phúc', 'Quân'];

MC_MAKERS.compare = function compare(level) {
        const a = rnd(10, 99 * level), b = rnd(10, 99 * level);
        const who = pickOne(NAMES);
        const wantBigger = rnd(2) === 0;
        const pool = [a, b];
        const target = wantBigger ? Math.max(a, b) : Math.min(a, b);
        const ans = String(target);
        const opts = shuffle([ans, ...distractors([String(Math.max(10, target + rnd(1, 9))), String(Math.max(1, target - rnd(1, 9))), String(target + 10), String(Math.max(1, target - 10))], ans).slice(0, 3)]);
        return {
          html: \`<div style="font-size:11px;opacity:.7">AI NHIỀU HƠN?</div>
                 <div style="font-size:22px;margin-top:8px">Trong <b>\${pool.join(' và ')}</b>, số nào
                   \${wantBigger ? '<b>LỚN</b>' : '<b>NHỎ</b>'} hơn?</div>
                 <div style="font-size:12px;opacity:.6;margin-top:6px">Người chơi tên: \${who}</div>\`,
          opts, ans,
          exp: \`\${target} là số \${wantBigger ? 'lớn nhất' : 'nhỏ nhất'} trong \${pool.join(' và ')}.\`,
        };
      },
startMcGame('compare', {
  name: 'Ai Nhiều Hơn?',
  icon: '⚖️',
  badges: [

  ],
});
    <\/script>
</body>
</html>
`,C=`<!DOCTYPE html>
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑤ Engine chung cho các game dạng câu hỏi (tiến độ lưu sau từng câu) -->
    <script>
// lib/mcengine.js — engine chung cho các game dạng "trả lời câu hỏi theo màn".
//
// 6 game (đảo chữ, đuổi màu, chuỗi số, so sánh, đố vui, đếm nhanh) dùng chung
// engine này. Mỗi file game chỉ cần đăng ký đúng 1 maker:
//
//   MC_MAKERS.<id> = function (level) { return { html, opts, ans, exp, style }; };
//   startMcGame('<id>', { name, icon, badges });
//
// Engine đảm nhiệm: vòng lặp màn, điểm, mạng, thanh thời gian và —
// QUAN TRỌNG — ghi/nhận tiến độ vào localStorage sau TỪNG câu để đóng tab
// rồi mở lại vẫn chơi tiếp đúng chỗ (game offline, không có API để hỏi).

const MC_LEVEL_STEP = 3;    // số câu đúng để lên màn
const MC_RUN_SECS = 25;     // giây cho mỗi câu
const MC_START_LIVES = 3;
const MC_PROGRESS_TTL = 30 * 24 * 60 * 60 * 1000;

/** Registry maker, mỗi file game tự đăng ký 1 hàm. */
const MC_MAKERS = {};

/** Game đang chại + metadata, dùng để dựng khoá tiến độ. */
let MC_META = { id: "mc", name: "Game", icon: "🎮" };
let mcRun = null;

function mcProgressKey() { return \`offline_\${MC_META.id}_progress\`; }

// ── Lớp tiến độ ─────────────────────────────────────────────────────────────
const MC_PROGRESS = {
  data: null,

  read() {
    try {
      const raw = localStorage.getItem(mcProgressKey());
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object" || !d.game) return null;
      if (d.updatedAt && Date.now() - d.updatedAt > MC_PROGRESS_TTL) { this.clear(); return null; }
      return d;
    } catch { return null; }
  },

  refresh() { this.data = this.read(); return this.data; },

  write(d) {
    d.updatedAt = Date.now();
    this.data = d;
    try { localStorage.setItem(mcProgressKey(), JSON.stringify(d)); } catch (e) { /* private mode */ }
    return d;
  },

  save(patch) { return this.write({ ...(this.data || {}), ...patch }); },

  clear() {
    this.data = null;
    try { localStorage.removeItem(mcProgressKey()); } catch (e) { /* ignore */ }
  },

  ago() {
    if (!this.data?.updatedAt) return "";
    const m = Math.floor((Date.now() - this.data.updatedAt) / 60000);
    if (m < 1) return "vừa xong";
    if (m < 60) return \`\${m} phút trước\`;
    const h = Math.floor(m / 60);
    if (h < 24) return \`\${h} giờ trước\`;
    return \`\${Math.floor(h / 24)} ngày trước\`;
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Chọn 1 phần tử ngẫu nhiên. */
function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

/** Lấy n phần tử ngẫu nhiên không trùng nhau. */
function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

/** Sinh n đáp án sai khác đáp án đúng. */
function distractors(pool, right, n = 3) {
  return sample([...new Set(pool.filter((x) => x !== right))], n);
}

/** Hiện số mạng: tối đa 5 tim, vượt quá thì ghi thêm số. */
function mcHearts(n) {
  const v = Math.max(0, Math.floor(n) || 0);
  return "❤️".repeat(Math.min(5, v)) + (v > 5 ? \` <b>+\${v - 5}</b>\` : "");
}

/** Ghi tiến độ ván hiện tại xuống localStorage. */
function mcPersist() {
  if (!mcRun) return;
  MC_PROGRESS.save({
    game: mcRun.id, name: MC_META.name, icon: MC_META.icon,
    level: mcRun.level, score: mcRun.score, correct: mcRun.correct,
    answered: mcRun.answered, lives: mcRun.lives,
  });
}

// ── Vòng lặp ván ────────────────────────────────────────────────────────────
function mcNextQuestion() {
  if (!mcRun) return;

  while (mcRun.correct >= MC_LEVEL_STEP) {
    mcRun.correct -= MC_LEVEL_STEP;
    mcRun.level += 1;
    mcRun.score += 25;
    sfx.win();
    toast(\`🎉 Lên màn \${mcRun.level}!\`);
  }
  if (mcRun.lives <= 0) { mcEndRun(); return; }

  mcRun.locked = false;
  mcRun.time = MC_RUN_SECS;
  mcRun.cur = MC_MAKERS[mcRun.id](mcRun.level);
  mcPersist();
  mcRender();
  mcStartTimer();
}

function mcStartTimer() {
  T.int(() => {
    if (!mcRun || mcRun.locked) return;
    mcRun.time -= 0.1;
    const bar = $("#tb");
    if (bar) bar.style.width = Math.max(0, (mcRun.time / MC_RUN_SECS) * 100) + "%";
    if (mcRun.time <= 0) mcAnswer(-1);       // hết giờ = trả lời sai
  }, 100);
}

function mcRender() {
  const c = mcRun.cur;
  const resumed = mcRun.justResumed;
  mcRun.justResumed = false;

  $("#stage").innerHTML = \`
    <div class="hud">
      <span>Màn <b>\${mcRun.level}</b></span>
      <span>⭐ <b>\${mcRun.score}</b></span>
      <span>💗 \${mcHearts(mcRun.lives)}</span>
      <span>🔥 <b>\${mcRun.correct}/\${MC_LEVEL_STEP}</b></span>
    </div>
    <div class="tbar"><i id="tb" style="width:100%"></i></div>
    \${resumed ? \`<div class="explain" style="border-left:3px solid var(--amber)">
        ▶ Đã khôi phục tiến độ từ localStorage — màn \${mcRun.level}, \${mcRun.score} ⭐</div>\` : ""}
    <div class="qbox">\${c.html}</div>
    <div class="opts" id="opts">
      \${c.opts.map((o, k) => \`<button class="opt" data-k="\${k}" \${c.style ? \`style="\${c.style[k]}"\` : ""}>\${o}</button>\`).join("")}
    </div>
    <div id="ex"></div>
    <div class="row" id="nx"></div>\`;

  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt");
    if (b) mcAnswer(+b.dataset.k);
  };
}

/** Trả lời. k = -1 nghĩa là hết giờ. */
function mcAnswer(k) {
  if (!mcRun || mcRun.locked) return;
  mcRun.locked = true;

  const c = mcRun.cur;
  const btns = [...document.querySelectorAll("#opts .opt")];
  const right = k >= 0 && String(c.opts[k]) === String(c.ans);
  const ci = c.opts.findIndex((o) => String(o) === String(c.ans));

  if (ci >= 0 && btns[ci]) btns[ci].classList.add("ok");
  if (right) {
    mcRun.correct++; mcRun.streak++;
    mcRun.score += 10 + Math.ceil(mcRun.time) + (mcRun.streak >= 3 ? 5 : 0);
    S.flags.mcRight = (S.flags.mcRight || 0) + 1;
    sfx.ok();
  } else {
    mcRun.streak = 0;
    mcRun.lives -= 1;
    S.flags.mcWrong = (S.flags.mcWrong || 0) + 1;
    sfx.bad();
    if (k >= 0 && btns[k]) btns[k].classList.add("bad");
  }
  mcRun.answered += 1;

  const ex = $("#ex"), nx = $("#nx");
  if (ex) ex.innerHTML = \`<div class="explain">\${right ? "✅ Chính xác!" : (k < 0 ? "⏰ Hết giờ!" : "❌ Chưa đúng.")} \${c.exp}</div>\`;
  if (nx) {
    const over = mcRun.lives <= 0;
    nx.innerHTML = over
      ? \`<button class="btn" data-next="1">Xem kết quả</button>\`
      : \`<button class="btn" data-next="1">\${mcRun.correct >= MC_LEVEL_STEP ? "Lên màn! →" : "Câu tiếp theo →"}</button>\`;
    nx.onclick = () => { if (mcRun) mcNextQuestion(); };
  }

  mcPersist();          // ← lưu sau MỖI câu
}

function mcEndRun() {
  if (!mcRun) return;
  const snap = mcRun;
  mcRun = null;
  MC_PROGRESS.clear();   // hết ván → không cần giữ tiến độ dang dở
  sfx.win();
  finish({
    id: snap.id,
    score: snap.score,
    xp: snap.answered * 5,
    lines: [\`Màn cao nhất: \${snap.level}\`, \`Câu đúng: \${snap.correct}\`, \`Đã trả lời: \${snap.answered} câu\`],
    replay: false,
    details: { level: snap.level, answered: snap.answered },
  });
}

/**
 * Khởi động game dạng MC.
 * @param {string} id     khoá trong MC_MAKERS
 * @param {object} meta   { name, icon, badges }
 */
function startMcGame(id, meta) {
  if (typeof MC_MAKERS[id] !== "function") {
    console.error(\`[mcengine] chưa đăng ký maker cho "\${id}"\`);
    return;
  }
  MC_META = { id, name: meta.name, icon: meta.icon || "🎮" };

  // Đọc tiến độ TỪ ĐĨA — không tin biến trong bộ nhớ, để vào thẳng URL game
  // (F5, bookmark) vẫn khôi phục được.
  const saved = MC_PROGRESS.refresh();
  const keep = saved && saved.game === id;

  mcRun = {
    id,
    level: keep ? Math.max(1, saved.level || 1) : 1,
    score: keep ? (saved.score || 0) : 0,
    correct: keep ? (saved.correct || 0) : 0,
    answered: keep ? (saved.answered || 0) : 0,
    lives: keep && Number.isFinite(saved.lives) ? Math.max(1, saved.lives) : MC_START_LIVES,
    streak: 0, locked: false, cur: null, time: MC_RUN_SECS,
    justResumed: !!keep,
  };

  startSingleGame({
    id, name: meta.name, icon: meta.icon,
    storageKey: \`offline_\${id}\`,
    mount: () => { mcPersist(); mcNextQuestion(); },
    badges: meta.badges || [],
  });
}

// Lưu nốt khi đóng tab / đổi trang
window.addEventListener("beforeunload", () => { if (mcRun) mcPersist(); });
window.addEventListener("pagehide", () => { if (mcRun) mcPersist(); });

/** Kiểm tra tiến độ trong console: MC_PROGRESS.refresh() */
if (typeof window !== "undefined") window.MC_PROGRESS = MC_PROGRESS;
    <\/script>

    <!-- ⑥ Game: riddle — nội dung riêng của file này -->
    <script>
// src/games/src/riddle.js — Đố Vui Nhanh (Kiến thức)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const RIDDLES = [
      ['Con gì có cổ dài nhất?', ['Hươu cao cổ', 'Cổ voi', 'Rắn', 'Cò'], 'Hươu cao cổ', 'Cổ hươu cao cổ dài hơn cả chiếc xe!'],
      ['1 + 1 bằng mấy?', ['1', '2', '3', '11'], '2', 'Hai.'],
      ['Sông nào dài nhất thế giới?', ['Amazon', 'Sông Nile', 'Sông Đà', 'Sông Hồng'], 'Amazon', 'Amazon dài hơn Nile.'],
      ['Mặt trời mọc từ hướng nào?', ['Đông', 'Tây', 'Bắc', 'Nam'], 'Đông', 'Mặt trời mọc ở hướng Đông.'],
      ['Tháng nào có ít ngày nhất?', ['Tháng 2', 'Tháng 1', 'Tháng 4', 'Tháng 6'], 'Tháng 2', 'Tháng 2 thường có 28 ngày.'],
      ['Cành cây nào to nhất?', ['Rễ', 'Cành', 'Lá', 'Hạt'], 'Rễ', 'Rễ cây to bằng thân hoặc hơn.'],
      ['Vịt con kêu gì?', ['Vít', 'Bíp', 'Kẹt', 'Héc'], 'Vít', 'Tiếng vịt con là “vít”.'],
      ['Hành tinh nào gần Mặt Trời nhất?', ['Trái Đất', 'Sao Thiên Vương', 'Sao Thủy', 'Sao Sao'], 'Sao Thủy', 'Sao Thủy là hành tinh gần Mặt Trời nhất.'],
      ['Cá sống ở đâu?', ['Dưới nước', 'Trên cây', 'Trên trời', 'Trong đất'], 'Dưới nước', 'Cá sống dưới nước.'],
      ['Ba số 2 cộng 2 số 2 bằng mấy?', ['4', '6', '8', '22'], '8', '2+2+2+2 = 8.'],
      ['Hình vuông có mấy cạnh?', ['3', '4', '5', '6'], '4', 'Hình vuông có 4 cạnh.'],
      ['Bạn nào giỏ toán nhất?', ['Tim', 'Cẩn', 'Lan', 'Mỹ'], 'Mỹ', 'Chơi cùng “Mỹ” ở trường học Việt Nam.'],
    ];

MC_MAKERS.riddle = function riddle(level) {
        const [q, opts, ans, exp] = pickOne(RIDDLES);
        return {
          html: \`<div style="font-size:11px;opacity:.7">ĐỐ VUI NHANH</div>
                 <div style="font-size:22px;margin-top:8px">\${q}</div>\`,
          opts: [...opts], ans, exp,
        };
      },
startMcGame('riddle', {
  name: 'Đố Vui Nhanh',
  icon: '💡',
  badges: [

  ],
});
    <\/script>
</body>
</html>
`,w=`<!DOCTYPE html>
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


    <!-- ① Cấu hình API — đặt trước khi load api.js -->
    <script>
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';
        window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
    <\/script>

    <!-- ② api.js: giao tiếp backend (nhúng trực tiếp vì iframe srcDoc không tải được file ngoài) -->
    <script>
const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\\/$/, '');

  /** Hàm lấy JWT token. Gán qua window.GAME_API_TOKEN_FN. */
  const getToken = () =>
    typeof window.GAME_API_TOKEN_FN === 'function'
      ? window.GAME_API_TOKEN_FN()
      : localStorage.getItem('token') || sessionStorage.getItem('token') || null;

  const OFFLINE_KEY   = 'miniGame_pendingResults';
  const SESSION_KEY   = 'miniGame_currentSession';

  /* ── Helpers HTTP ────────────────────────────────────────────────────── */

  function _headers() {
    const h = { 'Content-Type': 'application/json' };
    const tok = getToken();
    if (tok) h['Authorization'] = \`Bearer \${tok}\`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(\`GET \${path} → \${res.status}\`);
    return res.json();
  }

  /** POST với auth */
  async function _post(path, body) {
    const res = await fetch(BASE() + path, {
      method:  'POST',
      headers: _headers(),
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.msg || \`POST \${path} → \${res.status}\`), { status: res.status, body: err });
    }
    return res.json();
  }

  /* ── Session ─────────────────────────────────────────────────────────── */

  let _currentSession = null;  // { sessionId, game, startedAt }

  /** Gọi khi openGame(id) — tạo session anti-cheat trên server. */
  async function startSession(game) {
    if (!BASE()) return null;  // chưa cấu hình API
    const tok = getToken();
    if (!tok) return null;     // chưa đăng nhập

    try {
      const res = await _post('/api/mini/sessions', { game });
      _currentSession = { sessionId: res.data.sessionId, game, startedAt: res.data.startedAt };
      // Lưu vào sessionStorage để phục hồi nếu tab bị tải lại giữa chừng
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_currentSession)); } catch { /* ignore */ }
      return _currentSession;
    } catch (e) {
      console.warn('[GameAPI] Không tạo được session:', e.message);
      _currentSession = null;
      return null;
    }
  }

  /** Khôi phục session từ sessionStorage (nếu tab bị reload) */
  function _restoreSession(game) {
    if (_currentSession?.game === game) return _currentSession;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.game === game) { _currentSession = saved; return saved; }
    } catch { /* ignore */ }
    return null;
  }

  /* ── Submit result ────────────────────────────────────────────────────── */

  /**
   * Gửi kết quả ván chơi. Tự động xử lý offline.
   *
   * @param {{ game: string, score: number, details?: object }} payload
   * @returns {object|null} response data từ server hoặc null nếu lỗi
   */
  async function submitResult({ game, score, details = {} }) {
    if (!BASE()) return null;
    const tok = getToken();
    if (!tok) return null;

    const session = _restoreSession(game);
    const sessionId = session?.sessionId ?? null;

    const body = { game, score, details };
    if (sessionId) body.sessionId = sessionId;

    try {
      const res = await _post('/api/mini/results', body);
      // Xóa session đã dùng
      _currentSession = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      // Thử gửi hàng đợi offline
      _flushPendingResults();
      return res.data;
    } catch (e) {
      // Lỗi mạng → đưa vào hàng đợi
      if (!e.status || e.status >= 500) {
        _enqueuePending({ game, score, details, sessionId, queuedAt: new Date().toISOString() });
        _showOfflineToast();
      }
      // Lỗi 4xx (score vượt trần, session sai, ...) → không xếp hàng
      return null;
    }
  }

  /* ── Offline queue ────────────────────────────────────────────────────── */

  function _getPending() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]'); }
    catch { return []; }
  }

  function _savePending(queue) {
    try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue)); }
    catch { /* storage đầy hoặc không có */ }
  }

  function _enqueuePending(item) {
    const queue = _getPending();
    // Giới hạn 50 ván chờ gửi
    if (queue.length >= 50) queue.shift();
    queue.push(item);
    _savePending(queue);
  }

  /** Thử gửi lại tất cả kết quả còn trong hàng đợi. */
  async function _flushPendingResults() {
    if (!BASE() || !getToken()) return;
    const queue = _getPending();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await _post('/api/mini/results', {
          sessionId: item.sessionId ?? undefined,
          game:      item.game,
          score:     item.score,
          details:   item.details ?? {},
        });
        // Gửi thành công → không giữ lại
      } catch (e) {
        if (!e.status || e.status >= 500) {
          remaining.push(item);  // lỗi mạng → giữ lại
        }
        // 4xx → bỏ luôn (sessionId hết hạn, score không hợp lệ...)
      }
    }
    _savePending(remaining);
  }

  function _showOfflineToast() {
    // toast() được khai báo trong game-core.js (cùng scope window)
    if (typeof toast === 'function') {
      toast('📶 Không có mạng — kết quả sẽ được gửi lại sau');
    }
  }

  /* ── Load profile ─────────────────────────────────────────────────────── */

  /**
   * Tải hồ sơ người chơi và nạp vào S (object trạng thái của game-core.js).
   * Gọi khi trang vừa tải xong.
   */
  async function loadProfile() {
    if (!BASE() || !getToken()) return null;
    try {
      const res = await _get('/api/mini/me');
      const p   = res.data;
      if (!p) return null;

      // Nạp vào S (game-core.js khai báo S ở global scope của script)
      if (typeof S !== 'undefined') {
        S.xp     = p.xp    ?? 0;
        S.best   = p.best  ?? {};
        S.played = new Set(p.played ?? []);
        S.unlocked = new Set((p.badges ?? []).map(b => b.id ?? b));
      }

      // Thử gửi lại kết quả còn trong hàng đợi offline
      _flushPendingResults();

      return p;
    } catch (e) {
      console.warn('[GameAPI] Không tải được hồ sơ:', e.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  // Gắn vào online event để tự flush khi có lại mạng
  window.addEventListener('online', () => {
    _flushPendingResults();
  });

  return {
    loadProfile,
    startSession,
    submitResult,
    flushPending: _flushPendingResults,
    /** Dùng nội bộ bởi game-core.js (leaderboard) */
    _get,
  };
})();
    <\/script>

    <!-- ③ core.js: thư viện dùng chung (XP, huy hiệu, âm thanh, bộ đếm, canvas) -->
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
        setTimeout(() => toast(\`\${b.icon} Huy hiệu mới: \${b.name}\`), 900);
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
  // Báo server bắt đầu ván mới
  GameAPI.startSession(id);
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
      let rows;
      if (key === 'xp') {
        const r = await GameAPI._get('/api/mini/leaderboard/xp?limit=20');
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.xp} XP</td><td>Cấp \${x.level}</td></tr>\`
        );
      } else {
        const r = await GameAPI._get(\`/api/mini/leaderboard/\${key}?limit=20\`);
        rows = (r.data || []).map((x, i) =>
          \`<tr><td>\${x.rank ?? i + 1}</td><td>\${x.displayName}</td><td>\${x.best} điểm</td><td></td></tr>\`
        );
      }
      $('#lb-body').innerHTML = rows.length
        ? \`<table style="width:100%;border-collapse:collapse">\${rows.join('')}</table>\`
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
    <\/script>

    <!-- ④ Điểm vào: khởi động game, nối nút thoát, lưu tiến độ -->
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

    <!-- ⑤ Engine chung cho các game dạng câu hỏi (tiến độ lưu sau từng câu) -->
    <script>
// lib/mcengine.js — engine chung cho các game dạng "trả lời câu hỏi theo màn".
//
// 6 game (đảo chữ, đuổi màu, chuỗi số, so sánh, đố vui, đếm nhanh) dùng chung
// engine này. Mỗi file game chỉ cần đăng ký đúng 1 maker:
//
//   MC_MAKERS.<id> = function (level) { return { html, opts, ans, exp, style }; };
//   startMcGame('<id>', { name, icon, badges });
//
// Engine đảm nhiệm: vòng lặp màn, điểm, mạng, thanh thời gian và —
// QUAN TRỌNG — ghi/nhận tiến độ vào localStorage sau TỪNG câu để đóng tab
// rồi mở lại vẫn chơi tiếp đúng chỗ (game offline, không có API để hỏi).

const MC_LEVEL_STEP = 3;    // số câu đúng để lên màn
const MC_RUN_SECS = 25;     // giây cho mỗi câu
const MC_START_LIVES = 3;
const MC_PROGRESS_TTL = 30 * 24 * 60 * 60 * 1000;

/** Registry maker, mỗi file game tự đăng ký 1 hàm. */
const MC_MAKERS = {};

/** Game đang chại + metadata, dùng để dựng khoá tiến độ. */
let MC_META = { id: "mc", name: "Game", icon: "🎮" };
let mcRun = null;

function mcProgressKey() { return \`offline_\${MC_META.id}_progress\`; }

// ── Lớp tiến độ ─────────────────────────────────────────────────────────────
const MC_PROGRESS = {
  data: null,

  read() {
    try {
      const raw = localStorage.getItem(mcProgressKey());
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object" || !d.game) return null;
      if (d.updatedAt && Date.now() - d.updatedAt > MC_PROGRESS_TTL) { this.clear(); return null; }
      return d;
    } catch { return null; }
  },

  refresh() { this.data = this.read(); return this.data; },

  write(d) {
    d.updatedAt = Date.now();
    this.data = d;
    try { localStorage.setItem(mcProgressKey(), JSON.stringify(d)); } catch (e) { /* private mode */ }
    return d;
  },

  save(patch) { return this.write({ ...(this.data || {}), ...patch }); },

  clear() {
    this.data = null;
    try { localStorage.removeItem(mcProgressKey()); } catch (e) { /* ignore */ }
  },

  ago() {
    if (!this.data?.updatedAt) return "";
    const m = Math.floor((Date.now() - this.data.updatedAt) / 60000);
    if (m < 1) return "vừa xong";
    if (m < 60) return \`\${m} phút trước\`;
    const h = Math.floor(m / 60);
    if (h < 24) return \`\${h} giờ trước\`;
    return \`\${Math.floor(h / 24)} ngày trước\`;
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Chọn 1 phần tử ngẫu nhiên. */
function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

/** Lấy n phần tử ngẫu nhiên không trùng nhau. */
function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

/** Sinh n đáp án sai khác đáp án đúng. */
function distractors(pool, right, n = 3) {
  return sample([...new Set(pool.filter((x) => x !== right))], n);
}

/** Hiện số mạng: tối đa 5 tim, vượt quá thì ghi thêm số. */
function mcHearts(n) {
  const v = Math.max(0, Math.floor(n) || 0);
  return "❤️".repeat(Math.min(5, v)) + (v > 5 ? \` <b>+\${v - 5}</b>\` : "");
}

/** Ghi tiến độ ván hiện tại xuống localStorage. */
function mcPersist() {
  if (!mcRun) return;
  MC_PROGRESS.save({
    game: mcRun.id, name: MC_META.name, icon: MC_META.icon,
    level: mcRun.level, score: mcRun.score, correct: mcRun.correct,
    answered: mcRun.answered, lives: mcRun.lives,
  });
}

// ── Vòng lặp ván ────────────────────────────────────────────────────────────
function mcNextQuestion() {
  if (!mcRun) return;

  while (mcRun.correct >= MC_LEVEL_STEP) {
    mcRun.correct -= MC_LEVEL_STEP;
    mcRun.level += 1;
    mcRun.score += 25;
    sfx.win();
    toast(\`🎉 Lên màn \${mcRun.level}!\`);
  }
  if (mcRun.lives <= 0) { mcEndRun(); return; }

  mcRun.locked = false;
  mcRun.time = MC_RUN_SECS;
  mcRun.cur = MC_MAKERS[mcRun.id](mcRun.level);
  mcPersist();
  mcRender();
  mcStartTimer();
}

function mcStartTimer() {
  T.int(() => {
    if (!mcRun || mcRun.locked) return;
    mcRun.time -= 0.1;
    const bar = $("#tb");
    if (bar) bar.style.width = Math.max(0, (mcRun.time / MC_RUN_SECS) * 100) + "%";
    if (mcRun.time <= 0) mcAnswer(-1);       // hết giờ = trả lời sai
  }, 100);
}

function mcRender() {
  const c = mcRun.cur;
  const resumed = mcRun.justResumed;
  mcRun.justResumed = false;

  $("#stage").innerHTML = \`
    <div class="hud">
      <span>Màn <b>\${mcRun.level}</b></span>
      <span>⭐ <b>\${mcRun.score}</b></span>
      <span>💗 \${mcHearts(mcRun.lives)}</span>
      <span>🔥 <b>\${mcRun.correct}/\${MC_LEVEL_STEP}</b></span>
    </div>
    <div class="tbar"><i id="tb" style="width:100%"></i></div>
    \${resumed ? \`<div class="explain" style="border-left:3px solid var(--amber)">
        ▶ Đã khôi phục tiến độ từ localStorage — màn \${mcRun.level}, \${mcRun.score} ⭐</div>\` : ""}
    <div class="qbox">\${c.html}</div>
    <div class="opts" id="opts">
      \${c.opts.map((o, k) => \`<button class="opt" data-k="\${k}" \${c.style ? \`style="\${c.style[k]}"\` : ""}>\${o}</button>\`).join("")}
    </div>
    <div id="ex"></div>
    <div class="row" id="nx"></div>\`;

  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt");
    if (b) mcAnswer(+b.dataset.k);
  };
}

/** Trả lời. k = -1 nghĩa là hết giờ. */
function mcAnswer(k) {
  if (!mcRun || mcRun.locked) return;
  mcRun.locked = true;

  const c = mcRun.cur;
  const btns = [...document.querySelectorAll("#opts .opt")];
  const right = k >= 0 && String(c.opts[k]) === String(c.ans);
  const ci = c.opts.findIndex((o) => String(o) === String(c.ans));

  if (ci >= 0 && btns[ci]) btns[ci].classList.add("ok");
  if (right) {
    mcRun.correct++; mcRun.streak++;
    mcRun.score += 10 + Math.ceil(mcRun.time) + (mcRun.streak >= 3 ? 5 : 0);
    S.flags.mcRight = (S.flags.mcRight || 0) + 1;
    sfx.ok();
  } else {
    mcRun.streak = 0;
    mcRun.lives -= 1;
    S.flags.mcWrong = (S.flags.mcWrong || 0) + 1;
    sfx.bad();
    if (k >= 0 && btns[k]) btns[k].classList.add("bad");
  }
  mcRun.answered += 1;

  const ex = $("#ex"), nx = $("#nx");
  if (ex) ex.innerHTML = \`<div class="explain">\${right ? "✅ Chính xác!" : (k < 0 ? "⏰ Hết giờ!" : "❌ Chưa đúng.")} \${c.exp}</div>\`;
  if (nx) {
    const over = mcRun.lives <= 0;
    nx.innerHTML = over
      ? \`<button class="btn" data-next="1">Xem kết quả</button>\`
      : \`<button class="btn" data-next="1">\${mcRun.correct >= MC_LEVEL_STEP ? "Lên màn! →" : "Câu tiếp theo →"}</button>\`;
    nx.onclick = () => { if (mcRun) mcNextQuestion(); };
  }

  mcPersist();          // ← lưu sau MỖI câu
}

function mcEndRun() {
  if (!mcRun) return;
  const snap = mcRun;
  mcRun = null;
  MC_PROGRESS.clear();   // hết ván → không cần giữ tiến độ dang dở
  sfx.win();
  finish({
    id: snap.id,
    score: snap.score,
    xp: snap.answered * 5,
    lines: [\`Màn cao nhất: \${snap.level}\`, \`Câu đúng: \${snap.correct}\`, \`Đã trả lời: \${snap.answered} câu\`],
    replay: false,
    details: { level: snap.level, answered: snap.answered },
  });
}

/**
 * Khởi động game dạng MC.
 * @param {string} id     khoá trong MC_MAKERS
 * @param {object} meta   { name, icon, badges }
 */
function startMcGame(id, meta) {
  if (typeof MC_MAKERS[id] !== "function") {
    console.error(\`[mcengine] chưa đăng ký maker cho "\${id}"\`);
    return;
  }
  MC_META = { id, name: meta.name, icon: meta.icon || "🎮" };

  // Đọc tiến độ TỪ ĐĨA — không tin biến trong bộ nhớ, để vào thẳng URL game
  // (F5, bookmark) vẫn khôi phục được.
  const saved = MC_PROGRESS.refresh();
  const keep = saved && saved.game === id;

  mcRun = {
    id,
    level: keep ? Math.max(1, saved.level || 1) : 1,
    score: keep ? (saved.score || 0) : 0,
    correct: keep ? (saved.correct || 0) : 0,
    answered: keep ? (saved.answered || 0) : 0,
    lives: keep && Number.isFinite(saved.lives) ? Math.max(1, saved.lives) : MC_START_LIVES,
    streak: 0, locked: false, cur: null, time: MC_RUN_SECS,
    justResumed: !!keep,
  };

  startSingleGame({
    id, name: meta.name, icon: meta.icon,
    storageKey: \`offline_\${id}\`,
    mount: () => { mcPersist(); mcNextQuestion(); },
    badges: meta.badges || [],
  });
}

// Lưu nốt khi đóng tab / đổi trang
window.addEventListener("beforeunload", () => { if (mcRun) mcPersist(); });
window.addEventListener("pagehide", () => { if (mcRun) mcPersist(); });

/** Kiểm tra tiến độ trong console: MC_PROGRESS.refresh() */
if (typeof window !== "undefined") window.MC_PROGRESS = MC_PROGRESS;
    <\/script>

    <!-- ⑥ Game: shapecount — nội dung riêng của file này -->
    <script>
// src/games/src/shapecount.js — Đếm Nhanh (Tập trung)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

MC_MAKERS.shapecount = function shapecount(level) {
        const shape = pickOne(['🔺', '🔵', '🟨', '🟩', '🟥', '⬛', '🔶']);
        const total = rnd(5, 8 + level * 2);
        const oddAt = rnd(total);
        const noise = sample(['⭐', '❤️', '🌙', '⚡', '🎈', '🍀'].filter(s => s !== shape), 1)[0];
        const cells = shuffle(Array.from({ length: total }, (_, i) => (i === oddAt ? shape : noise)));
        const right = cells.filter(c => c === shape).length;
        const opts = shuffle([String(right), ...distractors([String(right + 1), String(right - 1), String(right + 2), String(right + 3), 1, 0].map(String), String(right)).slice(0, 3)]);
        return {
          html: \`<div style="font-size:11px;opacity:.7">ĐẾM NHANH</div>
                 <div style="font-size:12px;opacity:.7;margin-top:6px">Có bao nhiêu biểu tượng
                   <b style="font-size:20px">\${shape}</b>?</div>
                 <div style="font-size:26px;letter-spacing:6px;line-height:1.7;margin-top:10px">\${cells.join(' ')}</div>\`,
          opts, ans: String(right),
          exp: \`Có <b>\${right}</b> biểu tượng \${shape}.\`,
        };
      },
startMcGame('shapecount', {
  name: 'Đếm Nhanh',
  icon: '🔷',
  badges: [

  ],
});
    <\/script>
</body>
</html>
`,T=n(),E={math:c,memory:l,scramble:u,quiz:d,snake:f,flap:p,g2048:m,chem:h,clock:g,pattern:_,simon:v,anagram:y,stroop:b,sumseq:x,compare:S,riddle:C,shapecount:w};function D({gameId:e}){let{user:t,token:n}=r(),c=t?{user:t,token:n}:null,l=(0,s.useMemo)(()=>a(e),[e]),u=E[e];return!l||!u?(0,T.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-paper`,children:(0,T.jsxs)(`div`,{className:`text-center`,children:[(0,T.jsx)(`div`,{className:`text-5xl`,children:`🤔`}),(0,T.jsx)(`p`,{className:`mt-3 font-display text-lg font-bold text-ink`,children:`Không tìm thấy game`}),(0,T.jsxs)(`p`,{className:`mt-1 text-sm text-slate-500`,children:[`id: `,String(e||`(rỗng)`)]}),(0,T.jsx)(`button`,{onClick:()=>i(`/`),className:`mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600 shadow-sm hover:bg-slate-200`,children:`← Về trang chủ`})]})}):(0,T.jsx)(`div`,{className:`fixed inset-0 bg-[#0c2a30]`,children:(0,T.jsx)(o,{htmlContent:u,game:{id:`offline_${e}`,code:`offline_${e}`,name:l.name,title:l.name,subject:l.tag},questions:[],playerName:t?.fullName||t?.username||`An Nhiên`,playMode:`solo`,userAuth:c,onFinish:()=>{},onQuit:()=>i(`/`),onStateUpdate:()=>{}},`offline-${e}`)})}export{D as default};