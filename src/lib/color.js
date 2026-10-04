// lib/color.js — thao tác màu tối giản, không phụ thuộc thư viện ngoài.

/** "#F4AF66" | "F4AF66" | "#f4a" → { r, g, b } (0-255). Giá trị sai → null. */
export function hexToRgb(hex) {
  if (typeof hex !== "string") return null;
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }) {
  const c = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function rgbToHsl({ r, g, b }) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6;
    else if (max === G) h = ((B - R) / d + 2) / 6;
    else h = ((R - G) / d + 4) / 6;
  }
  return { h: h * 360, s, l };
}

export function hslToRgb({ h, s, l }) {
  const H = ((h % 360) + 360) % 360 / 360;
  if (s === 0) { const v = l * 255; return { r: v, g: v, b: v }; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return { r: hue(H + 1 / 3) * 255, g: hue(H) * 255, b: hue(H - 1 / 3) * 255 };
}

/**
 * Sáng/tối một màu.
 * @param {string} hex
 * @param {number} amt   -1 (đen tuyệt đối) .. +1 (trắng tuyệt đối)
 * @param {number} sat   -1..1, điều chỉnh độ bão hoà (mặc định giữ nguyên)
 */
export function shade(hex, amt, sat) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  if (sat != null) hsl.s = Math.max(0, Math.min(1, hsl.s + sat));
  hsl.l = Math.max(0, Math.min(1, hsl.l + amt));
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Màu tối hơn.
 * @param amt  cỡ tối (luôn được lấy trị tuyệt đối) — nên gọi darker(c, 0.2) là
 *             tối đi 0.2, không phụ thuộc dấu truyền vào.
 */
export const darker = (hex, amt = 0.16, sat = 0.04) => shade(hex, -Math.abs(amt), sat);

/** Màu sáng hơn (highlight). */
export const lighter = (hex, amt = 0.14, sat = -0.02) => shade(hex, Math.abs(amt), sat);

/**
 * Màu tương phản mạnh — dùng cho mắt, mũi.
 * Luôn ép độ sáng xuống ≤ 0.2, nên màu trắng cũng ra màu tối
 * (trừ đi cố định sẽ không đủ tối khi bản gốc quá sáng).
 */
export function contrast(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  hsl.s = Math.max(hsl.s, 0.25);
  hsl.l = Math.min(hsl.l, 0.2);
  return rgbToHex(hslToRgb(hsl));
}
