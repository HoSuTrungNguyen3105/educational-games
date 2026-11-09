// docxImporter.js — Bộ chuyển đổi .docx → HTML cho Teacher Document Studio.
//
// Vì sao không dùng mammoth nữa: mammoth CHỈ ánh xạ style theo tên sang thẻ
// HTML và BỎ QUA toàn bộ định dạng trực tiếp của Word — căn lề đoạn, cỡ chữ,
// font chữ, giãn đoạn/dòng, thụt lề, màu nền ô bảng... File Word thật của
// giáo viên Việt Nam định dạng chủ yếu bằng định dạng trực tiếp + style
// chuẩn (Normal = Times New Roman 13pt...), nên bản HTML sau nhập bị "sai
// hẳn" so với file gốc (bìa mất căn giữa, bảng mất nền tiêu đề, mọi chữ về
// một cỡ mặc định) mà không có bất kỳ cảnh báo nào.
//
// Bộ này đọc thẳng OOXML (JSZip + DOMParser — cùng bộ thư viện dự án đã
// dùng cho .pptx) và GIẢI QUYẾT KẾ THỪA ĐỊNH DẠNG như Word:
//   docDefaults → chuỗi style basedOn → định dạng trực tiếp,
// cho cả đoạn (pPr) lẫn ký tự (rPr + character style của run). Phần tử nào
// mô hình trung gian không chứa được (header/footer, công thức OMML, hộp
// văn bản, hình vẽ...) thì ghi CẢNH BÁO trung thực thay vì bỏ thầm lặng.
//
// Đầu ra là fragment HTML dùng đúng "từ vựng" của hệ thống (h1–h6, p,
// ul/ol/li lồng nhau, table, img, strong/em/u/s, a) cộng style nội tuyến
// cho các thuộc tính trực quan (text-align, font-size, font-family, color,
// background-color, margin, line-height, text-indent) — chế độ HTML hiển
// thị trung thực; chế độ JSON vẫn lấy được căn lề/màu/đậm-nghiêng qua
// htmlParser như trước.

import { escapeHtml } from "./modelRender.js";

// ── Tiện ích DOM trên XML (theo localName để không lệ thuộc tiền tố) ────
const kids = (el, name) => (el ? [...el.childNodes].filter((n) => n.nodeType === 1 && n.localName === name) : []);
const kid = (el, name) => kids(el, name)[0] || null;
const attr = (el, name) => (el ? el.getAttribute(`w:${name}`) : null);
const kidVal = (el, name) => attr(kid(el, name), "val");

const twipsToPx = (twips) => Math.round((Number(twips) / 15) * 10) / 10;
const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

function parseXml(text, label) {
  const doc = new DOMParser().parseFromString(text, "text/xml");
  if (doc.getElementsByTagName("parsererror").length) {
    throw new Error(`File .docx hỏng: không đọc được ${label}.`);
  }
  return doc;
}

// ── Đọc thuộc tính từ pPr / rPr ─────────────────────────────────────────
const OFF_VALUES = new Set(["0", "false", "off", "none"]);
function readToggle(rPr, tag) {
  const el = kid(rPr, tag);
  if (!el) return undefined;
  const v = attr(el, "val");
  return v == null ? true : !OFF_VALUES.has(String(v).toLowerCase());
}

function pPrProps(pPr) {
  if (!pPr) return {};
  const o = {};
  const jc = kidVal(pPr, "jc");
  if (jc) o.jc = jc === "both" ? "justify" : jc;
  const numPr = kid(pPr, "numPr");
  if (numPr) {
    const numId = kidVal(numPr, "numId");
    if (numId != null) {
      o.numId = String(numId);
      o.ilvl = num(kidVal(numPr, "ilvl"), 0);
    }
  }
  const sp = kid(pPr, "spacing");
  if (sp) {
    if (attr(sp, "before") != null) o.spaceBefore = num(attr(sp, "before"));
    if (attr(sp, "after") != null) o.spaceAfter = num(attr(sp, "after"));
    if (attr(sp, "line") != null) o.line = num(attr(sp, "line"));
    if (attr(sp, "lineRule")) o.lineRule = attr(sp, "lineRule");
  }
  const ind = kid(pPr, "ind");
  if (ind) {
    if (attr(ind, "left") != null) o.indLeft = num(attr(ind, "left"));
    if (attr(ind, "firstLine") != null) o.indFirst = num(attr(ind, "firstLine"));
    if (attr(ind, "hanging") != null) o.indHanging = num(attr(ind, "hanging"));
  }
  const ol = kidVal(pPr, "outlineLvl");
  if (ol != null) o.outlineLvl = num(ol);
  if (kid(pPr, "sectPr")) o.sectionBreak = true;
  return o;
}

function rPrProps(rPr) {
  if (!rPr) return {};
  const o = {};
  for (const tag of ["b", "i", "strike", "caps", "smallCaps"]) {
    const v = readToggle(rPr, tag);
    if (v !== undefined) o[tag] = v;
  }
  const u = kid(rPr, "u");
  if (u) o.u = attr(u, "val") !== "none";
  const color = kidVal(rPr, "color");
  if (color && color.toLowerCase() !== "auto") o.color = `#${color.toLowerCase()}`;
  const sz = kidVal(rPr, "sz");
  if (sz != null) o.sz = num(sz) / 2;
  const fonts = kid(rPr, "rFonts");
  if (fonts) {
    o.font = attr(fonts, "ascii") || attr(fonts, "hAnsi") || undefined;
    o.fontTheme = attr(fonts, "asciiTheme") || attr(fonts, "hAnsiTheme") || undefined;
  }
  const hl = kidVal(rPr, "highlight");
  if (hl && hl !== "none") o.highlight = hl;
  const shd = kid(rPr, "shd");
  const fill = attr(shd, "fill");
  if (fill && fill.toLowerCase() !== "auto") o.bg = `#${fill.toLowerCase()}`;
  const va = kidVal(rPr, "vertAlign");
  if (va === "superscript" || va === "subscript") o.vertAlign = va;
  return o;
}

/** Gộp props: nguồn sau (cụ thể hơn) ghi đè nguồn trước; undefined = giữ nguyên. */
function mergeInto(target, src) {
  for (const [k, v] of Object.entries(src || {})) {
    if (v !== undefined) target[k] = v;
  }
  return target;
}

// ── styles.xml: bản đồ style + docDefaults + theme fonts ────────────────
function loadStyles(stylesDoc) {
  const styles = new Map();
  let docDefaultsR = {};
  let docDefaultsP = {};
  let defaultParaStyleId = null;
  if (!stylesDoc) return { styles, docDefaultsR, docDefaultsP, defaultParaStyleId };
  const root = stylesDoc.documentElement;
  const dd = kid(root, "docDefaults");
  if (dd) {
    docDefaultsR = rPrProps(kid(kid(dd, "rPrDefault"), "rPr"));
    docDefaultsP = pPrProps(kid(kid(dd, "pPrDefault"), "pPr"));
  }
  for (const st of kids(root, "style")) {
    const id = st.getAttribute("w:styleId");
    if (!id) continue;
    styles.set(id, {
      id,
      type: st.getAttribute("w:type"),
      name: kidVal(st, "name") || id,
      basedOn: kidVal(st, "basedOn"),
      pPr: pPrProps(kid(st, "pPr")),
      rPr: rPrProps(kid(st, "rPr")),
    });
    if (st.getAttribute("w:default") === "1" && st.getAttribute("w:type") === "paragraph") {
      defaultParaStyleId = id;
    }
  }
  return { styles, docDefaultsR, docDefaultsP, defaultParaStyleId };
}

/** Chuỗi basedOn từ gốc → style đích (chống vòng lặp). */
function styleChain(styles, id) {
  const chain = [];
  const seen = new Set();
  let cur = id;
  while (cur && styles.has(cur) && !seen.has(cur)) {
    seen.add(cur);
    chain.unshift(styles.get(cur));
    cur = styles.get(cur).basedOn;
  }
  return chain;
}

// ── numbering.xml ───────────────────────────────────────────────────────
const ORDERED_FMTS = new Set(["decimal", "upperroman", "lowerroman", "upperletter", "lowerletter"]);
function loadNumbering(numDoc) {
  const abstracts = new Map();
  const nums = new Map();
  if (!numDoc) return { abstracts, nums };
  const root = numDoc.documentElement;
  for (const an of kids(root, "abstractNum")) {
    const levels = new Map();
    for (const lvl of kids(an, "lvl")) {
      levels.set(num(lvl.getAttribute("w:ilvl")), {
        fmt: kidVal(lvl, "numFmt") || "bullet",
        start: num(kidVal(lvl, "start"), 1),
      });
    }
    abstracts.set(an.getAttribute("w:abstractNumId"), levels);
  }
  for (const n of kids(root, "num")) {
    const absId = kidVal(n, "abstractNumId");
    const starts = new Map();
    for (const lo of kids(n, "lvlOverride")) {
      const st = kidVal(lo, "startOverride");
      if (st != null) starts.set(num(lo.getAttribute("w:ilvl")), num(st));
    }
    nums.set(n.getAttribute("w:numId"), { absId, starts });
  }
  return { abstracts, nums };
}

function numberingLevel(ctx, numId, ilvl) {
  const entry = ctx.numbering.nums.get(String(numId));
  if (!entry) return null;
  const levels = ctx.numbering.abstracts.get(entry.absId);
  const lvl = levels?.get(ilvl) || levels?.get(0);
  if (!lvl) return null;
  return { ordered: ORDERED_FMTS.has(String(lvl.fmt).toLowerCase()), fmt: lvl.fmt };
}

// ── Quan hệ (ảnh nhúng, hyperlink) ──────────────────────────────────────
function loadRels(relsDoc) {
  const rels = new Map();
  if (!relsDoc) return rels;
  for (const rel of relsDoc.documentElement.childNodes) {
    if (rel.nodeType !== 1) continue;
    rels.set(rel.getAttribute("Id"), {
      target: rel.getAttribute("Target") || "",
      type: rel.getAttribute("Type") || "",
      external: rel.getAttribute("TargetMode") === "External",
    });
  }
  return rels;
}

const IMAGE_MIME = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  bmp: "image/bmp", svg: "image/svg+xml", webp: "image/webp", tif: "image/tiff", tiff: "image/tiff",
};

const HIGHLIGHT_HEX = {
  black: "#000000", blue: "#0000ff", cyan: "#00ffff", darkblue: "#00008b",
  darkcyan: "#008b8b", darkgray: "#a9a9a9", darkgreen: "#006400", darkmagenta: "#8b008b",
  darkred: "#8b0000", darkyellow: "#b8860b", green: "#00ff00", lightgray: "#d3d3d3",
  magenta: "#ff00ff", red: "#ff0000", white: "#ffffff", yellow: "#ffff00",
};

// ── Sinh style nội tuyến từ props đã hợp nhất ───────────────────────────
function paraStyleAttr(p, rBase) {
  const parts = [];
  if (p.jc) parts.push(`text-align: ${p.jc}`);
  if (p.spaceBefore) parts.push(`margin-top: ${twipsToPx(p.spaceBefore)}px`);
  if (p.spaceAfter != null) parts.push(`margin-bottom: ${twipsToPx(p.spaceAfter)}px`);
  if (p.line != null) {
    if (!p.lineRule || p.lineRule === "auto") parts.push(`line-height: ${Math.round((p.line / 240) * 100) / 100}`);
    else parts.push(`line-height: ${twipsToPx(p.line)}px`);
  }
  if (p.indLeft) parts.push(`margin-left: ${twipsToPx(p.indLeft)}px`);
  if (p.indFirst) parts.push(`text-indent: ${twipsToPx(p.indFirst)}px`);
  else if (p.indHanging) parts.push(`text-indent: -${twipsToPx(p.indHanging)}px`);
  if (rBase.fontName) parts.push(`font-family: '${rBase.fontName}'`);
  if (rBase.sz) parts.push(`font-size: ${rBase.sz}pt`);
  return parts.length ? ` style="${escapeHtml(parts.join("; "))}"` : "";
}

function fontNameOf(props, ctx) {
  if (props.font) return props.font;
  if (props.fontTheme) {
    if (/major/i.test(props.fontTheme)) return ctx.themeFonts.major || undefined;
    return ctx.themeFonts.minor || undefined;
  }
  return undefined;
}

// ── Chuyển một run → HTML nội tuyến ─────────────────────────────────────
function wrapRun(text, eff, base) {
  let t = text;
  if (eff.vertAlign === "superscript") t = `<sup>${t}</sup>`;
  else if (eff.vertAlign === "subscript") t = `<sub>${t}</sub>`;
  if (eff.strike) t = `<s>${t}</s>`;
  if (eff.u) t = `<u>${t}</u>`;
  if (eff.i) t = `<em>${t}</em>`;
  if (eff.b) t = `<strong>${t}</strong>`;
  if (eff.caps || eff.smallCaps) t = `<span style="text-transform: uppercase">${t}</span>`;
  const styles = [];
  if (eff.color && eff.color !== base.color) styles.push(`color: ${eff.color}`);
  const bg = eff.bg || (eff.highlight ? HIGHLIGHT_HEX[String(eff.highlight).toLowerCase()] : undefined);
  const baseBg = base.bg || (base.highlight ? HIGHLIGHT_HEX[String(base.highlight).toLowerCase()] : undefined);
  if (bg && bg !== baseBg) styles.push(`background-color: ${bg}`);
  const fname = eff.fontName;
  if (fname && fname !== base.fontName) styles.push(`font-family: '${fname}'`);
  if (eff.sz && eff.sz !== base.sz) styles.push(`font-size: ${eff.sz}pt`);
  if (styles.length) t = `<span style="${escapeHtml(styles.join("; "))}">${t}</span>`;
  return t;
}

function effectiveRunProps(ctx, paraChainR, rEl) {
  const eff = {};
  mergeInto(eff, ctx.stylesInfo.docDefaultsR);
  for (const st of paraChainR) mergeInto(eff, st.rPr);
  const rPr = kid(rEl, "rPr");
  const rStyleId = kidVal(rPr, "rStyle");
  if (rStyleId) {
    for (const st of styleChain(ctx.stylesInfo.styles, rStyleId)) mergeInto(eff, st.rPr);
  }
  mergeInto(eff, rPrProps(rPr));
  eff.fontName = fontNameOf(eff, ctx);
  return eff;
}

/** Nội dung inline của một container (đoạn/hyperlink/fldSimple...). */
function inlineHtml(ctx, container, paraChainR, baseRunProps, state) {
  let out = "";
  for (const node of container.childNodes) {
    if (node.nodeType === 3) { out += escapeHtml(node.textContent); continue; }
    if (node.nodeType !== 1) continue;
    const tag = node.localName;
    if (tag === "r") {
      out += runHtml(ctx, node, paraChainR, baseRunProps, state);
    } else if (tag === "hyperlink") {
      const inner = inlineHtml(ctx, node, paraChainR, baseRunProps, state);
      const rid = node.getAttribute("r:id");
      const rel = rid ? ctx.rels.get(rid) : null;
      const anchor = attr(node, "anchor");
      const href = rel?.target || (anchor ? `#${anchor}` : "");
      out += href ? `<a href="${escapeHtml(href)}">${inner}</a>` : inner;
    } else if (tag === "fldSimple") {
      out += inlineHtml(ctx, node, paraChainR, baseRunProps, state);
      state.flags.field = true;
    } else if (tag === "oMath" || tag === "oMathPara") {
      const text = [...node.getElementsByTagNameNS("*", "t")].map((t) => t.textContent).join("");
      out += `<em class="docx-formula">${escapeHtml(text)}</em>`;
      state.flags.formula = true;
    } else if (tag === "AlternateContent") {
      const choice = kids(node, "Choice")[0] || node;
      out += inlineHtml(ctx, choice, paraChainR, baseRunProps, state);
    } else if (tag === "smartTag" || tag === "ins" || tag === "sdt" || tag === "customXml" || tag === "txbxContent") {
      const inner = tag === "sdt" ? (kid(node, "sdtContent") || node) : node;
      if (tag === "txbxContent") state.flags.textbox = true;
      out += inlineHtml(ctx, inner, paraChainR, baseRunProps, state);
    }
    // bookmarkStart/End, proofErr, commentRange*, del...: bỏ qua an toàn.
  }
  return out;
}

function runHtml(ctx, rEl, paraChainR, baseRunProps, state) {
  const eff = effectiveRunProps(ctx, paraChainR, rEl);
  let out = "";
  for (const node of rEl.childNodes) {
    if (node.nodeType !== 1) continue;
    const tag = node.localName;
    if (tag === "rPr") continue;
    if (tag === "fldChar") {
      const kind = attr(node, "fldCharType");
      if (kind === "begin") state.field = "instr";
      else if (kind === "separate") state.field = "result";
      else if (kind === "end") state.field = null;
      state.flags.field = true;
      continue;
    }
    if (tag === "instrText") { state.flags.field = true; continue; }
    if (state.field === "instr") continue;
    if (tag === "t") {
      out += wrapRun(escapeHtml(node.textContent || ""), eff, baseRunProps);
    } else if (tag === "tab") {
      out += " &#160;&#160; ";
    } else if (tag === "br") {
      const type = attr(node, "type");
      if (type === "page") state.pageBreak = true;
      else if (type === "textWrapping") out += "<br>";
      else out += "<br>";
    } else if (tag === "cr") {
      out += "<br>";
    } else if (tag === "noBreakHyphen") {
      out += wrapRun("‑", eff, baseRunProps);
    } else if (tag === "sym") {
      const ch = attr(node, "char");
      if (ch) {
        try { out += wrapRun(escapeHtml(String.fromCharCode(parseInt(ch, 16))), eff, baseRunProps); } catch { /* bỏ qua */ }
      }
    } else if (tag === "drawing" || tag === "pict" || tag === "object") {
      out += imageHtml(ctx, node, state);
    } else if (tag === "footnoteReference" || tag === "endnoteReference") {
      state.flags.footnote = true;
    }
  }
  return out;
}

function imageHtml(ctx, container, state) {
  let blip = null;
  for (const el of container.getElementsByTagName("*")) {
    if (el.localName === "blip") { blip = el; break; }
  }
  let rid = blip?.getAttribute("r:embed") || blip?.getAttribute("r:link");
  if (!rid) {
    for (const el of container.getElementsByTagName("*")) {
      if (el.localName === "imagedata") { rid = el.getAttribute("r:id"); break; }
    }
  }
  const rel = rid ? ctx.rels.get(rid) : null;
  if (!rel) { state.flags.shape = true; return ""; }
  const src = ctx.media.get(rel.target.replace(/^\//, ""));
  if (!src) { state.flags.shape = true; return ""; }
  let widthPx = null;
  let alt = "";
  for (const el of container.getElementsByTagName("*")) {
    if (el.localName === "extent" && widthPx == null) {
      const cx = num(el.getAttribute("cx"));
      if (cx > 0) widthPx = Math.round(cx / 9525);
    }
    if (el.localName === "docPr" && !alt) alt = el.getAttribute("descr") || el.getAttribute("name") || "";
  }
  const style = widthPx ? ` style="width: ${widthPx}px; max-width: 100%"` : "";
  return `<img src="${src}" alt="${escapeHtml(alt)}"${style}>`;
}

// ── Đoạn văn ────────────────────────────────────────────────────────────
const HEADING_NAME_RE = /^(heading|tiêu đề|titre|überschrift)\s*([1-6])$/i;

function headingLevelOf(styleName, styleId, outlineLvl) {
  if (outlineLvl != null && outlineLvl >= 0 && outlineLvl <= 5) return outlineLvl + 1;
  const m = HEADING_NAME_RE.exec(String(styleName || "").trim());
  if (m) return num(m[2]);
  if (/^title$/i.test(String(styleName || "").trim())) return 1;
  const m2 = /^heading\s*([1-6])$/i.exec(String(styleId || ""));
  if (m2) return num(m2[1]);
  return null;
}

/**
 * Chuyển một w:p. Trả một trong:
 *   { kind: "block", html } | { kind: "listItem", numId, ilvl, ordered, html } | null (rỗng hẳn)
 */
function convertParagraph(ctx, pEl, state) {
  const pPr = kid(pEl, "pPr");
  const directP = pPrProps(pPr);
  const styleId = kidVal(pPr, "pStyle") || ctx.stylesInfo.defaultParaStyleId;
  const chain = styleChain(ctx.stylesInfo.styles, styleId);
  const effP = {};
  mergeInto(effP, ctx.stylesInfo.docDefaultsP);
  for (const st of chain) mergeInto(effP, st.pPr);
  mergeInto(effP, directP);

  const baseRun = {};
  mergeInto(baseRun, ctx.stylesInfo.docDefaultsR);
  for (const st of chain) mergeInto(baseRun, st.rPr);
  baseRun.fontName = fontNameOf(baseRun, ctx);

  const localState = { ...state, field: null, pageBreak: false, flags: state.flags };
  const inner = inlineHtml(ctx, pEl, chain, baseRun, localState);
  if (localState.pageBreak) state.pageBreakAfter = true;

  const styleName = chain.length ? chain[chain.length - 1].name : "";
  const level = headingLevelOf(styleName, styleId, effP.outlineLvl);

  if (effP.numId != null && effP.numId !== "0") {
    const info = numberingLevel(ctx, effP.numId, effP.ilvl || 0);
    if (info) {
      return { kind: "listItem", numId: effP.numId, ilvl: effP.ilvl || 0, ordered: info.ordered, html: inner };
    }
  }

  const tag = level ? `h${Math.min(level, 6)}` : "p";
  const style = paraStyleAttr(effP, baseRun);
  const html = `<${tag}${style}>${inner}</${tag}>`;
  if (effP.sectionBreak) state.pageBreakAfter = true;
  if (!inner.trim() && !localState.pageBreak) {
    // Đoạn trống: chỉ giữ khi có giãn đoạn đáng kể để không phá bố cục bìa.
    if ((effP.spaceAfter || 0) >= 200 || (effP.spaceBefore || 0) >= 200) return { kind: "block", html };
    return null;
  }
  return { kind: "block", html };
}

// ── Danh sách: gom các mục liên tiếp → HTML lồng nhau ───────────────────
function buildListHtml(items) {
  let html = "";
  const stack = []; // { ilvl, tag }
  const closeTo = (ilvl) => {
    while (stack.length && stack[stack.length - 1].ilvl >= ilvl) {
      html += `</li></${stack.pop().tag}>`;
    }
  };
  for (const item of items) {
    const tag = item.ordered ? "ol" : "ul";
    if (!stack.length || item.ilvl > stack[stack.length - 1].ilvl) {
      html += `<${tag}><li>`;
      stack.push({ ilvl: item.ilvl, tag });
    } else if (item.ilvl === stack[stack.length - 1].ilvl && stack[stack.length - 1].tag === tag) {
      html += "</li><li>";
    } else if (item.ilvl === stack[stack.length - 1].ilvl) {
      closeTo(item.ilvl + 1);
      html += `</li></${stack.pop().tag}><${tag}><li>`;
      stack.push({ ilvl: item.ilvl, tag });
    } else {
      closeTo(item.ilvl + 1);
      html += "</li><li>";
    }
    html += item.html;
  }
  while (stack.length) html += `</li></${stack.pop().tag}>`;
  return html;
}

// ── Bảng ────────────────────────────────────────────────────────────────
function convertTable(ctx, tblEl, state) {
  const rows = kids(tblEl, "tr");
  const grid = []; // grid[r] = mảng ô { col, html, colspan, rowspan, header, bg, bold }
  const mergeOriginByCol = new Map(); // cột -> ô gốc đang mở vMerge (restart)
  rows.forEach((tr) => {
    const trPr = kid(tr, "trPr");
    const isHeaderRow = Boolean(kid(trPr, "tblHeader"));
    const cells = [];
    let col = 0;
    for (const tc of kids(tr, "tc")) {
      const tcPr = kid(tc, "tcPr");
      const colspan = num(attr(kid(tcPr, "gridSpan"), "val"), 1) || 1;
      const vMerge = kid(tcPr, "vMerge");
      const isMergeStart = Boolean(vMerge) && attr(vMerge, "val") === "restart";
      const isMergeContinue = Boolean(vMerge) && attr(vMerge, "val") !== "restart";
      const shd = kid(tcPr, "shd");
      const fill = attr(shd, "fill");
      const bg = fill && fill.toLowerCase() !== "auto" ? `#${fill.toLowerCase()}` : undefined;
      if (isMergeContinue) {
        // Ô tiếp nối dọc (OOXML luôn ghi một w:tc rỗng cho vị trí này):
        // chỉ tăng rowspan của ô gốc, không sinh ô mới.
        const origin = mergeOriginByCol.get(col);
        if (origin) {
          origin.rowspan += 1;
          col += colspan;
          continue;
        }
        // Không tìm thấy ô gốc (file lỗi cấu trúc): rơi xuống xử lý như ô thường.
      }
      const innerBlocks = [];
      for (const child of tc.childNodes) {
        if (child.nodeType !== 1) continue;
        if (child.localName === "p") {
          const converted = convertParagraph(ctx, child, state);
          if (converted?.kind === "block") innerBlocks.push(converted.html);
          else if (converted?.kind === "listItem") innerBlocks.push(`<p>${converted.html}</p>`);
        } else if (child.localName === "tbl") {
          innerBlocks.push(convertTable(ctx, child, state));
        }
      }
      const joined = innerBlocks.join("");
      const plainText = joined.replace(/<[^>]+>/g, "").trim();
      const boldText = [...joined.matchAll(/<strong>([\s\S]*?)<\/strong>/g)]
        .map((m) => m[1].replace(/<[^>]+>/g, "")).join("").trim();
      const cell = {
        col, colspan, rowspan: 1,
        header: isHeaderRow,
        bg,
        html: joined || "<p></p>",
        bold: plainText.length > 0 && plainText === boldText,
      };
      if (isMergeStart) mergeOriginByCol.set(col, cell);
      else if (!isMergeContinue) mergeOriginByCol.delete(col);
      cells.push(cell);
      col += colspan;
    }
    grid.push(cells);
  });

  state.pageBreakAfter = false; // ngắt trang trong ô bảng không có nghĩa — bỏ cờ tránh rò ra ngoài
  const firstRow = grid[0] || [];
  const firstRowIsHeader = firstRow.length > 0 && (
    firstRow.some((c) => c.header) || firstRow.some((c) => c.bg) || firstRow.every((c) => c.bold)
  );
  const rowsHtml = grid.map((cells, ri) => {
    const tds = cells.map((c) => {
      const tag = (ri === 0 && firstRowIsHeader) || c.header ? "th" : "td";
      const attrs = [
        c.colspan > 1 ? ` colspan="${c.colspan}"` : "",
        c.rowspan > 1 ? ` rowspan="${c.rowspan}"` : "",
        c.bg ? ` style="background-color: ${c.bg}"` : "",
      ].join("");
      return `<${tag}${attrs}>${c.html}</${tag}>`;
    }).join("");
    return `<tr>${tds}</tr>`;
  }).join("\n");
  return `<table>\n${rowsHtml}\n</table>`;
}

// ── Điểm vào chính ──────────────────────────────────────────────────────
async function readZipText(zip, name) {
  const f = zip.file(name);
  return f ? f.async("string") : null;
}

export async function convertDocxToHtml(arrayBuffer) {
  let JSZip;
  try {
    JSZip = (await import("jszip")).default;
  } catch (err) {
    throw new Error(`Không nạp được bộ đọc .docx: ${err?.message || err}`, { cause: err });
  }
  let zip;
  try {
    zip = await JSZip.loadAsync(arrayBuffer);
  } catch (err) {
    throw new Error("File .docx không đọc được (không phải gói Word hợp lệ).", { cause: err });
  }
  const documentXml = await readZipText(zip, "word/document.xml");
  if (!documentXml) throw new Error("File .docx thiếu phần nội dung chính (word/document.xml).");

  const [stylesXml, numberingXml, relsXml, themeXml] = await Promise.all([
    readZipText(zip, "word/styles.xml"),
    readZipText(zip, "word/numbering.xml"),
    readZipText(zip, "word/_rels/document.xml.rels"),
    readZipText(zip, "word/theme/theme1.xml"),
  ]);

  const themeFonts = { major: null, minor: null };
  if (themeXml) {
    const themeDoc = parseXml(themeXml, "theme");
    for (const el of themeDoc.getElementsByTagName("*")) {
      if (el.localName === "latin" && el.parentNode) {
        const kind = el.parentNode.localName;
        if (kind === "majorFont") themeFonts.major = el.getAttribute("typeface");
        if (kind === "minorFont") themeFonts.minor = el.getAttribute("typeface");
      }
    }
  }

  const stylesInfo = loadStyles(stylesXml ? parseXml(stylesXml, "styles.xml") : null);
  const numbering = loadNumbering(numberingXml ? parseXml(numberingXml, "numbering.xml") : null);
  const rels = loadRels(relsXml ? parseXml(relsXml, "document.xml.rels") : null);

  // Ảnh nhúng → data URI.
  const media = new Map();
  for (const rel of rels.values()) {
    if (!/\/image$/.test(rel.type) && !rel.type.endsWith("/image")) continue;
    const target = rel.target.replace(/^\//, "").replace(/^word\//, "");
    const ext = target.split(".").pop()?.toLowerCase();
    const mime = IMAGE_MIME[ext];
    const file = zip.file(`word/${target}`);
    if (!file || !mime) continue;
    const b64 = await file.async("base64");
    media.set(target, `data:${mime};base64,${b64}`);
    media.set(`word/${target}`, `data:${mime};base64,${b64}`);
  }

  const ctx = { stylesInfo, numbering, rels, media, themeFonts };
  const state = { flags: {}, pageBreakAfter: false };
  const doc = parseXml(documentXml, "document.xml");
  const body = doc.getElementsByTagNameNS("*", "body")[0] || doc.documentElement;

  const out = [];
  let listBuffer = [];
  const flushList = () => {
    if (listBuffer.length) { out.push(buildListHtml(listBuffer)); listBuffer = []; }
  };
  const pushBlock = (html) => {
    out.push(html);
    if (state.pageBreakAfter) { out.push('<hr class="page-break">'); state.pageBreakAfter = false; }
  };

  for (const child of body.childNodes) {
    if (child.nodeType !== 1) continue;
    if (child.localName === "p") {
      const converted = convertParagraph(ctx, child, state);
      if (!converted) continue;
      if (converted.kind === "listItem") {
        const last = listBuffer[listBuffer.length - 1];
        if (last && last.numId !== converted.numId && converted.ilvl <= last.ilvl) flushList();
        listBuffer.push(converted);
      } else {
        flushList();
        pushBlock(converted.html);
      }
      if (state.pageBreakAfter) {
        flushList();
        out.push('<hr class="page-break">');
        state.pageBreakAfter = false;
      }
    } else if (child.localName === "tbl") {
      flushList();
      pushBlock(convertTable(ctx, child, state));
    } else if (child.localName === "sectPr") {
      // Thuộc tính section cuối tài liệu — bỏ qua (trang xem trước chảy liên tục).
    }
  }
  flushList();

  // ── Cảnh báo trung thực ──
  const warnings = [];
  for (const rel of rels.values()) {
    const isHeader = rel.type.endsWith("/header");
    const isFooter = rel.type.endsWith("/footer");
    if (!isHeader && !isFooter) continue;
    const target = rel.target.replace(/^\//, "").replace(/^word\//, "");
    const xml = await readZipText(zip, `word/${target}`);
    if (!xml) continue;
    const partDoc = parseXml(xml, target);
    const text = [...partDoc.getElementsByTagNameNS("*", "t")].map((t) => t.textContent).join("").trim();
    if (text) {
      warnings.push(`File có ${isHeader ? "đầu trang" : "chân trang"} («${text.slice(0, 60)}») — phần này không hiển thị trong bản xem trước một trang liên tục.`);
    }
  }
  if (state.flags.formula) warnings.push("File có công thức toán (OMML) — đã chuyển thành chữ thường trong dấu nghiêng, hãy kiểm tra lại.");
  if (state.flags.textbox) warnings.push("File có hộp văn bản (text box) — nội dung đã được đưa vào luồng văn bản chính, vị trí có thể khác bản gốc.");
  if (state.flags.shape) warnings.push("File có hình vẽ/đồ hoạ không nhúng được (shape hoặc ảnh định dạng EMF/WMF) — đã bỏ qua.");
  if (state.flags.footnote) warnings.push("File có chú thích cuối trang/cuối bài (footnote/endnote) — nội dung chú thích chưa được đưa vào.");
  if (state.flags.field) warnings.push("File có trường tự động (field, ví dụ mục lục tự cập nhật) — đã lấy nội dung đang hiển thị trong file thay cho kết quả tự cập nhật.");

  return { html: out.join("\n"), warnings };
}
