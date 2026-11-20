// tableOps.js — Thao tác trên KHỐI BẢNG Word ở chế độ Normal
// (Giai đoạn 1 §5, không AI): thêm/xoá hàng-cột, sắp xếp theo cột,
// đánh số STT, tổng/trung bình một cột số, tìm trong bảng, nhân bản,
// chia đều bề rộng cột, lưu mẫu bảng cá nhân (localStorage).
//
// Mọi hàm đều THUẦN — nhận khối table { type: "table", rows, colWidths? }
// và trả khối MỚI (hoặc null khi thao tác không hợp lệ, ví dụ xoá hàng
// cuối cùng còn lại). Hàng đầu tiên (index 0) là hàng TIÊU ĐỀ: sắp xếp
// không đụng vào nó, thống kê chỉ tính các hàng dưới nó.
//
// Quy ước hình dạng: rows được chuẩn hoá thành hình chữ nhật (hàng
// thiếu ô được đệm "") trước khi thao tác để thêm cột/xoá cột an toàn.

export const TABLE_TEMPLATES_KEY = "docstudio.tableTemplates";

const cloneRows = (rows) => (Array.isArray(rows) ? rows : []).map((r) => (Array.isArray(r) ? r.map((c) => String(c ?? "")) : []));
export const tableColCount = (block) => Math.max(0, ...cloneRows(block?.rows).map((r) => r.length));

function rectangular(block) {
  const rows = cloneRows(block?.rows);
  const cols = Math.max(0, ...rows.map((r) => r.length));
  return rows.map((r) => [...r, ...Array(Math.max(0, cols - r.length)).fill("")]);
}

const finish = (block, rows, extra = {}) => ({
  ...block,
  type: "table",
  rows,
  ...extra,
});

// ── Thêm / xoá hàng, cột ──────────────────────────────────────────────
export function addTableRow(block, atIndex = null) {
  const rows = rectangular(block);
  if (!rows.length) return finish(block, [[""]]);
  const cols = rows[0].length;
  const idx = atIndex == null ? rows.length : Math.min(Math.max(0, atIndex), rows.length);
  rows.splice(idx, 0, Array(cols).fill(""));
  return finish(block, rows);
}

export function removeTableRow(block, index) {
  const rows = rectangular(block);
  if (rows.length <= 1) return null; // giữ ít nhất hàng tiêu đề
  const idx = index == null ? rows.length - 1 : index;
  if (idx < 0 || idx >= rows.length) return null;
  rows.splice(idx, 1);
  return finish(block, rows);
}

export function addTableColumn(block, atIndex = null) {
  const rows = rectangular(block);
  if (!rows.length) return finish(block, [[""]]);
  const cols = rows[0].length;
  const idx = atIndex == null ? cols : Math.min(Math.max(0, atIndex), cols);
  const rowsOut = rows.map((r) => { const c = [...r]; c.splice(idx, 0, ""); return c; });
  // colWidths cũ không còn khớp số cột → bỏ để tránh lệch %.
  return finish(block, rowsOut, { colWidths: undefined });
}

export function removeTableColumn(block, index) {
  const rows = rectangular(block);
  if (!rows.length || rows[0].length <= 1) return null; // giữ ít nhất 1 cột
  const idx = index == null ? rows[0].length - 1 : index;
  if (idx < 0 || idx >= rows[0].length) return null;
  const rowsOut = rows.map((r) => r.filter((_, c) => c !== idx));
  return finish(block, rowsOut, { colWidths: undefined });
}

// ── Sắp xếp theo cột (hàng tiêu đề đứng yên) ─────────────────────────
/** Số viết kiểu Việt Nam: "1.250,5" / "1,250.5" / "42" → number; không phải số → null. */
export function parseNumericCell(value) {
  const s = String(value ?? "").trim().replace(/\s+/g, "");
  if (!s) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(s)) return Number(s);
  if (/^-?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(s)) return Number(s.replace(/\./g, "").replace(",", "."));
  if (/^-?\d+,\d+$/.test(s)) return Number(s.replace(",", "."));
  return null;
}

function compareCells(a, b) {
  const na = parseNumericCell(a);
  const nb = parseNumericCell(b);
  if (na !== null && nb !== null) return na - nb;
  return String(a ?? "").localeCompare(String(b ?? ""), "vi", { numeric: true });
}

export function sortTableByColumn(block, colIndex, dir = "asc") {
  const rows = rectangular(block);
  if (rows.length <= 2) return finish(block, rows);
  const col = Math.min(Math.max(0, colIndex), (rows[0]?.length || 1) - 1);
  const sign = dir === "desc" ? -1 : 1;
  const body = rows.slice(1)
    .map((row, i) => ({ row, i }))
    .sort((x, y) => sign * compareCells(x.row[col], y.row[col]) || x.i - y.i)
    .map((x) => x.row);
  return finish(block, [rows[0], ...body]);
}

// ── Cột STT ───────────────────────────────────────────────────────────
/** Thêm cột "STT" ở đầu (hoặc đánh số lại nếu cột đầu đã là STT). */
export function addSttColumn(block) {
  const rows = rectangular(block);
  if (!rows.length) return null;
  const header = String(rows[0][0] || "").trim().toLowerCase();
  if (header === "stt") {
    return finish(block, rows.map((r, i) => (i === 0 ? r : [String(i), ...r.slice(1)])));
  }
  return finish(
    block,
    rows.map((r, i) => [i === 0 ? "STT" : String(i), ...r]),
    { colWidths: undefined },
  );
}

// ── Tổng / trung bình một cột số ─────────────────────────────────────
/** Thống kê các ô SỐ ở các hàng dưới hàng tiêu đề. Không có ô số nào → null. */
export function tableColumnStats(block, colIndex) {
  const rows = rectangular(block);
  const values = [];
  for (let i = 1; i < rows.length; i += 1) {
    const n = parseNumericCell(rows[i]?.[colIndex]);
    if (n !== null) values.push(n);
  }
  if (!values.length) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return { count: values.length, sum, avg: sum / values.length };
}

const formatNumber = (n) => {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
};

/** Thêm một hàng kết quả ở cuối bảng: nhãn ở ô đầu, giá trị ở cột được chọn. */
export function appendStatsRow(block, colIndex, kind) {
  const stats = tableColumnStats(block, colIndex);
  if (!stats) return null;
  const rows = rectangular(block);
  const cols = rows[0]?.length || 0;
  if (colIndex < 0 || colIndex >= cols) return null;
  const row = Array(cols).fill("");
  row[0] = kind === "avg" ? "Trung bình" : "Tổng";
  row[colIndex] = formatNumber(kind === "avg" ? stats.avg : stats.sum);
  if (colIndex === 0) row[0] = `${kind === "avg" ? "Trung bình" : "Tổng"}: ${row[colIndex]}`;
  return finish(block, [...rows, row]);
}

// ── Tìm trong bảng ────────────────────────────────────────────────────
/** Index các hàng có ô chứa `query` (không phân biệt hoa/thường, gập dấu). */
export function findTableRows(block, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  const fold = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const fq = fold(q);
  const out = [];
  cloneRows(block?.rows).forEach((row, i) => {
    if (row.some((c) => fold(c).includes(fq))) out.push(i);
  });
  return out;
}

// ── Nhân bản + chia đều cột ──────────────────────────────────────────
export function duplicateTableBlock(block) {
  return JSON.parse(JSON.stringify(block));
}

/** Chia đều bề rộng cho mọi cột (colWidths theo %, tổng 100). */
export function equalizeTableWidths(block) {
  const cols = tableColCount(block);
  if (!cols) return null;
  const each = Math.round((100 / cols) * 10) / 10;
  const widths = Array(cols).fill(each);
  widths[cols - 1] = Math.round((100 - each * (cols - 1)) * 10) / 10;
  return finish(block, cloneRows(block.rows), { colWidths: widths });
}

// ── Mẫu bảng cá nhân (localStorage) ──────────────────────────────────
export function loadTableTemplates() {
  try {
    const raw = localStorage.getItem(TABLE_TEMPLATES_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list.filter((t) => t && typeof t.name === "string" && Array.isArray(t.rows));
  } catch { return []; }
}

function persistTableTemplates(list) {
  try { localStorage.setItem(TABLE_TEMPLATES_KEY, JSON.stringify(list)); } catch { /* bỏ qua */ }
}

export function saveTableTemplate(name, block) {
  const rows = cloneRows(block?.rows);
  if (!rows.length) return null;
  const tpl = {
    id: `tpl-${Date.now().toString(36)}`,
    name: String(name || "Mẫu bảng").trim() || "Mẫu bảng",
    rows,
    ...(Array.isArray(block?.colWidths) ? { colWidths: [...block.colWidths] } : {}),
  };
  persistTableTemplates([tpl, ...loadTableTemplates()]);
  return tpl;
}

export function removeTableTemplate(id) {
  persistTableTemplates(loadTableTemplates().filter((t) => t.id !== id));
}
