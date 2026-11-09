// importers.js — Phân tích file giáo viên tải lên thành mã nguồn HTML/JSON
// của Teacher Document Studio.
//
// Hỗ trợ:
//   • .docx  → docxImporter (đọc thẳng OOXML, giữ định dạng trực tiếp của
//     Word: căn lề/cỡ chữ/font/giãn đoạn/bảng gộp ô/ảnh nhúng data URI)
//   • .pptx  → JSZip + DOMParser (đọc theo từng shape: placeholder/hộp
//     chữ/ảnh/bảng + ghi chú thuyết trình + tỷ lệ slide)
//   • .html/.htm → giữ nguyên hoặc chuyển sang JSON
//   • .json  → validate schema hiện có rồi chuyển sang HTML nếu cần
//   • .txt/.md → chuyển các dòng có cấu trúc đơn giản thành tài liệu
//
// Nguyên tắc an toàn: file lỗi/không đọc được trả lỗi có thông báo rõ,
// KHÔNG tạo tài liệu rỗng. Không chạy JavaScript trong file HTML tải lên.
import { applyJsonSource, convertSource } from "./convert.js";
import { validateDocumentJson } from "./schemas.js";
import {
  DEFAULT_PRESENTATION_THEME,
  DEFAULT_WORD_THEME,
  escapeHtml,
} from "./modelRender.js";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

const extOf = (name) => String(name || "").toLowerCase().split(".").pop() || "";
const baseName = (name) => String(name || "Tài liệu nhập").replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();

function wrapWordHtml(fragment, title) {
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title || "Tài liệu nhập")}</title>
<style>
  body { margin: 0; background: #d8d3c8; font-family: Arial, Helvetica, sans-serif; }
  .doc-page { width: 794px; min-height: 1123px; margin: 0 auto; padding: 72px; background: #fff; color: #111827; font-size: 16px; line-height: 1.6; }
  .doc-page table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  .doc-page th, .doc-page td { border: 1px solid #9ca3af; padding: 6px 10px; vertical-align: top; }
  .doc-page img { max-width: 100%; height: auto; }
  .doc-page hr.page-break { border: 0; border-top: 2px dashed #b6ad9c; margin: 30px 0; }
</style>
</head>
<body>
<div class="doc-page">${fragment || "<p></p>"}</div>
</body>
</html>`;
}

function normalizeHtml(source) {
  const text = String(source || "").trim();
  if (!text) return "";
  if (/<html[\s>]/i.test(text) || /<!doctype/i.test(text)) return text;
  return wrapWordHtml(text, "Tài liệu HTML");
}

function detectHtmlDocType(source) {
  const sections = (source.match(/<section\b/gi) || []).length;
  const slideClass = /class\s*=\s*["'][^"']*\bslide\b/i.test(source);
  const presentationHint = /presentation|powerpoint|slide/i.test(source);
  return (slideClass || (sections >= 2 && presentationHint)) ? "powerpoint" : "word";
}

function errorsText(errors) {
  return (errors || []).map((e) => e.message || String(e)).filter(Boolean).join("\n");
}

function docTypeOfJson(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (obj.type === "presentation" || Array.isArray(obj.slides)) return "powerpoint";
  if (obj.type === "document" || Array.isArray(obj.blocks)) return "word";
  return null;
}

async function readDocx(file) {
  let convertDocxToHtml;
  try {
    ({ convertDocxToHtml } = await import("./docxImporter.js"));
  } catch (err) {
    throw new Error(`Không nạp được bộ đọc .docx: ${err?.message || err}`, { cause: err });
  }
  const arrayBuffer = await file.arrayBuffer();
  const result = await convertDocxToHtml(arrayBuffer);
  return { html: wrapWordHtml(result.html, baseName(file.name)), warnings: result.warnings || [], docType: "word" };
}

function textOf(el) {
  return String(el?.textContent || "").replace(/\s+/g, " ").trim();
}

function parseSlideTable(tbl) {
  const rows = Array.from(tbl.getElementsByTagName("a:tr"));
  return rows.map((tr) => {
    const cells = [];
    for (const tc of Array.from(tr.getElementsByTagName("a:tc"))) {
      const parts = Array.from(tc.getElementsByTagName("a:p")).map(textOf).filter(Boolean);
      cells.push(parts.join(" / "));
      // Ô gộp ngang (gridSpan) chiếm nhiều cột — đệm ô trống để các hàng
      // thẳng cột với nhau khi hiển thị/xuất lại.
      const span = Number(tc.getAttribute("gridSpan") || 1);
      for (let k = 1; k < span; k += 1) cells.push("");
    }
    return cells;
  }).filter((row) => row.some((c) => c));
}

// ── Bộ đọc .pptx theo từng SHAPE (đợt nâng cấp Document Studio) ───────
// Bộ đọc cũ gom MỌI đoạn a:p trên slide rồi đoán: chữ trong bảng bị hút
// trùng vào nội dung, số trang/dòng meta do trình xuất sinh ra lẫn vào
// bài, còn ảnh và ghi chú thuyết trình thì mất hẳn — tất cả đều im lặng
// (đã kiểm chứng bằng vòng khứ hồi xuất→nhập trong đợt nâng cấp).
// Bộ đọc mới duyệt cây shape (p:spTree) theo đúng thứ tự tài liệu và
// phân loại từng shape: placeholder (tiêu đề/phụ đề/thân), hộp chữ tự
// do (phân loại theo vị trí + cỡ chữ), ảnh (p:pic → relationships →
// file media → data URI), bảng (p:graphicFrame/a:tbl). Ghi chú đọc từ
// notesSlide liên kết; tỷ lệ slide đọc từ p:sldSz của presentation.xml.
// Mọi phần mô hình JSON không chứa được đều có cảnh báo trung thực.

const IMAGE_MIME_BY_EXT = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  bmp: "image/bmp", svg: "image/svg+xml", webp: "image/webp",
  tif: "image/tiff", tiff: "image/tiff",
};
// Ảnh nhúng thành data URI ngay trong mã nguồn JSON; máy chủ chỉ lưu mã
// nguồn ≤ 1MB nên ảnh quá lớn không nhúng được (base64 phình ~1,37 lần).
const MAX_EMBED_IMAGE_B64 = 700000;

/** Đọc thuộc tính theo tên địa phương (bỏ qua tiền tố namespace, vd r:embed). */
function attrByLocalName(el, local) {
  if (!el?.attributes) return "";
  for (let i = 0; i < el.attributes.length; i += 1) {
    const a = el.attributes[i];
    if (a.name === local || a.name.endsWith(`:${local}`)) return a.value || "";
  }
  return "";
}

const firstDesc = (el, tag) => el?.getElementsByTagName(tag)?.[0] || null;

function childEl(el, tag) {
  if (!el) return null;
  for (const n of el.childNodes || []) if (n.nodeType === 1 && n.tagName === tag) return n;
  return null;
}

const dirOfPath = (p) => String(p || "").split("/").slice(0, -1).join("/");
const baseOfPath = (p) => String(p || "").split("/").pop() || "";

function parseRelsXml(parser, xml) {
  const map = new Map();
  if (!xml) return map;
  const doc = parser.parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) return map;
  for (const rel of Array.from(doc.getElementsByTagName("Relationship"))) {
    const id = rel.getAttribute("Id");
    if (id) map.set(id, { target: rel.getAttribute("Target") || "", type: rel.getAttribute("Type") || "" });
  }
  return map;
}

/** Chuẩn hoá target của một relationship về đường dẫn key trong zip. */
function resolvePartPath(baseDir, target) {
  const t = String(target || "").replace(/\\/g, "/");
  if (!t) return "";
  const parts = t.startsWith("/") ? [] : baseDir.split("/").filter(Boolean);
  for (const seg of t.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return parts.join("/");
}

/** Các shape nội dung của một cây shape, giữ đúng thứ tự tài liệu (nhóm thì duyệt vào trong). */
function collectShapes(spTree) {
  const out = [];
  const walk = (parent) => {
    for (const node of parent.childNodes || []) {
      if (node.nodeType !== 1) continue;
      if (node.tagName === "p:grpSp") walk(node);
      else if (node.tagName === "p:sp" || node.tagName === "p:pic" || node.tagName === "p:graphicFrame") out.push(node);
    }
  };
  if (spTree) walk(spTree);
  return out;
}

/** Đoạn văn trong một shape: chữ, cấp danh sách, cỡ chữ lớn nhất (pt), có định dạng đậm/nghiêng, có bullet. */
function shapeParagraphs(sp) {
  const txBody = firstDesc(sp, "p:txBody");
  if (!txBody) return [];
  const paras = [];
  for (const p of Array.from(txBody.getElementsByTagName("a:p"))) {
    let text = "";
    for (const t of Array.from(p.getElementsByTagName("a:t"))) text += t.textContent || "";
    text = text.replace(/\s+/g, " ").trim();
    if (!text) continue;
    const pPr = childEl(p, "a:pPr");
    let maxPt = 0;
    let styled = false;
    for (const rPr of Array.from(p.getElementsByTagName("a:rPr"))) {
      const sz = Number(rPr.getAttribute("sz") || 0);
      if (sz > maxPt) maxPt = sz / 100;
      if (rPr.getAttribute("b") === "1" || rPr.getAttribute("i") === "1") styled = true;
    }
    paras.push({
      text,
      level: Number(pPr?.getAttribute("lvl") || 0) || 0,
      maxPt,
      styled,
      hasBullet: Boolean(pPr && (firstDesc(pPr, "a:buChar") || firstDesc(pPr, "a:buAutoNum")) && !firstDesc(pPr, "a:buNone")),
    });
  }
  return paras;
}

/** Khung hình học của shape (EMU như trong file), null khi không có toạ độ. */
function shapeGeometry(sp) {
  const xfrm = firstDesc(sp, "a:xfrm");
  const off = xfrm ? childEl(xfrm, "a:off") : null;
  const ext = xfrm ? childEl(xfrm, "a:ext") : null;
  if (!off || !ext) return null;
  const g = {
    x: Number(off.getAttribute("x") || 0), y: Number(off.getAttribute("y") || 0),
    cx: Number(ext.getAttribute("cx") || 0), cy: Number(ext.getAttribute("cy") || 0),
  };
  return g.cx > 0 && g.cy > 0 ? g : null;
}

/** Placeholder của shape: { type, idx } ("title"/"body"/"subTitle"…), null nếu là hộp chữ tự do. */
function placeholderOf(sp) {
  const nvPr = firstDesc(sp, "p:nvPr");
  const ph = nvPr ? childEl(nvPr, "p:ph") : null;
  if (!ph) return null;
  return { type: ph.getAttribute("type") || "body", idx: Number(ph.getAttribute("idx") || 0) || 0 };
}

function placeholderType(sp) {
  return placeholderOf(sp)?.type ?? null;
}

/** Ghi chú thuyết trình: chữ trong placeholder thân của notesSlide liên kết. */
async function readSlideNotes(zip, parser, notesPath) {
  const file = notesPath ? zip.file(notesPath) : null;
  if (!file) return "";
  const doc = parser.parseFromString(await file.async("string"), "application/xml");
  if (doc.getElementsByTagName("parsererror").length) return "";
  const lines = [];
  for (const sp of collectShapes(firstDesc(doc, "p:spTree"))) {
    if (sp.tagName !== "p:sp") continue;
    const ph = placeholderType(sp);
    if (ph && ph !== "body") continue; // bỏ khung ảnh slide thu nhỏ, chân trang của trang ghi chú
    for (const p of shapeParagraphs(sp)) {
      if (ph !== "body" && /^\d{1,3}$/.test(p.text)) continue; // số trang của trang ghi chú
      lines.push(p.text);
    }
  }
  return lines.join("\n").trim();
}

async function readPptx(file) {
  let JSZip;
  try {
    JSZip = (await import("jszip")).default;
  } catch (err) {
    throw new Error(`Không nạp được bộ đọc .pptx: ${err?.message || err}`, { cause: err });
  }
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const parser = new DOMParser();

  // Kích thước + thứ tự slide chuẩn lấy từ ppt/presentation.xml
  // (p:sldSz + danh sách p:sldId trỏ qua relationships). Dự phòng khi
  // thiếu: thứ tự số trong tên file ppt/slides/slideN.xml.
  let slideW = 12192000; // EMU — mặc định 16:9
  let slideH = 6858000;
  let slidePaths = [];
  const presFile = zip.file("ppt/presentation.xml");
  if (presFile) {
    const presDoc = parser.parseFromString(await presFile.async("string"), "application/xml");
    const sldSz = firstDesc(presDoc, "p:sldSz");
    if (sldSz) {
      slideW = Number(sldSz.getAttribute("cx")) || slideW;
      slideH = Number(sldSz.getAttribute("cy")) || slideH;
    }
    const presRelsFile = zip.file("ppt/_rels/presentation.xml.rels");
    const presRels = parseRelsXml(parser, presRelsFile ? await presRelsFile.async("string") : "");
    for (const sldId of Array.from(presDoc.getElementsByTagName("p:sldId"))) {
      const rel = presRels.get(attrByLocalName(sldId, "id"));
      const p = rel ? resolvePartPath("ppt", rel.target) : "";
      if (p && zip.file(p)) slidePaths.push(p);
    }
  }
  if (!slidePaths.length) {
    slidePaths = Object.keys(zip.files)
      .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
      .sort((a, b) => Number(a.match(/slide(\d+)\.xml$/)?.[1] || 0) - Number(b.match(/slide(\d+)\.xml$/)?.[1] || 0));
  }
  if (!slidePaths.length) throw new Error("File .pptx không có slide nào.");
  const ratioValue = slideW / slideH;
  const ratio = Math.abs(Math.log(ratioValue / (16 / 9))) <= Math.abs(Math.log(ratioValue / (4 / 3))) ? "16:9" : "4:3";

  const warnings = [];
  let sawStyledRun = false;
  let sawLevel = false;
  let meta = null; // { subject, grade } đọc từ dòng meta "Môn • Lớp N" trên slide tiêu đề
  const slides = [];

  for (let i = 0; i < slidePaths.length; i += 1) {
    const slidePath = slidePaths[i];
    const label = `Slide ${i + 1}`;
    const doc = parser.parseFromString(await zip.file(slidePath).async("string"), "application/xml");
    if (doc.getElementsByTagName("parsererror").length) {
      warnings.push(`${label}: không đọc được XML của slide, đã bỏ qua slide này.`);
      continue;
    }
    const slideDir = dirOfPath(slidePath);
    const relsFile = zip.file(`${slideDir}/_rels/${baseOfPath(slidePath)}.rels`);
    const rels = parseRelsXml(parser, relsFile ? await relsFile.async("string") : "");
    let notesPath = "";
    for (const rel of rels.values()) {
      if (rel.type.endsWith("/notesSlide")) { notesPath = resolvePartPath(slideDir, rel.target); break; }
    }
    const notes = await readSlideNotes(zip, parser, notesPath);

    const texts = []; // { role: "title"|"subtitle"|"body"|"free", paras, geom, maxPt }
    const pics = []; // { dataUri } hoặc { oversized: true, name }
    const tables = [];
    let otherGraphics = 0;

    for (const shape of collectShapes(firstDesc(doc, "p:spTree"))) {
      if (shape.tagName === "p:pic") {
        const cNvPr = firstDesc(shape, "p:cNvPr");
        const picName = cNvPr?.getAttribute("name") || "ảnh";
        const descr = cNvPr?.getAttribute("descr") || "";
        const blip = firstDesc(shape, "a:blip");
        const rel = blip ? rels.get(attrByLocalName(blip, "embed")) : null;
        if (rel && /\/video$|\/media$/.test(rel.type)) {
          warnings.push(`${label}: có video/phương tiện nhúng — không đưa vào tài liệu được, đã bỏ qua.`);
          continue;
        }
        const mediaPath = rel ? resolvePartPath(slideDir, rel.target) : "";
        const mime = IMAGE_MIME_BY_EXT[extOf(mediaPath)];
        if (!mime) {
          warnings.push(`${label}: ảnh "${picName}" có định dạng không hiển thị được trên web — đã bỏ qua ảnh này.`);
          continue;
        }
        const mediaFile = mediaPath ? zip.file(mediaPath) : null;
        if (!mediaFile) {
          warnings.push(`${label}: không tìm thấy dữ liệu của ảnh "${picName}" trong file — đã bỏ qua.`);
          continue;
        }
        const b64 = await mediaFile.async("base64");
        if (b64.length > MAX_EMBED_IMAGE_B64) pics.push({ oversized: true, name: picName });
        else pics.push({ dataUri: `data:${mime};base64,${b64}`, name: picName, descr });
        continue;
      }
      if (shape.tagName === "p:graphicFrame") {
        const tbl = firstDesc(shape, "a:tbl");
        if (tbl) {
          const rows = parseSlideTable(tbl);
          if (rows.length) tables.push(rows);
        } else otherGraphics += 1;
        continue;
      }
      // p:sp — hộp chữ / placeholder
      const phInfo = placeholderOf(shape);
      const ph = phInfo?.type ?? null;
      if (ph === "dt" || ph === "ftr" || ph === "sldNum") continue; // ngày tháng/chân trang/số trang có sẵn
      const paras = shapeParagraphs(shape);
      if (!paras.length) continue; // khung trang trí không chữ (thanh màu…) — bỏ qua tự nhiên
      const geom = shapeGeometry(shape);
      const role = ph === "title" || ph === "ctrTitle" ? "title"
        : ph === "subTitle" ? "subtitle" : ph === "body" ? "body" : "free";
      // Số trang dạng hộp chữ nhỏ ở đáy slide (cả file do app xuất lẫn
      // file PowerPoint thường) là trang trí, không phải nội dung.
      if (role === "free" && geom && paras.length === 1 && /^\d{1,3}$/.test(paras[0].text)
        && geom.y > slideH * 0.78 && geom.cy < slideH * 0.09) continue;
      paras.forEach((p) => { if (p.level > 0) sawLevel = true; });
      texts.push({ role, paras, geom, phIdx: phInfo?.idx ?? null, maxPt: Math.max(...paras.map((p) => p.maxPt), 0) });
    }

    if (otherGraphics) {
      warnings.push(`${label}: chứa biểu đồ/SmartArt — phần này không chuyển được thành nội dung tài liệu; chỉ giữ lại chữ, bảng và ảnh.`);
    }
    for (const p of pics) {
      if (p.oversized) {
        warnings.push(`${label}: ảnh "${p.name}" quá lớn (trên ~500 KB) — không nhúng được vì mã nguồn tài liệu giới hạn 1 MB khi lưu. Hãy nén ảnh rồi chèn lại trong editor.`);
      }
    }

    // ── Phân loại slide ──────────────────────────────────────────────
    // Tiêu đề: placeholder title > hộp chữ có cỡ chữ lớn nhất (hoà thì
    // hộp nằm cao hơn thắng). Các hộp còn lại là thân bài theo thứ tự.
    let titleIdx = texts.findIndex((t) => t.role === "title");
    if (titleIdx < 0 && texts.length) {
      let best = -1;
      texts.forEach((t, ti) => {
        if (t.role === "subtitle") return;
        if (best < 0) { best = ti; return; }
        const b = texts[best];
        if (t.maxPt > b.maxPt + 0.5) best = ti;
        else if (Math.abs(t.maxPt - b.maxPt) <= 0.5 && (t.geom?.y ?? Infinity) < (b.geom?.y ?? Infinity)) best = ti;
      });
      titleIdx = best;
    }
    // Định dạng đậm/nghiêng trực tiếp trong THÂN bài mới là mất mát cần
    // cảnh báo — tiêu đề in đậm là cấu trúc bình thường của slide.
    texts.forEach((t, ti) => {
      if (ti !== titleIdx && t.paras.some((p) => p.styled)) sawStyledRun = true;
    });
    let title = "";
    let subtitle = "";
    const bodyGroups = []; // { paras, geom } giữ thứ tự tài liệu
    texts.forEach((t, ti) => {
      if (ti === titleIdx) { title = t.paras.map((p) => p.text).join(" "); return; }
      if (t.role === "subtitle" && !subtitle && titleIdx >= 0) { subtitle = t.paras.map((p) => p.text).join(" "); return; }
      bodyGroups.push(t);
    });
    const groupItems = (g) => g.paras.map((p) => (p.level > 0 ? `— ${p.text}` : p.text));
    const allItems = bodyGroups.flatMap(groupItems);
    const withNotes = (s) => (notes ? { ...s, notes } : s);
    const goodPics = pics.filter((p) => p.dataUri);

    if (goodPics.length) {
      const first = goodPics[0];
      const caption = bodyGroups.flatMap((g) => g.paras.map((p) => p.text)).join(" ");
      slides.push(withNotes({
        type: "image",
        ...(title ? { title } : {}),
        src: first.dataUri,
        ...(first.descr ? { alt: first.descr } : {}),
        ...(caption ? { caption } : {}),
      }));
      goodPics.slice(1).forEach((p) => {
        slides.push({ type: "image", ...(title ? { title } : {}), src: p.dataUri, ...(p.descr ? { alt: p.descr } : {}) });
      });
      if (goodPics.length > 1) {
        warnings.push(`${label}: có ${goodPics.length} ảnh — ảnh đầu tiên nằm ở slide này, các ảnh còn lại tách thành slide hình ảnh riêng ngay sau.`);
      }
      continue;
    }

    if (tables.length) {
      const slide = { type: "table", ...(title ? { title } : {}), rows: tables[0] };
      if (allItems.length) {
        // Mô hình slide bảng không có ô chứa chữ đi kèm — giữ tạm trong
        // trường "content" của mã JSON kèm cảnh báo (preview/xuất chỉ
        // hiện bảng), thay vì nuốt mất như bộ đọc cũ.
        slide.content = allItems;
        warnings.push(`${label}: dòng chữ đi kèm bảng được giữ trong trường "content" của mã JSON — bản xem trước và file xuất ra chỉ hiện bảng.`);
      }
      slides.push(withNotes(slide));
      tables.slice(1).forEach((rows, k) => {
        slides.push({ type: "table", title: title ? `${title} (bảng ${k + 2})` : `Bảng ${k + 2}`, rows });
      });
      if (tables.length > 1) warnings.push(`${label}: có ${tables.length} bảng — mỗi bảng tách thành một slide bảng riêng.`);
      continue;
    }

    // Slide mở đầu: tiêu đề lớn + phụ đề (không bullet, ít dòng) → slide
    // tiêu đề; dòng meta "Môn • Lớp N" (do chính app ghi khi xuất) được
    // đọc ngược thành môn/lớp của bài thay vì lẫn vào nội dung.
    const hasBullets = texts.some((t) => t.paras.some((p) => p.hasBullet));
    const isTitleSlide = i === 0 && texts.length > 0
      && (Boolean(subtitle) || (!hasBullets && allItems.length <= 2 && texts.length <= 3));
    if (isTitleSlide) {
      let sub = subtitle;
      const rest = [...bodyGroups];
      if (!sub && rest.length) { sub = rest.shift().paras.map((p) => p.text).join(" "); }
      const extras = [];
      for (const g of rest) {
        for (const p of g.paras) {
          const mA = /^(.*?)\s*•\s*Lớp\s*(\d{1,2})$/.exec(p.text);
          const mB = /^Lớp\s*(\d{1,2})$/.exec(p.text);
          if (!meta && mA) { meta = { subject: mA[1].trim(), grade: Number(mA[2]) }; continue; }
          if (!meta && mB) { meta = { subject: "", grade: Number(mB[1]) }; continue; }
          extras.push(p.text);
        }
      }
      const subtitleFinal = [sub, ...extras].filter(Boolean).join(" · ");
      slides.push(withNotes({
        type: "title",
        title: title || baseName(file.name),
        ...(subtitleFinal ? { subtitle: subtitleFinal } : {}),
      }));
      continue;
    }

    // Hai cột: đúng 2 nhóm thân bài. Ưu tiên vị trí thật (hai hộp nằm hai
    // phía của trục giữa, chồng nhau theo chiều dọc). Placeholder của
    // PowerPoint thường KHÔNG mang toạ độ riêng (kế thừa từ layout) —
    // trường hợp đó, layout có đúng 2 placeholder thân bài chính là bố
    // cục "Hai nội dung" quen thuộc: xếp cột theo chỉ số placeholder.
    if (bodyGroups.length === 2) {
      const [g1, g2] = bodyGroups;
      let left = null;
      let right = null;
      if (g1.geom && g2.geom) {
        const c1 = g1.geom.x + g1.geom.cx / 2;
        const c2 = g2.geom.x + g2.geom.cx / 2;
        const overlapY = Math.min(g1.geom.y + g1.geom.cy, g2.geom.y + g2.geom.cy) - Math.max(g1.geom.y, g2.geom.y);
        const sideBySide = overlapY > 0.4 * Math.min(g1.geom.cy, g2.geom.cy)
          && ((c1 < slideW / 2 && c2 > slideW / 2) || (c2 < slideW / 2 && c1 > slideW / 2));
        if (sideBySide) [left, right] = c1 < c2 ? [g1, g2] : [g2, g1];
      } else if (!g1.geom && !g2.geom && g1.role === "body" && g2.role === "body") {
        [left, right] = (g1.phIdx ?? 0) <= (g2.phIdx ?? 0) ? [g1, g2] : [g2, g1];
      }
      if (left && right) {
        slides.push(withNotes({
          type: "two-column",
          title: title || label,
          left: groupItems(left),
          right: groupItems(right),
        }));
        continue;
      }
    }

    slides.push(withNotes({
      type: "content",
      title: title || label,
      content: allItems,
    }));
  }

  if (sawLevel) {
    warnings.push("Một số mục danh sách có cấp lồng nhau — cấp được giữ bằng tiền tố “— ” ở đầu mục vì mô hình JSON không có cấp danh sách.");
  }
  if (sawStyledRun) {
    warnings.push("Định dạng trực tiếp trong đoạn văn (đậm/nghiêng) không có chỗ trong mô hình JSON — chữ được giữ nguyên, định dạng hiển thị sẽ theo chủ đề của bài.");
  }
  warnings.push("Màu nền và chủ đề gốc của file PowerPoint không được giữ — bài dùng chủ đề mặc định của Document Studio (có thể sửa trường \"theme\" trong mã JSON).");

  const json = {
    type: "presentation",
    title: baseName(file.name),
    subject: meta?.subject || "Tài liệu nhập",
    grade: meta?.grade || 8,
    theme: DEFAULT_PRESENTATION_THEME,
    slides: slides.length ? slides : [{ type: "title", title: baseName(file.name) }],
  };
  return { json, warnings, docType: "powerpoint", ratio };
}

function textToBlocks(text) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];
  const flushParagraph = () => {
    const t = paragraph.join(" ").trim();
    if (t) blocks.push({ type: "paragraph", text: t });
    paragraph = [];
  };
  const flushList = () => {
    const items = list.map((x) => x.trim()).filter(Boolean);
    if (items.length) blocks.push({ type: "list", ordered: false, items });
    list = [];
  };
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); return; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() });
      return;
    }
    if (/^[-*•]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*•]\s+/, ""));
      return;
    }
    flushList();
    paragraph.push(line);
  });
  flushParagraph(); flushList();
  if (!blocks.length) blocks.push({ type: "paragraph", text: String(text || "").trim() || "Tài liệu trống." });
  return blocks;
}

function textToPresentation(text, title) {
  const blocks = textToBlocks(text);
  const slides = [];
  let current = null;
  blocks.forEach((b) => {
    if (b.type === "heading" && (b.level <= 2 || !current)) {
      current = { type: "content", title: b.text, content: [] };
      slides.push(current);
    } else if (b.type === "list") {
      if (!current) { current = { type: "content", title, content: [] }; slides.push(current); }
      current.content.push(...b.items);
    } else {
      if (!current) { current = { type: "content", title, content: [] }; slides.push(current); }
      current.content.push(b.text);
    }
  });
  if (!slides.length) slides.push({ type: "title", title, subtitle: "Bài trình chiếu nhập từ văn bản" });
  else if (!slides[0].content?.length) slides.unshift({ type: "title", title, subtitle: "Bài trình chiếu nhập từ văn bản" });
  return {
    type: "presentation",
    title,
    subject: "Tài liệu nhập",
    grade: 8,
    theme: DEFAULT_PRESENTATION_THEME,
    slides,
  };
}

/**
 * Phân tích file. Trả:
 * { name, docType, mode, source, title, itemCount, warnings }
 */
export async function parseUploadedFile(file, { docType: wantedType, outputMode = "json" } = {}) {
  if (!file) throw new Error("Chưa chọn file.");
  if (file.size > MAX_FILE_BYTES) throw new Error("File vượt quá 25 MB. Vui lòng chọn file nhỏ hơn.");
  if (!file.size) throw new Error("File rỗng.");

  const ext = extOf(file.name);
  const name = baseName(file.name);
  let current;

  if (ext === "docx") {
    current = await readDocx(file);
  } else if (ext === "pptx") {
    current = await readPptx(file);
  } else if (ext === "html" || ext === "htm") {
    const source = normalizeHtml(await file.text());
    if (!source) throw new Error("File HTML không có nội dung.");
    current = { html: source, warnings: [], docType: detectHtmlDocType(source) };
  } else if (ext === "json") {
    const text = await file.text();
    let obj;
    try {
      obj = JSON.parse(text);
    } catch (e) {
      throw new Error(`JSON sai cú pháp: ${e.message}`, { cause: e });
    }
    const detected = docTypeOfJson(obj);
    if (!detected) throw new Error("JSON không phải tài liệu Word (blocks) hoặc PowerPoint (slides).");
    const docType = wantedType || detected;
    const schemaErrors = validateDocumentJson(obj, docType);
    if (schemaErrors.length) throw new Error(`JSON không đúng cấu trúc ${docType}:\n${errorsText(schemaErrors)}`);
    current = { json: obj, rawJson: text, warnings: [], docType };
  } else if (ext === "txt" || ext === "md" || ext === "markdown") {
    const text = await file.text();
    if (!text.trim()) throw new Error("File văn bản không có nội dung.");
    current = wantedType === "powerpoint"
      ? { json: textToPresentation(text, name), warnings: [], docType: "powerpoint" }
      : { json: { type: "document", title: name, subject: "Tài liệu nhập", grade: 8, theme: DEFAULT_WORD_THEME, blocks: textToBlocks(text) }, warnings: [], docType: "word" };
  } else {
    throw new Error(`Chưa hỗ trợ định dạng .${ext || "?"}. Hãy dùng .docx, .pptx, .html, .json hoặc .txt/.md.`);
  }

  const docType = wantedType || current.docType;
  if (current.json && docType !== current.docType) {
    throw new Error(`Nội dung file là ${current.docType === "word" ? "Word" : "PowerPoint"}, không thể chuyển thành ${docType === "word" ? "Word" : "PowerPoint"} khi nhập.`);
  }

  // Chuẩn hoá về đúng chế độ người dùng chọn.
  let source;
  let model;
  let warnings = current.warnings || [];
  if (ext === "docx" && outputMode === "json") {
    // Mô hình JSON chỉ chứa được căn lề/màu/đậm-nghiêng — nói rõ phần định
    // dạng trực tiếp nào của Word chỉ sống trọn ở chế độ HTML, tránh giáo
    // viên tưởng file bị đọc thiếu.
    warnings = [...warnings,
      "Chế độ JSON giữ được tiêu đề, danh sách, bảng, căn lề, đậm/nghiêng và màu chữ từ file Word; " +
      "cỡ chữ, font chữ, giãn đoạn và thụt lề trực tiếp chỉ giữ trọn ở chế độ HTML."];
  }
  if (current.json) {
    if (outputMode === "json") {
      source = current.rawJson || JSON.stringify(current.json, null, 2);
      const applied = applyJsonSource(source, docType);
      if (!applied.ok) throw new Error(errorsText(applied.errors));
      model = applied.model;
    } else {
      const converted = convertSource(JSON.stringify(current.json, null, 2), "json", docType);
      if (!converted.ok) throw new Error(errorsText(converted.errors));
      source = converted.source;
      model = converted.model;
    }
  } else {
    if (outputMode === "html") {
      source = current.html;
      const converted = convertSource(source, "html", docType);
      if (!converted.ok) throw new Error(errorsText(converted.errors));
      model = converted.model;
      warnings = [...warnings, ...(converted.warnings || [])];
    } else {
      const converted = convertSource(current.html, "html", docType);
      if (!converted.ok) throw new Error(errorsText(converted.errors));
      source = converted.source;
      model = converted.model;
      warnings = [...warnings, ...(converted.warnings || [])];
    }
  }

  const itemCount = docType === "powerpoint"
    ? (model?.slides?.length || 0)
    : (model?.blocks?.length || 0);
  return {
    name,
    title: model?.title || name,
    docType,
    mode: outputMode,
    source,
    itemCount,
    warnings: Array.from(new Set(warnings)).slice(0, 20),
    // Chỉ .pptx mới suy được tỷ lệ slide từ file — editor dùng nó để đặt
    // lại tỷ lệ khung xem trước cho khớp file gốc.
    ...(current.ratio ? { ratio: current.ratio } : {}),
  };
}

export { detectHtmlDocType };
