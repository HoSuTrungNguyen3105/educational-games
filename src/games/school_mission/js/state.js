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

/* ── Thú cưng: loài + thức ăn dùng chung cho Vườn thú cưng và Nhà ăn ── */
const PET_SPECIES = {
  dog:    { icon: "🐶", name: "Cún con",  color: "#ffcc80" },
  cat:    { icon: "🐱", name: "Mèo con",  color: "#ffe0b2" },
  bird:   { icon: "🐦", name: "Chim nhỏ", color: "#b3e5fc" },
  fish:   { icon: "🐟", name: "Cá vàng",  color: "#ffcc80" },
  monkey: { icon: "🐵", name: "Khỉ con",  color: "#d7ccc8" }
};
const PET_FOODS = {
  bone: { name: "Xương gặm",      icon: "🦴", price: 8,  exp: 20, hunger: 25, bond: 2, energy: 2,  desc: "Món khoái khẩu" },
  fish: { name: "Cá tươi",        icon: "🐟", price: 12, exp: 32, hunger: 32, bond: 4, energy: 5,  desc: "Giàu dinh dưỡng" },
  seed: { name: "Hạt dinh dưỡng", icon: "🌰", price: 10, exp: 26, hunger: 22, bond: 3, energy: 8,  desc: "Tốt cho sức khỏe" },
  cake: { name: "Bánh thưởng",    icon: "🍰", price: 20, exp: 48, hunger: 38, bond: 7, energy: 10, desc: "Món yêu thích" }
};
function defaultPetState() {
  return {
    species: "dog", name: "Bồng", color: "cream",
    level: 1, exp: 0, expNeeded: 200,
    mood: "happy", bonded: 10,
    hunger: 80, happy: 80, clean: 80, energy: 80,
    food: { bone: 2, fish: 0, seed: 0, cake: 0 },
    ownedAccessories: [], equipped: "",
    claimed: {},
    totalFeeds: 0, totalPlays: 0, totalWashes: 0, totalCorrect: 0, totalWrong: 0,
    lastCareAt: Date.now()
  };
}

let S = {
  coins: 100, gems: 0, xp: 0, lv: 1, en: 100,
  hat: "", col: "#ff9f43", own: ["", "#ff9f43"], q: {},
  pet: defaultPetState()
};
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
const D={out:[3200,2000],hall:[1700,420],hall2:[1700,420],room:[1000,600],can:[1400,800]};
let sc="out",rk="math",fade=0,open_=false,tt=0,ft=[],flowers=[],ftime=0;
const me={x:1600,y:900,mv:0,t:0};
// Tên dán trên đầu nhân vật của bé — do app gửi vào (window.__SCHOOL_INIT__.playerName)
var playerName="Bạn";
