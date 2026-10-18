/**
 * DailyGiftModal.jsx — hộp quà "Quà hôm nay!" mở khi vào app mỗi ngày 1 lần.
 *
 * Sao được cộng thật ở server qua `POST /api/auth/me/stars/daily-gift`; server
 * tự chặn nhận trùng trong ngày nên mở modal nhiều lần cũng chỉ nhận 1 lần.
 * Component này chỉ dựng giao diện và đóng lại.
 */

import { useEffect, useState } from "react";

/** Số sao vẽ trên dải (ảnh minh hoạ có 5 ngôi) — không phải số sao thật nhận. */
const STRIP_STARS = 5;

export default function DailyGiftModal({ amount, totalStars, onClose }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    setLeaving(true);
    setTimeout(onClose, 180);
  }

  const amountLabel = Number(amount) > 0 ? Number(amount) : 0;

  return (
    <div
      className="gq-gift"
      role="dialog"
      aria-modal="true"
      aria-label={`Quà hôm nay: ${amountLabel} sao`}
      onClick={close}
    >
      <div
        className={`gq-gift__card ${leaving ? "is-leaving" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* tia nắng + ngôi sao lớn */}
        <div className="gq-gift__art">
          <span className="gq-gift__rays" aria-hidden="true" />
          <span className="gq-gift__star" aria-hidden="true">★</span>
          {amountLabel > 0 && <span className="gq-gift__badge">+{amountLabel}</span>}
        </div>

        <p className="gq-gift__title">Quà hôm nay!</p>

        <div className="gq-gift__strip" aria-hidden="true">
          {Array.from({ length: STRIP_STARS }, (_, i) => (
            <span key={i} className="gq-gift__ministar" style={{ animationDelay: `${i * 90}ms` }}>★</span>
          ))}
        </div>

        <p className="gq-gift__msg">
          Bé được thêm <b>{amountLabel}</b> sao
          {Number.isFinite(totalStars) && (
            <span className="gq-gift__total"> · Tổng còn {totalStars}</span>
          )}
        </p>

        <button onClick={close} className="gq-gift__ok">Tuyệt quá!</button>
      </div>
    </div>
  );
}