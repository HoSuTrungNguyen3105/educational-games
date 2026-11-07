// htmlParser.js — Parse HTML/CSS của giáo viên thành MÔ HÌNH TRUNG GIAN
// (xem model.js) + thu thập CẢNH BÁO chuyển đổi.
//
// An toàn: dùng DOMParser — tài liệu được parse trong một document rời,
// KHÔNG chạy script, KHÔNG render vào trang hiện tại. Không eval/Function.
//
// Phạm vi hỗ trợ: heading/paragraph/list/table/image + định dạng inline
// đậm/nghiêng/gạch chân + màu/căn lề từ inline style và từ các rule CSS
// đơn giản (selector dạng tag, .class, tag.class, ".class tag"). CSS phức
// tạp (position/float/flex/grid/animation/transform...) không chuyển
// được sang Word/PowerPoint → ghi vào danh sách cảnh báo để giáo viên
// biết trước, không âm thầm bỏ qua (đúng §7 đặc tả).

const normWs = (s) => String(s || "").replace(/\s+/g, " ").trim();

// ── Tách mã nguồn HTML thành phần thân + CSS + tiêu đề ─────────────────
// Mã nguồn giáo viên có thể là tài liệu HTML đầy đủ (<!doctype><html>…)
// hoặc chỉ một đoạn (fragment) kèm thẻ <style>. DOMParser chuẩn hoá cả
// hai về cùng một document để trích xuất thống nhất.
export function splitHtmlSource(source) {
  const doc = new DOMParser().parseFromString(String(source || ""), "text/html");
  const cssText = [...doc.querySelectorAll("style")].map((s) => s.textContent || "").join("\n");
  return { bodyHtml: doc.body ? doc.body.innerHTML : "", cssText, titleText: doc.title || "" };
}

// ── Mini cascade cho các rule CSS đơn giản ──────────────────────────────
const UNSUPPORTED_CSS = [
  { re: /position\s*:\s*(absolute|fixed)/i, label: (m) => `position: ${m[1]}` },
  { re: /float\s*:/i, label: () => "float" },
  { re: /display\s*:\s*(flex|grid|inline-flex|inline-grid)/i, label: (m) => `display: ${m[1]}` },
  { re: /animation(-[a-z]+)?\s*:/i, label: () => "animation" },
  { re: /transition\s*:/i, label: () => "transition" },
  { re: /transform\s*:/i, label: () => "transform" },
  { re: /box-shadow\s*:/i, label: () => "box-shadow" },
  { re: /background(-image)?\s*:[^;}]*gradient/i, label: () => "background gradient" },
];

function parseDeclarations(text) {
  const out = {};
  for (const part of String(text || "").split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    const prop = part.slice(0, i).trim().toLowerCase();
    const value = part.slice(i + 1).trim();
    if (prop) out[prop] = value;
  }
  return out;
}

/** Quét CSS: trả { rules: [{selectorText, decls}], warnings: [string] }. */
export function scanCss(cssText) {
  const warnings = [];
  const seen = new Set();
  const rules = [];
  const text = String(cssText || "").replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const selectorText = m[1].trim();
    const decls = parseDeclarations(m[2]);
    rules.push({ selectorText, decls });
    for (const [prop, value] of Object.entries(decls)) {
      for (const u of UNSUPPORTED_CSS) {
        const hit = u.re.exec(`${prop}: ${value}`);
        if (hit) {
          const key = `${selectorText}|${u.label(hit)}`;
          if (!seen.has(key)) {
            seen.add(key);
            warnings.push(
              `CSS "${selectorText}" dùng "${u.label(hit)}" — không chuyển sang Word/PowerPoint được, ` +
              "sẽ bỏ qua khi chuyển đổi/xuất file (preview HTML vẫn hiển thị đúng).");
          }
        }
      }
    }
  }
  return { rules, warnings };
}

/** Selector đơn giản có khớp phần tử không: tag | .cls | tag.cls | ".cls tag" | ".cls tag.cls". */
function selectorMatches(el, selector) {
  const parts = selector.trim().split(/\s+/).filter(Boolean);
  if (!parts.length || parts.length > 2) return false;
  const matchSimple = (node, simple) => {
    const mm = /^([a-zA-Z][\w-]*)?(\.[\w-]+)?$/.exec(simple);
    if (!mm || (!mm[1] && !mm[2])) return false;
    if (mm[1] && node.tagName !== mm[1].toUpperCase()) return false;
    if (mm[2] && !node.classList?.contains(mm[2].slice(1))) return false;
    return true;
  };
  if (!matchSimple(el, parts[parts.length - 1])) return false;
  if (parts.length === 2) {
    let anc = el.parentElement;
    while (anc) { if (matchSimple(anc, parts[0])) return true; anc = anc.parentElement; }
    return false;
  }
  return true;
}

/** Tính style hiệu dụng cho một phần tử: rules khớp (theo thứ tự CSS) → inline style ghi đè. */
function effectiveStyle(el, rules) {
  const out = {};
  for (const rule of rules) {
    const selectors = rule.selectorText.split(",").map((s) => s.trim()).filter(Boolean);
    if (selectors.some((s) => selectorMatches(el, s))) Object.assign(out, rule.decls);
  }
  Object.assign(out, parseDeclarations(el.getAttribute?.("style") || ""));
  return out;
}

const isBoldWeight = (w) => /bold|[6-9]00/.test(String(w || ""));
const pickAlign = (v) => (["left", "center", "right", "justify"].includes(v) ? v : undefined);

function stylePropsOf(el, rules) {
  const st = effectiveStyle(el, rules);
  const props = {};
  if (st.color) props.color = st.color;
  const align = pickAlign(st["text-align"]);
  if (align) props.align = align;
  return { props, st };
}

// ── Trích xuất runs inline (đậm/nghiêng/gạch chân) ─────────────────────
function extractRuns(node, flags = {}) {
  const runs = [];
  const push = (text, f) => {
    if (!text) return;
    const last = runs[runs.length - 1];
    if (last && last.bold === f.bold && last.italic === f.italic && last.underline === f.underline) {
      last.text += text;
    } else {
      runs.push({ text, bold: !!f.bold, italic: !!f.italic, underline: !!f.underline });
    }
  };
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      push(child.textContent.replace(/\s+/g, " "), flags);
    } else if (child.nodeType === 1) {
      const tag = child.tagName;
      if (tag === "BR") { push(" ", flags); continue; }
      const next = { ...flags };
      if (tag === "B" || tag === "STRONG") next.bold = true;
      if (tag === "I" || tag === "EM") next.italic = true;
      if (tag === "U") next.underline = true;
      runs.push(...extractRuns(child, next));
      // Gộp lại sau khi đệ quy (extractRuns lồng nhau tạo mảng riêng).
      const merged = [];
      for (const r of runs) {
        const last = merged[merged.length - 1];
        if (last && last.bold === r.bold && last.italic === r.italic && last.underline === r.underline) last.text += r.text;
        else merged.push({ ...r });
      }
      runs.length = 0;
      runs.push(...merged);
    }
  }
  return runs;
}

/** Khối chữ (heading/paragraph): text thuần + runs khi có định dạng lẫn lộn. */
function textBlockOf(el, rules, base = {}) {
  let runs = extractRuns(el);
  // Bỏ khoảng trắng ở hai đầu trên tổng thể.
  runs = runs.map((r) => ({ ...r }));
  while (runs.length && !runs[0].text.trim()) runs.shift();
  while (runs.length && !runs[runs.length - 1].text.trim()) runs.pop();
  if (runs.length) { runs[0].text = runs[0].text.replace(/^\s+/, ""); runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/\s+$/, ""); }
  const text = runs.map((r) => r.text).join("");
  const { props, st } = stylePropsOf(el, rules);
  const block = { ...base, text, ...props };
  const hasFormat = runs.some((r) => r.bold || r.italic || r.underline) || isBoldWeight(st["font-weight"]) || /italic|oblique/.test(st["font-style"] || "");
  if (hasFormat) {
    if (isBoldWeight(st["font-weight"])) runs = runs.map((r) => ({ ...r, bold: true }));
    if (/italic|oblique/.test(st["font-style"] || "")) runs = runs.map((r) => ({ ...r, italic: true }));
    block.runs = runs;
  }
  return block;
}

function listItemsOf(listEl, warnings) {
  const items = [];
  for (const li of listEl.querySelectorAll(":scope > li")) {
    if (li.querySelector("ul, ol")) warnings.push("Danh sách có mục lồng nhau — đã làm phẳng khi chuyển đổi.");
    items.push(normWs(li.textContent));
  }
  return items;
}

function tableRowsOf(tableEl) {
  return [...tableEl.querySelectorAll("tr")].map((tr) =>
    [...tr.querySelectorAll(":scope > th, :scope > td")].map((c) => normWs(c.textContent)));
}

const CONTAINER_TAGS = new Set(["SECTION", "DIV", "ARTICLE", "MAIN", "HEADER", "FOOTER", "FIGURE", "BLOCKQUOTE"]);

// ── Word: duyệt cây DOM → blocks ────────────────────────────────────────
function collectWordBlocks(node, rules, blocks, warnings) {
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      const t = normWs(child.textContent);
      if (t) blocks.push({ type: "paragraph", text: t });
      continue;
    }
    if (child.nodeType !== 1) continue;
    const tag = child.tagName;
    if (tag === "SCRIPT" || tag === "STYLE") continue;
    if (/^H[1-6]$/.test(tag)) {
      blocks.push(textBlockOf(child, rules, { type: "heading", level: Math.min(3, Number(tag[1])) }));
    } else if (tag === "P") {
      const b = textBlockOf(child, rules, { type: "paragraph" });
      if (b.text) blocks.push(b);
    } else if (tag === "UL" || tag === "OL") {
      blocks.push({ type: "list", ordered: tag === "OL", items: listItemsOf(child, warnings) });
    } else if (tag === "TABLE") {
      blocks.push({ type: "table", rows: tableRowsOf(child) });
    } else if (tag === "IMG") {
      blocks.push({ type: "image", src: child.getAttribute("src") || "", alt: child.getAttribute("alt") || "" });
    } else if (tag === "HR") {
      warnings.push("Đường kẻ ngang (<hr>) chưa có khối tương ứng — đã bỏ qua khi chuyển đổi.");
    } else if (CONTAINER_TAGS.has(tag)) {
      const img = child.querySelector(":scope > img");
      if (tag === "FIGURE" && img) {
        blocks.push({ type: "image", src: img.getAttribute("src") || "", alt: img.getAttribute("alt") || normWs(child.querySelector("figcaption")?.textContent || "") });
      } else {
        collectWordBlocks(child, rules, blocks, warnings);
      }
    } else {
      const t = normWs(child.textContent);
      if (t) blocks.push(textBlockOf(child, rules, { type: "paragraph" }));
    }
  }
}

export function parseHtmlToWordModel(source) {
  const { bodyHtml, cssText, titleText } = splitHtmlSource(source);
  const { rules, warnings } = scanCss(cssText);
  const doc = new DOMParser().parseFromString(String(source || ""), "text/html");
  const blocks = [];
  if (doc.body) collectWordBlocks(doc.body, rules, blocks, warnings);
  const firstHeading = blocks.find((b) => b.type === "heading");
  return {
    model: { kind: "word", title: titleText || firstHeading?.text || "", subject: "", grade: null, blocks },
    warnings,
    bodyHtml,
    cssText,
  };
}

// ── PowerPoint: HTML → slides (phân loại tự động theo <section>/class "slide") ──
function slideFromSection(sec, rules, warnings, isFirst) {
  const heading = sec.querySelector("h1, h2, h3");
  const title = normWs(heading?.textContent || "");
  const table = sec.querySelector("table");
  if (table) return { type: "table", title, rows: tableRowsOf(table) };
  const img = sec.querySelector("img");
  const bullets = [...sec.querySelectorAll("li")].map((li) => normWs(li.textContent)).filter(Boolean);
  const paras = [...sec.querySelectorAll(":scope p")].map((p) => normWs(p.textContent)).filter(Boolean);
  if (img && !bullets.length && paras.length <= 1) {
    return { type: "image", title, src: img.getAttribute("src") || "", alt: img.getAttribute("alt") || "", caption: paras[0] || "" };
  }
  if (isFirst && title && bullets.length === 0 && paras.length <= 1) {
    return { type: "title", title, subtitle: paras[0] || "" };
  }
  const content = [...bullets, ...paras.filter((p) => p !== title)];
  return { type: "content", title: title || "Slide", content };
}

export function parseHtmlToPresentationModel(source) {
  const { bodyHtml, cssText, titleText } = splitHtmlSource(source);
  const { rules, warnings } = scanCss(cssText);
  const doc = new DOMParser().parseFromString(String(source || ""), "text/html");
  warnings.push("Chuyển HTML → slide: các slide được chia theo thẻ <section> (hoặc class \"slide\") và phân loại tự động theo nội dung — hãy kiểm tra lại ở chế độ JSON.");
  let sections = [];
  if (doc.body) {
    sections = [...doc.body.children].filter((el) =>
      el.tagName === "SECTION" || el.classList?.contains("slide"));
    if (!sections.length) sections = [doc.body];
  }
  const slides = sections.map((sec, i) => slideFromSection(sec, rules, warnings, i === 0));
  return {
    model: { kind: "presentation", title: titleText || slides[0]?.title || "", subject: "", grade: null, slides },
    warnings,
    bodyHtml,
    cssText,
  };
}

/** Parse HTML → model theo loại tài liệu. Trả { model, warnings, bodyHtml, cssText }. */
export function parseHtmlToModel(source, docType) {
  return docType === "powerpoint" ? parseHtmlToPresentationModel(source) : parseHtmlToWordModel(source);
}

// ── Kiểm tra cân bằng thẻ HTML (báo lỗi kèm số dòng) ────────────────────
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

/**
 * Quét thẻ mở/đóng bằng stack. DOMParser tự "chữa" HTML lỗi nên không dùng
 * nó để bắt lỗi cú pháp — scanner này bắt các lỗi phổ biến: đóng sai thẻ,
 * thiếu thẻ đóng. Trả tối đa lỗi đầu tiên kèm số dòng.
 */
export function validateHtmlBalance(source) {
  const src = String(source || "");
  const noComments = src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  const stack = [];
  let m;
  const lineAt = (idx) => noComments.slice(0, idx).split("\n").length;
  while ((m = tagRe.exec(noComments)) !== null) {
    const full = m[0];
    const tag = m[1].toLowerCase();
    const line = lineAt(m.index);
    if (full.startsWith("</")) {
      if (VOID_TAGS.has(tag)) continue;
      const top = stack[stack.length - 1];
      if (!top) return [{ line, message: `Thẻ đóng </${tag}> ở dòng ${line} không có thẻ mở tương ứng` }];
      if (top.tag !== tag) {
        return [{ line, message: `Thẻ đóng </${tag}> ở dòng ${line} không khớp — đang mở <${top.tag}> từ dòng ${top.line}` }];
      }
      stack.pop();
    } else if (!full.endsWith("/>") && !VOID_TAGS.has(tag)) {
      stack.push({ tag, line });
    }
  }
  if (stack.length) {
    const first = stack[0];
    return [{ line: first.line, message: `Thẻ <${first.tag}> mở ở dòng ${first.line} chưa được đóng` }];
  }
  return [];
}
