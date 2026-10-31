/* =====================================================
   runsave.js · lưu ván đang chơi (tháp đã xây, mạng, đợt)
   Thoát giữa trận rồi vào lại đúng màn + độ khó → vũ khí còn nguyên.
   ===================================================== */

/* Một suất lưu cho mỗi cánh đồng; độ khó cất trong suất để không trộn lẫn. */
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

/** Ghi ván hiện tại; gọi sau mỗi lần xây/nâng cấp/bán/thắng đợt */
function saveRun() {
  if (!started || over || !level) return;

  const all = runsAll();

  // Ván mới tinh (chưa xây, chưa đánh đợt nào) → không có gì để lưu
  if (!towers.length && !wave) {
    if (all[level.id]) {
      delete all[level.id];
      try {
        localStorage.setItem(RUNKEY, JSON.stringify(all));
      } catch (e) { /* storage bị chặn */ }
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
  } catch (e) { /* storage bị chặn */ }
}

function clearRun(id) {
  const all = runsAll();
  if (!all[id || (level && level.id)]) return;

  delete all[id || level.id];
  try {
    localStorage.setItem(RUNKEY, JSON.stringify(all));
  } catch (e) { /* bỏ qua */ }
}

/** Ván lưu mới nhất trong mọi cánh đồng → { lv, run } hoặc null */
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

/** Dữ liệu cho nút "Chơi tiếp" ở màn chọn độ khó */
function runResumeInfo() {
  const b = latestRun();
  if (!b) return null;

  const w = Math.min(b.run.w ? b.run.wave : b.run.wave + 1, b.lv.waves);
  return {
    i: b.run.diff,
    id: b.lv.id,
    text: b.lv.icon + ' ' + b.lv.name + ' · ' + b.run.tw.length + ' vũ khí · đợt ' + w
  };
}

/** Ván lưu cho màn lv, bất kể độ khó (dùng để dán nhãn trên màn chọn màn) */
function runAnyFor(lv) {
  const r = runSlot(lv.id);
  return r && (r.wave > 0 || r.tw.length) ? r : null;
}

/** Ván lưu cho màn lv, chỉ dùng khi trùng độ khó */
function runForLevel(lv) {
  const r = runAnyFor(lv);
  return r && r.diff === GC.i ? r : null;
}

function agoText(at) {
  const s = Math.max(0, (Date.now() - at) / 1000);
  if (s < 60) return 'vừa xong';
  if (s < 3600) return Math.floor(s / 60) + ' phút trước';
  if (s < 86400) return Math.floor(s / 3600) + ' giờ trước';
  return Math.floor(s / 86400) + ' ngày trước';
}

let resumeRoot = null;

function closeResume() {
  if (resumeRoot) {
    resumeRoot.remove();
    resumeRoot = null;
  }
}

/**
 * Vào màn đang có ván dở → hỏi rõ "Chơi tiếp" hay "Bắt đầu lại",
 * không âm thầm dựng tháp lên bàn rồi khiến bé không biết gì.
 */
function askResume(run) {
  closeResume();

  const nextWave = Math.min(run.w ? run.wave : run.wave + 1, TOTAL);
  const LV = GC.levels[run.diff];

  const root = document.createElement('div');
  root.className = 'fr-resume';
  root.id = 'fr-resume';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Ván đang dở');
  root.innerHTML =
    '<div class="fr-resume__card">' +
      '<h2>🔫 Còn ván đang dở</h2>' +
      '<p class="fr-resume__sub">' + GC.esc(level.icon + ' ' + level.name) + ' · ' +
        LV.emoji + ' ' + GC.esc(LV.label) + ' · lưu ' + agoText(run.at) + '</p>' +
      '<div class="fr-resume__list">' +
        '<span><b>' + run.tw.length + '</b> vũ khí đã mua</span>' +
        '<span>đang ở đợt <b>' + nextWave + '/' + TOTAL + '</b></span>' +
        '<span>còn <b>' + (run.lives | 0) + '</b> mạng</span>' +
        '<span>đã hạ <b>' + (run.kills | 0) + '</b> địch</span>' +
      '</div>' +
      '<div class="fr-resume__row">' +
        '<button type="button" class="btn mint" data-a="go">▶ Chơi tiếp</button>' +
        '<button type="button" class="btn red" data-a="new">↺ Bắt đầu lại</button>' +
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
      showMsg('↺ Bàn mới — chưa có vũ khí');
    }
  };

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (b) answer(b.dataset.a === 'go');
  });

  document.body.appendChild(root);
  resumeRoot = root;
}

/** Dựng lại tháp + tiến độ sau khi reset() đã làm sạch lưới */
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
  // Địa hình màn chơi có thể đổi giữa 2 bản lưu — đường phải còn thông mới nhận ván
  if (d[0 + SR * COLS] === Infinity) {
    clearRun(level.id);
    return false;
  }

  setDist(d);

  lives = Math.min(D.lives, Math.max(1, r.lives | 0));
  kills = Math.max(0, r.kills | 0);

  // thoát giữa đợt → lần sau chơi lại đúng đợt đó, không bỏ sót đợt nào
  wave = Math.min(TOTAL, Math.max(0, r.wave | 0));
  if (r.w && wave > 0) wave--;

  // Chơi một mình (mở file .html) thì tiền thuộc về ván lưu;
  // trong app thì ví tài khoản mới là bản đúng, không ghi đè.
  if (!HOSTED && typeof r.money === 'number') money = r.money;

  waveActive = false;
  $('go').disabled = false;
  $('go').textContent = '▶ Bắt đầu đợt ' + (wave + 1);

  updUI();
  showInfo();
  showPreview();

  showMsg('↺ Tiếp tục ván cũ · ' + towers.length + ' vũ khí · đợt ' + (wave + 1));
  return true;
}

/* ---------- Cầu nối với app: host báo ghi trước khi phá iframe ---------- */
window.__gqFlush = saveRun;
addEventListener('gq:flush', saveRun);
addEventListener('pagehide', saveRun);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveRun();
});
