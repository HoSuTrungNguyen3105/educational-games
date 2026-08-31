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

export const ZINDEX_MAP = {
  body: 10, skin: 15, face: 20, hair: 30, shirt: 40,
  pants: 50, shoes: 60, hat: 70, glasses: 80, accessory: 90,
};

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
