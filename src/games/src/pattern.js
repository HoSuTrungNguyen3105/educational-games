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
        root.innerHTML = `<div class="panel center"><h2>Săn Sao</h2>
          <p class="hint">Nhìn các ô sáng lên rồi chạm theo nhịp. Xem chuỗi dài bao nhiêu bạn giữ được!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>`;
        root.onclick = e => { if (e.target.closest('[data-start]')) start(fresh()); };
      }

      function start(game) {
        T.clear();
        const save = () => saveOfflineRun(id, game);
        function paint() {
          const status = game.phase === 'input' ? 'Đến lượt bạn!' : 'Nhìn theo nhịp…';
          root.innerHTML = `<div class="hud"><span>🎵 Nhịp <b>${game.sequence.length}</b></span><span>⭐ <b>${game.score}</b></span><span>${'❤️'.repeat(game.lives)}</span></div>
            <div class="qbox" id="status">${status}</div>
            <div class="opts" style="grid-template-columns:repeat(2,1fr)">${colors.map(([icon, color], i) => `<button class="opt" data-pad="${i}" style="min-height:100px;font-size:36px;background:${color}">${icon}</button>`).join('')}</div>`;
        }
        function light(index, on) {
          const pad = root.querySelector(`[data-pad="${index}"]`);
          if (pad) pad.style.filter = on ? 'brightness(1.45)' : '';
        }
        function finishGame() {
          T.clear();
          clearOfflineRun(id);
          S.flags.pat = true;
          finish({
            id, score: game.score, xp: 0,
            lines: [`Bạn đã giữ được ${game.sequence.length - 1} nhịp`, `Điểm: ${game.score}`],
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
