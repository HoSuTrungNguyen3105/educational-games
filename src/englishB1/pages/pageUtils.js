// pageUtils.js — tiện ích nhỏ dùng chung cho các trang English B1.
// (File .js thường, không phải component — xem quy ước README §7.)
import { useEffect } from "react";
import { addStudySeconds } from "../services/progressService.js";

/**
 * Đọc query param trong hash route (vd "#/english-b1/grammar?item=B1_GRAMMAR_001").
 * router.js chỉ parse path + params, không parse query — các link "tiếp tục /
 * đề xuất" của englishB1Service (hrefFor) dùng ?item= nên trang tự đọc ở đây.
 */
export function getHashParam(name) {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash || "";
  const q = hash.split("?")[1];
  if (!q) return null;
  try {
    return new URLSearchParams(q).get(name);
  } catch {
    return null;
  }
}

/**
 * Cộng thời gian học thật vào tiến độ khi rời trang (tối thiểu 5 giây,
 * tối đa 30 phút/phiên để tab treo không thổi phồng số liệu).
 */
export function useStudySeconds() {
  useEffect(() => {
    const start = Date.now();
    return () => {
      const sec = Math.round((Date.now() - start) / 1000);
      if (sec >= 5) addStudySeconds(Math.min(sec, 1800));
    };
  }, []);
}

/** Đếm số từ trong văn bản (cho Writing / bài thi). */
export function countWords(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}
