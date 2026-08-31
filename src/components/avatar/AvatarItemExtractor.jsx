import { useCallback, useRef, useState } from 'react';
import { Upload, Trash2, Plus, Loader2, Eye, Save } from 'lucide-react';
import { API_BASE } from '../../services/api.js';

const CLOUD_NAME = 'rnygwa06';
const UPLOAD_PRESET = 'avatar-items';

async function uploadToCloudinary(blob, filename) {
  const apiBase = API_BASE;
  let token = '';
  try { token = JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch {}

  // Try server API first (no CORS)
  if (apiBase && token) {
    try {
      const fd = new FormData();
      fd.append('file', blob, filename);
      const res = await fetch(`${apiBase}/avatar/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (json.status && json.data?.url) return json.data.url;
    } catch (e) {
      console.warn('Server upload failed, trying direct Cloudinary:', e.message);
    }
  }

  // Fallback: direct Cloudinary
  const fd = new FormData();
  fd.append('file', blob, filename);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload failed: ${res.status}`);
  }
  const data = await res.json();
  return data.secure_url;
}

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

// ─── DETECTION ENGINE ────────────────────────────────────────────

function detectItems(imageData, imgW, imgH, opts = {}) {
  const { alphaThreshold = 20, minPartSize = 15, mergeGap = 3 } = opts;
  const data = imageData.data;

  const fg = new Uint8Array(imgW * imgH);
  for (let i = 0; i < imgW * imgH; i++) {
    fg[i] = data[i * 4 + 3] >= alphaThreshold ? 1 : 0;
  }

  const labels = new Int32Array(imgW * imgH);
  let nextLabel = 1;
  const boxes = new Map();
  const stack = [];

  for (let y = 0; y < imgH; y++) {
    for (let x = 0; x < imgW; x++) {
      const pi = y * imgW + x;
      if (!fg[pi] || labels[pi] !== 0) continue;

      const label = nextLabel++;
      let minX = x, maxX = x, minY = y, maxY = y;
      stack.length = 0;
      stack.push(pi);
      labels[pi] = label;

      while (stack.length > 0) {
        const ci = stack.pop();
        const cx = ci % imgW;
        const cy = (ci / imgW) | 0;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        if (cy > 0) { const ni = ci - imgW; if (fg[ni] && !labels[ni]) { labels[ni] = label; stack.push(ni); } }
        if (cy < imgH - 1) { const ni = ci + imgW; if (fg[ni] && !labels[ni]) { labels[ni] = label; stack.push(ni); } }
        if (cx > 0) { const ni = ci - 1; if (fg[ni] && !labels[ni]) { labels[ni] = label; stack.push(ni); } }
        if (cx < imgW - 1) { const ni = ci + 1; if (fg[ni] && !labels[ni]) { labels[ni] = label; stack.push(ni); } }
      }

      boxes.set(label, { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 });
    }
  }

  let regions = [...boxes.values()].filter(r => r.width >= minPartSize && r.height >= minPartSize);

  if (mergeGap > 0) {
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i < regions.length; i++) {
        for (let j = i + 1; j < regions.length; j++) {
          const a = regions[i], b = regions[j];
          const nearX = a.x <= b.x + b.width + mergeGap && b.x <= a.x + a.width + mergeGap;
          const nearY = a.y <= b.y + b.height + mergeGap && b.y <= a.y + a.height + mergeGap;
          if (nearX && nearY) {
            const nx = Math.min(a.x, b.x);
            const ny = Math.min(a.y, b.y);
            a.x = nx; a.y = ny;
            a.width = Math.max(a.x + a.width, b.x + b.width) - nx;
            a.height = Math.max(a.y + a.height, b.y + b.height) - ny;
            regions.splice(j, 1);
            merged = true;
            break;
          }
        }
        if (merged) break;
      }
    }
  }

  regions.sort((a, b) => a.y - b.y || a.x - b.x);
  return regions;
}

// ─── CROP + UPLOAD ───────────────────────────────────────────────

function cropRegionToBlob(canvas, img, region) {
  return new Promise((resolve) => {
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = region.width;
    cropCanvas.height = region.height;
    const ctx = cropCanvas.getContext('2d');
    ctx.drawImage(img, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
    cropCanvas.toBlob(resolve, 'image/png');
  });
}

// ─── REGION PREVIEW ──────────────────────────────────────────────

function RegionPreview({ imgSrc, region, imgW, imgH }) {
  const { x, y, width, height } = region;
  const SIZE = 112;
  const scale = SIZE / Math.max(width, height);
  return (
    <div className="relative rounded-lg overflow-hidden border border-ink/10 bg-ink/5 shrink-0"
      style={{ width: SIZE, height: SIZE }}>
      <img src={imgSrc} draggable={false} className="absolute pointer-events-none"
        style={{ width: imgW * scale, height: imgH * scale, left: -(x * scale), top: -(y * scale) }} />
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

export default function AvatarItemExtractor({ onBatchSave, saving }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [imgCanvas, setImgCanvas] = useState(null);
  const [items, setItems] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [alphaThreshold, setAlphaThreshold] = useState(20);
  const [minPartSize, setMinPartSize] = useState(15);
  const [mergeGap, setMergeGap] = useState(3);
  const fileRef = useRef(null);

  const runDetection = useCallback((file, alpha, minSize, gap) => {
    setDetecting(true);
    setItems([]);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const regions = detectItems(imageData, canvas.width, canvas.height, {
        alphaThreshold: alpha, minPartSize: minSize, mergeGap: gap,
      });

      setImgCanvas({ canvas, img, width: canvas.width, height: canvas.height });
      setItems(regions.map((r, i) => ({
        name: `Item ${String(i + 1).padStart(2, '0')}`,
        category: 'hair', price: 0, default: false,
        x: r.x, y: r.y, width: r.width, height: r.height, image: '',
      })));
      setDetecting(false);
    };
    img.src = url;
    setImgSrc(url);
    const preview = new Image();
    preview.onload = () => setImgObj(preview);
    preview.src = url;
  }, []);

  const onFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    runDetection(file, alphaThreshold, minPartSize, mergeGap);
  }, [alphaThreshold, minPartSize, mergeGap, runDetection]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) onFile(file);
  }, [onFile]);

  const redetect = useCallback(() => {
    if (!imgSrc) return;
    fetch(imgSrc).then(r => r.blob()).then(blob => {
      const file = new File([blob], 'detected.png', { type: 'image/png' });
      runDetection(file, alphaThreshold, minPartSize, mergeGap);
    });
  }, [imgSrc, alphaThreshold, minPartSize, mergeGap, runDetection]);

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index));

  const addItem = () => {
    setItems(prev => [...prev, {
      name: `Item ${String(prev.length + 1).padStart(2, '0')}`,
      category: 'hair', price: 0, default: false,
      x: 0, y: 0, width: 100, height: 100, image: '',
    }]);
  };

  const handleSaveAll = async () => {
    if (!items.length || !imgCanvas) return;
    setUploading(true);
    setProgress(`0/${items.length}`);

    try {
      const savedItems = [];
      for (let i = 0; i < items.length; i++) {
        setProgress(`${i + 1}/${items.length}`);
        const it = items[i];

        let imageUrl = it.image;
        if (!imageUrl) {
          const blob = await cropRegionToBlob(imgCanvas.canvas, imgCanvas.img, it);
          imageUrl = await uploadToCloudinary(blob, `${it.name.replace(/\s+/g, '_')}.png`);
        }

        savedItems.push({
          category: it.category,
          name: it.name,
          image: imageUrl,
          price: it.price,
          default: it.default,
        });
      }

      await onBatchSave(savedItems);
    } catch (err) {
      alert(err.message || 'Lỗi lưu');
    }
    setUploading(false);
    setProgress('');
  };

  return (
    <div className="space-y-4">
      {!imgSrc && (
        <div
          className="border-2 border-dashed border-ink/20 rounded-2xl p-10 text-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition"
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto text-ink/30 mb-3" />
          <p className="text-sm font-body text-ink/60">Kéo thả ảnh tổng vào đây hoặc bấm để chọn</p>
          <p className="text-xs text-ink/40 mt-1">Tự động nhận diện từng phần tử riêng biệt</p>
        </div>
      )}

      {imgSrc && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-body text-ink/60">Ảnh:</span>
              <span className="text-xs font-mono text-ink/40">{imgObj?.naturalWidth}×{imgObj?.naturalHeight}px</span>
              <span className="text-xs text-ink/30">•</span>
              <span className="text-xs font-mono text-gold font-semibold">{items.length} item</span>
            </div>
            <button onClick={() => { setImgSrc(null); setImgObj(null); setImgCanvas(null); setItems([]); }}
              className="px-3 py-1.5 rounded-lg bg-ink/5 text-ink/50 text-xs font-semibold hover:bg-ink/10 transition">
              Chọn lại
            </button>
          </div>

          <details className="bg-ink/5 rounded-xl p-3">
            <summary className="text-xs font-mono text-ink/50 cursor-pointer select-none flex items-center gap-1">
              <Eye className="w-3 h-3" /> Cài đặt nhận diện
            </summary>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono text-ink/40">Alpha threshold</label>
                <input type="range" min={1} max={100} value={alphaThreshold}
                  onChange={e => setAlphaThreshold(Number(e.target.value))} className="w-full" />
                <span className="text-[10px] font-mono text-ink/40">{alphaThreshold}</span>
              </div>
              <div>
                <label className="text-[10px] font-mono text-ink/40">Min size (px)</label>
                <input type="range" min={5} max={100} value={minPartSize}
                  onChange={e => setMinPartSize(Number(e.target.value))} className="w-full" />
                <span className="text-[10px] font-mono text-ink/40">{minPartSize}</span>
              </div>
              <div>
                <label className="text-[10px] font-mono text-ink/40">Merge gap (px)</label>
                <input type="range" min={0} max={20} value={mergeGap}
                  onChange={e => setMergeGap(Number(e.target.value))} className="w-full" />
                <span className="text-[10px] font-mono text-ink/40">{mergeGap}</span>
              </div>
            </div>
            <button onClick={redetect} className="mt-2 px-3 py-1 rounded-lg bg-gold text-white text-xs font-semibold hover:bg-gold/80 transition">
              Nhận diện lại
            </button>
          </details>

          {(detecting || uploading) && (
            <div className="flex items-center justify-center py-8 text-ink/40 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploading ? `Đang upload ${progress}...` : 'Đang phân tích...'}
            </div>
          )}

          {!detecting && !uploading && items.length > 0 && (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-ink/8">
                  <div className="mt-0.5">
                    <RegionPreview imgSrc={imgSrc} region={item} imgW={imgObj?.naturalWidth || 800} imgH={imgObj?.naturalHeight || 600} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-gold font-semibold">#{idx + 1}</span>
                      <span className="text-[10px] font-mono text-ink/30">
                        {item.x},{item.y} {item.width}×{item.height}
                      </span>
                    </div>
                    <input value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-ink/10 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-gold/30"
                      placeholder="Tên item" />
                    <div className="flex gap-2 flex-wrap">
                      <select value={item.category} onChange={e => updateItem(idx, 'category', e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-ink/10 text-xs font-body text-ink focus:outline-none focus:ring-2 focus:ring-gold/30">
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-ink/10">
                        <span className="text-[10px]">💰</span>
                        <input type="number" value={item.price} min={0}
                          onChange={e => updateItem(idx, 'price', Math.max(0, Number(e.target.value) || 0))}
                          className="w-14 text-xs font-mono text-ink bg-transparent outline-none" />
                      </div>
                      <label className="flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg border border-ink/10">
                        <input type="checkbox" checked={item.default}
                          onChange={e => updateItem(idx, 'default', e.target.checked)}
                          className="w-3 h-3 rounded border-ink/20 text-gold focus:ring-gold/30" />
                        <span className="text-[10px] text-ink/50">Mặc định</span>
                      </label>
                    </div>
                  </div>
                  <button onClick={() => removeItem(idx)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition text-ink/30 hover:text-red-500 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-ink/20 text-ink/40 text-xs font-semibold hover:border-gold/50 hover:text-gold transition">
                <Plus className="w-4 h-4" />
                Thêm item thủ công
              </button>
            </div>
          )}

          {!detecting && items.length === 0 && (
            <div className="text-center py-8 text-ink/40 text-sm">
              Không phát hiện item nào. Thử điều chỉnh settings hoặc chọn ảnh khác.
            </div>
          )}

          {!detecting && items.length > 0 && (
            <div className="flex justify-end pt-2 border-t border-ink/10">
              <button onClick={handleSaveAll} disabled={saving || uploading}
                className="px-5 py-2.5 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" />
                {uploading ? `Đang upload ${progress}` : saving ? 'Đang lưu...' : `Lưu tất cả (${items.length} item)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
