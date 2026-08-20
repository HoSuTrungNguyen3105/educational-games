import { useCallback, useEffect, useRef, useState } from 'react'
import TemplateRenderer from '../../games/TemplateRenderer.jsx'
import { useEditorStore } from '../../stores/editor.store.js'

const RESIZE_HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export default function CanvasArea({ ctx, isMobile = false }) {
  const template = useEditorStore(s => s.template);
  const selectedId = useEditorStore(s => s.selectedId);
  const zoom = useEditorStore(s => s.zoom);
  const select = useEditorStore(s => s.select);
  const selectElement = useEditorStore(s => s.selectElement);
  const addElement = useEditorStore(s => s.addElement);
  const moveElement = useEditorStore(s => s.moveElement);
  const resizeElement = useEditorStore(s => s.resizeElement);
  const fitToScreen = useEditorStore(s => s.fitToScreen);

  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const [dropHint, setDropHint] = useState(null);

  const sorted = template ? template.elements.slice().sort((a, b) => a.zIndex - b.zIndex) : [];
  const pad = isMobile ? 16 : 48; // mobile: canvas chiếm gần hết bề rộng thay vì padding thừa

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const measure = () => {
      if (!template) return;
      const rect = node.getBoundingClientRect();
      fitToScreen(rect.width, rect.height, pad);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [fitToScreen, template, pad]);

  const startDrag = useCallback((e, el) => {
    e.stopPropagation();
    // Only prevent default if it's not a multi-touch gesture to allow zooming/panning potentially, but for now we prevent default to avoid scrolling while dragging
    if (e.pointerType !== "mouse") {
      // For touch, prevent scrolling while dragging
      e.target.setPointerCapture(e.pointerId);
    } else {
      e.preventDefault();
    }
    
    selectElement(el.id);
    dragRef.current = { mode: "move", id: el.id, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y };
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      moveElement(d.id, Math.round(d.origX + (ev.clientX - d.startX) / zoom), Math.round(d.origY + (ev.clientY - d.startY) / zoom));
    };
    const onUp = () => { 
      if (e.pointerType !== "mouse") {
         e.target.releasePointerCapture(e.pointerId);
      }
      dragRef.current = null; 
      window.removeEventListener("pointermove", onMove); 
      window.removeEventListener("pointerup", onUp); 
      window.removeEventListener("pointercancel", onUp); 
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }, [moveElement, selectElement, zoom]);

  const startResize = useCallback((e, el, handle) => {
    e.stopPropagation();
    if (e.pointerType !== "mouse") {
      e.target.setPointerCapture(e.pointerId);
    } else {
      e.preventDefault();
    }
    selectElement(el.id);
    dragRef.current = { mode: "resize", id: el.id, handle, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y, origW: el.width, origH: el.height };
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = (ev.clientX - d.startX) / zoom;
      const dy = (ev.clientY - d.startY) / zoom;
      let x = d.origX, y = d.origY, width = d.origW, height = d.origH;
      if (d.handle.includes("e")) width = Math.max(20, d.origW + dx);
      if (d.handle.includes("s")) height = Math.max(20, d.origH + dy);
      if (d.handle.includes("w")) { x = Math.max(0, d.origX + dx); width = Math.max(20, d.origX + d.origW - x); }
      if (d.handle.includes("n")) { y = Math.max(0, d.origY + dy); height = Math.max(20, d.origY + d.origH - y); }
      resizeElement(d.id, { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) });
    };
    const onUp = () => { 
      if (e.pointerType !== "mouse") {
        e.target.releasePointerCapture(e.pointerId);
      }
      dragRef.current = null; 
      window.removeEventListener("pointermove", onMove); 
      window.removeEventListener("pointerup", onUp); 
      window.removeEventListener("pointercancel", onUp); 
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }, [resizeElement, selectElement, zoom]);

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/x-element-type");
    if (!type || !template) return;
    const rect = canvasRef.current.getBoundingClientRect();
    addElement(type, Math.max(0, Math.round((e.clientX - rect.left) / zoom)), Math.max(0, Math.round((e.clientY - rect.top) / zoom)));
    setDropHint(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/x-element-type");
    if (!type || !template) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDropHint({ x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom });
  };

  if (!template) return <div className="flex-1 flex items-center justify-center text-sm text-[#8A7C63]">Đang tải thiết kế...</div>;

  return (
    <div ref={scrollRef} className={`${isMobile ? "editor-canvas-scroll-mobile" : ""} flex-1 overflow-auto bg-[#E9E4D6]`} style={{ cursor: dropHint ? "copy" : "default" }}>
      <div className={`min-h-full min-w-full flex items-center justify-center ${isMobile ? "p-2" : "p-6"}`}
        style={{ width: template.canvas.width * zoom + pad, height: template.canvas.height * zoom + pad }}>
        <div
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDropHint(null)}
          onClick={() => select(null)}
          className="relative shadow-sm"
          style={{ width: template.canvas.width, height: template.canvas.height, background: template.canvas.background, transform: `scale(${zoom})`, transformOrigin: "top left" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(29,46,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(29,46,74,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}></div>

          <div className="absolute inset-0">
            <TemplateRenderer template={template} context={ctx.previewContext} editing />
          </div>

          {sorted.map(el => (
            <div key={el.id} onPointerDown={(e) => startDrag(e, el)} onClick={(e) => { e.stopPropagation(); selectElement(el.id); }}
              style={{
                position: "absolute", left: el.x, top: el.y, width: el.width, height: el.height,
                zIndex: el.zIndex, cursor: "move", touchAction: "none", userSelect: "none", WebkitUserSelect: "none",
                outline: selectedId === el.id ? "2px solid #1B998B" : "1px dashed rgba(29,46,74,0.35)",
                outlineOffset: -1,
                borderRadius: el.type === "shape" && el.properties?.kind === "circle" ? "50%" : 8,
              }}>
              {selectedId === el.id && <ElementHandles el={el} onResize={startResize} isMobile={isMobile} zoom={zoom} />}
            </div>
          ))}

          {dropHint && (
            <div style={{ left: dropHint.x, top: dropHint.y }}
              className="absolute w-24 h-16 bg-ticket/20 border-2 border-dashed border-ticket rounded-lg pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[999]"></div>
          )}
        </div>
      </div>
    </div>
  );
}

function ElementHandles({ el, onResize, isMobile, zoom = 1 }) {
  const pos = {
    nw: { left: 0, top: 0 },
    n: { left: "50%", top: 0 },
    ne: { left: "100%", top: 0 },
    e: { left: "100%", top: "50%" },
    se: { left: "100%", top: "100%" },
    s: { left: "50%", top: "100%" },
    sw: { left: 0, top: "100%" },
    w: { left: 0, top: "50%" },
  };

  // Handles nằm BÊN TRONG canvas scale(zoom) → phân chia cho zoom
  // để vùng chạm/khung nhìn luôn có kích thước cố định trên màn hình,
  // kể cả khi phóng to hay thu nhỏ.
  const k = Math.max(0.2, zoom);
  const touchAreaSize = Math.round((isMobile ? 48 : 24) / k);
  const visualSize = Math.round((isMobile ? 18 : 10) / k);
  const borderW = Math.max(1, Math.round(2 / k));

  return (
    <>
      {RESIZE_HANDLES.map(h => (
        <div key={h}
          onPointerDown={(e) => onResize(e, el, h)}
          className="absolute flex items-center justify-center"
          style={{
            cursor: `${h}-resize`,
            touchAction: "none",
            width: touchAreaSize,
            height: touchAreaSize,
            left: pos[h].left,
            top: pos[h].top,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}>
           <div style={{ width: visualSize, height: visualSize, borderWidth: borderW }} className="bg-white border-[#1B998B] rounded-sm pointer-events-none shadow-sm" />
        </div>
      ))}
    </>
  );
}