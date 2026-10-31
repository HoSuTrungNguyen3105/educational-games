/* =====================================================
   state.js · canvas, run state, account coin wallet
   ===================================================== */

const cv = document.getElementById('c');
let ctx = cv.getContext('2d');

/* ---------- Difficulty settings (assigned in main.js) ---------- */
let D;
let TOTAL = 15;
let level = null;          // current level (levels.js)
let noBuild;               // grid of tiles that can't be built on (terrain + bridges)

/* ---------- Run state ---------- */
let blocked;               // grid of tiles with towers or blocking terrain
let towers;
let enemies;
let projs;                 // projectiles
let fx;                    // short-lived effects
let parts;                 // particles
let dist;                  // distance map to the exit gate
let pathPts = [];          // path to draw
let pendingSpawns = [];    // enemies spawned mid-battle (splits, summons)

// money/names are set by reset() before the HUD draws; lives/wave need 0 so
// the first updUI() call (on the level picker) doesn't show NaN in the score.
let money;
let lives = 0;
let wave = 0;
let spawnQ;
let spawnT;
let paused;
let speed = 1;
let over;
let sel = null;            // selected tower
let build = null;          // tower type being placed
let hover = null;          // tile the mouse is over
let waveActive;
let gtime = 0;             // game clock (for animations)
let aim = null;            // aiming an airstrike
let kills = 0;
let started = false;
let shake = 0;             // screen shake amount

let strikes = [];
let waveSpawn = 0;   // enemies in the current wave (for the progress bar)
let waveDone = 0;    // enemies killed or leaked
let gfx = true;      // environment effects (clouds, pollen) — toggled in settings

const skill = {
  strike: { cd: 0, max: 40 },
  freeze: { cd: 0, max: 55 }
};

/* =====================================================
   WALLET = ACCOUNT COINS
   When the game runs inside the app (iframe), the React host owns the wallet:
   localStorage is read right away on entry (no waiting for the network),
   and the /auth/me/wallet API updates the real coin count.
   Every earn/spend in the game only reports the DIFFERENCE to the host
   → the host adds it up and sends once; if the network drops, the host keeps it.
   Opening the .html file directly (no host) → coins follow the difficulty.
   ===================================================== */
const HOSTED = !!(window.parent && window.parent !== window);
const WKEY = 'gq_coin_wallet_v1';

function walletCoins() {
  try {
    return Math.max(0, Number(JSON.parse(localStorage.getItem(WKEY) || '{}').coins) || 0);
  } catch (e) {
    return 0;
  }
}

function purseShift(d) {
  money = Math.max(0, money + d);

  if (HOSTED) {
    try {
      window.parent.postMessage({ type: 'gq:walletDelta', data: { amount: d } }, '*');
    } catch (e) { /* ignore */ }
  }

  updUI();
}

/** Earn coins (kill rewards, wave bonus, tower sale) → the account coin balance grows. */
function earn(d) {
  if (d > 0) {
    purseShift(d);
    pulse('stMoney');
  }
}

/** Pay coins (building, upgrading) → deducted straight from the account coin balance. */
function pay(d) {
  if (d > 0) purseShift(-d);
}

addEventListener('message', function (ev) {
  const m = ev && ev.data;
  if (!m || m.type !== 'gq:wallet') return;

  money = Math.max(0, Number(m.coins) || 0);
  updUI();
});

if (HOSTED) {
  try {
    window.parent.postMessage({ type: 'gq:walletGet', data: {} }, '*');
  } catch (e) { /* ignore */ }
}

/* =====================================================
   Reset the run
   ===================================================== */
function reset() {
  // Rebuild the grid from the level terrain (removes every built tower)
  applyLevel(level);

  towers = [];
  enemies = [];
  projs = [];
  fx = [];
  parts = [];
  pendingSpawns = [];
  strikes = [];

  money = HOSTED ? walletCoins() : D.money;
  lives = D.lives;
  wave = 0;
  spawnQ = [];
  spawnT = 0;
  waveActive = false;
  paused = false;
  over = false;
  sel = null;
  build = null;
  aim = null;
  kills = 0;
  shake = 0;
  waveSpawn = 0;
  waveDone = 0;

  skill.strike.cd = 0;
  skill.freeze.cd = 0;

  $('go').textContent = '▶ Start wave 1';
  $('go').disabled = false;
  $('pause').textContent = '⏸';
  $('speed').textContent = 'x' + speed;

  document.querySelectorAll('.tw').forEach(b => b.classList.remove('sel'));
  closeSettings();

  const modal = document.getElementById('gc-modal');
  if (modal) modal.remove();

  updUI();
  showInfo();
  showPreview();
}
