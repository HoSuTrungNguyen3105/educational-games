// src/games/src/riddle.js — Phản Xạ Đèn Xanh

    function speedRaceGame(root) {
      const id = 'riddle';
      const saved = loadOfflineRun(id);
      const valid = saved && Number.isInteger(saved.score) && Number.isInteger(saved.lives) &&
        saved.lives > 0 && saved.lives <= 3 && Number.isFinite(saved.remaining) &&
        saved.remaining > 0 && ['red', 'green'].includes(saved.light) &&
        Number.isFinite(saved.greenAt) && Number.isFinite(saved.changeAt);
      let game = valid ? saved : fresh();
      let ended = false;

      function fresh() {
        clearOfflineRun(id);
        const now = Date.now();
        return { score: 0, lives: 3, remaining: 30, light: 'red', greenAt: 0, changeAt: now + nextDelay() };
      }
      function nextDelay() { return 700 + Math.floor(Math.random() * 1500); }
      function save() { saveOfflineRun(id, game); }
      root.innerHTML = `<div class="hud"><span>🏁 <b id="raceScore">0</b></span><span>⏱ <b id="raceTime">30</b>s</span><span>❤️ <b id="raceLives">3</b></span></div>
        <div class="qbox center" style="padding:24px 12px">
          <div style="font-size:14px;opacity:.7">PHẢN XẠ ĐÈN XANH</div>
          <div id="trafficLight" style="width:100px;height:100px;border-radius:50%;margin:18px auto;background:#f44336;border:8px solid #ffffff55;box-shadow:0 0 30px #f4433670"></div>
          <div id="raceStatus" style="font-size:20px;font-weight:800">Chờ đèn xanh!</div>
        </div>
        <button class="btn" data-react="1" style="width:100%;min-height:78px;font-size:20px">🏎️ NHẤN ĐỂ ĐUA</button>
        <p class="hint">Phản xạ thật nhanh khi đèn xanh bật. Đèn đỏ thì chờ!</p>
        <div class="row"><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>`;
      const light = $('#trafficLight'), status = $('#raceStatus');
      function paint() {
        $('#raceScore').textContent = game.score;
        $('#raceTime').textContent = Math.max(0, Math.ceil(game.remaining));
        $('#raceLives').textContent = game.lives;
        const green = game.light === 'green';
        light.style.background = green ? '#32d583' : '#f44336';
        light.style.boxShadow = `0 0 30px ${green ? '#32d583' : '#f44336'}70`;
        status.textContent = green ? 'GO! GO! GO!' : 'Chờ đèn xanh!';
      }
      function finishRun() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        finish({ id, score: game.score, lines: [`${game.score} phản xạ`, `Còn ${game.lives} mạng`],
          replay: speedRaceGame, details: { score: game.score, lives: game.lives } });
      }
      function tick() {
        if (ended) return;
        const now = Date.now();
        const elapsed = (now - game.lastTick) / 1000;
        game.lastTick = now;
        game.remaining = Math.max(0, game.remaining - elapsed);
        if (game.light === 'red' && now >= game.changeAt) {
          game.light = 'green';
          game.greenAt = now;
        } else if (game.light === 'green' && now - game.greenAt >= 850) {
          game.light = 'red';
          game.changeAt = now + nextDelay();
        }
        paint();
        if (game.remaining <= 0 || game.lives <= 0) { finishRun(); return; }
        save();
        T.set(tick, 100);
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) {
          T.clear();
          ended = false;
          game = fresh();
          game.lastTick = Date.now();
          paint();
          save();
          T.set(tick, 100);
          return;
        }
        if (!e.target.closest('[data-react]') || ended) return;
        const now = Date.now();
        if (game.light === 'green') {
          const reaction = now - game.greenAt;
          game.score += reaction < 280 ? 5 : reaction < 500 ? 3 : 1;
          game.light = 'red';
          game.changeAt = now + nextDelay();
          sfx.ok();
          status.textContent = `Xuất phát! ${reaction} ms`;
        } else {
          game.lives--;
          game.changeAt = now + nextDelay();
          sfx.bad();
          status.textContent = 'Xuất phát sớm! Chờ đèn xanh.';
        }
        paint();
        save();
      };
      if (!valid && saved) clearOfflineRun(id);
      game.lastTick = Date.now();
      paint();
      save();
      T.set(tick, 100);
    }

    startSingleGame({
      id: 'riddle',
      name: 'Phản Xạ Đèn Xanh',
      icon: '🚦',
      storageKey: 'offline_riddle',
      mount: speedRaceGame,
    });
