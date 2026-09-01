import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader } from '../../components/ui.jsx';
import { Save, RotateCcw, Move } from 'lucide-react';

const AVATAR_W = 245;
const AVATAR_H = 275;
const CANVAS_DISPLAY = 350;
const ASPECT = AVATAR_H / AVATAR_W;

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const CATEGORY_COLORS = {
  body: '#6366f1', skin: '#f59e0b', face: '#ef4444', hair: '#10b981',
  shirt: '#3b82f6', pants: '#8b5cf6', shoes: '#ec4899', hat: '#14b8a6',
  glasses: '#f97316', accessory: '#06b6d4',
};

const DEFAULT_TEMPLATE = {
  body:    { x: 0,   y: 0,   width: 245, height: 275, zIndex: 1 },
  skin:    { x: 250, y: 0,   width: 120, height: 290, zIndex: 2 },
  face:    { x: 250, y: 0,   width: 120, height: 290, zIndex: 3 },
  hair:    { x: 100, y: 0,   width: 200, height: 150, zIndex: 4 },
  shirt:   { x: 80,  y: 180, width: 200, height: 120, zIndex: 5 },
  pants:   { x: 90,  y: 280, width: 180, height: 150, zIndex: 6 },
  shoes:   { x: 100, y: 420, width: 160, height: 80,  zIndex: 7 },
  hat:     { x: 100, y: -30, width: 180, height: 100, zIndex: 8 },
  glasses: { x: 140, y: 60,  width: 120, height: 60,  zIndex: 9 },
  accessory: { x: 300, y: 200, width: 80, height: 80, zIndex: 10 },
};

const HANDLES = [
  { id: 'nw', cursor: 'nwse-resize', x: 0,   y: 0 },
  { id: 'n',  cursor: 'ns-resize',   x: 0.5, y: 0 },
  { id: 'ne', cursor: 'nesw-resize', x: 1,   y: 0 },
  { id: 'e',  cursor: 'ew-resize',   x: 1,   y: 0.5 },
  { id: 'se', cursor: 'nwse-resize', x: 1,   y: 1 },
  { id: 's',  cursor: 'ns-resize',   x: 0.5, y: 1 },
  { id: 'sw', cursor: 'nesw-resize', x: 0,   y: 1 },
  { id: 'w',  cursor: 'ew-resize',   x: 0,   y: 0.5 },
];

function getAuthToken() {
  try { return JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch { return ''; }
}

export default function AvatarTemplateEditor({ showToast }) {
  const [template, setTemplate] = useState(null);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ w: CANVAS_DISPLAY, h: Math.round(CANVAS_DISPLAY * ASPECT) });
  const modeRef = useRef(null); // 'move' | 'resize' | null
  const catRef = useRef(null);
  const startRef = useRef({ mx: 0, my: 0, orig: {} });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/avatar/items`).then(r => r.json()),
      fetch(`${API_BASE}/avatar/template`).then(r => r.json()),
    ])
      .then(([itemsRes, tmplRes]) => {
        if (itemsRes.status) setItems(itemsRes.data.items);
        if (tmplRes.status) setTemplate(tmplRes.data.template);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Track actual canvas size
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaleX = canvasSize.w / AVATAR_W;
  const scaleY = canvasSize.h / AVATAR_H;

  function toCanvas(clientX, clientY) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / canvasSize.w * AVATAR_W,
      y: (clientY - rect.top) / canvasSize.h * AVATAR_H,
    };
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  const active = activeCategory ? (template?.[activeCategory] || null) : null;

  function updateCat(patch) {
    if (!activeCategory) return;
    setTemplate(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], ...patch } }));
  }

  function onCanvasMouseDown(e, catId) {
    e.preventDefault();
    e.stopPropagation();
    setActiveCategory(catId);
    const pos = toCanvas(e.clientX, e.clientY);
    const catPos = template?.[catId] || { x: 0, y: 0, width: 100, height: 100, zIndex: 1 };
    modeRef.current = 'move';
    catRef.current = catId;
    startRef.current = { mx: pos.x, my: pos.y, orig: { ...catPos } };
    window.addEventListener('mousemove', onGlobalMouseMove);
    window.addEventListener('mouseup', onGlobalMouseUp);
  }

  function onHandleMouseDown(e, catId, handleId) {
    e.preventDefault();
    e.stopPropagation();
    setActiveCategory(catId);
    const pos = toCanvas(e.clientX, e.clientY);
    const catPos = template?.[catId] || { x: 0, y: 0, width: 100, height: 100, zIndex: 1 };
    modeRef.current = 'resize';
    catRef.current = catId;
    startRef.current = { mx: pos.x, my: pos.y, orig: { ...catPos }, handle: handleId };
    window.addEventListener('mousemove', onGlobalMouseMove);
    window.addEventListener('mouseup', onGlobalMouseUp);
  }

  function onGlobalMouseMove(e) {
    if (!modeRef.current || !catRef.current) return;
    const pos = toCanvas(e.clientX, e.clientY);
    const dx = pos.x - startRef.current.mx;
    const dy = pos.y - startRef.current.my;
    const s = startRef.current.orig;
    const id = catRef.current;

    if (modeRef.current === 'move') {
      setTemplate(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          x: clamp(Math.round(s.x + dx), -200, AVATAR_W + 200),
          y: clamp(Math.round(s.y + dy), -200, AVATAR_H + 200),
        },
      }));
      return;
    }

    if (modeRef.current === 'resize') {
      const h = startRef.current.handle;
      let nx = s.x, ny = s.y, nw = s.width, nh = s.height;

      if (h.includes('e')) nw = clamp(Math.round(s.width + dx), 20, 600);
      if (h.includes('s')) nh = clamp(Math.round(s.height + dy), 20, 600);
      if (h.includes('w')) {
        nw = clamp(Math.round(s.width - dx), 20, 600);
        nx = clamp(Math.round(s.x + dx), -200, s.x + s.width - 20);
      }
      if (h.includes('n')) {
        nh = clamp(Math.round(s.height - dy), 20, 600);
        ny = clamp(Math.round(s.y + dy), -200, s.y + s.height - 20);
      }
      // horizontal-only
      if (h === 'e') { ny = s.y; nh = s.height; }
      if (h === 'w') { ny = s.y; nh = s.height; }
      // vertical-only
      if (h === 'n') { nx = s.x; nw = s.width; }
      if (h === 's') { nx = s.x; nw = s.width; }

      setTemplate(prev => ({
        ...prev,
        [id]: { ...prev[id], x: nx, y: ny, width: nw, height: nh },
      }));
    }
  }

  function onGlobalMouseUp() {
    modeRef.current = null;
    catRef.current = null;
    window.removeEventListener('mousemove', onGlobalMouseMove);
    window.removeEventListener('mouseup', onGlobalMouseUp);
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('mouseup', onGlobalMouseUp);
    };
  }, []);

  function getFirstItemHtml(catId) {
    const item = items.find(i => i.category === catId && i.html);
    return item?.html || null;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/avatar/template`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ categories: template }),
      });
      const json = await res.json();
      if (json.status) showToast('Đã lưu template');
      else showToast(json.msg || 'Lỗi lưu', 'error');
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  }

  function handleReset() {
    setTemplate(DEFAULT_TEMPLATE);
    showToast('Đã reset về mặc định');
  }

  if (loading) {
    return (
      <div>
        <ManagementHeader subtitle="Vị trí các category trên avatar" title="Avatar Template" />
        <div className="text-center py-10 text-ink/40 text-sm animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div>
      <ManagementHeader subtitle="Vị trí các category trên avatar" title="Avatar Template" />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left: Canvas */}
        <div className="flex-1 flex flex-col items-stretch w-full">
          <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">
            Canvas ({AVATAR_W}×{AVATAR_H}) — Click để chọn · Kéo để di chuyển · Kéo nút để resize
          </div>
          <div
            ref={canvasRef}
            className="relative select-none rounded-xl w-full"
            style={{
              height: Math.round(CANVAS_DISPLAY * (AVATAR_H / AVATAR_W)),
              background: '#f5f0e8',
              border: '2px dashed #d4c9b0',
              overflow: 'visible',
            }}
          >
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
              {[1, 2, 3, 4].map(i => (
                <line key={`h${i}`} x1={0} y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} stroke="#8b7355" strokeWidth={1} />
              ))}
              {[1, 2, 3, 4].map(i => (
                <line key={`v${i}`} x1={`${i * 20}%`} y1={0} x2={`${i * 20}%`} y2="100%" stroke="#8b7355" strokeWidth={1} />
              ))}
            </svg>

            {/* All categories */}
            {CATEGORIES.map(cat => {
              const pos = template?.[cat.id];
              if (!pos) return null;
              const isActive = cat.id === activeCategory;
              const color = CATEGORY_COLORS[cat.id];
              const itemHtml = getFirstItemHtml(cat.id);

              return (
                <div
                  key={cat.id}
                  className="absolute"
                  style={{
                    left: pos.x * scaleX,
                    top: pos.y * scaleY,
                    width: pos.width * scaleX,
                    height: pos.height * scaleY,
                    zIndex: isActive ? 50 : (pos.zIndex || 1),
                  }}
                >
                  {/* The box — clickable for move */}
                  <div
                    className="absolute inset-0 cursor-move"
                    style={{
                      border: `${isActive ? 2 : 1}px ${isActive ? 'solid' : 'dashed'} ${color}${isActive ? '' : '50'}`,
                      borderRadius: 4,
                      background: isActive ? `${color}12` : 'transparent',
                    }}
                    onMouseDown={e => onCanvasMouseDown(e, cat.id)}
                  >
                    {/* Label */}
                    <span
                      className="absolute -top-4 left-0 text-[9px] font-mono font-bold px-1 rounded"
                      style={{ color, background: '#f5f0e8' }}
                    >
                      {cat.label}
                    </span>

                    {/* Item HTML */}
                    {itemHtml && (
                      <div
                        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
                        style={{ opacity: isActive ? 0.9 : 0.4 }}
                        dangerouslySetInnerHTML={{ __html: itemHtml }}
                      />
                    )}
                    {!itemHtml && (
                      <div className="w-full h-full flex items-center justify-center pointer-events-none">
                        <span className="text-[8px] font-mono" style={{ color: `${color}80` }}>no img</span>
                      </div>
                    )}
                  </div>

                  {/* Resize handles — 8 points */}
                  {isActive && HANDLES.map(h => (
                    <div
                      key={h.id}
                      className="absolute z-50"
                      style={{
                        left: h.x * 100 + '%',
                        top: h.y * 100 + '%',
                        width: 12,
                        height: 12,
                        marginLeft: -6,
                        marginTop: -6,
                        borderRadius: '50%',
                        background: '#f59e0b',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        cursor: h.cursor,
                      }}
                      onMouseDown={e => onHandleMouseDown(e, cat.id, h.id)}
                    />
                  ))}

                  {/* Active border */}
                  {isActive && (
                    <div className="absolute inset-0 border-2 border-gold rounded pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-[10px] text-ink/30 mt-2">8 nút resize · Click category để chọn · Kéo để di chuyển</div>
        </div>

        {/* Right: Controls */}
        <div className="w-full xl:w-[300px] shrink-0 space-y-4">
          {/* Category selector */}
          <div className="bg-white rounded-xl border border-ink/8 p-4">
            <div className="text-xs font-mono uppercase text-ink/50 mb-2">Chọn category</div>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map(cat => {
                const hasHtml = items.some(i => i.category === cat.id && i.html);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      activeCategory === cat.id
                        ? 'text-white'
                        : 'bg-ink/5 text-ink/50 hover:bg-ink/10'
                    }`}
                    style={activeCategory === cat.id ? { background: CATEGORY_COLORS[cat.id] } : {}}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[cat.id] }} />
                    {cat.label}
                    {!hasHtml && <span className="text-[8px] opacity-50">(trống)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Position inputs */}
          {activeCategory && active && (
            <div className="bg-white rounded-xl border border-ink/8 p-4">
              <div className="text-xs font-mono uppercase text-ink/50 mb-3 flex items-center gap-1">
                <Move className="w-3 h-3" /> Vị trí — {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'x', label: 'X' },
                  { key: 'y', label: 'Y' },
                  { key: 'width', label: 'W' },
                  { key: 'height', label: 'H' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-[10px] font-mono text-ink/40">{label}</label>
                    <input
                      type="number"
                      value={active[key] ?? 0}
                      onChange={e => updateCat({ [key]: Number(e.target.value) })}
                      className="w-full mt-1 px-2 py-1.5 rounded-lg border border-ink/10 text-xs font-mono text-ink focus:outline-none focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-[10px] font-mono text-ink/40">zIndex</label>
                <input
                  type="number"
                  value={active.zIndex ?? 1}
                  onChange={e => updateCat({ zIndex: Number(e.target.value) })}
                  className="w-full mt-1 px-2 py-1.5 rounded-lg border border-ink/10 text-xs font-mono text-ink focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>
            </div>
          )}

          {!activeCategory && (
            <div className="bg-white rounded-xl border border-ink/8 p-4 text-center text-xs text-ink/40">
              Click một category trên canvas để chỉnh sửa
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={handleReset}
              className="flex-1 px-4 py-2.5 bg-ink/5 text-ink/60 rounded-xl text-sm font-semibold hover:bg-ink/10 transition flex items-center justify-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 px-4 py-2.5 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-50 flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
