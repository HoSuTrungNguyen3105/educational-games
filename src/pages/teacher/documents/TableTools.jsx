import { useMemo, useState } from "react";
import {
  ArrowDownWideNarrow, ArrowUpNarrowWide, Columns3, Copy, ListOrdered,
  Rows3, Save, Scale, Search, Sigma, Trash2, X,
} from "lucide-react";
import { tableColumnStats } from "../../../lib/documents/tableOps.js";

// TableTools — thanh thao tác trên KHỐI BẢNG đang chọn ở chế độ Normal
// (Giai đoạn 1 §5). Component thuần hiển thị: mọi thao tác đi qua
// `onOp(op)` về DocumentStudioEditor, nơi dữ liệu thật được sửa bằng
// tableOps.js trên bản nháp JSON (giữ Hoàn tác như mọi thao tác khác).
//   op = { kind: "addRow" | "removeRow" | "addCol" | "removeCol" }
//      | { kind: "sort", col, dir } | { kind: "stt" }
//      | { kind: "statsRow", col, statKind: "sum" | "avg" }
//      | { kind: "duplicate" } | { kind: "equalize" }
// Tìm trong bảng chỉ HIGHLIGHT các hàng khớp ở bản xem trước (class
// ds-row-hl) — không xoá/lọc dữ liệu thật.

function ToolButton({ title, onClick, disabled = false, children }) {
  return (
    <button type="button" className="ds-fmt-btn ds-fmt-btn-wide docstudio-tabletool-btn"
      title={title} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function TableTools({ block, onOp, onSaveTemplate, searchQuery, onSearchChange, matchRows }) {
  const headers = useMemo(() => {
    const first = block?.rows?.[0] || [];
    return first.map((h, i) => String(h || "").trim() || `Cột ${i + 1}`);
  }, [block]);
  const [sortCol, setSortCol] = useState(0);
  const [statsCol, setStatsCol] = useState(0);
  const [tplName, setTplName] = useState("");
  const [tplOpen, setTplOpen] = useState(false);
  const stats = useMemo(
    () => (block ? tableColumnStats(block, statsCol) : null),
    [block, statsCol]);
  if (!block) return null;
  const rowCount = block.rows?.length || 0;

  const colSelect = (value, onChange, label) => (
    <select className="ds-fmt-fontsize ds-fmt-select-wide" aria-label={label} title={label}
      value={Math.min(value, Math.max(0, headers.length - 1))}
      onChange={(e) => onChange(Number(e.target.value))}>
      {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
    </select>
  );

  return (
    <div className="docstudio-tabletools" role="toolbar" aria-label="Công cụ bảng">
      <span className="docstudio-tabletools-title">
        Bảng đang chọn · {rowCount} hàng × {headers.length} cột
      </span>
      <ToolButton title="Thêm một hàng trống vào cuối bảng" onClick={() => onOp({ kind: "addRow" })}>
        <Rows3 className="w-4 h-4" /> <span>Thêm hàng</span>
      </ToolButton>
      <ToolButton title="Xoá hàng cuối của bảng" disabled={rowCount <= 1}
        onClick={() => onOp({ kind: "removeRow" })}>
        <Trash2 className="w-4 h-4" /> <span>Xoá hàng cuối</span>
      </ToolButton>
      <ToolButton title="Thêm một cột trống vào cuối bảng" onClick={() => onOp({ kind: "addCol" })}>
        <Columns3 className="w-4 h-4" /> <span>Thêm cột</span>
      </ToolButton>
      <ToolButton title="Xoá cột cuối của bảng" disabled={headers.length <= 1}
        onClick={() => onOp({ kind: "removeCol" })}>
        <Trash2 className="w-4 h-4" /> <span>Xoá cột cuối</span>
      </ToolButton>
      <span className="ds-fmt-sep" aria-hidden="true" />
      {colSelect(sortCol, setSortCol, "Cột dùng để sắp xếp")}
      <ToolButton title="Sắp xếp tăng dần theo cột đã chọn (hàng tiêu đề giữ nguyên)"
        onClick={() => onOp({ kind: "sort", col: sortCol, dir: "asc" })}>
        <ArrowUpNarrowWide className="w-4 h-4" /> <span>Tăng</span>
      </ToolButton>
      <ToolButton title="Sắp xếp giảm dần theo cột đã chọn (hàng tiêu đề giữ nguyên)"
        onClick={() => onOp({ kind: "sort", col: sortCol, dir: "desc" })}>
        <ArrowDownWideNarrow className="w-4 h-4" /> <span>Giảm</span>
      </ToolButton>
      <ToolButton title="Thêm cột STT đánh số 1, 2, 3… (bảng đã có cột STT thì đánh số lại)"
        onClick={() => onOp({ kind: "stt" })}>
        <ListOrdered className="w-4 h-4" /> <span>Cột STT</span>
      </ToolButton>
      <span className="ds-fmt-sep" aria-hidden="true" />
      {colSelect(statsCol, setStatsCol, "Cột số dùng để tính tổng/trung bình")}
      <ToolButton title={stats ? "Thêm hàng Tổng cho cột số đã chọn" : "Cột đã chọn chưa có ô số nào để tính tổng"}
        disabled={!stats} onClick={() => onOp({ kind: "statsRow", col: statsCol, statKind: "sum" })}>
        <Sigma className="w-4 h-4" /> <span>Tổng</span>
      </ToolButton>
      <ToolButton title={stats ? "Thêm hàng Trung bình cho cột số đã chọn" : "Cột đã chọn chưa có ô số nào để tính trung bình"}
        disabled={!stats} onClick={() => onOp({ kind: "statsRow", col: statsCol, statKind: "avg" })}>
        <Sigma className="w-4 h-4" /> <span>Trung bình</span>
      </ToolButton>
      <span className="ds-fmt-sep" aria-hidden="true" />
      <label className="docstudio-tabletools-search" title="Tìm trong bảng — các hàng khớp sẽ được tô sáng ở bản xem trước, dữ liệu không đổi">
        <Search className="w-3.5 h-3.5" />
        <input value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm trong bảng…" aria-label="Tìm trong bảng" />
        {searchQuery && (
          <button type="button" onClick={() => onSearchChange("")} title="Xoá tìm kiếm" aria-label="Xoá tìm kiếm">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </label>
      {searchQuery && (
        <span className="docstudio-tabletools-count">
          {matchRows.length ? `${matchRows.length} hàng khớp` : "Không có hàng khớp"}
        </span>
      )}
      <ToolButton title="Nhân bản bảng này thành một bảng giống hệt ngay bên dưới"
        onClick={() => onOp({ kind: "duplicate" })}>
        <Copy className="w-4 h-4" /> <span>Nhân bản</span>
      </ToolButton>
      <ToolButton title="Chia đều bề rộng cho mọi cột" onClick={() => onOp({ kind: "equalize" })}>
        <Scale className="w-4 h-4" /> <span>Chia đều cột</span>
      </ToolButton>
      {tplOpen ? (
        <span className="docstudio-tabletools-tpl">
          <input value={tplName} onChange={(e) => setTplName(e.target.value)}
            placeholder="Tên mẫu bảng…" aria-label="Tên mẫu bảng" autoFocus />
          <ToolButton title="Lưu bảng này làm mẫu cá nhân (chèn lại từ tab Thành phần)"
            onClick={() => { onSaveTemplate(tplName); setTplOpen(false); setTplName(""); }}>
            <Save className="w-4 h-4" /> <span>Lưu mẫu</span>
          </ToolButton>
        </span>
      ) : (
        <ToolButton title="Lưu bảng này làm mẫu cá nhân để chèn lại từ tab Thành phần"
          onClick={() => setTplOpen(true)}>
          <Save className="w-4 h-4" /> <span>Lưu mẫu bảng</span>
        </ToolButton>
      )}
    </div>
  );
}

/**
 * Dải thông báo ở chế độ Beautiful: mã HTML không có khái niệm "khối
 * bảng đang chọn" nên các thao tác thống kê/sắp xếp không áp dụng
 * được — hiện rõ trạng thái thay vì cho bấm mà không có tác dụng.
 */
export function TableToolsDisabled() {
  return (
    <div className="docstudio-tabletools is-disabled" aria-label="Công cụ bảng">
      <span className="docstudio-tabletools-title">Bảng trong tài liệu</span>
      <ToolButton title="Dùng ở chế độ Normal" disabled>
        <ArrowUpNarrowWide className="w-4 h-4" /> <span>Sắp xếp</span>
      </ToolButton>
      <ToolButton title="Dùng ở chế độ Normal" disabled>
        <Sigma className="w-4 h-4" /> <span>Tổng / Trung bình</span>
      </ToolButton>
      <ToolButton title="Dùng ở chế độ Normal" disabled>
        <ListOrdered className="w-4 h-4" /> <span>Cột STT</span>
      </ToolButton>
      <span className="docstudio-tabletools-count">
        Thống kê, sắp xếp và các thao tác bảng dùng ở chế độ Normal — ở Beautiful, chèn bảng HTML vẫn hoạt động bình thường.
      </span>
    </div>
  );
}

/**
 * Danh sách "Mẫu bảng của tôi" ở tab Thành phần: các mẫu bảng cá nhân
 * giáo viên đã lưu (localStorage, xem tableOps.js) — chèn lại vào tài
 * liệu đang mở hoặc xoá khỏi máy. Nút bấm gọi handler qua props để
 * editor giữ toàn quyền sửa bản nháp.
 */
export function TableTemplateList({ templates, onInsert, onRemove }) {
  return (
    <div className="docstudio-comp-custom">
      <span className="docstudio-label">Mẫu bảng của tôi</span>
      <p className="docstudio-flyout-hint">
        Các bảng bạn đã lưu từ thanh công cụ bảng (chế độ Normal) trên máy này.
      </p>
      <div className="docstudio-mytpl-list">
        {templates.map((tpl) => (
          <div key={tpl.id} className="docstudio-mytpl-item">
            <span className="min-w-0">
              <b>{tpl.name}</b>
              <small>{tpl.rows.length} hàng × {Math.max(0, ...tpl.rows.map((r) => r.length))} cột</small>
            </span>
            <button type="button" className="docstudio-btn-small"
              title="Chèn mẫu bảng này vào tài liệu"
              onClick={() => onInsert(tpl)}>
              Chèn
            </button>
            <button type="button" className="docstudio-btn-small"
              title="Xoá mẫu bảng này khỏi máy"
              onClick={() => onRemove(tpl)}>
              Xoá
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableTools;
