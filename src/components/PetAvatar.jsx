import { useEffect, useState } from "react";
import PetSvg from "./PetSvg.jsx";
import { usePet, loadPet } from "../lib/petApi.js";

/** Pet tròn có viền vàng (dùng trong thẻ Thú cưng ở trang chủ). */
export function PetAvatar({ size = 72, level, className = "" }) {
  const pet = usePet();

  // Nạp pet từ API một lần khi component đầu tiên xuất hiện
  useEffect(() => { loadPet(); }, []);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-50 ${className}`}
      style={{ width: size, height: size, boxShadow: "0 0 0 3px #FFD257, 0 4px 10px rgba(0,0,0,.12)" }}
    >
      <PetSvg
        size={size * 0.78}
        species={pet.species}
        color={pet.color}
        outfits={pet.outfits}
        mood={pet.mood}
        ariaLabel={pet.name}
      />
      {(level ?? pet.level) != null && (
        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-amber-300 bg-white px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-amber-600 shadow-sm">
          Lv {level ?? pet.level}
        </span>
      )}
    </div>
  );
}

/** Bong bóng thoại của pet (phản ứng trong game / trang chủ). */
export function PetBubble({ message, onClose, className = "", compact = false }) {
  const [dismissed, setDismissed] = useState(false);
  const [seen, setSeen] = useState(message);
  // reset khi message đổi (adjust state khi props thay đổi — không cần effect)
  if (seen !== message) {
    setSeen(message);
    setDismissed(false);
  }
  if (dismissed || !message) return null;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`max-w-[220px] rounded-2xl border-2 border-amber-200 bg-white font-semibold text-ink shadow-lg anim-pop ${compact ? "px-3 py-2 text-[11px]" : "px-4 py-2.5 text-xs"}`}
      >
        {message}
        <button
          onClick={() => { setDismissed(true); onClose?.(); }}
          className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full border border-amber-200 bg-white text-[10px] leading-none text-gray-400 hover:text-gray-700"
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
      <div className="absolute -bottom-2 left-5 h-3 w-3 rotate-45 border-b-2 border-r-2 border-amber-200 bg-white" />
    </div>
  );
}

export { PetSvg };
