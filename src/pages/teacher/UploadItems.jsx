import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader } from '../../components/ui.jsx';
import { Upload, Play, Save, Plus, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const CLOUD_NAME = 'rnygwa06';
const UPLOAD_PRESET = 'avatar-items';

async function uploadImage(blob, filename) {
  try {
    let token = '';
    try { token = JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch {}
    if (token) {
      const fd = new FormData();
      fd.append('file', blob, filename);
      const res = await fetch(`${API_BASE}/avatar/upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const json = await res.json();
      if (json.status && json.data?.url) return json.data.url;
    }
  } catch {}
  const fd = new FormData();
  fd.append('file', blob, filename);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: fd,
  });
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).secure_url;
}

function mergeBoxes(boxes, dist) {
  const n = boxes.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
  const overlaps = (a, b) => !(a.maxX + dist < b.minX || b.maxX + dist < a.minX || a.maxY + dist < b.minY || b.maxY + dist < a.minY);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (overlaps(boxes[i], boxes[j])) union(i, j);
  const groups = {};
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (!groups[r]) groups[r] = { minX: boxes[i].minX, minY: boxes[i].minY, maxX: boxes[i].maxX, maxY: boxes[i].maxY, area: 0 };
    const g = groups[r];
    g.minX = Math.min(g.minX, boxes[i].minX); g.minY = Math.min(g.minY, boxes[i].minY);
    g.maxX = Math.max(g.maxX, boxes[i].maxX); g.maxY = Math.max(g.maxY, boxes[i].maxY);
    g.area += boxes[i].area;
  }
  return Object.values(groups);
}

function detectItems(canvas, settings) {
  const { threshold, mergeDist, minArea } = settings;
  const w = canvas.width, h = canvas.height;
  const data = canvas.getContext('2d').getImageData(0, 0, w, h).data;
  const fg = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 10) { fg[p] = 0; continue; }
    fg[p] = ((255 - r) + (255 - g) + (255 - b)) > threshold ? 1 : 0;
  }
  const labels = new Int32Array(w * h).fill(-1);
  let boxes = [];
  const stack = new Int32Array(w * h);
  for (let start = 0; start < w * h; start++) {
    if (fg[start] !== 1 || labels[start] !== -1) continue;
    let sp = 0; stack[sp++] = start; labels[start] = boxes.length;
    let minX = start % w, maxX = minX, minY = (start / w) | 0, maxY = minY, area = 0;
    while (sp > 0) {
      const idx = stack[--sp]; area++;
      const x = idx % w, y = (idx / w) | 0;
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const nidx = ny * w + nx;
        if (fg[nidx] === 1 && labels[nidx] === -1) { labels[nidx] = boxes.length; stack[sp++] = nidx; }
      }
    }
    boxes.push({ minX, minY, maxX, maxY, area });
  }
  boxes = boxes.filter(b => b.area >= minArea);
  if (mergeDist > 0) boxes = mergeBoxes(boxes, mergeDist);
  boxes.sort((a, b) => { const rA = Math.round(a.minY / 40), rB = Math.round(b.minY / 40); return rA !== rB ? a.minY - b.minY : a.minX - b.minX; });
  return boxes;
}

function CropPreview({ srcCanvas, box, pad }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !srcCanvas) return;
    const w = srcCanvas.width, h = srcCanvas.height;
    const x0 = Math.max(0, box.minX - pad), y0 = Math.max(0, box.minY - pad);
    const x1 = Math.min(w - 1, box.maxX + pad), y1 = Math.min(h - 1, box.maxY + pad);
    c.width = x1 - x0 + 1; c.height = y1 - y0 + 1;
    c.getContext('2d').drawImage(srcCanvas, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
  }, [srcCanvas, box, pad]);
  return <canvas ref={canvasRef} className="w-20 h-20 rounded-lg border border-ink/10" style={{ imageRendering: 'pixelated' }} />;
}

export default function UploadItems({ showToast }) {
  const [existingItems, setExistingItems] = useState([]);
  const [existingInfo, setExistingInfo] = useState('');
  const [detectedItems, setDetectedItems] = useState([]);
  const [status, setStatus] = useState('Chưa có ảnh');
  const [showPreview, setShowPreview] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [threshold, setThreshold] = useState(18);
  const [mergeDist, setMergeDist] = useState(10);
  const [minArea, setMinArea] = useState(60);
  const [pad, setPad] = useState(3);

  const srcCanvasRef = useRef(null);
  const boxLayerRef = useRef(null);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const loadExisting = useCallback(async () => {
    setExistingInfo('Đang tải...');
    try {
      const res = await fetch(`${API_BASE}/avatar/items`);
      const json = await res.json();
      if (json.status) {
        setExistingItems(json.data.items || []);
        setExistingInfo(`Đã tải ${json.data.items?.length || 0} items`);
      } else setExistingInfo('Lỗi: ' + (json.msg || ''));
    } catch (e) { setExistingInfo('Lỗi: ' + e.message); }
  }, []);

  useEffect(() => { loadExisting(); }, [loadExisting]);

  const loadFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const image = new Image();
      image.onload = () => {
        imgRef.current = image;
        const canvas = srcCanvasRef.current;
        canvas.width = image.width; canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0);
        const svg = boxLayerRef.current;
        svg.setAttribute('width', image.width); svg.setAttribute('height', image.height);
        svg.setAttribute('viewBox', `0 0 ${image.width} ${image.height}`);
        svg.innerHTML = '';
        setShowPreview(true); setShowResults(false); setDetectedItems([]);
        setStatus(`Ảnh ${image.width}×${image.height}px — sẵn sàng`);
      };
      image.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const runDetection = useCallback(() => {
    const canvas = srcCanvasRef.current;
    if (!canvas) return;
    setStatus('Đang phân tích...');
    setTimeout(() => {
      const boxes = detectItems(canvas, { threshold, mergeDist, minArea });
      const svg = boxLayerRef.current;
      svg.innerHTML = '';
      boxes.forEach(b => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', b.minX); rect.setAttribute('y', b.minY);
        rect.setAttribute('width', b.maxX - b.minX + 1); rect.setAttribute('height', b.maxY - b.minY + 1);
        rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#7fd67a');
        rect.setAttribute('stroke-width', Math.max(1, canvas.width / 900));
        svg.appendChild(rect);
      });
      const items = boxes.map((b, i) => ({
        canvas, box: b, name: `Item ${String(i + 1).padStart(2, '0')}`,
        category: 'hair', price: 0, isDefault: false, assignTo: '', mode: 'create',
      }));
      setDetectedItems(items);
      setShowResults(true);
      setStatus(`Tìm thấy ${boxes.length} phần tử`);
    }, 30);
  }, [threshold, mergeDist, minArea]);

  const updateItem = (idx, field, value) => {
    setDetectedItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const removeItem = (idx) => setDetectedItems(prev => prev.filter((_, i) => i !== idx));

  const addItem = () => {
    setDetectedItems(prev => [...prev, {
      canvas: null, box: null, name: `Item ${String(prev.length + 1).padStart(2, '0')}`,
      category: 'hair', price: 0, isDefault: false, assignTo: '', mode: 'create',
    }]);
    setShowResults(true);
  };

  const saveAll = async () => {
    if (!detectedItems.length) return;
    const token = (() => { try { return JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch { return ''; } })();
    if (!token) { showToast('Chưa đăng nhập', 'error'); return; }

    setSaving(true);
    let created = 0, updated = 0, errors = 0;

    for (let i = 0; i < detectedItems.length; i++) {
      const item = detectedItems[i];
      setStatus(`${i + 1}/${detectedItems.length} — ${item.name}...`);
      try {
        let imageUrl = '';
        if (item.canvas && item.box) {
          const b = item.box, p = pad;
          const w = item.canvas.width, h = item.canvas.height;
          const x0 = Math.max(0, b.minX - p), y0 = Math.max(0, b.minY - p);
          const x1 = Math.min(w - 1, b.maxX + p), y1 = Math.min(h - 1, b.maxY + p);
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = x1 - x0 + 1; cropCanvas.height = y1 - y0 + 1;
          cropCanvas.getContext('2d').drawImage(item.canvas, x0, y0, cropCanvas.width, cropCanvas.height, 0, 0, cropCanvas.width, cropCanvas.height);
          const blob = await new Promise(r => cropCanvas.toBlob(r, 'image/png'));
          imageUrl = await uploadImage(blob, `${item.name.replace(/\s+/g, '_')}.png`);
        }

        if (item.mode === 'update' && item.assignTo) {
          const res = await fetch(`${API_BASE}/avatar/admin/items/${item.assignTo}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: item.name, category: item.category, price: item.price, default: item.isDefault, ...(imageUrl ? { image: imageUrl } : {}) }),
          });
          const json = await res.json();
          if (!json.status) throw new Error(json.msg || 'Update failed');
          updated++;
        } else {
          const res = await fetch(`${API_BASE}/avatar/admin/items`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: item.name, category: item.category, price: item.price, default: item.isDefault, image: imageUrl }),
          });
          const json = await res.json();
          if (!json.status) throw new Error(json.msg || 'Create failed');
          created++;
        }
      } catch (e) { errors++; }
    }

    setStatus(`Xong! Tạo: ${created}, Cập nhật: ${updated}, Lỗi: ${errors}`);
    setSaving(false);
    loadExisting();
  };

  return (
    <div>
      <ManagementHeader title="Trích xuất Avatar Items" subtitle="Tải sprite sheet — nhận diện — tạo/cập nhật items" />

      {/* API config */}
      <div className="bg-white rounded-xl border border-ink/8 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-ink/40">Đã tải: {existingInfo}</span>
          <button onClick={loadExisting} className="px-2 py-1 rounded bg-ink/5 text-[11px] font-semibold text-ink/50 hover:bg-ink/10">Reload</button>
        </div>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragOver ? 'border-gold bg-gold/5' : 'border-ink/20 hover:border-gold/30'}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); loadFile(e.dataTransfer.files[0]); }}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files[0])} />
          <Upload className="w-8 h-8 mx-auto text-ink/30 mb-2" />
          <p className="text-sm text-ink/50">Kéo thả sprite sheet vào đây hoặc bấm để chọn</p>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          {[
            { label: 'Ngưỡng nền', value: threshold, set: setThreshold, min: 2, max: 60 },
            { label: 'Gộp mảnh', value: mergeDist, set: setMergeDist, min: 0, max: 40 },
            { label: 'Diện tích tối thiểu', value: minArea, set: setMinArea, min: 4, max: 800 },
            { label: 'Đệm', value: pad, set: setPad, min: 0, max: 20 },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-1">
              <label className="text-ink/40 flex justify-between"><span>{s.label}</span><span className="text-gold">{s.value}</span></label>
              <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => s.set(Number(e.target.value))} className="w-full accent-gold" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button onClick={runDetection} disabled={!imgRef.current}
            className="px-4 py-2 rounded-lg bg-gold text-white text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-40 flex items-center gap-1.5">
            <Play className="w-4 h-4" /> Nhận diện
          </button>
          <button onClick={saveAll} disabled={!detectedItems.length || saving}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-40 flex items-center gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang lưu...' : `Lưu tất cả (${detectedItems.length})`}
          </button>
          <span className="text-xs text-ink/40">{status}</span>
        </div>
      </div>

      {/* Preview canvas — always in DOM, hidden until image loaded */}
      <div className={`bg-white rounded-xl border border-ink/8 p-4 mb-4 overflow-auto ${showPreview ? '' : 'hidden'}`}>
        <div className="relative inline-block max-w-full">
          <canvas ref={srcCanvasRef} className="block max-w-full" />
          <svg ref={boxLayerRef} className="absolute top-0 left-0 pointer-events-none" />
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-white rounded-xl border border-ink/8 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-ink/40">Tìm thấy <span className="text-gold font-semibold">{detectedItems.length}</span> phần tử</span>
            <button onClick={addItem} className="px-3 py-1 rounded-lg border border-dashed border-ink/20 text-[11px] font-semibold text-ink/40 hover:border-gold/40 hover:text-gold transition">
              + Thêm thủ công
            </button>
          </div>

          <div className="space-y-2">
            {detectedItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-ink/[.03] border border-ink/8">
                <div className="relative shrink-0">
                  {item.canvas && item.box ? (
                    <CropPreview srcCanvas={item.canvas} box={item.box} pad={pad} />
                  ) : (
                    <div className="w-20 h-20 rounded-lg border border-dashed border-ink/20 flex items-center justify-center text-[10px] text-ink/30">Ảnh</div>
                  )}
                  <span className="absolute top-0.5 left-0.5 px-1 py-0.5 rounded bg-gold text-[9px] font-bold text-white">#{idx + 1}</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex gap-2">
                    <input value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)}
                      className="flex-1 px-2 py-1.5 rounded-lg border border-ink/10 text-xs bg-white text-ink focus:outline-none focus:ring-1 focus:ring-gold/30" placeholder="Tên item..." />
                    <select value={item.category} onChange={e => updateItem(idx, 'category', e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-ink/10 text-xs bg-white text-ink focus:outline-none">
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-ink/40">💰</span>
                    <input type="number" value={item.price} min={0} onChange={e => updateItem(idx, 'price', Math.max(0, Number(e.target.value) || 0))}
                      className="w-16 px-2 py-1 rounded-lg border border-ink/10 text-xs bg-white text-ink font-mono focus:outline-none" />
                    <label className="flex items-center gap-1 cursor-pointer text-[10px] text-ink/50">
                      <input type="checkbox" checked={item.isDefault} onChange={e => updateItem(idx, 'isDefault', e.target.checked)} className="rounded" />
                      Mặc định
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-ink/40 w-8">Gán</span>
                    <select value={item.assignTo} onChange={e => {
                      const val = e.target.value;
                      updateItem(idx, 'assignTo', val);
                      updateItem(idx, 'mode', val ? 'update' : 'create');
                    }} className="flex-1 px-2 py-1 rounded-lg border border-ink/10 text-xs bg-white text-ink focus:outline-none">
                      <option value="">— Tạo mới —</option>
                      {existingItems.map(ei => (
                        <option key={ei.id} value={ei.id}>{ei.name} ({ei.id}) [{ei.category}]</option>
                      ))}
                    </select>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${item.mode === 'update' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.mode === 'update' ? 'CẬP NHẬT' : 'TẠO MỚI'}
                    </span>
                  </div>
                </div>

                <button onClick={() => removeItem(idx)} className="p-1.5 rounded-lg hover:bg-red-50 text-ink/30 hover:text-red-500 transition shrink-0 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
