/* =====================================================
   runsave.js · save the run in progress (built towers, lives, wave)
   Leave mid-battle and come back to the same field + difficulty → weapons stay.
   ===================================================== */

/* One save slot per field; difficulty is stored in the slot so runs never mix. */
const RUNKEY = 'gc:fieldrunner:run-v1';

function runsAll() {
  try {
    return JSON.parse(localStorage.getItem(RUNKEY) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function runSlot(id) {
  const r = runsAll()[id];
  if (!r || r.v !== 1 || !Array.isArray(r.tw)) return null;
  return r;
}

/** Save the current run; call after every build/upgrade/sell/wave win */
function saveRun() {
  if (!started || over || !level) return;

  const all = runsAll();

  // Brand-new run (no towers, no waves played) → nothing to save
  if (!towers.length && !wave) {
    if (all[level.id]) {
      delete all[level.id];
      try {
        localStorage.setItem(RUNKEY, JSON.stringify(all));
      } catch (e) { /* storage blocked */ }
    }
    return;
  }

  all[level.id] = {
    v: 1,
    at: Date.now(),
    diff: GC.i,
    lives,
    wave,
    w: waveActive ? 1 : 0,
    kills,
    money: HOSTED ? 0 : money,
    tw: towers.map(t => ({ c: t.c, r: t.r, k: t.type, l: t.lvl, m: t.mode || 0, s: t.spent }))
  };

  try {
    localStorage.setItem(RUNKEY, JSON.stringify(all));
  } catch (e) { /* storage blocked */ }
}

function clearRun(id) {
  const all = runsAll();
  if (!all[id || (level && level.id)]) return;

  delete all[id || level.id];
  try {
    localStorage.setItem(RUNKEY, JSON.stringify(all));
  } catch (e) { /* ignore */ }
}

/** Most recent saved run across all fields → { lv, run } or null */
function latestRun() {
  const all = runsAll();
  let best = null;

  for (const id in all) {
    const r = runSlot(id);
    if (!r || !(r.wave > 0 || r.tw.length)) continue;

    const i = LEVELS.findIndex(l => l.id === id);
    if (i < 0 || !mapUnlocked(i)) continue;
    if (!best || r.at > best.run.at) best = { lv: LEVELS[i], run: r };
  }
  return best;
}

/** Data for the "Continue" button on the difficulty picker */
function runResumeInfo() {
  const b = latestRun();
  if (!b) return null;

  const w = Math.min(b.run.w ? b.run.wave : b.run.wave + 1, b.lv.waves);
  return {
    i: b.run.diff,
    id: b.lv.id,
    text: b.lv.icon + ' ' + b.lv.name + ' · ' + b.run.tw.length + ' weapons · wave ' + w
  };
}

/** Saved run for level lv on any difficulty (used for labels on the level picker) */
function runAnyFor(lv) {
  const r = runSlot(lv.id);
  return r && (r.wave > 0 || r.tw.length) ? r : null;
}

/** Saved run for level lv, only used when the difficulty matches */
function runForLevel(lv) {
  const r = runAnyFor(lv);
  return r && r.diff === GC.i ? r : null;
}

function agoText(at) {
  const s = Math.max(0, (Date.now() - at) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + ' min ago';
  if (s < 86400) return Math.floor(s / 3600) + ' hr ago';
  return Math.floor(s / 86400) + ' days ago';
}

let resumeRoot = null;

function closeResume() {
  if (resumeRoot) {
    resumeRoot.remove();
    resumeRoot = null;
  }
}

/**
 * Entering a field with an unfinished run → ask clearly "Continue" or "Start over",
 * instead of quietly rebuilding the towers and leaving the player confused.
 */
function askResume(run) {
  closeResume();

  const nextWave = Math.min(run.w ? run.wave : run.wave + 1, TOTAL);
  const LV = GC.levels[run.diff];

  const root = document.createElement('div');
  root.className = 'fr-resume';
  root.id = 'fr-resume';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Unfinished run');
  root.innerHTML =
    '<div class="fr-resume__card">' +
      '<h2>🔫 Unfinished run</h2>' +
      '<p class="fr-resume__sub">' + GC.esc(level.icon + ' ' + level.name) + ' · ' +
        LV.emoji + ' ' + GC.esc(LV.label) + ' · saved ' + agoText(run.at) + '</p>' +
      '<div class="fr-resume__list">' +
        '<span><b>' + run.tw.length + '</b> weapons bought</span>' +
        '<span>on wave <b>' + nextWave + '/' + TOTAL + '</b></span>' +
        '<span><b>' + (run.lives | 0) + '</b> lives left</span>' +
        '<span><b>' + (run.kills | 0) + '</b> enemies defeated</span>' +
      '</div>' +
      '<div class="fr-resume__row">' +
        '<button type="button" class="btn mint" data-a="go">▶ Continue</button>' +
        '<button type="button" class="btn red" data-a="new">↺ Start over</button>' +
      '</div>' +
    '</div>';

  paused = true;
  $('pause').textContent = '▶';

  const answer = (goOn) => {
    closeResume();
    paused = false;
    $('pause').textContent = '⏸';

    if (goOn) restoreRun(run);
    else {
      clearRun(level.id);
      updUI();
      showMsg('↺ New board — no weapons yet');
    }
  };

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (b) answer(b.dataset.a === 'go');
  });

  document.body.appendChild(root);
  resumeRoot = root;
}

/** Rebuild towers + progress after reset() has cleared the grid */
function restoreRun(r) {
  for (const t of r.tw) {
    if (!TYPES[t.k]) continue;
    if (t.c < 0 || t.r < 0 || t.c >= COLS || t.r >= ROWS) continue;
    if (blocked[t.c][t.r]) continue;

    blocked[t.c][t.r] = true;
    towers.push({
      c: t.c, r: t.r,
      x: t.c * CS + CS / 2,
      y: t.r * CS + CS / 2,
      type: t.k,
      lvl: Math.min(MAXLV, Math.max(1, t.l | 0)),
      cd: 0,
      ang: 0,
      spent: t.s || TYPES[t.k].cost,
      mode: t.m || 0,
      rec: 0
    });
  }

  const d = bfs(blocked);
  // Level terrain may change between saves — the path must still be open to accept the run
  if (d[0 + SR * COLS] === Infinity) {
    clearRun(level.id);
    return false;
  }

  setDist(d);

  lives = Math.min(D.lives, Math.max(1, r.lives | 0));
  kills = Math.max(0, r.kills | 0);

  // left mid-wave → play that same wave again next time, so no wave is skipped
  wave = Math.min(TOTAL, Math.max(0, r.wave | 0));
  if (r.w && wave > 0) wave--;

  // Playing standalone (opening the .html file) → coins belong to the saved run;
  // inside the app the account wallet is the source of truth, so don't overwrite it.
  if (!HOSTED && typeof r.money === 'number') money = r.money;

  waveActive = false;
  $('go').disabled = false;
  $('go').textContent = '▶ Start wave ' + (wave + 1);

  updUI();
  showInfo();
  showPreview();

  showMsg('↺ Run restored · ' + towers.length + ' weapons · wave ' + (wave + 1));
  return true;
}

/* ---------- Bridge with the app: the host asks for a save before tearing down the iframe ---------- */
window.__gqFlush = saveRun;
addEventListener('gq:flush', saveRun);
addEventListener('pagehide', saveRun);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveRun();
});
