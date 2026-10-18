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

/** Loại nhân vật — đây chính là `avatar.id` mà hồ sơ lưu. */
export const AVATAR_IDS = ["boy", "girl", "monster"];

/** id hợp lệ cho từng trường của avatar. `null` trong danh sách = cho phép bỏ trống. */
export const AVATAR_FIELDS = {
  id: AVATAR_IDS,
  skin: ["s1", "s2", "s3", "s4"],
  hair: [
    "spikyBrown", "spikyBlack", "shortBrown", "shortBlack",
    "longBlack", "longBlonde", "longBrown", "pigtail", "bun", "bob", "ponytail", "twinbun",
  ],
  dress: ["pink", "red", "yellow", "blue", "purple", "stripe", null],
  shirt: ["white", "red", "blue", "yellow", "green", "pink", "stripe", null],
  pants: ["jeans", "black", "khaki", "redshort", "pinkskirt", "greenskirt", null],
  shoes: ["white", "red", "blue", "black", "yellow", null],
  glasses: ["round", "square", "sun", "heart", null],
  hat: ["cap", "beanie", "party", "crown", "straw", "flower", null],
  acc: ["bow", "scarf", "necklace", "phones", "bag", "cape", null],
  mcolor: ["purple", "green", "blue", "orange", "pink", "teal"],
  horns: ["none", "horns", "antenna", "ears", "spikes"],
  eyes: ["one", "two", "three"],
  mouth: ["smile", "fangs", "tongue", "teeth"],
};

/** Bộ đồ mặc định khi hồ sơ chưa có gì (khớp với EG_DRESSUP.kid.defaults). */
export const AVATAR_DEFAULT = {
  id: "boy",
  skin: "s1",
  hair: "spikyBrown",
  dress: null,
  shirt: "white",
  pants: "jeans",
  shoes: "white",
  glasses: null,
  hat: null,
  acc: null,
  mcolor: "purple",
  horns: "horns",
  eyes: "two",
  mouth: "fangs",
};

/** Mỗi loại nhân vật một bộ mặc định riêng — dùng làm giá trị thay thế khi field hỏng. */
export const AVATAR_DEFAULT_BY_ID = {
  boy: AVATAR_DEFAULT,
  girl: { ...AVATAR_DEFAULT, id: "girl", hair: "longBlack", dress: "pink", shoes: "red" },
  monster: { ...AVATAR_DEFAULT, id: "monster", shirt: null, shoes: "red" },
};

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

function pick(raw, allowed, fallback) {
  if (typeof raw !== "string" || raw === "") return fallback;
  return allowed.includes(raw) ? raw : fallback;
}

function cleanByFields(src, fields, defaults, withId) {
  const out = {};
  for (const [key, allowed] of Object.entries(fields)) {
    if (key === "id") continue;
    out[key] = pick(src[key], allowed, defaults[key]);
  }
  /* id là tên gọi của avatar; chọn xong mới chốt bộ mặc định theo đúng loại nhân vật */
  if (withId) {
    out.id = pick(src.id, AVATAR_IDS, defaults.id);
    const byId = AVATAR_DEFAULT_BY_ID[out.id];
    for (const [key] of Object.entries(fields)) {
      if (key === "id") continue;
      if (src[key] === undefined) out[key] = byId[key];
    }
  }
  return out;
}

/**
 * Lọc `avatar` từ client. Trả về null nếu không có gì hợp lệ.
 * Bỏ qua `updatedAt` của client — server tự đóng dấu thời gian.
 */
export function sanitizeAvatar(src) {
  if (!src || typeof src !== "object" || Array.isArray(src)) return null;
  return cleanByFields(src, AVATAR_FIELDS, AVATAR_DEFAULT, true);
}

/** Lọc `pet` từ client. Trả về null nếu không có gì hợp lệ. */
export function sanitizePet(src) {
  if (!src || typeof src !== "object" || Array.isArray(src)) return null;
  return cleanByFields(src, PET_FIELDS, PET_DEFAULT, false);
}