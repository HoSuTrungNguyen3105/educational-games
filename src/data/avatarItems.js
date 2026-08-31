export const SPRITE_SHEET = `${import.meta.env.BASE_URL}avatar-sprite.png`;
export const CELL_SIZE = 256;

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

// Each item: id, category, name, x, y, width, height, price, default
// Sprite sheet 1536x1024, grid 256x256 → 6 cols x 4 rows
const items = [
  // ── Body (row 0) ──
  { id: 'body_01', category: 'body', name: 'Thân mặc định', x: 0, y: 0, width: 256, height: 256, price: 0, default: true },

  // ── Skin (row 0) ──
  { id: 'skin_01', category: 'skin', name: 'Da sáng', x: 256, y: 0, width: 256, height: 256, price: 0, default: true },
  { id: 'skin_02', category: 'skin', name: 'Da trung bình', x: 512, y: 0, width: 256, height: 256, price: 0, default: false },
  { id: 'skin_03', category: 'skin', name: 'Da đậm', x: 768, y: 0, width: 256, height: 256, price: 50, default: false },

  // ── Face (row 0-1) ──
  { id: 'face_01', category: 'face', name: 'Mặt bình thường', x: 1024, y: 0, width: 256, height: 256, price: 0, default: true },
  { id: 'face_02', category: 'face', name: 'Mặt cười', x: 1280, y: 0, width: 256, height: 256, price: 0, default: false },
  { id: 'face_03', category: 'face', name: 'Mặt vui', x: 0, y: 256, width: 256, height: 256, price: 30, default: false },

  // ── Hair (row 1) ──
  { id: 'hair_01', category: 'hair', name: 'Tóc ngắn', x: 256, y: 256, width: 256, height: 256, price: 0, default: true },
  { id: 'hair_02', category: 'hair', name: 'Tóc dài', x: 512, y: 256, width: 256, height: 256, price: 0, default: false },
  { id: 'hair_03', category: 'hair', name: 'Tóc xoăn', x: 768, y: 256, width: 256, height: 256, price: 100, default: false },
  { id: 'hair_04', category: 'hair', name: 'Tóc mohawk', x: 1024, y: 256, width: 256, height: 256, price: 150, default: false },

  // ── Shirt (row 1-2) ──
  { id: 'shirt_01', category: 'shirt', name: 'Áo thun trắng', x: 1280, y: 256, width: 256, height: 256, price: 0, default: true },
  { id: 'shirt_02', category: 'shirt', name: 'Áo thun đỏ', x: 0, y: 512, width: 256, height: 256, price: 0, default: false },
  { id: 'shirt_03', category: 'shirt', name: 'Áo sơ mi xanh', x: 256, y: 512, width: 256, height: 256, price: 80, default: false },
  { id: 'shirt_04', category: 'shirt', name: 'Áo hoodie', x: 512, y: 512, width: 256, height: 256, price: 200, default: false },

  // ── Pants (row 2) ──
  { id: 'pants_01', category: 'pants', name: 'Quần jean', x: 768, y: 512, width: 256, height: 256, price: 0, default: true },
  { id: 'pants_02', category: 'pants', name: 'Quần short', x: 1024, y: 512, width: 256, height: 256, price: 0, default: false },
  { id: 'pants_03', category: 'pants', name: 'Quần kaki', x: 1280, y: 512, width: 256, height: 256, price: 120, default: false },

  // ── Shoes (row 3) ──
  { id: 'shoes_01', category: 'shoes', name: 'Giày sneaker', x: 0, y: 768, width: 256, height: 256, price: 0, default: true },
  { id: 'shoes_02', category: 'shoes', name: 'Giày thể thao', x: 256, y: 768, width: 256, height: 256, price: 60, default: false },
  { id: 'shoes_03', category: 'shoes', name: 'Giày boot', x: 512, y: 768, width: 256, height: 256, price: 180, default: false },

  // ── Hat (row 3) ──
  { id: 'hat_01', category: 'hat', name: 'Mũ lưỡi trai', x: 768, y: 768, width: 256, height: 256, price: 70, default: false },
  { id: 'hat_02', category: 'hat', name: 'Mũ beret', x: 1024, y: 768, width: 256, height: 256, price: 120, default: false },

  // ── Glasses (row 3) ──
  { id: 'glasses_01', category: 'glasses', name: 'Kính tròn', x: 1280, y: 768, width: 256, height: 256, price: 90, default: false },

  // ── Accessory ──
  { id: 'acc_01', category: 'accessory', name: 'Phụ kiện sao', x: 0, y: 0, width: 0, height: 0, price: 250, default: false },
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
