// src/games/src/clock.js — Phản Xạ Chớp Nhoáng

    function clockGame(root) {
      const id = 'clock';
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        return { round: 0, score: 0, falseStarts: 0, reactions: [], phase: 'ready', waitLeft: 0, goElapsed: 0 };
      }

      function intro() {
        root.innerHTML = `<div class="panel center"><h2>Phản Xạ Chớp Nhoáng</h2>
          <p class="hint">Chờ màn hình chuyển xanh rồi chạm ngay. Chơi 5 lượt, càng nhanh càng tốt!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>`;
        root.onclick = e => { if (e.target.closest('[data-start]')) start(fresh()); };
      }

      function start(game) {
        T.clear();
        let readyAt = game.phase === 'go' ? Date.now() : 0;
        let ticks = 0;
        function save() {
          const state = { ...game };
          saveOfflineRun(id, state);
        }
        function paint() {
          const waiting = game.phase === 'wait';
          const go = game.phase === 'go';
          root.innerHTML = `<div class="hud"><span>🏁 Lượt <b>${game.round}/5</b></span><span>⭐ <b>${game.score}</b></span><span>⚠️ Chạm sớm: ${game.falseStarts}</span></div>
            <button class="btn" data-action="tap" style="width:100%;min-height:220px;font-size:clamp(26px,7vw,42px);background:${go ? 'var(--lime)' : 'var(--sky)'};color:#0b2227">
              <span id="signal">${go ? 'CHẠM NGAY!' : waiting ? 'ĐỢI TÍN HIỆU…' : 'CHẠM ĐỂ BẮT ĐẦU'}</span>
            </button>
            <p class="hint" id="note">${go ? 'Nhanh!' : waiting ? 'Đừng chạm vội!' : 'Sẵn sàng?'}</p>`;
        }
        function beginWait() {
          game.phase = 'wait';
          game.waitLeft = rnd(8, 24) / 10;
          game.goElapsed = 0;
          readyAt = 0;
          save();
          paint();
        }
        root.onclick = e => {
          if (!e.target.closest('[data-action="tap"]')) return;
          if (game.phase === 'ready') {
            beginWait();
          } else if (game.phase === 'wait') {
            game.falseStarts++;
            game.waitLeft = rnd(10, 28) / 10;
            sfx.bad();
            save();
            const note = root.querySelector('#note');
            if (note) note.textContent = 'Quá sớm! Chờ tín hiệu xanh.';
          } else if (game.phase === 'go') {
            const reaction = Math.max(0, Date.now() - readyAt);
            game.reactions.push(reaction);
            game.score += Math.max(0, 1000 - reaction);
            game.round++;
            sfx.ok();
            if (game.round >= 5) {
              T.clear();
              clearOfflineRun(id);
              S.flags.clock = true;
              const average = Math.round(game.reactions.reduce((a, b) => a + b, 0) / game.reactions.length);
              finish({
                id, score: game.score, xp: 0,
                lines: [`Điểm: ${game.score}`, `Phản xạ trung bình: ${average} mili giây`],
                replay: clockGame, details: { reactions: game.reactions, falseStarts: game.falseStarts }
              });
              return;
            }
            beginWait();
          }
        };
        if (game.phase === 'go') readyAt = Date.now() - (game.goElapsed || 0);
        paint();
        save();
        T.int(() => {
          ticks++;
          if (game.phase === 'wait') {
            game.waitLeft -= .1;
            if (game.waitLeft <= 0) {
              game.phase = 'go';
              game.goElapsed = 0;
              readyAt = Date.now();
              sfx.tick();
              paint();
              save();
            } else {
              const signal = root.querySelector('#signal');
              if (signal && ticks % 5 === 0) signal.textContent = `ĐỢI... ${Math.ceil(game.waitLeft)}`;
              if (ticks % 5 === 0) save();
            }
          } else if (game.phase === 'go') {
            game.goElapsed = (game.goElapsed || 0) + 100;
            if (ticks % 5 === 0) save();
          }
        }, 100);
      }

      if (saved && Number.isInteger(saved.round) && saved.round >= 0 && saved.round < 5 && Array.isArray(saved.reactions)) {
        start(saved);
      } else intro();
    }

startSingleGame({
  id: 'clock',
  name: 'Chạm Đúng Nhịp',
  icon: '🚦',
  storageKey: 'offline_clock',
  mount: clockGame,
  badges: [
      { id: 'clock', n: 'Cao thủ phản xạ', i: '⚡', ok: () => !!S.flags.clock },
  ],
});
