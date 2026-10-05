// src/games/src/stroop.js — Color Pop

    function colorPopGame(root) {
      const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#f97316'];
      const saved = loadOfflineRun('stroop');
      let target, options, score, streak, bestStreak, lives, remaining, ended = false;
      if (saved && Number.isInteger(saved.target) && saved.target >= 0 && saved.target < COLORS.length &&
          Array.isArray(saved.options) && saved.options.length === 4 && saved.options.every(i => Number.isInteger(i) && i >= 0 && i < COLORS.length) &&
          Number.isInteger(saved.score) && Number.isInteger(saved.streak) && Number.isInteger(saved.bestStreak) &&
          Number.isInteger(saved.lives) && Number.isInteger(saved.remaining)) {
        ({ target, options, score, streak, bestStreak, lives, remaining } = saved);
      } else {
        score = 0; streak = 0; bestStreak = 0; lives = 3; remaining = 45;
        newRound();
      }
      function newRound() {
        target = rnd(0, COLORS.length - 1);
        options = shuffle([target, ...shuffle(COLORS.map((_, i) => i).filter(i => i !== target)).slice(0, 3)]);
      }
      function saveRun() { saveOfflineRun('stroop', { target, options, score, streak, bestStreak, lives, remaining }); }
      root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span>⏱ <b id="tm">45</b>s</span><span>❤️ <b id="lv">3</b></span></div>
    <div class="qbox" style="text-align:center"><div>SẮC MÀU</div><div style="font-size:20px;margin-top:8px">Tìm màu giống với mẫu</div><div id="target" style="height:74px;width:74px;border-radius:20px;margin:18px auto 4px;border:4px solid white;box-shadow:0 5px 18px #0003"></div></div>
    <div class="row" id="choices" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px"></div>
    <p class="hint">Chạm vào màu giống với mẫu trước khi hết giờ. Tạo chuỗi liên tiếp để nhận thêm điểm!</p>`;
      const $sc = $('#sc'), $tm = $('#tm'), $lv = $('#lv'), $target = $('#target'), $choices = $('#choices');
      function render() {
        $sc.textContent = score; $tm.textContent = remaining; $lv.textContent = lives;
        $target.style.background = COLORS[target];
        $choices.innerHTML = options.map((color, i) =>
          `<button class="btn" data-color="${color}" aria-label="Lựa chọn màu ${i + 1}" style="height:86px;background:${COLORS[color]};border:4px solid white;box-shadow:0 5px 14px #0002"></button>`
        ).join('');
      }
      function finishRun() {
        if (ended) return;
        ended = true; T.clear(); clearOfflineRun('stroop');
        finish({ id: 'stroop', score, lines: [`${score} điểm`, `Chuỗi dài nhất ${bestStreak}`],
          replay: colorPopGame, details: { score, bestStreak } });
      }
      $choices.addEventListener('click', e => {
        const button = e.target.closest('[data-color]');
        if (!button || ended) return;
        const chosen = COLORS.indexOf(button.dataset.color);
        if (chosen === target) { streak++; bestStreak = Math.max(bestStreak, streak); score += 10 + Math.min(streak - 1, 10) * 2; sfx.ok(); }
        else { streak = 0; lives--; sfx.bad(); }
        if (lives <= 0) { finishRun(); return; }
        newRound(); render(); saveRun();
      });
      render(); saveRun();
      function timerTick() {
        if (ended) return;
        remaining--; $tm.textContent = remaining; saveRun();
        if (remaining <= 0) { finishRun(); return; }
        T.set(timerTick, 1000);
      }
      T.set(timerTick, 1000);
    }

    startSingleGame({
      id: 'stroop',
      name: 'Sắc Màu Tốc Độ',
      icon: '🎨',
      storageKey: 'offline_stroop',
      mount: colorPopGame,
    });
