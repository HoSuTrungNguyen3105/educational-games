/* =====================================================
   levels.js · field (level) list, per-level terrain,
   unlock progress & field picker screen
   ===================================================== */

/* Terrain tile symbols:
   t tree · r rock · w water · f fence · b barn/house · h haystack
   j wooden bridge (walkable, can't build) · x flower bush · o plowed field (pretty, buildable) */
const BLOCK_KINDS = 'trwfbh';   // enemies can't cross, can't build
const NOBUILD_KINDS = 'j';      // walkable but can't build

/* ---------- Colors of the current level (from lv.pal) ---------- */
let PAL = {
  grass: ['#72b650', '#7ac258'],
  soil: ['#8a6a38', '#b8935a', '#dcbc84', '#ecd29c'],
  water: ['#9fe3f5', '#3f9fd0'],
  wash: null
};

/* =====================================================
   8 FIELDS
   props: [kind, col, row, width, height] — tiles outside the grid are skipped
   ===================================================== */
const LEVELS = [
  {
    id: 'meadow', name: 'Little Green Meadow', icon: '🌱', waves: 15, sr: 7, gr: 7,
    desc: 'A flat grassy field with a few ponds. A great place to practise maze-building.',
    props: [
      ['w', 3, 2, 2, 2], ['w', 8, 10, 3, 2],
      ['t', 13, 3, 2, 3], ['t', 17, 9, 2, 2], ['t', 6, 12, 2, 1],
      ['x', 6, 5, 3, 2], ['x', 19, 4, 2, 2], ['o', 10, 6, 3, 2],
      ['h', 20, 2, 1, 1]
    ]
  },
  {
    id: 'orchard', name: 'Apple Orchard', icon: '🍎', waves: 18, sr: 4, gr: 10,
    desc: 'Three shady rows of trees make enemies zig-zag.',
    hpMul: 1.05,
    props: [
      ['t', 4, 1, 1, 11], ['t', 10, 3, 1, 11], ['t', 16, 1, 1, 11],
      ['t', 7, 13, 2, 1], ['t', 13, 1, 2, 1], ['t', 19, 13, 2, 1],
      ['x', 1, 10, 2, 3], ['x', 21, 4, 2, 3], ['o', 6, 3, 3, 3], ['o', 12, 8, 3, 3],
      ['h', 2, 2, 1, 1]
    ]
  },
  {
    id: 'riverbank', name: 'Riverside', icon: '🌊', waves: 20, sr: 2, gr: 12,
    desc: 'A river cuts across the field — only two bridges are left.',
    hpMul: 1.05, spdMul: 1.03,
    props: [
      ['w', 10, 1, 2, 4], ['j', 10, 5, 2, 1], ['w', 10, 6, 2, 5], ['j', 10, 11, 2, 1], ['w', 10, 12, 2, 2],
      ['t', 3, 4, 2, 3], ['t', 16, 8, 2, 3], ['r', 6, 10, 2, 2], ['r', 18, 3, 2, 2],
      ['x', 4, 11, 3, 2], ['x', 15, 1, 3, 2], ['o', 14, 6, 3, 2],
      ['b', 2, 1, 2, 2]
    ]
  },
  {
    id: 'homestead', name: 'Farm Homestead', icon: '🏡', waves: 22, sr: 7, gr: 3,
    desc: 'Barns, a well and fences split the fields into plots.',
    hpMul: 1.1,
    props: [
      ['b', 3, 2, 3, 2], ['b', 15, 9, 2, 2], ['b', 20, 6, 1, 2],
      ['f', 2, 11, 8, 1], ['f', 13, 11, 7, 1], ['f', 6, 6, 6, 1], ['f', 17, 1, 5, 1],
      ['t', 11, 2, 2, 2], ['r', 12, 13, 3, 1], ['w', 18, 12, 3, 2],
      ['x', 8, 8, 3, 2], ['o', 13, 4, 3, 3], ['o', 1, 13, 4, 1], ['h', 7, 3, 1, 1]
    ]
  },
  {
    id: 'quarry', name: 'Stone Quarry', icon: '🪨', waves: 25, sr: 12, gr: 2,
    desc: 'Rocks block the way everywhere — the path is narrow and long.',
    hpMul: 1.15,
    props: [
      ['r', 2, 8, 2, 2], ['r', 5, 4, 3, 2], ['r', 10, 9, 3, 2], ['r', 14, 5, 2, 3],
      ['r', 18, 10, 3, 2], ['r', 21, 6, 2, 2], ['r', 8, 1, 2, 3], ['r', 3, 12, 4, 1],
      ['r', 13, 13, 5, 1], ['r', 16, 1, 3, 2],
      ['t', 12, 6, 1, 2], ['t', 20, 2, 2, 1], ['w', 7, 6, 2, 2],
      ['x', 19, 8, 2, 1], ['o', 1, 4, 3, 3], ['h', 22, 12, 1, 1]
    ]
  },
  {
    id: 'marsh', name: 'Marshland', icon: '🐸', waves: 25, sr: 1, gr: 13,
    desc: 'Ponds everywhere — dry land is left in thin strips.',
    hpMul: 1.15, spdMul: 0.97,
    props: [
      ['w', 2, 3, 3, 3], ['w', 8, 1, 4, 3], ['w', 7, 9, 4, 3], ['w', 13, 4, 3, 3],
      ['w', 17, 8, 4, 3], ['w', 21, 1, 2, 4], ['w', 1, 10, 3, 3],
      ['t', 6, 6, 1, 2], ['t', 12, 12, 2, 1], ['t', 20, 6, 2, 1], ['r', 16, 2, 2, 1],
      ['x', 5, 12, 2, 2], ['x', 15, 8, 2, 1], ['o', 9, 6, 3, 2], ['j', 12, 7, 2, 1]
    ]
  },
  {
    id: 'highland', name: 'Sunset Highlands', icon: '⛰️', waves: 28, sr: 7, gr: 7,
    desc: 'Rocky hills stand tall in the sunset light, and the wind is cold.',
    hpMul: 1.2, spdMul: 1.05,
    pal: {
      grass: ['#6a9f6b', '#7bb077'],
      soil: ['#6d5238', '#9b7a4e', '#c2a172', '#e0c596'],
      water: ['#9ad7e8', '#3d7fb0'],
      wash: 'rgba(96,60,140,.14)'
    },
    props: [
      ['r', 5, 2, 1, 6], ['r', 5, 11, 1, 3], ['r', 11, 1, 1, 5], ['r', 11, 9, 1, 5],
      ['r', 17, 3, 1, 6], ['r', 17, 12, 1, 2],
      ['f', 2, 8, 3, 1], ['f', 8, 6, 3, 1], ['f', 14, 7, 3, 1], ['f', 20, 5, 3, 1],
      ['t', 8, 13, 3, 1], ['t', 14, 1, 3, 1], ['w', 21, 10, 2, 3],
      ['x', 3, 4, 2, 3], ['o', 9, 3, 2, 3], ['h', 22, 2, 1, 1]
    ]
  },
  {
    id: 'harvest', name: 'Final Harvest', icon: '🌾', waves: 30, sr: 3, gr: 11,
    desc: 'Golden fields, rocks, ponds and barns all mixed together.',
    hpMul: 1.3, spdMul: 1.06, livesMul: 0.85,
    pal: {
      grass: ['#c2a94f', '#d3bd61'],
      soil: ['#8a6428', '#b4894a', '#dcb070', '#efd0a0'],
      water: ['#a5dfe8', '#3d8fc0'],
      wash: 'rgba(255,190,60,.10)'
    },
    props: [
      ['b', 2, 1, 3, 2], ['b', 19, 2, 2, 2], ['b', 12, 12, 2, 2],
      ['t', 7, 4, 1, 8], ['t', 15, 2, 1, 7], ['t', 22, 6, 1, 6],
      ['r', 9, 1, 3, 2], ['r', 4, 11, 3, 2], ['r', 17, 10, 3, 2],
      ['w', 10, 6, 3, 3], ['w', 1, 7, 2, 3],
      ['f', 6, 13, 6, 1], ['f', 14, 1, 5, 1],
      ['x', 20, 12, 3, 2], ['o', 3, 4, 3, 2], ['h', 13, 10, 1, 1], ['h', 21, 10, 1, 1]
    ]
  }
];

/* Accent colors on the level picker cards */
const MAP_CHIPS = ['#8bc34a', '#f27ba8', '#4b9dff', '#ff9d4a', '#9aa8b8', '#5fbf8a', '#a184ff', '#ffc93c'];

/* =====================================================
   LEVEL PROGRESS (localStorage — offlineGameSync pushes it to the API)
   ===================================================== */
const MAPKEY = 'gc:fieldrunner:maps';
const AUTOKEY = 'gc:fieldrunner:map';   // sessionStorage: replay this exact level

function mapsAll() {
  try {
    return JSON.parse(localStorage.getItem(MAPKEY) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function mapRec(id) {
  return mapsAll()[id] || {};
}

function mapsSet(id, patch) {
  const all = mapsAll();
  all[id] = Object.assign({}, all[id], patch);

  try {
    localStorage.setItem(MAPKEY, JSON.stringify(all));
  } catch (e) { /* storage blocked */ }
}

/** Is level i unlocked: level 1 is always open, later ones need the previous win */
function mapUnlocked(i) {
  if (i <= 0) return true;
  return !!mapRec(LEVELS[i - 1].id).cleared;
}

function mapStars(id) {
  return mapRec(id).stars || 0;
}

function mapBest(id) {
  return mapRec(id).best || 0;
}

/** Star count from the fraction of lives left after a win */
function starsFor(livesLeft, livesMax) {
  const f = livesMax > 0 ? livesLeft / livesMax : 0;
  return f >= 0.9 ? 3 : f >= 0.6 ? 2 : 1;
}

/** Save the result; returns { best, stars, isBest, unlockedNext } */
function commitMapResult(lv, res) {
  const rec = mapRec(lv.id);
  const isBest = res.score > (rec.best || 0);
  const idx = LEVELS.indexOf(lv);
  // Must ask BEFORE saving: mapUnlocked(idx+1) reads the level just won,
  // and asking after saving would always say "unlocked".
  const nextWasLocked = !mapUnlocked(idx + 1);

  const patch = {
    best: Math.max(rec.best || 0, res.score),
    stars: Math.max(rec.stars || 0, res.stars),
    cleared: rec.cleared || res.win
  };

  mapsSet(lv.id, patch);

  return { isBest, stars: patch.stars, unlockedNext: res.win && nextWasLocked && idx + 1 < LEVELS.length };
}

function setAutoMap(id) {
  try { sessionStorage.setItem(AUTOKEY, id); } catch (e) { /* ignore */ }
}

function clearAutoMap() {
  try { sessionStorage.removeItem(AUTOKEY); } catch (e) { /* ignore */ }
}

function takeAutoMap() {
  let id = null;
  try {
    id = sessionStorage.getItem(AUTOKEY);
    if (id) sessionStorage.removeItem(AUTOKEY);
  } catch (e) { /* ignore */ }

  const i = LEVELS.findIndex(l => l.id === id);
  return i >= 0 && mapUnlocked(i) ? LEVELS[i] : null;
}

/* =====================================================
   APPLY THE LEVEL TO THE GRID
   ===================================================== */
let kinds;   // kind[c][r] = terrain symbol of the tile
let levelIdx = 0;

function applyLevel(lv) {
  level = lv;
  levelIdx = LEVELS.indexOf(lv);

  SR = lv.sr;
  GR = lv.gr;

  kinds = Array.from({ length: COLS }, () => Array(ROWS).fill('.'));

  for (const [k, c0, r0, w, h] of lv.props) {
    for (let c = c0; c < c0 + w; c++) {
      for (let r = r0; r < r0 + h; r++) {
        if (c >= 0 && r >= 0 && c < COLS && r < ROWS) kinds[c][r] = k;
      }
    }
  }

  // Keep tiles next to both gates empty so enemies can flow in and out
  kinds[0][SR] = '.';
  kinds[1][SR] = '.';
  kinds[GOALC][GR] = '.';
  kinds[GOALC - 1][GR] = '.';

  blocked = Array.from({ length: COLS }, () => Array(ROWS).fill(false));
  noBuild = Array.from({ length: COLS }, () => Array(ROWS).fill(false));

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const k = kinds[c][r];
      blocked[c][r] = BLOCK_KINDS.includes(k);
      noBuild[c][r] = blocked[c][r] || NOBUILD_KINDS.includes(k);
    }
  }

  PAL = Object.assign({
    grass: ['#72b650', '#7ac258'],
    soil: ['#8a6a38', '#b8935a', '#dcbc84', '#ecd29c'],
    water: ['#9fe3f5', '#3f9fd0'],
    wash: null
  }, lv.pal || {});

  setDist(bfs(blocked));
}

/* =====================================================
   FIELD PICKER SCREEN
   ===================================================== */
let mapsRoot = null;
let mapsEsc = null;

function closeMapSelect() {
  if (mapsEsc) {
    document.removeEventListener('keydown', mapsEsc, true);
    mapsEsc = null;
  }
  if (mapsRoot) {
    mapsRoot.remove();
    mapsRoot = null;
  }
}

/** cfg: { onPick(level), onDiff, resume:boolean } */
function showMapSelect(cfg) {
  closeMapSelect();

  const all = mapsAll();
  const cleared = LEVELS.filter(l => all[l.id] && all[l.id].cleared).length;

  const root = document.createElement('div');
  root.className = 'fr-maps';
  root.id = 'fr-maps';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Choose a field');

  const cards = LEVELS.map((lv, i) => {
    const rec = all[lv.id] || {};
    const open = mapUnlocked(i);
    const stars = rec.stars || 0;
    const play = open ? runAnyFor(lv) : null;
    const otherDiff = play && play.diff !== GC.i;

    const pips = [1, 2, 3].map(n =>
      '<i class="' + (n <= stars ? 'on' : '') + '"' +
      ' aria-label="' + n + ' stars"></i>').join('');

    return '' +
      '<button type="button" class="fr-map' + (open ? '' : ' lock') + '" data-i="' + i + '"' +
        (open ? '' : ' aria-disabled="true"') + ' style="--c:' + MAP_CHIPS[i % MAP_CHIPS.length] + '">' +
        '<span class="no">' + (i + 1) + '</span>' +
        '<span class="e">' + lv.icon + '</span>' +
        '<span class="t">' +
          '<b>' + lv.name + '</b>' +
          '<small>' + (open ? lv.desc : 'Win the previous field to unlock this one') + '</small>' +
          '<span class="meta">🌊 ' + lv.waves + ' waves · ⭐ ' + (rec.best || 0) +
          (play
            ? ' · <b class="run">🔫 ' + play.tw.length + ' weapons, mid-wave ' +
              Math.min(play.w ? play.wave : play.wave + 1, lv.waves) +
              (otherDiff ? ' (' + GC.levels[play.diff].label + ')' : '') + '</b>'
            : '') +
          '</span>' +
        '</span>' +
        '<span class="pips">' + pips + '</span>' +
        (open ? '' : '<span class="lk">🔒</span>') +
      '</button>';
  }).join('');

  root.innerHTML = '' +
    '<div class="fr-maps__card">' +
      '<div class="fr-maps__head">' +
        '<h2>Choose a Field</h2>' +
        '<span class="gc-pill gc-d' + GC.diff.i + '">' + GC.diff.emoji + ' ' + GC.diff.label + '</span>' +
      '</div>' +
      '<p class="fr-maps__sub">Explored ' + cleared + '/' + LEVELS.length + ' fields · ' +
        'new fields unlock when you win the previous one</p>' +
      '<div class="fr-maps__grid">' + cards + '</div>' +
      '<div class="fr-maps__row">' +
        (cfg.onResume
          ? '<button type="button" class="gc-btn sm" data-a="resume">▶ Back to current run</button>'
          : '') +
        '<button type="button" class="gc-btn alt sm" data-a="diff">🎚 Change difficulty</button>' +
        '<button type="button" class="gc-btn alt sm" data-a="home">🏠 Back to lobby</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(root);
  mapsRoot = root;

  root.querySelectorAll('.fr-map').forEach(b => {
    b.onclick = () => {
      const i = +b.dataset.i;
      if (!mapUnlocked(i)) {
        b.classList.add('shake');
        setTimeout(() => b.classList.remove('shake'), 400);
        return;
      }
      closeMapSelect();
      cfg.onPick(LEVELS[i]);
    };
  });

  const resumeBtn = root.querySelector('[data-a="resume"]');
  if (resumeBtn) {
    resumeBtn.onclick = () => {
      closeMapSelect();
      cfg.onResume();
    };
  }

  // Esc = return to the run in progress (if any)
  if (cfg.onResume) {
    mapsEsc = function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeMapSelect();
        cfg.onResume();
      }
    };
    document.addEventListener('keydown', mapsEsc, true);
  }

  root.querySelector('[data-a="diff"]').onclick = () => {
    closeMapSelect();
    if (cfg.onDiff) cfg.onDiff();
    else GC.change();
  };
  root.querySelector('[data-a="home"]').onclick = GC.quit;
}
