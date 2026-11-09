// importers.js — Phân tích file giáo viên tải lên thành mã nguồn HTML/JSON
// của Teacher Document Studio.
//
// Hỗ trợ:
//   • .docx  → docxImporter (đọc thẳng OOXML, giữ định dạng trực tiếp của
//     Word: căn lề/cỡ chữ/font/giãn đoạn/bảng gộp ô/ảnh nhúng data URI)
//   • .pptx  → JSZip + DOMParser (đọc text/table trong từng slide)
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
  return rows.map((tr) => Array.from(tr.getElementsByTagName("a:tc")).map((tc) => {
    const parts = Array.from(tc.getElementsByTagName("a:p")).map(textOf).filter(Boolean);
    return parts.join(" / ");
  })).filter((row) => row.some((c) => c));
}

async function readPptx(file) {
  let JSZip;
  try {
    JSZip = (await import("jszip")).default;
  } catch (err) {
    throw new Error(`Không nạp được bộ đọc .pptx: ${err?.message || err}`, { cause: err });
  }
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideNames = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => {
      const na = Number(a.match(/slide(\d+)\.xml$/)?.[1] || 0);
      const nb = Number(b.match(/slide(\d+)\.xml$/)?.[1] || 0);
      return na - nb;
    });
  if (!slideNames.length) throw new Error("File .pptx không có slide nào.");

  const parser = new DOMParser();
  const slides = [];
  const warnings = [];
  for (let i = 0; i < slideNames.length; i += 1) {
    const xml = await zip.file(slideNames[i]).async("string");
    const doc = parser.parseFromString(xml, "application/xml");
    if (doc.getElementsByTagName("parsererror").length) {
      warnings.push(`${slideNames[i]}: không đọc được XML, đã bỏ qua.`);
      continue;
    }
    const paras = Array.from(doc.getElementsByTagName("a:p"))
      .map((p) => Array.from(p.getElementsByTagName("a:t")).map(textOf).join("").trim())
      .filter(Boolean);
    const tables = Array.from(doc.getElementsByTagName("a:tbl")).map(parseSlideTable).filter((r) => r.length);
    const title = paras[0] || `Slide ${i + 1}`;
    const content = paras.slice(1).filter((p) => p !== title);

    if (i === 0) {
      slides.push({
        type: "title",
        title,
        subtitle: content.shift() || "Bài trình chiếu được nhập từ PowerPoint",
      });
      if (content.length) slides.push({ type: "content", title: "Nội dung chính", content });
      continue;
    }
    if (tables.length) {
      slides.push({ type: "table", title, rows: tables[0], content });
    } else if (content.length >= 2) {
      slides.push({ type: "content", title, content });
    } else if (content.length === 1) {
      slides.push({ type: "content", title, content });
    } else {
      slides.push({ type: "title", title, subtitle: "Slide nhập từ PowerPoint" });
    }
  }

  const json = {
    type: "presentation",
    title: baseName(file.name),
    subject: "Tài liệu nhập",
    grade: 8,
    theme: DEFAULT_PRESENTATION_THEME,
    slides: slides.length ? slides : [{ type: "title", title: baseName(file.name) }],
  };
  return { json, warnings, docType: "powerpoint" };
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
  };
}

export { detectHtmlDocType };
