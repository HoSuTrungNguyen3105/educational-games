// pageConfig.js — Cấu hình TRANG + chữ mặc định của tài liệu Word
// (Giai đoạn 1 nâng cấp Word Editor). Đây là module DÙNG CHUNG duy nhất
// cho cấu hình `page` — model.js (giữ qua JSON ⇄ model), schemas.js
// (validate), modelRender.js (CSS xem trước), wordExporter.js (khổ
// giấy/lề/font mặc định trong DOCX), htmlParser.js (đọc <style
// id="docstudio-page"> ở chế độ Beautiful) và UI tab Cài đặt đều đọc
// từ đây, không nơi nào tự định nghĩa lại.
//
// Hình dạng (mọi field đều TUỲ CHỌN — tài liệu cũ không có `page` thì
// hành vi preview + DOCX giữ nguyên 100% như trước đợt này):
//   page: {
//     size: "A4" | "A5" | "Letter",
//     orientation: "portrait" | "landscape",
//     margins: { top, right, bottom, left },   // đơn vị cm
//     font: "Times New Roman",                  // font mặc định của đoạn
//     fontSize: 13,                             // pt
//     color: "#000000",
//     align: "left" | "center" | "right" | "justify",
//     lineHeight: 1.15,                         // hệ số giãn dòng
//     spacingAfter: 6,                          // pt — khoảng sau đoạn
//     pageNumber: true,                         // footer DOCX có field PAGE
//   }
//
// Quy tắc áp dụng (đặc tả giai đoạn 1 §1): tài liệu có `theme` (mẫu thư
// viện) thì theme giữ font/cỡ/căn/giãn dòng riêng — `page` CHỈ áp các
// thuộc tính chữ khi tài liệu KHÔNG có theme; lề + khổ giấy luôn lấy
// từ `page` nếu có.

export const PAGE_SIZE_KEYS = ["A4", "A5", "Letter"];
export const PAGE_ORIENTATIONS = ["portrait", "landscape"];
export const PAGE_ALIGN_VALUES = ["left", "center", "right", "justify"];

// Khổ giấy theo mm + twips chuẩn (1 inch = 1440 twips; A4 = 11906×16838).
export const PAGE_SIZES = {
  A4: { label: "A4 (210 × 297 mm)", widthMm: 210, heightMm: 297, widthTwips: 11906, heightTwips: 16838 },
  A5: { label: "A5 (148 × 210 mm)", widthMm: 148, heightMm: 210, widthTwips: 8391, heightTwips: 11906 },
  Letter: { label: "Letter (216 × 279 mm)", widthMm: 215.9, heightMm: 279.4, widthTwips: 12240, heightTwips: 15840 },
};

/** Chuẩn hành chính (nút "Đặt theo chuẩn hành chính" ở tab Cài đặt). */
export const ADMIN_PAGE_PRESET = {
  size: "A4",
  orientation: "portrait",
  margins: { top: 2, right: 2, bottom: 2, left: 2 },
  font: "Times New Roman",
  fontSize: 13,
  color: "#000000",
  align: "justify",
  lineHeight: 1.15,
  spacingAfter: 6,
  pageNumber: false,
};

export const WORD_PAGE_DEFAULTS_KEY = "docstudio.wordPageDefaults";

const CM_PER_INCH = 2.54;
const PX_PER_INCH = 96;
export const cmToPx = (cm) => (Number(cm) / CM_PER_INCH) * PX_PER_INCH;
export const cmToTwips = (cm) => Math.round(Number(cm) * 567); // đặc tả: cm × 567
export const cmToMm = (cm) => Number(cm) * 10;

const numIn = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
};
const cleanFont = (v) => {
  if (typeof v !== "string") return undefined;
  const f = v.replace(/["'<>;{}]/g, "").trim().slice(0, 60);
  return f || undefined;
};
const cleanColor = (v) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 40) : undefined);

/**
 * Chuẩn hoá cấu hình trang từ dữ liệu thô (JSON tài liệu / localStorage
 * / CSS đã parse). Field sai kiểu hoặc ngoài miền thì BỎ field đó (tầng
 * model khoan dung — tầng schemas.js mới báo lỗi cho giáo viên sửa).
 * Không còn field hợp lệ nào → undefined (coi như không có cấu hình).
 */
export function normalizePageConfig(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const out = {};
  if (PAGE_SIZE_KEYS.includes(v.size)) out.size = v.size;
  if (PAGE_ORIENTATIONS.includes(v.orientation)) out.orientation = v.orientation;
  if (v.margins && typeof v.margins === "object" && !Array.isArray(v.margins)) {
    const m = {};
    for (const side of ["top", "right", "bottom", "left"]) {
      const n = numIn(v.margins[side], 0, 10);
      if (n !== undefined) m[side] = n;
    }
    if (Object.keys(m).length) out.margins = m;
  }
  const font = cleanFont(v.font);
  if (font) out.font = font;
  const fontSize = numIn(v.fontSize, 1, 200);
  if (fontSize !== undefined) out.fontSize = fontSize;
  const color = cleanColor(v.color);
  if (color) out.color = color;
  if (PAGE_ALIGN_VALUES.includes(v.align)) out.align = v.align;
  const lineHeight = numIn(v.lineHeight, 0.5, 4);
  if (lineHeight !== undefined) out.lineHeight = lineHeight;
  const spacingAfter = numIn(v.spacingAfter, 0, 200);
  if (spacingAfter !== undefined) out.spacingAfter = spacingAfter;
  if (typeof v.pageNumber === "boolean") out.pageNumber = v.pageNumber;
  return Object.keys(out).length ? out : undefined;
}

/** Lề hiệu dụng (cm) — field thiếu thì dùng lề mặc định cũ 2,54 cm (1 inch). */
export function pageMarginsCm(page) {
  const m = page?.margins || {};
  const one = (side) => (Number.isFinite(Number(m[side])) ? Number(m[side]) : 2.54);
  return { top: one("top"), right: one("right"), bottom: one("bottom"), left: one("left") };
}

/** Khổ giấy hiệu dụng (đã tính hướng) theo đơn vị yêu cầu: "mm" | "px" | "twips". */
export function pageDimensions(page, unit = "px") {
  const size = PAGE_SIZES[page?.size] || PAGE_SIZES.A4;
  const landscape = page?.orientation === "landscape";
  let w; let h;
  if (unit === "twips") { w = size.widthTwips; h = size.heightTwips; }
  else if (unit === "mm") { w = size.widthMm; h = size.heightMm; }
  else { w = Math.round((size.widthMm / 25.4) * PX_PER_INCH); h = Math.round((size.heightMm / 25.4) * PX_PER_INCH); }
  return landscape ? { width: h, height: w } : { width: w, height: h };
}

const SERIF_FONTS = ["times new roman", "georgia", "times", "book antiqua", "palatino linotype"];
const MONO_FONTS = ["courier new", "consolas", "monospace"];
function fontStack(font) {
  const f = String(font || "Arial");
  const lower = f.toLowerCase();
  const generic = MONO_FONTS.some((k) => lower.includes(k)) ? "monospace"
    : SERIF_FONTS.some((k) => lower.includes(k)) ? "serif" : "sans-serif";
  return `'${f.replace(/'/g, "")}', ${generic}`;
}

/**
 * CSS cho khung `.doc-page` của preview từ cấu hình trang. Trả "" khi
 * không có cấu hình (preview giữ nguyên CSS mặc định cũ). `hasTheme`:
 * mẫu có theme thì chỉ áp khổ giấy + lề (theme giữ chữ riêng).
 * Kèm rule @page + @media print để In/PDF theo đúng lề đã cấu hình
 * (khối CSS này được chèn SAU WORD_PREVIEW_CSS nên thắng khi in).
 */
export function pageCssText(page, { hasTheme = false } = {}) {
  const cfg = normalizePageConfig(page);
  if (!cfg) return "";
  const { width, height } = pageDimensions(cfg, "px");
  const m = pageMarginsCm(cfg);
  const decls = [
    `width: ${width}px`,
    `min-height: ${height}px`,
    `padding: ${cmToPx(m.top)}px ${cmToPx(m.right)}px ${cmToPx(m.bottom)}px ${cmToPx(m.left)}px`,
  ];
  let paraDecls = "";
  if (!hasTheme) {
    if (cfg.font) decls.push(`font-family: ${fontStack(cfg.font)}`);
    if (cfg.fontSize) decls.push(`font-size: ${cfg.fontSize}pt`);
    if (cfg.color) decls.push(`color: ${cfg.color}`);
    if (cfg.align) decls.push(`text-align: ${cfg.align}`);
    if (cfg.lineHeight) decls.push(`line-height: ${cfg.lineHeight}`);
    if (cfg.spacingAfter !== undefined) paraDecls = `\n  .doc-page p, .doc-page li { margin-bottom: ${cfg.spacingAfter}pt; }`;
  }
  const sizeName = cfg.size === "Letter" ? "letter" : (cfg.size || "A4");
  return `
  .doc-page { ${decls.join("; ")}; }${paraDecls}
  @page { size: ${sizeName} ${cfg.orientation || "portrait"}; margin: ${cmToMm(m.top)}mm ${cmToMm(m.right)}mm ${cmToMm(m.bottom)}mm ${cmToMm(m.left)}mm; }
  @media print { .doc-page { width: auto; min-height: 0; padding: 0; } }
`;
}

// ── Chế độ Beautiful: cấu hình sống trong <style id="docstudio-page"> ──
// Khối style chứa (1) một comment JSON giữ cấu hình CHÍNH XÁC để đọc
// lại không mất mát, (2) rule .doc-page sinh từ cấu hình để preview
// HTML hiển thị đúng ngay cả khi mở file HTML ở nơi khác. scanCss của
// htmlParser tự bỏ qua comment nên khối này không sinh cảnh báo CSS.
const PAGE_STYLE_ID = "docstudio-page";
const pageComment = (cfg) => `/* docstudio-page: ${JSON.stringify(cfg)} */`;

export function pageStyleBlockHtml(page) {
  const cfg = normalizePageConfig(page);
  if (!cfg) return "";
  // Ở Beautiful, khối style do giáo viên chủ động đặt qua Cài đặt nên áp
  // đầy đủ cả phần chữ (hasTheme = false) — nó nằm trong mã nguồn của
  // chính họ, thấy được và xoá được.
  return `<style id="${PAGE_STYLE_ID}">\n${pageComment(cfg)}\n${pageCssText(cfg)}\n</style>`;
}

const PAGE_STYLE_RE = /<style[^>]*id=["']docstudio-page["'][^>]*>[\s\S]*?<\/style>/i;

/**
 * Ghi cấu hình trang vào mã nguồn HTML (Beautiful): thay khối style cũ
 * nếu có, chưa có thì chèn vào <head> (hoặc đầu tài liệu). page rỗng →
 * gỡ khối style khỏi mã nguồn.
 */
export function applyPageToHtmlSource(source, page) {
  const src = String(source || "");
  const cfg = normalizePageConfig(page);
  if (!cfg) return src.replace(PAGE_STYLE_RE, "");
  const block = pageStyleBlockHtml(cfg);
  if (PAGE_STYLE_RE.test(src)) return src.replace(PAGE_STYLE_RE, block);
  if (/<\/head>/i.test(src)) return src.replace(/<\/head>/i, `${block}\n</head>`);
  if (/<head[^>]*>/i.test(src)) return src.replace(/<head[^>]*>/i, (m) => `${m}\n${block}`);
  return `${block}\n${src}`;
}

function lengthToCm(value) {
  const m = /^(-?[\d.]+)\s*(px|pt|mm|cm)?$/i.exec(String(value || "").trim());
  if (!m) return undefined;
  const n = Number(m[1]);
  const unit = (m[2] || "px").toLowerCase();
  if (unit === "cm") return n;
  if (unit === "mm") return n / 10;
  if (unit === "pt") return (n / 72) * CM_PER_INCH;
  return (n / PX_PER_INCH) * CM_PER_INCH;
}

/**
 * Đọc cấu hình trang từ NỘI DUNG của khối <style id="docstudio-page">
 * (htmlParser trích ra). Ưu tiên comment JSON (chính xác tuyệt đối);
 * thiếu comment thì suy từ rule `.doc-page { … }` (padding → lề, font,
 * cỡ, màu, căn, giãn dòng) để vẫn đọc được khối style viết tay.
 */
export function parsePageStyleCss(cssText) {
  const text = String(cssText || "");
  const comment = /docstudio-page\s*:\s*(\{[\s\S]*?\})\s*\*\//.exec(text);
  if (comment) {
    try {
      const cfg = normalizePageConfig(JSON.parse(comment[1]));
      if (cfg) return cfg;
    } catch { /* comment hỏng — rơi xuống cách đọc CSS bên dưới */ }
  }
  const rule = /\.doc-page\s*\{([^}]*)\}/.exec(text);
  if (!rule) return undefined;
  const decls = {};
  for (const part of rule[1].split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    decls[part.slice(0, i).trim().toLowerCase()] = part.slice(i + 1).trim();
  }
  const out = {};
  if (decls.padding) {
    const parts = decls.padding.split(/\s+/).map(lengthToCm);
    if (parts.every((n) => Number.isFinite(n))) {
      const [a, b, c, d] = parts;
      const margins = parts.length === 1 ? { top: a, right: a, bottom: a, left: a }
        : parts.length === 2 ? { top: a, right: b, bottom: a, left: b }
          : parts.length === 3 ? { top: a, right: b, bottom: c, left: b }
            : { top: a, right: b, bottom: c, left: d };
      out.margins = Object.fromEntries(
        Object.entries(margins).map(([k, v]) => [k, Math.round(v * 100) / 100]));
    }
  }
  if (decls["font-family"]) {
    const fam = decls["font-family"].split(",")[0].trim().replace(/^["']+|["']+$/g, "");
    if (fam) out.font = fam;
  }
  if (decls["font-size"]) {
    const cm = lengthToCm(decls["font-size"]);
    if (cm) out.fontSize = Math.round(((cm / CM_PER_INCH) * 72) * 10) / 10;
  }
  if (decls.color) out.color = decls.color;
  if (PAGE_ALIGN_VALUES.includes(decls["text-align"])) out.align = decls["text-align"];
  const lh = Number(decls["line-height"]);
  if (Number.isFinite(lh) && lh > 0) out.lineHeight = lh;
  return normalizePageConfig(out);
}

// ── Mặc định cá nhân của giáo viên (localStorage) ─────────────────────
export function loadWordPageDefaults() {
  try {
    const raw = localStorage.getItem(WORD_PAGE_DEFAULTS_KEY);
    return raw ? normalizePageConfig(JSON.parse(raw)) : undefined;
  } catch { return undefined; }
}

export function saveWordPageDefaults(cfg) {
  const clean = normalizePageConfig(cfg);
  try {
    if (clean) localStorage.setItem(WORD_PAGE_DEFAULTS_KEY, JSON.stringify(clean));
    else localStorage.removeItem(WORD_PAGE_DEFAULTS_KEY);
  } catch { /* trình duyệt chặn — bỏ qua */ }
  return clean;
}
