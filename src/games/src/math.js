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
        root.innerHTML = `<div class="panel center"><h2>Né Bóng</h2>
          <p class="hint">Tìm và chạm thật nhanh vào món ăn đang được gọi. Chơi trong 45 giây!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>`;
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
          root.innerHTML = `<div class="hud"><span>⭐ <b>${game.score}</b></span><span>🔥 ${game.combo} · tốt nhất ${game.bestCombo}</span><span>⏱ <b>${game.seconds}</b> giây</span></div>
            <div class="qbox">Tìm món này: <span style="font-size:38px">${game.target}</span></div>
            <div class="opts" style="grid-template-columns:repeat(3,1fr)">${game.bubbles.map((icon, i) => `<button class="opt" data-i="${i}" style="font-size:32px;min-height:70px">${icon}</button>`).join('')}</div>`;
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
              lines: [`${game.score} điểm`, `Chuỗi tốt nhất: ${game.bestCombo}`],
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
