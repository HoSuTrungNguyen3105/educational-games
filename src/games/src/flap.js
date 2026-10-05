// src/games/src/flap.js — Sky Hopper

    function flapGame(root) {
      const W = Math.min(root.clientWidth, 420), H = Math.round(W * 1.4), s = H / 560;
      root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span>🔥 <b id="cb">0</b></span></div><canvas id="cv"></canvas>
    <p class="hint">Chạm màn hình hoặc nhấn phím cách để vỗ cánh qua các khe. Bay được bao lâu tùy bạn!</p>`;

      const cv = $('#cv'), ctx = fitCanvas(cv, W, H);
      const br = 15 * s, bx = W * .26, GY = H - 34 * s, TOP = 76 * s;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#5ec2ff'); bgGrad.addColorStop(1, '#d8f5ff');
      const $sc = $('#sc'), $lv = $('#lv'), $cb = $('#cb');
      const saved = loadOfflineRun('flap');
      let y, vy, ready, score, lives, combo, best, n, wall, t, flash = 0, saveClock = 0;
      const clouds = saved && Array.isArray(saved.clouds) ? saved.clouds :
        Array.from({ length: 5 }, () => ({ x: Math.random() * W, y: Math.random() * (H * .6) + 70 * s, r: 20 + Math.random() * 24, v: 8 + Math.random() * 14 }));
      const speed = () => (115 + Math.min(n, 15) * 4) * s;

      function hud() {
        $sc.textContent = score; $lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔'; $cb.textContent = combo;
      }
      function newWall() {
        const zone = GY - TOP, gap = Math.min(zone * .34, 126 * s);
        const cy = TOP + gap / 2 + Math.random() * (zone - gap);
        wall = { x: W + 20, w: 64 * s, top: cy - gap / 2, bot: cy + gap / 2, done: false };
      }
      function saveRun() {
        saveOfflineRun('flap', { y, vy, ready, score, lives, combo, best, n, wall, t, clouds });
      }
      if (saved && Number.isFinite(saved.y) && Number.isFinite(saved.score) && saved.wall &&
          Number.isFinite(saved.wall.x) && Number.isFinite(saved.wall.top) && Number.isFinite(saved.wall.bot)) {
        ({ y, vy, ready, score, lives, combo, best, n, wall, t } = saved);
        vy = Number.isFinite(vy) ? vy : 0; ready = !!ready;
        lives = Number.isInteger(lives) ? lives : 3; combo = Number.isInteger(combo) ? combo : 0;
        best = Number.isInteger(best) ? best : 0; n = Number.isInteger(n) ? n : 0; t = Number.isFinite(t) ? t : 0;
      } else {
        y = H / 2; vy = 0; ready = true; score = 0; lives = 3; combo = 0; best = 0; n = 0; t = 0; newWall();
      }

      function finishRun() {
        clearOfflineRun('flap');
        finish({ id: 'flap', score, lines: [`Đã vượt ${n} cổng`, `Chuỗi dài nhất ${best}`],
          replay: flapGame, details: { gates: n, bestCombo: best } });
      }
      function hurt() {
        lives--; combo = 0; sfx.bad(); flash = .3; hud();
        if (lives <= 0) { finishRun(); return true; }
        ready = true; y = H / 2; vy = 0; newWall(); saveRun(); return false;
      }
      function flap() {
        if (ready) ready = false;
        vy = -430 * s; sfx.flap(); saveRun();
      }
      cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
      onKey = e => {
        if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
      };
      hud(); saveRun();

      T.loop(dt => {
        t += dt; saveClock += dt;
        for (const c of clouds) { c.x -= c.v * dt; if (c.x < -60) c.x = W + 60; }
        if (flash > 0) flash -= dt;
        if (ready) { y = H / 2 + Math.sin(t * 5) * 8 * s; draw(); }
        else {
          vy += 1500 * s * dt; y += vy * dt;
          if (y < br) { y = br; vy = Math.max(vy, 0); }
          wall.x -= speed() * dt;
          if (y + br > GY) { if (hurt()) return; draw(); }
          else if (bx + br > wall.x && bx - br < wall.x + wall.w && !(y - br > wall.top && y + br < wall.bot)) {
            if (hurt()) return; draw();
          } else {
            if (!wall.done && bx > wall.x + wall.w / 2) {
              wall.done = true; combo++; best = Math.max(best, combo); n++;
              score += 10 + Math.min(combo, 10) * 2; sfx.ok(); hud(); saveRun();
            }
            if (wall.x + wall.w < -10) { newWall(); saveRun(); }
            draw();
          }
        }
        if (saveClock >= 1) { saveClock = 0; saveRun(); }
      });

      function draw() {
        ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        for (const c of clouds) {
          ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.arc(c.x + c.r * .9, c.y + 4, c.r * .75, 0, 7);
          ctx.arc(c.x - c.r * .9, c.y + 6, c.r * .65, 0, 7); ctx.fill();
        }
        ctx.strokeStyle = '#14683b'; ctx.lineWidth = 3;
        for (const [a, b] of [[0, wall.top], [wall.bot, GY]]) {
          if (b - a <= 0) continue;
          ctx.fillStyle = '#2fbf71'; ctx.beginPath(); ctx.roundRect(wall.x, a - 6, wall.w, b - a + 12, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(wall.x + 8, a, 7, b - a);
        }
        ctx.fillStyle = '#d9a441'; ctx.fillRect(0, GY, W, H - GY);
        ctx.fillStyle = '#4caf50'; ctx.fillRect(0, GY, W, 8 * s);
        ctx.save(); ctx.translate(bx, y); ctx.rotate(Math.max(-.5, Math.min(.9, vy / (700 * s))));
        ctx.fillStyle = '#ffc233'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, br, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff9a3c'; ctx.beginPath(); ctx.ellipse(-br * .3, br * .15 + Math.sin(t * 25) * 3, br * .55, br * .32, -.3, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(br * .35, -br * .3, br * .34, 0, 7); ctx.fill();
        ctx.fillStyle = '#0b2227'; ctx.beginPath(); ctx.arc(br * .45, -br * .3, br * .15, 0, 7); ctx.fill();
        ctx.fillStyle = '#ff6f59'; ctx.beginPath(); ctx.moveTo(br * .8, 0); ctx.lineTo(br * 1.5, br * .15); ctx.lineTo(br * .8, br * .4); ctx.fill();
        ctx.restore();
        if (ready) {
          ctx.fillStyle = 'rgba(12,42,48,.7)'; ctx.beginPath(); ctx.roundRect(W / 2 - 100, H / 2 + 40 * s, 200, 40, 20); ctx.fill();
          ctx.fillStyle = '#ffc233'; ctx.font = '700 16px Lexend,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('Chạm để bay', W / 2, H / 2 + 40 * s + 21);
        }
        if (flash > 0) { ctx.fillStyle = `rgba(255,93,108,${flash * 1.3})`; ctx.fillRect(0, 0, W, H); }
      }
    }

    startSingleGame({
      id: 'flap',
      name: 'Chim Bay Tự Do',
      icon: '🐦',
      storageKey: 'offline_flap',
      mount: flapGame,
    });
