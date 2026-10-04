
/**
 * api.js — Module giao tiếp với backend cho 16 mini-game
 *
 * Chức năng:
 *   - loadProfile()    : tải hồ sơ người chơi từ GET /api/mini/me
 *   - startSession()   : tạo session chống gian lận qua POST /api/mini/sessions
 *   - submitResult()   : gửi kết quả ván qua POST /api/mini/results (idempotent)
 *   - Hàng đợi offline : lưu vào localStorage khi mất mạng, gửi lại khi có mạng
 *
 * Cấu hình:
 *   Đặt BASE_URL và cách lấy token bằng cách gán window.GAME_API_BASE và
 *   window.GAME_API_TOKEN_FN trước khi load file này, hoặc để dùng default.
 *
 * Ví dụ cấu hình trong HTML:
 *   <script>
 *     window.GAME_API_BASE     = 'https://api.example.com';
 *     window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');
 *   <\/script>
 *   <script src="api.js"><\/script>
 */

const GameAPI = (() => {
  /* ── Cấu hình ────────────────────────────────────────────────────────── */

  /** Base URL của backend. Gán qua window.GAME_API_BASE trước khi load. */
  const BASE = () =>
    (window.GAME_API_BASE || '').replace(/\/$/, '');

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
    if (tok) h['Authorization'] = `Bearer ${tok}`;
    return h;
  }

  /** GET với auth */
  async function _get(path) {
    const res = await fetch(BASE() + path, { headers: _headers() });
    if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
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
      throw Object.assign(new Error(err.msg || `POST ${path} → ${res.status}`), { status: res.status, body: err });
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
