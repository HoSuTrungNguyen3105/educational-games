// ===== STATE: tiến trình người chơi (lưu localStorage), cảnh hiện tại, nhân vật =====
// Đồng bộ ví coin tài khoản (key gq_coin_wallet_v1 trong localStorage)
function getProfileWallet() {
  try {
    const raw = JSON.parse(localStorage.getItem("gq_coin_wallet_v1") || "null");
    if (raw && typeof raw.coins === "number") {
      return {
        coins: Math.max(0, Math.round(raw.coins)),
        pending: Number(raw.pending) || 0,
        updatedAt: Number(raw.updatedAt) || Date.now()
      };
    }
  } catch (e) {}
  return null;
}

function syncProfileWallet(newCoins) {
  try {
    const target = Math.max(0, Math.round(Number(newCoins) || 0));
    const raw = JSON.parse(localStorage.getItem("gq_coin_wallet_v1") || "{}");
    const current = typeof raw.coins === "number" ? Math.max(0, Math.round(raw.coins)) : target;
    const diff = target - current;
    raw.coins = target;
    raw.pending = (Number(raw.pending) || 0) + diff;
    raw.updatedAt = Date.now();
    localStorage.setItem("gq_coin_wallet_v1", JSON.stringify(raw));
    if (window.parent && window.parent !== window && diff !== 0) {
      try {
        window.parent.postMessage({ type: "gq:walletDelta", data: { amount: diff } }, "*");
        window.parent.postMessage({ type: "gq:wallet", coins: target, delta: diff }, "*");
      } catch (e) {}
    }
  } catch (e) {}
}

let S = { coins: 100, gems: 0, xp: 0, lv: 1, en: 100, hat: "", col: "#ff9f43", own: ["", "#ff9f43"], q: {} };
try {
  const s = localStorage.getItem("tvv");
  if (s) S = Object.assign(S, JSON.parse(s));
} catch (e) {}

// Ưu tiên số coin từ ví tài khoản profile gq_coin_wallet_v1
const pWallet = getProfileWallet();
if (pWallet !== null) {
  S.coins = pWallet.coins;
} else {
  syncProfileWallet(S.coins);
}

S.exam = S.exam || {};
function save() {
  S._updated = Date.now();
  syncProfileWallet(S.coins);
  try { localStorage.setItem("tvv", JSON.stringify(S)); } catch (e) {}
  try { if (typeof scheduleSchoolSync === "function") scheduleSchoolSync(); } catch (e) {}
}

// Lắng nghe thay đổi ví coin từ bên ngoài (Profile / Home / Wallet API)
window.addEventListener("storage", function (e) {
  if (e.key === "gq_coin_wallet_v1") {
    const pw = getProfileWallet();
    if (pw && pw.coins !== S.coins) {
      S.coins = pw.coins;
      const coinEl = document.getElementById("coin");
      if (coinEl) coinEl.textContent = "🪙 " + S.coins;
      if (typeof updateGardenWalletHUD === "function") updateGardenWalletHUD();
    }
  }
});
window.addEventListener("message", function (e) {
  const msg = e && e.data;
  if (!msg || typeof msg !== "object") return;
  if (msg.type === "gq:wallet" && typeof msg.coins === "number") {
    S.coins = Math.max(0, Math.round(msg.coins));
    const coinEl = document.getElementById("coin");
    if (coinEl) coinEl.textContent = "🪙 " + S.coins;
    if (typeof updateGardenWalletHUD === "function") updateGardenWalletHUD();
  }
});
const D={out:[2400,1400],hall:[1700,420],hall2:[1700,420],room:[1000,600]};
let sc="out",rk="math",fade=0,open_=false,tt=0,ft=[],flowers=[],ftime=0;
const me={x:1200,y:720,mv:0,t:0};
// Tên dán trên đầu nhân vật của bé — do app gửi vào (window.__SCHOOL_INIT__.playerName)
var playerName="Bạn";
