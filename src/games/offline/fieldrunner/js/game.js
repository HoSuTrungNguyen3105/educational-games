/* =====================================================
   game.js · main update loop & ending the run
   ===================================================== */

/** Update the whole world for dt seconds */
function update(dt) {
  if (over || paused) return;

  gtime += dt;
  shake = Math.max(0, shake - dt * 30);

  for (const k in skill) {
    skill[k].cd = Math.max(0, skill[k].cd - dt);
  }

  /* ----- Spawn enemies from the queue ----- */
  if (spawnQ.length) {
    spawnT -= dt;
    if (spawnT <= 0) {
      const s = spawnQ.shift();
      spawn(s);
      spawnT = s.gap;
    }
  }

  /* ----- Wizards speed up their teammates ----- */
  for (const e of enemies) e.haste = 1;

  for (const e of enemies) {
    if (e.dead || !e.def.haste) continue;

    for (const o of enemies) {
      if (o !== e && !o.dead && Math.hypot(o.x - e.x, o.y - e.y) < 130) {
        o.haste = Math.max(o.haste, 1.35);
      }
    }
  }

  /* ----- Move enemies ----- */
  for (const e of enemies) {
    if (e.dead) continue;

    stepEnemy(e, dt);
    if (e.hurt > 0) e.hurt -= dt;
  }

  /* ----- Damage over time (burn, poison) ----- */
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

  /* ----- Cleanup ----- */
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

  /* ----- Wave over ----- */
  if (waveActive && !spawnQ.length && !enemies.length) {
    waveActive = false;

    if (wave >= TOTAL) {
      endGame(true);
      return;
    }

    const bonus = Math.round((20 + wave * 3) * D.bonus);
    earn(bonus);
    showMsg('✅ Wave ' + wave + ' cleared! Bonus +' + bonus + ' 💰');

    $('go').disabled = false;
    $('go').textContent = '▶ Start wave ' + (wave + 1);

    updUI();
    showPreview();
    saveRun();
  }
}

/** Current score — the HUD shows it live and the final result reuses this formula */
function scoreNow(win) {
  const mult = [1, 1.5, 2, 3][GC.i];
  return Math.round((wave * 100 + lives * 20 + kills * 2 + (win ? 600 : 0)) * mult);
}

/** End the run: save level progress and show the result box */
function endGame(win) {
  if (over) return;
  over = true;

  clearRun();   // run is decided → don't restore it any more

  const score = scoreNow(win);
  const stars = win ? starsFor(lives, D.lives) : 0;
  const rec = commitMapResult(level, { win, score, stars });

  const lines = [
    win ? 'Held all ' + TOTAL + ' waves on ' + level.name : 'Survived until wave ' + wave + '/' + TOTAL,
    'Defeated ' + kills + ' enemies',
    '❤️ ' + lives + ' lives left',
    win ? '⭐ ' + stars + '/3 stars' : '⭐ Best ' + mapStars(level.id) + '/3 stars'
  ];

  if (rec.unlockedNext) {
    const nx = LEVELS[levelIdx + 1];
    lines.push('🔓 Field unlocked: ' + nx.icon + ' ' + nx.name);
  }

  setTimeout(() => {
    GC.result({
      win,
      title: win ? '🏆 ' + level.name + ' is safe!' : '💥 ' + level.name + ' was overrun!',
      score,
      lines,
      onAgain: playAgain,
      onChange: changeDifficulty
    });
  }, 650);
}

/** Replay this exact level on the same difficulty */
function playAgain() {
  clearRun();
  setAutoMap(level.id);
  GC.again();
}

/** Go back to the difficulty picker */
function changeDifficulty() {
  clearAutoMap();
  GC.change();
}
