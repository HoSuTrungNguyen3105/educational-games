/* =====================================================
   ui.js · thanh trạng thái, bảng thông tin, chọn tháp,
   chuột / bàn phím
   ===================================================== */

/* ---------- Thanh trạng thái ---------- */
function updUI() {
  $('lives').textContent = lives;
  $('money').textContent = money;
  $('wave').textContent = wave;
  $('total').textContent = TOTAL;
  $('score').textContent = scoreNow(false).toLocaleString('vi-VN');
  $('mapName').textContent = level ? level.icon + ' ' + level.name : '';

  // Thanh tiến trình: trong đợt = tỉ lệ địch đã xử lý, giữa đợt = tiến bộ cả màn
  const p = waveActive && waveSpawn
    ? clamp(waveDone / waveSpawn, 0, 1)
    : (TOTAL ? wave / TOTAL : 0);

  const fill = $('meterFill');
  fill.style.width = (p * 100).toFixed(1) + '%';
  fill.parentElement.setAttribute('aria-valuenow', Math.round(p * 100));

  // Làm mờ tháp mà bé chưa đủ tiền mua
  document.querySelectorAll('.tw').forEach(b => {
    b.classList.toggle('poor', money < TYPES[b.dataset.t].cost);
  });

  updSkills();

  if (sel) showInfo();
}

/* =====================================================
   MENU CÁI ĐẶT (nút bánh răng)
   ===================================================== */
function buildSettings() {
  if ($('hudMenu')) return;

  const m = document.createElement('div');
  m.className = 'hud__menu';
  m.id = 'hudMenu';
  m.innerHTML =
    '<h3>Cài đặt</h3>' +
    '<p class="sub" id="setSub"></p>' +
    '<div class="row">' +
      '<button class="btn alt" data-a="pause">⏸ Tạm dừng</button>' +
      '<button class="btn alt" data-a="s1">x1</button>' +
      '<button class="btn alt" data-a="s2">x2</button>' +
      '<button class="btn alt" data-a="s3">x3</button>' +
    '</div>' +
    '<label>Hiệu ứng mây, phấn hoa' +
      '<input type="checkbox" id="setFx" checked></label>' +
    '<div class="row">' +
      '<button class="btn mint" data-a="map">🗺️ Chọn cánh đồng</button>' +
      '<button class="btn alt" data-a="again">↺ Chơi lại màn này</button>' +
    '</div>' +
    '<div class="row">' +
      '<button class="btn alt" data-a="diff">🎚 Đổi độ khó</button>' +
      '<button class="btn red" data-a="home">🏠 Về sảnh</button>' +
    '</div>';

  $('top').appendChild(m);

  m.querySelector('#setFx').addEventListener('change', e => {
    gfx = e.target.checked;
  });

  m.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (!b) return;

    const a = b.dataset.a;

    if (a === 'pause') $('pause').click();
    else if (a === 's1' || a === 's2' || a === 's3') setSpeed(+a[1]);
    else if (a === 'map') { closeSettings(); openMapPicker(); }
    else if (a === 'again') playAgain();
    else if (a === 'diff') changeDifficulty();
    else if (a === 'home') GC.quit();
  });
}

function setSpeed(v) {
  speed = v;
  $('speed').textContent = 'x' + speed;
  $('speed').classList.toggle('on', speed > 1);
  syncSettings();
}

function syncSettings() {
  const m = $('hudMenu');
  if (!m) return;

  $('setSub').textContent = (level ? level.icon + ' ' + level.name + ' · ' : '') +
    GC.diff.label + ' · ' + TOTAL + ' đợt';

  m.querySelector('[data-a="pause"]').textContent = paused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
  m.querySelector('#setFx').checked = gfx;

  m.querySelectorAll('[data-a^="s"]').forEach(b => {
    b.classList.toggle('sel', b.dataset.a === 's' + speed);
  });
}

function closeSettings() {
  const m = $('hudMenu');
  if (m) m.classList.remove('open');
  const g = $('gear');
  if (g) g.classList.remove('on');
}

function toggleSettings() {
  const m = $('hudMenu');
  if (!m) return;

  const open = m.classList.toggle('open');
  $('gear').classList.toggle('on', open);
  if (open) syncSettings();
}

/** Nút 🗺️ / menu: mở màn chọn cánh đồng, tạm dừng ván đang chơi */
function openMapPicker() {
  closeSettings();

  if (!started) {
    showMapSelect({ onPick: startMap });
    return;
  }

  const before = paused;
  paused = true;
  $('pause').textContent = '▶';
  saveRun();

  showMapSelect({
    onPick: startMap,
    onDiff: changeDifficulty,
    onResume: () => {
      paused = before;
      $('pause').textContent = paused ? '▶' : '⏸';
    }
  });
}

/** Cập nhật độ phủ hồi chiêu của 2 kỹ năng */
function updSkills() {
  for (const [id, k] of [['skStrike', 'strike'], ['skFreeze', 'freeze']]) {
    const s = skill[k];
    const b = $(id);

    b.disabled = s.cd > 0 && !over;
    b.querySelector('.cd').style.width = (s.cd / s.max * 100) + '%';
  }
}

function pulse(id) {
  const el = $(id);
  el.classList.remove('pulse');
  void el.offsetWidth;   // buộc trình duyệt tính lại để chạy lại hoạt ảnh
  el.classList.add('pulse');
}

let msgT;
function showMsg(t) {
  const m = $('msg');
  m.textContent = t;
  m.style.opacity = 1;

  clearTimeout(msgT);
  msgT = setTimeout(() => (m.style.opacity = 0), 1800);
}

/* ---------- Xem trước đợt kế tiếp ---------- */
function showPreview() {
  const el = $('preview');

  if (wave >= TOTAL) {
    el.innerHTML = '';
    return;
  }

  const next = wave + 1;
  const q = makeWave(next);
  const cnt = {};
  q.forEach(s => (cnt[s.t] = (cnt[s.t] || 0) + 1));

  let html = '<b style="font-family:var(--gc-head)">Đợt ' + next + ':</b>';

  html += Object.entries(cnt).map(([k, v]) => {
    return '<span class="pv" title="' + EDEF[k].n + '">' + EDEF[k].ic + '×' + v + '</span>';
  }).join('');

  // Từ đợt HARD_WAVE: báo tỉ lệ tinh anh
  const ec = eliteChance(next);
  if (ec > 0) {
    html += '<span class="pv elite" title="Tinh anh: máu trâu, giáp dày, chạy nhanh, rơi gấp đôi xu">' +
      '⭐ Tinh anh ~' + Math.round(ec * 100) + '%</span>';
  }

  el.innerHTML = html;
}

/* ---------- Bảng thông tin ---------- */
function upCost(t) {
  return Math.round(TYPES[t.type].cost * 0.8 * t.lvl);
}

function showInfo() {
  const el = $('info');

  if (sel) {
    showTowerInfo(el);
  } else if (build) {
    const T = TYPES[build];
    el.innerHTML = '<b>' + T.name + '</b> – ' + T.cost + '💰<br>' + T.desc +
      '<br>Nhấn vào cánh đồng để đặt. Chuột phải / Esc để hủy.';
  } else if (aim) {
    el.innerHTML = '<b>🚀 Không kích</b><br>Chạm vào khu vực muốn ném bom (sát thương 260 × 6 quả, xuyên giáp).';
  } else {
    el.innerHTML = '<b>' + (level ? level.icon + ' ' + level.name : 'Cánh đồng') + '</b><br>' +
      'Chọn vũ khí rồi nhấn vào đồng để xây. Không xây được lên ao, đá, cây, nhà kho và cầu. ' +
      'Địch đi vòng quanh tháp – hãy xây mê cung để kéo dài đường đi! ' +
      'Nhấn vào tháp để nâng cấp (tối đa ' + MAXLV + ' sao) hoặc bán.' +
      '<br>⚠️ Từ đợt ' + HARD_WAVE + ' có kẻ địch <b>tinh anh ⭐</b> rất trâu!';
  }
}

function showTowerInfo(el) {
  const T = TYPES[sel.type];
  const S = stat(sel);
  const lv = sel.lvl - 1;

  if (T.support) {
    el.innerHTML =
      '<b>' + T.name + '</b> – cấp ' + sel.lvl + '/' + MAXLV +
      '<br>Tầm hỗ trợ: ' + (TYPES.radar.range + 0.25 * lv).toFixed(1) + ' ô' +
      '<br>⚡ +' + Math.round((0.22 + 0.08 * lv) * 100) + '% sát thương · +' +
      Math.round((0.1 + 0.04 * lv) * 100) + '% tầm' +
      '<br>👁 Lộ diện kẻ tàng hình';
  } else {
    let extra = '';

    if (T.burnDps) extra += '<br>🔥 Cháy: ' + Math.round(T.burnDps * (1 + 0.6 * lv)) + '/giây';
    if (T.poisonDps) extra += '<br>☠ Độc: ' + Math.round(T.poisonDps * (1 + 0.6 * lv)) + '/giây';
    if (T.chain) extra += '<br>⚡ Lan sang ' + (T.chain + Math.floor(sel.lvl / 2)) + ' mục tiêu';
    if (T.pierce) extra += '<br>🗡 Xuyên giáp';
    if (T.splash) extra += '<br>💥 Nổ lan ' + Math.round(T.splash * (1 + 0.06 * lv)) + 'px';
    if (T.slow) extra += '<br>❄ Làm chậm ' + Math.round((1 - Math.max(0.18, T.slow - 0.07 * lv)) * 100) + '%';
    if (T.laser) extra += '<br>🔴 Càng bắn lâu càng mạnh (tối đa x4.4)';
    if (T.rail) extra += '<br>➖ Xuyên mọi kẻ địch trên đường bắn';
    if (sel.bD > 0) extra += '<br>📡 Buff radar: +' + Math.round(sel.bD * 100) + '% sát thương';

    el.innerHTML =
      '<b>' + T.name + '</b> – cấp ' + sel.lvl + '/' + MAXLV +
      '<br>' + (T.laser ? 'DPS: ' : 'Sát thương: ') + S.dmg.toFixed(0) + (T.laser ? '/giây' : '') +
      ' | Tầm: ' + (S.range / CS).toFixed(1) + ' ô' +
      (T.laser ? '' : '<br>Tốc độ bắn: ' + (1 / S.rate).toFixed(1) + '/giây') +
      extra;
  }

  // Hàng nút: nâng cấp · chế độ ngắm · bán
  el.innerHTML += '<div class="row">' +
    (sel.lvl < MAXLV
      ? '<button class="btn mint" id="up" ' + (money < upCost(sel) ? 'disabled' : '') + '>⬆ Nâng cấp (' + upCost(sel) + '💰)</button>'
      : '<span>⭐ Đã tối đa</span>') +
    (T.support ? '' : '<button class="btn alt" id="mode">🎯 ' + MODES[sel.mode || 0] + '</button>') +
    '<button class="btn red" id="sell">Bán (+' + Math.round(sel.spent * 0.7) + ')</button>' +
    '</div>';

  const up = $('up');
  if (up) {
    up.onclick = () => {
      const c = upCost(sel);
      if (money >= c && sel.lvl < MAXLV) {
        pay(c);
        sel.spent += c;
        sel.lvl++;

        particles(sel.x, sel.y, 14, '#ffd93b', 120, 0.6, 3);
        fx.push({ k: 'ring', x: sel.x, y: sel.y, life: 0.5, c: '#ffd93b', r: 40 });
        saveRun();
      }
    };
  }

  const md = $('mode');
  if (md) {
    md.onclick = () => {
      sel.mode = ((sel.mode || 0) + 1) % 3;
      showInfo();
      saveRun();
    };
  }

  $('sell').onclick = () => {
    earn(Math.round(sel.spent * 0.7));
    blocked[sel.c][sel.r] = false;
    towers = towers.filter(t => t !== sel);
    sel = null;

    setDist(bfs(blocked));
    updUI();
    showInfo();
    saveRun();
  };
}

/* ---------- Thanh chọn tháp ---------- */
function buildBar() {
  const box = $('towers');
  box.innerHTML = '';

  Object.entries(TYPES).forEach(([k, T], i) => {
    const b = document.createElement('button');
    b.className = 'tw';
    b.dataset.t = k;
    b.innerHTML =
      '<canvas width="88" height="88"></canvas>' +
      '<div class="tx">' +
        '<b>' + T.name + '</b>' +
        '<span>' + T.cost + ' 💰 <span class="k">[' + KEYS[i] + ']</span></span>' +
      '</div>';
    b.title = T.desc;
    b.onclick = () => pickBuild(k);
    box.appendChild(b);

    // Icon vẽ từ chính hàm vẽ tháp (tạm đổi ctx sang canvas icon)
    const icon = b.querySelector('canvas');
    const old = ctx;

    ctx = icon.getContext('2d');
    ctx.scale(88 / 44, 88 / 44);
    ctx.clearRect(0, 0, 44, 44);
    drawTower({ type: k, lvl: 1, ang: 0 }, 22, 21, 0, true);

    ctx = old;
  });
}

function pickBuild(k) {
  build = build === k ? null : k;
  sel = null;
  aim = null;

  $('skStrike').classList.remove('aim');
  document.querySelectorAll('.tw').forEach(b => b.classList.toggle('sel', b.dataset.t === build));

  showInfo();
}

function clearPick() {
  build = null;
  sel = null;
  aim = null;

  $('skStrike').classList.remove('aim');
  document.querySelectorAll('.tw').forEach(b => b.classList.remove('sel'));

  showInfo();
}

/* ---------- Chuột trên cánh đồng ---------- */
function mpos(e) {
  const r = cv.getBoundingClientRect();
  return [
    (e.clientX - r.left) * CW / r.width,
    (e.clientY - r.top) * CH / r.height
  ];
}

cv.addEventListener('mousemove', e => {
  const [x, y] = mpos(e);
  hover = [Math.floor(x / CS), Math.floor(y / CS)];
});

cv.addEventListener('mouseleave', () => (hover = null));

cv.addEventListener('contextmenu', e => {
  e.preventDefault();
  clearPick();
});

cv.addEventListener('click', e => {
  if (over || !started) return;

  const [x, y] = mpos(e);
  const c = Math.floor(x / CS);
  const r = Math.floor(y / CS);
  hover = [c, r];

  // Đang ngắm không kích
  if (aim) {
    castStrike(c * CS + CS / 2, r * CS + CS / 2);
    showInfo();
    return;
  }

  // Bấm vào tháp có sẵn → chọn
  const t = towers.find(t => t.c === c && t.r === r);
  if (t) {
    sel = t;
    build = null;
    document.querySelectorAll('.tw').forEach(b => b.classList.remove('sel'));
    showInfo();
    return;
  }

  // Đang cầm tháp → đặt xuống
  if (build) {
    const T = TYPES[build];

    if (money < T.cost) {
      showMsg(HOSTED ? 'Không đủ xu trong túi tiền!' : 'Không đủ tiền!');
      return;
    }

    const bad = canPlace(c, r);
    if (bad) {
      showMsg(bad);
      return;
    }

    pay(T.cost);
    blocked[c][r] = true;
    setDist(bfs(blocked));

    towers.push({
      c, r,
      x: c * CS + CS / 2,
      y: r * CS + CS / 2,
      type: build,
      lvl: 1,
      cd: 0,
      ang: 0,
      spent: T.cost,
      mode: 0,
      rec: 0
    });

    particles(c * CS + CS / 2, r * CS + CS / 2, 10, '#e8dcc0', 90, 0.45, 3);
    updUI();
    saveRun();
  } else {
    sel = null;
    showInfo();
  }
});

/* ---------- Bàn phím ---------- */
addEventListener('keydown', e => {
  if (!started || document.getElementById('gc-start') || document.getElementById('fr-maps') ||
      document.getElementById('fr-resume')) return;

  if (e.key === 'Escape') {
    if ($('hudMenu') && $('hudMenu').classList.contains('open')) closeSettings();
    else clearPick();
    return;
  }

  const k = KEYS.indexOf(e.key);
  if (k >= 0 && k < Object.keys(TYPES).length) pickBuild(Object.keys(TYPES)[k]);

  if (e.key === ' ') {
    e.preventDefault();
    startWave();
  }

  if (e.key === 'q' || e.key === 'Q') toggleStrike();
  if (e.key === 'e' || e.key === 'E') castFreeze();
  if (e.key === 'p' || e.key === 'P') $('pause').click();
});

/* ---------- Các nút trên HUD ---------- */
$('go').onclick = startWave;

$('pause').onclick = () => {
  paused = !paused;
  $('pause').textContent = paused ? '▶' : '⏸';
  $('pause').classList.toggle('on', paused);
  syncSettings();
  saveRun();
};

$('speed').onclick = () => setSpeed(speed % 3 + 1);

$('restart').onclick = () => {
  if (confirm('Chơi lại từ đầu màn ' + level.name + ' ở độ khó ' + GC.diff.label + '?')) {
    clearRun();
    reset();
  }
};

$('gear').onclick = toggleSettings;
$('mapBtn').onclick = openMapPicker;

// Đóng menu cài đặt khi bấm ra ngoài
document.addEventListener('click', e => {
  const m = $('hudMenu');
  if (!m || !m.classList.contains('open')) return;
  if (m.contains(e.target) || (e.target.closest && e.target.closest('#gear'))) return;
  closeSettings();
});

$('skStrike').onclick = toggleStrike;
$('skFreeze').onclick = castFreeze;
$('homeBackBtn').onclick = GC.quit;

/* ---------- Co giãn canvas vừa màn hình ---------- */
function fit() {
  const f = $('field');
  const aw = f.clientWidth - 12;
  const ah = f.clientHeight - 12;
  const w = Math.max(280, Math.min(aw, ah * CW / CH));

  cv.style.width = w + 'px';
  cv.style.height = (w * CH / CW) + 'px';
}

addEventListener('resize', fit);
