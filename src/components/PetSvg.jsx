// components/PetSvg.jsx
//
// THINH LƯỜNG GIỮ LẠI từ bản cũ — không xoá.
//
// Lý do: HomeScreen, GameHud, PetPage… đang import `PetSvg` từ đây. Xoá file
// này sẽ làm hỏng hàng chục chỗ gọi. Thay vào đó nó chuyển tiếp sang
// `components/pet/PetAvatar.jsx` — nơi vẽ DUY NHẤT của dự án.
//
// PetAvatar giờ vẽ bằng `look` DressUp (cùng nguồn với trang Profile và game
// "Tiệm thay đồ thú cưng"), nên HUD game và home hiện đúng con thú đã tuỳ chỉnh
// thay vì bộ mặc định của hệ cũ.
//   • `PetSvg`      → avatar không viền, không badge Lv (vừa khung HUD)
//   • `PetAvatar`   → alias của components/pet/PetAvatar.jsx
//   • `PetBubble`   → bong bóng thoại (không liên quan render pet)

import PetAvatar from "./pet/PetAvatar.jsx";

export default function PetSvg({
  size = 64,
  className = "",
  bounce = false,
  ariaLabel,
}) {
  return (
    <PetAvatar
      size={size}
      className={className}
      bounce={bounce}
      ring={false}
      ariaLabel={ariaLabel}
    />
  );
}

export { PetAvatar };

/** Bong bóng thoại của pet. */
export function PetBubble({ message, onClose, compact = false }) {
  if (!message) return null;
  return (
    <div
      className={`relative rounded-2xl rounded-bl-sm border-2 border-amber-200 bg-white px-3 py-2 text-ink shadow-lg ${
        compact ? "text-[11px]" : "text-xs"
      } font-semibold`}
    >
      {message}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full border border-amber-200 bg-white text-[11px] text-slate-400 hover:text-slate-700"
        >
          ×
        </button>
      )}
    </div>
  );
}