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
