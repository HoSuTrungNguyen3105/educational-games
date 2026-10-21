/**
 * mathGate.js — sinh 2 câu đố cộng/trừ đơn giản, làm "cổng" mở phần ủng hộ.
 *
 * Câu hỏi sinh ngẫu nhiên mỗi lần mở modal, chỉ dùng số trong phạm vi 10 để
 * các bé nhỏ cũng làm được.
 */

import { useMemo } from "react";

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/** Cộng trong phạm vi 10. */
function plusQuestion() {
  const a = rnd(1, 8);
  const b = rnd(1, 9 - a);
  return { q: `${a} + ${b}`, a: a + b };
}

/** Trừ trong phạm vi 10, không ra số âm. */
function minusQuestion() {
  const a = rnd(3, 10);
  const b = rnd(1, a - 1);
  return { q: `${a} − ${b}`, a: a - b };
}

const BUILDERS = [plusQuestion, minusQuestion];

/**
 * @param {number} count số câu
 * @returns {{q: string, a: number}[]} câu hỏi cộng/trừ dễ
 */
export function makeQuestions(count = 2) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(BUILDERS[i % BUILDERS.length]());
  }
  return out;
}

/** Hook gộp sẵn câu hỏi cho modal. */
export function useMathQuestions(count) {
  return useMemo(() => makeQuestions(count), [count]);
}