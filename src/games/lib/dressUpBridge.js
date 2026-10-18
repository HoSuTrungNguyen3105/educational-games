/* eslint-disable */
/**
 * dressUpBridge.js — lớp lưu trữ cho 2 game tạo avatar
 *
 * Nguyên tắc: CLIENT LÀ NGUỒN CHÍNH.
 *   1. Mọi thay đổi → ghi localStorage NGAY (chơi offline vẫn nhớ).
 *   2. Đồng thời bắn postMessage `outfit-save` lên frame cha để frame cha
 *      gọi PUT /api/auth/me với body { avatar, pet }.
 *   3. Frame cha trả `outfit-saved`; game cập nhật nhãn trạng thái.
 *
 * Không gọi /api/avatar/* ở đây — avatar của 2 game này độc lập với hệ
 * avatarLoadout (code + inventory) sẵn có của app.
 *
 * API:
 *   EG_OUTFIT.get(scope)          scope = 'pet' | 'avatar' → { value, updatedAt } | null
 *   EG_OUTFIT.set(scope, value)   sanitize → lưu local → hẹn giờ đồng bộ
 *   EG_OUTFIT.status(msg, kind)   cập nhật nhãn #egSync (kind: 'ok'|'err'|'wait')
 *   EG_OUTFIT.bind()              gắn listener init + outfit-saved (tự gọi 1 lần)
 *
 * Sự kiện DOM:
 *   window.addEventListener('eg-outfit', e => {
 *     // e.detail = { scope, value, source: 'local' | 'server' }
 *   });
 */
(function (root) {
  'use strict';

  var PREFIX = 'eg-outfit-';
  var VERSION = 'v1';
  var SYNC_DELAY = 700;

  var _timers = {};
  var _pending = {};

  function storeKey(scope) { return PREFIX + scope + '-' + VERSION; }

  function sanitize(scope, value) {
    var D = root.EG_DRESSUP;
    if (!D) return null;
    try { return scope === 'pet' ? D.sanitizePet(value) : D.sanitizeKid(value); }
    catch (e) { return null; }
  }

  /* ── localStorage (mem fallback khi bị chặn) ───────────────────────── */

  var _mem = {};
  function lsRead(scope) {
    try {
      var raw = localStorage.getItem(storeKey(scope));
      if (raw) return raw;
    } catch (e) { /* bị chặn */ }
    return _mem[scope] || null;
  }
  function lsWrite(scope, value) {
    var raw = JSON.stringify(value);
    _mem[scope] = raw;
    try { localStorage.setItem(storeKey(scope), raw); } catch (e) { /* dùng mem */ }
  }

  /* ── đọc / ghi ─────────────────────────────────────────────────────── */

  function get(scope) {
    var raw = lsRead(scope);
    if (!raw) return null;
    try {
      var box = JSON.parse(raw);
      var clean = sanitize(scope, box && box.value);
      if (!clean) return null;
      return { value: clean, updatedAt: (box && box.updatedAt) || null };
    } catch (e) { return null; }
  }

  function emit(scope, value, source) {
    try {
      root.dispatchEvent(new CustomEvent('eg-outfit', { detail: { scope: scope, value: value, source: source } }));
    } catch (e) { /* ignore */ }
  }

  /**
   * @param {string} scope  'pet' | 'avatar'
   * @param {object} value  state thô, tự sanitize
   * @param {{updatedAt?:string, fromServer?:boolean}} [opts]
   */
  function set(scope, value, opts) {
    var clean = sanitize(scope, value);
    if (!clean) return null;
    var fromServer = !!(opts && opts.fromServer);
    var stamp = (opts && opts.updatedAt) || new Date().toISOString();
    lsWrite(scope, { v: 1, value: clean, updatedAt: stamp });
    /* Nội dung lấy từ hồ sơ thì không đẩy ngược lại, tránh ping-pong vô hạn. */
    if (!fromServer) scheduleSync(scope, stamp);
    emit(scope, clean, fromServer ? 'server' : 'local');
    return clean;
  }

  function clear(scope) {
    delete _mem[scope];
    try { localStorage.removeItem(storeKey(scope)); } catch (e) { /* ignore */ }
  }

  /* ── đồng bộ lên profile ───────────────────────────────────────────── */

  function post(type, data) {
    try {
      if (root.parent && root.parent !== root) root.parent.postMessage({ type: type, data: data }, '*');
    } catch (e) { /* ignore */ }
  }

  function scheduleSync(scope, updatedAt) {
    if (_timers[scope]) clearTimeout(_timers[scope]);
    _timers[scope] = setTimeout(function () { sync(scope, updatedAt); }, SYNC_DELAY);
  }

  function sync(scope, updatedAt) {
    var box = get(scope);
    if (!box) return;
    _pending[scope] = true;
    status('⏳ Đang lưu vào hồ sơ…', 'wait');
    post('outfit-save', { scope: scope, value: box.value, updatedAt: updatedAt || box.updatedAt });
  }

  /** Đẩy ngay, không chờ debounce (dùng khi game đóng / rời trang). */
  function syncNow(scope) {
    if (_timers[scope]) { clearTimeout(_timers[scope]); _timers[scope] = null; }
    var box = get(scope);
    if (box) sync(scope, box.updatedAt);
  }

  function syncAllNow() { syncNow('avatar'); syncNow('pet'); }

  /* ── nhãn trạng thái ───────────────────────────────────────────────── */

  function status(text, kind) {
    var el = document.getElementById('egSync');
    if (!el) return;
    el.textContent = text || '';
    el.dataset.kind = kind || '';
    el.hidden = !text;
  }

  /* ── nhận init + kết quả từ frame cha ──────────────────────────────── */

  /**
   * Gắn listener init + outfit-saved. Game bắt sự kiện `eg-outfit` để vẽ lại khi
   * hồ sơ trên server có bản mới hơn bản đang có trên máy.
   *   addEventListener('eg-outfit', e => { if (e.detail.scope === 'pet') redraw(); })
   */
  function bind() {
    root.addEventListener('message', function (e) {
      var msg = e.data;
      if (!msg || typeof msg !== 'object') return;

      if (msg.type === 'init') {
        var d = msg.data || {};
        /* Hồ sơ trên server mới hơn bản local thì thắng. */
        ['pet', 'avatar'].forEach(function (scope) {
          var server = d[scope];
          if (!server || !server.value) return;
          var mine = get(scope);
          var mineTs = mine && mine.updatedAt ? Date.parse(mine.updatedAt) : 0;
          var srvTs = server.updatedAt ? Date.parse(server.updatedAt) : 0;
          if (!mine || srvTs >= mineTs) set(scope, server.value, { updatedAt: server.updatedAt, fromServer: true });
        });
        return;
      }

      if (msg.type === 'outfit-saved') {
        var r = msg.data || {};
        if (r.ok) {
          if (r.value && r.scope) lsWrite(r.scope, { v: 1, value: sanitize(r.scope, r.value) || r.value, updatedAt: r.updatedAt || null });
          status('✔ Đã lưu vào hồ sơ', 'ok');
        } else {
          status('⚠ Đã lưu trên máy, chưa lên được hồ sơ', 'err');
        }
      }
    });
  }

  root.EG_OUTFIT = {
    get: get,
    set: set,
    clear: clear,
    status: status,
    bind: bind,
    sync: syncNow,
    syncAll: syncAllNow
  };

  bind();
})(typeof window !== 'undefined' ? window : globalThis);