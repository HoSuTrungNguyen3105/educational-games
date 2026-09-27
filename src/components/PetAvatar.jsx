import { useState } from "react";

/** Avatar thú cưng (corgi) vẽ bằng SVG — không cần file ảnh. */
export function PetSvg({ size = 64, className = "", bounce = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${className} ${bounce ? "float-slow" : ""}`}
      role="img"
      aria-label="Thú cưng"
    >
      {/* tai */}
      <path d="M24 44 L17 13 L45 28 Z" fill="#F0A45E" />
      <path d="M76 44 L83 13 L55 28 Z" fill="#F0A45E" />
      <path d="M27 40 L23 21 L39 30 Z" fill="#F8CDB4" />
      <path d="M73 40 L77 21 L61 30 Z" fill="#F8CDB4" />
      {/* đầu */}
      <ellipse cx="50" cy="56" rx="31" ry="28" fill="#F4AF66" />
      {/* mặt trắng */}
      <path d="M50 38 C35 38 29 51 31 64 C33 77 41 84 50 84 C59 84 67 77 69 64 C71 51 65 38 50 38 Z" fill="#FFF7EE" />
      {/* mắt */}
      <circle cx="37" cy="53" r="4.4" fill="#3A2A1F" />
      <circle cx="63" cy="53" r="4.4" fill="#3A2A1F" />
      <circle cx="38.6" cy="51.4" r="1.5" fill="#fff" />
      <circle cx="64.6" cy="51.4" r="1.5" fill="#fff" />
      {/* má hồng */}
      <circle cx="29" cy="65" r="5" fill="#FF9FA8" opacity=".55" />
      <circle cx="71" cy="65" r="5" fill="#FF9FA8" opacity=".55" />
      {/* mũi + miệng */}
      <ellipse cx="50" cy="64" rx="5.4" ry="4.2" fill="#3A2A1F" />
      <path d="M50 68 q-7 8 -12 2" stroke="#3A2A1F" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M50 68 q7 8 12 2" stroke="#3A2A1F" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M45.5 71.5 q4.5 9 9 0 z" fill="#FF7E8A" />
    </svg>
  );
}

/** Pet tròn có viền vàng (dùng trong thẻ Thú cưng). */
export function PetAvatar({ size = 72, level, className = "" }) {
  return (
    <div
      className={`relative shrink-0 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center ${className}`}
      style={{ width: size, height: size, boxShadow: "0 0 0 3px #FFD257, 0 4px 10px rgba(0,0,0,.12)" }}
    >
      <PetSvg size={size * 0.78} />
      {level != null && (
        <span className="absolute -bottom-1 -right-1 bg-white border-2 border-amber-300 text-amber-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none shadow-sm">
          Lv {level}
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
        className={`bg-white border-2 border-amber-200 rounded-2xl shadow-lg ${compact ? "px-3 py-2 text-[11px]" : "px-4 py-2.5 text-xs"} font-semibold text-ink max-w-[220px] anim-pop`}
      >
        {message}
        <button
          onClick={() => { setDismissed(true); onClose?.(); }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-amber-200 text-[10px] text-gray-400 hover:text-gray-700 leading-none"
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
      <div className="absolute -bottom-2 left-5 w-3 h-3 bg-white border-r-2 border-b-2 border-amber-200 rotate-45" />
    </div>
  );
}
