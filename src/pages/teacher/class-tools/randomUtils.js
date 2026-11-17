/**
 * randomUtils.js — tiện ích chọn ngẫu nhiên DÙNG CHUNG cho bộ Công cụ lớp học.
 *
 * Mọi tính năng cần "chọn ngẫu nhiên" (vòng quay, bốc thăm tên, bốc số…)
 * đều đi qua đây để không lặp logic và đảm bảo ngẫu nhiên thật
 * (Math.random), không trùng trong một lượt khi yêu cầu nhiều người.
 */

/** Số nguyên ngẫu nhiên trong [min, max] (gồm cả hai đầu). */
export function randomInt(min, max) {
  const lo = Math.ceil(Math.min(min, max));
  const hi = Math.floor(Math.max(min, max));
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/**
 * Chọn `count` phần tử KHÔNG trùng từ `items` (thuật toán Fisher–Yates rút gọn).
 * Trả về mảng tối đa `count` phần tử (ít hơn nếu danh sách ngắn hơn).
 */
export function pickRandom(items, count = 1) {
  const pool = [...items];
  const n = Math.max(0, Math.min(count, pool.length));
  for (let i = 0; i < n; i += 1) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

/** Chọn 1 phần tử ngẫu nhiên; null nếu danh sách rỗng. */
export function pickOne(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Tính góc quay đích cho vòng quay gọi tên (hàm thuần, đã kiểm bằng ca số):
 * lát i phủ [i*seg, (i+1)*seg) đo theo chiều kim đồng hồ từ đỉnh (vị trí
 * kim). Sau khi quay tới góc trả về, tâm lát của người trúng nằm đúng kim
 * (lệch `jitterDeg` có chủ đích để không lần nào cũng dừng chết giữa lát).
 * Góc luôn tăng (cộng 5 vòng) để animation không bao giờ quay ngược.
 */
export function computeTargetRotation(current, winnerIndex, count, jitterDeg = 0) {
  const seg = 360 / count;
  const center = winnerIndex * seg + seg / 2;
  const desiredMod = ((360 - center + jitterDeg) % 360 + 360) % 360;
  const currentMod = ((current % 360) + 360) % 360;
  const delta = ((desiredMod - currentMod) + 360) % 360;
  return current + 360 * 5 + delta;
}
