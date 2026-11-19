/**
 * PageStage.jsx — vùng làm việc: canvas render trang + LỚP CHỮ THẬT (TextLayer
 * của PDF.js: hover / bôi đen / sao chép chữ gốc) + lớp phủ đối tượng.
 *
 * Tách riêng phần RENDER (canvas) khỏi phần THAO TÁC (lớp phủ DOM) theo yêu
 * cầu §4. Mọi tọa độ trong component này là pt (đơn vị PDF), đổi sang pixel
 * bằng `scale` — nhờ vậy zoom chỉ là nhân số, không phải tính lại toạ độ.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { TextCursorInput } from "lucide-react";
import { renderPageToCanvas, renderTextLayer, sampleTextColors } from "./pdfLoader.js";
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
  editSelection,
  measureFor,
  faceFor,
  stageApiRef,
  onSelect,
  onCreate,
  onConvertSelection,
  onLiveObject,
  onSnapshot,
  onTextInput,
  onTextEditEnd,
}) {
  const pageRef = useRef(null);
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const layerRef = useRef(null);
  const taskRef = useRef(null);
  const dragRef = useRef(null);
  const draftRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const [renderError, setRenderError] = useState("");
  const [selBox, setSelBox] = useState(null);

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

  /* ── Lớp chữ THẬT của PDF (TextLayer) — hover / bôi đen / sao chép ─────── */
  useEffect(() => {
    const el = textLayerRef.current;
    if (!el || !pdfPage) return undefined;
    let cancelled = false;
    let layer = null;
    el.innerHTML = "";
    (async () => {
      try {
        const l = await renderTextLayer(pdfPage, el, { scale, rotation });
        if (cancelled) { try { l.cancel(); } catch { /* noop */ } return; }
        layer = l;
        layerRef.current = l;
      } catch (err) {
        // Không có lớp chữ (PDF scan…) hoặc lỗi đọc: trang vẫn xem / vẽ bình thường.
        if (!cancelled) console.warn("[pdf-editor] không dựng được lớp chữ:", err);
      }
    })();
    return () => {
      cancelled = true;
      layerRef.current = null;
      if (layer) { try { layer.cancel(); } catch { /* noop */ } }
      el.innerHTML = "";
    };
  }, [pdfPage, scale, rotation]);

  /* Theo dõi vùng bôi đen trong lớp chữ → đặt bubble "Sửa chữ đã chọn". */
  const refreshSelBox = useCallback(() => {
    const el = textLayerRef.current;
    const page = pageRef.current;
    const sel = window.getSelection();
    if (!el || !page || !sel || sel.isCollapsed || sel.rangeCount === 0) {
      setSelBox(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) { setSelBox(null); return; }
    const r = range.getBoundingClientRect();
    if (r.width < 2 && r.height < 2) { setSelBox(null); return; }
    const pr = page.getBoundingClientRect();
    setSelBox({ left: r.left - pr.left, top: r.top - pr.top, width: r.width, height: r.height });
  }, []);

  useEffect(() => {
    let raf = 0;
    const onSel = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(refreshSelBox); };
    document.addEventListener("selectionchange", onSel);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("selectionchange", onSel); };
  }, [refreshSelBox]);

  /* Vùng bôi đen → danh sách span chữ gốc (kèm khoảng ký tự được chọn). */
  const readSelectionSpans = () => {
    const sel = window.getSelection();
    const divs = layerRef.current?.textDivs || [];
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !divs.length) return [];
    const range = sel.getRangeAt(0);
    const spans = [];
    divs.forEach((div, i) => {
      if (!div || !range.intersectsNode(div)) return;
      const len = (div.textContent || "").length;
      let start = 0;
      let end = len;
      if (div.contains(range.startContainer)) {
        start = range.startContainer.nodeType === 3 ? range.startOffset : 0;
      }
      if (div.contains(range.endContainer)) {
        end = range.endContainer.nodeType === 3 ? range.endOffset : len;
      }
      if (end > start) spans.push({ index: i, start, end });
    });
    return spans;
  };

  const convertSelection = () => {
    const spans = readSelectionSpans();
    setSelBox(null);
    window.getSelection()?.removeAllRanges();
    if (spans.length) onConvertSelection(spans);
  };

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
      // Lớp chữ thật tự bắt sự kiện chọn chữ; bấm vùng trống = bỏ chọn đối tượng.
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

      {/* Lớp chữ thật của PDF: trong suốt, đè đúng vị trí chữ trên canvas —
          hover ra cursor text, kéo bôi đen / Ctrl+C như trình xem PDF thường. */}
      <div
        ref={textLayerRef}
        className="edu-pdf-textlayer textLayer"
        onPointerDown={(e) => { e.currentTarget.classList.add("selecting"); }}
        onPointerUp={(e) => { e.currentTarget.classList.remove("selecting"); refreshSelBox(); }}
        onPointerCancel={(e) => { e.currentTarget.classList.remove("selecting"); refreshSelBox(); }}
      />

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
              initialSelection={editSelection && editSelection.id === obj.id ? editSelection : null}
              measure={measureFor(obj)}
              face={faceFor(obj)}
              onObjectPointerDown={startObjectDrag}
              onObjectPointerMove={handleObjectPointerMove}
              onObjectPointerUp={endObjectDrag}
              onDoubleClick={() => onSelect(obj.id, { edit: true })}
              onTextInput={onTextInput}
              onTextEditEnd={onTextEditEnd}
            />
          );
        })}

        {draftBox && <div className="edu-pdf-draft" style={draftBox} />}
      </div>

      {selBox && (tool === "select" || tool === "edit-text") && (
        <div
          className="edu-pdf-selbubble"
          style={{
            left: Math.min(Math.max(selBox.left + selBox.width / 2, 110), Math.max(110, cssW - 110)),
            top: selBox.top > 44 ? selBox.top - 40 : selBox.top + selBox.height + 8,
          }}
          onPointerDown={(e) => e.preventDefault()}
        >
          <button type="button" onClick={convertSelection}>
            <TextCursorInput />
            <span>Sửa chữ đã chọn</span>
          </button>
          <span className="edu-pdf-selbubble-hint">Ctrl+C: sao chép</span>
        </div>
      )}
    </div>
  );
}
