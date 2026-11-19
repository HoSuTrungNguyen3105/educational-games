/**
 * ObjectView.jsx — vẽ 1 đối tượng đã thêm (văn bản / ảnh / hình / đường kẻ /
 * vùng che) + 8 tay nắm chọn cỡ, và ô sửa chữ tại chỗ.
 *
 * Văn bản hiển thị theo đúng DÒNG ĐÃ GÃY của model.wrapText — cùng thuật toán
 * với lúc xuất pdf-lib nên màn hình và file xuất ra giống hệt nhau.
 */
import { DEFAULT_LINE_HEIGHT, hexToRgb, wrapText } from "./model.js";

const RESIZE_HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

function fillStyle(hex, opacity) {
  if (!hex) return "transparent";
  if (opacity === undefined || opacity >= 1) return hex;
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${opacity})`;
}

export default function ObjectView({
  obj,
  box,
  scale,
  selected,
  editing,
  measure,
  face,
  onObjectPointerDown,
  onObjectPointerMove,
  onObjectPointerUp,
  onDoubleClick,
  onTextInput,
  onTextEditEnd,
  initialSelection,
}) {
  const shell = {
    left: box.x * scale,
    top: box.y * scale,
    width: Math.max(1, box.w * scale),
    height: Math.max(1, box.h * scale),
  };

  const startMove = (e) => onObjectPointerDown(e, obj, null);
  const startResize = (handle) => (e) => onObjectPointerDown(e, obj, handle);

  let inner = null;

  if (obj.type === "text") {
    const lh = obj.fontSize * (obj.lineHeight || DEFAULT_LINE_HEIGHT);
    const lines = wrapText(obj.text, obj.w, measure);
    const textStyle = {
      // face: mặt font thật sự dùng (font gốc nhúng hoặc DejaVu thay thế) —
      // font gốc đã đậm/nghiêng sẵn nên không xin trình duyệt tô đậm giả.
      fontFamily: face ? `"${face.cssFamily}", "Segoe UI", sans-serif` : undefined,
      fontSize: `${obj.fontSize * scale}px`,
      // index.css ép mọi textarea ≥16px (chống zoom iOS) — ô sửa chữ tại chỗ
      // phải đúng cỡ chữ thật nên đưa cỡ qua biến CSS, thắng lại bằng !important
      // có chọn lọc trong pdfEditor.css.
      "--edu-pdf-inline-fs": `${obj.fontSize * scale}px`,
      lineHeight: `${lh * scale}px`,
      fontWeight: face ? face.weight : obj.bold ? 700 : 400,
      fontStyle: face ? face.style : obj.italic ? "italic" : "normal",
      color: obj.color,
      textAlign: obj.align,
      opacity: obj.opacity ?? 1,
    };
    inner = editing ? (
      <textarea
        className="edu-pdf-text-input"
        value={obj.text}
        style={textStyle}
        autoFocus
        wrap="soft"
        ref={(el) => {
          // Vùng bôi đen trước đó được chọn sẵn trong ô sửa — gõ đè lên đúng
          // phần chữ đã chọn, phần còn lại của dòng giữ nguyên.
          if (el && initialSelection && el.dataset.selApplied !== "1") {
            el.dataset.selApplied = "1";
            const len = el.value.length;
            el.setSelectionRange(
              Math.max(0, Math.min(initialSelection.start, len)),
              Math.max(0, Math.min(initialSelection.end, len)),
            );
          }
        }}
        onChange={(e) => onTextInput(obj.id, e.target.value)}
        onBlur={onTextEditEnd}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") e.currentTarget.blur();
        }}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    ) : (
      <div className="edu-pdf-obj-text" style={textStyle}>
        {lines.join("\n")}
      </div>
    );
  } else if (obj.type === "image") {
    inner = (
      <img
        className="edu-pdf-obj-image"
        src={obj.src}
        alt=""
        draggable={false}
        style={{ opacity: obj.opacity ?? 1 }}
      />
    );
  } else if (obj.type === "rect") {
    inner = (
      <div
        className="edu-pdf-obj-shape"
        style={{
          background: fillStyle(obj.fill, obj.fill ? (obj.fillOpacity ?? 1) : undefined),
          border: obj.stroke && (obj.strokeWidth || 0) > 0
            ? `${Math.max(1, obj.strokeWidth * scale)}px solid ${obj.stroke}`
            : "none",
        }}
      />
    );
  } else if (obj.type === "redact") {
    inner = <div className="edu-pdf-obj-shape" style={{ background: obj.fill || "#ffffff" }} />;
  } else if (obj.type === "line") {
    const len = Math.hypot(obj.x2 - obj.x, obj.y2 - obj.y);
    const angle = (Math.atan2(obj.y2 - obj.y, obj.x2 - obj.x) * 180) / Math.PI;
    inner = (
      <div
        className="edu-pdf-obj-line"
        style={{
          left: (obj.x - box.x) * scale,
          top: (obj.y - box.y) * scale - (obj.strokeWidth * scale) / 2,
          width: Math.max(1, len * scale),
          height: Math.max(1, obj.strokeWidth * scale),
          background: obj.stroke,
          opacity: obj.opacity ?? 1,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "0 50%",
        }}
      />
    );
  }

  const handles = [];
  if (selected && !editing) {
    if (obj.type === "line") {
      handles.push(
        <span
          key="p1"
          className="edu-pdf-handle"
          style={{ left: (obj.x - box.x) * scale, top: (obj.y - box.y) * scale }}
          onPointerDown={startResize("p1")}
        />,
        <span
          key="p2"
          className="edu-pdf-handle"
          style={{ left: (obj.x2 - box.x) * scale, top: (obj.y2 - box.y) * scale }}
          onPointerDown={startResize("p2")}
        />,
      );
    } else {
      const list = obj.type === "text" ? ["e", "w"] : RESIZE_HANDLES;
      for (const h of list) {
        handles.push(
          <span
            key={h}
            className={`edu-pdf-handle edu-pdf-h-${h}`}
            onPointerDown={startResize(h)}
          />,
        );
      }
    }
  }

  return (
    <div
      className={`edu-pdf-obj ${selected ? "is-selected" : ""} ${editing ? "is-editing" : ""} ${obj.pairId ? "is-pair" : ""}`}
      style={shell}
      onPointerDown={startMove}
      onPointerMove={onObjectPointerMove}
      onPointerUp={onObjectPointerUp}
      onPointerCancel={onObjectPointerUp}
      onDoubleClick={onDoubleClick}
      title={obj.type === "text" ? "Nhấp đúp để sửa chữ" : undefined}
    >
      {inner}
      {handles}
    </div>
  );
}
