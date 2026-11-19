/**
 * model.js — mô hình dữ liệu + hình học của công cụ Chỉnh sửa PDF.
 *
 * Hệ toạ độ dùng chung cho màn hình lẫn xuất file:
 *   • Tọa độ đối tượng: pt, gốc TRÊN-TRÁI, y tăng dần — theo trang như NGƯỜI
 *     DÙNG THẤY (đã gồm góc xoay). Canvas render và lớp phủ dùng chung số này.
 *   • Khi xuất pdf-lib phải đổi sang toạ độ PDF gốc (góc DƯỚI-TRÁI, y tăng
 *     dần, trang KHÔNG xoay) qua displayToPdf / pdfToDisplay.
 *
 * Đối tượng luôn nằm NGANG trên màn hình dù trang có xoay (văn bản thêm vào
 * luôn đọc được) — khi xoay trang chỉ vị trí neo đổi theo nội dung.
 */

/* ── Hằng số metric font DejaVu (hhea ascent/descent) ───────────────────── */
export const FONT_ASCENT = 0.928;
export const FONT_DESCENT = 0.236;
export const DEFAULT_LINE_HEIGHT = 1.25;

/* ── Toạ độ ─────────────────────────────────────────────────────────────── */

/** Điểm không gian màn hình → không gian PDF gốc (chưa xoay). */
export function displayToPdf(x, y, { rot, W, H }) {
  switch (((rot % 360) + 360) % 360) {
    case 90: return { x: y, y: x };
    case 180: return { x: W - x, y };
    case 270: return { x: W - y, y: H - x };
    default: return { x, y: H - y };
  }
}

/** Không gian PDF gốc → không gian màn hình (đã gồm góc xoay). */
export function pdfToDisplay(x, y, { rot, W, H }) {
  switch (((rot % 360) + 360) % 360) {
    case 90: return { x: y, y: x };
    case 180: return { x: W - x, y };
    case 270: return { x: H - y, y: W - x };
    default: return { x, y: H - y };
  }
}

/** Kích thước trang khi hiển thị theo góc xoay. */
export function displaySize(page, rot) {
  const swap = (((rot % 360) + 360) % 360) % 180 !== 0;
  return swap
    ? { w: page.height, h: page.width }
    : { w: page.width, h: page.height };
}

/* ── Mã định danh + factory đối tượng ───────────────────────────────────── */

let seq = 0;
export function nextId() {
  seq += 1;
  return `p${Date.now().toString(36)}${seq.toString(36)}`;
}

export const DEFAULT_TEXT = {
  fontSize: 14,
  color: "#1d2327",
  align: "left",
  lineHeight: DEFAULT_LINE_HEIGHT,
};

export function createText(page, x, y, extra = {}) {
  return {
    id: nextId(),
    page,
    type: "text",
    x,
    y,
    w: 220,
    h: DEFAULT_TEXT.fontSize * DEFAULT_TEXT.lineHeight,
    text: "",
    fontFamily: "sans",
    bold: false,
    italic: false,
    ...DEFAULT_TEXT,
    ...extra,
  };
}

export function createImage(page, x, y, src, w, h) {
  return { id: nextId(), page, type: "image", x, y, w, h, src, opacity: 1 };
}

export function createRect(page, x, y, w, h, extra = {}) {
  return {
    id: nextId(),
    page,
    type: "rect",
    x,
    y,
    w,
    h,
    fill: null,
    stroke: "#1d2327",
    strokeWidth: 2,
    fillOpacity: 1,
    ...extra,
  };
}

export function createRedact(page, x, y, w, h, extra = {}) {
  return { id: nextId(), page, type: "redact", x, y, w, h, fill: "#ffffff", ...extra };
}

export function createLine(page, x, y, x2, y2, extra = {}) {
  return {
    id: nextId(),
    page,
    type: "line",
    x,
    y,
    x2,
    y2,
    stroke: "#1d2327",
    strokeWidth: 2,
    opacity: 1,
    ...extra,
  };
}

/* ── Đo & xuống dòng ────────────────────────────────────────────────────── */

let measureCtx = null;
function getMeasureCtx() {
  if (!measureCtx) {
    const c = document.createElement("canvas");
    c.width = 8;
    c.height = 8;
    measureCtx = c.getContext("2d");
  }
  return measureCtx;
}

/** Hàm đo chuỗi theo font của đối tượng (đơn vị px = pt vì fontSize đặt vậy). */
export function textMeasure(familyCss, fontSize, bold, italic) {
  const ctx = getMeasureCtx();
  const font = `${italic ? "italic " : ""}${bold ? "bold " : ""}${fontSize}px "${familyCss}"`;
  // ctx dùng CHUNG cho mọi đối tượng — phải đặt lại font mỗi lần đo, nếu không
  // lời gọi đo của đối tượng khác sẽ xen vào và làm gãy dòng sai.
  return (s) => {
    ctx.font = font;
    return ctx.measureText(s || "").width;
  };
}

function breakLongWord(word, limit, measure, out) {
  let rest = word;
  while (measure(rest) > limit && rest.length > 1) {
    let cut = rest.length - 1;
    while (cut > 1 && measure(rest.slice(0, cut)) > limit) cut -= 1;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  return rest;
}

/**
 * Xuống dòng theo bề rộng cho phép — dùng chung cho HIỂN THỊ và XUẤT FILE
 * nên hai nơi luôn giống hệt nhau (không lệch dòng).
 */
export function wrapText(text, maxWidth, measure) {
  const out = [];
  const limit = Math.max(8, maxWidth);
  for (const para of String(text ?? "").split("\n")) {
    if (!para) {
      out.push("");
      continue;
    }
    const tokens = para.match(/\S+\s*/g) || [para];
    let line = "";
    for (const token of tokens) {
      const trimmed = token.replace(/\s+$/, "");
      if (line && measure(`${line}${trimmed}`) > limit) {
        out.push(line.replace(/\s+$/, ""));
        line = breakLongWord(trimmed.replace(/^\s+/, ""), limit, measure, out);
      } else if (!line && measure(trimmed) > limit) {
        line = breakLongWord(trimmed, limit, measure, out);
      } else {
        line += token;
      }
    }
    out.push(line.replace(/\s+$/, ""));
  }
  return out.length ? out : [""];
}

/** Bố cục text: dòng đã gãy + chiều cao khung (cập nhật vào obj.h). */
export function withTextMetrics(obj, measure) {
  const lines = wrapText(obj.text, obj.w, measure);
  const lh = obj.fontSize * (obj.lineHeight || DEFAULT_LINE_HEIGHT);
  return { ...obj, h: Math.max(lh, lines.length * lh), lines, lh };
}

/** Baseline dòng i (toạ độ màn hình, y xuống dưới) — xuất file dùng. */
export function baselineAt(obj, index, lh) {
  const fs = obj.fontSize;
  const halfLeading = (lh - fs * (FONT_ASCENT + FONT_DESCENT)) / 2;
  return obj.y + index * lh + halfLeading + fs * FONT_ASCENT;
}

/* ── Hình học đối tượng ─────────────────────────────────────────────────── */

export function objectBBox(obj) {
  if (obj.type === "line") {
    const x = Math.min(obj.x, obj.x2);
    const y = Math.min(obj.y, obj.y2);
    return { x, y, w: Math.abs(obj.x2 - obj.x), h: Math.abs(obj.y2 - obj.y) };
  }
  return { x: obj.x, y: obj.y, w: obj.w, h: obj.h };
}

export function moveObject(obj, dx, dy) {
  if (obj.type === "line") {
    return { ...obj, x: obj.x + dx, y: obj.y + dy, x2: obj.x2 + dx, y2: obj.y2 + dy };
  }
  return { ...obj, x: obj.x + dx, y: obj.y + dy };
}

const MIN_SIZE = 8;

/**
 * Thay đổi kích thước theo handle:
 *   • văn bản: chỉ đổi bề rộng (chiều cao tự theo nội dung);
 *   • line: kéo 2 đầu mút;
 *   • ảnh: góc giữ tỷ lệ, cạnh kéo tự do;
 *   • rect/redact: kéo tự do.
 */
export function resizeObject(obj, handle, dx, dy) {
  if (obj.type === "line") {
    if (handle === "p1") return { ...obj, x: obj.x + dx, y: obj.y + dy };
    if (handle === "p2") return { ...obj, x2: obj.x2 + dx, y2: obj.y2 + dy };
    return obj;
  }

  if (obj.type === "text") {
    let w = obj.w;
    if (handle.includes("e")) w = obj.w + dx;
    if (handle.includes("w")) w = obj.w - dx;
    return { ...obj, w: Math.max(24, w) };
  }

  let { x, y, w, h } = obj;
  const east = handle.includes("e");
  const west = handle.includes("w");
  const south = handle.includes("s");
  const north = handle.includes("n");

  if (obj.type === "image" && handle.length === 2) {
    const ratio = obj.w / Math.max(1, obj.h);
    let nw = east ? obj.w + dx : obj.w - dx;
    nw = Math.max(MIN_SIZE, nw);
    let nh = nw / ratio;
    if (nh < MIN_SIZE) {
      nh = MIN_SIZE;
      nw = nh * ratio;
    }
    const nx = west ? obj.x + (obj.w - nw) : obj.x;
    const ny = north ? obj.y + (obj.h - nh) : obj.y;
    return { ...obj, x: nx, y: ny, w: nw, h: nh };
  }

  if (east) w = obj.w + dx;
  if (west) {
    x = obj.x + dx;
    w = obj.w - dx;
  }
  if (south) h = obj.h + dy;
  if (north) {
    y = obj.y + dy;
    h = obj.h - dy;
  }
  if (w < MIN_SIZE) {
    if (west) x = obj.x + obj.w - MIN_SIZE;
    w = MIN_SIZE;
  }
  if (h < MIN_SIZE) {
    if (north) y = obj.y + obj.h - MIN_SIZE;
    h = MIN_SIZE;
  }
  return { ...obj, x, y, w, h };
}

/**
 * Đổi tọa độ neo của đối tượng khi trang đổi góc xoay — đối tượng neo theo
 * NỘI DUNG (cùng chỗ trên trang giấy) nhưng vẫn nằm ngang trên màn hình.
 */
export function rotateObject(obj, fromRot, toRot, W, H) {
  const box = objectBBox(obj);
  const center = displayToPdf(box.x + box.w / 2, box.y + box.h / 2, { rot: fromRot, W, H });
  const moved = pdfToDisplay(center.x, center.y, { rot: toRot, W, H });
  const nx = moved.x - box.w / 2;
  const ny = moved.y - box.h / 2;
  if (obj.type === "line") {
    const ox = nx - box.x;
    const oy = ny - box.y;
    return { ...obj, x: obj.x + ox, y: obj.y + oy, x2: obj.x2 + ox, y2: obj.y2 + oy };
  }
  return { ...obj, x: nx, y: ny };
}

/** Hộp chữ gốc (toạ độ PDF gốc) → hộp trên màn hình (đã gồm góc xoay). */
export function textBoxToDisplay(box, { rot, W, H }) {
  const corners = [
    pdfToDisplay(box.x0, box.y0, { rot, W, H }),
    pdfToDisplay(box.x1, box.y1, { rot, W, H }),
    pdfToDisplay(box.x0, box.y1, { rot, W, H }),
    pdfToDisplay(box.x1, box.y0, { rot, W, H }),
  ];
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  const pad = 1;
  return {
    x: Math.min(...xs) - pad,
    y: Math.min(...ys) - pad,
    w: Math.max(2, Math.max(...xs) - Math.min(...xs) + pad * 2),
    h: Math.max(2, Math.max(...ys) - Math.min(...ys) + pad * 2),
  };
}

/** Chuyển "#rrggbb" → {r,g,b} (0..1) cho pdf-lib. */
export function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return { r: 0, g: 0, b: 0 };
  const n = parseInt(m[1], 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
