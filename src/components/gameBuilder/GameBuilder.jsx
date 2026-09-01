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
        setTitle(g ? g.name : "");
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
      if (title.trim()) payload.name = title.trim();
      if (id) await gameService.update(id, payload);
      else {
        const created = await gameService.create({ 
          name: title.trim() || "Trò chơi mới", 
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
    <div className="h-[100dvh] flex flex-col bg-paper overflow-hidden pt-[env(safe-area-inset-top)]">
      {/* Thanh công cụ trên cùng — chỉ giữ các thao tác quan trọng nhất (Thoát, tên, Undo/Redo, Save) */}
      <Toolbar title={title} setTitle={setTitle}
        canUndo={past.length > 0} canRedo={future.length > 0} onUndo={undo} onRedo={redo}
        onSave={save} saving={saving} onCancel={onCancel} />

      <div className="flex-1 flex min-h-0">
        {!isMobile && <ElementsSidebar />}

        {/* Vùng canvas — Zoom & Preview nổi ngay trên canvas, dùng chung cho cả mobile lẫn desktop */}
        <div className="relative flex-1 min-w-0 min-h-0">
          <CanvasArea ctx={{ previewContext: PREVIEW_CONTEXT }} isMobile={isMobile} />
          <CanvasFloatingControls
            zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom}
            onPreview={() => setShowPreview(true)}
          />
        </div>

        {!isMobile && <PropertiesPanel onPreview={() => setShowPreview(true)} />}
      </div>

      {/* Thanh dưới trên mobile — chỉ 2 lối tắt chính, to và dễ chạm bằng ngón cái */}
      {isMobile && (
        <MobileBar sheet={sheet} setSheet={setSheet} />
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

// Điều khiển Zoom + Preview nổi trên canvas — dùng chung mọi kích thước màn hình,
// tránh phải lặp lại các nút này ở cả thanh trên và thanh dưới trên mobile
function CanvasFloatingControls({ zoom, onZoomIn, onZoomOut, onResetZoom, onPreview }) {
  return (
    <>
      <button
        onClick={onPreview}
        className="absolute top-3 right-3 z-20 flex items-center gap-1.5 h-10 pl-3.5 pr-4 rounded-full bg-ink text-paper text-sm font-display shadow-lg hover:brightness-110 active:scale-95 transition"
        title="Xem thử (Esc để đóng)"
        aria-label="Xem thử giao diện học sinh"
      >
        <span aria-hidden="true">👁️</span> <span className="hidden sm:inline">Xem thử</span>
      </button>

      <div className="absolute bottom-3 right-3 z-20 flex items-center rounded-full bg-ink text-paper shadow-lg overflow-hidden">
        <button onClick={onZoomOut} className="w-10 h-10 flex items-center justify-center hover:bg-paper/10 active:bg-paper/20 text-lg transition" title="Thu nhỏ" aria-label="Thu nhỏ">−</button>
        <button onClick={onResetZoom} className="px-2.5 h-10 text-xs font-mono text-paper/80 hover:text-paper transition" title="Về 100%">{Math.round(zoom * 100)}%</button>
        <button onClick={onZoomIn} className="w-10 h-10 flex items-center justify-center hover:bg-paper/10 active:bg-paper/20 text-lg transition" title="Phóng to" aria-label="Phóng to">+</button>
      </div>
    </>
  );
}

// Thanh dưới trên mobile — chỉ còn 2 lối tắt điều hướng panel (không trùng Preview/Save nữa)
function MobileBar({ sheet, setSheet }) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] bg-ink text-paper border-t border-paper/10 z-30">
      <button
        onClick={() => setSheet(sheet === "elements" ? null : "elements")}
        className={`flex-1 max-w-[220px] h-14 rounded-2xl flex items-center justify-center gap-2 text-sm font-display font-semibold transition active:scale-[0.98] ${sheet === "elements" ? "bg-gold text-ink" : "bg-paper/10 hover:bg-paper/20"}`}
        aria-pressed={sheet === "elements"}
      >
        <span className="text-xl" aria-hidden="true">🧩</span> Thêm element
      </button>
      <button
        onClick={() => setSheet(sheet === "properties" ? null : "properties")}
        className={`flex-1 max-w-[220px] h-14 rounded-2xl flex items-center justify-center gap-2 text-sm font-display font-semibold transition active:scale-[0.98] ${sheet === "properties" ? "bg-gold text-ink" : "bg-paper/10 hover:bg-paper/20"}`}
        aria-pressed={sheet === "properties"}
      >
        <span className="text-xl" aria-hidden="true">🎛️</span> Chỉnh sửa
      </button>
    </div>
  );
}

function MobileSheet({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm flex flex-col justify-end anim-fade pb-[env(safe-area-inset-bottom)]" onClick={onClose}>
      <div className="bg-paper2 rounded-t-3xl h-[75dvh] max-h-[85dvh] flex flex-col anim-pop shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-ink/15 flex-shrink-0"></div>
        <div className="p-3 border-b border-ink/10 flex items-center justify-between">
          <h3 className="font-display text-base text-ink">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-ink/5 hover:bg-ink/10 text-ink flex items-center justify-center" title="Đóng" aria-label="Đóng">✕</button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

// Thanh công cụ trên cùng — gọn lại còn: Thoát, tên trò chơi, Undo/Redo, Save.
// Zoom và Preview đã chuyển xuống nổi trên canvas nên không còn lặp lại ở đây.
function Toolbar({ title, setTitle, canUndo, canRedo, onUndo, onRedo, onSave, saving, onCancel }) {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-3 px-3 md:px-6 py-2.5 md:py-3 bg-ink text-paper sticky top-[var(--sat)] z-30">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <button
          onClick={onCancel}
          title="Thoát"
          aria-label="Thoát khỏi Game Builder"
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-paper/70 hover:text-paper hover:bg-paper/10 md:w-auto md:h-auto md:px-1 md:rounded-none md:hover:bg-transparent transition"
        >
          <span aria-hidden="true">←</span><span className="hidden md:inline md:ml-1.5 text-sm">Thoát</span>
        </button>
        <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">🎨</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên trò chơi..."
          aria-label="Tên trò chơi"
          className="bg-ink2 text-paper rounded-xl px-3 py-1.5 text-sm min-w-0 flex-1 md:flex-none md:w-64 focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-paper/40 transition"
        />
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
        <button onClick={onUndo} disabled={!canUndo} title="Hoàn tác (Ctrl+Z)" aria-label="Hoàn tác"
          className="w-9 h-9 rounded-xl bg-paper/10 hover:bg-paper/20 flex items-center justify-center text-base md:text-lg disabled:opacity-30 transition">↩️</button>
        <button onClick={onRedo} disabled={!canRedo} title="Làm lại (Ctrl+Y)" aria-label="Làm lại"
          className="w-9 h-9 rounded-xl bg-paper/10 hover:bg-paper/20 flex items-center justify-center text-base md:text-lg disabled:opacity-30 transition">↪️</button>
        <button onClick={onSave} disabled={saving}
          className="font-display font-semibold text-sm bg-gold text-ink rounded-2xl px-4 md:px-5 py-2 hover:brightness-105 active:scale-95 transition disabled:opacity-50 ml-0.5">
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
          <button onClick={onClose} aria-label="Đóng preview" className="w-9 h-9 flex items-center justify-center rounded-xl text-ink/50 hover:text-ink hover:bg-ink/5 text-lg flex-shrink-0 transition">✕</button>
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
    <div className="min-h-[100dvh] flex items-center justify-center bg-paper p-4">
      <div className="bg-white rounded-3xl p-5 md:p-8 max-w-4xl w-full shadow-xl max-h-[92dvh] overflow-y-auto">
        <div className="flex items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-display text-ink font-bold">Chọn Template Trò Chơi</h2>
            <p className="text-ink/60 mt-1 text-sm md:text-base">Bắt đầu thiết kế với một mẫu có sẵn hoặc một canvas trống</p>
          </div>
          <button onClick={onCancel} className="flex-shrink-0 text-sm text-ink/50 hover:text-ink px-3 py-2 rounded-xl hover:bg-ink/5 transition">✕ Thoát</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="text-left border-2 border-ink/10 rounded-2xl p-5 hover:border-gold hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition flex flex-col"
            >
              <div className="text-4xl mb-3" aria-hidden="true">🎨</div>
              <h3 className="font-display font-semibold text-lg text-ink mb-2">{t.name}</h3>
              <p className="text-sm text-ink/70 flex-1">{t.description}</p>
            </button>
          ))}
          <button
            onClick={() => onSelect({ id: 'custom', version: 1, name: 'Trống', canvas: { width: 1200, height: 800, background: '#FFF6E7' }, elements: [], customizable: { canvasBackground: true, elements: { text: true, image: true, shape: true, button: true } } })}
            className="border-2 border-dashed border-ink/20 rounded-2xl p-5 hover:border-gold hover:bg-gold/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition flex flex-col items-center justify-center text-center"
          >
            <div className="text-4xl mb-3" aria-hidden="true">✨</div>
            <h3 className="font-display font-semibold text-lg text-ink mb-2">Bắt đầu từ số 0</h3>
            <p className="text-sm text-ink/70">Thiết kế một canvas hoàn toàn mới</p>
          </button>
        </div>
      </div>
    </div>
  );
}