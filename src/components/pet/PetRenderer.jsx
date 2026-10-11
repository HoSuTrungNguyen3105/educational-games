// components/pet/PetRenderer.jsx
//
// GHÉP PET TỪ NHIỀU LỚP — component duy nhất chịu trách nhiệm vẽ pet.
// Mọi nơi khác (PetAvatar, PetPreview, Kho đồ, Profile, HUD game) đều gọi
// component này, không tự dựng SVG.
//
// Thứ tự vẽ lấy từ `zIndex` trong data/petAssets.js, không viết rải rác.
//
// `isolation: isolate` trên khung gốc là BẮT BUỘC, không phải cho đẹp:
// zIndex của các lớp đi tới 85 (mũ), cao hơn z-50 của overlay modal. Nếu khung
// gốc không tạo stacking context riêng, các lớp này so sánh với phần còn lại
// của TRANG và vẽ đè lên modal — mũ trong bảng sẽ nổi lên trên hộp thoại.
// `isolate` gói zIndex vào trong khung pet: chỉ còn ý nghĩa so với nhau.
//
// Quy tắc an toàn (mục 9 của đề bài):
//   • `outfits[slot] === null`      → bỏ qua ô đó
//   • ID không có trong registry    → bỏ qua, KHÔNG nổi, KHÔNG fetch SVG từ API
//   • Đồ không hợp loài pet        → bỏ qua
//   • `outfits` thiếu field / null  → vẫn render được pet mặc định

import { getPetBase, getPetPalette, getOutfitAsset, isCompatible, SPECIES_EMOJI } from "../../data/petAssets.js";
import PetSvgLayer from "./PetSvgLayer.jsx";

/** Tâm tính → biểu hiện. Mood không xác định coi như vui. */
const MOOD_LOOK = {
  happy:   { eyesClosed: false, tongue: true,  sad: false },
  excited: { eyesClosed: false, tongue: true,  sad: false },
  hungry:  { eyesClosed: false, tongue: true,  sad: false },
  sleepy:  { eyesClosed: true,  tongue: false, sad: false },
  sad:     { eyesClosed: true,  tongue: false, sad: true  },
};

/** Làm tối/sáng một màu hex để không phải khai bảng màu thủ công cho mọi món. */
function shade(hex, amount) {
  if (typeof hex !== "string" || !/^#[0-9a-fA-F]{3,8}$/.test(hex)) return hex;
  // #abc → #aabbcc
  const full = hex.length === 4
    ? "#" + hex.slice(1).split("").map((c) => c + c).join("")
    : hex.slice(0, 7);
  const n = parseInt(full.slice(1), 16);
  const shift = (c) => {
    const v = amount > 0 ? c + (255 - c) * amount : c * (1 + amount);
    return Math.max(0, Math.min(255, Math.round(v)));
  };
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(shift);
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/**
 * Bật/tắt một group con bên trong SVG (dùng cho `pet-eyes-closed`, `pet-tongue`...).
 * Chỉ thao tác trên chuỗi asset tĩnh trong repo.
 */
function toggleGroup(svg, groupId, on) {
  if (!svg) return svg;
  const re = new RegExp(`(<g id="${groupId}")([^>]*)>`);
  if (!re.test(svg)) return svg;
  return svg.replace(re, (_, head, attrs) => {
    const cleaned = attrs.replace(/\s*display="[^"]*"/g, "");
    return `${head}${cleaned}${on ? ' display="inline"' : ""}>`;
  });
}

/**
 * Thay token `{{tên}}` trong SVG bằng màu thật.
 *
 * VÌ SAO KHÔNG DÙNG `var(--x, fallback)` TRONG SVG:
 *   nhiều engine không hỗ trợ CSS custom property bên trong SVG (resvg, Safari
 *   cũ, nhiều webview Android) → `fill` rơi về màu đen, pet thành khối đen.
 *   Thay chuỗi ở đây thì chạy được ở mọi nơi mà vẫn không phải sửa file.
 */
function paint(svg, palette) {
  if (!svg) return svg;
  return svg.replace(/\{\{(\w+)\}\}/g, (whole, token) => {
    const v = palette[token];
    return v == null ? whole : v;   // token lạ → giữ nguyên, không vẽ sai màu
  });
}

/** Bảng màu cho lớp cơ bản của pet. */
function petVars(palette) {
  return {
    body: palette.body,
    accent: palette.accent,
    dark: palette.dark,
    stroke: palette.stroke,
    nose: palette.nose,
    eye: "#2E2A26",
    blush: "#F58CA0",
    tongue: "#F26D7D",
  };
}

/** Bảng màu cho một món trang phục. */
function itemVars(color) {
  return {
    main: color,
    dark: shade(color, -0.22),
    light: shade(color, 0.42),
    accent: "#FACC15",
  };
}

/**
 * @param {object}  props
 * @param {string}  props.species   loài pet (dog | cat | ...)
 * @param {string}  props.color     id màu thân
 * @param {object}  props.outfits   { [slot]: id | { id, color } | null }
 * @param {string}  props.mood      happy | excited | hungry | sleepy | sad
 * @param {number}  props.size      chiều rộng (px). Cao tính theo tỉ lệ 1:1.
 * @param {boolean} props.showEmojiFallback  loài chưa có SVG thì hiện emoji
 */
export default function PetRenderer({
  species,
  color,
  outfits = {},
  mood = "happy",
  size = 64,
  className = "",
  showEmojiFallback = true,
  ariaLabel,
}) {
  const base = getPetBase(species);
  const look = MOOD_LOOK[mood] || MOOD_LOOK.happy;

  // Không có SVG cho loài này → emoji. Không tự dựng hình bằng art khác.
  if (!base) {
    if (!showEmojiFallback) return null;
    const emoji = SPECIES_EMOJI[species] || "🐾";
    return (
      <span
        role="img"
        aria-label={ariaLabel || species || "Thú cưng"}
        className={`inline-grid place-items-center leading-none ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.82) }}
      >
        {emoji}
      </span>
    );
  }

  const palette = getPetPalette(color || base.defaultColor);

  // Gom lớp cơ bản + lớp trang phục thành một danh sách rồi sắp theo zIndex.
  const layers = [];

  for (const [name, def] of Object.entries(base.layers)) {
    let asset = def.asset;
    // Biểu cảm: chỉ lớp eyes/face mới có group cần bật/tắt.
    if (name === "eyes") asset = toggleGroup(asset, "pet-eyes-closed", look.eyesClosed);
    if (name === "face") {
      asset = toggleGroup(asset, "pet-tongue", look.tongue);
      asset = toggleGroup(asset, "pet-mouth-sad", look.sad);
    }
    layers.push({ key: `base:${name}`, asset: paint(asset, petVars(palette)), zIndex: def.zIndex });
  }

  for (const [slot, raw] of Object.entries(outfits || {})) {
    const id = typeof raw === "string" ? raw : raw?.id;
    if (!id) continue; // null / rỗng → bỏ qua ô trống
    const asset = getOutfitAsset(id);
    if (!asset) continue; // ID lạ → bỏ qua, không nổi
    if (!isCompatible(asset, species)) continue; // sai loài → bỏ qua

    const chosen = (typeof raw === "object" && raw?.color) || asset.defaultColor;
    layers.push({
      key: `outfit:${slot}:${id}`,
      asset: paint(asset.asset, itemVars(chosen)),
      zIndex: asset.zIndex,
    });
  }

  layers.sort((a, b) => a.zIndex - b.zIndex);

  return (
    <span
      className={`relative block shrink-0 overflow-hidden leading-none ${className}`}
      style={{ width: size, height: size, isolation: "isolate" }}
      role="img"
      aria-label={ariaLabel || "Thú cưng"}
    >
      {layers.map((l) => (
        <PetSvgLayer key={l.key} asset={l.asset} zIndex={l.zIndex} />
      ))}
    </span>
  );
}

/**
 * Vẽ MỘT món trang phục đứng riêng, không có thân/mặt pet.
 *
 * Dùng cho cột "Xem trước" trong bảng quản trị: cần thấy rõ hình dáng và màu
 * của món đồ. Vẽ chung con pet thì các món khác màu rất dễ bị nhầm là cùng một
 * món, và mặt pet còn lấn lên modal đang mở (xem ghi chú `isolation` ở trên).
 */
export function OutfitPreview({ id, color, size = 44, className = "" }) {
  const asset = getOutfitAsset(id);
  if (!asset?.asset) return null;
  return (
    <span
      className={`relative block shrink-0 overflow-hidden leading-none ${className}`}
      style={{ width: size, height: size, isolation: "isolate" }}
      role="img"
      aria-label={asset.name || id}
    >
      <PetSvgLayer asset={paint(asset.asset, itemVars(color || asset.defaultColor))} zIndex={0} />
    </span>
  );
}