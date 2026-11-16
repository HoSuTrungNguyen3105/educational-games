/**
 * CheckinCard.jsx — thẻ "Điểm danh mỗi ngày" trên trang chủ học sinh.
 *
 * Nhận state từ hook useCheckin (HomeScreen giữ MỘT state dùng chung cho
 * cả bản desktop lẫn bản mobile trong .gq-mhome). Chưa có dữ liệu (chưa
 * đăng nhập / lỗi tải) → không render gì cả, trang chủ không vỡ.
 * Nhận thưởng xong báo qua toast dùng chung (useToast + Toast) và gọi
 * onCheckedIn(result) để HomeScreen cập nhật số xu trên header.
 */
import { Check, Flame } from "lucide-react";
import { Toast } from "../ui";
import { useToast } from "../../lib/hooks.js";

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/** "2026-11-17" → nhãn thứ trong tuần ("T3"…). Tính theo UTC trên chuỗi ngày. */
function dayLabel(dateStr) {
  const [y, m, d] = String(dateStr || "").split("-").map(Number);
  if (!y || !m || !d) return "";
  return DAY_LABELS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

export default function CheckinCard({ state, onCheckedIn, className = "" }) {
  const [toast, showToast] = useToast();
  const { status, checkingIn, checkIn } = state || {};

  if (!status) return null;

  const handleCheckIn = async () => {
    try {
      const result = await checkIn();
      if (result?.alreadyCheckedIn) {
        showToast("Hôm nay bé đã điểm danh rồi!", "info");
      } else {
        showToast(`Điểm danh thành công! Bé nhận +${result?.reward || 0} xu 🎉`, "success");
      }
      onCheckedIn?.(result);
    } catch {
      showToast("Chưa điểm danh được, bé thử lại sau nhé!", "error");
    }
  };

  return (
    <>
      <section className={`gq-checkin ${className}`} aria-label="Điểm danh mỗi ngày">
        <span className="gq-checkin__flame" aria-hidden="true">
          <Flame className="w-7 h-7" fill="currentColor" />
        </span>
        <div className="gq-checkin__main">
          <p className="gq-checkin__title">Điểm danh mỗi ngày</p>
          <p className="gq-checkin__sub">
            Chuỗi <b>{status.streak} ngày</b> liên tiếp
            {status.longestStreak > 0 && <> · Kỷ lục {status.longestStreak} ngày</>}
          </p>
          <div className="gq-checkin__week">
            {(status.week || []).map((d) => (
              <span
                key={d.date}
                className={`gq-checkin__day${d.checkedIn ? " is-done" : ""}${d.isToday ? " is-today" : ""}`}
              >
                <span className="gq-checkin__dot" aria-hidden="true">
                  {d.checkedIn && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className="gq-checkin__dotlbl">{dayLabel(d.date)}</span>
              </span>
            ))}
          </div>
        </div>
        {status.checkedInToday ? (
          <p className="gq-checkin__done">
            <Check className="w-5 h-5" aria-hidden="true" />
            <span>Hôm nay đã<br />điểm danh</span>
          </p>
        ) : (
          <button className="gq-checkin__btn" onClick={handleCheckIn} disabled={checkingIn}>
            {checkingIn ? "Đang điểm danh…" : `Điểm danh +${status.rewardToday || 0} xu`}
          </button>
        )}
      </section>
      <Toast toast={toast} />
    </>
  );
}
