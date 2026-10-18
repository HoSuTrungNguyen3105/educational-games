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
        root.innerHTML = `<div class="hud"><span>Từ <b>${i + 1}/${words.length}</b></span><span>⭐ <b>${score}</b></span></div>
      <div class="qbox txt"><div>XẾP CHỮ VUI<small></small><span style="font-family:var(--head);font-size:1.5em;font-weight:800">${[...w].length} chữ cái</span><small>Xếp các ô chữ thành một từ quen thuộc.</small></div></div>
      <div class="slots" id="slots">${[...w].map((_, k) => { const t = ans[k] !== undefined ? tiles[ans[k]].ch : ''; return `<button class="slot ${t ? 'fill' : ''}" data-s="${k}">${t}</button>` }).join('')}</div>
      <div class="tiles">${tiles.map((t, k) => `<button class="tl" data-t="${k}" ${t.used ? 'disabled' : ''}>${t.ch}</button>`).join('')}</div>
      <div class="row"><button class="btn alt" data-a="hint">💡 Gợi ý (−4 điểm)</button><button class="btn alt" data-a="skip">Bỏ qua</button></div>`;
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
          lines: [`Giải được ${solved}/${words.length} từ`],
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
