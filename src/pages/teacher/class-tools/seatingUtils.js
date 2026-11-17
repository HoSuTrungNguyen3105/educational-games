/**
 * seatingUtils.js — thuật toán THUẦN cho tab Chỗ ngồi (không React,
 * không import ngoài shuffleWith của groupUtils) để kiểm chứng bằng
 * script node độc lập, theo đúng tiền lệ groupUtils đợt 2.
 *
 * Quy ước seatId: `c{col}r{row}s{slot}` với col/row/slot là chỉ số 0-based
 * theo CẤU TRÚC THẬT của phòng (col = dãy từ trái sang phải khi nhìn từ
 * cuối lớp lên bảng, row = bàn từ bảng (0) về cuối lớp, slot = chỗ trong
 * bàn từ trái sang phải). Đảo góc nhìn chỉ là biến đổi hiển thị ở UI,
 * không đổi seatId.
 *
 * Hình học lớp: lưới gồm `cols` dãy × `rows` bàn/dãy × `perDesk` chỗ/bàn.
 * Đánh số bàn: numberFrom "front" → bàn sát bảng là Bàn 1, tăng dần về
 * cuối lớp; "back" → bàn cuối lớp là Bàn 1, tăng dần về phía bảng.
 */
import { shuffleWith } from "./groupUtils.js";

export function seatId(col, row, slot) {
  return `c${col}r${row}s${slot}`;
}

const SEAT_ID_RE = /^c(\d+)r(\d+)s(\d+)$/;

export function parseSeatId(id) {
  const m = SEAT_ID_RE.exec(String(id ?? ""));
  if (!m) return null;
  return { col: Number(m[1]), row: Number(m[2]), slot: Number(m[3]) };
}

/** Mọi seatId của lưới theo thứ tự col → row → slot. */
export function buildSeatIds(config) {
  const ids = [];
  for (let col = 0; col < config.cols; col += 1) {
    for (let row = 0; row < config.rows; row += 1) {
      for (let slot = 0; slot < config.perDesk; slot += 1) {
        ids.push(seatId(col, row, slot));
      }
    }
  }
  return ids;
}

export function totalSeats(config) {
  return config.cols * config.rows * config.perDesk;
}

/** Số thứ tự hiển thị của bàn ở hàng `row` (0 = sát bảng) theo cấu hình. */
export function deskNumber(config, row) {
  return config.numberFrom === "back" ? config.rows - row : row + 1;
}

/**
 * Xếp chỗ ngẫu nhiên:
 *  - Học sinh có ghim (pinned) giữ đúng chỗ ghim — ghim thắng mọi thứ,
 *    trừ khi chỗ ghim bị khoá hoặc không còn tồn tại trong lưới.
 *  - Ô khoá không ai ngồi.
 *  - Học sinh còn lại được xáo trộn rồi rải vào các chỗ trống khả dụng
 *    theo thứ tự lưới. Học sinh nhiều hơn chỗ trống → phần dư trả về ở
 *    `unseated` (vẫn theo thứ tự danh sách lớp), không lỗi, không trùng.
 *
 * @param students [{ id }] theo thứ tự danh sách lớp
 * @param config   cấu hình lưới đã chuẩn hoá
 * @param locked   mảng seatId bị khoá
 * @param pinned   { studentId: seatId }
 * @returns { seats: { seatId: studentId }, unseated: [studentId] }
 */
export function assignSeatsRandomly({ students, config, locked = [], pinned = {}, rng = Math.random }) {
  const lockedSet = new Set(locked ?? []);
  const available = buildSeatIds(config).filter((id) => !lockedSet.has(id));
  const availableSet = new Set(available);
  const list = Array.isArray(students) ? students.filter((s) => s && s.id) : [];

  const seats = {};
  const taken = new Set();
  const placed = new Set();

  // 1) Ghim trước: giữ đúng chỗ ghim nếu chỗ còn khả dụng và chưa ai lấy.
  for (const s of list) {
    const target = pinned?.[s.id];
    if (target && availableSet.has(target) && !taken.has(target)) {
      seats[target] = s.id;
      taken.add(target);
      placed.add(s.id);
    }
  }

  // 2) Phần còn lại: xáo trộn học sinh, rải vào chỗ trống theo thứ tự lưới.
  const freeStudents = shuffleWith(list.filter((s) => !placed.has(s.id)), rng);
  const freeSeats = available.filter((id) => !taken.has(id));
  freeStudents.forEach((s, i) => {
    if (i < freeSeats.length) {
      seats[freeSeats[i]] = s.id;
      placed.add(s.id);
    }
  });

  const unseated = list.filter((s) => !placed.has(s.id)).map((s) => s.id);
  return { seats, unseated };
}
