/**
 * schoolMissionRewards.js — đổi phần thưởng "Trường Vui Vẻ" thành coin THẬT
 * trong ví tài khoản (/auth/me/wallet).
 *
 * Game chạy trong iframe và không giữ token, nên chỉ bắn sự kiện
 * { type: "school-coin", data: { amount, reason } }. Trang game gọi hàm này:
 *   · trần 100 coin/ngày chặn việc bé farm đi farm lại cùng một câu hỏi,
 *   · chưa đăng nhập hoặc mất mạng thì KHÔNG cộng, trả `code` về để game báo
 *     đúng nguyên nhân (đừng để bé tưởng là đã nhận).
 */

import { loadAuth, walletService } from "../services/api.js";

const LEDGER_KEY = "edu_school_coin_reward_v1";
const DAILY_CAP = 100;
const MAX_EVENT = 60; // phần thưởng lớn nhất của một nhiệm vụ trong game
const ALLOWED_REASON = /^(quest:|highscore:|perfect:)/;

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function readLedger() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEDGER_KEY) || "null");
    if (saved && saved.date === today() && Number.isFinite(saved.granted)) return saved;
  } catch {
    /* localStorage bị chặn hoặc dữ liệu cũ hỏng — coi như hôm nay chưa nhận gì */
  }
  return { date: today(), granted: 0 };
}

function writeLedger(ledger) {
  try {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
  } catch {
    /* không ghi được lịch sử thì vẫn cộng coin, chỉ mất chống farm */
  }
}

/**
 * @param {number} amount coin muốn cộng
 * @param {string} reason "quest:<k>" | "highscore:<tag>" | "perfect:<tag>"
 * @returns {Promise<{granted: boolean, amount: number, code: string, cap: number, today: number}>}
 */
export async function grantSchoolCoinReward(amount, reason = "") {
  const value = Math.round(Number(amount));
  const fail = (code) => ({ granted: false, amount: value || 0, code, cap: DAILY_CAP, today: readLedger().granted });

  if (!Number.isInteger(value) || value <= 0 || value > MAX_EVENT || !ALLOWED_REASON.test(String(reason))) {
    return fail("invalid");
  }
  if (!loadAuth()?.token) return fail("noauth");

  const ledger = readLedger();
  if (ledger.granted + value > DAILY_CAP) return fail("cap");

  try {
    await walletService.addCoins(value);
  } catch {
    return fail("offline");
  }

  ledger.granted += value;
  writeLedger(ledger);
  return { granted: true, amount: value, code: "ok", cap: DAILY_CAP, today: ledger.granted };
}
