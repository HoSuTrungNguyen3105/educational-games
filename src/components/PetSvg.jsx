// components/PetSvg.jsx
//
// Hiển thị thú cưng theo loài:
//   • dog    → dùng SVG mascot có sẵn của dự án (assets/dog_mascot_layered.svg),
//              đổi màu lông và bật/tắt 4 lớp phụ kiện theo pet.
//   • mèm/chim/cá/khỉ → emoji, không cần file ảnh.
//
// Bỏ trống species/color/outfits/mood → tự lấy pet đang nuôi từ store,
// nên mọi nơi gọi (HUD game, thẻ trang chủ, bong bóng) đều hiện pet thật.

import { usePet } from "../lib/petApi.js";
import MascotDog from "./MascotDog.jsx";

/** Loài dùng emoji (không có SVG). */
const EMOJI = {
  cat: "🐱",
  bird: "🐦",
  fish: "🐟",
  monkey: "🐵",
};

/** Mặc định khi chưa có pet nào trong store. */
const PET_FALLBACK = {
  species: "dog",
  color: "cream",
  outfits: { hat: null, scarf: null, glasses: null, shirt: null, bow: null, cape: null },
};

/** Bảng màu dự phòng — khớp petCatalog.COLORS (chỉ dùng body cho emoji tint). */
const EMOJI_TINT = {
  cream: "", brown: "", black: "", white: "", orange: "",
  gray: "", pink: "", yellow: "", mint: "", sky: "",
};

export default function PetSvg({
  size = 64,
  className = "",
  bounce = false,
  species,
  color,
  outfits,
  mood,
  ariaLabel,
}) {
  const pet = usePet();
  const sp = (species ?? pet?.species) || PET_FALLBACK.species;
  const col = color ?? pet?.color ?? PET_FALLBACK.color;
  const fit = outfits ?? pet?.outfits ?? PET_FALLBACK.outfits;

  if (sp === "dog") {
    return (
      <MascotDog
        size={size}
        className={`${className} ${bounce ? "float-slow" : ""}`}
        color={col}
        outfits={fit || {}}
        mood={mood ?? pet?.mood ?? "happy"}
        ariaLabel={ariaLabel || pet?.name || "Chó"}
      />
    );
  }

  const emoji = EMOJI[sp] || "🐾";
  return (
    <span
      role="img"
      aria-label={ariaLabel || pet?.name || sp}
      className={`inline-grid place-items-center leading-none ${className} ${bounce ? "float-slow" : ""}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.82), filter: EMOJI_TINT[col] || undefined }}
    >
      {emoji}
    </span>
  );
}
