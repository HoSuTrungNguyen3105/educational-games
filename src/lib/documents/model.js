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

// ── JSON ⇄ model ────────────────────────────────────────────────────────

export function wordJsonToModel(json) {
  return {
    kind: "word",
    title: str(json.title),
    subject: str(json.subject),
    grade: gradeOf(json.grade),
    blocks: (Array.isArray(json.blocks) ? json.blocks : []).map((b) => {
      switch (b.type) {
        case "heading": return { type: "heading", level: [1, 2, 3].includes(b.level) ? b.level : 1, text: str(b.text) };
        case "paragraph": return { type: "paragraph", text: str(b.text) };
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
    blocks: (model.blocks || []).map((b) => {
      switch (b.type) {
        case "heading": return { type: "heading", level: b.level || 1, text: b.text || "" };
        case "paragraph": return { type: "paragraph", text: b.text || "" };
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
    slides: (Array.isArray(json.slides) ? json.slides : []).map((s) => {
      switch (s.type) {
        case "title": return { type: "title", title: str(s.title), subtitle: str(s.subtitle) };
        case "content": return { type: "content", title: str(s.title), content: strArr(s.content) };
        case "summary": return { type: "summary", title: str(s.title), content: strArr(s.content) };
        case "image": return { type: "image", title: str(s.title), src: str(s.src), alt: str(s.alt), caption: str(s.caption) };
        case "two-column": return { type: "two-column", title: str(s.title), left: strArr(s.left), right: strArr(s.right) };
        case "table": return { type: "table", title: str(s.title), rows: rowsOf(s.rows) };
        default: return { type: "content", title: str(s.title), content: strArr(s.content) };
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
    slides: (model.slides || []).map((s) => {
      switch (s.type) {
        case "title": return { type: "title", title: s.title || "", ...(s.subtitle ? { subtitle: s.subtitle } : {}) };
        case "content": return { type: "content", title: s.title || "", content: [...(s.content || [])] };
        case "summary": return { type: "summary", title: s.title || "", content: [...(s.content || [])] };
        case "image": return { type: "image", ...(s.title ? { title: s.title } : {}), src: s.src || "", ...(s.caption ? { caption: s.caption } : {}) };
        case "two-column": return { type: "two-column", title: s.title || "", left: [...(s.left || [])], right: [...(s.right || [])] };
        case "table": return { type: "table", ...(s.title ? { title: s.title } : {}), rows: (s.rows || []).map((r) => [...r]) };
        default: return { type: "content", title: s.title || "", content: [...(s.content || [])] };
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
