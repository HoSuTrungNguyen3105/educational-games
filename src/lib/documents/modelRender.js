// modelRender.js — Render MÔ HÌNH TRUNG GIAN thành HTML.
//
// Dùng cho: (1) preview Word ở chế độ JSON (render blocks → đặt vào trang
// A4), (2) chuyển chế độ JSON → HTML (sinh mã nguồn HTML cho giáo viên
// tiếp tục sửa), (3) nền tảng cho đợt 2 (HTML slides → pptx).
// Mọi chuỗi từ người dùng đều qua escapeHtml trước khi chèn vào HTML.

export const escapeHtml = (s) => String(s ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

function runsHtml(block) {
  if (Array.isArray(block.runs) && block.runs.length) {
    return block.runs.map((r) => {
      let t = escapeHtml(r.text);
      if (r.strike) t = `<s>${t}</s>`;
      if (r.underline) t = `<u>${t}</u>`;
      if (r.italic) t = `<em>${t}</em>`;
      if (r.bold) t = `<strong>${t}</strong>`;
      const styles = [];
      if (r.color) styles.push(`color: ${r.color}`);
      if (r.highlight) styles.push(`background-color: ${r.highlight}`);
      if (styles.length) t = `<span style="${escapeHtml(styles.join("; "))}">${t}</span>`;
      return t;
    }).join("");
  }
  return escapeHtml(block.text || "");
}

function blockStyleAttr(block) {
  const parts = [];
  if (block.color) parts.push(`color: ${block.color}`);
  if (block.align) parts.push(`text-align: ${block.align}`);
  if (block.font) parts.push(`font-family: '${String(block.font).replace(/'/g, "")}'`);
  if (block.fontSize) parts.push(`font-size: ${Number(block.fontSize)}pt`);
  if (block.lineHeight) parts.push(`line-height: ${Number(block.lineHeight)}`);
  if (block.spacingAfter !== undefined && block.spacingAfter !== null) parts.push(`margin-bottom: ${Number(block.spacingAfter)}pt`);
  return parts.length ? ` style="${escapeHtml(parts.join("; "))}"` : "";
}

/** Chuẩn hoá bề rộng cột (%) về tổng 100 để colgroup/DOCX dùng chung. */
export function normalizedColPercents(colWidths, colCount) {
  if (!colCount) return [];
  const raw = Array.isArray(colWidths) ? colWidths.map(Number) : [];
  const valid = raw.length === colCount && raw.every((n) => Number.isFinite(n) && n > 0);
  const base = valid ? raw : Array(colCount).fill(1);
  const sum = base.reduce((a, b) => a + b, 0) || 1;
  return base.map((n) => Math.round((n / sum) * 1000) / 10);
}

/**
 * Render một khối Word. `opts.highlightRows` (mảng index hàng) đánh dấu
 * các hàng bảng khớp tìm kiếm bằng class ds-row-hl — chỉ là hiển thị
 * trong preview, KHÔNG ghi vào dữ liệu tài liệu.
 */
export function wordBlockToHtml(block, opts = {}) {
  switch (block.type) {
    case "heading": {
      const lv = [1, 2, 3].includes(block.level) ? block.level : 1;
      return `<h${lv}${blockStyleAttr(block)}>${runsHtml(block)}</h${lv}>`;
    }
    case "paragraph":
      return `<p${blockStyleAttr(block)}>${runsHtml(block)}</p>`;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      const items = (block.items || []).map((it) => `<li>${escapeHtml(it)}</li>`).join("\n");
      const styleParts = [];
      if (block.align) styleParts.push(`text-align: ${block.align}`);
      if (block.lineHeight) styleParts.push(`line-height: ${Number(block.lineHeight)}`);
      if (block.spacingAfter !== undefined && block.spacingAfter !== null) styleParts.push(`margin-bottom: ${Number(block.spacingAfter)}pt`);
      const style = styleParts.length ? ` style="${escapeHtml(styleParts.join("; "))}"` : "";
      return `<${tag}${style}>\n${items}\n</${tag}>`;
    }
    case "table": {
      const allRows = block.rows || [];
      const colCount = Math.max(0, ...allRows.map((r) => r.length));
      const percents = normalizedColPercents(block.colWidths, colCount);
      const colgroup = colCount
        ? `<colgroup>${percents.map((p) => `<col style="width:${p}%">`).join("")}</colgroup>`
        : "";
      const hl = new Set(opts.highlightRows || []);
      const rowHtml = (row, ri) => {
        const cells = row.map((c) => ri === 0
          ? `<th>${escapeHtml(c)}</th>`
          : `<td>${escapeHtml(c)}</td>`).join("");
        return `<tr${hl.has(ri) ? ' class="ds-row-hl"' : ""}>${cells}</tr>`;
      };
      // Hàng đầu bọc <thead> để khi in, tiêu đề bảng lặp lại ở mỗi trang.
      const head = allRows.length ? `<thead>${rowHtml(allRows[0], 0)}</thead>` : "";
      const body = allRows.slice(1).map((row, i) => rowHtml(row, i + 1)).join("\n");
      return `<table>\n${colgroup}\n${head}\n<tbody>\n${body}\n</tbody>\n</table>`;
    }
    case "image":
      return `<p><img src="${escapeHtml(block.src || "")}" alt="${escapeHtml(block.alt || "")}" style="max-width: 100%"></p>`;
    case "pageBreak":
      return `<hr class="page-break">`;
    case "signature": {
      const role = escapeHtml(block.role || "");
      const name = escapeHtml(block.name || "");
      return `<div class="doc-signature">${role ? `<p class="doc-signature-role">${role}</p>` : ""}<p class="doc-signature-note">(Ký và ghi rõ họ tên)</p><p class="doc-signature-space"></p>${name ? `<p class="doc-signature-name">${name}</p>` : ""}</div>`;
    }
    default:
      return `<p>${escapeHtml(block.text || "")}</p>`;
  }
}

/**
 * Toàn bộ thân HTML của tài liệu Word từ model.
 * `opts.highlight` = { blockIndex, rows } — highlight hàng bảng khớp
 * tìm kiếm ở đúng một khối bảng (xem wordFindReplace/tableOps).
 */
export function renderWordBodyHtml(model, opts = {}) {
  return (model.blocks || []).map((b, i) => wordBlockToHtml(b, {
    highlightRows: opts.highlight && opts.highlight.blockIndex === i ? opts.highlight.rows : null,
  })).join("\n");
}

/**
 * Dòng chân "Số trang" cho preview khi cấu hình trang bật đánh số trang.
 * Preview vẫn là MỘT tờ giấy dài chưa chia trang A4 nên dòng này chỉ
 * đánh dấu vị trí chân trang tương đối — số trang THẬT (field PAGE)
 * chỉ có trong file DOCX xuất ra. Không giả đánh số từng tờ.
 */
export const PAGE_NUMBER_FOOTER_HTML = `<div class="doc-page-number" title="Bản xem trước là một tờ giấy dài, chưa chia thành từng trang A4 — số trang thật sẽ tự đánh trong file DOCX khi xuất.">Số trang</div>`;

export function slideToHtmlSection(slide) {
  const title = slide.title ? `<h2>${escapeHtml(slide.title)}</h2>` : "";
  switch (slide.type) {
    case "title":
      return `<section class="slide slide--title">\n<h1>${escapeHtml(slide.title || "")}</h1>${slide.subtitle ? `\n<p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>` : ""}\n</section>`;
    case "content":
    case "summary": {
      const items = (slide.content || []).map((c) => `<li>${escapeHtml(c)}</li>`).join("\n");
      return `<section class="slide slide--${slide.type}">\n${title}\n<ul>\n${items}\n</ul>\n</section>`;
    }
    case "image":
      return `<section class="slide slide--image">\n${title}\n<p><img src="${escapeHtml(slide.src || "")}" alt="${escapeHtml(slide.alt || "")}" style="max-width: 100%"></p>${slide.caption ? `\n<p class="slide-caption">${escapeHtml(slide.caption)}</p>` : ""}\n</section>`;
    case "two-column": {
      const col = (items) => `<ul>${(items || []).map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`;
      return `<section class="slide slide--two-column">\n${title}\n<div class="slide-columns"><div>${col(slide.left)}</div><div>${col(slide.right)}</div></div>\n</section>`;
    }
    case "table": {
      const rows = (slide.rows || []).map((row, ri) => {
        const cells = row.map((c) => ri === 0 ? `<th>${escapeHtml(c)}</th>` : `<td>${escapeHtml(c)}</td>`).join("");
        return `<tr>${cells}</tr>`;
      }).join("\n");
      return `<section class="slide slide--table">\n${title}\n<table>\n${rows}\n</table>\n</section>`;
    }
    default:
      return `<section class="slide">\n${title}\n</section>`;
  }
}

/** Toàn bộ thân HTML của bài PowerPoint từ model (mỗi slide một <section>). */
export function renderPresentationBodyHtml(model) {
  return (model.slides || []).map(slideToHtmlSection).join("\n");
}

export function renderModelBodyHtml(model) {
  return model.kind === "presentation" ? renderPresentationBodyHtml(model) : renderWordBodyHtml(model);
}

// ── Khung preview Word khổ A4 ───────────────────────────────────────────
// Trang giấy 794px (≈210mm ở 96dpi), lề 72px (≈19mm), nền xám của app ở
// ngoài trang giấy. Nội dung chảy tự nhiên trong MỘT tờ giấy có chiều cao
// tối thiểu A4 (1123px) — cuộn dọc khi dài hơn, đúng "xem nhiều trang"
// ở mức tài liệu web (không giả lập cắt trang cứng như Word desktop).
export const WORD_PREVIEW_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  @page { size: A4; margin: 18mm; }
  body { background: #d9d9d9; font-family: Arial, Helvetica, sans-serif; }
  .doc-page { background: #ffffff; width: 794px; min-height: 1123px; margin: 0 auto;
    padding: 64px 60px; color: #1f2937; box-shadow: 0 1px 4px rgba(0,0,0,.18);
    font-size: 13.5px; line-height: 1.65; overflow-wrap: break-word; }
  .doc-page img { max-width: 100%; }
  .doc-page table { border-collapse: collapse; width: 100%; margin: 10px 0 14px; }
  .doc-page th, .doc-page td { border: 1px solid #b9b9b9; padding: 6px 8px; text-align: left; vertical-align: top; }
  .doc-page th { background: #f3f4f6; font-weight: 700; }
  .doc-page h1 { font-size: 24px; line-height: 1.3; margin: 0 0 8px; }
  .doc-page h2 { font-size: 15px; line-height: 1.4; margin: 20px 0 8px; }
  .doc-page h3 { font-size: 14px; margin: 14px 0 5px; }
  .doc-page p { margin: 0 0 8px; }
  .doc-page ul, .doc-page ol { margin: 8px 0 12px; padding-left: 22px; }
  .doc-page li { margin: 3px 0; }
  .doc-page mark { color: inherit; padding: 0 1px; border-radius: 2px; }
  .doc-page hr.page-break { border: 0; border-top: 1px solid #b9b9b9; margin: 24px 0; }
  .doc-page tr.ds-row-hl td, .doc-page tr.ds-row-hl th { background: #fef9c3; }
  .doc-page .doc-signature { text-align: right; margin: 20px 0 10px; }
  .doc-page .doc-signature p { margin: 0; }
  .doc-page .doc-signature .doc-signature-note { font-style: italic; font-size: 0.92em; color: #4b5563; }
  .doc-page .doc-signature .doc-signature-space { height: 56px; }
  .doc-page .doc-signature .doc-signature-name { font-weight: 700; }
  .doc-page .doc-page-number { margin-top: 28px; padding-top: 8px; border-top: 1px solid #d1d5db;
    text-align: center; color: #6b7280; font-size: 11px; }
  /* In / lưu PDF qua hộp thoại in của trình duyệt (trang cha gọi
     contentWindow.print() lên iframe này): bỏ nền xám + bóng đổ để bản
     in là trang giấy sạch; khổ giấy lấy theo @page A4 ở trên (lề 18mm
     thay cho padding mô phỏng trang giấy trên màn hình nên .doc-page
     phải về padding 0, bề rộng tự chảy theo vùng in). Quy tắc ngắt
     trang: bảng dài được phép chảy qua trang nhưng không cắt ngang
     một hàng, hàng tiêu đề (thead) lặp lại ở mỗi trang, tiêu đề không
     bị bỏ lại cuối trang, ảnh/khung trích dẫn không bị xẻ đôi. */
  @media print {
    html, body { background: #fff; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .doc-page { box-shadow: none; margin: 0; width: auto; min-height: 0; padding: 0;
      -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .doc-page table { break-inside: auto; }
    .doc-page thead { display: table-header-group; }
    .doc-page tfoot { display: table-footer-group; }
    .doc-page tr { break-inside: avoid; }
    .doc-page hr.page-break { break-after: page; border: 0; margin: 0; }
    .doc-page .doc-page-number { display: none; }
    .doc-page h1, .doc-page h2, .doc-page h3 { break-after: avoid; }
    .doc-page img, .doc-page blockquote, .doc-page figure { break-inside: avoid; }
    .doc-page p, .doc-page li { orphans: 3; widows: 3; }
  }
`;

/** Dựng tài liệu HTML hoàn chỉnh cho iframe sandbox của preview Word. */
export function buildWordPreviewSrcDoc({ bodyHtml, cssText = "" }) {
  // Mẫu thư viện có thể đã có sẵn khung .doc-page trong body (để giữ đúng
  // thiết kế khi mở mã HTML). Chỉ bọc thêm khi body chưa có khung này —
  // tránh padding/viền bị nhân đôi trong iframe preview.
  const html = bodyHtml || "";
  const hasPage = /class=["'][^"']*\bdoc-page\b/.test(html);
  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<style>${WORD_PREVIEW_CSS}</style>
${cssText ? `<style>${cssText}</style>` : ""}
</head><body>${hasPage ? html : `<div class="doc-page">${html}</div>`}</body></html>`;
}

// ── Theme dùng chung cho preview JSON + chuyển JSON → HTML ─────────────
// Template library lưu theme trong JSON (metadata mở rộng, xem model.js).
// Các hàm dưới sinh CSS đơn giản, chỉ dùng thuộc tính Word/PowerPoint có
// thể xấp xỉ — nhờ vậy chế độ JSON vẫn giữ được nhận diện màu sắc của mẫu
// thay vì rơi về giao diện xám mặc định.
export const DEFAULT_WORD_THEME = {
  accent: "#1e3a8a", accent2: "#2563eb", soft: "#eff6ff", line: "#bfdbfe",
  ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
  font: "Arial", displayFont: "Georgia", variant: "navy",
};
export const DEFAULT_PRESENTATION_THEME = {
  accent: "#2563eb", accent2: "#f59e0b", soft: "#eff6ff", line: "#bfdbfe",
  ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
  heroBg: "#1d4ed8", heroText: "#ffffff",
  font: "Arial", displayFont: "Arial", variant: "modern",
};

const CSS_VALUE = (v, fallback = "") => String(v ?? "")
  .replace(/[<>{};]/g, "").trim() || fallback;

function themePalette(theme, fallback) {
  const t = { ...fallback, ...(theme || {}) };
  return {
    accent: CSS_VALUE(t.accent, fallback.accent),
    accent2: CSS_VALUE(t.accent2, fallback.accent2),
    soft: CSS_VALUE(t.soft, fallback.soft),
    line: CSS_VALUE(t.line, fallback.line),
    ink: CSS_VALUE(t.ink, fallback.ink),
    muted: CSS_VALUE(t.muted, fallback.muted),
    bg: CSS_VALUE(t.bg, fallback.bg),
    heroBg: CSS_VALUE(t.heroBg, fallback.heroBg || fallback.accent),
    heroText: CSS_VALUE(t.heroText, fallback.heroText || "#ffffff"),
    font: CSS_VALUE(t.font, fallback.font),
    displayFont: CSS_VALUE(t.displayFont, fallback.displayFont || fallback.font),
    variant: CSS_VALUE(t.variant, fallback.variant || ""),
  };
}

/* Biến thể chỉ đổi màu nhấn và kiểu chữ — không dùng nền gradient, pill
 * hay khối trang trí để bản in luôn giống tài liệu soạn thảo chuẩn. */
const WORD_VARIANT_CSS = {
  navy: `.doc-page h1 { color: var(--w-accent); }`,
  pastel: `.doc-page h1 { color: var(--w-accent); }`,
  exam: `.doc-page { font-family: "Times New Roman", Times, serif; } .doc-page h1 { color: var(--w-ink); }`,
  study: `.doc-page h1 { color: var(--w-accent); }`,
  homework: `.doc-page h1 { color: var(--w-accent); }`,
  group: `.doc-page h1 { color: var(--w-accent); }`,
  manual: `.doc-page h1 { color: var(--w-accent); }`,
  report: `.doc-page h1 { color: var(--w-accent); }`,
  editorial: `.doc-page { font-family: Georgia, "Times New Roman", serif; }`,
  project: `.doc-page h1 { color: var(--w-accent); }`,
  violet: `.doc-page h1 { color: var(--w-accent); }`,
  green: `.doc-page h1 { color: var(--w-accent); }`,
  coral: `.doc-page h1 { color: var(--w-accent); }`,
  lab: `.doc-page h1 { color: var(--w-accent); }`,
  teal: `.doc-page h1 { color: var(--w-accent); }`,
};

export function themeCssForWord(theme) {
  const t = themePalette(theme, DEFAULT_WORD_THEME);
  return `
  .doc-page {
    --w-accent: ${t.accent}; --w-accent2: ${t.accent2}; --w-soft: ${t.soft};
    --w-line: ${t.line}; --w-ink: ${t.ink}; --w-bg: ${t.bg};
    background: ${t.bg}; color: ${t.ink};
    font-family: ${t.font}, Arial, sans-serif;
    font-size: 13.5px; line-height: 1.65;
  }
  .doc-page h1, .doc-page h2, .doc-page h3 { color: ${t.accent}; }
  .doc-page h1 { margin: 20px 0 6px; font-family: ${t.displayFont}, ${t.font}, serif; font-size: 25px; line-height: 1.3; text-align: center; }
  .doc-page h2 { margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 1.5px solid ${t.accent}; font-family: ${t.font}, Arial, sans-serif; font-size: 14.5px; line-height: 1.4; letter-spacing: .02em; text-transform: uppercase; }
  .doc-page h3 { margin: 14px 0 5px; font-family: ${t.font}, Arial, sans-serif; font-size: 14px; }
  .doc-page p { margin: 0 0 8px; color: ${t.ink}; }
  .doc-page ul, .doc-page ol { margin: 8px 0 12px; padding-left: 22px; }
  .doc-page li { margin: 3px 0; }
  .doc-page ul li::marker, .doc-page ol li::marker { color: ${t.accent2}; }
  .doc-page table { width: 100%; margin: 10px 0 14px; border-collapse: collapse; font-size: 12.5px; }
  .doc-page table th, .doc-page table td { border: 1px solid #b9b9b9; padding: 6px 8px; text-align: left; vertical-align: top; }
  .doc-page table th { background: #f3f4f6; color: ${t.ink}; font-weight: 700; }
  .doc-page table tr:nth-child(even) td { background: transparent; }
  .doc-page img { border-radius: 0; }
  .doc-page blockquote { margin: 10px 0; padding: 8px 12px; border-left: 3px solid ${t.accent2}; background: #f7f7f7; }
  .doc-page .tpl-head { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 8px; border-bottom: 1px solid ${t.ink}; color: ${t.ink}; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; line-height: 1.4; text-transform: uppercase; }
  .doc-page .tpl-head span:first-child { font-weight: 700; }
  .doc-page .tpl-foot { display: flex; justify-content: space-between; gap: 16px; margin-top: 32px; padding-top: 8px; border-top: 1px solid #b9b9b9; color: ${t.muted}; font-size: 10px; }
  ${WORD_VARIANT_CSS[t.variant] || ""}
  @media print {
    .doc-page { box-shadow: none; }
    .doc-page h2, .doc-page h3, .doc-page table, .doc-page tr, .doc-page img { break-inside: avoid; }
  }
  `;
}

const PRESENTATION_VARIANT_CSS = {
  modern: `.slide { border-top: 6px solid var(--p-accent); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  science: `.slide { border-top: 6px solid var(--p-accent); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  minimal: `.slide { border: 1px solid var(--p-line); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  kids: `.slide { border-top: 6px solid var(--p-accent2); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  history: `.slide { border-top: 6px double var(--p-accent); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  math: `.slide { border-top: 6px solid var(--p-accent); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  language: `.slide { border-top: 6px solid var(--p-accent2); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  infographic: `.slide { border-top: 6px solid var(--p-accent); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  corporate: `.slide { border-top: 6px solid var(--p-accent); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  story: `.slide { border-top: 6px solid var(--p-accent2); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
};

export function themeCssForPresentation(theme) {
  const t = themePalette(theme, DEFAULT_PRESENTATION_THEME);
  return `
  body {
    --p-accent: ${t.accent}; --p-accent2: ${t.accent2}; --p-soft: ${t.soft};
    --p-line: ${t.line}; --p-ink: ${t.ink}; --p-muted: ${t.muted};
    --p-bg: ${t.bg}; --p-hero: ${t.heroBg}; --p-hero-text: ${t.heroText};
    color: ${t.ink}; font-family: ${t.font}, Arial, sans-serif;
  }
  .slide { background: #fff; color: ${t.ink}; border-color: ${t.line}; }
  .slide h1, .slide h2, .slide h3 { color: ${t.accent}; font-family: ${t.displayFont}, ${t.font}, sans-serif; }
  .slide h1 { font-size: 38px; line-height: 1.2; margin: 0 0 14px; }
  .slide h2 { font-size: 26px; line-height: 1.25; margin: 0 0 18px; }
  .slide h3 { font-size: 20px; line-height: 1.3; margin: 0 0 10px; }
  .slide .slide-subtitle { color: ${t.muted}; font-size: 18px; line-height: 1.5; }
  .slide p { font-size: 17px; line-height: 1.6; }
  .slide ul, .slide ol { margin: 12px 0; padding-left: 28px; }
  .slide li { margin: 8px 0; line-height: 1.55; }
  .slide ul li::marker, .slide ol li::marker { color: ${t.accent2}; }
  .slide table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 17px; }
  .slide table th, .slide table td { border: 1px solid ${t.line}; padding: 8px 10px; text-align: left; vertical-align: top; }
  .slide table th { background: #f3f4f6; color: ${t.ink}; font-weight: 700; }
  .slide img { border-radius: 0; }
  .slide--summary { background: ${t.soft}; }
  ${PRESENTATION_VARIANT_CSS[t.variant] || ""}
  @media print {
    .slide { break-after: page; }
    .slide:last-child { break-after: auto; }
  }
  `;
}

export function themeCssForModel(model) {
  return model?.kind === "presentation"
    ? themeCssForPresentation(model.theme)
    : themeCssForWord(model?.theme);
}

/** Khung preview HTML cho PowerPoint ở chế độ HTML (tài liệu cuộn). */
export function buildSlidesScrollSrcDoc({ bodyHtml, cssText = "" }) {
  // Nếu bodyHtml không chứa phần tử .slide, wrap toàn bộ nội dung trong .slide
  let processedBodyHtml = bodyHtml || "";
  if (!processedBodyHtml.includes('class="slide"') && !processedBodyHtml.includes("class='slide'")) {
    processedBodyHtml = `<div class="slide">${processedBodyHtml}</div>`;
  }

  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #e5e7eb; font-family: Arial, Helvetica, sans-serif; color: #111827; }
  .slide { background: #fff; width: 920px; max-width: calc(100% - 32px); margin: 24px auto;
    padding: 44px 52px; border: 1px solid #d1d5db; box-shadow: 0 1px 4px rgba(0,0,0,.12); border-radius: 0; }
  img { max-width: 100%; }
  table { border-collapse: collapse; } th, td { border: 1px solid #d1d5db; padding: 8px 10px; }
  /* In slide (chế độ HTML) qua hộp thoại in: giấy ngang A4 cho vừa bề
     ngang slide, mỗi slide bắt đầu ở trang mới, không xẻ đôi slide. */
  @page { size: A4 landscape; margin: 10mm; }
  @media print {
    body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .slide { box-shadow: none; margin: 0 auto; max-width: 100%; width: auto; border: 0;
      break-inside: avoid; break-after: page; }
    .slide:last-child { break-after: auto; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; }
  }
</style>
${cssText ? `<style>${cssText}</style>` : ""}
</head><body>${processedBodyHtml}</body></html>`;
}
