export const SPRITE_SHEET = `${import.meta.env.BASE_URL}avatar/avatar-sprite.png`;
export const SPRITE_WIDTH = 1536;
export const SPRITE_HEIGHT = 1024;
export const CANVAS_SIZE = 512;

export const CATEGORIES = [
  { id: 'body', label: 'Thân' },
  { id: 'skin', label: 'Da' },
  { id: 'face', label: 'Mặt' },
  { id: 'hair', label: 'Tóc' },
  { id: 'shirt', label: 'Áo' },
  { id: 'pants', label: 'Quần' },
  { id: 'shoes', label: 'Giày' },
  { id: 'hat', label: 'Mũ' },
  { id: 'glasses', label: 'Kính' },
  { id: 'accessory', label: 'Phụ kiện' },
];

export const LAYER_ORDER = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];

export const DEFAULT_LOADOUT = {
  body: 'body_01',
  skin: 'skin_01',
  face: 'face_01',
  hair: 'hair_01',
  shirt: 'shirt_01',
  pants: 'pants_01',
  shoes: 'shoes_01',
  hat: null,
  glasses: null,
  accessory: null,
};

/*
 * Sprite sheet regions (from avatar_profile_react_sprite.md):
 *
 * Body:      X 0→245,   Y 0→275
 * Face/Skin: X 250→610, Y 0→290
 * Hair:      X 625→1536,Y 0→310
 * Shirt:     X 0→1050,  Y 270→575
 * Hat:       X 1040→1536,Y 280→455
 * Glasses:   X 1160→1536,Y 430→600
 * Accessory: X 1040→1536,Y 430→1024
 * Pants:     X 0→1050,  Y 540→810
 * Shoes:     X 0→1050,  Y 785→1024
 *
 * Each item below has its own x,y,width,height bounding box within its category region.
 * Adjust these if the actual sprite sheet layout differs.
 */
const items = [
  // ── Body (0→245, 0→275) ──
  { id: 'body_01', category: 'body', name: 'Thân mặc định', x: 0, y: 0, width: 245, height: 275, price: 0, default: true },

  // ── Skin (250→610, 0→290) — 3 variants side by side ──
  { id: 'skin_01', category: 'skin', name: 'Da sáng', x: 250, y: 0, width: 120, height: 290, price: 0, default: true },
  { id: 'skin_02', category: 'skin', name: 'Da trung bình', x: 370, y: 0, width: 120, height: 290, price: 0, default: false },
  { id: 'skin_03', category: 'skin', name: 'Da đậm', x: 490, y: 0, width: 120, height: 290, price: 50, default: false },

  // ── Face (250→610, 0→290) — 3 variants (shared region with skin, different layer) ──
  { id: 'face_01', category: 'face', name: 'Mặt bình thường', x: 250, y: 0, width: 120, height: 290, price: 0, default: true },
  { id: 'face_02', category: 'face', name: 'Mặt cười', x: 370, y: 0, width: 120, height: 290, price: 0, default: false },
  { id: 'face_03', category: 'face', name: 'Mặt vui', x: 490, y: 0, width: 120, height: 290, price: 30, default: false },

  // ── Hair (625→1536, 0→310) — 4 variants ──
  { id: 'hair_01', category: 'hair', name: 'Tóc ngắn', x: 625, y: 0, width: 228, height: 310, price: 0, default: true },
  { id: 'hair_02', category: 'hair', name: 'Tóc dài', x: 853, y: 0, width: 228, height: 310, price: 0, default: false },
  { id: 'hair_03', category: 'hair', name: 'Tóc xoăn', x: 1081, y: 0, width: 228, height: 310, price: 100, default: false },
  { id: 'hair_04', category: 'hair', name: 'Tóc mohawk', x: 1309, y: 0, width: 227, height: 310, price: 150, default: false },

  // ── Shirt (0→1050, 270→575) — 4 variants ──
  { id: 'shirt_01', category: 'shirt', name: 'Áo thun trắng', x: 0, y: 270, width: 263, height: 305, price: 0, default: true },
  { id: 'shirt_02', category: 'shirt', name: 'Áo thun đỏ', x: 263, y: 270, width: 263, height: 305, price: 0, default: false },
  { id: 'shirt_03', category: 'shirt', name: 'Áo sơ mi xanh', x: 526, y: 270, width: 262, height: 305, price: 80, default: false },
  { id: 'shirt_04', category: 'shirt', name: 'Áo hoodie', x: 788, y: 270, width: 262, height: 305, price: 200, default: false },

  // ── Pants (0→1050, 540→810) — 3 variants ──
  { id: 'pants_01', category: 'pants', name: 'Quần jean', x: 0, y: 540, width: 350, height: 270, price: 0, default: true },
  { id: 'pants_02', category: 'pants', name: 'Quần short', x: 350, y: 540, width: 350, height: 270, price: 0, default: false },
  { id: 'pants_03', category: 'pants', name: 'Quần kaki', x: 700, y: 540, width: 350, height: 270, price: 120, default: false },

  // ── Shoes (0→1050, 785→1024) — 3 variants ──
  { id: 'shoes_01', category: 'shoes', name: 'Giày sneaker', x: 0, y: 785, width: 350, height: 239, price: 0, default: true },
  { id: 'shoes_02', category: 'shoes', name: 'Giày thể thao', x: 350, y: 785, width: 350, height: 239, price: 60, default: false },
  { id: 'shoes_03', category: 'shoes', name: 'Giày boot', x: 700, y: 785, width: 350, height: 239, price: 180, default: false },

  // ── Hat (1040→1536, 280→455) — 2 variants ──
  { id: 'hat_01', category: 'hat', name: 'Mũ lưỡi trai', x: 1040, y: 280, width: 248, height: 175, price: 70, default: false },
  { id: 'hat_02', category: 'hat', name: 'Mũ beret', x: 1288, y: 280, width: 248, height: 175, price: 120, default: false },

  // ── Glasses (1160→1536, 430→600) — 2 variants ──
  { id: 'glasses_01', category: 'glasses', name: 'Kính tròn', x: 1160, y: 430, width: 188, height: 170, price: 90, default: false },
  { id: 'glasses_02', category: 'glasses', name: 'Kính vuông', x: 1348, y: 430, width: 188, height: 170, price: 110, default: false },

  // ── Accessory (1040→1536, 430→1024) — 2 variants ──
  { id: 'acc_01', category: 'accessory', name: 'Phụ kiện sao', x: 1040, y: 430, width: 248, height: 297, price: 250, default: false },
  { id: 'acc_02', category: 'accessory', name: 'Phụ kiện tim', x: 1288, y: 430, width: 248, height: 297, price: 200, default: false },
];

export default items;

export function getItemById(id) {
  return items.find(i => i.id === id) || null;
}

export function getItemsByCategory(category) {
  return items.filter(i => i.category === category);
}

export function getDefaultLoadout() {
  return { ...DEFAULT_LOADOUT };
}
