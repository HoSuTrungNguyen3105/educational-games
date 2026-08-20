import { useEffect, useRef, useState } from 'react'
import { gameService } from '../../services/api.js'
import { useEditorStore } from '../../stores/editor.store.js'
import { useMediaQuery } from '../../lib/hooks.js'
import CanvasArea from './CanvasArea.jsx'
import ElementsSidebar from './ElementsSidebar.jsx'
import PropertiesPanel from './PropertiesPanel.jsx'
import TemplateRenderer from '../../games/TemplateRenderer.jsx'
import { Loader } from '../ui.jsx'
import { gameTemplateRegistry } from '../../games/templates/gameTemplates.js'

// Context giả lập để hiển thị trong editor (không có dữ liệu game thật)
const PREVIEW_CONTEXT = {
  question: { content: "Câu hỏi mẫu hiển thị tại đây — dữ liệu thật lấy từ game khi chơi" },
  options: ["Paris", "London", "Tokyo", "Seoul"].map((t, i) => ({ id: `o${i}`, content: t })),
  timeLeft: 20,
  leaderboard: [
    { playerId: "p1", name: "Minh Anh", score: 320 },
    { playerId: "p2", name: "Gia Huy", score: 260 },
    { playerId: "p3", name: "Khánh Linh", score: 210 },
  ],
  score: 360,
  playerName: "Bạn",
};

export default function GameBuilder({ gameId, onDone, onCancel, showToast }) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!gameId);
  const [showPreview, setShowPreview] = useState(false);
  const [sheet, setSheet] = useState(null); // "elements" | "properties" — mobile overlay
  const [title, setTitle] = useState("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const template = useEditorStore(s => s.template);
  const selectedId = useEditorStore(s => s.selectedId);
  const zoom = useEditorStore(s => s.zoom);
  const past = useEditorStore(s => s.past);
  const future = useEditorStore(s => s.future);
  const undo = useEditorStore(s => s.undo);
  const redo = useEditorStore(s => s.redo);
  const zoomIn = useEditorStore(s => s.zoomIn);
  const zoomOut = useEditorStore(s => s.zoomOut);
  const resetZoom = useEditorStore(s => s.resetZoom);
  const loadTemplate = useEditorStore(s => s.loadTemplate);
  const clearSelection = useEditorStore(s => s.clearSelection);
  const deleteElement = useEditorStore(s => s.deleteElement);
  const duplicateElement = useEditorStore(s => s.duplicateElement);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!gameId) {
        if (!template) setShowTemplateSelector(true);
        setLoading(false);
        return;
      }
      try {
        const g = await gameService.get(gameId);
        if (cancelled) return;
        setTitle(g ? g.title : "");
        loadTemplate(g?.design || null);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        showToast(e.message || "Không tải được thiết kế", "error");
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [gameId, loadTemplate, showToast]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !typing) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y" && !typing) {
        e.preventDefault();
        redo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && !typing && selectedId) {
        e.preventDefault();
        deleteElement(selectedId);
        clearSelection();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "d") && !typing && selectedId) {
        e.preventDefault();
        duplicateElement(selectedId);
      } else if (e.key === "Escape") {
        setShowPreview(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, undo, redo, deleteElement, duplicateElement, clearSelection]);

  const save = async () => {
    setSaving(true);
    try {
      let id = gameId;
      const payload = { design: template };
      if (template?.templateId) payload.templateId = template.templateId;
      if (title.trim()) payload.title = title.trim();
      if (id) await gameService.update(id, payload);
      else {
        const created = await gameService.create({ 
          title: title.trim() || "Trò chơi mới", 
          description: "", 
          subject: "Tổng hợp", 
          topic: "", 
          language: "vi", 
          template: template?.templateId || "custom", 
          status: "draft", 
          design: template 
        });
        id = created.id;
      }
      showToast("Đã lưu thiết kế 🎨", "success");
      onDone(id);
    } catch (e) {
      showToast(e.message || "Không lưu được", "error");
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader label="Đang mở Game Builder..." /></div>;

  if (showTemplateSelector) {
    return <TemplateSelector onSelect={(t) => {
      // Clone default template
      const defaultDesign = {
        templateId: t.id,
        version: t.version,
        canvas: JSON.parse(JSON.stringify(t.canvas)),
        elements: JSON.parse(JSON.stringify(t.elements || [])),
        customizable: JSON.parse(JSON.stringify(t.customizable || {}))
      };
      loadTemplate(defaultDesign);
      setShowTemplateSelector(false);
    }} onCancel={onCancel} />;
  }

  return (
    <div className="h-dvh flex flex-col bg-paper overflow-hidden">
      <Toolbar title={title} setTitle={setTitle} zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom}
        canUndo={past.length > 0} canRedo={future.length > 0} onUndo={undo} onRedo={redo}
        onPreview={() => setShowPreview(true)} onSave={save} saving={saving} onCancel={onCancel} />

      <div className="flex-1 flex min-h-0">
        {!isMobile && <ElementsSidebar />}
        <CanvasArea
          ctx={{ previewContext: PREVIEW_CONTEXT }}
          isMobile={isMobile}
        />
        {!isMobile && <PropertiesPanel onPreview={() => setShowPreview(true)} />}
      </div>

      {isMobile && (
        <MobileBar zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom}
          sheet={sheet} setSheet={setSheet} onPreview={() => setShowPreview(true)} onSave={save} saving={saving} />
      )}

      {isMobile && sheet === "elements" && (
        <MobileSheet title="🧩 Elements" onClose={() => setSheet(null)}>
          <ElementsSidebar onAdd={() => setSheet(null)} />
        </MobileSheet>
      )}
      {isMobile && sheet === "properties" && (
        <MobileSheet title="🎛️ Chỉnh sửa" onClose={() => setSheet(null)}>
          <PropertiesPanel onPreview={() => { setSheet(null); setShowPreview(true); }} />
        </MobileSheet>
      )}

      {showPreview && (
        <PreviewModal template={template} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

function MobileBar({ zoom, onZoomIn, onZoomOut, onResetZoom, sheet, setSheet, onPreview, onSave, saving }) {
  return (
    <div className="flex items-stretch justify-between gap-2 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] bg-ink text-paper border-t border-paper/10 z-30">
      <div className="flex items-center gap-2">
        <button onClick={() => setSheet(sheet === "elements" ? null : "elements")}
          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-lg gap-0.5 transition ${sheet === "elements" ? "bg-gold text-ink" : "bg-paper/10 hover:bg-paper/20"}`}
          title="Thêm element" aria-label="Thêm element"><span>🧩</span><span className="text-[9px] font-mono">Element</span></button>
        <button onClick={() => setSheet(sheet === "properties" ? null : "properties")}
          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-lg gap-0.5 transition ${sheet === "properties" ? "bg-gold text-ink" : "bg-paper/10 hover:bg-paper/20"}`}
          title="Thuộc tính" aria-label="Thuộc tính"><span>🎛️</span><span className="text-[9px] font-mono">Chỉnh sửa</span></button>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={onZoomOut} className="w-11 h-12 rounded-xl bg-paper/10 hover:bg-paper/20 text-lg" title="Thu nhỏ" aria-label="Thu nhỏ">−</button>
        <button onClick={onResetZoom} className="px-2 h-12 text-xs font-mono text-paper/80 hover:text-paper" title="Về mặc định">{Math.round(zoom * 100)}%</button>
        <button onClick={onZoomIn} className="w-11 h-12 rounded-xl bg-paper/10 hover:bg-paper/20 text-lg" title="Phóng to" aria-label="Phóng to">+</button>
        <button onClick={onPreview} className="w-12 h-12 rounded-xl bg-paper/10 hover:bg-paper/20 text-lg flex flex-col items-center justify-center gap-0.5" title="Preview" aria-label="Preview"><span>👁️</span><span className="text-[9px] font-mono">Xem</span></button>
        <button onClick={onSave} disabled={saving} className="h-12 px-4 rounded-xl bg-gold text-ink font-display font-semibold text-sm hover:brightness-105 transition disabled:opacity-50">
          {saving ? "..." : "💾"}
        </button>
      </div>
    </div>
  );
}

function MobileSheet({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm flex flex-col justify-end anim-fade pb-[env(safe-area-inset-bottom)]" onClick={onClose}>
      <div className="bg-paper2 rounded-t-3xl h-[75dvh] max-h-[85dvh] flex flex-col anim-pop shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-3 border-b border-ink/10 flex items-center justify-between">
          <h3 className="font-display text-base text-ink">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-ink/5 hover:bg-ink/10 text-ink flex items-center justify-center" title="Đóng" aria-label="Đóng">✕</button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function Toolbar({ title, setTitle, zoom, onZoomIn, onZoomOut, onResetZoom, canUndo, canRedo, onUndo, onRedo, onPreview, onSave, saving, onCancel }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3 bg-ink text-paper sticky top-0 z-30 flex-wrap">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="text-paper/60 hover:text-paper text-sm">← Thoát</button>
        <span className="text-2xl">🎨</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên trò chơi..."
          className="bg-ink2 text-paper rounded-xl px-3 py-1.5 text-sm w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-paper/40" />
      </div>

      <div className="hidden lg:flex items-center gap-2">
        <button onClick={onUndo} disabled={!canUndo} title="Hoàn tác (Ctrl+Z)"
          className="w-9 h-9 rounded-xl bg-paper/10 hover:bg-paper/20 flex items-center justify-center text-lg disabled:opacity-30 transition">↩️</button>
        <button onClick={onRedo} disabled={!canRedo} title="Làm lại (Ctrl+Y)"
          className="w-9 h-9 rounded-xl bg-paper/10 hover:bg-paper/20 flex items-center justify-center text-lg disabled:opacity-30 transition">↪️</button>
        <div className="flex items-center rounded-xl bg-paper/10 overflow-hidden ml-1">
          <button onClick={onZoomOut} className="w-9 h-9 hover:bg-paper/20 text-lg">−</button>
          <button onClick={onResetZoom} className="px-2 text-xs font-mono text-paper/80 hover:text-paper" title="Về mặc định">{Math.round(zoom * 100)}%</button>
          <button onClick={onZoomIn} className="w-9 h-9 hover:bg-paper/20 text-lg">+</button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onPreview} className="font-display text-sm bg-paper/15 hover:bg-paper/25 text-paper rounded-2xl px-4 py-2 transition">
          👁️ Preview
        </button>
        <button onClick={onSave} disabled={saving} className="font-display font-semibold text-sm bg-gold text-ink rounded-2xl px-5 py-2 hover:brightness-105 transition disabled:opacity-50">
          {saving ? "Đang lưu..." : "💾 Save"}
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ template, onClose }) {
  const ctx = {
    ...PREVIEW_CONTEXT,
    question: { ...PREVIEW_CONTEXT.question, content: "Thủ đô của nước Pháp là gì?" },
    timeLeft: 15,
  };
  const [scale, setScale] = useState(1);
  const fitRef = useRef(null);

  useEffect(() => {
    const node = fitRef.current;
    if (!node || !template) return;
    const compute = () => {
      const rect = node.getBoundingClientRect();
      const s = Math.min(1.5, (rect.width - 16) / template.canvas.width, (rect.height - 16) / template.canvas.height);
      setScale(Math.max(0.05, s));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(node);
    window.addEventListener("resize", compute);
    return () => { ro.disconnect(); window.removeEventListener("resize", compute); };
  }, [template]);

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4" onClick={onClose}>
      <div ref={fitRef} className="bg-white rounded-3xl p-4 md:p-6 max-w-[94vw] max-h-[92vh] overflow-hidden anim-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-base md:text-lg text-ink truncate">👁️ Preview — giao diện học sinh</h3>
          <button onClick={onClose} className="text-ink/50 hover:text-ink text-lg flex-shrink-0">✕</button>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg mx-auto"
          style={{ width: Math.max(1, Math.round(template.canvas.width * scale)), height: Math.max(1, Math.round(template.canvas.height * scale)) }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <TemplateRenderer template={template} context={ctx} />
          </div>
        </div>
        <p className="text-xs text-[#8A7C63] mt-3 text-center">Đây là giao diện học sinh sẽ thấy khi chơi. Dữ liệu câu hỏi/đáp án/bảng xếp hạng sẽ lấy từ game realtime.</p>
      </div>
    </div>
  );
}

function TemplateSelector({ onSelect, onCancel }) {
  const templates = gameTemplateRegistry.getAll();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display text-ink font-bold">Chọn Template Trò Chơi</h2>
            <p className="text-ink/60 mt-1">Bắt đầu thiết kế với một mẫu có sẵn hoặc một canvas trống</p>
          </div>
          <button onClick={onCancel} className="text-ink/50 hover:text-ink">✕ Thoát</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(t => (
            <div key={t.id} onClick={() => onSelect(t)} 
              className="border-2 border-ink/10 rounded-2xl p-5 hover:border-gold hover:shadow-lg transition cursor-pointer flex flex-col">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-display font-semibold text-lg text-ink mb-2">{t.name}</h3>
              <p className="text-sm text-ink/70 flex-1">{t.description}</p>
            </div>
          ))}
          <div onClick={() => onSelect({ id: 'custom', version: 1, name: 'Trống', canvas: {width: 1200, height: 800, background: '#FFF6E7'}, elements: [], customizable: {canvasBackground: true, elements: {text: true, image: true, shape: true, button: true}} })}
            className="border-2 border-dashed border-ink/20 rounded-2xl p-5 hover:border-gold hover:bg-gold/5 transition cursor-pointer flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-display font-semibold text-lg text-ink mb-2">Bắt đầu từ số 0</h3>
            <p className="text-sm text-ink/70 flex-1">Thiết kế một canvas hoàn toàn mới</p>
          </div>
        </div>
      </div>
    </div>
  );
}