// services/petCatalog.js
//
// Danh mục thú cưng: LOÀI, BẢNG MÀU, TRANG PHỤC.
//
// Đây là nguồn sự thật duy nhất. Thêm loài/màu/đồ mới chỉ cần sửa file này —
// service và frontend đều đọc từ đây (frontend lấy qua GET /api/pet/catalog)
// nên không cần sửa code khác.
//
// Mỗi mục có `minLevel` để kiểm soát mở khoá theo cấp thú cưng.

/** Bảng màu thân — dùng chung cho mọi loài. */
export const COLORS = [
  { id: "cream", name: "Kem",    body: "#F4AF66", accent: "#FFF7EE" },
  { id: "brown", name: "Nâu",    body: "#A9714B", accent: "#F6E3D3" },
  { id: "black", name: "Đen",    body: "#4A4A55", accent: "#E4E4EA" },
  { id: "white", name: "Trắng",  body: "#F5F5F7", accent: "#FFFFFF" },
  { id: "orange", name: "Cam",    body: "#F08A3C", accent: "#FFE6CF" },
  { id: "gray", name: "Xám",     body: "#9AA3B2", accent: "#EDEFF3" },
  { id: "pink", name: "Hồng",    body: "#F49BC1", accent: "#FFE4EF" },
  { id: "yellow", name: "Vàng",   body: "#F7C948", accent: "#FFF3C9" },
  { id: "mint", name: "Xanh mint", body: "#6FCF97", accent: "#E0F5EA" },
  { id: "sky", name: "Xanh da trời", body: "#5AA9E6", accent: "#DFF0FC" },
];

/** Trang phục. `slot` là vị trí để vẽ, `minLevel` là cấp mở khoá. */
export const OUTFITS = [
  { id: "hat-cap",     slot: "hat",     name: "Mũ lưỡi trai", minLevel: 1, colors: ["#EF4444", "#3B82F6", "#22C55E", "#FACC15"] },
  { id: "hat-party",   slot: "hat",     name: "Mũ sinh nhật", minLevel: 5, colors: ["#A855F7", "#EC4899"] },
  { id: "hat-crown",   slot: "hat",     name: "Vương miện",   minLevel: 12, colors: ["#FACC15"] },
  { id: "scarf",       slot: "scarf",   name: "Khăn quàng",   minLevel: 2, colors: ["#EF4444", "#0EA5E9", "#F59E0B", "#10B981"] },
  { id: "glasses",     slot: "glasses", name: "Kính mát",     minLevel: 3, colors: ["#111827"] },
  { id: "shirt",       slot: "shirt",   name: "Áo phao",      minLevel: 4, colors: ["#3B82F6", "#EF4444", "#22C55E", "#FACC15"] },
  { id: "bow",         slot: "bow",     name: "Cà vút",       minLevel: 7, colors: ["#EC4899", "#8B5CF6"] },
  { id: "cape",        slot: "cape",    name: "Áo choàng",    minLevel: 10, colors: ["#7C3AED", "#0F172A"] },
  // "balo" khớp với lớp accessory-backpack có sẵn trong dog_mascot_layered.svg
  { id: "backpack",    slot: "backpack", name: "Ba lô",       minLevel: 6, colors: ["#8B5CF6", "#0EA5E9", "#F97316"] },
];

/**
 * LOÀI thú cưng. `shape` là mã hình vẽ mà PetSvg.jsx hiểu.
 * Ưu tiên theo yêu cầu: chó, mèo, chim, cá, khỉ.
 */
export const SPECIES = [
  // art: "svg" = đã có hình vẽ thật trong assets/dog_mascot_layered.svg
  //       null     = chưa có hình → UI khoá nút, chỉ hiện emoji

  {
    id: "dog", name: "Chó", emoji: "🐶", shape: "dog", art: "svg", minLevel: 1,
    desc: "Bạn đồng hành trung thành, thích chạy nhảy và chơi bóng.",
    likes: ["bone", "ball", "walk"],
    defaultColor: "cream",
    trait: "Nhanh nhẹn · Trung thành",
  },
  {
    id: "cat", name: "Mèo", emoji: "🐱", shape: "cat", art: null, minLevel: 1,
    desc: "Kiêu ngạo nhưng khi chơi game thì mê ngủ suốt.",
    likes: ["fish", "yarn", "nap"],
    defaultColor: "gray",
    trait: "Nhanh nhẹn · Độc lập",
  },
  {
    id: "bird", name: "Chim", emoji: "🐦", shape: "bird", art: null, minLevel: 4,
    desc: "Hót hay, bay cao, thích được khen mỗi khi trả lời đúng.",
    likes: ["seed", "sing", "fly"],
    defaultColor: "sky",
    trait: "Giọng hát · Sức bật",
  },
  {
    id: "fish", name: "Cá", emoji: "🐟", shape: "fish", art: null, minLevel: 6,
    desc: "Bình tĩnh, kiên nhẫn, luôn bình tĩnh dù bạn sai bao nhiêu lần.",
    likes: ["algae", "bubble", "coral"],
    defaultColor: "mint",
    trait: "Bình tĩnh · Kiên nhẫn",
  },
  {
    id: "monkey", name: "Khỉ", emoji: "🐵", shape: "monkey", art: null, minLevel: 8,
    desc: "Nghịch ngợm, tò mò, thích leo cây và bắt chước bạn.",
    likes: ["banana", "tree", "imitate"],
    defaultColor: "brown",
    trait: "Nghịch ngợm · Tò mò",
  },
];

/** Trạng thái tâm tính — game dùng để đổi mặt và câu thoại. */
export const MOODS = {
  happy:   { label: "Đang vui", emoji: "💛", hint: "Vừa chơi xong" },
  excited: { label: "Rất hào hứng", emoji: "🎉", hint: "Vừa lên cấp" },
  hungry:  { label: "Đói rồi", emoji: "🍽️", hint: "Chơi lâu chưa ăn" },
  sleepy:  { label: "Muốn ngủ", emoji: "😴", hint: "Chơi quá lâu" },
  sad:     { label: "Buồn", emoji: "💙", hint: " Sai nhiều quá" },
};

// ── Tra cứu nhanh ──────────────────────────────────────────────────────────
const speciesById = new Map(SPECIES.map((s) => [s.id, s]));
const colorById = new Map(COLORS.map((c) => [c.id, c]));
const outfitById = new Map(OUTFITS.map((o) => [o.id, o]));

export const getSpecies = (id) => speciesById.get(id) || null;
export const getColor = (id) => colorById.get(id) || null;
export const getOutfit = (id) => (id ? outfitById.get(id) || null : null);

/** Màu mặc định theo loài, có fallback về màu đầu tiên. */
export function defaultColorFor(speciesId) {
  const sp = getSpecies(speciesId);
  return getColor(sp?.defaultColor) || COLORS[0];
}

/**
 * Kiểm tra một bộ "diện mạo" có hợp lệ không.
 *
 * `outfits[slot]` nhận hoặc chuỗi id, hoặc object `{ id, color }` để mỗi món
 * mang màu riêng. Kết quả trả về LUÔN dạng object `{ id, color }` để client
 * không phải tự suy ra màu mặc định.
 *
 * @returns {{ ok: boolean, value?: object, errors?: string[] }}
 */
export function validateLook({ species, color, outfits } = {}) {
  const errors = [];

  const sp = getSpecies(species);
  if (!sp) errors.push(`species không hợp lệ: ${species}`);

  const col = getColor(color);
  if (!col) errors.push(`color không hợp lệ: ${color}`);

  const slots = ["hat", "scarf", "glasses", "shirt", "bow", "cape"];
  const picked = {};
  for (const slot of slots) {
    const raw = outfits?.[slot] ?? null;
    if (!raw) { picked[slot] = null; continue; }

    const id = typeof raw === "string" ? raw : raw.id;
    const item = getOutfit(id);
    if (!item) { errors.push(`trang phục không hợp lệ ở ô ${slot}: ${id}`); continue; }
    if (item.slot !== slot) { errors.push(`"${item.name}" không thuộc ô ${slot}`); continue; }

    // Màu phải nằm trong bảng màu của chính món đó
    let chosen = item.colors?.[0] || null;
    if (raw && typeof raw === "object" && raw.color) {
      if (!item.colors?.includes(raw.color)) {
        errors.push(`"${item.name}" không có màu ${raw.color}`);
        continue;
      }
      chosen = raw.color;
    }
    picked[slot] = { id: item.id, color: chosen };
  }

  return errors.length ? { ok: false, errors } : { ok: true, value: { species: sp.id, color: col.id, outfits: picked } };
}

/** Lọc danh mục theo cấp thú cưng hiện tại (dùng cho UI chọn đồ). */
export function availableFor(level = 1) {
  const lv = Math.max(1, Number(level) || 1);
  return {
    species: SPECIES.filter((s) => s.minLevel <= lv),
    colors: COLORS,
    outfits: OUTFITS.filter((o) => o.minLevel <= lv),
  };
}

/** Toàn bộ danh mục — trả về cho frontend. */
export function fullCatalog(level = 1) {
  return { species: SPECIES, colors: COLORS, outfits: OUTFITS, moods: MOODS, ...availableFor(level) };
}
