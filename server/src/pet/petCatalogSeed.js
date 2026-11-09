// services/petCatalogSeed.js
//
// Dữ liệu khởi tạo cho danh mục thú cưng.
//
// File này CHỈ chứa dữ liệu mặc định dùng lúc seed collection `petCatalog`.
// Sau khi seed xong, nguồn sự thật là MongoDB và admin sửa trực tiếp trên web —
// sửa file này KHÔNG còn áp dụng cho database đã có dữ liệu.
//
// Muốn đưa lại giá trị mặc định: dùng nút "Khôi phục danh mục" trong trang
// admin quản lý pet, hoặc POST /api/pet/admin/reset-catalog.

/** Bảng màu thân — dùng chung cho mọi loài. */
export const COLORS = [
  { id: "cream", name: "Kem", body: "#F4AF66", accent: "#FFF7EE" },
  { id: "brown", name: "Nâu", body: "#A9714B", accent: "#F6E3D3" },
  { id: "black", name: "Đen", body: "#4A4A55", accent: "#E4E4EA" },
  { id: "white", name: "Trắng", body: "#F5F5F7", accent: "#FFFFFF" },
  { id: "orange", name: "Cam", body: "#F08A3C", accent: "#FFE6CF" },
  { id: "gray", name: "Xám", body: "#9AA3B2", accent: "#EDEFF3" },
  { id: "pink", name: "Hồng", body: "#F49BC1", accent: "#FFE4EF" },
  { id: "yellow", name: "Vàng", body: "#F7C948", accent: "#FFF3C9" },
  { id: "mint", name: "Xanh mint", body: "#6FCF97", accent: "#E0F5EA" },
  { id: "sky", name: "Xanh da trời", body: "#5AA9E6", accent: "#DFF0FC" },
];

/**
 * Trang phục. `slot` là vị trí để vẽ, `minLevel` là cấp mở khoá.
 *
 * `id` KHÔNG được đổi sau khi đã phát hành — người chơi đang lưu id cũ trong
 * `pet.outfits`, đổi id sẽ làm món đồ của họ mất hiệu lực.
 *
 * Id đặt theo quy ước `_<nhóm>_<tên>_<số>` cho món mới (xem
 * src/data/petAssets.js — registry asset frontend ánh xạ đúng các id này).
 * Các id đơn giản (`hat-cap`, `scarf`, …) là id đời đầu, giữ nguyên để tương
 * thích ngược và registry vẫn ánh xạ chúng sang cùng bộ SVG.
 */
export const OUTFITS = [
  { id: "hat-cap", slot: "hat", name: "Mũ lưỡi trai", minLevel: 1, colors: ["#EF4444", "#3B82F6", "#22C55E", "#FACC15"] },
  { id: "hat-party", slot: "hat", name: "Mũ sinh nhật", minLevel: 5, colors: ["#A855F7", "#EC4899"] },
  { id: "hat-crown", slot: "hat", name: "Vương miện", minLevel: 12, colors: ["#FACC15"] },

  // ── Bộ mới: khớp 1-1 với file SVG trong src/assets/pets/outfits ──
  { id: "hat_crown_01", slot: "hat", name: "Vương miện", minLevel: 8, colors: ["#FACC15", "#FFD75E", "#E0A100"] },
  { id: "hat_wizard_01", slot: "hat", name: "Mũ phù thủy", minLevel: 10, colors: ["#4A2FB8", "#1E3A8A", "#6D28D9"] },
  { id: "glasses_round_01", slot: "glasses", name: "Kính tròn", minLevel: 6, colors: ["#242B35", "#0EA5E9", "#B45309"] },
  { id: "shirt_student_01", slot: "shirt", name: "Áo học sinh", minLevel: 7, colors: ["#2F5FD0", "#0F766E", "#9D174D", "#1E293B"] },
  { id: "scarf_red_01", slot: "scarf", name: "Khăn quàng đỏ", minLevel: 5, colors: ["#E0342F", "#0EA5E9", "#F59E0B", "#10B981"] },
  { id: "bow_pink_01", slot: "bow", name: "Nơ hồng", minLevel: 4, colors: ["#F06292", "#8B5CF6", "#22D3EE"] },
  { id: "cape_hero_01", slot: "cape", name: "Áo choàng anh hùng", minLevel: 11, colors: ["#7C3AED", "#0F172A", "#DC2626"] },
  { id: "backpack_adventure_01", slot: "backpack", name: "Ba lô phiêu lưu", minLevel: 3, colors: ["#8B5CF6", "#0EA5E9", "#F97316"] },

  // ── Id đời đầu, giữ để tương thích ngược ──
  { id: "scarf", slot: "scarf", name: "Khăn quàng", minLevel: 2, colors: ["#EF4444", "#0EA5E9", "#F59E0B", "#10B981"] },
  { id: "glasses", slot: "glasses", name: "Kính mát", minLevel: 3, colors: ["#111827"] },
  { id: "shirt", slot: "shirt", name: "Áo phao", minLevel: 4, colors: ["#3B82F6", "#EF4444", "#22C55E", "#FACC15"] },
  { id: "bow", slot: "bow", name: "Cà vút", minLevel: 7, colors: ["#EC4899", "#8B5CF6"] },
  { id: "cape", slot: "cape", name: "Áo choàng", minLevel: 10, colors: ["#7C3AED", "#0F172A"] },
  // "backpack" khớp với món `backpack_adventure_01` mới
  { id: "backpack", slot: "backpack", name: "Ba lô", minLevel: 6, colors: ["#8B5CF6", "#0EA5E9", "#F97316"] },
];

/**
 * LOÀI thú cưng. `shape` là mã hình vẽ mà frontend hiểu.
 * Ưu tiên theo yêu cầu: chó, mèo, chim, cá, khỉ.
 */
export const SPECIES = [
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
  happy: { label: "Đang vui", emoji: "💛", hint: "Vừa chơi xong" },
  excited: { label: "Rất hào hứng", emoji: "🎉", hint: "Vừa lên cấp" },
  hungry: { label: "Đói rồi", emoji: "🍽️", hint: "Chơi lâu chưa ăn" },
  sleepy: { label: "Muốn ngủ", emoji: "😴", hint: "Chơi quá lâu" },
  sad: { label: "Buồn", emoji: "💙", hint: "Sai nhiều quá" },
};

/**
 * 7 ô trang phục, thứ tự đúng như `OUTFIT_SLOTS` ở frontend.
 *
 * BỎ SÓT Ô = MẤT ĐỒ. Thêm ô mới ở đây thì cũng phải thêm vào
 * `OUTFIT_CATEGORIES` trong src/data/petAssets.js, nếu không UI sẽ không
 * vẽ được món đồ đó.
 */
export const OUTFIT_SLOTS = ["hat", "scarf", "glasses", "shirt", "bow", "cape", "backpack"];

/** Nhãn tiếng Việt cho từng ô, dùng cho admin + UI chọn đồ. */
export const SLOT_LABELS = {
  hat: "Mũ",
  scarf: "Khăn quàng",
  glasses: "Kính",
  shirt: "Áo",
  bow: "Nơ",
  cape: "Áo choàng",
  backpack: "Ba lô",
};
