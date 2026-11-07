// schemas.js — Validate JSON tài liệu cho Teacher Document Studio.
//
// Hai schema JSON (chế độ soạn "json"):
//   • Word:       { type: "document", title, subject?, grade?, blocks[] }
//   • PowerPoint: { type: "presentation", title, subject?, grade?, slides[] }
//
// Validate bằng hàm tự viết (không thêm thư viện JSON Schema — nhu cầu chỉ
// là kiểm tra cấu trúc lồng nhau nông + báo lỗi theo ĐƯỜNG DẪN TRƯỜNG cụ
// thể kiểu "blocks[2].items[0]" để giáo viên sửa đúng chỗ). Mỗi lỗi là
// { path, message } — UI liệt kê toàn bộ, không dừng ở lỗi đầu tiên.

export const WORD_BLOCK_TYPES = ["heading", "paragraph", "list", "table", "image"];
export const SLIDE_TYPES = ["title", "content", "image", "two-column", "table", "summary"];

const isObj = (v) => Boolean(v) && typeof v === "object" && !Array.isArray(v);
const isStr = (v) => typeof v === "string";

/** Ô bảng/danh sách: chấp nhận số/boolean bằng cách ép chuỗi; null/object là lỗi. */
function coerceCell(v) {
  if (typeof v === "string") return { ok: true, value: v };
  if (typeof v === "number" || typeof v === "boolean") return { ok: true, value: String(v) };
  return { ok: false };
}

function checkMeta(obj, errors, { requireTitle = true } = {}) {
  if (requireTitle && !isStr(obj.title)) {
    errors.push({ path: "title", message: "Thiếu hoặc sai kiểu — 'title' phải là chuỗi văn bản" });
  }
  if (obj.subject !== undefined && !isStr(obj.subject)) {
    errors.push({ path: "subject", message: "'subject' (môn học) phải là chuỗi văn bản" });
  }
  if (obj.grade !== undefined && obj.grade !== null) {
    const g = Number(obj.grade);
    if (!Number.isFinite(g) || g < 1 || g > 12) {
      errors.push({ path: "grade", message: "'grade' (lớp) phải là số từ 1 đến 12" });
    }
  }
}

function checkStringArray(v, path, errors, label) {
  if (!Array.isArray(v)) {
    errors.push({ path, message: `'${label}' phải là một mảng các chuỗi văn bản` });
    return;
  }
  v.forEach((item, i) => {
    if (!coerceCell(item).ok) {
      errors.push({ path: `${path}[${i}]`, message: "Mục này phải là chuỗi văn bản" });
    }
  });
}

function checkRows(v, path, errors) {
  if (!Array.isArray(v)) {
    errors.push({ path, message: "'rows' phải là mảng các hàng, mỗi hàng là mảng ô" });
    return;
  }
  v.forEach((row, r) => {
    if (!Array.isArray(row)) {
      errors.push({ path: `${path}[${r}]`, message: "Mỗi hàng của bảng phải là một mảng các ô" });
      return;
    }
    row.forEach((cell, c) => {
      if (!coerceCell(cell).ok) {
        errors.push({ path: `${path}[${r}][${c}]`, message: "Ô bảng phải là chuỗi văn bản" });
      }
    });
  });
}

// ── Word ────────────────────────────────────────────────────────────────

export function validateWordJson(obj) {
  const errors = [];
  if (!isObj(obj)) return [{ path: "", message: "Tài liệu JSON phải là một đối tượng { ... }" }];
  if (obj.type !== "document") {
    errors.push({ path: "type", message: `Tài liệu Word cần "type": "document" (đang là ${JSON.stringify(obj.type)})` });
  }
  checkMeta(obj, errors);
  if (!Array.isArray(obj.blocks)) {
    errors.push({ path: "blocks", message: "'blocks' phải là mảng các khối nội dung" });
    return errors;
  }
  obj.blocks.forEach((b, i) => {
    const p = `blocks[${i}]`;
    if (!isObj(b)) { errors.push({ path: p, message: "Mỗi khối nội dung phải là một đối tượng" }); return; }
    if (!WORD_BLOCK_TYPES.includes(b.type)) {
      errors.push({ path: `${p}.type`, message: `Loại khối không hợp lệ — chỉ nhận ${WORD_BLOCK_TYPES.join(", ")}` });
      return;
    }
    if (b.type === "heading") {
      if (![1, 2, 3].includes(b.level)) errors.push({ path: `${p}.level`, message: "Tiêu đề cần 'level' là 1, 2 hoặc 3" });
      if (!isStr(b.text)) errors.push({ path: `${p}.text`, message: "Tiêu đề cần 'text' là chuỗi văn bản" });
    }
    if (b.type === "paragraph" && !isStr(b.text)) {
      errors.push({ path: `${p}.text`, message: "Đoạn văn cần 'text' là chuỗi văn bản" });
    }
    if (b.type === "list") {
      if (b.ordered !== undefined && typeof b.ordered !== "boolean") {
        errors.push({ path: `${p}.ordered`, message: "'ordered' phải là true (có thứ tự) hoặc false" });
      }
      checkStringArray(b.items, `${p}.items`, errors, "items");
    }
    if (b.type === "table") checkRows(b.rows, `${p}.rows`, errors);
    if (b.type === "image") {
      if (!isStr(b.src) || !b.src.trim()) errors.push({ path: `${p}.src`, message: "Khối hình ảnh cần 'src' là đường dẫn/URL ảnh" });
      if (b.alt !== undefined && !isStr(b.alt)) errors.push({ path: `${p}.alt`, message: "'alt' phải là chuỗi văn bản" });
    }
  });
  return errors;
}

// ── PowerPoint ──────────────────────────────────────────────────────────

export function validatePresentationJson(obj) {
  const errors = [];
  if (!isObj(obj)) return [{ path: "", message: "Tài liệu JSON phải là một đối tượng { ... }" }];
  if (obj.type !== "presentation") {
    errors.push({ path: "type", message: `Bài PowerPoint cần "type": "presentation" (đang là ${JSON.stringify(obj.type)})` });
  }
  checkMeta(obj, errors);
  if (!Array.isArray(obj.slides)) {
    errors.push({ path: "slides", message: "'slides' phải là mảng các slide" });
    return errors;
  }
  obj.slides.forEach((s, i) => {
    const p = `slides[${i}]`;
    if (!isObj(s)) { errors.push({ path: p, message: "Mỗi slide phải là một đối tượng" }); return; }
    if (!SLIDE_TYPES.includes(s.type)) {
      errors.push({ path: `${p}.type`, message: `Loại slide không hợp lệ — chỉ nhận ${SLIDE_TYPES.join(", ")}` });
      return;
    }
    if (s.type === "title") {
      if (!isStr(s.title)) errors.push({ path: `${p}.title`, message: "Slide tiêu đề cần 'title' là chuỗi văn bản" });
      if (s.subtitle !== undefined && !isStr(s.subtitle)) errors.push({ path: `${p}.subtitle`, message: "'subtitle' phải là chuỗi văn bản" });
    }
    if (s.type === "content" || s.type === "summary") {
      if (!isStr(s.title)) errors.push({ path: `${p}.title`, message: `Slide ${s.type} cần 'title' là chuỗi văn bản` });
      checkStringArray(s.content, `${p}.content`, errors, "content");
    }
    if (s.type === "image") {
      if (!isStr(s.src) || !s.src.trim()) errors.push({ path: `${p}.src`, message: "Slide hình ảnh cần 'src' là đường dẫn/URL ảnh" });
      if (s.title !== undefined && !isStr(s.title)) errors.push({ path: `${p}.title`, message: "'title' phải là chuỗi văn bản" });
      if (s.caption !== undefined && !isStr(s.caption)) errors.push({ path: `${p}.caption`, message: "'caption' phải là chuỗi văn bản" });
    }
    if (s.type === "two-column") {
      if (!isStr(s.title)) errors.push({ path: `${p}.title`, message: "Slide hai cột cần 'title' là chuỗi văn bản" });
      checkStringArray(s.left, `${p}.left`, errors, "left");
      checkStringArray(s.right, `${p}.right`, errors, "right");
    }
    if (s.type === "table") {
      if (s.title !== undefined && !isStr(s.title)) errors.push({ path: `${p}.title`, message: "'title' phải là chuỗi văn bản" });
      checkRows(s.rows, `${p}.rows`, errors);
    }
  });
  return errors;
}

/** Validate theo loại tài liệu. Trả mảng lỗi (rỗng = hợp lệ). */
export function validateDocumentJson(obj, docType) {
  return docType === "powerpoint" ? validatePresentationJson(obj) : validateWordJson(obj);
}
