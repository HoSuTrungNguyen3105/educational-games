// components/MascotDog.jsx
//
// Dùng ĐÚNG file SVG bạn đã có: src/assets/dog_mascot_layered.svg
//
// File này được thiết kế sẵn cho việc tùy biến:
//   • gradient `fur`       → đổi màu lông
//   • `accessory-glasses`  → bật/tắt bằng display
//   • `accessory-shirt`    → có gradient `shirtBlue` để đổi màu áo
//   • `accessory-cap`      → mũ
//   • `accessory-backpack` → balô
//
// Component nạp SVG dưới dạng chuỗi, sửa thuộc tính rồi chèn vào DOM.
// Không tạo file ảnh mới.

import { useMemo } from "react";
import svgRaw from "../assets/dog_mascot_layered.svg?raw";
import { darker, lighter, contrast } from "../lib/color.js";

/** Ánh xạ ô trang phục → id lớp trong SVG. */
const LAYER_BY_SLOT = {
  glasses: "accessory-glasses",
  shirt: "accessory-shirt",
  hat: "accessory-cap",
  backpack: "accessory-backpack",
};

/** Bảng màu theo id trong petCatalog — khớp COLORS của server. */
const PALETTE = {
  cream: { body: "#F6B45C", accent: "#FFF1D7", dark: "#C8752E", stroke: "#B96828" },
  brown: { body: "#A9714B", accent: "#F6E3D3", dark: "#7E5335", stroke: "#6B452B" },
  black: { body: "#4A4A55", accent: "#E4E4EA", dark: "#33333C", stroke: "#26262E" },
  white: { body: "#F2F2F5", accent: "#FFFFFF", dark: "#CFCFD6", stroke: "#B9B9C2" },
  orange: { body: "#F08A3C", accent: "#FFE6CF", dark: "#C2661F", stroke: "#A8541A" },
  gray: { body: "#9AA3B2", accent: "#EDEFF3", dark: "#6E7684", stroke: "#5A6270" },
  pink: { body: "#F49BC1", accent: "#FFE4EF", dark: "#CE6E96", stroke: "#B25A7E" },
  yellow: { body: "#F7C948", accent: "#FFF3C9", dark: "#C9A32F", stroke: "#A8871F" },
  mint: { body: "#6FCF97", accent: "#E0F5EA", dark: "#4A9E6E", stroke: "#3A7F58" },
  sky: { body: "#5AA9E6", accent: "#DFF0FC", dark: "#3E82BB", stroke: "#2F6A99" },
};

const FALLBACK = PALETTE.cream;

/** Màu mặc định của từng lớp phụ kiện khi người chơi chưa chọn màu. */
const DEFAULT_LAYER_COLOR = {
  "accessory-glasses": "#242B35",
  "accessory-shirt": "#5DA9FF",
  "accessory-cap": "#4C8BF5",
  "accessory-backpack": "#8B5CF6",
};

/** id màu lạ nhưng là hex hợp lệ → tự suy ra bảng màu. Không phải hex → dùng mặc định. */
function paletteFor(colorId) {
  if (PALETTE[colorId]) return PALETTE[colorId];
  if (typeof colorId === "string" && /^#[0-9a-fA-F]{6}$/.test(colorId)) {
    return { body: colorId, accent: lighter(colorId, 0.42, -0.5), dark: darker(colorId, 0.1), stroke: darker(colorId, 0.18) };
  }
  return FALLBACK;
}

/** Bật/tắt một lớp: thêm hoặc bỏ thuộc tính display. */
function toggleLayer(svg, layerId, on) {
  const re = new RegExp(`(<g id="${layerId}")([^>]*)>`);
  if (!re.test(svg)) return svg;
  return svg.replace(re, (_, head, attrs) => {
    const cleaned = attrs.replace(/\s*display="[^"]*"/g, "");
    return `${head}${cleaned}${on ? ' display="inline"' : ""}>`;
  });
}

/** Chạy hàm `fn` lên phần bên trong một lớp, giữ nguyên thẻ mở/đóng. */
function insideLayer(svg, layerId, fn) {
  const re = new RegExp(`(<g id="${layerId}"[^>]*>)([\\s\\S]*?)(</g>)`);
  return svg.replace(re, (_, open, body, close) => open + fn(body) + close);
}

/** Tô một lớp phụ kiện theo màu người chơi chọn. */
function paintAccessory(svg, layerId, color) {
  return insideLayer(svg, layerId, (body) =>
    body
      .replace(/fill="url\(#shirtBlue\)"/g, `fill="${color}"`)
      // mảng chính
      .replace(/fill="#(?:5DA9FF|4C8BF5|3978DC|8B5CF6)"/g, () => `fill="${color}"`)
      // mảng tối hơn (gấu áo, đường viền)
      .replace(/fill="#(?:2878D6|6338B8)"/g, () => `fill="${darker(color, 0.12)}"`)
      .replace(/stroke="#(?:1E5FAF|2861B7|6338B8)"/g, () => `stroke="${darker(color, 0.18)}"`)
      // mảng sáng (cổ áo, đường may)
      .replace(/fill="#D9ECFF"/g, () => `fill="${lighter(color, 0.5, -0.3)}"`)
      .replace(/fill="#D8C5FF"/g, () => `fill="${lighter(color, 0.55, -0.3)}"`)
      // kính
      .replace(/stroke="#242B35"/g, () => `stroke="${color}"`)
  );
}

/**
 * Mascot chó.
 * @param {number} size   chiều rộng (chiều cao tự tính theo tỉ lệ 600×700)
 * @param {string} color  id màu trong petCatalog
 * @param {object} outfits { hat, scarf, glasses, shirt, bow, backpack }
 */
export default function MascotDog({ size = 64, className = "", color, outfits = {}, ariaLabel = "Thú cưng" }) {
  const html = useMemo(() => {
    const c = paletteFor(color);
    let svg = svgRaw;

    // 0) Bỏ kích thước cứng 600×700 của file gốc, ép co giãn theo khung bọc.
    //    Nếu giữ, SVG sẽ luôn vẽ đúng 600×700 px và tràn lên cả trang.
    svg = svg
      .replace(/\swidth="600"/, "")
      .replace(/\sheight="700"/, "")
      .replace(/<svg /, '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ');

    // 1) màu lông + các mảng sáng/tối đi kèm
    svg = svg
      .replace(
        /<linearGradient id="fur"[^>]*>[\s\S]*?<\/linearGradient>/,
        `<linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0" stop-color="${lighter(c.body, 0.08)}"/>` +
        `<stop offset="1" stop-color="${darker(c.body, 0.1)}"/>` +
        `</linearGradient>`
      )
      .replace(/fill="#FFF1D7"/g, () => `fill="${c.accent}"`)
      .replace(/fill="#C8752E"/g, () => `fill="${c.dark}"`)
      .replace(/stroke="#B96828"/g, () => `stroke="${c.stroke}"`)
      // mắt / mũi / miệng theo màu để cùng hệ màu với lông
      .replace(/(fill|stroke)="#4A2A20"/g, () => `fill="${contrast(c.body)}"`)
      // gradient áo mặc định, sẽ được tô lại nếu người chơi chọn màu
      .replace(/fill="url\(#shirtBlue\)"/g, () => `fill="${DEFAULT_LAYER_COLOR["accessory-shirt"]}"`);

    // 2) bật/tắt + tô từng lớp phụ kiện
    for (const [slot, layerId] of Object.entries(LAYER_BY_SLOT)) {
      const entry = outfits[slot];
      svg = toggleLayer(svg, layerId, !!entry);
      if (entry) {
        const chosen = typeof entry === "object" && entry.color ? entry.color : null;
        svg = paintAccessory(svg, layerId, chosen || DEFAULT_LAYER_COLOR[layerId]);
      }
    }
    return svg;
  }, [color, outfits?.hat, outfits?.scarf, outfits?.glasses, outfits?.shirt, outfits?.bow, outfits?.backpack]);

  return (
    <span
      className={`inline-block shrink-0 overflow-hidden leading-none ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={{ width: size, height: Math.round(size * (700 / 600)) }}
      // SVG do chính repo cung cấp, không có script và không tham chiếu ngoài
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { PALETTE as MASCOT_PALETTE, LAYER_BY_SLOT };
