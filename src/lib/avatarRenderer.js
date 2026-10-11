// lib/avatarRenderer.js  (FRONTEND)
//
// GHÉP avatar. KHÔNG sinh lại hình phụ kiện ở đây.
//
// Chia đôi trách nhiệm với server:
//   · BODY GỐC  → src/data/avatarBodies.js (mã frontend, không nằm trong DB)
//   · PHỤ KIỆN  → collection `avatarItems`, server đã sinh sẵn `html`
//
// Trước đây có một bản renderer thứ hai ở đây, sinh lại tóc/áo/quần... y hệt
// server nhưng đã TRƯỞC đi một đoạn (accessory trả string thay vì {back,front}).
// Hệ quả: cùng một bộ đồ mà trang chủ vẽ một kiểu, trang tùy chỉnh vẽ kiểu khác.
// Nay frontend chỉ ghép markup server gửi — một nguồn sự thật duy nhất.

import { getAvatarBody, acceptsOverlays } from "../data/avatarBodies.js";

export { bodyBase } from "../data/avatarBodies.js";
export { AVATAR_BODIES, DEFAULT_BODY_CODE, getAvatarBody, acceptsOverlays } from "../data/avatarBodies.js";

/** Category hợp lệ — KHÔNG gồm `body` (body nằm ở mã frontend). */
export const CATEGORY_LIST = [
  { key: "skin", label: "Da" },
  { key: "face", label: "Khuôn mặt" },
  { key: "hair", label: "Tóc" },
  { key: "shirt", label: "Áo" },
  { key: "pants", label: "Quần" },
  { key: "shoes", label: "Giày" },
  { key: "hat", label: "Mũ" },
  { key: "glasses", label: "Kính" },
  { key: "accessory", label: "Phụ kiện" },
];

/** Thứ tự vẽ từ dưới lên trên. */
export const LAYER_ORDER = CATEGORY_LIST.map((c) => c.key);

/**
 * Phụ kiện có 2 phần: `back` (vẽ sau thân — tóc dài, cánh, ba lô) và `front`
 * (vẽ sau mặt — phần mái, mũ, kính).
 *
 * Server tách sẵn hai trường `back` / `front` cho mỗi item. Hàm này chỉ là
 * DỰ PHÒNG cho item cũ chưa có hai trường đó — đoán bằng `</g>` cuối cùng.
 * Đoán này SAI với ba lô và cánh (lớp `back` của chúng không có `</g>`), nên
 * khi server đã tách thì luôn tin `back`/`front`.
 */
export function splitBackFront(html) {
  if (!html) return { back: '', front: '' };
  const gEnd = html.lastIndexOf('</g>');
  if (gEnd !== -1) {
    const splitAt = gEnd + 4;
    return { back: html.slice(0, splitAt), front: html.slice(splitAt) };
  }
  return { back: '', front: html };
}

/** Lấy { back, front } từ item, ưu tiên trường tách sẵn của server. */
export function partsOf(item) {
  if (!item) return { back: '', front: '' };
  if (typeof item.back === 'string' || typeof item.front === 'string') {
    return { back: item.back || '', front: item.front || '' };
  }
  return splitBackFront(item.html);
}

/** Body gốc không vẽ sẵn mặt/tóc mặc định — phụ kiện sẽ chồng lên. */
function overlayTransform() {
  return 'translate(0,42) scale(1.7067,1.5909)';
}

function injectOverlaysIntoSvg(svg, backHtml, frontHtml) {
  let s = svg;
  s = s.replace('<g id="face">', '<g id="face" opacity="0">');
  s = s.replace('<g id="hair-back">', '<g id="hair-back" opacity="0">');
  s = s.replace('<g id="hair-front">', '<g id="hair-front" opacity="0">');
  s = s.replace('<g id="head"', '<g id="__skip__head"');
  s = backHtml
    ? s.replace('<g id="__skip__head"', backHtml + '<g id="head"')
    : s.replace('<g id="__skip__head"', '<g id="head"');
  if (frontHtml) {
    const lastG = s.lastIndexOf('</g>');
    if (lastG !== -1) s = s.slice(0, lastG) + frontHtml + s.slice(lastG);
  }
  return s;
}

/**
 * @typedef {Object} Layer
 * @property {string} [back]
 * @property {string} [front]
 * @property {string} [html]  markup thô từ server (tự tách nếu thiếu back/front)
 */

/**
 * Ghép avatar hoàn chỉnh.
 *
 * @param {Object} opts
 * @param {string} [opts.bodyCode]   code body từ `avatarLoadout.body`
 * @param {string} [opts.skin]       mã màu da (hex)
 * @param {Object<string, Layer>} opts.layers  markup phụ kiện theo category
 * @param {string[]} [opts.order]    thứ tự vẽ (mặc định LAYER_ORDER). Trang admin
 *                                   dùng để thử thứ tự layer trước khi lưu.
 * @returns {string} nội dung SVG
 */
export function composeAvatar({ bodyCode, skin, layers = {}, order } = {}) {
  const body = getAvatarBody(bodyCode);
  const bodySvg = body.render?.(skin || '#FFDFC4') || '';

  // Body tự khắc sẵn chi tiết (rồng) → vẽ nguyên trạng, không ghép phụ kiện.
  if (!acceptsOverlays(body)) return bodySvg;

  let back = '';
  let front = '';
  for (const key of (order?.length ? order : LAYER_ORDER)) {
    const layer = layers[key];
    if (!layer) continue;
    const parts = partsOf(layer);
    back += parts.back;
    front += parts.front;
  }

  if (!back && !front) return bodySvg;

  const t = overlayTransform();
  return injectOverlaysIntoSvg(
    bodySvg,
    back ? `<g transform="${t}">${back}</g>` : '',
    `<g transform="${t}">${front}</g>`,
  );
}

/**
 * Bỏ lớp body mặc định (mặt + tóc) để phụ kiện chồng lên đúng chỗ.
 * Body gốc đã có sẵn `id="face"`, `id="hair-back"`, `id="hair-front"`.
 */

/**
 * Dựng state từ danh sách item của server + loadout hiện tại.
 *
 * @param {Object<string, string|null>} loadout  map category → item code
 * @param {Array} items  danh sách item từ GET /avatar/items
 * @returns {{ bodyCode: string, skin: string, layers: Object }}
 */
export function buildLayersFromLoadout(loadout = {}, items = []) {
  const map = new Map(items.map((i) => [i.code, i]));
  const layers = {};
  let skin = '#FFDFC4';
  let bodyCode = loadout.body;

  for (const [category, itemId] of Object.entries(loadout)) {
    if (category === 'body' || !itemId) continue;
    const item = map.get(itemId);
    if (!item) continue;

    if (category === 'skin') {
      skin = item.params?.hex || skin;
      continue;
    }
    layers[category] = item;
  }

  return { bodyCode, skin, layers };
}

/** viewBox phù hợp: mọi body đều vẽ trong hệ 512×700. */
export const AVATAR_VIEW_BOX = '0 0 512 700';
export const AVATAR_ASPECT = 700 / 512;
