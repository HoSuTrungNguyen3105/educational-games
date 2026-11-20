import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Copy, Plus, Trash2, Type, Image as ImageIcon, Square, Circle, Table, LayoutGrid, Move, RotateCw, Minimize2, Maximize2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Palette, Highlighter, Text, Delete, Copy as DuplicateIcon, Grid, Columns, Table as TableIcon } from "lucide-react";
import { SLIDE_TYPE_OPTIONS, emptySlide, insertSlideAfter, duplicateSlide, removeSlide, moveSlide, moveSlideTo } from "../../../lib/documents/slideOps.js";

const SLIDE_W = 920;

const DEFAULT_PPT_THEME = {
  accent: "#2563eb", accent2: "#f59e0b", soft: "#eff6ff", line: "#bfdbfe",
  ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
  heroBg: "#1d4ed8", heroText: "#ffffff",
  font: "Arial", displayFont: "Arial",
};

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Không đọc được tệp ảnh."));
    reader.readAsDataURL(file);
  });
}

/** Editable text field - click to edit inline */
function EditableText({ value, onChange, placeholder, style, className, multiline = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (onChange && editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value || "");
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} bg-white border border-blue-500 outline-none px-2 py-1 resize-none`}
        style={{ ...style, minHeight: '60px', boxSizing: 'border-box' }}
        placeholder={placeholder}
        spellCheck={false}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} bg-white border border-blue-500 outline-none px-2 py-1`}
        style={style}
        placeholder={placeholder}
        spellCheck={false}
      />
    );
  }

  return (
    <span
      className={`${className} cursor-text hover:bg-blue-50 hover:outline hover:outline-1 hover:outline-blue-300 rounded px-1 py-0.5 transition-all`}
      style={style}
      onClick={() => setIsEditing(true)}
      title="Nhấp để chỉnh sửa"
    >
      {value || <span style={{color: '#9ca3af'}}>{placeholder}</span>}
    </span>
  );
}

/** Editable bullet list */
function EditableBulletList({ items, onChange, placeholder, markerColor, style }) {
  const [editItems, setEditItems] = useState(items || []);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    setEditItems(items || []);
  }, [items]);

  const updateItem = (index, value) => {
    const newItems = [...editItems];
    newItems[index] = value;
    setEditItems(newItems);
    onChange?.(newItems);
  };

  const addItem = () => {
    const newItems = [...editItems, ""];
    setEditItems(newItems);
    setEditingIndex(newItems.length - 1);
    onChange?.(newItems);
  };

  const removeItem = (index) => {
    if (editItems.length <= 1) return;
    const newItems = editItems.filter((_, i) => i !== index);
    setEditItems(newItems);
    onChange?.(newItems);
  };

  return (
    <ul className="space-y-2" style={style}>
      {editItems.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 group">
          <span className="mt-[10px] h-1.5 w-1.5 shrink-0" style={{ background: markerColor }} />
          <EditableText
            value={item}
            onChange={(v) => updateItem(i, v)}
            placeholder={`${placeholder} ${i + 1}`}
            multiline={true}
            className="flex-1 text-[20px] leading-relaxed font-body"
          />
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 ml-2"
            onClick={() => removeItem(i)}
            title="Xóa mục này"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </li>
      ))}
      <button
        type="button"
        className="flex items-center gap-2 mt-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50"
        onClick={addItem}
      >
        <Plus className="w-4 h-4" /> Thêm mục
      </button>
    </ul>
  );
}

/** Editable two-column list */
function EditableTwoColumn({ left, right, onLeftChange, onRightChange, markerColorLeft, markerColorRight }) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-4" style={{ background: "#f8fafc", borderTop: `3px solid ${markerColorLeft}` }}>
        <EditableBulletList
          items={left}
          onChange={onLeftChange}
          placeholder="Ý cột trái"
          markerColor={markerColorLeft}
        />
      </div>
      <div className="p-4" style={{ background: "#f8fafc", borderTop: `3px solid ${markerColorRight}` }}>
        <EditableBulletList
          items={right}
          onChange={onRightChange}
          placeholder="Ý cột phải"
          markerColor={markerColorRight}
        />
      </div>
    </div>
  );
}

/** Editable table */
function EditableTable({ rows, onChange, style }) {
  const [editRows, setEditRows] = useState(rows || [["", ""]]);

  useEffect(() => {
    setEditRows(rows || [["", ""]]);
  }, [rows]);

  const updateCell = (r, c, value) => {
    const newRows = editRows.map((row, ri) => ri === r ? row.map((v, ci) => ci === c ? value : v) : row);
    setEditRows(newRows);
    onChange?.(newRows);
  };

  const addRow = () => {
    const newRows = [...editRows, editRows[0].map(() => "")];
    setEditRows(newRows);
    onChange?.(newRows);
  };

  const addCol = () => {
    const newRows = editRows.map(row => [...row, ""]);
    setEditRows(newRows);
    onChange?.(newRows);
  };

  const removeRow = (r) => {
    if (editRows.length <= 1) return;
    const newRows = editRows.filter((_, i) => i !== r);
    setEditRows(newRows);
    onChange?.(newRows);
  };

  const removeCol = (c) => {
    if (editRows[0].length <= 1) return;
    const newRows = editRows.map(row => row.filter((_, i) => i !== c));
    setEditRows(newRows);
    onChange?.(newRows);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-body text-[18px]">
        <tbody>
          {editRows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    border: `1px solid #d1d5db`,
                    padding: '8px 12px',
                    background: ri === 0 ? '#eff6ff' : 'transparent',
                    fontWeight: ri === 0 ? 'bold' : 'normal',
                    minWidth: '120px',
                  }}
                >
                  <div
                    contentEditable
                    onBlur={(e) => updateCell(ri, ci, e.target.textContent)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }}}
                    style={{ minHeight: '28px', outline: 'none', whiteSpace: 'pre-wrap' }}
                  >
                    {cell}
                  </div>
                </td>
              ))}
              <td style={{ border: 'none', padding: '0 8px', width: '40px' }}>
                <button onClick={() => removeRow(ri)} className="text-red-500 hover:text-red-700 p-1" title="Xóa hàng"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-2">
        <button onClick={addRow} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"><Plus className="w-4 h-4 inline mr-1" /> Thêm hàng</button>
        <button onClick={addCol} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"><Plus className="w-4 h-4 inline mr-1" /> Thêm cột</button>
      </div>
    </div>
  );
}

/** Image input with preview */
function ImageInput({ src, onChange, alt, onAltChange, style }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div style={style}>
      {!imgLoaded && !imgError && src && <div className="img-loading" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af'}}>Đang tải...</div>}
      {imgError && <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', color: '#ef4444'}}>Lỗi tải ảnh</div>}
      {src && (
        <img
          src={src}
          alt={alt || ""}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(false); }}
          style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '62%' }}
        />
      )}
      {!src && (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f3f4f6', border: '2px dashed #d1d5db', borderRadius: '8px', color: '#9ca3af', gap: '8px', cursor: 'pointer' }}>
          <ImageIcon className="w-10 h-10" />
          <span>Chưa có hình ảnh</span>
          <input type="file" accept="image/*" hidden onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const dataUrl = await readAsDataUrl(file);
              onChange(dataUrl);
            }
            e.target.value = "";
          }} />
          <button type="button" className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Chọn ảnh</button>
        </label>
      )}
      {src && (
        <input
          type="text"
          value={alt || ""}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Chú thích ảnh (alt)"
          className="mt-2 px-2 py-1 text-sm border rounded w-full max-w-xs"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      )}
    </div>
  );
}

/** Slide editor component */
function SlideEditor({ slide, ratio, theme, onUpdate }) {
  if (!slide) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-gray-400">
        Chưa có slide nào — bấm "Thêm slide" để bắt đầu
      </div>
    );
  }

  const t = { ...DEFAULT_PPT_THEME, ...(theme || {}) };
  const font = `${t.font || "Arial"}, Arial, sans-serif`;
  const displayFont = `${t.displayFont || t.font || "Arial"}, Arial, sans-serif`;
  const style = {
    width: SLIDE_W,
    aspectRatio: ratio === "4:3" ? "4 / 3" : "16 / 9",
    background: slide.background || t.bg,
    color: t.ink,
    fontFamily: font,
  };
  const shell = "border border-[#d1d5db] shadow-[0_1px_4px_rgba(0,0,0,.12)] overflow-hidden relative";
  const accentBar = <span className="absolute left-0 top-0 h-1.5 w-full" style={{ background: t.accent }} />;

  const handleTitleChange = (newTitle) => onUpdate({ ...slide, title: newTitle });
  const handleSubtitleChange = (newSubtitle) => onUpdate({ ...slide, subtitle: newSubtitle });
  const handleCaptionChange = (newCaption) => onUpdate({ ...slide, caption: newCaption });
  const handleSrcChange = (newSrc) => onUpdate({ ...slide, src: newSrc });
  const handleAltChange = (newAlt) => onUpdate({ ...slide, alt: newAlt });
  const handleContentChange = (newContent) => onUpdate({ ...slide, content: newContent });
  const handleLeftChange = (newLeft) => onUpdate({ ...slide, left: newLeft });
  const handleRightChange = (newRight) => onUpdate({ ...slide, right: newRight });
  const handleRowsChange = (newRows) => onUpdate({ ...slide, rows: newRows });

  switch (slide.type) {
    case "title":
      return (
        <div style={{ ...style, background: t.heroBg, color: t.heroText }} className={`${shell} justify-center px-16`}>
          <span className="absolute left-0 top-0 h-1.5 w-full" style={{ background: t.accent2 }} />
          <span className="absolute left-16 top-12 text-[13px] font-bold tracking-[0.16em] uppercase" style={{ color: t.heroText, opacity: 0.8 }}>
            EduPlay · Bài giảng
          </span>
          <h1 className="relative text-[44px] leading-tight font-bold" style={{ color: t.heroText, fontFamily: displayFont }}>
            <EditableText value={slide.title} onChange={handleTitleChange} placeholder="Tiêu đề slide" className="inline-block" style={{fontFamily: displayFont}} />
          </h1>
          {slide.subtitle && (
            <p className="relative text-[22px] mt-4" style={{ color: t.heroText, opacity: 0.82 }}>
              <EditableText value={slide.subtitle} onChange={handleSubtitleChange} placeholder="Phụ đề" className="inline-block" />
            </p>
          )}
          <span className="absolute right-16 bottom-10 h-1 w-24" style={{ background: t.accent2 }} />
        </div>
      );

    case "image":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {slide.title && (
            <h2 style={{ color: t.accent, fontFamily: displayFont }} className="text-[30px] leading-tight mb-4">
              <EditableText value={slide.title} onChange={handleTitleChange} placeholder="Tiêu đề ảnh" className="inline-block" />
            </h2>
          )}
          <div className="flex-1 grid place-items-center">
            <ImageInput
              src={slide.src}
              onChange={handleSrcChange}
              alt={slide.alt}
              onAltChange={handleAltChange}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          {slide.caption && (
            <p className="font-body text-center mt-3 text-[15px]" style={{ color: t.muted }}>
              <EditableText value={slide.caption} onChange={handleCaptionChange} placeholder="Chú thích ảnh" className="inline-block" />
            </p>
          )}
        </div>
      );

    case "two-column":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {slide.title && (
            <h2 style={{ color: t.accent, fontFamily: displayFont }} className="text-[30px] leading-tight mb-4">
              <EditableText value={slide.title} onChange={handleTitleChange} placeholder="Tiêu đề" className="inline-block" />
            </h2>
          )}
          <EditableTwoColumn
            left={slide.left || []}
            right={slide.right || []}
            onLeftChange={handleLeftChange}
            onRightChange={handleRightChange}
            markerColorLeft={t.accent}
            markerColorRight={t.accent2}
          />
        </div>
      );

    case "table":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {slide.title && (
            <h2 style={{ color: t.accent, fontFamily: displayFont }} className="text-[30px] leading-tight mb-4">
              <EditableText value={slide.title} onChange={handleTitleChange} placeholder="Tiêu đề bảng" className="inline-block" />
            </h2>
          )}
          <EditableTable rows={slide.rows || [["", ""]]} onChange={handleRowsChange} />
        </div>
      );

    case "summary":
      return (
        <div style={{ ...style, background: t.soft }} className={`${shell} px-12 py-9`}>
          <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: t.accent }} />
          {slide.title && (
            <h2 style={{ color: t.accent, fontFamily: displayFont }} className="text-[30px] leading-tight mb-4">
              <EditableText value={slide.title} onChange={handleTitleChange} placeholder="Tiêu đề" className="inline-block" />
            </h2>
          )}
          <EditableBulletList
            items={slide.content || []}
            onChange={handleContentChange}
            placeholder="Ý chính"
            markerColor={t.accent}
          />
        </div>
      );

    default: // content
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {slide.title && (
            <h2 style={{ color: t.accent, fontFamily: displayFont }} className="text-[30px] leading-tight mb-4">
              <EditableText value={slide.title} onChange={handleTitleChange} placeholder="Tiêu đề" className="inline-block" />
            </h2>
          )}
          <EditableBulletList
            items={slide.content || []}
            onChange={handleContentChange}
            placeholder="Mục"
            markerColor={t.accent2}
          />
        </div>
      );
  }
}

export default function PowerPointEditor({
  model, onModelUpdate, zoom = 1, ratio, onRatioChange,
  index, onIndexChange, editable = true, onSlideOp
}) {
  const slides = model?.slides || [];
  const theme = model?.theme;
  const [viewMode, setViewMode] = useState("single");
  const [newSlideType, setNewSlideType] = useState("content");
  const [slidePulse, setSlidePulse] = useState(false);
  const stageRef = useRef(null);
  const stageWidth = useRef(0);
  
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, slides.length - 1));
  const slide = slides[safeIndex];

  const handleSlideOp = useCallback((op, ...args) => {
    if (!onModelUpdate || !model || !onSlideOp) return;
    
    let result = null;
    switch (op) {
      case "add":
        result = insertSlideAfter(model, safeIndex, args[0]);
        break;
      case "duplicate":
        result = duplicateSlide(model, safeIndex);
        break;
      case "delete":
        result = removeSlide(model, safeIndex);
        break;
      case "move":
        result = moveSlide(model, safeIndex, args[0]);
        break;
      case "moveTo":
        result = moveSlideTo(model, args[1], args[0]);
        break;
    }
    
    if (result) {
      onModelUpdate(result.json);
      if (typeof result.index === "number") {
        onIndexChange?.(result.index);
        setSlidePulse(true);
        setTimeout(() => setSlidePulse(false), 1700);
      }
    }
  }, [model, onModelUpdate, onSlideOp, safeIndex, onIndexChange]);

  // Tự vừa khung
  useEffect(() => {
    if (stageRef.current) {
      stageWidth.current = stageRef.current.clientWidth;
    }
  });

  const fit = stageWidth.current > 0 ? Math.min(1, stageWidth.current / (SLIDE_W * zoom)) : 1;
  const effZoom = zoom * fit;
  const stageH = SLIDE_W * (ratio === "4:3" ? 3 / 4 : 9 / 16);

  const t = { ...DEFAULT_PPT_THEME, ...(theme || {}) };

  return (
    <div className="h-full flex flex-col bg-[#ece7db]">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b border-ink/10 flex-wrap">
        <div className="flex items-center gap-1 mr-3">
          <span className="font-body text-xs font-semibold text-ink/60">Kiểu xem:</span>
          <div className="flex gap-1 p-0.5 rounded-full bg-ink/5" role="tablist">
            <button type="button" role="tab" aria-selected={viewMode === "single"}
              className={`px-3 py-1 rounded-full text-xs font-body font-semibold transition ${viewMode === "single" ? "bg-white text-ink shadow" : "text-ink/50 hover:text-ink"}`}
              onClick={() => setViewMode("single")}>
              Từng slide
            </button>
            <button type="button" role="tab" aria-selected={viewMode === "scroll"}
              className={`px-3 py-1 rounded-full text-xs font-body font-semibold transition ${viewMode === "scroll" ? "bg-white text-ink shadow" : "text-ink/50 hover:text-ink"}`}
              onClick={() => setViewMode("scroll")}>
              Cuộn xuống
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600">
            Slide {safeIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            disabled={safeIndex <= 0}
            onClick={() => onIndexChange?.(Math.max(0, safeIndex - 1))}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            disabled={safeIndex >= slides.length - 1}
            onClick={() => onIndexChange?.(Math.min(slides.length - 1, safeIndex + 1))}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1 ml-3">
          <select value={ratio} onChange={(e) => onRatioChange?.(e.target.value)} className="px-2 py-1 text-sm border rounded text-xs" style={{minWidth: '60px'}}>
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
          </select>
        </div>
      </div>

      {/* Main editing area */}
      <div ref={stageRef} className="flex-1 overflow-auto p-4">
        {viewMode === "scroll" ? (
          <div className="flex flex-col items-center gap-7 pt-6">
            {slides.length ? slides.map((s, i) => (
              <div key={i}
                onClick={() => onIndexChange?.(i)}
                title={`Slide ${i + 1}: ${s.title || s.type}`}
                className={`relative shrink-0 cursor-pointer ${slidePulse && i === safeIndex ? "docstudio-slide-stage is-reveal-pulse" : ""}`}
                style={{
                  width: Math.round(SLIDE_W * effZoom), height: Math.round(stageH * effZoom),
                  boxShadow: i === safeIndex ? `0 0 0 3px ${t.accent}` : "0 0 0 3px transparent",
                  borderRadius: 8,
                }}>
                <div style={{ transform: `scale(${effZoom})`, transformOrigin: "top left", width: SLIDE_W, pointerEvents: "none" }}>
                  <SlideView slide={s} ratio={ratio} theme={theme} />
                </div>
                <span className="absolute -top-6 left-0 font-body text-xs font-semibold text-ink/50">Slide {i + 1}</span>
              </div>
            )) : (
              <div style={{ width: Math.round(SLIDE_W * effZoom), height: Math.round(stageH * effZoom) }}>
                <div style={{ transform: `scale(${effZoom})`, transformOrigin: "top left", width: SLIDE_W }}>
                  <SlideView slide={undefined} ratio={ratio} theme={theme} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`mx-auto docstudio-slide-stage ${slidePulse ? "is-reveal-pulse" : ""}`} style={{ width: Math.round(SLIDE_W * effZoom), height: Math.round(stageH * effZoom) }}>
            <div style={{ transform: `scale(${effZoom})`, transformOrigin: "top left", width: SLIDE_W }}>
              <SlideEditor
                slide={slide}
                ratio={ratio}
                theme={theme}
                onUpdate={(updatedSlide) => {
                  if (!onModelUpdate || !model) return;
                  const updatedSlides = [...slides];
                  updatedSlides[safeIndex] = updatedSlide;
                  onModelUpdate({ ...model, slides: updatedSlides });
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom slide navigator & operations */}
      <div className="border-t border-ink/10 bg-white px-3 py-2 flex flex-col gap-2">
        {editable && (
          <div className="flex flex-wrap items-center gap-1.5" aria-label="Thao tác slide">
            <span className="font-body text-xs font-semibold text-ink/60 mr-0.5">Thêm slide:</span>
            <select value={newSlideType} onChange={(e) => setNewSlideType(e.target.value)}
              className="px-2 py-1.5 text-xs border border-ink/10 bg-white font-body rounded" aria-label="Loại slide mới" style={{minWidth: '160px'}}>
              {SLIDE_TYPE_OPTIONS.map((o) => <option key={o.type} value={o.type}>{o.label}</option>)}
            </select>
            <button type="button" className="px-2.5 py-1.5 rounded-full text-xs font-semibold border border-ink/15 bg-white hover:bg-ink/5" onClick={() => handleSlideOp("add", newSlideType)}>
              <Plus className="w-3.5 h-3.5" /> Thêm
            </button>
            <button type="button" className="px-2.5 py-1.5 rounded-full text-xs font-semibold border border-ink/15 bg-white hover:bg-ink/5" disabled={!slides.length}
              onClick={() => handleSlideOp("duplicate")} title="Nhân bản slide hiện tại">
              <DuplicateIcon className="w-3.5 h-3.5" /> Nhân bản
            </button>
            <button type="button" className="px-2.5 py-1.5 rounded-full text-xs font-semibold border border-ink/15 bg-white hover:bg-ink/5" disabled={safeIndex <= 0}
              onClick={() => handleSlideOp("move", -1)} title="Di chuyển slide lên trước">
              <ArrowUp className="w-3.5 h-3.5" /> Lên
            </button>
            <button type="button" className="px-2.5 py-1.5 rounded-full text-xs font-semibold border border-ink/15 bg-white hover:bg-ink/5" disabled={safeIndex >= slides.length - 1}
              onClick={() => handleSlideOp("move", 1)} title="Di chuyển slide xuống sau">
              <ArrowDown className="w-3.5 h-3.5" /> Xuống
            </button>
            <button type="button" className="px-2.5 py-1.5 rounded-full text-xs font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100" disabled={slides.length <= 1}
              onClick={() => handleSlideOp("delete")}
              title={slides.length <= 1 ? "Không xoá được slide cuối cùng" : "Xoá slide hiện tại"}>
              <Trash2 className="w-3.5 h-3.5" /> Xoá
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Slide trước" disabled={safeIndex <= 0}
            onClick={() => onIndexChange?.(Math.max(0, safeIndex - 1))}
            className="p-1.5 rounded-full hover:bg-ink/5 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-body text-sm text-ink/70 whitespace-nowrap">
            {slides.length ? `Slide ${safeIndex + 1} / ${slides.length}` : "0 slide"}
          </span>
          <button type="button" aria-label="Slide sau" disabled={safeIndex >= slides.length - 1}
            onClick={() => onIndexChange?.(Math.min(slides.length - 1, safeIndex + 1))}
            className="p-1.5 rounded-full hover:bg-ink/5 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
          <div className="flex gap-2 overflow-x-auto py-1 flex-1">
            {slides.map((s, i) => (
              <button key={i} type="button" onClick={() => onIndexChange?.(i)}
                title={`Slide ${i + 1}: ${s.title || s.type}`}
                draggable={editable}
                onDragStart={editable ? (e) => {
                  e.dataTransfer.setData("text/plain", String(i));
                  e.dataTransfer.effectAllowed = "move";
                  onIndexChange?.(i);
                } : undefined}
                onDragOver={editable ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; } : undefined}
                onDrop={editable ? (e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData("text/plain"));
                  if (Number.isInteger(from) && from !== i) handleSlideOp("moveTo", i, from);
                } : undefined}
                className={`relative shrink-0 overflow-hidden rounded ${i === safeIndex ? "opacity-100 ring-2 ring-blue-500" : "opacity-70 hover:opacity-100"} ${editable ? "cursor-grab active:cursor-grabbing" : ""}`}
                style={{
                  width: 120,
                  height: Math.round(120 * (ratio === "4:3" ? 3/4 : 9/16)),
                }}>
                <div style={{ 
                  transform: `scale(${120/SLIDE_W})`, 
                  transformOrigin: "top left", 
                  width: SLIDE_W 
                }}>
                  <SlideView slide={s} ratio={ratio} theme={theme} />
                </div>
                <span className="absolute -top-5 left-0 text-xs font-medium">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** SlideView - shared with PowerPointPreview for thumbnail rendering */
function SlideView({ slide, ratio, theme }) {
  const t = { ...DEFAULT_PPT_THEME, ...(theme || {}) };
  const font = `${t.font || "Arial"}, Arial, sans-serif`;
  const displayFont = `${t.displayFont || t.font || "Arial"}, Arial, sans-serif`;
  const style = {
    width: SLIDE_W,
    aspectRatio: ratio === "4:3" ? "4 / 3" : "16 / 9",
    background: t.bg,
    color: t.ink,
    fontFamily: font,
  };
  const shell = "border border-[#d1d5db] shadow-[0_1px_4px_rgba(0,0,0,.12)] overflow-hidden flex flex-col relative";
  if (!slide) {
    return (
      <div style={style} className={`${shell} items-center justify-center text-ink/40 font-body`}>
        Chưa có slide nào
      </div>
    );
  }
  const title = slide.title
    ? <h2 style={{ color: t.accent, fontFamily: displayFont }} className="text-[30px] leading-tight mb-4">{slide.title}</h2>
    : null;
  const bullets = (items, marker = t.accent2) => (
    <ul className="space-y-2 font-body text-[20px] leading-relaxed" style={{ color: t.ink }}>
      {(items || []).map((c, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-[10px] h-1.5 w-1.5 shrink-0" style={{ background: marker }} />
          <span>{c}</span>
        </li>
      ))}
    </ul>
  );
  const table = (rows) => (
    <table className="w-full border-collapse font-body text-[18px]" style={{ color: t.ink }}>
      <tbody>
        {(rows || []).map((row, ri) => (
          <tr key={ri}>
            {row.map((c, ci) => ri === 0
              ? <th key={ci} className="px-3 py-2 text-left font-semibold" style={{ border: `1px solid ${t.line}`, background: "#f3f4f6", color: t.ink }}>{c}</th>
              : <td key={ci} className="px-3 py-2" style={{ border: `1px solid ${t.line}` }}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
  const accentBar = <span className="absolute left-0 top-0 h-1.5 w-full" style={{ background: t.accent }} />;

  switch (slide.type) {
    case "title":
      return (
        <div style={{ ...style, background: t.heroBg, color: t.heroText }} className={`${shell} justify-center px-16`}>
          <span className="absolute left-0 top-0 h-1.5 w-full" style={{ background: t.accent2 }} />
          <span className="absolute left-16 top-12 text-[13px] font-bold tracking-[0.16em] uppercase" style={{ color: t.heroText, opacity: 0.8 }}>
            EduPlay · Bài giảng
          </span>
          <h1 className="relative text-[44px] leading-tight font-bold" style={{ color: t.heroText, fontFamily: displayFont }}>{slide.title}</h1>
          {slide.subtitle ? <p className="relative text-[22px] mt-4" style={{ color: t.heroText, opacity: 0.82 }}>{slide.subtitle}</p> : null}
          <span className="absolute right-16 bottom-10 h-1 w-24" style={{ background: t.accent2 }} />
        </div>
      );
    case "image":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          {slide.src
            ? <img src={slide.src} alt={slide.alt || ""} className="max-h-[62%] max-w-full object-contain mx-auto border" style={{ borderColor: t.line }} />
            : <div className="flex-1 grid place-items-center text-ink/40 font-body">Chưa có đường dẫn ảnh (src)</div>}
          {slide.caption ? <p className="font-body text-center mt-3 text-[15px]" style={{ color: t.muted }}>{slide.caption}</p> : null}
        </div>
      );
    case "two-column":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="p-4" style={{ background: "#f8fafc", borderTop: `3px solid ${t.accent}` }}>{bullets(slide.left, t.accent)}</div>
            <div className="p-4" style={{ background: "#f8fafc", borderTop: `3px solid ${t.accent2}` }}>{bullets(slide.right, t.accent2)}</div>
          </div>
        </div>
      );
    case "table":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          {table(slide.rows)}
        </div>
      );
    case "summary":
      return (
        <div style={{ ...style, background: t.soft }} className={`${shell} px-12 py-9`}>
          <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: t.accent }} />
          {title}
          {bullets(slide.content, t.accent)}
        </div>
      );
    default:
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          {bullets(slide.content)}
        </div>
      );
  }
}