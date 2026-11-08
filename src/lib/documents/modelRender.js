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
      if (r.underline) t = `<u>${t}</u>`;
      if (r.italic) t = `<em>${t}</em>`;
      if (r.bold) t = `<strong>${t}</strong>`;
      return t;
    }).join("");
  }
  return escapeHtml(block.text || "");
}

function blockStyleAttr(block) {
  const parts = [];
  if (block.color) parts.push(`color: ${block.color}`);
  if (block.align) parts.push(`text-align: ${block.align}`);
  return parts.length ? ` style="${escapeHtml(parts.join("; "))}"` : "";
}

export function wordBlockToHtml(block) {
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
      return `<${tag}>\n${items}\n</${tag}>`;
    }
    case "table": {
      const rows = (block.rows || []).map((row, ri) => {
        const cells = row.map((c) => ri === 0
          ? `<th>${escapeHtml(c)}</th>`
          : `<td>${escapeHtml(c)}</td>`).join("");
        return `<tr>${cells}</tr>`;
      }).join("\n");
      return `<table>\n${rows}\n</table>`;
    }
    case "image":
      return `<p><img src="${escapeHtml(block.src || "")}" alt="${escapeHtml(block.alt || "")}" style="max-width: 100%"></p>`;
    default:
      return `<p>${escapeHtml(block.text || "")}</p>`;
  }
}

/** Toàn bộ thân HTML của tài liệu Word từ model. */
export function renderWordBodyHtml(model) {
  return (model.blocks || []).map(wordBlockToHtml).join("\n");
}

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
  body { background: #d8d3c8; font-family: Arial, Helvetica, sans-serif; }
  .doc-page { background: #ffffff; width: 794px; min-height: 1123px; margin: 0 auto;
    padding: 72px; color: #111827; box-shadow: 0 2px 14px rgba(0,0,0,.22);
    font-size: 16px; line-height: 1.55; overflow-wrap: break-word; }
  .doc-page img { max-width: 100%; }
  .doc-page table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  .doc-page th, .doc-page td { border: 1px solid #9ca3af; padding: 6px 10px; text-align: left; }
  .doc-page h1 { font-size: 28px; } .doc-page h2 { font-size: 22px; } .doc-page h3 { font-size: 18px; }
`;

/** Dựng tài liệu HTML hoàn chỉnh cho iframe sandbox của preview Word. */
export function buildWordPreviewSrcDoc({ bodyHtml, cssText = "" }) {
  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<style>${WORD_PREVIEW_CSS}</style>
${cssText ? `<style>${cssText}</style>` : ""}
</head><body><div class="doc-page">${bodyHtml || ""}</div></body></html>`;
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

const WORD_VARIANT_CSS = {
  navy: `
    .doc-page h1 { text-transform: uppercase; letter-spacing: .04em; font-size: 29px; }
    .doc-page h2 { border-left: 5px solid var(--w-accent2); border-bottom: 0; padding: 3px 0 3px 10px; }
    .doc-page table th { background: var(--w-accent); color: #fff; }
  `,
  pastel: `
    .doc-page { border-top: 12px solid var(--w-accent); }
    .doc-page h1 { background: var(--w-soft); border-radius: 14px; padding: 12px 16px; text-align: center; }
    .doc-page h2 { display: inline-block; background: var(--w-soft); border-radius: 999px; padding: 3px 12px; border-bottom: 0; }
    .doc-page table th { background: var(--w-soft); }
  `,
  exam: `
    .doc-page { font-family: "Times New Roman", Times, serif; }
    .doc-page h1 { text-align: center; border-bottom: 3px double var(--w-accent); padding-bottom: 10px; }
    .doc-page h2 { text-transform: uppercase; border-bottom: 1px solid var(--w-line); padding-bottom: 3px; }
    .doc-page table th, .doc-page table td { border-color: var(--w-accent); }
  `,
  study: `
    .doc-page h1 { color: var(--w-accent); }
    .doc-page h2 { color: var(--w-accent2); border-left: 5px solid var(--w-accent); padding-left: 10px; border-bottom: 0; }
    .doc-page p { line-height: 1.65; }
    .doc-page table th { background: var(--w-soft); color: var(--w-accent); }
  `,
  homework: `
    .doc-page h1 { color: var(--w-accent); }
    .doc-page h2 { background: var(--w-soft); border: 1px solid var(--w-line); border-radius: 10px; padding: 5px 10px; border-bottom: 1px solid var(--w-line); }
    .doc-page ul li::marker { color: var(--w-accent); }
    .doc-page table th { background: var(--w-soft); }
  `,
  group: `
    .doc-page h1 { color: var(--w-accent); border-bottom: 5px solid var(--w-accent2); padding-bottom: 8px; }
    .doc-page h2 { color: var(--w-accent); border-left: 6px solid var(--w-accent); padding-left: 9px; border-bottom: 0; }
    .doc-page table th { background: var(--w-accent); color: #fff; }
  `,
  manual: `
    .doc-page h1 { color: var(--w-accent); }
    .doc-page h2 { border-bottom: 2px solid var(--w-accent2); padding-bottom: 4px; }
    .doc-page ol li::marker { color: var(--w-accent2); font-weight: 700; }
    .doc-page table th { background: var(--w-soft); color: var(--w-accent); }
  `,
  report: `
    .doc-page h1 { color: var(--w-accent); letter-spacing: .02em; }
    .doc-page h2 { color: var(--w-accent2); border-bottom: 2px solid var(--w-line); padding-bottom: 4px; }
    .doc-page table th { background: var(--w-accent); color: #fff; }
    .doc-page table tr:nth-child(even) td { background: var(--w-soft); }
  `,
  editorial: `
    .doc-page { font-family: Georgia, "Times New Roman", serif; }
    .doc-page h1 { font-size: 36px; line-height: 1.12; text-align: left; border-bottom: 1px solid var(--w-line); padding-bottom: 14px; }
    .doc-page h2 { font-style: italic; border-bottom: 0; color: var(--w-accent2); }
    .doc-page p { font-size: 17px; line-height: 1.7; }
    .doc-page table th { background: var(--w-soft); }
  `,
  project: `
    .doc-page h1 { color: var(--w-accent); }
    .doc-page h2 { color: var(--w-accent); border-left: 4px solid var(--w-accent2); padding-left: 10px; border-bottom: 0; }
    .doc-page table th { background: var(--w-accent); color: #fff; }
    .doc-page table tr:nth-child(even) td { background: var(--w-soft); }
  `,
};

export function themeCssForWord(theme) {
  const t = themePalette(theme, DEFAULT_WORD_THEME);
  return `
  .doc-page {
    --w-accent: ${t.accent}; --w-accent2: ${t.accent2}; --w-soft: ${t.soft};
    --w-line: ${t.line}; --w-ink: ${t.ink}; --w-bg: ${t.bg};
    background: ${t.bg}; color: ${t.ink};
    font-family: ${t.font}, Arial, sans-serif;
  }
  body > .doc-page { border-top: 9px solid ${t.accent}; }
  .doc-page h1, .doc-page h2, .doc-page h3 { color: ${t.accent}; font-family: ${t.displayFont}, ${t.font}, serif; }
  .doc-page h1 { line-height: 1.2; margin: 4px 0 10px; }
  .doc-page h2 { font-size: 21px; margin: 22px 0 8px; }
  .doc-page p { color: ${t.ink}; }
  .doc-page ul li::marker, .doc-page ol li::marker { color: ${t.accent2}; }
  .doc-page table { margin: 12px 0 16px; }
  .doc-page table th, .doc-page table td { border-color: ${t.line}; padding: 7px 10px; }
  .doc-page table th { font-weight: 700; }
  .doc-page table tr:nth-child(even) td { background: ${t.soft}; }
  .doc-page img { border-radius: 8px; }
  .doc-page blockquote { border-left: 4px solid ${t.accent2}; background: ${t.soft}; padding: 8px 12px; }
  ${WORD_VARIANT_CSS[t.variant] || ""}
  `;
}

const PRESENTATION_VARIANT_CSS = {
  modern: `.slide { border-top: 8px solid var(--p-accent); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--summary { background: var(--p-soft); }`,
  science: `.slide { border-left: 10px solid var(--p-accent); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--summary { background: var(--p-soft); } table th { background: var(--p-accent); color: #fff; }`,
  minimal: `.slide { border: 1px solid var(--p-line); } .slide h1, .slide h2 { color: var(--p-ink); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); }`,
  kids: `.slide { background: var(--p-bg); border-bottom: 8px dashed var(--p-accent2); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--summary { background: var(--p-soft); }`,
  history: `.slide { background: ${"var(--p-bg)"}; border-top: 6px double var(--p-accent); } .slide h1, .slide h2 { color: var(--p-accent); } table th { background: var(--p-soft); color: var(--p-accent); }`,
  math: `.slide { border-top: 8px solid var(--p-accent); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--summary { background: var(--p-soft); } table th { background: var(--p-accent); color: #fff; }`,
  language: `.slide { border-left: 10px solid var(--p-accent2); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--summary { background: var(--p-soft); }`,
  infographic: `.slide { border-top: 10px solid var(--p-accent); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--summary { background: var(--p-soft); } table th { background: var(--p-accent); color: #fff; }`,
  corporate: `.slide { border-top: 6px solid var(--p-accent); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--title { background: var(--p-hero); } .slide--title h1, .slide--title .slide-subtitle { color: var(--p-hero-text); } table th { background: var(--p-accent); color: #fff; }`,
  story: `.slide { border-left: 10px solid var(--p-accent2); } .slide h1, .slide h2 { color: var(--p-accent); } .slide--summary { background: var(--p-soft); }`,
};

export function themeCssForPresentation(theme) {
  const t = themePalette(theme, DEFAULT_PRESENTATION_THEME);
  return `
  body {
    --p-accent: ${t.accent}; --p-accent2: ${t.accent2}; --p-soft: ${t.soft};
    --p-line: ${t.line}; --p-ink: ${t.ink}; --p-muted: ${t.muted};
    --p-bg: ${t.bg}; --p-hero: ${t.heroBg}; --p-hero-text: ${t.heroText};
    background: ${t.bg}; color: ${t.ink}; font-family: ${t.font}, Arial, sans-serif;
  }
  .slide { background: #fff; color: ${t.ink}; border-color: ${t.line}; }
  .slide h1, .slide h2, .slide h3 { color: ${t.accent}; font-family: ${t.displayFont}, ${t.font}, sans-serif; }
  .slide h1 { font-size: 38px; } .slide h2 { font-size: 27px; }
  .slide .slide-subtitle { color: ${t.muted}; }
  .slide ul li::marker { color: ${t.accent2}; }
  .slide table th, .slide table td { border: 1px solid ${t.line}; padding: 7px 10px; }
  .slide table th { background: ${t.soft}; color: ${t.accent}; }
  .slide--summary { background: ${t.soft}; }
  ${PRESENTATION_VARIANT_CSS[t.variant] || ""}
  `;
}

export function themeCssForModel(model) {
  return model?.kind === "presentation"
    ? themeCssForPresentation(model.theme)
    : themeCssForWord(model?.theme);
}

/** Khung preview HTML cho PowerPoint ở chế độ HTML (tài liệu cuộn). */
export function buildSlidesScrollSrcDoc({ bodyHtml, cssText = "" }) {
  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #ece7db; font-family: Arial, Helvetica, sans-serif; color: #111827; }
  .slide { background: #fff; width: 880px; max-width: calc(100% - 32px); margin: 20px auto;
    padding: 36px 44px; box-shadow: 0 2px 10px rgba(0,0,0,.16); border-radius: 6px; }
  img { max-width: 100%; }
  table { border-collapse: collapse; } th, td { border: 1px solid #9ca3af; padding: 6px 10px; }
</style>
${cssText ? `<style>${cssText}</style>` : ""}
</head><body>${bodyHtml || ""}</body></html>`;
}
