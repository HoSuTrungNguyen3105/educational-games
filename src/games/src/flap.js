// src/games/src/flap.js — Chim Bay Qua Cổng (Toán · Phản xạ)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function flapGame(root) {
      const W = Math.min(root.clientWidth, 420), H = Math.round(W * 1.4), s = H / 560;
      root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span id="cb">🔥 0</span></div><canvas id="cv"></canvas>
    <p class="hint">Chạm màn hình (hoặc phím cách) để vỗ cánh. Chỉ bay qua khe có đáp án đúng!</p>`;

      const cv = $('#cv'), ctx = fitCanvas(cv, W, H);
      const br = 15 * s, bx = W * .26, GY = H - 34 * s, TOP = 76 * s;

      // Cache gradient nền + DOM ref (trước đây tạo mới mỗi frame / mỗi lần hud)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#5ec2ff');
      bgGrad.addColorStop(1, '#d8f5ff');

      const $sc = $('#sc'), $lv = $('#lv'), $cb = $('#cb');

      let y = H / 2, vy = 0, ready = true, score = 0, lives = 3, combo = 0, best = 0, n = 0, q, wall, t = 0, flash = 0;

      const clouds = Array.from({ length: 5 }, () => ({
        x: Math.random() * W,
        y: Math.random() * (H * .6) + 70 * s,
        r: 20 + Math.random() * 24,
        v: 8 + Math.random() * 14
      }));

      const speed = () => (115 + Math.min(n, 15) * 4) * s;

      function hud() {
        $sc.textContent = score;
        $lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';
        $cb.textContent = '🔥 ' + combo;
      }

      function newWall() {
        const m = genMath(n < 4 ? 0 : n < 10 ? 1 : 2);
        q = { text: m.text + ' = ?', ans: m.ans };
        const opts = makeOpts(m.ans, 3), zone = (GY - TOP) / 3, gh = Math.min(zone * .68, 120 * s);
        wall = {
          x: W + 20, w: 64 * s, done: false,
          gaps: opts.map((v, k) => {
            const cy = TOP + zone * k + zone / 2 + (Math.random() - .5) * zone * .16;
            return { v, top: cy - gh / 2, bot: cy + gh / 2, c: v === m.ans };
          })
        };
      }

      function hurt() {
        lives--; combo = 0; sfx.bad(); flash = .3; hud();
        if (lives <= 0) {
          finish({
            id: 'flap', score, xp: Math.round(score / 6),
            lines: [`Qua ${n} cổng đúng`, `Chuỗi tốt nhất ${best}`],
            replay: flapGame, details: { gates: n, bestCombo: best }
          });
          return true;
        }
        ready = true; y = H / 2; vy = 0; newWall();
        return false;
      }

      function flap() {
        if (ready) ready = false;
        vy = -430 * s;
        sfx.flap();
      }

      cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
      onKey = e => {
        if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
      };

      newWall(); hud();

      T.loop(dt => {
        t += dt;
        for (const c of clouds) { c.x -= c.v * dt; if (c.x < -60) c.x = W + 60; }
        if (flash > 0) flash -= dt;

        if (ready) { y = H / 2 + Math.sin(t * 5) * 8 * s; draw(); return; }

        vy += 1500 * s * dt; y += vy * dt;
        if (y < br) { y = br; vy = Math.max(vy, 0); }
        wall.x -= speed() * dt;

        if (y + br > GY) { if (hurt()) return; draw(); return; }

        if (bx + br > wall.x && bx - br < wall.x + wall.w) {
          if (!wall.gaps.find(g => y - br > g.top && y + br < g.bot)) {
            if (hurt()) return; draw(); return;
          }
        }

        if (!wall.done && bx > wall.x + wall.w / 2) {
          wall.done = true;
          const g = wall.gaps.find(g => y > g.top && y < g.bot);
          if (g && g.c) {
            combo++; best = Math.max(best, combo); n++;
            score += 10 + Math.min(combo, 10) * 2;
            sfx.ok();
            if (n >= 10) S.flags.flap = true;
            hud();
          } else {
            if (hurt()) return; draw(); return;
          }
        }

        if (wall.x + wall.w < -10) newWall();
        draw();
      });

      function draw() {
        // nền (gradient đã cache)
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // mây
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        for (const c of clouds) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, 7);
          ctx.arc(c.x + c.r * .9, c.y + 4, c.r * .75, 0, 7);
          ctx.arc(c.x - c.r * .9, c.y + 6, c.r * .65, 0, 7);
          ctx.fill();
        }

        // cổng
        const segs = [];
        let prev = 0;
        for (const g of wall.gaps) { segs.push([prev, g.top]); prev = g.bot; }
        segs.push([prev, GY]);

        ctx.strokeStyle = '#14683b'; ctx.lineWidth = 3;
        for (const [a, b] of segs) {
          if (b - a <= 0) continue;
          ctx.fillStyle = '#2fbf71';
          ctx.beginPath(); ctx.roundRect(wall.x, a - 6, wall.w, b - a + 12, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(wall.x + 8, a, 7, b - a);
        }

        for (const g of wall.gaps) {
          const cy = (g.top + g.bot) / 2;
          ctx.fillStyle = 'rgba(12,42,48,.78)';
          ctx.beginPath(); ctx.roundRect(wall.x + 2, cy - 16 * s, wall.w - 4, 32 * s, 10); ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = `800 ${Math.round(22 * s)}px Baloo 2,system-ui,sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(g.v, wall.x + wall.w / 2, cy + 1);
        }

        // đất
        ctx.fillStyle = '#d9a441'; ctx.fillRect(0, GY, W, H - GY);
        ctx.fillStyle = '#4caf50'; ctx.fillRect(0, GY, W, 8 * s);

        // chim
        ctx.save();
        ctx.translate(bx, y);
        ctx.rotate(Math.max(-.5, Math.min(.9, vy / (700 * s))));
        ctx.fillStyle = '#ffc233'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, br, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff9a3c';
        ctx.beginPath(); ctx.ellipse(-br * .3, br * .15 + Math.sin(t * 25) * 3, br * .55, br * .32, -.3, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(br * .35, -br * .3, br * .34, 0, 7); ctx.fill();
        ctx.fillStyle = '#0b2227';
        ctx.beginPath(); ctx.arc(br * .45, -br * .3, br * .15, 0, 7); ctx.fill();
        ctx.fillStyle = '#ff6f59';
        ctx.beginPath(); ctx.moveTo(br * .8, 0); ctx.lineTo(br * 1.5, br * .15); ctx.lineTo(br * .8, br * .4); ctx.fill();
        ctx.restore();

        // câu hỏi
        ctx.fillStyle = 'rgba(12,42,48,.88)';
        ctx.beginPath(); ctx.roundRect(12, 10, W - 24, 54 * s + 6, 16); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let fs = 34;
        do {
          ctx.font = `800 ${fs}px Baloo 2,system-ui,sans-serif`;
          fs--;
        } while (ctx.measureText(q.text).width > W - 60 && fs > 14);
        ctx.fillText(q.text, W / 2, 10 + (54 * s + 6) / 2);

        if (ready) {
          ctx.fillStyle = 'rgba(12,42,48,.7)';
          ctx.beginPath(); ctx.roundRect(W / 2 - 100, H / 2 + 40 * s, 200, 40, 20); ctx.fill();
          ctx.fillStyle = '#ffc233';
          ctx.font = '700 16px Lexend,system-ui,sans-serif';
          ctx.fillText('Chạm để bay', W / 2, H / 2 + 40 * s + 21);
        }
        if (flash > 0) {
          ctx.fillStyle = `rgba(255,93,108,${flash * 1.3})`;
          ctx.fillRect(0, 0, W, H);
        }
      }
    }

    /* ============ GAME 2: 2048 LŨY THỪA ============ */
startSingleGame({
  id: 'flap',
  name: 'Chim Bay Qua Cổng',
  icon: '🐦',
  storageKey: 'offline_flap',
  mount: flapGame,
  badges: [
      { id: 'flap10', n: 'Qua 10 cổng', i: '🐦', ok: () => !!S.flags.flap },
  ],
});
