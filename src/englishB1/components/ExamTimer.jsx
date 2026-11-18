// ExamTimer.jsx — thanh đồng hồ đếm ngược (thanh tiến độ + giờ còn lại).
// Đồng hồ chạy ở trang thi qua useCountdown (examTimerUtils); component này
// chỉ hiển thị + báo hết giờ đúng 1 lần.
import { useEffect, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { formatClock, usedPercent } from "../utils/examTimerUtils.js";

/**
 * @param {object} props
 * @param {number} props.secondsLeft   giây còn lại
 * @param {number} props.totalSeconds  tổng thời gian
 * @param {() => void} [props.onExpire] gọi đúng 1 lần khi về 0
 * @param {boolean} [props.paused]     đứng yên (modal xác nhận…)
 * @param {boolean} [props.compact]    chỉ hiện đồng hồ, bỏ thanh tiến độ
 */
export default function ExamTimer({ secondsLeft, totalSeconds, onExpire, paused = false, compact = false }) {
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const totalRef = useRef(totalSeconds);

  // Ghi callback mới nhất vào ref trong EFFECT (không ghi trong render).
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Đổi tổng thời gian (trang đổi đề) → cho phép báo hết giờ lần nữa.
  useEffect(() => {
    if (totalRef.current !== totalSeconds) {
      totalRef.current = totalSeconds;
      expiredRef.current = false;
    }
  }, [totalSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0 && totalSeconds > 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current?.();
    }
    if (secondsLeft > 0) expiredRef.current = false;
  }, [secondsLeft, totalSeconds]);

  const pct = usedPercent(secondsLeft, totalSeconds);
  const urgent = secondsLeft <= 60;
  const critical = secondsLeft <= 15;

  return (
    <div
      className={`rounded-xl border px-3 py-2 ${critical ? "border-ticket bg-ticket/10" : urgent ? "border-gold bg-gold/10" : "border-ink/10 bg-paper2"}`}
      role="timer"
      aria-live={urgent ? "assertive" : "off"}
      aria-label={`Thời gian còn lại ${formatClock(secondsLeft)}`}
    >
      <div className="flex items-center gap-2">
        {urgent ? (
          <AlertTriangle className={`w-4 h-4 shrink-0 ${critical ? "text-ticket" : "text-gold"}`} />
        ) : (
          <Clock className="w-4 h-4 shrink-0 text-[#8A7C63]" />
        )}
        <span className={`font-mono font-bold tabular-nums ${critical ? "text-ticket" : "text-ink"}`}>
          {formatClock(secondsLeft)}
        </span>
        <span className="ml-auto text-[11px] font-mono text-[#8A7C63]">
          {paused ? "Tạm dừng" : `${pct}% đã dùng`}
        </span>
      </div>
      {!compact && (
        <div className="mt-1.5 h-1.5 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
          <div
            className={`h-full transition-all duration-1000 ${critical ? "bg-ticket" : urgent ? "bg-gold" : "bg-teal"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
