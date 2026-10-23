/**
 * DressUpAvatar.jsx — hiển thị avatar / thú cưng của hệ "tạo avatar mới".
 *
 * Khác với `components/avatar/AvatarPreview.jsx` (hệ cũ: code item + inventory),
 * component này vẽ bằng đúng SVG mà 2 game "Tiệm thời trang cho Bé" và
 * "Tiệm thay đồ thú cưng" dùng — cùng một nguồn: `src/games/lib/dressUpAvatarData.js`.
 *
 *   <DressUpAvatar kind="avatar" state={outfit.avatar.value} size={120} />
 *   <DressUpAvatar kind="pet"    state={outfit.pet.value}    size={120} />
 */

import { useMemo } from "react";
import { renderDressUpSvg, outfitAspect, ensureDressUpCss } from "../../lib/dressUpAvatar.js";

export default function DressUpAvatar({
  kind = "avatar",
  state,
  size = 120,
  className = "",
  label,
  style,
}) {
  const svg = useMemo(() => renderDressUpSvg(kind, state), [kind, state]);
  const aspect = outfitAspect(kind);

  if (!svg) return null;
  ensureDressUpCss();

  return (
    <div
      className={`eg-du shrink-0 ${className}`}
      style={{ width: size, height: Math.round(size * aspect), lineHeight: 0, ...style }}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/** Avatar nhỏ dạng tròn, vừa khung — dùng ở header profile. */
export function DressUpAvatarSmall({ kind = "avatar", state, size = 40, className = "", label, style }) {
  const aspect = outfitAspect(kind);
  // Nhân vật cao hơn rộng → co theo chiều cao cho vừa tròn.
  const boxH = Math.round(size * 0.94);
  const boxW = Math.round(boxH / aspect);
  return (
    <div
      className={`overflow-hidden rounded-full shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size, background: "var(--bg)", ...style }}
    >
      <DressUpAvatar kind={kind} state={state} size={Math.min(boxW, boxH)} label={label} />
    </div>
  );
}