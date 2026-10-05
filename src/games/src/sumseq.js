// src/games/src/sumseq.js — Nhịp Điệu Ánh Sáng

    function lightRhythmGame(root) {
      const id = 'sumseq';
      const pads = [['🍓', '#ff6f59'], ['🍋', '#ffd166'], ['🍇', '#b18cff'], ['🍀', '#b7e34a']];
      const saved = loadOfflineRun(id);
      const valid = saved && Array.isArray(saved.beats) && saved.beats.length > 0 &&
        saved.beats.every(i => Number.isInteger(i) && i >= 0 && i < pads.length) &&
        Number.isInteger(saved.step) && saved.step >= 0 && saved.step < saved.beats.length &&
        Number.isInteger(saved.score) && Number.isInteger(saved.misses) && saved.misses >= 0 &&
        ['show', 'input'].includes(saved.phase);
      let game = valid ? saved : fresh();
      let closed = false;
      root.innerHTML = `<div class="hud"><span>🎶 Nhịp <b id="rhythmRound">1</b></span><span>⭐ <b id="rhythmScore">0</b></span><span>💫 <b id="rhythmMiss">0</b>/3</span></div>
        <div class="qbox center" id="rhythmStatus">Đón nhịp ánh sáng!</div>
        <div class="opts" style="grid-template-columns:repeat(2,1fr)">${pads.map(([icon, color], i) =>
          `<button class="opt" data-pad="${i}" style="min-height:100px;font-size:36px;background:${color}">${icon}</button>`).join('')}</div>
        <p class="hint">Nhìn nhịp sáng lên rồi chạm lại theo đúng nhịp.</p>
        <div class="row"><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>`;
      const padEls = [...root.querySelectorAll('[data-pad]')];
      const status = $('#rhythmStatus');
      function fresh() {
        clearOfflineRun(id);
        return { beats: [rnd(0, pads.length - 1)], step: 0, score: 0, misses: 0, phase: 'show' };
      }
      function save() { saveOfflineRun(id, game); }
      function flash(index, duration = 320) {
        padEls[index].style.filter = 'brightness(1.6)';
        beep([392, 494, 587, 698][index], duration / 1000, 'triangle', .08);
        T.set(() => { padEls[index].style.filter = ''; }, duration);
      }
      function showBeat() {
        if (closed) return;
        game.phase = 'show';
        game.step = 0;
        status.textContent = 'Nhìn và nghe nhịp…';
        save();
        const gap = Math.max(260, 520 - game.beats.length * 10);
        game.beats.forEach((beat, i) => T.set(() => flash(beat), 350 + i * gap));
        T.set(() => {
          if (closed) return;
          game.phase = 'input';
          status.textContent = 'Đến lượt bạn!';
          save();
        }, 350 + game.beats.length * gap);
      }
      function updateHud() {
        $('#rhythmRound').textContent = game.beats.length;
        $('#rhythmScore').textContent = game.score;
        $('#rhythmMiss').textContent = game.misses;
      }
      function finishRun() {
        if (closed) return;
        closed = true;
        T.clear();
        clearOfflineRun(id);
        finish({ id, score: game.score, lines: [`Giữ được ${game.beats.length - 1} nhịp`, `${game.score} điểm`],
          replay: lightRhythmGame, details: { rounds: game.beats.length - 1, score: game.score } });
      }
      function restart() {
        closed = false;
        T.clear();
        game = fresh();
        updateHud();
        showBeat();
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) { restart(); return; }
        const button = e.target.closest('[data-pad]');
        if (!button || closed || game.phase !== 'input') return;
        const chosen = +button.dataset.pad;
        flash(chosen, 160);
        if (chosen !== game.beats[game.step]) {
          game.misses++;
          updateHud();
          sfx.bad();
          if (game.misses >= 3) { finishRun(); return; }
          game.step = 0;
          game.phase = 'show';
          save();
          status.textContent = 'Nhịp trượt — nghe lại!';
          T.set(showBeat, 650);
          return;
        }
        game.step++;
        sfx.tick();
        if (game.step === game.beats.length) {
          game.score += game.beats.length * 10;
          game.beats.push(rnd(0, pads.length - 1));
          game.step = 0;
          updateHud();
          status.textContent = 'Tuyệt! Nhịp mới…';
          save();
          T.set(showBeat, 650);
        } else save();
      };
      if (!valid && saved) clearOfflineRun(id);
      updateHud();
      save();
      if (game.phase === 'show') showBeat();
      else status.textContent = 'Đến lượt bạn!';
    }

    startSingleGame({
      id: 'sumseq',
      name: 'Nhịp Điệu Ánh Sáng',
      icon: '🎆',
      storageKey: 'offline_sumseq',
      mount: lightRhythmGame,
    });
