// data/petAssets.js
//
// Registry trung tâm: ánh xạ ID vật phẩm → asset SVG + loại ô + loài tương thích.
//
// NGUYÊN TẮC
//   • Frontend giữ toàn bộ art. Server KHÔNG gửi đường dẫn/nội dung SVG và
//     không bao giờ được tin với `pet.outfits` — server chỉ gửi ID.
//   • Danh mục (tên, cấp mở khoá, bảng màu) nằm trong collection `petCatalog`
//     trên server và admin sửa được tại /#/admin/pet-catalog. File này chỉ giữ
//     HÌNH VẼ và ánh xạ id → hình.
//   • ID đến từ API luôn phải tra qua registry này. ID lạ thì bỏ qua, tuyệt đối
//     không nội dung SVG nào render trực tiếp từ server.
//   • Thứ tự vẽ lấy từ `zIndex` — cấu hình tập trung, không rải rác trong component.
//
// Mọi file SVG dùng TOKEN dạng `{{tên}}` thay cho màu:
//   pet  : {{body}} {{dark}} {{accent}} {{stroke}} {{eye}}
//          {{nose}} {{blush}} {{tongue}}
//   đồ  : {{main}} {{dark}} {{light}} {{accent}}
// KHÔNG dùng CSS variable trong SVG: nhiều engine (resvg, Safari cũ, webview
// Android) không hỗ trợ `var(--x)` bên trong SVG → fill rơi về đen. PetRenderer
// thay token bằng màu thật trước khi chèn, nên đổi màu không cần sửa file.

import dogBody from "../assets/pets/base/dog/cream/body.svg?raw";
import dogEars from "../assets/pets/base/dog/cream/ears.svg?raw";
import dogEyes from "../assets/pets/base/dog/cream/eyes.svg?raw";
import dogFace from "../assets/pets/base/dog/cream/face.svg?raw";

import catBody from "../assets/pets/base/cat/orange/body.svg?raw";
import catEars from "../assets/pets/base/cat/orange/ears.svg?raw";
import catEyes from "../assets/pets/base/cat/orange/eyes.svg?raw";
import catFace from "../assets/pets/base/cat/orange/face.svg?raw";

import crownSvg from "../assets/pets/outfits/hats/crown.svg?raw";
import wizardHatSvg from "../assets/pets/outfits/hats/wizard-hat.svg?raw";
import capSvg from "../assets/pets/outfits/hats/baseball-cap.svg?raw";
import partyHatSvg from "../assets/pets/outfits/hats/party-hat.svg?raw";
import roundGlassesSvg from "../assets/pets/outfits/glasses/round-glasses.svg?raw";
import studentShirtSvg from "../assets/pets/outfits/shirts/student-shirt.svg?raw";
import redScarfSvg from "../assets/pets/outfits/scarves/red-scarf.svg?raw";
import pinkBowSvg from "../assets/pets/outfits/bows/pink-bow.svg?raw";
import heroCapeSvg from "../assets/pets/outfits/capes/hero-cape.svg?raw";
import adventureBackpackSvg from "../assets/pets/outfits/backpacks/adventure-backpack.svg?raw";

/* ── Thứ tự vẽ (nhỏ → lớn) ──────────────────────────────────────────────────
 * Đổi số ở đây là đổi cả hệ. Giữ các giá trị này cách nhau ít nhất 1 để dễ
 * chèn thêm món mới về sau.
 */
export const LAYER_Z = {
  BACKPACK: 10, // sau lưng
  CAPE: 20,     // sau thân
  EARS: 25,     // sau đầu (chó tai rủ, mèo tai nhọn)
  BODY: 30,
  SHIRT: 40,
  SCARF: 45,    // quanh cổ, sau đầu nên không che mặt
  HEAD: 55,     // dành cho lớp tách riêng nếu sau này cần
  FACE: 60,
  EYES: 62,
  BOW: 70,
  GLASSES: 75,
  HAT: 85,
};

/* ── Bảng màu thân ─────────────────────────────────────────────────────────
 * Chỉ là bảng dự phòng cho lúc API chưa kịp trả về. Nguồn chính thức là
 * `colors` trong collection `petCatalog` (sửa ở /#/admin/pet-catalog).
 * Thêm màu mới ở đây để có hình ngay, rồi thêm cùng id trong admin.
 * `dark`/`accent`/`stroke` suy ra từ body nên mỗi màu chỉ cần 1 dòng.
 */
export const PET_PALETTE = {
  cream:  { body: "#F6B45C", accent: "#FFF1D7", dark: "#C8752E", stroke: "#B96828", nose: "#3A2A22" },
  brown:  { body: "#A9714B", accent: "#F6E3D3", dark: "#7E5335", stroke: "#6B452B", nose: "#3A2418" },
  black:  { body: "#5A5A66", accent: "#E4E4EA", dark: "#3A3A44", stroke: "#2A2A33", nose: "#1A1A20" },
  white:  { body: "#F7F7FA", accent: "#FFFFFF", dark: "#C9C9D2", stroke: "#B0B0BC", nose: "#4A4A55" },
  orange: { body: "#F08A3C", accent: "#FFE6CF", dark: "#C2661F", stroke: "#A8541A", nose: "#B5483F" },
  gray:   { body: "#9AA3B2", accent: "#EDEFF3", dark: "#6E7684", stroke: "#5A6270", nose: "#3A3F4A" },
  pink:   { body: "#F49BC1", accent: "#FFE4EF", dark: "#CE6E96", stroke: "#B25A7E", nose: "#8A3F58" },
  yellow: { body: "#F7C948", accent: "#FFF3C9", dark: "#C9A32F", stroke: "#A8871F", nose: "#6B5312" },
  mint:   { body: "#6FCF97", accent: "#E0F5EA", dark: "#4A9E6E", stroke: "#3A7F58", nose: "#24563C" },
  sky:    { body: "#5AA9E6", accent: "#DFF0FC", dark: "#3E82BB", stroke: "#2F6A99", nose: "#1E4A70" },
};

/** Thêm biến màu cho loài không có ảnh riêng (bird/fish/monkey → dùng bộ chó). */
export const PET_PALETTE_FALLBACK = PET_PALETTE.cream;

/* ── Pet cơ bản ─────────────────────────────────────────────────────────────
 * Mỗi loài có bộ 4 lớp cùng hệ toạ độ 512×512 để trang phục cắm vào khớp.
 * `art: "svg"` = render bằng SVG ghép lớp. Loài khác null → vẫn dùng emoji.
 */
export const PET_BASES = {
  dog: {
    id: "dog",
    name: "Chó",
    emoji: "🐶",
    art: "svg",
    defaultColor: "cream",
    layers: {
      ears: { asset: dogEars, zIndex: LAYER_Z.EARS },
      body: { asset: dogBody, zIndex: LAYER_Z.BODY },
      face: { asset: dogFace, zIndex: LAYER_Z.FACE },
      eyes: { asset: dogEyes, zIndex: LAYER_Z.EYES },
    },
  },
  cat: {
    id: "cat",
    name: "Mèo",
    emoji: "🐱",
    art: "svg",
    defaultColor: "orange",
    layers: {
      ears: { asset: catEars, zIndex: LAYER_Z.EARS },
      body: { asset: catBody, zIndex: LAYER_Z.BODY },
      face: { asset: catFace, zIndex: LAYER_Z.FACE },
      eyes: { asset: catEyes, zIndex: LAYER_Z.EYES },
    },
  },
};

export const SPECIES_EMOJI = {
  dog: "🐶", cat: "🐱", bird: "🐦", fish: "🐟", monkey: "🐵",
};

/* ── Trang phục ─────────────────────────────────────────────────────────────
 * `compatibleSpecies` khai báo rõ loài nào mặc được (mục 6 của đề bài yêu cầu
 * không mặc định mọi món đều hợp với mọi loài).
 * `defaultColor` là màu hiển thị khi người chơi chưa chọn — phải nằm trong
 * `colors` của cùng món trong catalog, nếu không server sẽ từ chối.
 */
const BOTH = ["dog", "cat"];

export const PET_OUTFIT_ASSETS = {
  /* ── Mũ ── */
  hat_crown_01: {
    id: "hat_crown_01", category: "hat", name: "Vương miện",
    asset: crownSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.HAT, defaultColor: "#FACC15",
  },
  hat_wizard_01: {
    id: "hat_wizard_01", category: "hat", name: "Mũ phù thủy",
    asset: wizardHatSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.HAT, defaultColor: "#4A2FB8",
  },
  /* ── Kính ── */
  glasses_round_01: {
    id: "glasses_round_01", category: "glasses", name: "Kính tròn",
    asset: roundGlassesSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.GLASSES, defaultColor: "#242B35",
  },
  /* ── Áo ── */
  shirt_student_01: {
    id: "shirt_student_01", category: "shirt", name: "Áo học sinh",
    asset: studentShirtSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.SHIRT, defaultColor: "#2F5FD0",
  },
  /* ── Khăn ── */
  scarf_red_01: {
    id: "scarf_red_01", category: "scarf", name: "Khăn quàng đỏ",
    asset: redScarfSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.SCARF, defaultColor: "#E0342F",
  },
  /* ── Nơ ── */
  bow_pink_01: {
    id: "bow_pink_01", category: "bow", name: "Nơ hồng",
    asset: pinkBowSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.BOW, defaultColor: "#F06292",
  },
  /* ── Áo choàng ── */
  cape_hero_01: {
    id: "cape_hero_01", category: "cape", name: "Áo choàng anh hùng",
    asset: heroCapeSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.CAPE, defaultColor: "#7C3AED",
  },
  /* ── Ba lô ── */
  backpack_adventure_01: {
    id: "backpack_adventure_01", category: "backpack", name: "Ba lô phiêu lưu",
    asset: adventureBackpackSvg, compatibleSpecies: BOTH, zIndex: LAYER_Z.BACKPACK, defaultColor: "#8B5CF6",
  },
};

/* ── Id catalog CŨ (đã phát hành trước 29/10/2026) ────────────────────────────
 * Người chơi cũ đang lưu các id này trong `pet.outfits`. Xoá khỏi registry sẽ
 * làm món đồ của họ biến mất khỏi hình, nên chỉ ánh xạ lại sang asset tương
 * đương chứ không xoá id khỏi catalog server.
 */export const LEGACY_OUTFIT_ASSETS = {
  "hat-cap":   { asset: capSvg,        category: "hat",     name: "Mũ lưỡi trai",   defaultColor: "#3978DC", zIndex: LAYER_Z.HAT },
  "hat-party": { asset: partyHatSvg,   category: "hat",     name: "Mũ sinh nhật",   defaultColor: "#EC4899", zIndex: LAYER_Z.HAT },
  "hat-crown": { asset: crownSvg,      category: "hat",     name: "Vương miện",     defaultColor: "#FACC15", zIndex: LAYER_Z.HAT },
  scarf:       { asset: redScarfSvg,   category: "scarf",   name: "Khăn quàng",     defaultColor: "#EF4444", zIndex: LAYER_Z.SCARF },
  glasses:     { asset: roundGlassesSvg, category: "glasses", name: "Kính mát",     defaultColor: "#111827", zIndex: LAYER_Z.GLASSES },
  shirt:       { asset: studentShirtSvg, category: "shirt", name: "Áo phao",        defaultColor: "#3B82F6", zIndex: LAYER_Z.SHIRT },
  bow:         { asset: pinkBowSvg,    category: "bow",     name: "Cà vút",         defaultColor: "#EC4899", zIndex: LAYER_Z.BOW },
  cape:        { asset: heroCapeSvg,   category: "cape",    name: "Áo choàng",      defaultColor: "#7C3AED", zIndex: LAYER_Z.CAPE },
  backpack:    { asset: adventureBackpackSvg, category: "backpack", name: "Ba lô",    defaultColor: "#8B5CF6", zIndex: LAYER_Z.BACKPACK },
};

/** Tra cứu một asset trang phục. Trả null nếu ID không có trong registry. */
export function getOutfitAsset(id) {
  if (!id) return null;
  const hit = PET_OUTFIT_ASSETS[id];
  if (hit) return hit;
  const legacy = LEGACY_OUTFIT_ASSETS[id];
  if (legacy) return { id, compatibleSpecies: BOTH, ...legacy };
  return null;
}

/** Tra cứu bộ lớp cơ bản của loài. Trả null nếu loài chưa có SVG. */
export function getPetBase(speciesId) {
  return PET_BASES[speciesId] || null;
}

/** Màu thân theo id; tự suy ra nếu backend trả về mã lạ. */
export function getPetPalette(colorId) {
  if (PET_PALETTE[colorId]) return PET_PALETTE[colorId];
  return PET_PALETTE_FALLBACK;
}

/** Đồ này loài `species` có mặc được không? */
export function isCompatible(outfitAsset, species) {
  if (!outfitAsset) return false;
  const list = outfitAsset.compatibleSpecies;
  return Array.isArray(list) ? list.includes(species) : true;
}

/** Danh sách ô trang phục theo thứ tự hiển thị. */
export const OUTFIT_CATEGORIES = [
  "hat", "glasses", "scarf", "shirt", "bow", "cape", "backpack",
];