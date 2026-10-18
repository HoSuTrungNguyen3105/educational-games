// src/games/src/chem.js — Săn Ánh Đèn

    function chemGame(root) {
      const id = 'chem';
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        return { score: 0, combo: 0, bestCombo: 0, seconds: 45, lit: [rnd(0, 8)] };
      }

      function intro() {
        root.innerHTML = `<div class="panel center"><h2>Săn Ánh Đèn</h2>
          <p class="hint">Chạm vào những ô đang sáng trước khi chúng vụt tắt. Gom điểm thật nhanh!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>`;
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
          root.innerHTML = `<div class="hud"><span>⭐ <b>${game.score}</b></span><span>🔥 ${game.combo} · tốt nhất ${game.bestCombo}</span><span>⏱ <b>${game.seconds}</b> giây</span></div>
            <div class="qbox">Bắt lấy ánh đèn! ✨</div>
            <div class="opts" style="grid-template-columns:repeat(3,1fr)">${Array.from({ length: 9 }, (_, i) => `<button class="opt" data-i="${i}" style="min-height:78px;font-size:30px;background:${game.lit.includes(i) ? 'var(--amber)' : '#fff6df'}">${game.lit.includes(i) ? '✨' : '·'}</button>`).join('')}</div>`;
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
              lines: [`${game.score} điểm`, `Chuỗi tốt nhất: ${game.bestCombo}`],
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
