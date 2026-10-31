/* =====================================================
   main.js · boot the game, pick a level & main loop
   ===================================================== */

/** Prepare the numbers and start a field (goOn = restore the saved run) */
function startMap(lv, goOn) {
  // Difficulty settings (easy → insane), multiplied by level modifiers
  D = {
    lives: Math.round(GC.by(30, 20, 12, 6) * (lv.livesMul || 1)),
    money: Math.round(GC.by(350, 220, 160, 110) * (lv.moneyMul || 1)),
    hp: GC.by(0.75, 1, 1.3, 1.7) * (lv.hpMul || 1),
    spd: GC.by(0.92, 1, 1.08, 1.16) * (lv.spdMul || 1),
    rw: GC.by(1.25, 1, 0.9, 0.8),
    bonus: GC.by(1.3, 1, 0.85, 0.7)
  };

  TOTAL = lv.waves;
  started = true;

  $('chipSlot').innerHTML = GC.chip();

  applyLevel(lv);   // must run before makeBg: the background draws this level's terrain
  buildBar();
  makeBg();
  reset();

  const saved = runForLevel(lv);
  if (goOn) { if (saved) restoreRun(saved); }
  else if (saved) askResume(saved);

  fit();
  runLoop();
}

/** Update + draw loop — runs ONLY once, so changing levels doesn't double the speed */
function runLoop() {
  if (runLoop.on) return;
  runLoop.on = true;

  let last = performance.now();
  let tick = 0;
  let lastSave = 0;

  function loop(now) {
    const real = Math.min(0.1, (now - last) / 1000);
    last = now;

    if (started) {
      if (now - lastSave > 2000) {
        lastSave = now;
        saveRun();
      }

      // Split updates into small steps so collisions stay stable at x2 and x3 speed
      let dt = real * speed;
      while (dt > 0) {
        const step = Math.min(dt, 0.025);
        update(step);
        dt -= step;
      }

      // Refresh skill cooldowns about 10 times per second
      if (Math.floor(now / 100) !== tick) {
        tick = Math.floor(now / 100);
        updSkills();
      }

      draw(paused || over ? 0 : real);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ---------- Temporary background while picking difficulty / level ---------- */
D = { lives: 20, money: 200, hp: 1, spd: 1, rw: 1, bonus: 1 };
buildSettings();
applyLevel(LEVELS[0]);
buildBar();
makeBg();
fit();
ctx.drawImage(bg, 0, 0);
ctx.drawImage(lightLayer, 0, 0);

/* ---------- Difficulty picker → field picker ---------- */
GC.start({
  id: 'fieldrunner',
  name: 'Field Defender',
  icon: '🌾',
  desc: '8 fields, 12 weapons, 25+ enemy types (with elites from wave ' + HARD_WAVE +
        ') and 2 support skills. Win a field to unlock the next one.',
  levels: [
    '30 lives · extra coins · weak, slow enemies',
    '20 lives · 220💰 · balanced',
    '12 lives · tough, fast enemies · smaller rewards',
    '6 lives · super-tough enemies · tiny rewards'
  ],
  resume: runResumeInfo(),
  onStart: () => {
    const auto = takeAutoMap();
    if (auto) startMap(auto);
    else showMapSelect({ onPick: startMap, onDiff: changeDifficulty });
  },
  onResume: () => {
    const b = latestRun();
    if (!b) {
      showMapSelect({ onPick: startMap, onDiff: changeDifficulty });
      return;
    }
    clearAutoMap();
    startMap(b.lv, true);
  }
});
