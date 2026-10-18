import { Router } from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError, sendCreated } from "../utils/response.js";
import { getCollection } from "../db.js";
import { renderItemHtml, renderItemParts } from "../lib/avatarRenderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const router = Router();

const ITEMS = "avatarItems";
const USERS = "users";
const TEMPLATE = "avatarTemplate";

/**
 * PHỤ KIỆN — những layer do backend quản lý (admin sửa được, không cần deploy).
 * `body` KHÔNG có trong danh sách: thân avatar là code frontend, xem
 * src/data/avatarBodies.js.
 */
const CATEGORIES = [
  { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const LAYER_ORDER = CATEGORIES.map((c) => c.id);

/**
 * `body` vẫn nằm trong loadout để không phá dữ liệu người dùng cũ, nhưng nó
 * chỉ là một `code` trỏ tới registry frontend — server không lưu, không
 * kiểm tra, không render body.
 */
const DEFAULT_LOADOUT = {
  body: "body_boy_01", skin: "skin_01", face: "face_01", hair: "hair_boy_01", shirt: "shirt_boy_01",
  pants: "pants_boy_01", shoes: "shoes_boy_01", hat: null, glasses: null, accessory: null,
};

const DEFAULT_TEMPLATE = {
  skin: { x: 0, y: 0, width: 512, height: 700, zIndex: 1 },
  face: { x: 0, y: 0, width: 512, height: 700, zIndex: 2 },
  hair: { x: 0, y: 0, width: 512, height: 700, zIndex: 3 },
  shirt: { x: 0, y: 0, width: 512, height: 700, zIndex: 4 },
  pants: { x: 0, y: 0, width: 512, height: 700, zIndex: 5 },
  shoes: { x: 0, y: 0, width: 512, height: 700, zIndex: 6 },
  hat: { x: 0, y: 0, width: 512, height: 700, zIndex: 7 },
  glasses: { x: 0, y: 0, width: 512, height: 700, zIndex: 8 },
  accessory: { x: 0, y: 0, width: 512, height: 700, zIndex: 9 },
};

// ─── SEED DATA ─────────────────────────────────────────────────────
//
// Danh mục phụ kiện mặc định. Muốn đổi giá / tên / bật-tắt item thì sửa trong
// trang admin, không sửa file này (đây chỉ là dữ liệu lúc collection rỗng).

/**
 * Sinh 3 trường dẫn xuất từ `params`: `back` (vẽ sau thân), `front` (vẽ sau mặt)
 * và `html` = back + front.
 *
 * VÌ SAO TÁCH `back`/`front` THÀNH 2 TRƯỜNG THAY VÌ ĐỂ FRONTEND TỰ ĐOÁN:
 *   Frontend cần biết phần nào vẽ sau thân, phần nào vẽ sau mặt. Nếu gộp 1
 *   chuỗi rồi đoán bằng `lastIndexOf('</g>')` thì sai ngay với ba lô / cánh —
 *   lớp `back` của chúng là `<rect>`/`<path>` không có `</g>` nào, khiến cả
 *   ba lô vẽ ĐÈ LÊN THÂN thay vì đằng sau. Tách sẵn ở server là cách duy nhất
 *   không đoán.
 */
function deriveMarkup(item) {
  const parts = renderItemParts(item.category, item.params || {});
  return { back: parts.back, front: parts.front, html: parts.back + parts.front };
}

function buildSeedItems() {
  const raw = [
    // SKIN
    { code: "skin_01", category: "skin", name: "Trắng hồng", price: 0, default: true, params: { hex: "#FFDFC4" } },
    { code: "skin_02", category: "skin", name: "Vàng sáng", price: 50, default: false, params: { hex: "#F0C299" } },
    { code: "skin_03", category: "skin", name: "Rám nắng", price: 50, default: false, params: { hex: "#D9A066" } },
    { code: "skin_04", category: "skin", name: "Nâu đồng", price: 50, default: false, params: { hex: "#A9714F" } },
    { code: "skin_05", category: "skin", name: "Nâu sẫm", price: 50, default: false, params: { hex: "#6B4226" } },

    // FACE
    { code: "face_01", category: "face", name: "Hiền dịu", price: 0, default: true, params: { style: "gentle", emoji: "🙂" } },
    { code: "face_02", category: "face", name: "Vui tươi", price: 0, default: false, params: { style: "happy", emoji: "😄" } },
    { code: "face_03", category: "face", name: "Tinh nghịch", price: 0, default: false, params: { style: "wink", emoji: "😉" } },
    { code: "face_04", category: "face", name: "Cười to", price: 0, default: false, params: { style: "laughing", emoji: "😆" } },
    { code: "face_05", category: "face", name: "Cá tính", price: 0, default: false, params: { style: "fierce", emoji: "😠" } },

    // HAIR BOY
    { code: "hair_boy_01", category: "hair", name: "Bờm gai nâu", price: 0, default: true, gender: "boy", params: { style: "spiky", color: "#6B4226" } },
    { code: "hair_boy_02", category: "hair", name: "Bờm gai đen", price: 80, default: false, gender: "boy", params: { style: "spiky", color: "#241F1C" } },
    { code: "hair_boy_03", category: "hair", name: "Tóc rối navy", price: 80, default: false, gender: "boy", params: { style: "messy", color: "#2A3A6B" } },
    { code: "hair_boy_04", category: "hair", name: "Tóc rối bạc", price: 100, default: false, gender: "boy", params: { style: "messy", color: "#D8D8D8" } },
    { code: "hair_boy_05", category: "hair", name: "Bờm gai đỏ", price: 80, default: false, gender: "boy", params: { style: "wild", color: "#C0392B" } },
    { code: "hair_boy_06", category: "hair", name: "Chải lệch hạt dẻ", price: 80, default: false, gender: "boy", params: { style: "side", color: "#4A2E1E" } },
    { code: "hair_boy_07", category: "hair", name: "Chải lệch vàng", price: 80, default: false, gender: "boy", params: { style: "side", color: "#E8B94B" } },
    { code: "hair_boy_08", category: "hair", name: "Bờm gai lục", price: 100, default: false, gender: "boy", params: { style: "wild", color: "#2F8F5B" } },
    { code: "hair_boy_09", category: "hair", name: "Tóc rối tím", price: 100, default: false, gender: "boy", params: { style: "messy", color: "#7B4FA0" } },
    { code: "hair_boy_10", category: "hair", name: "Bờm gai ngọc lam", price: 120, default: false, gender: "boy", params: { style: "spiky", color: "#2F9E9E" } },

    // HAIR GIRL
    { code: "hair_girl_01", category: "hair", name: "Tóc dài nâu", price: 0, default: true, gender: "girl", params: { style: "long", color: "#6B4226" } },
    { code: "hair_girl_02", category: "hair", name: "Hai bím nâu", price: 80, default: false, gender: "girl", params: { style: "twin", color: "#6B4226" } },
    { code: "hair_girl_03", category: "hair", name: "Tóc xoăn hồng", price: 100, default: false, gender: "girl", params: { style: "wavy", color: "#F2A6C6" } },
    { code: "hair_girl_04", category: "hair", name: "Tóc dài vàng", price: 80, default: false, gender: "girl", params: { style: "long", color: "#E8B94B" } },
    { code: "hair_girl_05", category: "hair", name: "Tóc dài đen", price: 80, default: false, gender: "girl", params: { style: "long", color: "#241F1C" } },
    { code: "hair_girl_06", category: "hair", name: "Tóc xoăn navy", price: 100, default: false, gender: "girl", params: { style: "wavy", color: "#2A3A6B" } },
    { code: "hair_girl_07", category: "hair", name: "Tóc xoăn tím", price: 120, default: false, gender: "girl", params: { style: "wavy", color: "#7B4FA0" } },
    { code: "hair_girl_08", category: "hair", name: "Tóc tết hạt dẻ", price: 100, default: false, gender: "girl", params: { style: "braid", color: "#4A2E1E" } },
    { code: "hair_girl_09", category: "hair", name: "Tóc dài nâu nhạt", price: 80, default: false, gender: "girl", params: { style: "long", color: "#8A5A34" } },
    { code: "hair_girl_10", category: "hair", name: "Hai bím đen", price: 80, default: false, gender: "girl", params: { style: "twin", color: "#241F1C" } },

    // SHIRT BOY
    { code: "shirt_boy_01", category: "shirt", name: "Áo phông trắng", price: 0, default: true, gender: "boy", params: { style: "tee", color: "#F5F5F5" } },
    { code: "shirt_boy_02", category: "shirt", name: "Áo hoodie đen", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#241F1C" } },
    { code: "shirt_boy_03", category: "shirt", name: "Áo hoodie đỏ", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#C0392B" } },
    { code: "shirt_boy_04", category: "shirt", name: "Áo khoác xanh", price: 150, default: false, gender: "boy", params: { style: "jacket", color: "#3FB6E8" } },
    { code: "shirt_boy_05", category: "shirt", name: "Áo khoác đen", price: 150, default: false, gender: "boy", params: { style: "jacket", color: "#241F1C" } },
    { code: "shirt_boy_06", category: "shirt", name: "Áo hoodie vàng", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#F2B705" } },
    { code: "shirt_boy_07", category: "shirt", name: "Áo hoodie lục", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#2F8F5B" } },
    { code: "shirt_boy_08", category: "shirt", name: "Áo polo trắng", price: 100, default: false, gender: "boy", params: { style: "polo", color: "#F5F5F5" } },
    { code: "shirt_boy_09", category: "shirt", name: "Áo phông đen", price: 0, default: false, gender: "boy", params: { style: "tee", color: "#241F1C" } },
    { code: "shirt_boy_10", category: "shirt", name: "Áo hoodie trắng", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#F5F5F5" } },

    // SHIRT GIRL
    { code: "shirt_girl_01", category: "shirt", name: "Áo phông nơ trắng", price: 0, default: true, gender: "girl", params: { style: "tee", color: "#F5F5F5" } },
    { code: "shirt_girl_02", category: "shirt", name: "Áo len hồng", price: 120, default: false, gender: "girl", params: { style: "sweater", color: "#F2A6C6" } },
    { code: "shirt_girl_03", category: "shirt", name: "Áo len xanh nơ", price: 120, default: false, gender: "girl", params: { style: "sweater", color: "#8FD3F4" } },
    { code: "shirt_girl_04", category: "shirt", name: "Áo hoodie đen", price: 120, default: false, gender: "girl", params: { style: "hoodie", color: "#241F1C" } },
    { code: "shirt_girl_05", category: "shirt", name: "Áo phông tim", price: 80, default: false, gender: "girl", params: { style: "tee", color: "#FDFDFD" } },
    { code: "shirt_girl_06", category: "shirt", name: "Áo cardigan vàng", price: 150, default: false, gender: "girl", params: { style: "cardigan", color: "#F2B705" } },
    { code: "shirt_girl_07", category: "shirt", name: "Áo khoác đen phối", price: 150, default: false, gender: "girl", params: { style: "jacket", color: "#241F1C" } },
    { code: "shirt_girl_08", category: "shirt", name: "Áo hoodie hồng", price: 120, default: false, gender: "girl", params: { style: "hoodie", color: "#F2A6C6" } },
    { code: "shirt_girl_09", category: "shirt", name: "Áo thủy thủ trắng", price: 100, default: false, gender: "girl", params: { style: "sailor", color: "#F5F5F5" } },
    { code: "shirt_girl_10", category: "shirt", name: "Áo thủy thủ navy", price: 100, default: false, gender: "girl", params: { style: "sailor", color: "#2A3A6B" } },

    // PANTS BOY
    { code: "pants_boy_01", category: "pants", name: "Quần short đen", price: 0, default: true, gender: "boy", params: { style: "shorts", color: "#241F1C" } },
    { code: "pants_boy_02", category: "pants", name: "Quần short xanh", price: 60, default: false, gender: "boy", params: { style: "shorts", color: "#3FB6E8" } },
    { code: "pants_boy_03", category: "pants", name: "Quần cargo be", price: 100, default: false, gender: "boy", params: { style: "cargo", color: "#D2B48C" } },
    { code: "pants_boy_04", category: "pants", name: "Quần short xám", price: 60, default: false, gender: "boy", params: { style: "shorts", color: "#9AA0A6" } },
    { code: "pants_boy_05", category: "pants", name: "Quần jean xanh", price: 100, default: false, gender: "boy", params: { style: "jeans", color: "#3B5EA6" } },
    { code: "pants_boy_06", category: "pants", name: "Quần jogger đen", price: 120, default: false, gender: "boy", params: { style: "joggers", color: "#241F1C" } },
    { code: "pants_boy_07", category: "pants", name: "Quần cargo olive", price: 100, default: false, gender: "boy", params: { style: "cargo", color: "#6E7B3B" } },
    { code: "pants_boy_08", category: "pants", name: "Quần kaki", price: 80, default: false, gender: "boy", params: { style: "jeans", color: "#C8B27A" } },
    { code: "pants_boy_09", category: "pants", name: "Quần jean đen", price: 100, default: false, gender: "boy", params: { style: "jeans", color: "#2B2B2B" } },
    { code: "pants_boy_10", category: "pants", name: "Quần short kem", price: 60, default: false, gender: "boy", params: { style: "shorts", color: "#E8DCC4" } },

    // PANTS GIRL
    { code: "pants_girl_01", category: "pants", name: "Váy xếp ly đen", price: 0, default: true, gender: "girl", params: { style: "skirt", color: "#241F1C" } },
    { code: "pants_girl_02", category: "pants", name: "Váy xếp ly trắng", price: 80, default: false, gender: "girl", params: { style: "skirt", color: "#F5F5F5" } },
    { code: "pants_girl_03", category: "pants", name: "Váy caro hồng", price: 100, default: false, gender: "girl", params: { style: "skirt", color: "#F2A6C6" } },
    { code: "pants_girl_04", category: "pants", name: "Quần short đen", price: 60, default: false, gender: "girl", params: { style: "shorts", color: "#241F1C" } },
    { code: "pants_girl_05", category: "pants", name: "Váy navy", price: 100, default: false, gender: "girl", params: { style: "skirt", color: "#2A3A6B" } },
    { code: "pants_girl_06", category: "pants", name: "Quần short hồng", price: 60, default: false, gender: "girl", params: { style: "shorts", color: "#F2A6C6" } },
    { code: "pants_girl_07", category: "pants", name: "Quần jean xanh nhạt", price: 100, default: false, gender: "girl", params: { style: "jeans", color: "#8FB8E6" } },
    { code: "pants_girl_08", category: "pants", name: "Quần cargo hồng", price: 100, default: false, gender: "girl", params: { style: "cargo", color: "#E6A5C0" } },
    { code: "pants_girl_09", category: "pants", name: "Quần jean đen", price: 100, default: false, gender: "girl", params: { style: "jeans", color: "#2B2B2B" } },
    { code: "pants_girl_10", category: "pants", name: "Váy xếp ly xanh", price: 100, default: false, gender: "girl", params: { style: "skirt", color: "#3B5EA6" } },

    // SHOES BOY
    { code: "shoes_boy_01", category: "shoes", name: "Giày thể thao xanh", price: 0, default: true, gender: "boy", params: { style: "sneaker", color: "#3B5EA6" } },
    { code: "shoes_boy_02", category: "shoes", name: "Giày thể thao đỏ", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#C0392B" } },
    { code: "shoes_boy_03", category: "shoes", name: "Giày thể thao trắng", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#F5F5F5" } },
    { code: "shoes_boy_04", category: "shoes", name: "Bốt đen", price: 120, default: false, gender: "boy", params: { style: "boots", color: "#241F1C" } },
    { code: "shoes_boy_05", category: "shoes", name: "Giày thể thao vàng", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#F2B705" } },
    { code: "shoes_boy_06", category: "shoes", name: "Giày thể thao lục", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#2F8F5B" } },
    { code: "shoes_boy_07", category: "shoes", name: "Bốt nâu", price: 120, default: false, gender: "boy", params: { style: "boots", color: "#8A5A34" } },
    { code: "shoes_boy_08", category: "shoes", name: "Giày đỏ đen", price: 100, default: false, gender: "boy", params: { style: "sneaker", color: "#8E2A2A" } },
    { code: "shoes_boy_09", category: "shoes", name: "Bốt đen cao", price: 140, default: false, gender: "boy", params: { style: "boots", color: "#3A3A3A" } },
    { code: "shoes_boy_10", category: "shoes", name: "Bốt trắng", price: 120, default: false, gender: "boy", params: { style: "boots", color: "#F0F0F0" } },

    // SHOES GIRL
    { code: "shoes_girl_01", category: "shoes", name: "Giày thể thao hồng", price: 0, default: true, gender: "girl", params: { style: "sneaker", color: "#F2A6C6" } },
    { code: "shoes_girl_02", category: "shoes", name: "Giày thể thao trắng", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#F5F5F5" } },
    { code: "shoes_girl_03", category: "shoes", name: "Bốt đen", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#241F1C" } },
    { code: "shoes_girl_04", category: "shoes", name: "Bốt hồng", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#E6A5C0" } },
    { code: "shoes_girl_05", category: "shoes", name: "Giày thể thao xanh", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#8FD3F4" } },
    { code: "shoes_girl_06", category: "shoes", name: "Bốt trắng", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#F0F0F0" } },
    { code: "shoes_girl_07", category: "shoes", name: "Bốt hồng phấn", price: 140, default: false, gender: "girl", params: { style: "boots", color: "#F6C6DA" } },
    { code: "shoes_girl_08", category: "shoes", name: "Giày thể thao đen", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#2B2B2B" } },
    { code: "shoes_girl_09", category: "shoes", name: "Bốt navy", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#2A3A6B" } },
    { code: "shoes_girl_10", category: "shoes", name: "Giày thể thao vàng", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#F2B705" } },

    // HAT
    { code: "hat_01", category: "hat", name: "Không đội mũ", price: 0, default: true, params: { style: "none" } },
    { code: "hat_02", category: "hat", name: "Mũ lưỡi trai xanh", price: 100, default: false, params: { style: "cap", color: "#3FB6E8" } },
    { code: "hat_03", category: "hat", name: "Mũ lưỡi trai đen", price: 100, default: false, params: { style: "cap", color: "#241F1C" } },
    { code: "hat_04", category: "hat", name: "Mũ lưỡi trai đỏ", price: 100, default: false, params: { style: "cap", color: "#C0392B" } },
    { code: "hat_05", category: "hat", name: "Mũ len đen", price: 80, default: false, params: { style: "beanie", color: "#241F1C" } },
    { code: "hat_06", category: "hat", name: "Mũ bucket vàng", price: 120, default: false, params: { style: "bucket", color: "#F2B705" } },
    { code: "hat_07", category: "hat", name: "Mũ bucket lục", price: 120, default: false, params: { style: "bucket", color: "#2F8F5B" } },
    { code: "hat_08", category: "hat", name: "Mũ nồi cao", price: 150, default: false, params: { style: "tophat", color: "#241F1C" } },
    { code: "hat_09", category: "hat", name: "Mũ rơm", price: 100, default: false, params: { style: "sunhat", color: "#E8B94B" } },

    // GLASSES
    { code: "glasses_01", category: "glasses", name: "Không đeo kính", price: 0, default: true, params: { style: "none" } },
    { code: "glasses_02", category: "glasses", name: "Kính tròn đen", price: 80, default: false, params: { style: "round", color: "#241F1C" } },
    { code: "glasses_03", category: "glasses", name: "Kính tròn vàng", price: 80, default: false, params: { style: "round", color: "#C99A2E" } },
    { code: "glasses_04", category: "glasses", name: "Kính trái tim", price: 120, default: false, params: { style: "heart", color: "#FF5DA2" } },
    { code: "glasses_05", category: "glasses", name: "Kính râm vuông", price: 100, default: false, params: { style: "sun", color: "#1C1C1C" } },
    { code: "glasses_06", category: "glasses", name: "Kính mắt mèo hồng", price: 120, default: false, params: { style: "cat", color: "#FF5DA2" } },
    { code: "glasses_07", category: "glasses", name: "Kính mắt mèo đen", price: 120, default: false, params: { style: "cat", color: "#241F1C" } },
    { code: "glasses_08", category: "glasses", name: "Kính ngôi sao", price: 150, default: false, params: { style: "star", color: "#F2B705" } },

    // ACCESSORY
    { code: "accessory_01", category: "accessory", name: "Không có", price: 0, default: true, params: { style: "none" } },
    { code: "accessory_02", category: "accessory", name: "Tai nghe xanh", price: 150, default: false, params: { style: "headphones", color: "#3FB6E8" } },
    { code: "accessory_03", category: "accessory", name: "Tai nghe hồng", price: 150, default: false, params: { style: "headphones", color: "#FF5DA2" } },
    { code: "accessory_04", category: "accessory", name: "Khăn quàng đỏ", price: 80, default: false, params: { style: "scarf", color: "#C0392B" } },
    { code: "accessory_05", category: "accessory", name: "Khăn quàng trắng", price: 80, default: false, params: { style: "scarf", color: "#F5F5F5" } },
    { code: "accessory_06", category: "accessory", name: "Khẩu trang đen", price: 60, default: false, params: { style: "mask", color: "#241F1C" } },
    { code: "accessory_07", category: "accessory", name: "Balo xanh", price: 200, default: false, params: { style: "backpack", color: "#3FB6E8" } },
    { code: "accessory_08", category: "accessory", name: "Balo hồng", price: 200, default: false, params: { style: "backpack", color: "#FF5DA2" } },
    { code: "accessory_09", category: "accessory", name: "Tai mèo đen", price: 120, default: false, params: { style: "ears", color: "#241F1C" } },
    { code: "accessory_10", category: "accessory", name: "Cánh thiên thần", price: 300, default: false, params: { style: "wings", color: "#FFFFFF" } },
    { code: "accessory_11", category: "accessory", name: "Cánh dơi đen", price: 300, default: false, params: { style: "wings", color: "#241F1C" } },
  ];

  return raw.map((item) => ({ ...item, ...deriveMarkup(item) }));
}

/**
 * Đồng bộ collection `avatarItems` với seed và dọn dữ liệu thừa.
 *
 * Gọi mỗi lần đọc. Ba việc:
 *   1. Collection rỗng → seed toàn bộ.
 *   2. Xoá item `body` (body đã chuyển sang mã frontend) và gỡ khỏi
 *      `users.inventory` + `avatarLoadout` để không còn code chết.
 *   3. Đổi `id` cũ → `code`, và bổ sung item seed còn thiếu.
 */
async function ensureSeeded(force = false) {
  const col = getCollection(ITEMS);
  if (force) await col.deleteMany({});

  const count = await col.countDocuments();
  if (count === 0) {
    await col.insertMany(buildSeedItems().map((i) => ({ ...i })), { ordered: false }).catch(() => {});
    return;
  }

  // 1) Body đã chuyển ra frontend → xoá khỏi DB và khỏi túi đồ người chơi.
  const staleBodies = await col.find({ category: "body" }).toArray();
  if (staleBodies.length > 0) {
    const codes = staleBodies.map((b) => b.code).filter(Boolean);
    await col.deleteMany({ category: "body" });
    if (codes.length > 0) {
      await getCollection(USERS).updateMany(
        { inventory: { $in: codes } },
        { $pull: { inventory: { $in: codes } } },
      );
    }
    await getCollection(USERS).updateMany(
      { avatarLoadout: { $exists: true } },
      { $set: { "avatarLoadout.body": "body_boy_01" } },
    );
  }

  // 2) Đổi field `id` (schema cũ) → `code`.
  await col.updateMany(
    { code: { $exists: false }, id: { $exists: true } },
    [{ $set: { code: "$id" } }],
  );
  await col.updateMany({ id: { $exists: true } }, { $unset: { id: "" } });

  // 3) Bổ sung item seed còn thiếu (không ghi đè item admin đã sửa).
  const existing = new Set((await col.find({}, { projection: { code: 1 } }).toArray()).map((d) => d.code));
  const missing = buildSeedItems().filter((i) => !existing.has(i.code));
  if (missing.length > 0) {
    await col.insertMany(missing, { ordered: false }).catch(() => {});
  }

  // 4) Item thiếu `back`/`front` (dữ liệu cũ, hoặc tạo tay) → sinh lại từ
  //    params. `back`/`front` mới thêm nên toàn bộ item cũ rơi vào nhánh này
  //    đúng một lần rồi ổn định.
  const stale = await col.find({ $or: [{ back: { $exists: false } }, { front: { $exists: false } }] }).toArray();
  for (const item of stale) {
    await col.updateOne({ _id: item._id }, { $set: deriveMarkup(item) });
  }
}

async function ensureTemplate() {
  const existing = await getCollection(TEMPLATE).findOne({ _id: "default" });
  if (!existing) {
    await getCollection(TEMPLATE).insertOne({ _id: "default", categories: DEFAULT_TEMPLATE });
  }
}

// ─── PUBLIC ──────────────────────────────────────────────────────

router.get("/categories", (_req, res) => {
  sendSuccess(res, {
    categories: CATEGORIES,
    layerOrder: LAYER_ORDER,
    // Body do frontend quản lý — server chỉ báo cho client biết có bao nhiêu
    // body và mã tương ứng để hiển thị, không lưu ở đây.
    bodies: [
      { code: "body_boy_01", label: "Body bé trai", gender: "boy" },
      { code: "body_girl_01", label: "Body bé gái", gender: "girl" },
      { code: "body_custom_01", label: "Rồng xanh", gender: "any" },
    ],
  });
});

router.get("/items", async (req, res, next) => {
  try {
    await ensureSeeded();
    await ensureTemplate();
    let items = await getCollection(ITEMS).find({}).sort({ category: 1, price: 1 }).toArray();
    const q = (req.query.query || "").trim().toLowerCase();
    if (q) {
      items = items.filter(it =>
        (it.name || "").toLowerCase().includes(q) ||
        (it.code || "").toLowerCase().includes(q) ||
        (it.category || "").toLowerCase().includes(q)
      );
    }
    const tmpl = await getCollection(TEMPLATE).findOne({ _id: "default" });
    sendSuccess(res, {
      items,
      categories: CATEGORIES,
      layerOrder: LAYER_ORDER,
      template: tmpl?.categories || DEFAULT_TEMPLATE,
    });
  } catch (e) { next(e); }
});

router.get("/template", async (_req, res, next) => {
  try {
    await ensureTemplate();
    const tmpl = await getCollection(TEMPLATE).findOne({ _id: "default" });
    sendSuccess(res, { template: tmpl?.categories || DEFAULT_TEMPLATE });
  } catch (e) { next(e); }
});

router.get("/inventory", authenticate, async (req, res, next) => {
  try {
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, { inventory: user.inventory || [] });
  } catch (e) { next(e); }
});

/**
 * `GET /api/avatar/loadout` đã bị gỡ: bộ đồ avatar + thú cưng giờ nằm trong hồ
 * sơ (`GET/PUT /api/auth/me` → `avatar`, `pet`) và được cache ở localStorage.
 * Game nhận SVG avatar qua postMessage `init` (xem `HtmlGameLoader.jsx`).
 */

router.post("/buy", authenticate, async (req, res, next) => {
  try {
    const { itemCode } = req.body || {};
    if (!itemCode) return sendError(res, "Thiếu itemCode", 400);
    await ensureSeeded();
    const item = await getCollection(ITEMS).findOne({ code: itemCode });
    if (!item) return sendError(res, "Item không tồn tại", 404);
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    if (item.price === 0 || item.default) {
      return sendSuccess(res, { owned: true, inventory: user.inventory || [], coins: user.coins || 0 });
    }
    if ((user.inventory || []).includes(itemCode)) {
      return sendSuccess(res, { owned: true, inventory: user.inventory, coins: user.coins || 0 });
    }
    const coins = user.coins || 0;
    if (coins < item.price) return sendError(res, `Không đủ coin. Cần ${item.price}, bạn có ${coins}`, 400);
    const newCoins = coins - item.price;
    const newInventory = [...(user.inventory || []), itemCode];
    await getCollection(USERS).updateOne({ id: req.user.sub }, { $set: { coins: newCoins, inventory: newInventory } });
    sendSuccess(res, { owned: true, inventory: newInventory, coins: newCoins });
  } catch (e) { next(e); }
});

router.post("/save", authenticate, async (req, res, next) => {
  try {
    const { loadout } = req.body || {};
    if (!loadout || typeof loadout !== "object") return sendError(res, "Thiếu loadout", 400);
    await ensureSeeded();
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    const inventory = user.inventory || [];

    const clean = {};
    for (const [layer, itemCode] of Object.entries(loadout)) {
      // Body: chỉ lưu code, không validate (registry ở frontend lo).
      if (layer === "body") { clean.body = itemCode || DEFAULT_LOADOUT.body; continue; }
      if (itemCode === null) { clean[layer] = null; continue; }
      if (!LAYER_ORDER.includes(layer)) return sendError(res, `Layer không hợp lệ: ${layer}`, 400);
      const item = await getCollection(ITEMS).findOne({ code: itemCode });
      if (!item) return sendError(res, `Item không tồn tại: ${itemCode}`, 400);
      if (item.category !== layer) return sendError(res, `Item ${itemCode} không thuộc layer ${layer}`, 400);
      if (item.price > 0 && !item.default && !inventory.includes(itemCode)) {
        return sendError(res, `Bạn chưa sở hữu item: ${item.name}`, 400);
      }
      clean[layer] = itemCode;
    }

    await getCollection(USERS).updateOne({ id: req.user.sub }, { $set: { avatarLoadout: clean } });
    sendSuccess(res, { loadout: clean });
  } catch (e) { next(e); }
});

// ─── ADMIN ──────────────────────────────────────────────────────
//
// Trước đây các route /admin/* chỉ dùng `authenticate` — học sinh đăng nhập là
// xoá được item của toàn bộ server. Nay thêm `requireRoles` cho đúng vai trò.

const adminOnly = [authenticate, requireRoles("teacher", "admin")];

const uid = () => `av-${Math.random().toString(36).slice(2, 9)}`;

router.put("/template", ...adminOnly, async (req, res, next) => {
  try {
    const { categories } = req.body || {};
    if (!categories || typeof categories !== "object") return sendError(res, "Thiếu categories", 400);
    await getCollection(TEMPLATE).updateOne(
      { _id: "default" },
      { $set: { categories } },
      { upsert: true }
    );
    sendSuccess(res, { template: categories });
  } catch (e) { next(e); }
});

router.post("/admin/items", ...adminOnly, async (req, res, next) => {
  try {
    const { category, name, params, price, default: isDefault, gender } = req.body || {};
    if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
    if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400);
    const p = params || {};
    const item = {
      code: uid(), category, name: String(name).trim(),
      params: p, price: Math.max(0, Number(price) || 0), default: !!isDefault,
      ...(gender ? { gender } : {}),
      ...deriveMarkup({ category, params: p }),
    };
    await getCollection(ITEMS).insertOne(item);
    sendCreated(res, item);
  } catch (e) { next(e); }
});

router.put("/admin/items/:code", ...adminOnly, async (req, res, next) => {
  try {
    const { code } = req.params;
    const existing = await getCollection(ITEMS).findOne({ code });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    const { category, name, params, price, default: isDefault, gender } = req.body || {};
    const updates = {};
    if (category !== undefined) {
      if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400);
      updates.category = category;
    }
    if (name !== undefined) updates.name = String(name).trim();
    if (params !== undefined) updates.params = params;
    if (price !== undefined) updates.price = Math.max(0, Number(price) || 0);
    if (isDefault !== undefined) updates.default = !!isDefault;
    if (gender !== undefined) updates.gender = gender;
    // Markup luôn sinh lại từ params — không nhận `html` từ client để không
    // hai bên cùng sửa một item rồi lệch nhau.
    Object.assign(updates, deriveMarkup({
      category: updates.category || existing.category,
      params: updates.params || existing.params || {},
    }));
    if (Object.keys(updates).length === 0) return sendError(res, "Không có gì để cập nhật", 400);
    await getCollection(ITEMS).updateOne({ code }, { $set: updates });
    const updated = await getCollection(ITEMS).findOne({ code });
    sendSuccess(res, updated);
  } catch (e) { next(e); }
});

router.post("/admin/items/batch", ...adminOnly, async (req, res, next) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return sendError(res, "Thiếu items array", 400);
    if (items.length > 100) return sendError(res, "Tối đa 100 item mỗi lần", 400);
    const created = [];
    for (const it of items) {
      const { category, name, params, price, default: isDefault, gender } = it || {};
      if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
      if (!CATEGORIES.find(c => c.id === category)) return sendError(res, `Category không hợp lệ: ${category}`, 400);
      const p = params || {};
      const item = {
        code: uid(), category, name: String(name).trim(),
        params: p, price: Math.max(0, Number(price) || 0), default: !!isDefault,
        ...(gender ? { gender } : {}),
        ...deriveMarkup({ category, params: p }),
      };
      await getCollection(ITEMS).insertOne(item);
      created.push(item);
    }
    sendCreated(res, { items: created, count: created.length });
  } catch (e) { next(e); }
});

router.delete("/admin/items/:code", ...adminOnly, async (req, res, next) => {
  try {
    const { code } = req.params;
    const existing = await getCollection(ITEMS).findOne({ code });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    if (existing.default) return sendError(res, "Không thể xóa item mặc định", 400);

    // Gỡ khỏi túi đồ và loadout của người chơi, nếu không họ sẽ mang item
    // không tồn tại và không đổi được bất cứ layer nào.
    const users = getCollection(USERS);
    await users.updateMany({ inventory: code }, { $pull: { inventory: code } });
    await users.updateMany({ [`avatarLoadout.${existing.category}`]: code }, { $set: { [`avatarLoadout.${existing.category}`]: null } });

    await getCollection(ITEMS).deleteOne({ code });
    sendSuccess(res, { deleted: code });
  } catch (e) { next(e); }
});

/** Xoá sạch item rồi seed lại danh mục phụ kiện mặc định. */
router.post("/admin/reset-items", ...adminOnly, async (_req, res, next) => {
  try {
    await ensureSeeded(true);
    sendSuccess(res, { message: "Đã xóa tất cả items và seed lại từ đầu" });
  } catch (e) { next(e); }
});

router.delete("/admin/items", ...adminOnly, async (_req, res, next) => {
  try {
    const result = await getCollection(ITEMS).deleteMany({});
    sendSuccess(res, { message: "Đã xóa toàn bộ items", deletedCount: result.deletedCount });
  } catch (e) { next(e); }
});

/**
 * Render thử 1 phụ kiện từ `params` mà không cần lưu.
 *
 * Trang admin dùng endpoint này để xem trước khi bấm "Lưu", nhờ vậy frontend
 * không phải chép lại bộ sinh markup của server (trước đây chính vì thế mà
 * có 2 bản renderer lệch nhau).
 */
router.post("/admin/preview", ...adminOnly, async (req, res, next) => {
  try {
    const { category, params } = req.body || {};
    if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400);
    const parts = renderItemParts(category, params || {});
    sendSuccess(res, { back: parts.back, front: parts.front, html: parts.back + parts.front });
  } catch (e) { next(e); }
});

export default router;
