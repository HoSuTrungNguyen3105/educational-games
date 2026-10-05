// src/games/src/quiz.js — Chọn Nhanh, Chọn Vui

    function quizGame(root) {
      const id = 'quiz';
      const picks = [
        ['Đi biển cả ngày', 'Ở nhà thư giãn cả ngày'],
        ['Ăn bánh pizza vào bữa sáng', 'Ăn kem vào bữa tối'],
        ['Có một chú rồng bé xíu', 'Có một chú khủng long tí hon'],
        ['Nhảy như robot', 'Đi bộ như cua'],
        ['Phòng toàn gối mềm', 'Phòng toàn thú bông'],
        ['Mưa kẹo dẻo', 'Mưa bỏng ngô'],
        ['Du lịch bằng khinh khí cầu', 'Du lịch bằng tàu ngầm'],
        ['Tóc đổi màu theo tâm trạng', 'Giày phát nhạc khi đi'],
        ['Một tuần chỉ ăn món mình thích', 'Một tuần chỉ xem phim hài'],
        ['Có cửa bí mật trong phòng', 'Có cầu trượt ngay ngoài cửa']
      ];
      let saved = loadOfflineRun(id);

      function fresh() {
        clearOfflineRun(id);
        return { deck: shuffle(picks.map((_, i) => i)), round: 0, score: 0, streak: 0, seconds: 60, votes: [] };
      }

      function intro() {
        root.innerHTML = `<div class="panel center"><h2>Chọn Nhanh, Chọn Vui 🎉</h2>
          <p class="hint">Chọn nhanh bên nào hợp gu của bạn. Không có đúng hay sai — chỉ chơi cho vui!</p>
          <button class="btn" data-start="1">Bắt đầu chơi</button></div>`;
        root.onclick = e => { if (e.target.closest('[data-start]')) start(fresh()); };
      }

      function start(game) {
        T.clear();
        function save() { saveOfflineRun(id, game); }
        function finishGame() {
          T.clear();
          clearOfflineRun(id);
          S.flags.perfect = true;
          finish({
            id, score: game.score, xp: 0,
            lines: [`Bạn đã chọn ${game.round} lượt`, `Chuỗi chọn liên tiếp: ${game.streak}`],
            replay: quizGame, details: { votes: game.votes, score: game.score }
          });
        }
        function paint() {
          if (game.round >= game.deck.length || game.seconds <= 0) { finishGame(); return; }
          const pair = picks[game.deck[game.round]];
          root.innerHTML = `<div class="hud"><span>🎉 Lượt <b>${game.round + 1}/10</b></span><span>⭐ <b>${game.score}</b></span><span>⏱ <b>${game.seconds}</b> giây</span></div>
            <div class="qbox txt">Bạn chọn gì?</div>
            <div class="opts one">${pair.map((choice, i) => `<button class="opt" data-choice="${i}" style="min-height:90px;font-size:20px">${choice}</button>`).join('')}</div>
            <p class="hint">Chọn theo gu của bạn — không cần nghĩ lâu!</p>`;
        }
        root.onclick = e => {
          const button = e.target.closest('[data-choice]');
          if (!button || game.round >= game.deck.length) return;
          const choice = +button.dataset.choice;
          game.votes.push(choice);
          game.round++;
          game.streak++;
          game.score += 10 + Math.min(game.streak, 10);
          sfx.ok();
          save();
          paint();
        };
        save();
        paint();
        T.int(() => {
          game.seconds--;
          if (game.seconds <= 0) finishGame();
          else {
            const timer = root.querySelector('.hud span:last-child b');
            if (timer) timer.textContent = game.seconds;
            save();
          }
        }, 1000);
      }

      if (saved && Array.isArray(saved.deck) && Array.isArray(saved.votes) &&
          saved.deck.length === picks.length && saved.seconds > 0 && saved.round >= 0 && saved.round < picks.length) start(saved);
      else intro();
    }

startSingleGame({
  id: 'quiz',
  name: 'Bắn Bong Bóng',
  icon: '🫧',
  storageKey: 'offline_quiz',
  mount: quizGame,
  badges: [
      { id: 'perfect', n: 'Tay chọn nhanh', i: '🎉', ok: () => S.games >= 1 },
  ],
});
