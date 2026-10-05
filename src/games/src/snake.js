// src/games/src/snake.js — Neon Snake

    function snakeGame(root) {
      const N = 15;
      root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span>Dài <b id="ln">3</b></span></div>
    <canvas id="cv"></canvas>
    <div class="dpad"><button class="u" data-d="u">▲</button><button class="l" data-d="l">◀</button><button class="d" data-d="d">▼</button><button class="r" data-d="r">▶</button></div>
    <p class="hint">Ăn trái cây phát sáng để rắn dài thêm, tránh tự cắn vào mình. Vuốt, dùng phím mũi tên hoặc chạm nút điều hướng.</p>`;
      const cv = $('#cv'), ctx = cv.getContext('2d');
      const size = Math.floor(Math.min(root.clientWidth - 8, 450) / N) * N;
      cv.width = cv.height = size; cv.style.width = cv.style.height = size + 'px';
      const cell = size / N;
      const saved = loadOfflineRun('snake');
      let snake, dir, queue, started, food, score, lives, speed;

      function spawnFood() {
        const open = [];
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          if (!snake.some(s => s.x === x && s.y === y)) open.push({ x, y });
        }
        return open.length ? open[rnd(0, open.length - 1)] : null;
      }
      function freshSnake() {
        snake = [{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }];
        dir = { x: 1, y: 0 }; queue = []; started = false; food = spawnFood();
      }
      function saveRun() {
        saveOfflineRun('snake', { snake, dir, queue, started, food, score, lives, speed });
      }
      if (saved && Array.isArray(saved.snake) && saved.snake.length &&
          saved.snake.every(s => Number.isInteger(s.x) && Number.isInteger(s.y) && s.x >= 0 && s.x < N && s.y >= 0 && s.y < N) &&
          saved.dir && Number.isInteger(saved.score) && Number.isInteger(saved.lives)) {
        snake = saved.snake; dir = saved.dir; queue = Array.isArray(saved.queue) ? saved.queue : [];
        started = !!saved.started; food = saved.food; score = saved.score; lives = saved.lives;
        speed = Number.isFinite(saved.speed) ? saved.speed : 190;
        if (!food || !Number.isInteger(food.x) || !Number.isInteger(food.y) ||
            snake.some(s => s.x === food.x && s.y === food.y)) food = spawnFood();
      } else {
        score = 0; lives = 3; speed = 190; freshSnake();
      }

      const $sc = $('#sc'), $lv = $('#lv'), $ln = $('#ln');
      function hud() {
        $sc.textContent = score; $lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';
        $ln.textContent = snake.length;
      }
      function setDir(dx, dy) {
        const last = queue.length ? queue[queue.length - 1] : dir;
        if ((last.x === -dx && last.y === -dy) || (last.x === dx && last.y === dy)) return;
        if (queue.length < 2) queue.push({ x: dx, y: dy });
        started = true; saveRun();
      }
      const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
      root.onclick = e => { const b = e.target.closest('[data-d]'); if (b) setDir(...DIRS[b.dataset.d]) };
      onKey = e => {
        const m = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r' }[e.key];
        if (m) { e.preventDefault(); setDir(...DIRS[m]) }
      };
      let sx, sy;
      cv.ontouchstart = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY };
      cv.ontouchend = e => {
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
        if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1);
      };

      function finishRun() {
        T.clear(); clearOfflineRun('snake');
        finish({ id: 'snake', score, lines: [`Rắn dài ${snake.length}`, `${score} điểm`],
          replay: snakeGame, details: { length: snake.length } });
      }
      function loseLife() {
        lives--; sfx.bad();
        if (lives <= 0) { finishRun(); return false; }
        freshSnake(); hud(); saveRun(); return true;
      }
      function tick() {
        if (started) {
          if (queue.length) dir = queue.shift();
          const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
          if (snake.some(s => s.x === h.x && s.y === h.y)) {
            if (!loseLife()) return;
          } else {
            snake.unshift(h);
            if (food && h.x === food.x && h.y === food.y) {
              score += 10; sfx.ok(); speed = Math.max(95, speed - 4); food = spawnFood();
            } else snake.pop();
            hud(); saveRun();
          }
        }
        draw(); T.set(tick, speed);
      }
      function draw() {
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          ctx.fillStyle = (x + y) % 2 ? '#fff6d9' : '#fffdf3'; ctx.fillRect(x * cell, y * cell, cell, cell);
        }
        if (food) {
          const cx = food.x * cell + cell / 2, cy = food.y * cell + cell / 2;
          ctx.fillStyle = '#ff6b57'; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(cx, cy, cell * .38, 0, 7); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#56bd72'; ctx.fillRect(cx - 2, cy - cell * .48, 4, cell * .18);
        }
        snake.forEach((s, k) => {
          const pad = k ? cell * .1 : cell * .04;
          ctx.fillStyle = k ? (k % 2 ? '#2fc9a5' : '#27b393') : '#1c1b3a'; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * .28); ctx.fill(); if (k) ctx.stroke();
        });
        const h = snake[0]; ctx.fillStyle = '#fff';
        [[.3, .35], [.7, .35]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.arc(h.x * cell + cell * ex, h.y * cell + cell * ey, cell * .12, 0, 7); ctx.fill() });
        if (!started) {
          ctx.fillStyle = 'rgba(28,27,58,.78)'; ctx.fillRect(0, size / 2 - 28, size, 56);
          ctx.fillStyle = '#fff'; ctx.font = `700 ${Math.max(14, size / 24)}px Be Vietnam Pro,system-ui,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('Vuốt hoặc bấm hướng để bắt đầu', size / 2, size / 2);
        }
      }
      hud(); draw(); saveRun(); T.set(tick, speed);
    }

    startSingleGame({
      id: 'snake',
      name: 'Rắn Săn Mồi',
      icon: '🐍',
      storageKey: 'offline_snake',
      mount: snakeGame,
    });
