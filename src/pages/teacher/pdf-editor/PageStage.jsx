/**
 * PageStage.jsx — vùng làm việc: canvas render trang + lớp phủ đối tượng.
 *
 * Tách riêng phần RENDER (canvas) khỏi phần THAO TÁC (lớp phủ DOM) theo yêu
 * cầu §4. Mọi tọa độ trong component này là pt (đơn vị PDF), đổi sang pixel
 * bằng `scale` — nhờ vậy zoom chỉ là nhân số, không phải tính lại toạ độ.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { renderPageToCanvas, sampleTextColors } from "./pdfLoader.js";
import {
  createLine,
  createRect,
  createRedact,
  createText,
  moveObject,
  objectBBox,
  resizeObject,
} from "./model.js";
import ObjectView from "./ObjectView.jsx";

const DRAG_MIN = 3; // pt — nhỏ hơn thì coi như bấm chứ không phải kéo

function normalizeBox(a, b) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(b.x - a.x),
    h: Math.abs(b.y - a.y),
  };
}

/* Giữ sự kiện trong lúc kéo. Bọc try/catch vì setPointerCapture ném
 * NotFoundError khi pointer không còn hoạt động (thiết bị phụ, sự kiện mô
 * phỏng…) — nếu ném ra ngoài thì cả lượt kéo sẽ hỏng. */
function capturePointer(el, pointerId) {
  try {
    el.setPointerCapture(pointerId);
  } catch { /* bỏ qua — vẫn kéo được chừng nào chuột nằm trong trang */ }
}

export default function PageStage({
  pdfPage,
  pageId,
  pageMeta,
  rotation,
  scale,
  dpr,
  objects,
  tool,
  selectedId,
  editingId,
  textTargets,
  measureFor,
  fontCssFor,
  stageApiRef,
  onSelect,
  onCreate,
  onEditOriginal,
  onLiveObject,
  onSnapshot,
  onTextInput,
  onTextEditEnd,
}) {
  const pageRef = useRef(null);
  const canvasRef = useRef(null);
  const taskRef = useRef(null);
  const dragRef = useRef(null);
  const draftRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const [renderError, setRenderError] = useState("");

  /* ── Render trang bằng PDF.js ─────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pdfPage) return undefined;
    let cancelled = false;

    (async () => {
      const prev = taskRef.current;
      if (prev) {
        try { prev.cancel(); } catch { /* đã hủy */ }
        try { await prev.promise; } catch { /* đã hủy */ }
        taskRef.current = null;
      }
      if (cancelled) return;
      setRenderError("");
      let task;
      try {
        task = renderPageToCanvas(pdfPage, canvas, { scale, rotation, dpr });
      } catch (err) {
        console.warn("[pdf-editor] không render được trang:", err);
        setRenderError("Không render được trang này.");
        return;
      }
      taskRef.current = task;
      try {
        await task.promise;
      } catch (err) {
        if (!cancelled && err?.name !== "RenderingCancelledException") {
          console.warn("[pdf-editor] lỗi render:", err);
          setRenderError("Không render được trang này.");
        }
      } finally {
        if (taskRef.current === task) taskRef.current = null;
      }
    })();

    return () => { cancelled = true; };
  }, [pdfPage, scale, rotation, dpr]);

  useEffect(() => () => {
    const task = taskRef.current;
    if (task) { try { task.cancel(); } catch { /* noop */ } }
  }, []);

  /* ── API cho trang cha: lấy màu nền/chữ từ canvas đã render ───────────── */
  useEffect(() => {
    if (!stageApiRef) return undefined;
    stageApiRef.current = {
      // Canvas có thể đang render dở (nền trắng đã tô, nội dung chưa vẽ) —
      // chờ lượt render hiện tại xong rồi mới đọc pixel, tránh lấy sai màu.
      sampleColors: async (box) => {
        const task = taskRef.current;
        if (task) { try { await task.promise; } catch { /* đã hủy */ } }
        // box theo pt — truyền kích thước trang theo pt để tỉ lệ pixel đúng
        // (canvas.width / pageW_pt = scale × dpr).
        const w = rotation % 180 === 0 ? pageMeta.width : pageMeta.height;
        const h = rotation % 180 === 0 ? pageMeta.height : pageMeta.width;
        return sampleTextColors(canvasRef.current, box, w, h);
      },
    };
    return () => { stageApiRef.current = null; };
  });

  /* ── Toạ độ:pointer → pt trên trang ─────────────────────────────────── */
  const toPoint = useCallback((e) => {
    const rect = pageRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  }, [scale]);

  /* ── Vẽ mới (chữ nhật / vùng che / highlight / đường kẻ) ──────────────── */
  const handleStagePointerDown = (e) => {
    if (e.button !== 0 && e.button !== undefined) return;
    const pt = toPoint(e);

    if (tool === "text") {
      onCreate(createText(pageId, pt.x, pt.y));
      return;
    }
    if (tool === "edit-text") {
      // Dòng chữ gốc tự bắt sự kiện riêng (textTargets); bấm vùng trống = bỏ chọn.
      onSelect(null);
      return;
    }
    if (tool === "rect" || tool === "redact" || tool === "highlight" || tool === "line") {
      draftRef.current = { type: tool, start: pt };
      capturePointer(e.currentTarget, e.pointerId);
      setDraft({ type: tool, a: pt, b: pt });
      return;
    }
    onSelect(null);
  };

  const handleStagePointerMove = (e) => {
    const d = draftRef.current;
    if (!d) return;
    setDraft({ type: d.type, a: d.start, b: toPoint(e) });
  };

  const handleStagePointerUp = (e) => {
    const d = draftRef.current;
    draftRef.current = null;
    setDraft(null);
    if (!d) return;
    const pt = toPoint(e);
    const dist = Math.hypot(pt.x - d.start.x, pt.y - d.start.y);
    if (dist < DRAG_MIN) return; // bấm nhả → bỏ qua, không tạo đối tượng rác

    if (d.type === "line") {
      onCreate(createLine(pageId, d.start.x, d.start.y, pt.x, pt.y));
      return;
    }
    const box = normalizeBox(d.start, pt);
    if (box.w < 2 || box.h < 2) return;
    if (d.type === "redact") {
      onCreate(createRedact(pageId, box.x, box.y, box.w, box.h));
      return;
    }
    if (d.type === "highlight") {
      onCreate(
        createRect(pageId, box.x, box.y, box.w, box.h, {
          fill: "#fde047",
          fillOpacity: 0.45,
          stroke: null,
          strokeWidth: 0,
        }),
      );
      return;
    }
    onCreate(createRect(pageId, box.x, box.y, box.w, box.h));
  };

  /* ── Kéo di chuyển / kéo resize đối tượng ────────────────────────────── */
  const startObjectDrag = (e, obj, handle = null) => {
    if (tool !== "select") return;
    if (editingId === obj.id) return;
    // Không preventDefault ở đây: làm vậy sẽ chặn luôn chuỗi dblclick (nhấp
    // đúp để sửa chữ). Chống chọn chữ/ kéo ảnh đã lo bằng CSS + draggable=false.
    e.stopPropagation();
    if (obj.id !== selectedId) onSelect(obj.id);
    dragRef.current = {
      id: obj.id,
      kind: handle ? "resize" : "move",
      handle,
      base: obj,
      start: { x: e.clientX, y: e.clientY },
      // Chỉ ghi lịch sử khi thật sự kéo — bấm chọn một lần không tạo mục
      // hoàn tác “rỗng”.
      snapped: false,
    };
    capturePointer(e.currentTarget, e.pointerId);
  };

  const handleObjectPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    if (!d.snapped) {
      if (Math.abs(e.clientX - d.start.x) + Math.abs(e.clientY - d.start.y) < 2) return;
      d.snapped = true;
      onSnapshot();
    }
    const dx = (e.clientX - d.start.x) / scale;
    const dy = (e.clientY - d.start.y) / scale;
    if (d.kind === "move") onLiveObject(moveObject(d.base, dx, dy));
    else onLiveObject(resizeObject(d.base, d.handle, dx, dy));
  };

  const endObjectDrag = () => { dragRef.current = null; };

  /* ── Xem trước hình vẽ đang kéo ──────────────────────────────────────── */
  let draftBox = null;
  if (draft) {
    if (draft.type === "line") {
      const dx = draft.b.x - draft.a.x;
      const dy = draft.b.y - draft.a.y;
      draftBox = {
        left: draft.a.x * scale,
        top: draft.a.y * scale - 1,
        width: Math.max(1, Math.hypot(dx, dy) * scale),
        height: 2,
        background: "#2271b1",
        transform: `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`,
        transformOrigin: "0 50%",
      };
    } else {
      const box = normalizeBox(draft.a, draft.b);
      draftBox = {
        left: box.x * scale,
        top: box.y * scale,
        width: box.w * scale,
        height: box.h * scale,
        background:
          draft.type === "redact"
            ? "rgba(29,35,39,0.25)"
            : draft.type === "highlight"
              ? "rgba(253,224,71,0.45)"
              : "rgba(34,113,177,0.12)",
        border: "1px dashed #2271b1",
      };
    }
  }

  const cssW = pageMeta ? (rotation % 180 === 0 ? pageMeta.width : pageMeta.height) * scale : 0;
  const cssH = pageMeta ? (rotation % 180 === 0 ? pageMeta.height : pageMeta.width) * scale : 0;

  return (
    <div
      ref={pageRef}
      className={`edu-pdf-page ${tool !== "select" ? `is-tool-${tool}` : ""}`}
      style={{ width: cssW || undefined, height: cssH || undefined }}
      onPointerDown={handleStagePointerDown}
      onPointerMove={handleStagePointerMove}
      onPointerUp={handleStagePointerUp}
    >
      <canvas ref={canvasRef} className="edu-pdf-canvas" />
      {renderError && <div className="edu-pdf-render-error">{renderError}</div>}

      <div className="edu-pdf-overlay" style={{ width: cssW, height: cssH }}>
        {objects.map((obj) => {
          const box = objectBBox(obj);
          return (
            <ObjectView
              key={obj.id}
              obj={obj}
              box={box}
              scale={scale}
              selected={selectedId === obj.id}
              editing={editingId === obj.id}
              measure={measureFor(obj)}
              fontCss={fontCssFor(obj)}
              onObjectPointerDown={startObjectDrag}
              onObjectPointerMove={handleObjectPointerMove}
              onObjectPointerUp={endObjectDrag}
              onDoubleClick={() => onSelect(obj.id, { edit: true })}
              onTextInput={onTextInput}
              onTextEditEnd={onTextEditEnd}
            />
          );
        })}

        {tool === "edit-text" && (textTargets || []).map((t) => (
          <div
            key={t.key}
            className="edu-pdf-text-target"
            style={{
              left: t.box.x * scale,
              top: t.box.y * scale,
              width: Math.max(2, t.box.w * scale),
              height: Math.max(2, t.box.h * scale),
            }}
            title="Nhấp để sửa dòng chữ này"
            onPointerDown={(e) => {
              e.stopPropagation();
              onEditOriginal(t);
            }}
          />
        ))}

        {draftBox && <div className="edu-pdf-draft" style={draftBox} />}
      </div>
    </div>
  );
}
