/**
 * fonts.js — thư viện font của công cụ Chỉnh sửa PDF (/dashboard/pdf-editor).
 *
 * Bộ DejaVu (giấy phép tự do, kèm LICENSE-DejaVu.txt trong public/pdf-editor/fonts)
 * được đưa kèm web thay vì dùng font hệ thống để:
 *   • màn hình hiển thị GIỐNG hệt chữ trong file PDF xuất ra trên mọi máy;
 *   • font có đủ ký tự tiếng Việt (kiểm tra bằng fontkit: U+1EA0, U+1EC7,
 *     U+01A0, U+0110, U+1EF9 …) nên không bị rơi ký tự lạ khi xuất.
 *
 * Font chỉ tải khi người dùng thật sự chọn (lazy) → không nặng trang lúc mở app.
 */

const FONT_BASE = `${import.meta.env.BASE_URL}pdf-editor/fonts/`;

const SANS = {
  "normal-400": `${FONT_BASE}DejaVuSans.ttf`,
  "normal-700": `${FONT_BASE}DejaVuSans-Bold.ttf`,
  "italic-400": `${FONT_BASE}DejaVuSans-Oblique.ttf`,
  "italic-700": `${FONT_BASE}DejaVuSans-BoldOblique.ttf`,
};
const SERIF = {
  "normal-400": `${FONT_BASE}DejaVuSerif.ttf`,
  "normal-700": `${FONT_BASE}DejaVuSerif-Bold.ttf`,
  "italic-400": `${FONT_BASE}DejaVuSerif-Italic.ttf`,
};
const MONO = {
  "normal-400": `${FONT_BASE}DejaVuSansMono.ttf`,
  "normal-700": `${FONT_BASE}DejaVuSansMono-Bold.ttf`,
};

export const FONT_FAMILIES = [
  { id: "sans", label: "Sans (DejaVu Sans)", cssFamily: "EduPdf Sans", faces: SANS },
  { id: "serif", label: "Serif (DejaVu Serif)", cssFamily: "EduPdf Serif", faces: SERIF },
  { id: "mono", label: "Monospace (DejaVu Mono)", cssFamily: "EduPdf Mono", faces: MONO },
];

/** Kiểu font không có file riêng → lấy kiểu gần nhất (vd: Serif không có Bold-Italic). */
const FALLBACKS = {
  "normal-400": [],
  "normal-700": ["normal-400"],
  "italic-400": ["normal-400"],
  "italic-700": ["italic-400", "normal-700", "normal-400"],
};

export function faceKey(bold, italic) {
  return `${italic ? "italic" : "normal"}-${bold ? 700 : 400}`;
}

export function familyById(id) {
  return FONT_FAMILIES.find((f) => f.id === id) || FONT_FAMILIES[0];
}

/** Trả về file thật sẽ dùng cho cặp (bold, italic) — có thể là kiểu thay thế. */
export function resolveFace(family, bold, italic) {
  const want = faceKey(bold, italic);
  for (const key of [want, ...(FALLBACKS[want] || [])]) {
    const url = family.faces[key];
    if (url) {
      const [style, weight] = key.split("-");
      return { key, url, style, weight: Number(weight) };
    }
  }
  return null;
}

/** false = kiểu font này KHÔNG có (dùng để-disable nút Bold/Italic trong UI). */
export function hasFace(family, bold, italic) {
  return Boolean(family.faces[faceKey(bold, italic)]);
}

/* ── Nạp font vào trình duyệt (khi người dùng chọn) ─────────────────────── */

const injected = new Set();
const loaded = new Set();

function ensureFaceRule(family, face) {
  const token = `${family.id}:${face.key}`;
  if (injected.has(token)) return;
  injected.add(token);
  let styleEl = document.getElementById("edu-pdf-font-faces");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "edu-pdf-font-faces";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent +=
    `@font-face{font-family:"${family.cssFamily}";` +
    `src:url("${face.url}") format("truetype");` +
    `font-weight:${face.weight};font-style:${face.style};font-display:swap;}`;
}

/**
 * Đảm bảo font đã sẵn sàng để hiển thị + đo chữ (measureText).
 * Gọi TRƯỚC khi tạo/sửa đối tượng văn bản để dòng không bị xuống sai chỗ.
 */
export async function ensureFontLoaded(familyId, bold = false, italic = false) {
  const family = familyById(familyId);
  const face = resolveFace(family, bold, italic);
  if (!face) return;
  ensureFaceRule(family, face);
  const token = `${family.id}:${face.key}`;
  if (loaded.has(token)) return;
  try {
    await document.fonts.load(`${face.style} ${face.weight} 16px "${family.cssFamily}"`, "AàÁáĐđ123");
    loaded.add(token);
  } catch {
    /* font hệ thống dự phòng vẫn hiển thị được — không chặn người dùng */
  }
}

/* ── Byte font cho pdf-lib (xuất file) ──────────────────────────────────── */

const byteCache = new Map();

export async function getFontBytes(familyId, bold = false, italic = false) {
  const family = familyById(familyId);
  const face = resolveFace(family, bold, italic);
  if (!face) throw new Error(`Không tìm thấy font cho "${family.label}".`);
  if (byteCache.has(face.url)) return byteCache.get(face.url);
  const res = await fetch(face.url);
  if (!res.ok) throw new Error(`Không tải được font ${family.label}.`);
  const buf = await res.arrayBuffer();
  byteCache.set(face.url, buf);
  return buf;
}
