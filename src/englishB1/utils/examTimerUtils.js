// examTimerUtils.js — đồng hồ đếm ngược cho bài thi / luyện tập có thời gian.
import { useEffect, useRef, useState } from "react";

/** Giây → "MM:SS" (và "H:MM:SS" khi ≥ 1 giờ). Âm → "00:00". */
export function formatClock(totalSeconds) {
  const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Giây → "x phút y giây" (mô tả). */
export function formatDuration(totalSeconds) {
  const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s} giây`;
  return s === 0 ? `${m} phút` : `${m} phút ${s} giây`;
}

/** Số giây còn lại → % đã dùng (0–100) cho thanh tiến độ. */
export function usedPercent(secondsLeft, totalSeconds) {
  if (!totalSeconds) return 0;
  const left = Math.max(0, secondsLeft);
  return Math.min(100, Math.round(((totalSeconds - left) / totalSeconds) * 100));
}

/**
 * Hook đếm ngược.
 * @param {number} totalSeconds  tổng thời gian (giây)
 * @param {{paused?:boolean, onExpire?:() => void, tickMs?:number}} options
 * @returns {number} secondsLeft
 *
 * Khi `paused` (vd: modal xác nhận thoát) đồng hồ đứng yên. `onExpire` gọi đúng
 * một lần khi về 0 — trang thi dùng để tự động nộp bài.
 *
 * LƯU Ý: hook KHÔNG tự reset khi `totalSeconds` đổi (tránh setState trong
 * effect). Trang đổi đề/thời gian phải remount bằng `key` — vd
 * `<ExamTimer key={examId} …>` hoặc trang thi nhận `key={examId}`.
 */
export function useCountdown(totalSeconds, options = {}) {
  const { paused = false, onExpire, tickMs = 1000 } = options;
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Number(totalSeconds) || 0));
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  // Ghi callback mới nhất vào ref trong EFFECT (không ghi trong render).
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, tickMs);
    return () => clearInterval(id);
  }, [paused, tickMs]);

  useEffect(() => {
    if (secondsLeft <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current?.();
    }
    if (secondsLeft > 0) expiredRef.current = false;
  }, [secondsLeft]);

  return secondsLeft;
}
