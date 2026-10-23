/* =====================================================
   game.js · vòng cập nhật chính & kết thúc ván
   ===================================================== */

/** Cập nhật toàn bộ thế giới trong dt giây */
function update(dt) {
  if (over || paused) return;

  gtime += dt;
  shake = Math.max(0, shake - dt * 30);

  for (const k in skill) {
    skill[k].cd = Math.max(0, skill[k].cd - dt);
  }

  /* ----- Sinh kẻ địch theo hàng đợi ----- */
  if (spawnQ.length) {
    spawnT -= dt;
    if (spawnT <= 0) {
      const s = spawnQ.shift();
      spawn(s);
      spawnT = s.gap;
    }
  }

  /* ----- Pháp sư tăng tốc đồng đội ----- */
  for (const e of enemies) e.haste = 1;

  for (const e of enemies) {
    if (e.dead || !e.def.haste) continue;

    for (const o of enemies) {
      if (o !== e && !o.dead && Math.hypot(o.x - e.x, o.y - e.y) < 130) {
        o.haste = Math.max(o.haste, 1.35);
      }
    }
  }

  /* ----- Di chuyển kẻ địch ----- */
  for (const e of enemies) {
    if (e.dead) continue;

    stepEnemy(e, dt);
    if (e.hurt > 0) e.hurt -= dt;
  }

  /* ----- Sát thương theo thời gian (cháy, độc) ----- */
  for (const e of enemies) {
    if (e.dead || !e.dots.length) continue;

    for (let i = e.dots.length - 1; i >= 0; i--) {
      const d = e.dots[i];
      d.t -= dt;

      if (d.t <= 0) {
        e.dots.splice(i, 1);
        continue;
      }

      applyDamage(e, d.dps * dt, { dot: true });

      if (Math.random() < dt * 10) {
        parts.push({
          x: e.x + (Math.random() - 0.5) * 8,
          y: e.y - 4,
          vx: 0, vy: -25,
          life: 0.4, max: 0.4, s: 2.4,
          c: d.color
        });
      }

      if (e.dead) break;
    }
  }

  updateTowers(dt);
  updateProjs(dt);
  updateStrikes(dt);

  /* ----- Dọn dẹp ----- */
  enemies = enemies.filter(e => !e.dead);
  projs = projs.filter(p => !p.dead);

  if (pendingSpawns.length) {
    enemies.push(...pendingSpawns);
    pendingSpawns = [];
  }

  for (const f of fx) f.life -= dt;
  fx = fx.filter(f => f.life > 0);

  for (const p of parts) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.96;
    p.vy *= 0.96;
  }
  parts = parts.filter(p => p.life > 0);
  if (parts.length > 600) parts.splice(0, parts.length - 600);

  /* ----- Hết đợt ----- */
  if (waveActive && !spawnQ.length && !enemies.length) {
    waveActive = false;

    if (wave >= TOTAL) {
      endGame(true);
      return;
    }

    const bonus = Math.round((20 + wave * 3) * D.bonus);
    earn(bonus);
    showMsg('✅ Xong đợt ' + wave + '! Thưởng +' + bonus + ' 💰');

    $('go').disabled = false;
    $('go').textContent = '▶ Bắt đầu đợt ' + (wave + 1);

    updUI();
    showPreview();
  }
}

/** Kết thúc ván chơi */
function endGame(win) {
  if (over) return;
  over = true;

  const mult = [1, 1.5, 2, 3][GC.i];
  const score = Math.round((wave * 100 + lives * 20 + kills * 2 + (win ? 600 : 0)) * mult);

  setTimeout(() => {
    GC.result({
      win,
      title: win ? '🏆 Chiến thắng!' : '💥 Thua rồi!',
      score,
      lines: [
        win ? 'Giữ vững ' + TOTAL + ' đợt' : 'Cầm cự đến đợt ' + wave + '/' + TOTAL,
        'Hạ ' + kills + ' địch',
        '❤️ còn ' + lives
      ]
    });
  }, 650);
}
