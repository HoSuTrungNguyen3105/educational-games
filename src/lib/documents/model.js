// model.js — Mô hình tài liệu TRUNG GIAN của Teacher Document Studio.
//
// Mọi đường đi đều qua mô hình này để không phải viết N×M bộ chuyển đổi:
//   HTML ──parse──▶ model ──render──▶ HTML (preview / chuyển chế độ)
//   JSON ──parse──▶ model ──export──▶ .docx (đợt 1) / .pptx (đợt 2)
//
// Word model:
//   { kind: "word", title, subject, grade, page?, blocks: [
//       { type: "heading", level: 1-3, text, runs?, color?, align?, font? },
//       { type: "paragraph", text, runs?, color?, align?, font? },
//       { type: "list", ordered, items: [string], align? },
//       { type: "table", rows: [[string]], colWidths?: [số %] },
//       { type: "image", src, alt },
//       { type: "pageBreak" },
//       { type: "signature", role?, name? } ] }
//   `page` = cấu hình trang + chữ mặc định (xem pageConfig.js) — field
//   TUỲ CHỌN, tài liệu cũ không có thì mọi hành vi giữ nguyên như trước.
//   Khối heading/paragraph/list còn giữ `lineHeight` (hệ số giãn dòng)
//   và `spacingAfter` (pt) khi giáo viên đặt riêng cho khối đó.
//   `runs` = [{ text, bold?, italic?, underline?, strike?, color?,
//   highlight? }] — định dạng inline theo từng đoạn chữ. Sinh ra khi
//   parse từ HTML có định dạng inline lẫn lộn VÀ khi giáo viên áp định
//   dạng bằng thanh công cụ ở chế độ Normal; JSON của giáo viên GIỮ
//   được runs qua cả hai chiều chuyển đổi (text luôn = gộp runs).
//
// Presentation model:
//   { kind: "presentation", title, subject, grade, slides: [
//       { type: "title", title, subtitle? },
//       { type: "content" | "summary", title, content: [string] },
//       { type: "image", title?, src, alt?, caption? },
//       { type: "two-column", title, left: [string], right: [string] },
//       { type: "table", title?, rows: [[string]] } ] }

import { normalizePageConfig } from "./pageConfig.js";

const str = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
const strArr = (v) => (Array.isArray(v) ? v.map(str) : []);
const rowsOf = (v) => (Array.isArray(v) ? v.filter(Array.isArray).map((r) => r.map(str)) : []);
const gradeOf = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : null;
};

// Theme là metadata MỞ RỘNG (không bắt buộc) để mẫu tài liệu giữ được
// nhận diện màu sắc/kiểu chữ khi đi qua cả hai chế độ. Không phải mọi
// tài liệu đều có theme — tài liệu giáo viên tự soạn vẫn dùng mặc định.
const THEME_KEYS = [
  "name", "accent", "accent2", "soft", "line", "ink", "muted", "bg",
  "heroBg", "heroText", "font", "displayFont", "variant", "pattern",
];
function themeOf(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const out = {};
  for (const key of THEME_KEYS) {
    if (typeof v[key] === "string" && v[key].trim()) out[key] = v[key].trim();
  }
  return Object.keys(out).length ? out : undefined;
}

/** Tên font an toàn: bỏ ký tự phá style/HTML, giới hạn độ dài. */
function fontOf(v) {
  if (typeof v !== "string") return undefined;
  const f = v.replace(/["'<>;{}]/g, "").trim().slice(0, 60);
  return f || undefined;
}

/** Runs inline từ JSON: chỉ giữ field hợp lệ; text được gộp lại ở styledBlock. */
function runsOf(v) {
  if (!Array.isArray(v)) return undefined;
  const out = [];
  for (const r of v) {
    if (!r || typeof r !== "object" || Array.isArray(r)) continue;
    const run = { text: str(r.text) };
    if (r.bold) run.bold = true;
    if (r.italic) run.italic = true;
    if (r.underline) run.underline = true;
    if (r.strike) run.strike = true;
    if (typeof r.color === "string" && r.color.trim()) run.color = r.color.trim();
    if (typeof r.highlight === "string" && r.highlight.trim()) run.highlight = r.highlight.trim();
    out.push(run);
  }
  return out.length ? out : undefined;
}

/** Giãn dòng + khoảng sau đoạn cấp khối — chỉ giữ khi là số hợp lệ. */
function spacingOf(block, out) {
  const lh = Number(block.lineHeight);
  if (Number.isFinite(lh) && lh >= 0.5 && lh <= 4) out.lineHeight = lh;
  const sa = Number(block.spacingAfter);
  if (block.spacingAfter !== undefined && Number.isFinite(sa) && sa >= 0 && sa <= 200) out.spacingAfter = sa;
  return out;
}

/** Bề rộng cột (%) của bảng — mảng số dương, bỏ qua nếu sai dạng. */
function colWidthsOf(v) {
  if (!Array.isArray(v)) return undefined;
  const out = v.map(Number).filter((n) => Number.isFinite(n) && n > 0);
  return out.length && out.length === v.length ? out : undefined;
}

/** Khối danh sách chỉ giữ thêm căn lề (items là text thuần, không runs). */
function styledList(block, base) {
  const out = { ...base };
  if (["left", "center", "right", "justify"].includes(block.align)) out.align = block.align;
  return spacingOf(block, out);
}

/** Chỉ giữ các thuộc tính định dạng khối mà model + exporter hiểu. */
function styledBlock(block, base) {
  const out = { ...base };
  if (typeof block.color === "string" && block.color.trim()) out.color = block.color.trim();
  if (["left", "center", "right", "justify"].includes(block.align)) out.align = block.align;
  const font = fontOf(block.font);
  if (font) out.font = font;
  const fs = Number(block.fontSize);
  if (Number.isFinite(fs) && fs > 0 && fs <= 200) out.fontSize = fs;
  const runs = runsOf(block.runs);
  if (runs) {
    out.runs = runs;
    out.text = runs.map((r) => r.text).join("");
  }
  return spacingOf(block, out);
}

// ── JSON ⇄ model ────────────────────────────────────────────────────────

export function wordJsonToModel(json) {
  const page = normalizePageConfig(json.page);
  return {
    kind: "word",
    title: str(json.title),
    subject: str(json.subject),
    grade: gradeOf(json.grade),
    ...(themeOf(json.theme) ? { theme: themeOf(json.theme) } : {}),
    ...(page ? { page } : {}),
    blocks: (Array.isArray(json.blocks) ? json.blocks : []).map((b) => {
      switch (b.type) {
        case "heading": return styledBlock(b, { type: "heading", level: [1, 2, 3].includes(b.level) ? b.level : 1, text: str(b.text) });
        case "paragraph": return styledBlock(b, { type: "paragraph", text: str(b.text) });
        case "list": return styledList(b, { type: "list", ordered: Boolean(b.ordered), items: strArr(b.items) });
        case "table": return { type: "table", rows: rowsOf(b.rows), ...(colWidthsOf(b.colWidths) ? { colWidths: colWidthsOf(b.colWidths) } : {}) };
        case "image": return { type: "image", src: str(b.src), alt: str(b.alt) };
        case "pageBreak": return { type: "pageBreak" };
        case "signature": return { type: "signature", role: str(b.role), name: str(b.name) };
        default: return { type: "paragraph", text: str(b.text) };
      }
    }),
  };
}

export function modelToWordJson(model) {
  const page = normalizePageConfig(model.page);
  return {
    type: "document",
    title: model.title || "",
    ...(model.subject ? { subject: model.subject } : {}),
    ...(model.grade ? { grade: model.grade } : {}),
    ...(model.theme ? { theme: model.theme } : {}),
    ...(page ? { page } : {}),
    blocks: (model.blocks || []).map((b) => {
      switch (b.type) {
        case "heading": return styledBlock(b, { type: "heading", level: b.level || 1, text: b.text || "" });
        case "paragraph": return styledBlock(b, { type: "paragraph", text: b.text || "" });
        case "list": return styledList(b, { type: "list", ordered: Boolean(b.ordered), items: [...(b.items || [])] });
        case "table": return { type: "table", rows: (b.rows || []).map((r) => [...r]), ...(colWidthsOf(b.colWidths) ? { colWidths: colWidthsOf(b.colWidths) } : {}) };
        case "image": return { type: "image", src: b.src || "", ...(b.alt ? { alt: b.alt } : {}) };
        case "pageBreak": return { type: "pageBreak" };
        case "signature": return {
          type: "signature",
          ...(b.role ? { role: b.role } : {}),
          ...(b.name ? { name: b.name } : {}),
        };
        default: return { type: "paragraph", text: b.text || "" };
      }
    }),
  };
}

export function presentationJsonToModel(json) {
  return {
    kind: "presentation",
    title: str(json.title),
    subject: str(json.subject),
    grade: gradeOf(json.grade),
    ...(themeOf(json.theme) ? { theme: themeOf(json.theme) } : {}),
    slides: (Array.isArray(json.slides) ? json.slides : []).map((s) => {
      const notes = str(s.notes);
      switch (s.type) {
        case "title": return { type: "title", title: str(s.title), subtitle: str(s.subtitle), ...(notes ? { notes } : {}) };
        case "content": return { type: "content", title: str(s.title), content: strArr(s.content), ...(notes ? { notes } : {}) };
        case "summary": return { type: "summary", title: str(s.title), content: strArr(s.content), ...(notes ? { notes } : {}) };
        case "image": return { type: "image", title: str(s.title), src: str(s.src), alt: str(s.alt), caption: str(s.caption), ...(notes ? { notes } : {}) };
        case "two-column": return { type: "two-column", title: str(s.title), left: strArr(s.left), right: strArr(s.right), ...(notes ? { notes } : {}) };
        case "table": return { type: "table", title: str(s.title), rows: rowsOf(s.rows), ...(notes ? { notes } : {}) };
        default: return { type: "content", title: str(s.title), content: strArr(s.content), ...(notes ? { notes } : {}) };
      }
    }),
  };
}

export function modelToPresentationJson(model) {
  return {
    type: "presentation",
    title: model.title || "",
    ...(model.subject ? { subject: model.subject } : {}),
    ...(model.grade ? { grade: model.grade } : {}),
    ...(model.theme ? { theme: model.theme } : {}),
    slides: (model.slides || []).map((s) => {
      const notes = s.notes ? { notes: s.notes } : {};
      switch (s.type) {
        case "title": return { type: "title", title: s.title || "", ...(s.subtitle ? { subtitle: s.subtitle } : {}), ...notes };
        case "content": return { type: "content", title: s.title || "", content: [...(s.content || [])], ...notes };
        case "summary": return { type: "summary", title: s.title || "", content: [...(s.content || [])], ...notes };
        case "image": return { type: "image", ...(s.title ? { title: s.title } : {}), src: s.src || "", ...(s.caption ? { caption: s.caption } : {}), ...notes };
        case "two-column": return { type: "two-column", title: s.title || "", left: [...(s.left || [])], right: [...(s.right || [])], ...notes };
        case "table": return { type: "table", ...(s.title ? { title: s.title } : {}), rows: (s.rows || []).map((r) => [...r]), ...notes };
        default: return { type: "content", title: s.title || "", content: [...(s.content || [])], ...notes };
      }
    }),
  };
}

/** Model → đối tượng JSON đúng schema theo loại tài liệu. */
export function modelToJson(model) {
  return model.kind === "presentation" ? modelToPresentationJson(model) : modelToWordJson(model);
}

/** Đối tượng JSON (đã validate) → model theo loại tài liệu. */
export function jsonToModel(json, docType) {
  return docType === "powerpoint" ? presentationJsonToModel(json) : wordJsonToModel(json);
}
