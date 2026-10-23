/* =====================================================
   state.js · canvas, trạng thái ván chơi, ví xu tài khoản
   ===================================================== */

const cv = document.getElementById('c');
let ctx = cv.getContext('2d');

/* ---------- Cấu hình theo độ khó (được gán trong main.js) ---------- */
let D;
let TOTAL = 15;
let level = null;          // màn đang chơi (levels.js)
let noBuild;               // lưới ô không xây được (địa hình + cầu)

/* ---------- Trạng thái ván chơi ---------- */
let blocked;               // lưới ô đã có tháp hoặc địa hình chặn
let towers;
let enemies;
let projs;                 // đạn
let fx;                    // hiệu ứng ngắn
let parts;                 // hạt
let dist;                  // bản đồ khoảng cách tới cổng ra
let pathPts = [];          // đường đi để vẽ
let pendingSpawns = [];    // địch sinh ra giữa trận (phân thân, triệu hồi)

let money;
let lives;
let wave;
let spawnQ;
let spawnT;
let paused;
let speed = 1;
let over;
let sel = null;            // tháp đang chọn
let build = null;          // loại tháp đang đặt
let hover = null;          // ô chuột đang trỏ
let waveActive;
let gtime = 0;             // đồng hồ trò chơi (cho hoạt ảnh)
let aim = null;            // đang ngắm không kích
let kills = 0;
let started = false;
let shake = 0;             // độ rung màn hình

let strikes = [];
let waveSpawn = 0;   // số địch của đợt đang chạy (vẽ thanh tiến trình)
let waveDone = 0;    // số địch đã diệt hoặc đã lọt
let gfx = true;      // hiệu ứng môi trường (mây, phấn hoa) — bật/tắt trong cài đặt

const skill = {
  strike: { cd: 0, max: 40 },
  freeze: { cd: 0, max: 55 }
};

/* =====================================================
   TÚI TIỀN = XU TÀI KHOẢN
   Game mở trong app (iframe) thì host React giữ ví:
   localStorage là bản đọc ngay khi vào game (không chờ mạng),
   API /auth/me/coins cập nhật số xu thật.
   Mỗi lần nhận/thu tiền trong game chỉ báo CHÊNH LỆCH cho host
   → host cộng dồn và gửi một lần; mất mạng thì host giữ lại.
   Mở file .html trực tiếp (không có host) → giữ tiền theo độ khó.
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
    } catch (e) { /* bỏ qua */ }
  }

  updUI();
}

/** Nhận tiền (thưởng diệt địch, thưởng đợt, bán trụ) → xu tài khoản tăng theo. */
function earn(d) {
  if (d > 0) {
    purseShift(d);
    pulse('stMoney');
  }
}

/** Trả tiền (xây trụ, nâng cấp) → trừ thẳng vào xu tài khoản. */
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
  } catch (e) { /* bỏ qua */ }
}

/* =====================================================
   Đặt lại ván chơi
   ===================================================== */
function reset() {
  // Dựng lại lưới từ địa hình của màn (xoá hết tháp đã xây)
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

  $('go').textContent = '▶ Bắt đầu đợt 1';
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
