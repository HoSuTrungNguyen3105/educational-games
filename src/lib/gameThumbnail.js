/**
 * Ảnh thumbnail game đặt trong public/, render phía client.
 *
 * API /api/templates không còn mang field thumbnail — server chỉ trả tên game,
 * client tự tra ảnh theo tên file trong public/. Tra theo thứ tự:
 *   id → slug(id) → name → slug(name) (mỗi bước qua bảng alias)
 * Không có ảnh thì trả null để thẻ game giữ emoji làm hình đại diện.
 */
const files = import.meta.glob("../../public/*.{png,webp,jpg,jpeg,svg}", {
  query: "?url",
  import: "default",
  eager: true,
});

const base = import.meta.env.BASE_URL || "/";
const byKey = new Map();
for (const path of Object.keys(files)) {
  // Key của glob là đường dẫn tới file trong public/ → giữ đúng tên gốc, còn
  // URL do Vite sinh có thêm "?url" (dev) hoặc hậu tố hash (build). Bỏ cả hai
  // rồi trỏ thẳng về bản trong public/ để ảnh chỉ tải một bản, không phụ thuộc
  // tên hash thay đổi theo từng lần build.
  const file = path.split("/").pop();
  const key = file.replace(/\.[a-z0-9]+$/i, "").toLowerCase();
  if (!byKey.has(key)) byKey.set(key, `${base}${file}`);
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
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ALIASES[t] || t;
};

export function gameThumbnail(id, name = "") {
  for (const key of [id, slug(id), name, slug(name)]) {
    if (key && byKey.has(String(key).toLowerCase())) return byKey.get(String(key).toLowerCase());
  }
  return null;
}
