import { useEffect, useLayoutEffect, useRef, useState } from "react";
import LessonElementView from "./LessonElementView.jsx";
import { CANVAS_W, CANVAS_H, clampGeo } from "../../hooks/useLessonEditor.js";

// LessonCanvas — stage vẽ MỘT trang bài học theo hệ toạ độ logic
// 1280×720 rồi scale vừa khung chứa (transform scale, gốc trên-trái).
// Dùng chung 3 chế độ qua prop `mode`:
//   • "edit"   — canvas soạn thảo: bấm chọn, kéo di chuyển, kéo góc đổi
//                kích thước (mọi thay đổi đều qua clampGeo đúng biên
//                server: x+w ≤ 1280, y+h ≤ 720).
//   • "play"   — LessonPlayer: hiển thị nguyên trạng, phần tử nhận sự
//                kiện bình thường (câu hỏi tương tác qua renderElement).
//   • "static" — thumbnail: không nhận sự kiện chuột.
// `renderElement(el)` cho phép nơi dùng thay cách vẽ một phần tử (player
// dùng để biến question thành tương tác); mặc định LessonElementView.

/** Style nền của trang từ page.background ({ type: "color"|"image", value });
 *  không có nền → trắng mặc định như trước. Dùng cho CẢ 3 chế độ vì mọi
 *  nơi đều vẽ qua LessonCanvas (editor, player, thumbnail dải trang). */
export function pageBackgroundStyle(page) {
  const bg = page?.background;
  if (bg?.type === "color" && bg.value) return { background: bg.value };
  if (bg?.type === "image" && bg.value) {
    return {
      background: "#FFFFFF",
      backgroundImage: `url("${String(bg.value).replace(/"/g, "%22")}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background: "#FFFFFF" };
}

function sortedElements(page) {
  return (page?.elements || [])
    .map((el, i) => ({ el, z: el.z ?? i }))
    .sort((a, b) => a.z - b.z)
    .map((s) => s.el);
}

export default function LessonCanvas({
  page, gameById = {}, showAnswer = false,
  mode = "static",
  selectedId = null, onSelect, onGeoChange, onGeoStart, onGeoEnd,
  renderElement, className = "",
}) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const dragRef = useRef(null);

  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const measure = () => setWidth(node.clientWidth || 0);
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(node);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scale = width > 0 ? width / CANVAS_W : 0;
  const editable = mode === "edit";
  const elements = sortedElements(page);

  // Kéo di chuyển / đổi kích thước: nghe trên window để không mất dấu
  // khi con trỏ ra khỏi phần tử; toạ độ quy về hệ logic qua `scale`.
  useEffect(() => {
    if (!editable) return undefined;
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = (e.clientX - d.startX) / (d.scale || 1);
      const dy = (e.clientY - d.startY) / (d.scale || 1);
      let geo;
      if (d.kind === "move") {
        geo = clampGeo({ x: d.orig.x + dx, y: d.orig.y + dy, w: d.orig.w, h: d.orig.h }, d.orig);
      } else {
        geo = clampGeo({ x: d.orig.x, y: d.orig.y, w: d.orig.w + dx, h: d.orig.h + dy }, d.orig);
      }
      onGeoChange?.(d.id, geo);
    };
    const onUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        onGeoEnd?.();
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [editable, onGeoChange, onGeoEnd]);

  const startDrag = (e, el, kind) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(el.id);
    onGeoStart?.();
    dragRef.current = {
      id: el.id, kind,
      startX: e.clientX, startY: e.clientY,
      orig: { x: el.x, y: el.y, w: el.w, h: el.h },
      scale,
    };
  };

  return (
    <div ref={wrapRef} className={className} style={{ width: "100%" }}>
      <div style={{ position: "relative", width: "100%", height: scale > 0 ? CANVAS_H * scale : undefined, aspectRatio: scale > 0 ? undefined : "16 / 9" }}>
        <div
          onPointerDown={editable ? () => onSelect?.(null) : undefined}
          style={{
            position: "absolute", left: 0, top: 0,
            width: CANVAS_W, height: CANVAS_H,
            transform: scale > 0 ? `scale(${scale})` : undefined,
            transformOrigin: "top left",
            ...pageBackgroundStyle(page),
            overflow: "hidden",
            pointerEvents: mode === "static" ? "none" : "auto",
          }}
        >
          {elements.map((el) => {
            const selected = editable && selectedId === el.id;
            return (
              <div
                key={el.id}
                onPointerDown={editable ? (e) => startDrag(e, el, "move") : undefined}
                style={{
                  position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h,
                  cursor: editable ? "move" : undefined,
                  outline: selected ? "3px solid #2F6FED" : undefined,
                  outlineOffset: 0,
                  zIndex: selected ? 999 : undefined,
                }}
              >
                {renderElement
                  ? renderElement(el)
                  : <LessonElementView el={el} game={gameById[el.props?.gameId] || null} showAnswer={showAnswer} />}
                {selected && (
                  <div
                    onPointerDown={(e) => startDrag(e, el, "resize")}
                    title="Kéo để đổi kích thước"
                    style={{
                      position: "absolute", right: -9, bottom: -9, width: 22, height: 22,
                      background: "#2F6FED", border: "3px solid #fff", borderRadius: 6,
                      cursor: "nwse-resize", boxShadow: "0 1px 5px rgba(0,0,0,0.35)",
                    }}
                  />
                )}
              </div>
            );
          })}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p style={{ color: "#B4A888", fontSize: 22 }}>Trang trống — thêm nội dung từ thanh công cụ bên trái</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
