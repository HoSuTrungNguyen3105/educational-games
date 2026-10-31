/* =====================================================
   config.js · constants, tower data, enemy data
   ===================================================== */

/* ---------- Map size ---------- */
const CW = 960;            // canvas width
const CH = 600;            // canvas height
const CS = 40;             // size of one tile
const COLS = 24;
const ROWS = 15;
/* Entrance row (left) and exit row (right) — adjusted per level in levels.js */
let SR = 7;
let GR = 7;
const GOALC = COLS - 1;    // exit column

const MAXLV = 5;           // max tower level
const INK = '#1c1b3a';     // main outline color

/* ---------- From this wave on, enemies get much stronger ---------- */
const HARD_WAVE = 10;

/* ---------- Tower selection hotkeys ---------- */
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];

/* ---------- Tower targeting modes ---------- */
const MODES = ['First', 'Strongest', 'Closest'];

/* =====================================================
   TOWERS / WEAPONS
   ===================================================== */
const TYPES = {
  gun: {
    name: 'Machine Gun', cost: 50, range: 3.0, dmg: 7, rate: 0.3,
    color: '#4a90d9', air: true, ground: true,
    desc: 'Fires fast and hits air too. Max level gives it 3 barrels.'
  },
  cannon: {
    name: 'Cannon', cost: 100, range: 3.4, dmg: 30, rate: 1.3,
    color: '#e8923a', air: false, ground: true, splash: 60,
    desc: 'Splash damage, ground targets only.'
  },
  frost: {
    name: 'Frost Tower', cost: 80, range: 2.8, dmg: 3, rate: 0.7,
    color: '#58d3e8', air: true, ground: true, slow: 0.5,
    desc: 'Slows enemies down. Higher levels freeze harder.'
  },
  sniper: {
    name: 'Sniper', cost: 150, range: 7.0, dmg: 65, rate: 1.8,
    color: '#a45bd6', air: true, ground: true, hit: true, pierce: true,
    desc: 'Long range, pierces armor, hits instantly.'
  },
  flame: {
    name: 'Flamethrower', cost: 120, range: 2.3, dmg: 6, rate: 0.15,
    color: '#ff6a2b', air: false, ground: true, burnDps: 12,
    desc: 'Sets enemies on fire with burning damage over time.'
  },
  tesla: {
    name: 'Tesla Tower', cost: 180, range: 3.2, dmg: 22, rate: 0.9,
    color: '#f2e14c', air: true, ground: true, chain: 3,
    desc: 'Lightning chains to several targets.'
  },
  poison: {
    name: 'Poison Tower', cost: 140, range: 3.0, dmg: 5, rate: 0.5,
    color: '#7ad04a', air: false, ground: true, poisonDps: 10,
    desc: 'Poisons enemies with damage over time.'
  },
  missile: {
    name: 'Missile', cost: 200, range: 5.0, dmg: 55, rate: 1.6,
    color: '#ff5fa2', air: true, ground: true, splash: 70, pierce: true,
    desc: 'Hits air, splash damage, pierces armor.'
  },
  laser: {
    name: 'Laser Beam', cost: 260, range: 4.2, dmg: 22, rate: 0.05,
    color: '#ff3b6b', air: true, ground: true, laser: true, pierce: true,
    desc: 'A steady beam that gets stronger the longer it hits one target.'
  },
  rail: {
    name: 'Railgun', cost: 350, range: 8.5, dmg: 160, rate: 3.0,
    color: '#46e0ff', air: true, ground: true, rail: true, pierce: true,
    desc: 'Fires straight through a whole line and pierces armor. Super strong.'
  },
  mortar: {
    name: 'Mortar', cost: 220, range: 8.0, dmg: 85, rate: 2.4,
    color: '#9aa86a', air: false, ground: true, splash: 80, mortar: true, minR: 2.2,
    desc: 'Very long range, wide splash, ground targets only.'
  },
  radar: {
    name: 'Radar', cost: 160, range: 3.2, dmg: 0, rate: 1,
    color: '#35d0a0', air: false, ground: false, support: true,
    desc: 'Boosts damage and range of nearby towers, and reveals invisible enemies.'
  }
};

/* =====================================================
   ENEMIES
   n: name · ic: icon · hp: health · sp: speed · rw: coin reward
   r: radius · armor: armor · air: flying · dmg: lives lost when it leaks
   ===================================================== */
const EDEF = {
  /* ----- Basic group ----- */
  grunt:    { n: 'Grunt',      ic: '🧟', hp: 40,   sp: 55,  rw: 5,   col: '#6cbf4a', r: 11 },
  runner:   { n: 'Runner',     ic: '🏃', hp: 26,   sp: 105, rw: 6,   col: '#f0d03a', r: 9 },
  tank:     { n: 'Tank',       ic: '🚜', hp: 240,  sp: 34,  rw: 14,  col: '#8a5a3a', r: 15 },
  plane:    { n: 'Plane',      ic: '✈️', hp: 70,   sp: 75,  rw: 9,   col: '#e8e8f2', r: 12, air: true },
  boss:     { n: 'Boss',       ic: '👹', hp: 1800, sp: 28,  rw: 150, col: '#c0392b', r: 20, dmg: 5 },
  armored:  { n: 'Armored',    ic: '🪖', hp: 170,  sp: 45,  rw: 16,  col: '#6a7a88', r: 14, armor: 6 },
  shielded: { n: 'Shielded',   ic: '🔰', hp: 110,  sp: 50,  rw: 14,  col: '#4a7ab8', r: 13, shield: 120 },
  healer:   { n: 'Medic',      ic: '💊', hp: 100,  sp: 50,  rw: 20,  col: '#e05fc8', r: 12, heal: true },
  bomber:   { n: 'Bomber',     ic: '💣', hp: 110,  sp: 90,  rw: 14,  col: '#9a6ac0', r: 13, air: true, dmg: 2 },
  splitter: { n: 'Splitter',   ic: '🧬', hp: 160,  sp: 48,  rw: 12,  col: '#c07a3a', r: 16, split: 'mini' },
  berserk:  { n: 'Berserker',  ic: '😡', hp: 200,  sp: 45,  rw: 22,  col: '#e03a3a', r: 14, berserk: true },
  ghost:    { n: 'Ghost',      ic: '👻', hp: 90,   sp: 75,  rw: 16,  col: '#a0d8e8', r: 12, stealth: true },
  mini:     { n: 'Mini',       ic: '🐛', hp: 18,   sp: 80,  rw: 2,   col: '#c07a3a', r: 7 },

  /* ----- Advanced group ----- */
  bat:      { n: 'Bat',        ic: '🦇', hp: 34,   sp: 120, rw: 7,   col: '#6b4a8a', r: 9, air: true },
  ninja:    { n: 'Ninja',      ic: '🥷', hp: 120,  sp: 95,  rw: 20,  col: '#2e2e48', r: 11, evade: 0.3 },
  knight:   { n: 'Knight',     ic: '🤺', hp: 340,  sp: 38,  rw: 26,  col: '#aeb8c6', r: 15, armor: 10 },
  wizard:   { n: 'Wizard',     ic: '🧙', hp: 130,  sp: 46,  rw: 24,  col: '#6a58d8', r: 12, haste: true },
  summoner: { n: 'Summoner',   ic: '🧛', hp: 260,  sp: 36,  rw: 34,  col: '#7a2a66', r: 14, summon: true },
  golem:    { n: 'Golem',      ic: '🗿', hp: 1000, sp: 24,  rw: 70,  col: '#8a8f98', r: 19, dmg: 2, armor: 8 },
  dragon:   { n: 'Dragon',     ic: '🐉', hp: 3200, sp: 40,  rw: 220, col: '#d94a3a', r: 24, air: true, dmg: 8 },
  titan:    { n: 'Titan',      ic: '👺', hp: 7500, sp: 22,  rw: 500, col: '#4a2f6a', r: 26, dmg: 10, armor: 5 },

  /* ----- NEW: heavy enemies that show up in the late waves ----- */
  juggernaut: { n: 'Juggernaut', ic: '🛡️', hp: 900, sp: 30,  rw: 60,  col: '#58606e', r: 18, armor: 12, dmg: 2 },
  phoenix:    { n: 'Phoenix',    ic: '🔥', hp: 650, sp: 70,  rw: 80,  col: '#ff8a2a', r: 15, air: true, revive: true, dmg: 3 },
  warlock:    { n: 'Dark Warlock', ic: '🔮', hp: 420, sp: 40,  rw: 60,  col: '#3a2a7a', r: 13, warlock: true },
  reaper:     { n: 'Reaper',     ic: '💀', hp: 520, sp: 100, rw: 90,  col: '#2a2a3a', r: 13, evade: 0.35, stealth: true, armor: 4 }
};

/* =====================================================
   ELITE ENEMIES · show up from HARD_WAVE onward
   Elites have a golden glow, more health, thicker
   armor, faster legs and drop more coins.
   ===================================================== */
const ELITE = {
  hpMul: 1.7,       // health multiplier
  spdMul: 1.12,     // speed multiplier
  rwMul: 2,         // coin reward multiplier
  baseArmor: 2,     // base bonus armor
  armorEvery: 5,    // +1 armor every this many waves (after HARD_WAVE)
  aegisWave: 15,    // from this wave elites also get an energy shield
  aegisPct: 0.3     // shield = % of max health
};

/** Chance that an enemy (not a boss) is an elite on wave n */
function eliteChance(n) {
  if (n < HARD_WAVE) return 0;
  return Math.min(0.55, 0.08 + (n - HARD_WAVE) * 0.03);
}

/** Extra health multiplier for waves after HARD_WAVE */
function lateHpMul(n) {
  return n < HARD_WAVE ? 1 : 1 + 0.07 * (n - HARD_WAVE + 1);
}
