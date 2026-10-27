/**
 * outfitCatalog.js — allowlist cho `users.avatar` và `users.pet`.
 *
 * Hai field này là bộ đồ người chơi tự chọn trong game
 * "Tiệm thời trang cho Bé" (avatar) và "Tiệm thay đồ thú cưng" (pet).
 * SVG của các item nằm ở frontend (`src/games/_shared/lib/dressUpAvatarData.js`), nên
 * server chỉ cần biết id nào là hợp lệ — không lưu SVG, không cần deploy lại
 * server khi thêm item mới.
 *
 * Danh sách id ở đây CỐ TÌNH lặp lại phần frontend: server phải tự kiểm tra
 * thay vì tin vào client (giống cách `routes/avatar.js` tự có LAYER_ORDER).
 *
 * THÊM THÂN MỚI thì khác thêm item thường: mã body phải có trong
 * `AVATAR_FIELDS.body` — không có là hồ sơ gửi lên âm thầm rơi về body_01,
 * người chơi đổi máy về lại thấy thành bé trai. `scripts/test-avatar-bodies.mjs`
 * so danh sách hai bên mỗi lần chạy test để không sót.
 */

/**
 * Mã body của hệ avatar cũ (`/api/avatar/categories`, `src/data/avatarBodies.js`)
 * đặt tên khác hệ mới. Hồ sơ mang mã cũ phải quy về mã mới, nếu không
 * `cleanByFields` rơi về mặc định body_01 → bé gái/bé rồng thành bé trai.
 */
export const AVATAR_BODY_ALIASES = {
  body_boy_01: "body_01",
  body_custom_01: "body_dragon_01",
};

/**
 * Allowlist cho từng trường của avatar. `null` trong danh sách = cho phép bỏ
 * trống (không mặc item đó).
 */
export const AVATAR_FIELDS = {
  body: ["body_01", "body_girl_01", "body_rider_01", "body_superman_01",
    "body_kaiju_01", "body_ghost_01", "body_popstar_01", "body_dragon_01"],
  skin: ["s1", "s2", "s3", "s4"],
  face: ["face_01", "face_02", "face_03", "face_04", "face_05"],
  hair: ["hair_01", "hair_02", "hair_03", "hair_04", "hair_05", "hair_06"],
  hairColor: ["nâu", "đen", "vàng", "nâuSáng", "đỏ", "xanh", "tím", "bạc"],
  shirt: ["white", "red", "blue", "yellow", "green", "pink", "purple", "orange", null],
  dress: ["pink", "red", "yellow", "blue", "purple", "mint", null],
  pants: ["jeans", "black", "khaki", "redshort", "skirt_pink", "skirt_mint", null],
  shoes: ["white", "red", "blue", "black", "pink", null],
  glasses: ["glasses_01", "glasses_02", "glasses_03", "glasses_04", null],
  hat: ["hat_01", "hat_02", "hat_03", "hat_04", "hat_05", "hat_06", null],
  acc: ["acc_01", "acc_02", "acc_03", "acc_04", "acc_05", "acc_06", null],
};

/** Bộ đồ mặc định khi hồ sơ chưa có gì (khớp với EG_DRESSUP.kid.defaults). */
export const AVATAR_DEFAULT = {
  body: "body_01",
  skin: "s1",
  face: "face_01",
  hair: "hair_01",
  hairColor: "nâu",
  shirt: "white",
  dress: null,
  pants: "jeans",
  shoes: "white",
  glasses: null,
  hat: null,
  acc: null,
};

/**
 * Nhóm linh kiện mà từng thân nhận — bản sao của `BODIES[code].slots` trong
 * `src/games/_shared/lib/dressUpAvatarData.js` (server tự kiểm, không tin
 * client). Thân không có mặt/tóc/da (rồng, kaiju, ma) cũng không nhận áo quần;
 * nhân vật tự vẽ đồ (kaiju, ma, ngôi sao nhạc pop) thì áo/váy/quần/giày bị
 * bỏ trống chứ không bị ép mặc lại.
 */
export const AVATAR_HUMAN_SLOTS = ["skin", "face", "hair", "hairColor",
  "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"];
export const AVATAR_BODY_SLOTS = {
  body_01: AVATAR_HUMAN_SLOTS,
  body_girl_01: AVATAR_HUMAN_SLOTS,
  body_rider_01: AVATAR_HUMAN_SLOTS,
  body_superman_01: AVATAR_HUMAN_SLOTS,
  body_kaiju_01: ["glasses", "hat", "acc"],
  body_ghost_01: ["hat", "acc"],
  body_popstar_01: ["skin", "face", "hair", "hairColor", "glasses", "hat", "acc"],
  body_dragon_01: [],
};

/**
 * Thân tự vẽ đủ phần người → hồ sơ được phép bỏ áo/váy/quần/giày:
 *   body_girl_01      eo + chân trần
 *   body_rider_01     bộ đồ xanh + bốt + thắt lưng
 *   body_superman_01  bộ đồ xanh + quần chip + bốt + áo choàng
 *   body_kaiju_01 / body_ghost_01 / body_popstar_01  thân vẽ sẵn, không mặc gì thêm
 */
export const AVATAR_SELF_CLOTHED_BODIES = ["body_girl_01", "body_rider_01", "body_superman_01",
  "body_kaiju_01", "body_ghost_01", "body_popstar_01"];

/** id hợp lệ cho từng trường của pet. */
export const PET_FIELDS = {
  animal: ["dog", "cat", "rabbit", "hamster", "panda", "fox"],
  shirt: ["red", "blue", "yellow", "green", "pink", "stripe", null],
  glasses: ["round", "square", "sun", "heart", null],
  hat: ["party", "crown", "beanie", "chef", "flower", null],
  neck: ["bow", "scarf", "bell", null],
};

export const PET_DEFAULT = {
  animal: "cat",
  shirt: null,
  glasses: null,
  hat: null,
  neck: null,
};

function cleanByFields(src, fields, defaults, withAvatar) {
  const out = {};
  for (const [key, allowed] of Object.entries(fields)) {
    let v = src[key];
    if (withAvatar && key === "body" && AVATAR_BODY_ALIASES[v]) v = AVATAR_BODY_ALIASES[v];
    /* null chỉ giữ khi allowlist cho phép bỏ trống lớp đó. */
    const ok = v === null ? allowed.includes(null) : typeof v === "string" && allowed.includes(v);
    out[key] = ok ? v : defaults[key];
  }
  if (!withAvatar) return out;

  /* Thân không nhận nhóm linh kiện nào thì xóa lớp đó: lớp tuỳ chọn về null,
   * lớp bắt buộc (da/mặt/tóc) về mặc định — khớp `sanitizeKid` của frontend. */
  const slots = AVATAR_BODY_SLOTS[out.body] || [];
  for (const key of Object.keys(out)) {
    if (key === "body" || slots.includes(key)) continue;
    out[key] = fields[key].includes(null) ? null : defaults[key];
  }
  /* Mặc váy thì không có quần. */
  if (out.dress) out.pants = null;
  /* body_01 không vẽ thân/chân bằng da → bỏ trống là hồ sơ thành nhân vật khuyết.
   * Thân đã tự mặc đủ (chân trần / bộ đồ anh hùng) thì null là ý người chơi. */
  if (!AVATAR_SELF_CLOTHED_BODIES.includes(out.body)) {
    if (slots.includes("shoes") && out.shoes === null) out.shoes = defaults.shoes;
    if (!out.dress) {
      if (slots.includes("shirt") && out.shirt === null) out.shirt = defaults.shirt;
      if (slots.includes("pants") && out.pants === null) out.pants = defaults.pants;
    }
  }
  return out;
}

/**
 * Lọc `avatar` từ client. Trả về null nếu không phải object.
 * Bỏ qua `updatedAt` của client — server tự đóng dấu thời gian.
 */
export function sanitizeAvatar(src) {
  if (!src || typeof src !== "object" || Array.isArray(src)) return null;
  return cleanByFields(src, AVATAR_FIELDS, AVATAR_DEFAULT, true);
}

/** Lọc `pet` từ client. Trả về null nếu không phải object. */
export function sanitizePet(src) {
  if (!src || typeof src !== "object" || Array.isArray(src)) return null;
  return cleanByFields(src, PET_FIELDS, PET_DEFAULT, false);
}