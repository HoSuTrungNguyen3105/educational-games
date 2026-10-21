import { getDressUp, itemLabel, renderDressUpSvg, sanitizeFor } from './dressUpAvatar.js';

export const KID_LAYERS = [
  { key: 'acc-back', name: 'Phụ kiện sau thân', detail: 'Áo choàng, túi' },
  { key: 'hair-back', name: 'Tóc sau', detail: 'Tóc dài, đuôi ngựa, búi' },
  { key: 'body', name: 'Thân', detail: 'Tay, cổ, đầu' },
  { key: 'face', name: 'Mặt', detail: 'Mắt, lông mày, má, mũi, miệng' },
  { key: 'hair-front', name: 'Tóc trước', detail: 'Mái và highlight' },
  { key: 'outfit', name: 'Áo / Váy', detail: 'Phủ thân' },
  { key: 'pants', name: 'Quần', detail: 'Ẩn khi mặc váy' },
  { key: 'shoes', name: 'Giày', detail: 'Đè lên chân' },
  { key: 'acc-front', name: 'Phụ kiện trước', detail: 'Nơ, khăn, dây chuyền, tai nghe' },
  { key: 'glasses', name: 'Kính', detail: 'Đè lên mắt' },
  { key: 'hat', name: 'Mũ', detail: 'Lớp trên cùng' },
];

export function kidDefaults() {
  return { ...getDressUp().kid.defaults };
}

export function kidPreset(kind = 'boy') {
  const base = kidDefaults();
  if (kind === 'girl') {
    return sanitizeFor('avatar', {
      ...base,
      hair: 'hair_02',
      dress: 'pink',
      pants: null,
      shoes: 'pink',
    });
  }
  if (kind === 'dragon') {
    return sanitizeFor('avatar', { ...base, body: 'body_dragon_01' });
  }
  return sanitizeFor('avatar', base);
}

export function sanitizeKid(state) {
  return sanitizeFor('avatar', state);
}

export function kidTabs(state) {
  return getDressUp().kidTabs(state);
}

export function kidTabCfg(tab, state) {
  return getDressUp().kidTabCfg(tab, state);
}

export function kidItemLabel(tab, id) {
  return itemLabel('avatar', tab, id);
}

export function renderKid(state) {
  return renderDressUpSvg('avatar', state);
}

export function kidBodies() {
  return getDressUp().kid.bodies;
}

export function kidCatalogStats(state = kidDefaults()) {
  const tabs = kidTabs(state);
  const itemCount = tabs.reduce((total, tab) => total + (kidTabCfg(tab.k, state).ids?.length || 0), 0);
  return { tabs, itemCount, bodyCount: Object.keys(kidBodies()).length };
}
