/**
 * mathGate.js — sinh câu đố phép tính khó hơn, làm "cổng" mở phần ủng hộ.
 *
 * Câu hỏi sinh ngẫu nhiên mỗi lần mở modal, độ khó tăng dần theo thứ tự.
 * Chỉ sinh câu có đáp án nguyên để bé không bị bực vì chia lẻ.
 */

import { useMemo } from "react";

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/** Chia hết: chọn số bị chia rồi nhân ngược lại thành số chia. */
function divExact(max) {
  const d = rnd(3, 9);
  const q = rnd(11, Math.max(12, Math.floor(max / d)));
  return { q: `${q * d} ÷ ${d}`, a: q };
}

const BUILDERS = [
  // 1 — nhân số 2 chữ số với số 1 chữ số
  () => {
    const a = rnd(12, 29), b = rnd(3, 9);
    return { q: `${a} × ${b}`, a: a * b };
  },
  // 2 — cộng 3 số
  () => {
    const a = rnd(120, 480), b = rnd(45, 260), c = rnd(20, 95);
    return { q: `${a} + ${b} + ${c}`, a: a + b + c };
  },
  // 3 — trừ nhiều lần
  () => {
    const a = rnd(500, 900), b = rnd(80, 250), c = rnd(20, 120);
    return { q: `${a} − ${b} − ${c}`, a: a - b - c };
  },
  // 4 — nhân 2 chữ số với 2 chữ số nhỏ
  () => {
    const a = rnd(11, 24), b = rnd(11, 14);
    return { q: `${a} × ${b}`, a: a * b };
  },
  // 5 — biểu thức có ngoặc
  () => {
    const a = rnd(12, 40), b = rnd(5, 18), c = rnd(3, 9);
    return { q: `(${a} + ${b}) × ${c}`, a: (a + b) * c };
  },
  // 6 — chia hết
  () => divExact(180),
  // 7 — chia hết số lớn
  () => {
    const d = rnd(6, 9);
    const q = rnd(12, 20);
    return { q: `${q * d * 10} ÷ ${d}`, a: q * 10 };
  },
  // 8 — phép trừ rồi nhân
  () => {
    const a = rnd(60, 140), b = rnd(20, 55), c = rnd(3, 8);
    return { q: `(${a} − ${b}) × ${c}`, a: (a - b) * c };
  },
  // 9 — chia có dư (lấy phần nguyên)
  () => {
    const b = rnd(7, 9), r = rnd(1, 6), q = rnd(8, 19);
    const n = q * b + r;
    return { q: `${n} ÷ ${b} (lấy dư ${r})`, a: q };
  },
  // 10 — cộng số âm
  () => {
    const a = rnd(30, 90), b = rnd(10, 60);
    return { q: `${a} + (−${b})`, a: a - b };
  },
];

/**
 * @param {number} count số câu
 * @returns {{q: string, a: number}[]} câu hỏi theo thứ tự từ dễ đến khó
 */
export function makeQuestions(count = 5) {
  const pool = [...BUILDERS];
  const out = [];
  for (let i = 0; i < count; i++) {
    // 3 câu đầu dễ hơn, từ câu 4 trở đi lấy builder khó (index 5+)
    const pickFrom = i < 3 ? 0 : 5;
    const idx = rnd(pickFrom, pool.length - 1);
    const [builder] = pool.splice(idx, 1);
    out.push(builder());
  }
  return out;
}

/** Hook gộp sẵn câu hỏi cho modal. */
export function useMathQuestions(count) {
  return useMemo(() => makeQuestions(count), [count]);
}