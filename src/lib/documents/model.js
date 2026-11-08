// model.js — Mô hình tài liệu TRUNG GIAN của Teacher Document Studio.
//
// Mọi đường đi đều qua mô hình này để không phải viết N×M bộ chuyển đổi:
//   HTML ──parse──▶ model ──render──▶ HTML (preview / chuyển chế độ)
//   JSON ──parse──▶ model ──export──▶ .docx (đợt 1) / .pptx (đợt 2)
//
// Word model:
//   { kind: "word", title, subject, grade, blocks: [
//       { type: "heading", level: 1-3, text, runs?, color?, align? },
//       { type: "paragraph", text, runs?, color?, align? },
//       { type: "list", ordered, items: [string] },
//       { type: "table", rows: [[string]] },
//       { type: "image", src, alt } ] }
//   `runs` = [{ text, bold, italic, underline }] CHỈ sinh ra khi parse từ
//   HTML có định dạng inline lẫn lộn — schema JSON của giáo viên dùng
//   `text` thuần; khi xuất JSON, runs được gộp về text.
//
// Presentation model:
//   { kind: "presentation", title, subject, grade, slides: [
//       { type: "title", title, subtitle? },
//       { type: "content" | "summary", title, content: [string] },
//       { type: "image", title?, src, alt?, caption? },
//       { type: "two-column", title, left: [string], right: [string] },
//       { type: "table", title?, rows: [[string]] } ] }

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

/** Chỉ giữ các thuộc tính định dạng khối mà model + exporter hiểu. */
function styledBlock(block, base) {
  const out = { ...base };
  if (typeof block.color === "string" && block.color.trim()) out.color = block.color.trim();
  if (["left", "center", "right", "justify"].includes(block.align)) out.align = block.align;
  return out;
}

// ── JSON ⇄ model ────────────────────────────────────────────────────────

export function wordJsonToModel(json) {
  return {
    kind: "word",
    title: str(json.title),
    subject: str(json.subject),
    grade: gradeOf(json.grade),
    ...(themeOf(json.theme) ? { theme: themeOf(json.theme) } : {}),
    blocks: (Array.isArray(json.blocks) ? json.blocks : []).map((b) => {
      switch (b.type) {
        case "heading": return styledBlock(b, { type: "heading", level: [1, 2, 3].includes(b.level) ? b.level : 1, text: str(b.text) });
        case "paragraph": return styledBlock(b, { type: "paragraph", text: str(b.text) });
        case "list": return { type: "list", ordered: Boolean(b.ordered), items: strArr(b.items) };
        case "table": return { type: "table", rows: rowsOf(b.rows) };
        case "image": return { type: "image", src: str(b.src), alt: str(b.alt) };
        default: return { type: "paragraph", text: str(b.text) };
      }
    }),
  };
}

export function modelToWordJson(model) {
  return {
    type: "document",
    title: model.title || "",
    ...(model.subject ? { subject: model.subject } : {}),
    ...(model.grade ? { grade: model.grade } : {}),
    ...(model.theme ? { theme: model.theme } : {}),
    blocks: (model.blocks || []).map((b) => {
      switch (b.type) {
        case "heading": return styledBlock(b, { type: "heading", level: b.level || 1, text: b.text || "" });
        case "paragraph": return styledBlock(b, { type: "paragraph", text: b.text || "" });
        case "list": return { type: "list", ordered: Boolean(b.ordered), items: [...(b.items || [])] };
        case "table": return { type: "table", rows: (b.rows || []).map((r) => [...r]) };
        case "image": return { type: "image", src: b.src || "", ...(b.alt ? { alt: b.alt } : {}) };
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
