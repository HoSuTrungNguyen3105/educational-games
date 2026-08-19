import { useEffect, useState } from 'react'
import { gameService } from '../../services/api.js'
import { useEditorStore } from '../../stores/editor.store.js'
import CanvasArea from './CanvasArea.jsx'
import ElementsSidebar from './ElementsSidebar.jsx'
import PropertiesPanel from './PropertiesPanel.jsx'
import TemplateRenderer from '../../games/TemplateRenderer.jsx'
import { Loader } from '../ui.jsx'

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
  const [title, setTitle] = useState("");

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
        loadTemplate(null);
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
      if (title.trim()) payload.title = title.trim();
      if (id) await gameService.update(id, payload);
      else {
        const created = await gameService.create({ title: title.trim() || "Trò chơi mới", description: "", subject: "Tổng hợp", topic: "", language: "vi", template: "custom", status: "draft", design: template });
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

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Toolbar title={title} setTitle={setTitle} zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom}
        canUndo={past.length > 0} canRedo={future.length > 0} onUndo={undo} onRedo={redo}
        onPreview={() => setShowPreview(true)} onSave={save} saving={saving} onCancel={onCancel} />
      <div className="flex-1 flex min-h-0">
        <ElementsSidebar />
        <CanvasArea ctx={{ previewContext: PREVIEW_CONTEXT }} />
        <PropertiesPanel onPreview={() => setShowPreview(true)} />
      </div>

      {showPreview && (
        <PreviewModal template={template} onClose={() => setShowPreview(false)} />
      )}
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

      <div className="flex items-center gap-2">
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
  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-4 md:p-6 max-w-[90vw] max-h-[90vh] overflow-auto anim-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-ink">👁️ Preview — giao diện học sinh</h3>
          <button onClick={onClose} className="text-ink/50 hover:text-ink text-lg">✕</button>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <TemplateRenderer template={template} context={ctx} />
        </div>
        <p className="text-xs text-[#8A7C63] mt-3 text-center">Đây là giao diện học sinh sẽ thấy khi chơi. Dữ liệu câu hỏi/đáp án/bảng xếp hạng sẽ lấy từ game realtime.</p>
      </div>
    </div>
  );
}