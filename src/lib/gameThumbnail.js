/**
 * Ảnh thumbnail game đặt trong public/ (512x512 PNG), render phía client.
 *
 * API /api/templates không còn mang field thumbnail — server chỉ trả id/slug/name,
 * client tự tra ảnh theo tên file trong public/. Tra theo thứ tự:
 *   id → slug(id) → alias[id] → slug(name) → alias[slug(name)]
 * Không có ảnh thì trả null để thẻ game giữ emoji làm hình đại diện.
 */
const files = import.meta.glob("../../public/*.{png,webp,jpg,jpeg,svg}", {
  query: "?url",
  import: "default",
  eager: true,
});

const byKey = new Map();
for (const url of Object.values(files)) {
  const file = url.split("/").pop();
  const key = file.replace(/\.[a-z0-9]+$/i, "").toLowerCase();
  if (!byKey.has(key)) byKey.set(key, url);
}

// Ảnh đặt tên theo cụm từ khác id/name game.
const ALIASES = {
  "math-adventure": "san-trai-cay",
  "block-master": "block-master-super-puzzle",
  "block-master-super-puzzle": "block-master-super-puzzle",
  "find-number": "find-the-number-solo",
  "merge-blast": "merge-and-blast-solo",
  "nong-trai-moi": "nong-trai-nang-cap",
};

const slug = (s = "") => {
  const t = s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return ALIASES[t] || t;
};

export function gameThumbnail(id, name = "") {
  for (const key of [id, slug(id), slug(name)]) {
    if (key && byKey.has(key.toLowerCase())) return byKey.get(key.toLowerCase());
  }
  return null;
}
