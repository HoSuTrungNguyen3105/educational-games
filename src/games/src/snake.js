// src/games/src/snake.js — Rắn Săn Đáp Án (Toán · Phản xạ)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    function snakeGame(root) {
      const N = 15;
      root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span>Dài <b id="ln">3</b></span></div>
    <div class="qbox" id="q" style="min-height:74px;font-size:clamp(28px,7vw,44px)"></div>
    <canvas id="cv"></canvas>
    <div class="dpad"><button class="u" data-d="u">▲</button><button class="l" data-d="l">◀</button><button class="d" data-d="d">▼</button><button class="r" data-d="r">▶</button></div>
    <p class="hint">Điều khiển rắn ăn đáp án đúng. Vuốt, dùng phím mũi tên hoặc bấm nút.</p>`;
      const cv = $('#cv'), ctx = cv.getContext('2d');
      const size = Math.floor(Math.min(root.clientWidth - 8, 450) / N) * N;
      cv.width = cv.height = size; cv.style.width = cv.style.height = size + 'px';
      const cell = size / N;
      let snake, dir, queue, started, foods, q, score = 0, lives = 3, correct = 0, speed = 190;
      const level = () => correct < 6 ? 0 : 1;
      function reset() { snake = [{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }]; dir = { x: 1, y: 0 }; queue = []; started = false; placeFoods() }
      function free(x, y) { return !snake.some(s => s.x === x && s.y === y) && !(foods || []).some(f => f.x === x && f.y === y) }
      function newQ() {
        q = genMath(level());
        const opts = makeOpts(q.ans, 3);
        $('#q').textContent = q.text + ' = ?';
        return opts;
      }
      function placeFoods(opts) {
        if (!opts) { if (!q) opts = newQ(); else opts = foods ? foods.map(f => f.v) : newQ() }
        foods = [];
        opts.forEach(v => {
          let x, y, g = 0;
          do { x = rnd(0, N - 1); y = rnd(0, N - 1); g++ } while ((!free(x, y) || Math.abs(x - snake[0].x) + Math.abs(y - snake[0].y) < 4) && g < 300);
          foods.push({ x, y, v, c: v === q.ans });
        });
      }
      function setDir(dx, dy) {
        const last = queue.length ? queue[queue.length - 1] : dir;
        if ((last.x === -dx && last.y === -dy) || (last.x === dx && last.y === dy)) return;
        if (queue.length < 2) queue.push({ x: dx, y: dy });
        started = true;
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
      function loseLife() {
        lives--; sfx.bad(); $('#lv').textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';
        if (lives <= 0) {
          T.clear();
          finish({
            id: 'snake', score, xp: Math.round(score / 6),
            lines: [`Ăn đúng ${correct} đáp án`, `Rắn dài ${snake.length}`],
            replay: snakeGame,
            details: { correct, length: snake.length }
          });
          return false;
        }
        return true;
      }
      function tick() {
        if (started) {
          if (queue.length) dir = queue.shift();
          const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
          if (snake.some(s => s.x === h.x && s.y === h.y)) { if (!loseLife()) return; reset(); }
          else {
            snake.unshift(h);
            const fi = foods.findIndex(f => f.x === h.x && f.y === h.y);
            if (fi >= 0) {
              if (foods[fi].c) { score += 15; correct++; sfx.ok(); speed = Math.max(95, speed - 6); placeFoods(newQ()); }
              else { foods.splice(fi, 1); snake.pop(); if (!loseLife()) return; }
            } else snake.pop();
          }
          $('#sc').textContent = score; $('#ln').textContent = snake.length;
        }
        draw(); T.set(tick, speed);
      }
      function draw() {
        for (let y = 0; y < N; y++)for (let x = 0; x < N; x++) { ctx.fillStyle = (x + y) % 2 ? '#fff6d9' : '#fffdf3'; ctx.fillRect(x * cell, y * cell, cell, cell) }
        foods.forEach((f, k) => {
          const cx = f.x * cell + cell / 2, cy = f.y * cell + cell / 2;
          ctx.fillStyle = ['#4b9dff', '#a184ff', '#ff6b57'][k % 3]; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(cx, cy, cell * .46, 0, 7); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = `800 ${cell * (String(f.v).length > 2 ? .42 : .52)}px Baloo 2,system-ui,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(f.v, cx, cy + 1);
        });
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
          ctx.fillText('Vuốt hoặc bấm mũi tên để bắt đầu', size / 2, size / 2);
        }
      }
      reset(); draw(); T.set(tick, speed);
    }

    /* ============ Khởi động ============ */
startSingleGame({
  id: 'snake',
  name: 'Rắn Săn Đáp Án',
  icon: '🐍',
  storageKey: 'offline_snake',
  mount: snakeGame,
  badges: [
      { id: 'snake20', n: 'Ăn 20 món', i: '🐍', ok: () => (S.flags.snakeEat || 0) >= 20 },
  ],
});
