/**
 * reminderUtils.js — Tiện ích dùng chung cho tính năng Nhắc nhở.
 *
 * Gom các logic lặp lại ở nhiều nơi:
 *  - parse/play vibration pattern (đồng nhất với public/firebase-messaging-sw.js)
 *  - phát âm thanh chuông khi nhắc nhở tới giờ
 *  - chuyển đổi datetime-local <-> ISO UTC một cách rõ ràng, tránh lỗi ngầm
 *    của `new Date("2026-10-07T09:00")` trên các trình duyệt khác nhau
 *  - format ngày giờ tiếng Việt
 */

// ─── Vibration ────────────────────────────────────────────────

export const VIBRATE_PATTERNS = [
  { label: "Mặc định", value: "" },
  { label: "Nhẹ nhàng", value: "100,50,100" },
  { label: "Rung nhanh", value: "50,30,50,30,50,30,50" },
  { label: "SOS", value: "100,50,100,50,100,150,300,100,300,100,300,150,100,50,100,50,100" },
  { label: "Tim đập", value: "80,80,80,300,80,80,80,300" },
  { label: "Vô hạn", value: "repeat" },
];

/**
 * Parse chuỗi pattern "200,100,200" thành mảng số.
 * Trả về "repeat" nếu là chế độ rung liên tục, mảng mặc định nếu chuỗi rỗng/sai.
 */
export function parseVibratePattern(patternStr) {
  if (!patternStr) return [200, 100, 200];
  if (patternStr === "repeat") return "repeat";
  const nums = String(patternStr)
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 0);
  return nums.length > 0 ? nums : [200, 100, 200];
}

// Giữ interval của chế độ "repeat" để có thể dừng từ nơi khác
let _repeatInterval = null;

export function stopVibrationLoop() {
  if (_repeatInterval) {
    clearInterval(_repeatInterval);
    _repeatInterval = null;
  }
  try { navigator.vibrate(0); } catch { /* ignore */ }
}

/**
 * Rung theo pattern đã cấu hình.
 * @param {string} patternStr - chuỗi pattern ("200,100,200" | "repeat" | "")
 * @param {boolean} enabled - cờ vibrate của reminder (false = không rung)
 */
export function playVibration(patternStr, enabled = true) {
  if (enabled === false) return;
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  stopVibrationLoop();
  const pattern = parseVibratePattern(patternStr);
  if (pattern === "repeat") {
    const burst = [300, 100, 300, 100, 300];
    navigator.vibrate(burst);
    _repeatInterval = setInterval(() => navigator.vibrate(burst), 800);
    // Tự dừng sau 30s để không rung mãi
    setTimeout(stopVibrationLoop, 30000);
  } else {
    navigator.vibrate(pattern);
  }
}

// ─── Âm thanh chuông ───────────────────────────────────────────

/**
 * Phát tiếng chuông "ting-ting" khi nhắc nhở tới giờ (Web Audio API).
 */
export function playReminderSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const audioCtx = new Ctx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "sine";
    const t = audioCtx.currentTime;
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(1100, t + 0.1);
    osc.frequency.setValueAtTime(880, t + 0.2);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    osc.start(t);
    osc.stop(t + 0.5);
  } catch { /* ignore audio errors */ }
}

// ─── Date/Time ─────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");

/**
 * Chuyển giá trị datetime-local ("2026-10-07T09:00", hiểu là GIỜ ĐỊA PHƯƠNG)
 * thành chuỗi ISO UTC để gửi lên backend.
 * Parse thủ công từng thành phần để không phụ thuộc cách browser parse chuỗi.
 */
export function localDatetimeToISO(localStr) {
  if (!localStr) return null;
  const [datePart, timePart = "00:00"] = localStr.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, hh || 0, mm || 0, 0).toISOString();
}

/**
 * Chuyển ISO (UTC) từ backend thành giá trị datetime-local theo GIỜ ĐỊA PHƯƠNG.
 * Dùng để điền lại vào form khi sửa.
 */
export function isoToLocalDatetimeValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "07/10/2026, 09:00" */
export function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/** "09:00" */
export function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "07/10/2026" */
export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** key "2026-10-07" theo giờ địa phương — dùng để nhóm reminder theo ngày */
export function localDateKey(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Tên tháng tiếng Việt */
export const VI_MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

/** Tên thứ tiếng Việt (bắt đầu từ Thứ 2) */
export const VI_WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
