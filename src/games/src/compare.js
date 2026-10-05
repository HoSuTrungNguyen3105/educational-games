// src/games/src/compare.js — Đấu Trường Bong Bóng

    function bubbleDuelGame(root) {
      const id = 'compare';
      const moves = ['✊', '✋', '✌️'];
      const beats = [2, 0, 1];
      const saved = loadOfflineRun(id);
      const valid = saved && Number.isInteger(saved.round) && saved.round >= 0 && saved.round < 10 &&
        Number.isInteger(saved.wins) && Number.isInteger(saved.ties) && Number.isInteger(saved.losses) &&
        Number.isInteger(saved.cpu) && saved.cpu >= 0 && saved.cpu < moves.length &&
        (saved.lastCpu === undefined || (Number.isInteger(saved.lastCpu) && saved.lastCpu >= 0 && saved.lastCpu < moves.length)) &&
        ['ready', 'reveal'].includes(saved.phase);
      let game = valid ? saved : fresh();
      let closed = false;

      function fresh() {
        clearOfflineRun(id);
        return { round: 0, wins: 0, ties: 0, losses: 0, cpu: rnd(0, 2), phase: 'ready', message: 'Ra đòn!' };
      }
      function save() { saveOfflineRun(id, game); }
      function render() {
        root.innerHTML = `<div class="hud"><span>🥊 Trận <b>${game.round + 1}</b>/10</span><span>🏆 <b>${game.wins}</b></span></div>
          <div class="qbox center"><div style="font-size:14px;opacity:.7">ĐẤU TRƯỜNG BONG BÓNG</div>
            <div style="font-size:54px;margin:12px 0">${game.phase === 'ready' ? '🫧' : moves[game.lastCpu]}</div>
            <div id="duelMessage">${game.message}</div>
            <p class="hint">Thắng ${game.wins} · Hòa ${game.ties} · Thua ${game.losses}</p></div>
          <div class="opts" style="grid-template-columns:repeat(3,1fr)">${moves.map((move, i) =>
            `<button class="opt" data-move="${i}" style="min-height:86px;font-size:36px">${move}</button>`).join('')}</div>
          <p class="hint">Oẳn tù tì đấu với máy — chọn biểu tượng của bạn.</p>
          <div class="row">${game.phase === 'reveal' ? '<button class="btn" data-next="1">Trận tiếp theo ➡️</button>' : ''}
            <button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>`;
        root.querySelectorAll('[data-move]').forEach(button => { button.disabled = game.phase !== 'ready'; });
        save();
      }
      function finishRun() {
        if (closed) return;
        closed = true;
        clearOfflineRun(id);
        const score = game.wins * 10 + game.ties * 3;
        finish({ id, score, lines: [`Thắng ${game.wins} · Hòa ${game.ties} · Thua ${game.losses}`],
          replay: bubbleDuelGame, details: { wins: game.wins, ties: game.ties, losses: game.losses } });
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) {
          T.clear();
          closed = false;
          game = fresh();
          render();
          return;
        }
        if (closed) return;
        if (e.target.closest('[data-next]') && game.phase === 'reveal') {
          game.phase = 'ready';
          game.message = 'Ra đòn!';
          render();
          return;
        }
        const button = e.target.closest('[data-move]');
        if (!button || game.phase !== 'ready') return;
        const player = +button.dataset.move;
        game.lastCpu = game.cpu;
        if (player === game.cpu) {
          game.ties++;
          game.message = `Hòa! Cả hai ra ${moves[player]}.`;
          sfx.tick();
        } else if (beats[player] === game.cpu) {
          game.wins++;
          game.message = `Bạn thắng! ${moves[player]} đánh bại ${moves[game.cpu]}.`;
          sfx.ok();
        } else {
          game.losses++;
          game.message = `Máy thắng lượt này.`;
          sfx.bad();
        }
        game.round++;
        game.phase = 'reveal';
        if (game.round >= 10) { finishRun(); return; }
        game.cpu = rnd(0, 2);
        render();
      };
      if (!valid && saved) clearOfflineRun(id);
      render();
    }

    startSingleGame({
      id: 'compare',
      name: 'Đấu Trường Bong Bóng',
      icon: '🫧',
      storageKey: 'offline_compare',
      mount: bubbleDuelGame,
    });
