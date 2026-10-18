/**
 * MultiplayerBridge.js - Shared component for game mode selection and multiplayer.
 *
 * Usage in HTML games:
 * var bridge = new MultiplayerBridge({ gameId, gameName, gameCode });
 * bridge.onReady(fn) - called when game can start
 * bridge.onOpponentMove(fn) - called when opponent makes a move
 * bridge.onInviteAccepted(fn) - called when invite is accepted (multiplayer starts)
 *
 * Communication: postMessage with parent React app.
 * Parent handles: auth, API calls, socket events.
 */
(function () {
  'use strict';

  const BRIDGE_STYLE = `
    .mp-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.85); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #fff; animation: mpFadeIn 0.3s ease;
    }
    @keyframes mpFadeIn { from { opacity: 0; } to { opacity: 1; } }
    .mp-modal {
      background: #1e2a4a; border-radius: 20px; padding: 32px;
      max-width: 420px; width: 90%; text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: mpSlideUp 0.3s ease;
    }
    @keyframes mpSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .mp-modal h2 { font-size: 1.5rem; margin-bottom: 8px; }
    .mp-modal p { font-size: 0.9rem; opacity: 0.7; margin-bottom: 20px; }
    .mp-btn-group { display: flex; gap: 12px; margin-bottom: 20px; }
    .mp-btn {
      flex: 1; padding: 14px 12px; border-radius: 14px;
      border: 2px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05);
      color: #fff; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;
    }
    .mp-btn:hover { border-color: #4ecdc4; background: rgba(78,205,196,0.1); transform: translateY(-2px); }
    .mp-btn.selected { border-color: #4ecdc4; background: rgba(78,205,196,0.2); }
    .mp-btn .mp-icon { font-size: 2rem; display: block; margin-bottom: 6px; }
    .mp-search-box { margin-bottom: 16px; }
    .mp-search-input {
      width: 100%; padding: 10px 14px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08);
      color: #fff; font-size: 0.9rem; outline: none; box-sizing: border-box;
    }
    .mp-search-input::placeholder { color: rgba(255,255,255,0.4); }
    .mp-search-input:focus { border-color: #4ecdc4; }
    .mp-user-list { max-height: 200px; overflow-y: auto; margin-bottom: 16px; }
    .mp-user-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px; cursor: pointer;
      transition: background 0.15s; margin-bottom: 4px;
    }
    .mp-user-item:hover { background: rgba(255,255,255,0.08); }
    .mp-user-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
    }
    .mp-user-info { text-align: left; flex: 1; min-width: 0; }
    .mp-user-name { font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mp-user-sub { font-size: 0.75rem; opacity: 0.5; }
    .mp-invite-btn {
      padding: 6px 14px; border-radius: 8px; border: none;
      background: #4ecdc4; color: #1a1a2e; font-weight: 700;
      font-size: 0.8rem; cursor: pointer; flex-shrink: 0;
    }
    .mp-invite-btn:hover { filter: brightness(1.1); }
    .mp-invite-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .mp-status {
      padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.05);
      font-size: 0.85rem; margin-bottom: 16px;
    }
    .mp-status.waiting { border-left: 3px solid #f4b942; }
    .mp-status.success { border-left: 3px solid #4ecdc4; }
    .mp-status.error { border-left: 3px solid #e94560; }
    .mp-back-btn {
      padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
      background: transparent; color: rgba(255,255,255,0.7); cursor: pointer;
      font-size: 0.85rem; margin-top: 8px;
    }
    .mp-back-btn:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
    .mp-spinner {
      display: inline-block; width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: #4ecdc4;
      border-radius: 50%; animation: mpSpin 0.6s linear infinite;
      vertical-align: middle; margin-right: 6px;
    }
    @keyframes mpSpin { to { transform: rotate(360deg); } }
  `;

  function injectStyles() {
    if (document.getElementById('mp-bridge-styles')) return;
    const style = document.createElement('style');
    style.id = 'mp-bridge-styles';
    style.textContent = BRIDGE_STYLE;
    document.head.appendChild(style);
  }

  function el(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') e.className = v;
      else if (k === 'onClick') e.addEventListener('click', v);
      else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v);
    });
    children.forEach(c => {
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    });
    return e;
  }

  class MultiplayerBridge {
    constructor(opts = {}) {
      this.gameId = opts.gameId || '';
      this.gameName = opts.gameName || 'Trò chơi';
      this.gameCode = opts.gameCode || '';
      this.authToken = opts.authToken || null;
      this.apiBase = opts.apiBase || '';
      this.playerName = opts.playerName || 'Player';
      this.userId = opts.userId || null;

      this._mode = null; // 'solo' | 'multiplayer'
      this._opponent = null;
      this._callbacks = {};
      this._overlay = null;
      this._searchTimeout = null;

      this._init();
    }

    _init() {
      injectStyles();
      window.addEventListener('message', (e) => this._onMessage(e.data));
      // Tell parent we're ready
      this._post({ type: 'bridge-ready' });
    }

    _post(msg) {
      window.parent.postMessage(msg, '*');
    }

    _onMessage(msg) {
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'init') {
        const d = msg.data || {};
        this.gameId = d.gameId || this.gameId;
        this.authToken = d.authToken || this.authToken;
        this.apiBase = d.apiBase || this.apiBase;
        this.playerName = d.playerName || this.playerName;
        this.userId = d.userId || this.userId;
        if (d.gameName) this.gameName = d.gameName;
        if (d.gameCode) this.gameCode = d.gameCode;
        // Auto-show mode selector if not in multiplayer mode
        if (d.playMode !== 'multiplayer' && !this._mode) {
          this.showModeSelector();
        }
      } else if (msg.type === 'search-results') {
        this._renderSearchResults(msg.data?.users || []);
      } else if (msg.type === 'invite-sent') {
        this._onInviteSent(msg.data);
      } else if (msg.type === 'invite-accepted') {
        this._onInviteAccepted(msg.data);
      } else if (msg.type === 'invite-declined') {
        this._onInviteDeclined(msg.data);
      } else if (msg.type === 'opponent-move') {
        this._emit('opponentMove', msg.data);
      } else if (msg.type === 'multiplayer-start') {
        this._emit('multiplayerStart', msg.data);
      }
    }

    on(event, cb) {
      if (!this._callbacks[event]) this._callbacks[event] = [];
      this._callbacks[event].push(cb);
      return this;
    }

    onReady(cb) { return this.on('ready', cb); }
    onOpponentMove(cb) { return this.on('opponentMove', cb); }
    onInviteAccepted(cb) { return this.on('inviteAccepted', cb); }
    onMultiplayerStart(cb) { return this.on('multiplayerStart', cb); }

    _emit(event, data) {
      (this._callbacks[event] || []).forEach(cb => cb(data));
    }

    getMode() { return this._mode; }
    getOpponent() { return this._opponent; }

    // ===== Mode Selector UI =====
    showModeSelector() {
      if (this._overlay) this._overlay.remove();
      this._overlay = el('div', { className: 'mp-overlay' });

      const modal = el('div', { className: 'mp-modal' });
      modal.appendChild(el('h2', null, '🎮 Chọn chế độ chơi'));
      modal.appendChild(el('p', null, this.gameName));

      const btnGroup = el('div', { className: 'mp-btn-group' });

      const soloBtn = el('button', { className: 'mp-btn', onClick: () => this._selectMode('solo') },
        el('span', { className: 'mp-icon' }, '🤖'),
        'Chơi với máy'
      );

      const multiBtn = el('button', { className: 'mp-btn', onClick: () => this._selectMode('multiplayer') },
        el('span', { className: 'mp-icon' }, '👥'),
        'Chơi với người'
      );

      btnGroup.appendChild(soloBtn);
      btnGroup.appendChild(multiBtn);
      modal.appendChild(btnGroup);
      this._overlay.appendChild(modal);
      document.body.appendChild(this._overlay);
    }

    _selectMode(mode) {
      this._mode = mode;
      this._post({ type: 'mode-selected', data: { mode } });

      if (mode === 'solo') {
        this._removeOverlay();
        this._emit('ready', { mode: 'solo' });
      } else {
        this._showUserSearch();
      }
    }

    // ===== User Search UI =====
    _showUserSearch() {
      if (this._overlay) this._overlay.remove();
      this._overlay = el('div', { className: 'mp-overlay' });

      const modal = el('div', { className: 'mp-modal' });
      modal.appendChild(el('h2', null, '👥 Tìm người chơi'));
      modal.appendChild(el('p', null, 'Nhập tên để tìm và mời bạn cùng chơi'));

      const searchBox = el('div', { className: 'mp-search-box' });
      const input = el('input', {
        className: 'mp-search-input',
        placeholder: 'Tìm kiếm người chơi...',
        type: 'text',
      });
      input.addEventListener('input', () => {
        clearTimeout(this._searchTimeout);
        const q = input.value.trim();
        if (q.length < 2) {
          this._renderSearchResults([]);
          return;
        }
        this._searchTimeout = setTimeout(() => {
          this._post({ type: 'search-user', data: { query: q } });
          // Show loading
          const listEl = modal.querySelector('.mp-user-list');
          if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:12px;opacity:0.5"><span class="mp-spinner"></span> Đang tìm...</div>';
        }, 300);
      });
      searchBox.appendChild(input);
      modal.appendChild(searchBox);

      const userList = el('div', { className: 'mp-user-list' });
      modal.appendChild(userList);

      // Back button
      const backBtn = el('button', { className: 'mp-back-btn', onClick: () => this.showModeSelector() }, '← Quay lại');
      modal.appendChild(backBtn);

      this._overlay.appendChild(modal);
      document.body.appendChild(this._overlay);

      // Focus search input
      setTimeout(() => input.focus(), 100);
    }

    _renderSearchResults(users) {
      const list = this._overlay?.querySelector('.mp-user-list');
      if (!list) return;
      list.innerHTML = '';
      if (users.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:12px;opacity:0.5;font-size:0.85rem">Không tìm thấy người chơi nào</div>';
        return;
      }
      users.forEach(u => {
        const item = el('div', { className: 'mp-user-item' });
        const avatar = el('div', { className: 'mp-user-avatar' }, (u.name || u.username || '?')[0].toUpperCase());
        const info = el('div', { className: 'mp-user-info' },
          el('div', { className: 'mp-user-name' }, u.name || u.username),
          el('div', { className: 'mp-user-sub' }, '@' + (u.username || ''))
        );
        const inviteBtn = el('button', {
          className: 'mp-invite-btn',
          onClick: (e) => {
            e.stopPropagation();
            inviteBtn.disabled = true;
            inviteBtn.textContent = 'Đang gửi...';
            this._sendInvite(u);
          }
        }, 'Mời chơi');
        item.appendChild(avatar);
        item.appendChild(info);
        item.appendChild(inviteBtn);
        list.appendChild(item);
      });
    }

    _sendInvite(user) {
      this._post({
        type: 'invite-user',
        data: {
          toUserId: user.id,
          gameId: this.gameId,
          gameName: this.gameName,
          gameCode: this.gameCode,
        }
      });
      // Show waiting status
      const list = this._overlay?.querySelector('.mp-user-list');
      if (list) {
        list.innerHTML = '';
        const status = el('div', { className: 'mp-status waiting' },
          el('span', { className: 'mp-spinner' }),
          ` Đang chờ ${user.name || user.username} chấp nhận...`
        );
        list.appendChild(status);

        const backBtn = el('button', { className: 'mp-back-btn', onClick: () => this._showUserSearch() }, '← Hủy và tìm người khác');
        list.appendChild(backBtn);
      }
    }

    _onInviteSent() {
      // Invite was sent successfully, waiting for response
    }

    _onInviteAccepted(data) {
      this._opponent = data;
      this._mode = 'multiplayer';
      this._removeOverlay();
      this._emit('inviteAccepted', data);
      this._emit('multiplayerStart', { mode: 'multiplayer', opponent: data });
    }

    _onInviteDeclined(data) {
      const list = this._overlay?.querySelector('.mp-user-list');
      if (list) {
        list.innerHTML = '';
        const status = el('div', { className: 'mp-status error' },
          `${data?.declinedByName || 'Bạn'} đã từ chối lời mời`
        );
        list.appendChild(status);
        const retryBtn = el('button', { className: 'mp-back-btn', onClick: () => this._showUserSearch() }, '← Tìm người khác');
        list.appendChild(retryBtn);
      }
    }

    // ===== Game Actions =====
    sendMove(data) {
      this._post({ type: 'game-move', data });
    }

    sendGameOver(data) {
      this._post({ type: 'game-over', data });
    }

    sendStateUpdate(data) {
      this._post({ type: 'state-update', data });
    }

    _removeOverlay() {
      if (this._overlay) {
        this._overlay.remove();
        this._overlay = null;
      }
    }

    destroy() {
      this._removeOverlay();
      this._callbacks = {};
    }
  }

  // Expose globally
  window.MultiplayerBridge = MultiplayerBridge;
})();
