import { useCallback, useRef, useState } from 'react'
import TemplateRenderer from '../../games/TemplateRenderer.jsx'
import { useEditorStore } from '../../stores/editor.store.js'

const RESIZE_HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export default function CanvasArea({ ctx }) {
  const template = useEditorStore(s => s.template);
  const selectedId = useEditorStore(s => s.selectedId);
  const zoom = useEditorStore(s => s.zoom);
  const select = useEditorStore(s => s.select);
  const selectElement = useEditorStore(s => s.selectElement);
  const addElement = useEditorStore(s => s.addElement);
  const moveElement = useEditorStore(s => s.moveElement);
  const resizeElement = useEditorStore(s => s.resizeElement);

  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const [dropHint, setDropHint] = useState(null);

  const sorted = template ? template.elements.slice().sort((a, b) => a.zIndex - b.zIndex) : [];

  const startDrag = useCallback((e, el) => {
    e.stopPropagation();
    selectElement(el.id);
    dragRef.current = { mode: "move", id: el.id, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y };
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      moveElement(d.id, Math.round(d.origX + (ev.clientX - d.startX) / zoom), Math.round(d.origY + (ev.clientY - d.startY) / zoom));
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [moveElement, selectElement, zoom]);

  const startResize = useCallback((e, el, handle) => {
    e.stopPropagation();
    selectElement(el.id);
    dragRef.current = { mode: "resize", id: el.id, handle, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y, origW: el.width, origH: el.height };
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = (ev.clientX - d.startX) / zoom;
      const dy = (ev.clientY - d.startY) / zoom;
      let x = d.origX, y = d.origY, width = d.origW, height = d.origH;
      if (d.handle.includes("e")) width = Math.max(40, d.origW + dx);
      if (d.handle.includes("s")) height = Math.max(30, d.origH + dy);
      if (d.handle.includes("w")) { x = Math.max(0, d.origX + dx); width = Math.max(40, d.origX + d.origW - x); }
      if (d.handle.includes("n")) { y = Math.max(0, d.origY + dy); height = Math.max(30, d.origY + d.origH - y); }
      resizeElement(d.id, { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) });
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
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
    <div className="editor-canvas-scroll flex-1 overflow-auto bg-[#E9E4D6]" style={{ cursor: dropHint ? "copy" : "default" }}>
      <div className="min-h-full min-w-full flex items-start justify-center p-8" style={{ width: template.canvas.width * zoom + 80, height: template.canvas.height * zoom + 80 }}>
        <div
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDropHint(null)}
          onClick={() => select(null)}
          className="relative rounded-lg"
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
            <div key={el.id} onPointerDown={(e) => startDrag(e, el)} onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute", left: el.x, top: el.y, width: el.width, height: el.height,
                zIndex: el.zIndex, cursor: "move",
                outline: selectedId === el.id ? "2px solid #1B998B" : "1px dashed rgba(29,46,74,0.35)",
                outlineOffset: -1,
                borderRadius: el.type === "shape" && el.properties?.kind === "circle" ? "50%" : 8,
              }}>
              {selectedId === el.id && <ElementHandles el={el} onResize={startResize} />}
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

function ElementHandles({ el, onResize }) {
  const pos = {
    nw: { left: -7, top: -7 },
    n: { left: "50%", top: -7, transform: "translateX(-50%)" },
    ne: { right: -7, top: -7 },
    e: { right: -7, top: "50%", transform: "translateY(-50%)" },
    se: { right: -7, bottom: -7 },
    s: { left: "50%", bottom: -7, transform: "translateX(-50%)" },
    sw: { left: -7, bottom: -7 },
    w: { left: -7, top: "50%", transform: "translateY(-50%)" },
  };
  return (
    <>
      {RESIZE_HANDLES.map(h => (
        <span key={h}
          onPointerDown={(e) => onResize(e, el, h)}
          className="absolute w-3 h-3 bg-white border-2 border-[#1B998B] rounded-sm"
          style={{ cursor: `${h}-resize`, ...pos[h] }} />
      ))}
    </>
  );
}