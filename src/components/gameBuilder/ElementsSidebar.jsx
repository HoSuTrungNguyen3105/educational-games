import { useState } from 'react'
import { ELEMENT_TYPES, SHAPE_KINDS } from '../../games/elementUtils.js'
import { useEditorStore } from '../../stores/editor.store.js'

const PALETTE = ["#1D2E4A", "#E4572E", "#F4B942", "#1B998B", "#FF6F91", "#8B6FF1"];

export default function ElementsSidebar({ onAdd }) {
  const [filter, setFilter] = useState("all");
  const types = filter === "all" ? ELEMENT_TYPES : ELEMENT_TYPES.filter(t =>
    (filter === "basic" && ["text", "image", "button", "shape"].includes(t.type)) ||
    (filter === "game" && ["question", "answer", "timer", "leaderboard"].includes(t.type)));

  const icons = { text: "Aa", image: "🖼️", button: "🔘", shape: "⬛", question: "❓", answer: "✅", timer: "⏱️", leaderboard: "🏆" };

  return (
    <div className="w-full lg:w-56 lg:shrink-0 lg:border-r border-ink/10 bg-paper2 flex flex-col">
      <div className="p-3 border-b border-ink/10">
        <h3 className="font-display text-sm text-ink mb-2">Elements</h3>
        <div className="flex gap-1 bg-ink/5 rounded-full p-1">
          {[{ id: "all", label: "Tất cả" }, { id: "basic", label: "Cơ bản" }, { id: "game", label: "Trò chơi" }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-1 text-xs py-1.5 rounded-full transition ${filter === f.id ? "bg-white shadow-sm text-ink font-semibold" : "text-[#8A7C63]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-1.5">
        {types.map(t => (
          <DraggableElement key={t.type} type={t.type} label={t.label} icon={icons[t.type]} onAdd={onAdd} />
        ))}
        {filter !== "game" && <ShapeSubsection onAdd={onAdd} />}
      </div>
      <div className="hidden lg:block p-3 text-[11px] text-[#B7A987] border-t border-ink/10 leading-relaxed">
        Kéo thả element vào khung vẽ. Click element để chọn và chỉnh thuộc tính.
      </div>
    </div>
  );
}

function DraggableElement({ type, label, icon, onAdd }) {
  const [dragging, setDragging] = useState(false);
  const addElement = useEditorStore(s => s.addElement);

  const handleDragStart = (e) => {
    setDragging(true);
    e.dataTransfer.setData("application/x-element-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = () => {
    addElement(type, 120, 120);
    onAdd?.();
  };

  return (
    <button
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition text-left ${dragging ? "opacity-60 scale-95 border-ticket/50" : "border-ink/10 hover:border-ink/25 bg-white"} cursor-grab`}
    >
      <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-display font-bold text-white flex-shrink-0" style={{ background: PALETTE[type.length % PALETTE.length] }}>
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink leading-tight">{label}</span>
        <span className="block text-[11px] text-[#8A7C63]">{type}</span>
      </span>
    </button>
  );
}

function ShapeSubsection({ onAdd }) {
  const addElement = useEditorStore(s => s.addElement);
  return (
    <div className="pt-2 mt-2 border-t border-ink/10 space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-[#B7A987] font-mono px-1">Shape</span>
      {SHAPE_KINDS.map(s => (
        <button key={s.id} onClick={() => { addElement("shape", 120, 120, { kind: s.id }); onAdd?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl border border-ink/10 bg-white hover:border-ink/25 transition text-left cursor-pointer">
          <span className="w-9 h-9 rounded-xl bg-ink/5 flex items-center justify-center text-[#1D2E4A] text-lg">{s.icon}</span>
          <span className="text-sm font-semibold text-ink leading-tight">{s.label}</span>
        </button>
      ))}
    </div>
  );
}