/* =====================================================
   config.js · hằng số, dữ liệu tháp, dữ liệu kẻ địch
   ===================================================== */

/* ---------- Kích thước bản đồ ---------- */
const CW = 960;            // chiều rộng canvas
const CH = 600;            // chiều cao canvas
const CS = 40;             // kích thước 1 ô
const COLS = 24;
const ROWS = 15;
const SR = 7;              // hàng cổng vào (bên trái)
const GR = 7;              // hàng cổng ra (bên phải)
const GOALC = COLS - 1;    // cột cổng ra

const MAXLV = 5;           // cấp tháp tối đa
const INK = '#1c1b3a';     // màu viền chủ đạo

/* ---------- Từ đợt này trở đi kẻ địch mạnh hơn hẳn ---------- */
const HARD_WAVE = 10;

/* ---------- Phím tắt chọn tháp ---------- */
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];

/* ---------- Chế độ ngắm mục tiêu của tháp ---------- */
const MODES = ['Đầu tiên', 'Mạnh nhất', 'Gần nhất'];

/* =====================================================
   THÁP / VŨ KHÍ
   ===================================================== */
const TYPES = {
  gun: {
    name: 'Súng máy', cost: 50, range: 3.0, dmg: 7, rate: 0.3,
    color: '#4a90d9', air: true, ground: true,
    desc: 'Bắn nhanh, đánh cả trên không. Cấp cao thành 3 nòng.'
  },
  cannon: {
    name: 'Pháo', cost: 100, range: 3.4, dmg: 30, rate: 1.3,
    color: '#e8923a', air: false, ground: true, splash: 60,
    desc: 'Nổ lan, chỉ bắn mặt đất.'
  },
  frost: {
    name: 'Tháp băng', cost: 80, range: 2.8, dmg: 3, rate: 0.7,
    color: '#58d3e8', air: true, ground: true, slow: 0.5,
    desc: 'Làm chậm kẻ địch. Cấp cao đóng băng mạnh hơn.'
  },
  sniper: {
    name: 'Bắn tỉa', cost: 150, range: 7.0, dmg: 65, rate: 1.8,
    color: '#a45bd6', air: true, ground: true, hit: true, pierce: true,
    desc: 'Tầm xa, xuyên giáp, bắn trúng ngay.'
  },
  flame: {
    name: 'Phun lửa', cost: 120, range: 2.3, dmg: 6, rate: 0.15,
    color: '#ff6a2b', air: false, ground: true, burnDps: 12,
    desc: 'Thiêu đốt, gây cháy liên tục.'
  },
  tesla: {
    name: 'Tháp sét', cost: 180, range: 3.2, dmg: 22, rate: 0.9,
    color: '#f2e14c', air: true, ground: true, chain: 3,
    desc: 'Sét lan sang nhiều mục tiêu.'
  },
  poison: {
    name: 'Tháp độc', cost: 140, range: 3.0, dmg: 5, rate: 0.5,
    color: '#7ad04a', air: false, ground: true, poisonDps: 10,
    desc: 'Đầu độc, sát thương theo thời gian.'
  },
  missile: {
    name: 'Tên lửa', cost: 200, range: 5.0, dmg: 55, rate: 1.6,
    color: '#ff5fa2', air: true, ground: true, splash: 70, pierce: true,
    desc: 'Chống không, nổ lan, xuyên giáp.'
  },
  laser: {
    name: 'Tia laser', cost: 260, range: 4.2, dmg: 22, rate: 0.05,
    color: '#ff3b6b', air: true, ground: true, laser: true, pierce: true,
    desc: 'Tia liên tục, càng bắn lâu vào một mục tiêu càng mạnh.'
  },
  rail: {
    name: 'Điện từ', cost: 350, range: 8.5, dmg: 160, rate: 3.0,
    color: '#46e0ff', air: true, ground: true, rail: true, pierce: true,
    desc: 'Phát bắn xuyên thẳng hàng, xuyên giáp. Cực mạnh.'
  },
  mortar: {
    name: 'Cối', cost: 220, range: 8.0, dmg: 85, rate: 2.4,
    color: '#9aa86a', air: false, ground: true, splash: 80, mortar: true, minR: 2.2,
    desc: 'Tầm cực xa, nổ lan rộng, chỉ bắn mặt đất.'
  },
  radar: {
    name: 'Radar', cost: 160, range: 3.2, dmg: 0, rate: 1,
    color: '#35d0a0', air: false, ground: false, support: true,
    desc: 'Tăng sát thương & tầm bắn tháp gần đó, lộ diện kẻ tàng hình.'
  }
};

/* =====================================================
   KẺ ĐỊCH
   n: tên · ic: biểu tượng · hp: máu · sp: tốc độ · rw: tiền thưởng
   r: bán kính · armor: giáp · air: bay · dmg: số mạng bị trừ khi lọt
   ===================================================== */
const EDEF = {
  /* ----- Nhóm cơ bản ----- */
  grunt:    { n: 'Lính',       ic: '🧟', hp: 40,   sp: 55,  rw: 5,   col: '#6cbf4a', r: 11 },
  runner:   { n: 'Chạy',       ic: '🏃', hp: 26,   sp: 105, rw: 6,   col: '#f0d03a', r: 9 },
  tank:     { n: 'Xe tăng',    ic: '🚜', hp: 240,  sp: 34,  rw: 14,  col: '#8a5a3a', r: 15 },
  plane:    { n: 'Máy bay',    ic: '✈️', hp: 70,   sp: 75,  rw: 9,   col: '#e8e8f2', r: 12, air: true },
  boss:     { n: 'Trùm',       ic: '👹', hp: 1800, sp: 28,  rw: 150, col: '#c0392b', r: 20, dmg: 5 },
  armored:  { n: 'Giáp',       ic: '🪖', hp: 170,  sp: 45,  rw: 16,  col: '#6a7a88', r: 14, armor: 6 },
  shielded: { n: 'Khiên',      ic: '🔰', hp: 110,  sp: 50,  rw: 14,  col: '#4a7ab8', r: 13, shield: 120 },
  healer:   { n: 'Y tá',       ic: '💊', hp: 100,  sp: 50,  rw: 20,  col: '#e05fc8', r: 12, heal: true },
  bomber:   { n: 'Ném bom',    ic: '💣', hp: 110,  sp: 90,  rw: 14,  col: '#9a6ac0', r: 13, air: true, dmg: 2 },
  splitter: { n: 'Phân thân',  ic: '🧬', hp: 160,  sp: 48,  rw: 12,  col: '#c07a3a', r: 16, split: 'mini' },
  berserk:  { n: 'Cuồng nộ',   ic: '😡', hp: 200,  sp: 45,  rw: 22,  col: '#e03a3a', r: 14, berserk: true },
  ghost:    { n: 'Ma',         ic: '👻', hp: 90,   sp: 75,  rw: 16,  col: '#a0d8e8', r: 12, stealth: true },
  mini:     { n: 'Con',        ic: '🐛', hp: 18,   sp: 80,  rw: 2,   col: '#c07a3a', r: 7 },

  /* ----- Nhóm nâng cao ----- */
  bat:      { n: 'Dơi',        ic: '🦇', hp: 34,   sp: 120, rw: 7,   col: '#6b4a8a', r: 9, air: true },
  ninja:    { n: 'Ninja',      ic: '🥷', hp: 120,  sp: 95,  rw: 20,  col: '#2e2e48', r: 11, evade: 0.3 },
  knight:   { n: 'Hiệp sĩ',    ic: '🤺', hp: 340,  sp: 38,  rw: 26,  col: '#aeb8c6', r: 15, armor: 10 },
  wizard:   { n: 'Pháp sư',    ic: '🧙', hp: 130,  sp: 46,  rw: 24,  col: '#6a58d8', r: 12, haste: true },
  summoner: { n: 'Triệu hồi',  ic: '🧛', hp: 260,  sp: 36,  rw: 34,  col: '#7a2a66', r: 14, summon: true },
  golem:    { n: 'Golem',      ic: '🗿', hp: 1000, sp: 24,  rw: 70,  col: '#8a8f98', r: 19, dmg: 2, armor: 8 },
  dragon:   { n: 'Rồng',       ic: '🐉', hp: 3200, sp: 40,  rw: 220, col: '#d94a3a', r: 24, air: true, dmg: 8 },
  titan:    { n: 'Titan',      ic: '👺', hp: 7500, sp: 22,  rw: 500, col: '#4a2f6a', r: 26, dmg: 10, armor: 5 },

  /* ----- MỚI: kẻ địch hạng nặng, xuất hiện từ các đợt cuối ----- */
  juggernaut: { n: 'Thiết giáp',   ic: '🛡️', hp: 900, sp: 30,  rw: 60,  col: '#58606e', r: 18, armor: 12, dmg: 2 },
  phoenix:    { n: 'Phượng hoàng', ic: '🔥', hp: 650, sp: 70,  rw: 80,  col: '#ff8a2a', r: 15, air: true, revive: true, dmg: 3 },
  warlock:    { n: 'Phù thủy đen', ic: '🔮', hp: 420, sp: 40,  rw: 60,  col: '#3a2a7a', r: 13, warlock: true },
  reaper:     { n: 'Tử thần',      ic: '💀', hp: 520, sp: 100, rw: 90,  col: '#2a2a3a', r: 13, evade: 0.35, stealth: true, armor: 4 }
};

/* =====================================================
   TINH ANH (ELITE) · xuất hiện từ đợt HARD_WAVE
   Kẻ địch tinh anh có vòng sáng vàng, máu trâu hơn,
   giáp dày hơn, chạy nhanh hơn và rơi nhiều tiền hơn.
   ===================================================== */
const ELITE = {
  hpMul: 1.7,       // nhân máu
  spdMul: 1.12,     // nhân tốc độ
  rwMul: 2,         // nhân tiền thưởng
  baseArmor: 2,     // giáp cộng thêm cơ bản
  armorEvery: 5,    // cứ mỗi bấy nhiêu đợt (sau HARD_WAVE) cộng thêm 1 giáp
  aegisWave: 15,    // từ đợt này tinh anh có thêm khiên năng lượng
  aegisPct: 0.3     // khiên = % máu tối đa
};

/** Xác suất một kẻ địch (không phải trùm) là tinh anh ở đợt n */
function eliteChance(n) {
  if (n < HARD_WAVE) return 0;
  return Math.min(0.55, 0.08 + (n - HARD_WAVE) * 0.03);
}

/** Hệ số máu cộng thêm cho các đợt sau HARD_WAVE */
function lateHpMul(n) {
  return n < HARD_WAVE ? 1 : 1 + 0.07 * (n - HARD_WAVE + 1);
}
