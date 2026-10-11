// services/petService.js
//
// Lớp giao diện nghiệp vụ cho hệ thống thú cưng.
//
// VÌ SAO KHÔNG TỰ GỌI `fetch`:
//   `lib/petApi.js` đã là store + HTTP client duy nhất cho pet (có cache
//   localStorage, fallback khi offline, tự đọc token từ userAuth store). Tạo
//   thêm một lớp fetch thứ hai sẽ phải nhân bản token, xử lý lỗi và envelope
//   response — đúng thứ đề bài cấm. Service này chỉ chuẩn hoá dữ liệu và gom
//   các thao tác cấp cao, mọi request vẫn đi qua petApi.
//
// API backend đang dùng (xem server/src/routes/pet.js):
//   GET  /api/pet/catalog  → danh mục loài / màu / trang phục (mở khoá theo cấp)
//   GET  /api/pet          → pet hiện tại
//   PUT  /api/pet          → đổi tên / loài / màu / trang phục (tháo = gửi null)
//   POST /api/pet/exp      → cộng EXP
//   POST /api/pet/mood     → đổi tâm tính
//   POST /api/pet/reset    → đưa về mặc định
//
// "Sở hữu" trong hệ này = đã mở khoá theo cấp pet (server tự chặn nếu chưa đủ
// cấp, trả 400 kèm errors). Không tạo thêm endpoint sở hữu riêng.

import {
  usePet, getPet, getCatalog, loadPet, updateLook, resetPet,
  unlockedFor, catalogView, randomPetTip, moodLabel,
  OUTFIT_SLOTS, subscribePet,
} from "../lib/petApi.js";
import { getOutfitAsset, isCompatible, OUTFIT_CATEGORIES } from "../data/petAssets.js";

/** Ô trang phục — thứ tự hiển thị trong UI. */
export const SLOTS = OUTFIT_SLOTS;

/** Nhãn tiếng Việt + emoji đại diện cho từng ô. */
export const SLOT_META = {
  hat:      { label: "Mũ",       emoji: "👑", hint: "Đội lên đầu" },
  glasses:  { label: "Kính",     emoji: "👓", hint: "Đeo ở mắt" },
  scarf:    { label: "Khăn quàng", emoji: "🧣", hint: "Quanh cổ" },
  shirt:    { label: "Áo",       emoji: "👕", hint: "Mặc lên thân" },
  bow:      { label: "Nơ",       emoji: "🎀", hint: "Cài lệch bên đầu" },
  cape:     { label: "Áo choàng", emoji: "🧥", hint: "Đeo sau lưng" },
  backpack: { label: "Ba lô",    emoji: "🎒", hint: "Đeo sau lưng" },
};

/* ── Hook ─────────────────────────────────────────────────────────────────── */

export { usePet };

/** Nạp pet + catalog. Gọi một lần khi vào màn hình. */
export { loadPet };

/**
 * Một ô trang phục đang mặc. Chấp nhận cả 3 shape server có thể trả:
 *   null | "hat_crown_01" | { id, color }
 * Luôn trả null nếu id không có trong registry frontend.
 */
export function wornOutfit(outfits, slot) {
  const raw = outfits?.[slot] ?? null;
  const id = typeof raw === "string" ? raw : raw?.id;
  if (!id) return null;
  const asset = getOutfitAsset(id);
  if (!asset) return null;
  return {
    id,
    slot,
    name: asset.name,
    category: asset.category,
    asset: asset.asset,
    color: (typeof raw === "object" && raw?.color) || asset.defaultColor || null,
    colors: null, // catalog là nguồn danh sách màu
  };
}

/** Mọi ô đang mặc, đã loại bỏ id lạ. Dùng để render + đồng bộ chéo màn hình. */
export function wornOutfits(outfits) {
  const out = {};
  for (const slot of SLOTS) {
    const w = wornOutfit(outfits, slot);
    if (w) out[slot] = w;
  }
  return out;
}

/**
 * Danh sách trang phục cho màn Kho đồ, đã gắn thêm:
 *   `asset` (SVG để vẽ), `owned` (đã mở khoá theo cấp chưa),
 *   `compatible` (hợp loài pet đang nuôi không), `equipped` (đang mặc chưa).
 *
 * Trả về mảng phẳng đã sắp theo nhóm ô để UI chỉ cần map.
 */
export function wardrobe(pet = getPet()) {
  const catalog = getCatalog();
  const level = Math.max(1, Number(pet?.level) || 1);
  const species = pet?.species;
  const current = pet?.outfits || {};

  return (catalog.outfits || [])
    .map((item) => {
      const asset = getOutfitAsset(item.id);
      const equipped = wornOutfit(current, item.slot || asset?.category)?.id === item.id;
      return {
        id: item.id,
        slot: item.slot,
        name: item.name,
        minLevel: item.minLevel ?? 1,
        colors: item.colors || [],
        owned: (item.minLevel ?? 1) <= level,
        compatible: isCompatible(asset, species),
        hasArt: !!asset,
        equipped,
        equippedColor: equipped ? wornOutfit(current, item.slot)?.color : null,
        asset: asset?.asset || null,
      };
    })
    .sort((a, b) => {
      const sa = OUTFIT_CATEGORIES.indexOf(a.slot);
      const sb = OUTFIT_CATEGORIES.indexOf(b.slot);
      return (sa < 0 ? 99 : sa) - (sb < 0 ? 99 : sb) || a.minLevel - b.minLevel;
    });
}

/** Nhóm wardrobe theo ô trang phục, bỏ nhóm rỗng. */
export function wardrobeBySlot(pet = getPet()) {
  const groups = [];
  for (const slot of OUTFIT_CATEGORIES) {
    const items = wardrobe(pet).filter((i) => i.slot === slot);
    if (items.length) groups.push({ slot, ...SLOT_META[slot], items });
  }
  return groups;
}

/* ── Thao tác ─────────────────────────────────────────────────────────────── */

/**
 * Mặc / tháo một ô. Trả { ok, error } để UI biết báo gì.
 * `entry` = { id, color } để mặc, hoặc null để tháo.
 */
export async function equip(slot, entry) {
  return updateLook({ outfits: { [slot]: entry } });
}

/** Mặc nhiều ô một lượt (dùng sau khi người chơi xác nhận cả bộ trong preview). */
export async function equipMany(outfits) {
  return updateLook({ outfits });
}

/** Tháo đồ ở một ô. */
export function unequip(slot) {
  return equip(slot, null);
}

/** Tháo hết. */
export async function unequipAll() {
  const blank = Object.fromEntries(SLOTS.map((s) => [s, null]));
  return updateLook({ outfits: blank });
}

/** Tổng hợp trạng thái để hiển thị ở Profile. */
export function petSummary(pet = getPet()) {
  const worn = wornOutfits(pet?.outfits);
  return {
    name: pet?.name || "",
    species: pet?.species,
    color: pet?.color,
    level: pet?.level ?? 1,
    exp: pet?.exp ?? 0,
    expNeeded: pet?.expNeeded ?? 200,
    mood: pet?.mood || "happy",
    equippedCount: Object.keys(worn).length,
    totalSlots: SLOTS.length,
    worn,
  };
}

/* ── Kênh đọc ngoài React ─────────────────────────────────────────────────── */

// Dùng lại đúng kênh của store, không tạo kênh thứ hai.
export {
  subscribePet, getPet, getCatalog, updateLook, unlockedFor,
  resetPet, catalogView, randomPetTip, moodLabel,
};