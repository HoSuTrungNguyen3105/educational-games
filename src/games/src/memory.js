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
      root.innerHTML = `<div class="hud"><span>👣 <b id="mv">0</b> lượt</span><span>🧩 <b id="pr">0</b>/8</span><span>⏱ <b id="tm">0</b>s</span></div>
    <div class="mem" id="mem">${cards.map((c, i) => `<button class="mc" data-i="${i}" aria-label="Thẻ ${i + 1}"><div class="in"><div class="f">❓</div><div class="b">${c.t}</div></div></button>`).join('')}</div>
    <p class="hint">Lật hai thẻ để tìm các biểu tượng giống nhau.</p>`;
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
                  lines: [`${moves} lượt lật`, `${secs} giây`],
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
