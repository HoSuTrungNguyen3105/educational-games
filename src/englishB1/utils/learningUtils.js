// learningUtils.js — hàm toán/xếp lịch học dùng chung cho phân hệ English B1.
// Không side-effect, không React → test được, dùng được ở service lẫn component.

/** Ngày hôm nay theo giờ máy, dạng "YYYY-MM-DD" (key của daily/reset). */
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Ngày cách today n ngày (dùng cho biểu đồ 7/14 ngày gần nhất). */
export function dateKeyDaysAgo(days, from = new Date()) {
  const d = new Date(from.getTime() - days * 86400000);
  return todayKey(d);
}

/** Làm tròn phần trăm, tổng = 0 → 0 (tránh chia cho 0). */
export function percentOf(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

/** Khóa số giả (LCG) — cùng seed cho cùng một bộ câu hỏi khi ôn lại. */
export function makeRng(seed = Date.now()) {
  let s = (Math.floor(seed) % 2147483647) || 1;
  if (s <= 0) s += 2147483646;
  return function rng() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Trộn mảng (không mutate mảng gốc). */
export function shuffle(arr, rng = Math.random) {
  const a = [...(arr || [])];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Chọn n phần tử ngẫu nhiên KHÔNG lặp (n > độ dài thì lấy hết, xáo trộn). */
export function sample(arr, n, rng = Math.random) {
  return shuffle(arr, rng).slice(0, Math.max(0, n));
}

/**
 * Lấy n từ gây nhiễu khác `correct` (loại cả các từ trong `exclude`).
 * Dùng cho dạng "chọn nghĩa đúng" / "nghe và chọn từ".
 */
export function buildDistractors(correct, pool, n, exclude = [], rng = Math.random) {
  const ban = new Set([String(correct).toLowerCase(), ...exclude.map((x) => String(x).toLowerCase())]);
  const out = [];
  const seen = new Set(ban);
  for (const candidate of shuffle(pool, rng)) {
    const key = String(candidate).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
    if (out.length >= n) break;
  }
  return out;
}

/**
 * Số ngày học liên tục tính từ danh sách ngày có hoạt động.
 * Ngày hôm nay chưa học thì vẫn tính chuỗi đang chạy (kết thúc hôm qua).
 */
export function streakFromDates(dateKeys) {
  const set = new Set((dateKeys || []).filter(Boolean));
  if (!set.size) return 0;
  const now = new Date();
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!set.has(todayKey(cursor))) {
    cursor = new Date(cursor.getTime() - 86400000); // hôm nay chưa học → bắt đầu từ hôm qua
    if (!set.has(todayKey(cursor))) return 0;
  }
  let streak = 0;
  while (set.has(todayKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return streak;
}

/** Số ngày có dữ liệu, dùng cho biểu đồ (đếm trong khoảng). */
export function daysBetween(fromKey, toKey) {
  const a = new Date(`${fromKey}T00:00:00`);
  const b = new Date(`${toKey}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return [];
  const out = [];
  for (let t = a.getTime(); t <= b.getTime(); t += 86400000) out.push(todayKey(new Date(t)));
  return out;
}

/** Nhãn hiển thị cho loại hoạt động (lịch sử luyện tập). */
export const ACTIVITY_LABELS = {
  grammar: "Ngữ pháp",
  listening: "Listening",
  reading: "Reading",
  vocabulary: "Từ vựng",
  writing: "Writing",
  speaking: "Speaking",
  exam: "Đề thi",
};

/** Chấm điểm phần trăm → nhãn mức (dùng ở dashboard/kết quả). */
export function gradeLabel(percent) {
  if (percent >= 85) return "Xuất sắc";
  if (percent >= 70) return "Tốt";
  if (percent >= 55) return "Khá";
  if (percent >= 40) return "Cần cải thiện";
  return "Yếu";
}
