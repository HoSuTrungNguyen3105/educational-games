/**
 * outfitCatalog.js — allowlist cho `users.avatar` và `users.pet`.
 *
 * Hai field này là bộ đồ người chơi tự chọn trong game
 * "Tiệm thời trang cho Bé" (avatar) và "Tiệm thay đồ thú cưng" (pet).
 * SVG của các item nằm ở frontend (`src/games/lib/dressUpAvatarData.js`), nên
 * server chỉ cần biết id nào là hợp lệ — không lưu SVG, không cần deploy lại
 * server khi thêm item mới.
 *
 * Danh sách id ở đây CỐ TÌNH lặp lại phần frontend: server phải tự kiểm tra
 * thay vì tin vào client (giống cách `routes/avatar.js` tự có LAYER_ORDER).
 */

/**
 * Allowlist cho từng trường của avatar. `null` trong danh sách = cho phép bỏ
 * trống (không mặc item đó).
 */
export const AVATAR_FIELDS = {
  body: ["body_01", "body_dragon_01"],
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

/** Thân không nhận lớp mặt/tóc/da (rồng đã khắc sẵn). */
export const AVATAR_NO_OVERLAY_BODIES = ["body_dragon_01"];

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
    const v = src[key];
    out[key] = typeof v === "string" && allowed.includes(v) ? v : defaults[key];
  }
  if (!withAvatar) return out;

  /* Thân không nhận lớp mặt/tóc/da → trả về mặc định cho các lớp đó. */
  if (AVATAR_NO_OVERLAY_BODIES.includes(out.body)) {
    for (const key of ["skin", "face", "hair", "hairColor"]) out[key] = defaults[key];
  }
  /* Mặc váy thì không có quần. */
  if (out.dress) out.pants = null;
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