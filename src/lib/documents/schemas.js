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

import { PAGE_ORIENTATIONS, PAGE_SIZE_KEYS } from "./pageConfig.js";

export const WORD_BLOCK_TYPES = ["heading", "paragraph", "list", "table", "image", "pageBreak", "signature"];
export const SLIDE_TYPES = ["title", "content", "image", "two-column", "table", "summary"];

const isObj = (v) => Boolean(v) && typeof v === "object" && !Array.isArray(v);
const isStr = (v) => typeof v === "string";
const ALIGN_VALUES = ["left", "center", "right", "justify"];
const THEME_STRING_KEYS = [
  "name", "accent", "accent2", "soft", "line", "ink", "muted", "bg",
  "heroBg", "heroText", "font", "displayFont", "variant", "pattern",
];

function checkTheme(v, errors) {
  if (v === undefined) return;
  if (!isObj(v)) {
    errors.push({ path: "theme", message: "'theme' phải là một đối tượng màu sắc/kiểu chữ" });
    return;
  }
  for (const key of THEME_STRING_KEYS) {
    if (v[key] !== undefined && !isStr(v[key])) {
      errors.push({ path: `theme.${key}`, message: `'theme.${key}' phải là chuỗi văn bản` });
    }
  }
}

const RUN_BOOL_KEYS = ["bold", "italic", "underline", "strike"];
const RUN_COLOR_KEYS = ["color", "highlight"];

function checkRuns(b, p, errors) {
  if (b.runs === undefined) return;
  if (!Array.isArray(b.runs)) {
    errors.push({ path: `${p}.runs`, message: "'runs' phải là mảng các đoạn chữ có định dạng riêng" });
    return;
  }
  b.runs.forEach((r, i) => {
    const rp = `${p}.runs[${i}]`;
    if (!isObj(r)) { errors.push({ path: rp, message: "Mỗi run phải là một đối tượng { text, bold?, … }" }); return; }
    if (!isStr(r.text)) errors.push({ path: `${rp}.text`, message: "Mỗi run cần 'text' là chuỗi văn bản" });
    for (const k of RUN_BOOL_KEYS) {
      if (r[k] !== undefined && typeof r[k] !== "boolean") {
        errors.push({ path: `${rp}.${k}`, message: `'${k}' trong run phải là true hoặc false` });
      }
    }
    for (const k of RUN_COLOR_KEYS) {
      if (r[k] !== undefined && !isStr(r[k])) {
        errors.push({ path: `${rp}.${k}`, message: `'${k}' trong run phải là mã màu dạng chuỗi` });
      }
    }
  });
}

function checkBlockStyle(b, p, errors) {
  if (b.color !== undefined && !isStr(b.color)) {
    errors.push({ path: `${p}.color`, message: "'color' phải là mã màu hoặc tên màu" });
  }
  if (b.align !== undefined && !ALIGN_VALUES.includes(b.align)) {
    errors.push({ path: `${p}.align`, message: `'align' chỉ nhận ${ALIGN_VALUES.join(", ")}` });
  }
  if (b.font !== undefined && !isStr(b.font)) {
    errors.push({ path: `${p}.font`, message: "'font' phải là tên phông chữ dạng chuỗi" });
  }
  if (b.fontSize !== undefined) {
    const n = Number(b.fontSize);
    if (!Number.isFinite(n) || n <= 0 || n > 200) {
      errors.push({ path: `${p}.fontSize`, message: "'fontSize' phải là số từ 1 đến 200 (đơn vị pt)" });
    }
  }
  checkSpacingFields(b, p, errors);
  checkRuns(b, p, errors);
}

/** Giãn dòng + khoảng sau đoạn cấp khối (heading/paragraph/list). */
function checkSpacingFields(b, p, errors) {
  if (b.lineHeight !== undefined) {
    const n = Number(b.lineHeight);
    if (!Number.isFinite(n) || n < 0.5 || n > 4) {
      errors.push({ path: `${p}.lineHeight`, message: "'lineHeight' (giãn dòng) phải là số từ 0.5 đến 4" });
    }
  }
  if (b.spacingAfter !== undefined) {
    const n = Number(b.spacingAfter);
    if (!Number.isFinite(n) || n < 0 || n > 200) {
      errors.push({ path: `${p}.spacingAfter`, message: "'spacingAfter' (khoảng sau đoạn, pt) phải là số từ 0 đến 200" });
    }
  }
}

/** Cấu hình trang `page` của tài liệu Word — field tuỳ chọn, thiếu thì bỏ qua. */
function checkPage(v, errors) {
  if (v === undefined) return;
  if (!isObj(v)) {
    errors.push({ path: "page", message: "'page' (cấu hình trang) phải là một đối tượng" });
    return;
  }
  if (v.size !== undefined && !PAGE_SIZE_KEYS.includes(v.size)) {
    errors.push({ path: "page.size", message: `'page.size' (khổ giấy) chỉ nhận ${PAGE_SIZE_KEYS.join(", ")}` });
  }
  if (v.orientation !== undefined && !PAGE_ORIENTATIONS.includes(v.orientation)) {
    errors.push({ path: "page.orientation", message: "'page.orientation' (hướng giấy) chỉ nhận portrait (dọc) hoặc landscape (ngang)" });
  }
  if (v.margins !== undefined) {
    if (!isObj(v.margins)) {
      errors.push({ path: "page.margins", message: "'page.margins' (lề trang) phải là đối tượng { top, right, bottom, left } theo cm" });
    } else {
      for (const side of ["top", "right", "bottom", "left"]) {
        const mv = v.margins[side];
        if (mv !== undefined) {
          const n = Number(mv);
          if (!Number.isFinite(n) || n < 0 || n > 10) {
            errors.push({ path: `page.margins.${side}`, message: `Lề ${side} phải là số từ 0 đến 10 (cm)` });
          }
        }
      }
    }
  }
  if (v.font !== undefined && !isStr(v.font)) {
    errors.push({ path: "page.font", message: "'page.font' phải là tên phông chữ dạng chuỗi" });
  }
  if (v.fontSize !== undefined) {
    const n = Number(v.fontSize);
    if (!Number.isFinite(n) || n <= 0 || n > 200) {
      errors.push({ path: "page.fontSize", message: "'page.fontSize' phải là số từ 1 đến 200 (pt)" });
    }
  }
  if (v.color !== undefined && !isStr(v.color)) {
    errors.push({ path: "page.color", message: "'page.color' phải là mã màu dạng chuỗi" });
  }
  if (v.align !== undefined && !ALIGN_VALUES.includes(v.align)) {
    errors.push({ path: "page.align", message: `'page.align' chỉ nhận ${ALIGN_VALUES.join(", ")}` });
  }
  if (v.lineHeight !== undefined) {
    const n = Number(v.lineHeight);
    if (!Number.isFinite(n) || n < 0.5 || n > 4) {
      errors.push({ path: "page.lineHeight", message: "'page.lineHeight' (giãn dòng) phải là số từ 0.5 đến 4" });
    }
  }
  if (v.spacingAfter !== undefined) {
    const n = Number(v.spacingAfter);
    if (!Number.isFinite(n) || n < 0 || n > 200) {
      errors.push({ path: "page.spacingAfter", message: "'page.spacingAfter' (khoảng sau đoạn, pt) phải là số từ 0 đến 200" });
    }
  }
  if (v.pageNumber !== undefined && typeof v.pageNumber !== "boolean") {
    errors.push({ path: "page.pageNumber", message: "'page.pageNumber' (đánh số trang trong DOCX) phải là true hoặc false" });
  }
}

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
  checkTheme(obj.theme, errors);
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
  checkPage(obj.page, errors);
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
      checkBlockStyle(b, p, errors);
    }
    if (b.type === "paragraph") {
      if (!isStr(b.text)) errors.push({ path: `${p}.text`, message: "Đoạn văn cần 'text' là chuỗi văn bản" });
      checkBlockStyle(b, p, errors);
    }
    if (b.type === "list") {
      if (b.ordered !== undefined && typeof b.ordered !== "boolean") {
        errors.push({ path: `${p}.ordered`, message: "'ordered' phải là true (có thứ tự) hoặc false" });
      }
      if (b.align !== undefined && !ALIGN_VALUES.includes(b.align)) {
        errors.push({ path: `${p}.align`, message: `'align' chỉ nhận ${ALIGN_VALUES.join(", ")}` });
      }
      checkSpacingFields(b, p, errors);
      checkStringArray(b.items, `${p}.items`, errors, "items");
    }
    if (b.type === "table") {
      checkRows(b.rows, `${p}.rows`, errors);
      if (b.colWidths !== undefined) {
        if (!Array.isArray(b.colWidths)) {
          errors.push({ path: `${p}.colWidths`, message: "'colWidths' (bề rộng cột, %) phải là mảng số" });
        } else {
          b.colWidths.forEach((w, ci) => {
            const n = Number(w);
            if (!Number.isFinite(n) || n <= 0) {
              errors.push({ path: `${p}.colWidths[${ci}]`, message: "Bề rộng cột phải là số phần trăm lớn hơn 0" });
            }
          });
        }
      }
    }
    if (b.type === "image") {
      if (!isStr(b.src) || !b.src.trim()) errors.push({ path: `${p}.src`, message: "Khối hình ảnh cần 'src' là đường dẫn/URL ảnh" });
      if (b.alt !== undefined && !isStr(b.alt)) errors.push({ path: `${p}.alt`, message: "'alt' phải là chuỗi văn bản" });
    }
    if (b.type === "signature") {
      if (b.role !== undefined && !isStr(b.role)) errors.push({ path: `${p}.role`, message: "'role' (chức danh người ký) phải là chuỗi văn bản" });
      if (b.name !== undefined && !isStr(b.name)) errors.push({ path: `${p}.name`, message: "'name' (họ tên người ký) phải là chuỗi văn bản" });
    }
    // pageBreak không có field nào cần kiểm tra.
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
    if (s.notes !== undefined && !isStr(s.notes)) {
      errors.push({ path: `${p}.notes`, message: "'notes' (ghi chú thuyết trình) phải là chuỗi văn bản" });
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
