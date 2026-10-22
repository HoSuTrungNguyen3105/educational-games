/**
 * coinWallet.js — túi tiền (xu tài khoản) dùng cho game offline.
 *
 * Luồng tiền:
 *   · load trang  → gọi API lấy xu rồi lưu localStorage, game đọc localStorage
 *                   nên mở được ngay cả khi mạng đang chậm hoặc mất mạng
 *   · có mạng     → mỗi thay đổi được POST /auth/me/coins (dương = thêm, âm = trừ)
 *   · mất mạng    → giữ chênh lệch trong `pending` và dùng waitForOnline() để đợi
 *                   có mạng rồi gửi lại, server cập nhật xu vào tài khoản
 *
 * localStorage là nguồn mà game đọc ngay; API là nguồn đúng nhất nên mỗi lần
 * sync thành công thì `coins` lấy theo số server trả về.
 */
import { coinService, loadAuth } from "../services/api.js";

const KEY = "gq_coin_wallet_v1";
const SYNC_DEBOUNCE_MS = 800;

/** Gọi được API khi có mạng VÀ đã đăng nhập (game offline chơi được khi chưa login). */
const canApi = () => navigator.onLine && !!loadAuth()?.token;

export function readWallet() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      coins: Math.max(0, Number(raw.coins) || 0),
      pending: Number(raw.pending) || 0,
      updatedAt: Number(raw.updatedAt) || 0,
    };
  } catch {
    return { coins: 0, pending: 0, updatedAt: 0 };
  }
}

function writeWallet({ coins, pending }) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ coins: Math.max(0, Math.round(coins)), pending: Math.round(pending), updatedAt: Date.now() })
    );
  } catch { /* storage đầy hoặc bị chặn */ }
}

export const cachedCoins = () => readWallet().coins;

/**
 * Đồng bộ với API: gửi phần chênh đang chờ (nếu có), ngược lại đọc số xu mới nhất.
 * Lỗi mạng thì giữ nguyên `pending` để lần sau gửi tiếp.
 */
export async function syncWallet() {
  if (!canApi()) return readWallet();
  const w = readWallet();
  try {
    if (w.pending !== 0) {
      const res = await coinService.add(w.pending);
      const coins = Number(res?.coins);
      writeWallet({ coins: Number.isFinite(coins) ? coins : w.coins, pending: 0 });
    } else {
      const res = await coinService.get();
      writeWallet({ coins: Number(res?.coins) || 0, pending: 0 });
    }
  } catch {
    // API lỗi / token hết hạn → vẫn còn bản cache, game chơi tiếp được
  }
  return readWallet();
}

/** Mở màn chơi: gọi API lấy xu mới nhất (bỏ qua nếu mất mạng) rồi trả số xu để game hiển thị. */
export async function loadWallet() {
  if (!canApi()) return readWallet();
  return syncWallet();
}

/**
 * Cộng/trừ xu theo kết quả trong game.
 * Trả về ví đã cập nhật — không cho xuống dưới 0, và chỉ ghi `pending` đúng
 * phần chênh thật sự được áp dụng để gửi lên API.
 */
export function addCoins(amount) {
  const n = Math.round(Number(amount) || 0);
  if (!n) return readWallet();
  const w = readWallet();
  const coins = Math.max(0, w.coins + n);
  writeWallet({ coins, pending: w.pending + (coins - w.coins) });
  notify();
  queueSync();
  return readWallet();
}

/** Ghi số xu tuyệt đối (khi host hoặc API đưa ra giá trị chuẩn). */
export function setCoins(coins) {
  const w = readWallet();
  writeWallet({ coins: Math.max(0, Number(coins) || 0), pending: w.pending });
  notify();
  return readWallet();
}

/** "Hàm đợi": chỉ kết thúc khi có mạng và đã đăng nhập → hết chờ thì gửi xu đi. */
let waiting = null;
export function waitForOnline() {
  if (canApi()) return Promise.resolve(true);
  if (waiting) return waiting;
  waiting = new Promise((resolve) => {
    const timer = setInterval(tick, 5000);
    function onUp() { finish(); }
    function tick() { if (canApi()) finish(); }
    function finish() {
      clearInterval(timer);
      window.removeEventListener("online", onUp);
      waiting = null;
      resolve(true);
    }
    window.addEventListener("online", onUp);
  });
  return waiting;
}

let syncTimer = null;
let syncing = null;

function queueSync() {
  if (!canApi()) {
    waitForOnline().then(() => syncWallet().then(notify));
    return;
  }
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    // Gom các thay đổi liên tiếp (mua trụ, thưởng đợt) vào MỘT lần gọi API.
    syncing = (syncing || Promise.resolve())
      .then(() => syncWallet())
      .then(notify)
      .finally(() => { syncing = null; });
  }, SYNC_DEBOUNCE_MS);
}

const listeners = new Set();
function notify() {
  const w = readWallet();
  for (const fn of listeners) { try { fn(w); } catch { /* listener lỗi không làm gãy luồng tiền */ } }
}

export function subscribeWallet(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Gắn vào main.jsx — mạng vừa có lại là gửi phần xu còn chờ. */
export function armCoinWallet() {
  window.addEventListener("online", () => { syncWallet().then(notify); });
}
