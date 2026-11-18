import { useState } from "react";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Eraser,
  Highlighter, Italic, List, ListOrdered, MoreHorizontal, Plus,
  Strikethrough, Underline, X,
} from "lucide-react";
import {
  FONT_OPTIONS, HIGHLIGHT_PRESETS, TEXT_COLOR_PRESETS,
} from "../../../lib/documents/textFormat.js";

// FormatToolbar — THANH ĐỊNH DẠNG CHỮ dùng chung của Teacher Document
// Studio (đúng tinh thần ảnh mẫu Word mobile của Nguyên):
//   • Desktop: một thanh ngang ngay trên khung soạn (FormatControls
//     layout="bar") — font, B/I/U/S, màu chữ, màu tô sáng, căn lề,
//     danh sách, xoá định dạng.
//   • Mobile: thanh định dạng DÍNH ĐÁY (MobileFormatBar: +, B, I, U, S,
//     màu chữ, tô sáng, "…") + PANEL ĐỊNH DẠNG trượt từ dưới lên
//     (FormatSheet) chứa ĐÚNG bộ điều khiển đầy đủ (layout="panel").
// Mọi biến thể gọi cùng một `onFormat(op)` và đọc cùng một `state`
// (blockFormatState ở textFormat.js) — logic áp định dạng chỉ có một
// nơi duy nhất ở DocumentStudioEditor.applyFormat, không viết hai bản.
//
// Ở chế độ Beautiful (htmlMode) không xác định được trạng thái đang bật
// từ mã nguồn nên các nút không hiện active, và các thao tác cấp khối
// (căn lề/danh sách/xoá định dạng) bị khoá — giáo viên sửa trực tiếp
// trong mã HTML như trước.

const MARK_DEFS = [
  { mark: "bold", label: "Đậm", Icon: Bold },
  { mark: "italic", label: "Nghiêng", Icon: Italic },
  { mark: "underline", label: "Gạch chân", Icon: Underline },
  { mark: "strike", label: "Gạch ngang", Icon: Strikethrough },
];

const ALIGN_DEFS = [
  { value: "left", label: "Căn trái", Icon: AlignLeft },
  { value: "center", label: "Căn giữa", Icon: AlignCenter },
  { value: "right", label: "Căn phải", Icon: AlignRight },
  { value: "justify", label: "Căn đều hai bên", Icon: AlignJustify },
];

function FmtButton({ active = false, disabled = false, onClick, title, children, className = "" }) {
  return (
    <button type="button" className={`ds-fmt-btn ${active ? "is-active" : ""} ${className}`}
      aria-pressed={active} disabled={disabled} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

function MarkButtons({ state, onFormat }) {
  return MARK_DEFS.map(({ mark, label, Icon }) => (
    <FmtButton key={mark} title={label} disabled={!state?.canText}
      active={Boolean(state?.marks?.[mark])}
      onClick={() => onFormat({ type: "mark", mark })}>
      <Icon className="w-4 h-4" />
    </FmtButton>
  ));
}

function AlignButtons({ state, onFormat }) {
  return ALIGN_DEFS.map(({ value, label, Icon }) => (
    <FmtButton key={value} title={label} disabled={!state?.canBlock}
      active={state?.canBlock && (state?.align || "left") === value}
      onClick={() => onFormat({ type: "align", value })}>
      <Icon className="w-4 h-4" />
    </FmtButton>
  ));
}

function ListButtons({ state, onFormat }) {
  const toggle = (kind) => onFormat({
    type: "list",
    value: state?.listType === kind ? null : kind,
  });
  return (
    <>
      <FmtButton title="Danh sách dấu đầu dòng" disabled={!state?.canBlock}
        active={state?.listType === "bullet"} onClick={() => toggle("bullet")}>
        <List className="w-4 h-4" />
      </FmtButton>
      <FmtButton title="Danh sách đánh số" disabled={!state?.canBlock}
        active={state?.listType === "ordered"} onClick={() => toggle("ordered")}>
        <ListOrdered className="w-4 h-4" />
      </FmtButton>
    </>
  );
}

function SwatchRow({ presets, value, onPick, allowNone, noneTitle }) {
  const norm = (v) => String(v || "").toLowerCase();
  return (
    <div className="ds-fmt-swatches">
      {allowNone && (
        <button type="button" className={`ds-fmt-swatch ds-fmt-swatch-none ${!value ? "is-active" : ""}`}
          title={noneTitle} aria-label={noneTitle} onClick={() => onPick(null)}>
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      {presets.map((c) => (
        <button key={c} type="button" className={`ds-fmt-swatch ${norm(value) === norm(c) ? "is-active" : ""}`}
          style={{ background: c }} title={c} aria-label={`Màu ${c}`}
          onClick={() => onPick(c)} />
      ))}
      <label className="ds-fmt-custom" title="Màu tuỳ chọn">
        <input type="color"
          value={/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#000000"}
          onChange={(e) => onPick(e.target.value)} aria-label="Màu tuỳ chọn" />
        <span>Tuỳ chọn</span>
      </label>
    </div>
  );
}

/** Nút mở bảng màu dạng popover (dùng ở thanh desktop). */
function ColorPopoverButton({ kind, state, onFormat, htmlMode }) {
  const [open, setOpen] = useState(false);
  const isColor = kind === "color";
  const value = isColor ? state?.color : state?.highlight;
  const disabled = !state?.canText;
  const pick = (v) => {
    onFormat({ type: kind, value: v });
    setOpen(false);
  };
  return (
    <div className={`ds-fmt-pop-wrap ${open ? "is-open" : ""}`}>
      <FmtButton title={isColor ? "Màu chữ" : "Màu tô sáng"} disabled={disabled}
        active={Boolean(value)} onClick={() => setOpen((o) => !o)}>
        {isColor
          ? <span className="ds-fmt-a" aria-hidden="true">A<i style={{ background: value || "#111827" }} /></span>
          : <Highlighter className="w-4 h-4" />}
      </FmtButton>
      {open && !disabled && (
        <>
          <button type="button" className="ds-fmt-pop-backdrop" aria-hidden="true" tabIndex={-1}
            onClick={() => setOpen(false)} />
          <div className="ds-fmt-pop" role="dialog" aria-label={isColor ? "Chọn màu chữ" : "Chọn màu tô sáng"}>
            <SwatchRow presets={isColor ? TEXT_COLOR_PRESETS : HIGHLIGHT_PRESETS}
              value={value} onPick={pick} allowNone={!htmlMode}
              noneTitle={isColor ? "Bỏ màu chữ riêng" : "Bỏ tô sáng"} />
          </div>
        </>
      )}
    </div>
  );
}

function FontSelect({ state, onFormat, htmlMode }) {
  return (
    <select className="ds-fmt-font" aria-label="Phông chữ"
      disabled={!state?.canText}
      value={state?.font || ""}
      onChange={(e) => onFormat({ type: "font", value: e.target.value || null })}>
      <option value="">{htmlMode ? "Phông chữ…" : "Mặc định (theo mẫu)"}</option>
      {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
    </select>
  );
}

/**
 * Bộ điều khiển định dạng — MỘT component cho cả desktop (layout="bar",
 * một hàng ngang gọn) và panel mobile (layout="panel", chia nhóm có
 * nhãn như ảnh mẫu: Phông chữ / Kiểu chữ / Màu chữ / Màu tô sáng /
 * Căn lề / Danh sách).
 */
export function FormatControls({ state, onFormat, layout = "bar", htmlMode = false }) {
  if (layout === "panel") {
    return (
      <div className="ds-fmt-panel">
        <div className="ds-fmt-group">
          <span className="ds-fmt-group-label">Phông chữ</span>
          <FontSelect state={state} onFormat={onFormat} htmlMode={htmlMode} />
        </div>
        <div className="ds-fmt-group">
          <span className="ds-fmt-group-label">Kiểu chữ</span>
          <div className="ds-fmt-row">
            <MarkButtons state={state} onFormat={onFormat} />
            {!htmlMode && (
              <FmtButton title="Xoá định dạng" disabled={!state?.canText} className="ds-fmt-btn-wide"
                onClick={() => onFormat({ type: "clear" })}>
                <Eraser className="w-4 h-4" /> <span>Xoá định dạng</span>
              </FmtButton>
            )}
          </div>
        </div>
        <div className="ds-fmt-group">
          <span className="ds-fmt-group-label">Màu chữ</span>
          <SwatchRow presets={TEXT_COLOR_PRESETS} value={state?.color}
            onPick={(v) => state?.canText && onFormat({ type: "color", value: v })}
            allowNone={!htmlMode} noneTitle="Bỏ màu chữ riêng" />
        </div>
        <div className="ds-fmt-group">
          <span className="ds-fmt-group-label">Màu tô sáng</span>
          <SwatchRow presets={HIGHLIGHT_PRESETS} value={state?.highlight}
            onPick={(v) => state?.canText && onFormat({ type: "highlight", value: v })}
            allowNone={!htmlMode} noneTitle="Bỏ tô sáng" />
        </div>
        <div className="ds-fmt-group">
          <span className="ds-fmt-group-label">Căn lề</span>
          <div className="ds-fmt-row"><AlignButtons state={state} onFormat={onFormat} /></div>
        </div>
        <div className="ds-fmt-group">
          <span className="ds-fmt-group-label">Danh sách</span>
          <div className="ds-fmt-row"><ListButtons state={state} onFormat={onFormat} /></div>
        </div>
        {htmlMode && (
          <p className="ds-fmt-hint">
            Ở chế độ Beautiful, căn lề và danh sách sửa trực tiếp trong mã HTML;
            các nút chữ ở trên bọc thẻ quanh đoạn đang bôi đen trong khung soạn.
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="docstudio-formatbar" role="toolbar" aria-label="Định dạng chữ">
      <FontSelect state={state} onFormat={onFormat} htmlMode={htmlMode} />
      <span className="ds-fmt-sep" aria-hidden="true" />
      <MarkButtons state={state} onFormat={onFormat} />
      <ColorPopoverButton kind="color" state={state} onFormat={onFormat} htmlMode={htmlMode} />
      <ColorPopoverButton kind="highlight" state={state} onFormat={onFormat} htmlMode={htmlMode} />
      <span className="ds-fmt-sep" aria-hidden="true" />
      <AlignButtons state={state} onFormat={onFormat} />
      <span className="ds-fmt-sep" aria-hidden="true" />
      <ListButtons state={state} onFormat={onFormat} />
      {!htmlMode && (
        <>
          <span className="ds-fmt-sep" aria-hidden="true" />
          <FmtButton title="Xoá định dạng" disabled={!state?.canText}
            onClick={() => onFormat({ type: "clear" })}>
            <Eraser className="w-4 h-4" />
          </FmtButton>
        </>
      )}
      {!state?.canText && !state?.canBlock && (
        <span className="ds-fmt-bar-hint">
          {htmlMode ? "Bôi đen đoạn chữ trong khung soạn để định dạng" : "Đặt con trỏ vào một khối nội dung để định dạng"}
        </span>
      )}
    </div>
  );
}

/**
 * Thanh định dạng DÍNH ĐÁY trên mobile (đúng bố cục ảnh mẫu Word):
 * [+] [B] [I] [U] [S] [A màu chữ] [tô sáng] […]. Nút + mở thư viện
 * thành phần để chèn nội dung; màu chữ/tô sáng và "…" mở panel định
 * dạng đầy đủ (FormatSheet) — mọi nút đều có tác dụng thật.
 */
export function MobileFormatBar({ state, onFormat, onInsert, onOpenPanel }) {
  return (
    <div className="docstudio-formatbar-mobile" role="toolbar" aria-label="Định dạng chữ">
      <button type="button" className="ds-fmt-mbtn" onClick={onInsert} title="Chèn thành phần" aria-label="Chèn thành phần">
        <Plus className="w-5 h-5" />
      </button>
      {MARK_DEFS.map(({ mark, label, Icon }) => (
        <button key={mark} type="button" className={`ds-fmt-mbtn ${state?.marks?.[mark] ? "is-active" : ""}`}
          aria-pressed={Boolean(state?.marks?.[mark])} disabled={!state?.canText}
          onClick={() => onFormat({ type: "mark", mark })} title={label} aria-label={label}>
          <Icon className="w-5 h-5" />
        </button>
      ))}
      <button type="button" className="ds-fmt-mbtn" onClick={onOpenPanel} title="Màu chữ" aria-label="Màu chữ">
        <span className="ds-fmt-a ds-fmt-a-lg" aria-hidden="true">A<i style={{ background: state?.color || "#111827" }} /></span>
      </button>
      <button type="button" className="ds-fmt-mbtn" onClick={onOpenPanel} title="Màu tô sáng" aria-label="Màu tô sáng">
        <Highlighter className="w-5 h-5" />
      </button>
      <button type="button" className="ds-fmt-mbtn" onClick={onOpenPanel} title="Thêm định dạng" aria-label="Mở bảng định dạng">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}

/** Panel định dạng trượt từ dưới lên trên mobile (bottom sheet). */
export function FormatSheet({ state, onFormat, htmlMode = false, hint = "", onClose }) {
  return (
    <div className="docstudio-mobile-sheet-wrap">
      <button type="button" className="docstudio-mobile-sheet-backdrop"
        onClick={onClose} aria-label="Đóng bảng định dạng" />
      <section className="docstudio-mobile-sheet" role="dialog" aria-modal="true" aria-label="Định dạng chữ">
        <header className="docstudio-mobile-sheet-head">
          <strong>Định dạng</strong>
          <button type="button" onClick={onClose} aria-label="Đóng"><X /></button>
        </header>
        <div className="docstudio-mobile-sheet-body">
          {hint && <p className="ds-fmt-hint">{hint}</p>}
          <FormatControls layout="panel" state={state} onFormat={onFormat} htmlMode={htmlMode} />
        </div>
      </section>
    </div>
  );
}

export default FormatControls;
