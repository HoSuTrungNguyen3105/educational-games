// src/games/src/shapecount.js — Bắt Vật Thể

    function catchObjectsGame(root) {
      const id = 'shapecount';
      const objects = ['🐱', '🐶', '🐸', '🐼', '🦊', '🐵', '🐰', '🐻', '🍓', '🍋', '🍇', '🍉', '🚀', '🎈', '🎸', '🎧'];
      const saved = loadOfflineRun(id);
      const valid = saved && Number.isInteger(saved.score) && Number.isInteger(saved.lives) &&
        saved.lives > 0 && saved.lives <= 3 && Number.isFinite(saved.remaining) && saved.remaining > 0 &&
        typeof saved.target === 'string' && objects.includes(saved.target) &&
        Array.isArray(saved.field) && saved.field.length === 16 && saved.field.every(item => objects.includes(item)) &&
        saved.field.filter(item => item === saved.target).length === 1;
      let game = valid ? saved : fresh();
      let ended = false;

      function fresh() {
        clearOfflineRun(id);
        const target = objects[rnd(0, objects.length - 1)];
        return { score: 0, lives: 3, remaining: 30, target, field: makeField(target) };
      }
      function makeField(target) {
        const otherObjects = objects.filter(item => item !== target);
        const field = shuffle([...shuffle(otherObjects).slice(0, 15), target]);
        return field;
      }
      function save() { saveOfflineRun(id, game); }
      function render() {
        root.innerHTML = `<div class="hud"><span>⭐ <b id="catchScore">${game.score}</b></span><span>⏱ <b id="catchTime">${Math.ceil(game.remaining)}</b>s</span><span>❤️ <b id="catchLives">${game.lives}</b></span></div>
          <div class="qbox center"><div style="font-size:13px;opacity:.7">BẮT VẬT THỂ</div>
            <div style="font-size:16px;margin-top:6px">Chạm nhanh vào vật thể mục tiêu</div>
            <div id="catchTarget" style="font-size:46px;margin:8px auto">${game.target}</div></div>
          <div class="opts" style="grid-template-columns:repeat(4,1fr);gap:7px">${game.field.map((item, i) =>
            `<button class="opt" data-object="${i}" style="min-height:64px;font-size:29px">${item}</button>`).join('')}</div>
          <p class="hint">Bắt đúng để ghi điểm, tránh chạm nhầm. Nhanh tay trước khi hết giờ!</p>
          <div class="row"><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>`;
      }
      function updateHud() {
        $('#catchScore').textContent = game.score;
        $('#catchTime').textContent = Math.max(0, Math.ceil(game.remaining));
        $('#catchLives').textContent = game.lives;
        $('#catchTarget').textContent = game.target;
      }
      function finishRun() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        finish({ id, score: game.score, lines: [`Bắt được ${game.score / 10} vật thể`, `Còn ${game.lives} mạng`],
          replay: catchObjectsGame, details: { catches: game.score / 10, lives: game.lives } });
      }
      function tick() {
        if (ended) return;
        game.remaining = Math.max(0, game.remaining - 1);
        updateHud();
        if (game.remaining <= 0 || game.lives <= 0) { finishRun(); return; }
        save();
        T.set(tick, 1000);
      }
      root.onclick = e => {
        if (e.target.closest('[data-restart]')) {
          T.clear();
          ended = false;
          game = fresh();
          render();
          save();
          T.set(tick, 1000);
          return;
        }
        if (ended) return;
        const object = e.target.closest('[data-object]');
        if (!object) return;
        if (game.field[+object.dataset.object] === game.target) {
          game.score += 10;
          sfx.ok();
          const next = objects[rnd(0, objects.length - 1)];
          game.target = next;
          game.field = makeField(next);
          render();
        } else {
          game.lives--;
          sfx.bad();
          updateHud();
          if (game.lives <= 0) { finishRun(); return; }
        }
        save();
      };
      if (!valid && saved) clearOfflineRun(id);
      render();
      save();
      T.set(tick, 1000);
    }

    startSingleGame({
      id: 'shapecount',
      name: 'Bắt Vật Thể',
      icon: '🎯',
      storageKey: 'offline_shapecount',
      mount: catchObjectsGame,
    });
