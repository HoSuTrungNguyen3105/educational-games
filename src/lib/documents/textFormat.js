// textFormat.js — Logic ĐỊNH DẠNG CHỮ dùng chung cho Teacher Document
// Studio (thanh công cụ desktop + thanh đáy/panel mobile dùng CHUNG một
// bộ hàm này, không viết hai bản):
//
//   • blockFormatState(block) — trạng thái định dạng hiện tại của một
//     khối Word (heading/paragraph/list) để toolbar hiển thị nút đang bật.
//   • applyBlockFormat(block, op) — áp một thao tác định dạng lên khối ở
//     chế độ Normal (model JSON): tạo/sửa `runs` (đậm, nghiêng, gạch
//     chân, gạch ngang, màu chữ, màu tô sáng), `font`/`align` cấp khối,
//     chuyển đoạn ⇄ danh sách. Hàm THUẦN — không sửa object đầu vào.
//   • wrapHtmlSelection(source, from, to, op) — chế độ Beautiful: bọc
//     thẻ/span quanh vùng ký tự đang bôi đen trong mã HTML, trả chuỗi
//     thay thế cho đúng đoạn đó (null = thao tác không áp dụng được).
//
// Hình dạng run (khớp model.js / schemas.js / wordExporter.js):
//   { text, bold?, italic?, underline?, strike?, color?, highlight? }
// color/highlight là mã màu CSS (#rrggbb hoặc tên màu cơ bản).

export const FONT_OPTIONS = [
  "Arial", "Times New Roman", "Georgia", "Verdana", "Tahoma", "Courier New",
];

export const FONT_SIZE_OPTIONS = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 60, 72,
];

export const TEXT_COLOR_PRESETS = [
  "#111827", "#dc2626", "#2563eb", "#16a34a", "#ea580c", "#7c3aed", "#b45309", "#db2777",
];

export const HIGHLIGHT_PRESETS = [
  "#ffff00", "#a7f3d0", "#bfdbfe", "#fbcfe8", "#fde68a", "#e5e7eb",
];

const MARKS = ["bold", "italic", "underline", "strike"];

/** Run còn định dạng nào không (để biết khi nào gộp runs về text thuần). */
export function runHasFormat(r) {
  return Boolean(r && (r.bold || r.italic || r.underline || r.strike || r.color || r.highlight));
}

/** Chuẩn hoá một run: chỉ giữ field hợp lệ, field false/rỗng thì bỏ. */
export function normalizeRun(r) {
  const out = { text: typeof r?.text === "string" ? r.text : String(r?.text ?? "") };
  for (const m of MARKS) if (r?.[m]) out[m] = true;
  if (typeof r?.color === "string" && r.color.trim()) out.color = r.color.trim();
  if (typeof r?.highlight === "string" && r.highlight.trim()) out.highlight = r.highlight.trim();
  return out;
}

/** Runs của khối — chưa có thì sinh một run từ text thuần. */
export function ensureRuns(block) {
  if (Array.isArray(block?.runs) && block.runs.length) return block.runs.map(normalizeRun);
  return [{ text: typeof block?.text === "string" ? block.text : "" }];
}

/**
 * Gọn khối sau khi sửa runs: đồng bộ `text` = gộp runs; nếu mọi run đều
 * hết định dạng thì BỎ hẳn `runs` (JSON trở về dạng text thuần như cũ).
 */
function finishBlock(block, runs) {
  const out = { ...block };
  const clean = (runs || []).map(normalizeRun).filter((r) => r.text !== "" || runHasFormat(r));
  out.text = clean.map((r) => r.text).join("");
  if (clean.length && clean.some(runHasFormat)) out.runs = clean;
  else delete out.runs;
  return out;
}

const TEXT_BLOCK_TYPES = ["heading", "paragraph"];

/**
 * Trạng thái định dạng của khối đích để toolbar hiển thị:
 *   { canText, canBlock, marks: {bold…}, color, highlight, font, align,
 *     listType: null | "bullet" | "ordered" }
 * canText = áp được định dạng inline (heading/paragraph); canBlock = áp
 * được căn lề/chuyển danh sách (heading/paragraph/list). Khối bảng/ảnh
 * hoặc chưa chọn khối → cả hai false.
 */
export function blockFormatState(block) {
  const none = {
    canText: false, canBlock: false,
    marks: { bold: false, italic: false, underline: false, strike: false },
    color: null, highlight: null, font: null, fontSize: null,
    align: "left", listType: null,
    headingLevel: null, lineHeight: null, spacingAfter: null,
  };
  if (!block || typeof block !== "object") return none;
  if (block.type === "list") {
    return {
      ...none, canBlock: true,
      align: block.align || "left",
      listType: block.ordered ? "ordered" : "bullet",
      lineHeight: block.lineHeight ?? null,
      spacingAfter: block.spacingAfter ?? null,
    };
  }
  if (!TEXT_BLOCK_TYPES.includes(block.type)) return none;
  const runs = Array.isArray(block.runs) && block.runs.length ? block.runs : null;
  const marks = {};
  for (const m of MARKS) marks[m] = Boolean(runs && runs.length && runs.every((r) => r[m]));
  const uniform = (key, fallback) => {
    if (!runs || !runs.length) return fallback ?? null;
    const first = runs[0][key] || null;
    return runs.every((r) => (r[key] || null) === first) ? first : null;
  };
  return {
    canText: true,
    canBlock: true,
    marks,
    color: uniform("color", block.color || null),
    highlight: uniform("highlight", null),
    font: block.font || null,
    fontSize: block.fontSize || null,
    align: block.align || "left",
    listType: null,
    headingLevel: block.type === "heading" ? (block.level || 1) : 0,
    lineHeight: block.lineHeight ?? null,
    spacingAfter: block.spacingAfter ?? null,
  };
}

/**
 * Áp một thao tác định dạng lên khối (chế độ Normal). Trả khối MỚI hoặc
 * null khi khối không áp dụng được thao tác đó.
 * op: { type: "mark", mark } | { type: "color", value|null }
 *     | { type: "highlight", value|null } | { type: "font", value|null }
 *     | { type: "align", value } | { type: "list", value: "bullet"|"ordered"|null }
 *     | { type: "heading", value: 1|2|3|null } — đoạn ⇄ tiêu đề / đổi cấp
 *     | { type: "lineHeight", value: number|null }
 *     | { type: "spacingAfter", value: number|null } (pt)
 *     | { type: "clear" }
 */
export function applyBlockFormat(block, op) {
  if (!block || typeof block !== "object" || !op) return null;

  // Chuyển đổi đoạn ⇄ danh sách (đổi loại khối).
  if (op.type === "list") {
    if (block.type === "list") {
      if (op.value === null) {
        // Danh sách → đoạn văn: nối các mục bằng khoảng trắng, giữ align.
        const out = { type: "paragraph", text: (block.items || []).join(" ") };
        if (block.align) out.align = block.align;
        return out;
      }
      return { ...block, ordered: op.value === "ordered" };
    }
    if (TEXT_BLOCK_TYPES.includes(block.type)) {
      if (op.value === null) return { ...block };
      // Đoạn → danh sách: model danh sách giữ items dạng text thuần nên
      // định dạng inline (runs) của đoạn không đi theo — giữ màu/căn lề
      // cấp khối vốn biểu diễn được ở cả hai loại.
      const out = { type: "list", ordered: op.value === "ordered", items: [block.text || ""] };
      if (block.align) out.align = block.align;
      return out;
    }
    return null;
  }

  if (op.type === "align") {
    if (block.type === "list" || TEXT_BLOCK_TYPES.includes(block.type)) {
      const out = { ...block };
      if (op.value && op.value !== "left") out.align = op.value;
      else delete out.align;
      return out;
    }
    return null;
  }

  // Giãn dòng / khoảng sau đoạn cấp khối: heading, paragraph và list
  // đều giữ hai field này (preview + DOCX cùng đọc — xem model.js).
  if (op.type === "lineHeight" || op.type === "spacingAfter") {
    if (block.type !== "list" && !TEXT_BLOCK_TYPES.includes(block.type)) return null;
    const out = { ...block };
    if (op.value === null || op.value === undefined) delete out[op.type];
    else {
      const n = Number(op.value);
      if (!Number.isFinite(n)) return null;
      out[op.type] = n;
    }
    return out;
  }

  // Đoạn ⇄ tiêu đề: đổi loại khối nhưng giữ nguyên mọi định dạng đã có
  // (runs, màu, font, căn lề, giãn dòng…). value null/0 → đoạn thường.
  if (op.type === "heading") {
    if (!TEXT_BLOCK_TYPES.includes(block.type)) return null;
    const level = [1, 2, 3].includes(op.value) ? op.value : null;
    if (level === null) {
      if (block.type === "paragraph") return { ...block };
      const out = { ...block, type: "paragraph" };
      delete out.level;
      return out;
    }
    return { ...block, type: "heading", level };
  }

  // Từ đây chỉ heading/paragraph áp dụng được.
  if (!TEXT_BLOCK_TYPES.includes(block.type)) return null;

  if (op.type === "font") {
    const out = { ...block };
    if (op.value) out.font = op.value;
    else delete out.font;
    return out;
  }
  if (op.type === "fontSize") {
    const out = { ...block };
    if (op.value) out.fontSize = Number(op.value);
    else delete out.fontSize;
    return out;
  }
  if (op.type === "clear") {
    const out = { ...block };
    delete out.runs;
    delete out.font;
    delete out.fontSize;
    delete out.lineHeight;
    delete out.spacingAfter;
    return out;
  }
  if (op.type === "mark" && MARKS.includes(op.mark)) {
    const runs = ensureRuns(block);
    const all = runs.length > 0 && runs.every((r) => r[op.mark]);
    return finishBlock(block, runs.map((r) => {
      const next = { ...r };
      if (all) delete next[op.mark];
      else next[op.mark] = true;
      return next;
    }));
  }
  if (op.type === "color" || op.type === "highlight") {
    const key = op.type;
    const runs = ensureRuns(block);
    const out = finishBlock(block, runs.map((r) => {
      const next = { ...r };
      if (op.value) next[key] = op.value;
      else delete next[key];
      return next;
    }));
    // Màu chữ cấp khối (từ style của thẻ khối khi parse HTML) bị runs
    // ghi đè theo từng run — khi đặt màu qua toolbar thì xoá màu cấp
    // khối để một nguồn sự thật duy nhất là runs.
    if (key === "color") delete out.color;
    return out;
  }
  return null;
}

// ── Chế độ Beautiful: bọc thẻ quanh vùng chọn trong mã HTML ───────────

const MARK_TAGS = { bold: "strong", italic: "em", underline: "u", strike: "s" };

/**
 * Trả CHUỖI THAY THẾ cho đoạn [from, to) của mã nguồn khi áp `op`, hoặc
 * null nếu thao tác không áp dụng được ở chế độ HTML (vùng chọn rỗng,
 * hoặc thao tác cấp khối như căn lề/danh sách — ở chế độ Beautiful các
 * thao tác đó sửa trực tiếp trong mã như trước).
 */
export function wrapHtmlSelection(source, from, to, op) {
  const src = String(source || "");
  if (!op || typeof from !== "number" || typeof to !== "number") return null;
  if (from < 0 || to > src.length || from >= to) return null;
  const selected = src.slice(from, to);
  if (!selected.trim()) return null;
  if (op.type === "mark" && MARK_TAGS[op.mark]) {
    const tag = MARK_TAGS[op.mark];
    return `<${tag}>${selected}</${tag}>`;
  }
  if (op.type === "color" && op.value) {
    return `<span style="color: ${op.value}">${selected}</span>`;
  }
  if (op.type === "highlight" && op.value) {
    return `<mark style="background-color: ${op.value}">${selected}</mark>`;
  }
  if (op.type === "font" && op.value) {
    return `<span style="font-family: '${op.value}'">${selected}</span>`;
  }
  if (op.type === "fontSize" && op.value) {
    return `<span style="font-size: ${op.value}pt">${selected}</span>`;
  }
  if (op.type === "lineHeight" && op.value) {
    return `<span style="line-height: ${op.value}">${selected}</span>`;
  }
  return null;
}

const BLOCK_TAG_RE = /^(p|h[1-6])$/i;

/**
 * Chế độ Beautiful — op "heading": ĐỔI THẺ của khối chứa vùng chọn.
 * Khác wrapHtmlSelection (chỉ thay đúng đoạn đã chọn), thao tác này cần
 * sửa cả thẻ mở/đóng nằm NGOÀI vùng chọn nên trả { from, to, text } là
 * khoảng thay thế MỞ RỘNG (gồm cả hai thẻ) cho editor gọi replaceRange.
 *
 * Áp dụng được khi vùng chọn:
 *   (a) nằm trọn trong MỘT thẻ khối <p>/<h1>–<h6> (trước vùng chọn là
 *       thẻ mở, sau vùng chọn là thẻ đóng khớp nhau), hoặc
 *   (b) bao trọn cả phần tử (từ thẻ mở tới thẻ đóng).
 * Ngoài hai trường hợp trên → null (editor nhắc giáo viên chọn cả đoạn).
 * Thuộc tính của thẻ mở được giữ nguyên; level null/0 → thẻ <p>.
 */
export function retitleHtmlBlock(source, from, to, level) {
  const src = String(source || "");
  if (typeof from !== "number" || typeof to !== "number" || from < 0 || to > src.length || from > to) return null;
  const newTag = [1, 2, 3].includes(level) ? `h${level}` : "p";

  // (b) Vùng chọn bao trọn phần tử.
  const whole = /^<(p|h[1-6])((?:\s[^>]*)?)>([\s\S]*)<\/(p|h[1-6])>$/i.exec(src.slice(from, to).trim());
  if (whole && whole[1].toLowerCase() === whole[4].toLowerCase()) {
    const lead = src.slice(from, to).indexOf("<");
    const start = from + lead;
    const end = from + src.slice(from, to).lastIndexOf(">") + 1;
    return { from: start, to: end, text: `<${newTag}${whole[2] || ""}>${whole[3]}</${newTag}>` };
  }

  // (a) Vùng chọn nằm trọn trong một thẻ khối.
  const before = src.slice(0, from);
  const after = src.slice(to);
  const open = /<(p|h[1-6])((?:\s[^>]*)?)>\s*$/i.exec(before);
  const close = /^\s*<\/(p|h[1-6])>/i.exec(after);
  if (!open || !close || !BLOCK_TAG_RE.test(open[1])) return null;
  if (open[1].toLowerCase() !== close[1].toLowerCase()) return null;
  const openStart = before.length - open[0].length + open[0].indexOf("<");
  const closeEnd = to + close[0].length;
  const inner = src.slice(from, to);
  return {
    from: openStart,
    to: closeEnd,
    text: `<${newTag}${open[2] || ""}>${inner}</${newTag}>`,
  };
}
