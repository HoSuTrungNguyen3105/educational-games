import { FONT_STACK, PALETTE, SHAPE_KINDS } from '../../games/elementUtils.js'
import { useEditorStore } from '../../stores/editor.store.js'

const inputCls = "w-full note-card px-2 py-1.5 text-sm border-ink/10 focus:border-ticket";

export default function PropertiesPanel({ onPreview }) {
  const template = useEditorStore(s => s.template);
  const selectedId = useEditorStore(s => s.selectedId);
  const updateProperties = useEditorStore(s => s.updateProperties);
  const updateElement = useEditorStore(s => s.updateElement);
  const setCanvas = useEditorStore(s => s.setCanvas);
  const deleteElement = useEditorStore(s => s.deleteElement);
  const duplicateElement = useEditorStore(s => s.duplicateElement);
  const bringForward = useEditorStore(s => s.bringForward);
  const sendBackward = useEditorStore(s => s.sendBackward);
  const alignElement = useEditorStore(s => s.alignElement);

  const el = template?.elements.find(e => e.id === selectedId) || null;
  const p = el?.properties || {};

  const getElConfig = (el) => {
    if (!el || !template?.customizable?.elements) return true;
    const elements = template.customizable.elements;
    if (elements[el.id] !== undefined) return elements[el.id];
    if (el.type === 'game-component' && elements[el.component] !== undefined) return elements[el.component];
    if (elements[el.type] !== undefined) return elements[el.type];
    return true;
  };

  const elConfig = getElConfig(el);
  const allow = (prop) => elConfig === true || elConfig?.[prop];

  if (!template) return <div className="w-full lg:w-72 lg:shrink-0 lg:border-l border-ink/10 bg-paper2"></div>;

  return (
    <div className="w-full lg:w-72 lg:shrink-0 lg:border-l border-ink/10 bg-paper2 flex flex-col max-h-full overflow-hidden">
      <div className="p-3 border-b border-ink/10 flex items-center justify-between">
        <h3 className="font-display text-sm text-ink">Properties</h3>
        {el && <span className="text-[11px] font-mono text-[#8A7C63]">{el.type}</span>}
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-4">
        {!el ? (
          <CanvasProperties template={template} setCanvas={setCanvas} />
        ) : (
          <>
            <div className="space-y-3">
              {allow("position") && (
                <Labeled label="Position">
                  <div className="grid grid-cols-2 gap-2">
                    <NumField label="X" value={el.x} onChange={(v) => updateElement(el.id, { x: v })} />
                    <NumField label="Y" value={el.y} onChange={(v) => updateElement(el.id, { y: v })} />
                  </div>
                </Labeled>
              )}
              {allow("size") && (
                <Labeled label="Size">
                  <div className="grid grid-cols-2 gap-2">
                    <NumField label="W" value={el.width} onChange={(v) => updateElement(el.id, { width: Math.max(20, v) })} />
                    <NumField label="H" value={el.height} onChange={(v) => updateElement(el.id, { height: Math.max(20, v) })} />
                  </div>
                </Labeled>
              )}
            </div>

            <SectionTitle>Style</SectionTitle>
            <TypeProps el={el} p={p} onUpdate={(patch) => updateProperties(el.id, patch)} allow={allow} />
            
            {allow("font") && (
              <>
                <SectionTitle>Typography</SectionTitle>
                <TypographyProps el={el} p={p} onUpdate={(patch) => updateProperties(el.id, patch)} />
              </>
            )}

            <SectionTitle>Layer</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <MiniBtn onClick={() => bringForward(el.id)}>↑ Lên trước</MiniBtn>
              <MiniBtn onClick={() => sendBackward(el.id)}>↓ Xuống sau</MiniBtn>
              <MiniBtn onClick={() => alignElement(el.id, "left")}>← Trái</MiniBtn>
              <MiniBtn onClick={() => alignElement(el.id, "center")}>↔ Giữa ngang</MiniBtn>
              <MiniBtn onClick={() => alignElement(el.id, "right")}>→ Phải</MiniBtn>
              <MiniBtn onClick={() => alignElement(el.id, "middle")}>↕ Giữa dọc</MiniBtn>
              <MiniBtn onClick={() => alignElement(el.id, "top")}>↑ Đỉnh</MiniBtn>
              <MiniBtn onClick={() => alignElement(el.id, "bottom")}>↓ Đáy</MiniBtn>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <MiniBtn onClick={() => duplicateElement(el.id)}>📄 Nhân bản</MiniBtn>
              <MiniBtn onClick={() => { deleteElement(el.id); }} className="!border-ticket/40 !text-ticket">🗑️ Xóa</MiniBtn>
            </div>
          </>
        )}
      </div>

      {onPreview && (
        <div className="p-3 border-t border-ink/10">
          <button onClick={onPreview} className="w-full font-display bg-ink text-paper rounded-2xl py-2.5 text-sm hover:bg-ink2 transition">
            👁️ Xem trước
          </button>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="text-[11px] uppercase tracking-wider text-[#B7A987] font-mono font-semibold pt-1">{children}</div>;
}

function Labeled({ label, children }) {
  return (
    <div>
      <span className="block text-xs font-semibold text-ink mb-1.5">{label}</span>
      {children}
    </div>
  );
}

function NumField({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-1.5">
      <span className="text-[11px] text-[#8A7C63] font-mono w-4">{label}</span>
      <input type="number" className={inputCls} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="block text-[11px] text-[#8A7C63] font-mono mb-1">{label}</span>
      <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || ""} />
    </label>
  );
}

function ColorRow({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" className="w-8 h-8 border border-ink/15 rounded-lg cursor-pointer" value={value || "#1D2E4A"} onChange={(e) => onChange(e.target.value)} />
      <input className={inputCls + " font-mono"} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      <div className="flex gap-1">
        {PALETTE.map(c => (
          <button key={c} onClick={() => onChange(c)} className="w-4 h-4 rounded-full border border-ink/10" style={{ background: c }} title={c}></button>
        ))}
      </div>
    </div>
  );
}

function TypeProps({ el, p, onUpdate, allow }) {
  switch (el.type) {
    case "text":
      return <>
        <TextField label="Nội dung" value={p.text || ""} onChange={(v) => onUpdate({ text: v })} />
        <ColorRow value={p.color || "#1D2E4A"} onChange={(v) => onUpdate({ color: v })} />
        <ColorRow value={p.background || ""} onChange={(v) => onUpdate({ background: v })} />
      </>;
    case "image":
      return <>
        <TextField label="URL ảnh" value={p.src || ""} onChange={(v) => onUpdate({ src: v })} placeholder="https://..." />
        <NumSlider label="Độ mờ" value={p.opacity ?? 100} min={0} max={100} onChange={(v) => onUpdate({ opacity: v })} />
      </>;
    case "button":
      return <>
        <TextField label="Nội dung" value={p.text || ""} onChange={(v) => onUpdate({ text: v })} />
        <ColorRow value={p.background || "#1B998B"} onChange={(v) => onUpdate({ background: v })} />
        <ColorRow value={p.color || "#FFFFFF"} onChange={(v) => onUpdate({ color: v })} />
      </>;
    case "shape":
      return <>
        <Labeled label="Loại hình">
          <div className="flex gap-2">
            {SHAPE_KINDS.map(s => (
              <button key={s.id} onClick={() => onUpdate({ kind: s.id })}
                className={`flex-1 px-2 py-1.5 rounded-xl border text-xs transition ${p.kind === s.id ? "border-ink bg-ink/5 font-semibold" : "border-ink/15 text-[#8A7C63]"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </Labeled>
        {p.kind !== "line" && <ColorRow value={p.fill || "#F4B942"} onChange={(v) => onUpdate({ fill: v })} />}
        <ColorRow value={p.stroke || "#1D2E4A"} onChange={(v) => onUpdate({ stroke: v })} />
        <NumSlider label="Độ dày viền" value={p.strokeWidth ?? 0} min={0} max={12} onChange={(v) => onUpdate({ strokeWidth: v })} />
        <NumSlider label="Độ mờ" value={p.opacity ?? 100} min={0} max={100} onChange={(v) => onUpdate({ opacity: v })} />
      </>;
    case "timer":
    case "question":
      return <>
        <ColorRow value={p.color || "#1D2E4A"} onChange={(v) => onUpdate({ color: v })} />
      </>;
    case "answer":
      return <>
        <ColorRow value={p.color || "#1D2E4A"} onChange={(v) => onUpdate({ color: v })} />
        <ColorRow value={p.background || "#FFFFFF"} onChange={(v) => onUpdate({ background: v })} />
        <NumSlider label="Số cột" value={p.columns ?? 2} min={1} max={4} onChange={(v) => onUpdate({ columns: v })} />
      </>;
    case "leaderboard":
      return <>
        <ColorRow value={p.color || "#1D2E4A"} onChange={(v) => onUpdate({ color: v })} />
        <ColorRow value={p.background || "#FFFFFF"} onChange={(v) => onUpdate({ background: v })} />
      </>;
    case "game-component":
      return <>
        {allow("text") && <TextField label="Nội dung" value={p.text || ""} onChange={(v) => onUpdate({ text: v })} />}
        {allow("src") && <TextField label="URL ảnh" value={p.src || ""} onChange={(v) => onUpdate({ src: v })} placeholder="https://..." />}
        {allow("color") && <ColorRow value={p.color || "#1D2E4A"} onChange={(v) => onUpdate({ color: v })} />}
        {allow("background") && <ColorRow value={p.background || ""} onChange={(v) => onUpdate({ background: v })} />}
        {allow("gap") && <NumSlider label="Khoảng cách" value={p.gap ?? 8} min={0} max={40} onChange={(v) => onUpdate({ gap: v })} />}
        {allow("radius") && <NumSlider label="Bo góc" value={p.radius ?? 0} min={0} max={100} onChange={(v) => onUpdate({ radius: v })} />}
      </>;
    default:
      return null;
  }
}

function TypographyProps({ el, p, onUpdate }) {
  const showFont = ["text", "button", "question", "answer", "timer", "leaderboard", "game-component"].includes(el.type);
  if (!showFont) return null;
  return <>
    {showFont && (
      <Labeled label="Font">
        <select className={inputCls} value={p.font || "system"} onChange={(e) => onUpdate({ font: e.target.value })}>
          {FONT_STACK.map(f => <option key={f.id} value={f.id} style={{ fontFamily: f.stack }}>{f.label}</option>)}
        </select>
      </Labeled>
    )}
    {["text", "button", "question", "answer", "timer", "leaderboard", "game-component"].includes(el.type) && (
      <div className="grid grid-cols-2 gap-2">
        <NumSlider label="Size" value={p.fontSize ?? 20} min={8} max={120} onChange={(v) => onUpdate({ fontSize: v })} />
        <NumSlider label="Đậm" value={p.fontWeight ?? 500} min={300} max={900} step={100} onChange={(v) => onUpdate({ fontWeight: v })} />
      </div>
    )}
    {["text", "button"].includes(el.type) && (
      <Labeled label="Căn lề">
        <div className="flex gap-2">
          {["left", "center", "right"].map(a => (
            <button key={a} onClick={() => onUpdate({ align: a })}
              className={`flex-1 px-2 py-1.5 rounded-xl border text-xs transition ${p.align === a ? "border-ink bg-ink/5 font-semibold" : "border-ink/15 text-[#8A7C63]"}`}>
              {a === "left" ? "←" : a === "center" ? "↔" : "→"}
            </button>
          ))}
        </div>
      </Labeled>
    )}
  </>;
}

function CanvasProperties({ template, setCanvas }) {
  return (
    <>
      <SectionTitle>Canvas</SectionTitle>
      <Labeled label="Nền">
        <ColorRow value={template.canvas.background} onChange={(v) => setCanvas({ background: v })} />
      </Labeled>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="W" value={template.canvas.width} onChange={(v) => setCanvas({ width: Math.max(480, v) })} />
        <NumField label="H" value={template.canvas.height} onChange={(v) => setCanvas({ height: Math.max(360, v) })} />
      </div>
      <p className="text-[11px] text-[#B7A987] leading-relaxed">Kích thước khung vẽ áp dụng cho toàn bộ màn hình học sinh khi chơi.</p>
    </>
  );
}

function NumSlider({ label, value, min, max, step = 1, onChange }) {
  return (
    <label className="block">
      <span className="flex justify-between text-[11px] text-[#8A7C63] font-mono mb-1"><span>{label}</span><span>{value}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#1D2E4A]" />
    </label>
  );
}

function MiniBtn({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`px-2 py-1.5 rounded-xl border border-ink/15 text-xs text-ink hover:bg-ink/5 transition ${className}`}>
      {children}
    </button>
  );
}