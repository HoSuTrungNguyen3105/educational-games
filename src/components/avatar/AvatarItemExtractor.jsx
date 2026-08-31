import { useCallback, useRef, useState } from 'react';
import { Upload, Trash2, Plus, Loader2, Eye, Save } from 'lucide-react';

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

// ─── DETECTION ENGINE v2 — White-background Sprite Sheet ─────────
//
// Thuật toán:
// 1. Phân tích row/column projection — tỉ lệ pixel trắng trên mỗi hàng/cột
// 2. Tìm dải "gap" (hàng/cột toàn trắng) và dải "nội dung" xen kẽ
// 3. Giao của dải nội dung hàng × cột = bounding box của item
// 4. Lọc ô quá nhỏ hoặc quá trắng
// 5. Merge region gần nhau
// ─────────────────────────────────────────────────────────────────

function isWhitePx(r, g, b, a, thr) {
  if (a < 30) return true; // transparent cũng tính là trắng
  return r >= thr && g >= thr && b >= thr;
}

function detectItemsWhiteBg(imageData, W, H, opts = {}) {
  const {
    whiteThreshold = 245, // pixel >= ngưỡng này = trắng
    gapRatio = 0.97,      // hàng/cột có >= ratio% trắng = khoảng trắng
    minItemSize = 30,     // bỏ item nhỏ hơn ngưỡng này (px)
    mergeGap = 8,         // merge 2 region cách nhau <= px này
  } = opts;

  const data = imageData.data;

  // Bước 1: mask pixel trắng
  const isWhite = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    isWhite[i] = isWhitePx(r, g, b, a, whiteThreshold) ? 1 : 0;
  }

  // Bước 2: Row projection
  const rowWhite = new Float32Array(H);
  for (let y = 0; y < H; y++) {
    let cnt = 0;
    for (let x = 0; x < W; x++) cnt += isWhite[y * W + x];
    rowWhite[y] = cnt / W;
  }

  // Bước 3: Col projection
  const colWhite = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    let cnt = 0;
    for (let y = 0; y < H; y++) cnt += isWhite[y * W + x];
    colWhite[x] = cnt / H;
  }

  // Bước 4: Tìm dải nội dung (không phải gap)
  function findBands(proj, size) {
    const gap = new Uint8Array(size);
    for (let i = 0; i < size; i++) gap[i] = proj[i] >= gapRatio ? 1 : 0;
    const bands = [];
    let inC = false, start = 0;
    for (let i = 0; i < size; i++) {
      if (!gap[i] && !inC) { inC = true; start = i; }
      if ((gap[i] || i === size - 1) && inC) {
        inC = false;
        const end = gap[i] ? i - 1 : i;
        if (end - start + 1 >= minItemSize * 0.3) bands.push({ start, end });
      }
    }
    return bands;
  }

  const rowBands = findBands(rowWhite, H);
  const colBands = findBands(colWhite, W);

  // Bước 5: Tạo regions từ giao của row band × col band
  let regions = [];
  for (const rb of rowBands) {
    for (const cb of colBands) {
      const x = cb.start, y = rb.start;
      const w = cb.end - cb.start + 1;
      const h = rb.end - rb.start + 1;
      if (w < minItemSize || h < minItemSize) continue;

      // Kiểm tra vùng có nội dung thực
      let cntPx = 0;
      const step = Math.max(1, Math.floor(Math.min(w, h) / 12));
      let total = 0;
      for (let dy = 0; dy < h; dy += step) {
        for (let dx = 0; dx < w; dx += step) {
          if (!isWhite[(y + dy) * W + (x + dx)]) cntPx++;
          total++;
        }
      }
      if (total === 0 || cntPx / total < 0.02) continue;
      regions.push({ x, y, width: w, height: h });
    }
  }

  // Bước 6: Merge region gần nhau
  function near(a, b, gap) {
    const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    return ox > -gap && oy > -gap;
  }
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < regions.length; i++) {
      for (let j = i + 1; j < regions.length; j++) {
        if (near(regions[i], regions[j], mergeGap)) {
          const a = regions[i], b = regions[j];
          const nx = Math.min(a.x, b.x), ny = Math.min(a.y, b.y);
          regions.splice(i, 1, { x: nx, y: ny, width: Math.max(a.x + a.width, b.x + b.width) - nx, height: Math.max(a.y + a.height, b.y + b.height) - ny });
          regions.splice(j, 1);
          merged = true; break outer;
        }
      }
    }
  }

  // Bước 7: Sort theo hàng rồi cột
  regions.sort((a, b) => {
    const rowTol = 20;
    const dy = a.y - b.y;
    return Math.abs(dy) > rowTol ? dy : a.x - b.x;
  });

  return regions;
}

// ─── REGION PREVIEW ──────────────────────────────────────────────

function RegionPreview({ imgSrc, region, imgW, imgH }) {
  const { x, y, width, height } = region;
  const SIZE = 112;
  const scale = SIZE / Math.max(width, height);
  const scaledW = Math.round(width * scale);
  const scaledH = Math.round(height * scale);
  return (
    <div className="rounded-lg overflow-hidden border border-ink/10 bg-[#f0f0f0] shrink-0 flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}>
      <div style={{ position: 'relative', width: scaledW, height: scaledH, overflow: 'hidden', flexShrink: 0 }}>
        <img src={imgSrc} draggable={false} className="absolute pointer-events-none select-none"
          style={{ width: imgW * scale, height: imgH * scale, left: -(x * scale), top: -(y * scale), maxWidth: 'none' }} />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

export default function AvatarItemExtractor({ onBatchSave, saving }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [items, setItems] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [whiteThreshold, setWhiteThreshold] = useState(245);
  const [gapRatio, setGapRatio] = useState(97);   // 0-100, chia 100 khi dùng
  const [minItemSize, setMinItemSize] = useState(30);
  const [mergeGap, setMergeGap] = useState(8);
  const fileRef = useRef(null);
  const imgUrlRef = useRef(null); // giữ url blob để redetect

  const runDetection = useCallback((imgUrl, wThr, gRatio, minSize, mGap) => {
    setDetecting(true);
    setItems([]);
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth, H = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, W, H);
      const regions = detectItemsWhiteBg(imageData, W, H, {
        whiteThreshold: wThr,
        gapRatio: gRatio / 100,
        minItemSize: minSize,
        mergeGap: mGap,
      });
      setImgObj({ naturalWidth: W, naturalHeight: H });
      setItems(regions.map((r, i) => ({
        name: `Item ${String(i + 1).padStart(2, '0')}`,
        category: 'hair', price: 0, default: false,
        x: r.x, y: r.y, width: r.width, height: r.height,
      })));
      setDetecting(false);
    };
    img.src = imgUrl;
  }, []);

  const onFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    imgUrlRef.current = url;
    setImgSrc(url);
    setImgObj(null);
    runDetection(url, whiteThreshold, gapRatio, minItemSize, mergeGap);
  }, [whiteThreshold, gapRatio, minItemSize, mergeGap, runDetection]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) onFile(file);
  }, [onFile]);

  const redetect = useCallback(() => {
    if (!imgUrlRef.current) return;
    runDetection(imgUrlRef.current, whiteThreshold, gapRatio, minItemSize, mergeGap);
  }, [whiteThreshold, gapRatio, minItemSize, mergeGap, runDetection]);

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index));

  const addItem = () => {
    setItems(prev => [...prev, {
      name: `Item ${String(prev.length + 1).padStart(2, '0')}`,
      category: 'hair', price: 0, default: false,
      x: 0, y: 0, width: 100, height: 100,
    }]);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
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
          <p className="text-sm font-body text-ink/60">Kéo thả ảnh sprite vào đây hoặc bấm để chọn</p>
          <p className="text-xs text-ink/40 mt-1">Hỗ trợ nền trắng — tự động nhận diện từng item riêng biệt</p>
        </div>
      )}

      {/* Image loaded */}
      {imgSrc && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-body text-ink/60">Ảnh:</span>
              <span className="text-xs font-mono text-ink/40">{imgObj?.naturalWidth}×{imgObj?.naturalHeight}px</span>
              <span className="text-xs text-ink/30">•</span>
              <span className="text-xs font-mono text-gold font-semibold">{items.length} item</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setImgSrc(null); setImgObj(null); setItems([]); imgUrlRef.current = null; }}
                className="px-3 py-1.5 rounded-lg bg-ink/5 text-ink/50 text-xs font-semibold hover:bg-ink/10 transition">
                Chọn lại
              </button>
            </div>
          </div>

          {/* Detection settings */}
          <details className="bg-ink/5 rounded-xl p-3" open>
            <summary className="text-xs font-mono text-ink/50 cursor-pointer select-none flex items-center gap-1">
              <Eye className="w-3 h-3" /> Cài đặt nhận diện (White-BG Projection)
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="text-[10px] font-mono text-ink/50 block mb-1">Ngưỡng trắng ({whiteThreshold})</label>
                <input type="range" min={200} max={255} value={whiteThreshold}
                  onChange={e => setWhiteThreshold(Number(e.target.value))} className="w-full" />
                <p className="text-[9px] text-ink/30 mt-0.5">Pixel ≥ ngưỡng = nền trắng</p>
              </div>
              <div>
                <label className="text-[10px] font-mono text-ink/50 block mb-1">Gap ratio ({gapRatio}%)</label>
                <input type="range" min={80} max={100} value={gapRatio}
                  onChange={e => setGapRatio(Number(e.target.value))} className="w-full" />
                <p className="text-[9px] text-ink/30 mt-0.5">Hàng/cột ≥ ratio% trắng = khoảng trắng</p>
              </div>
              <div>
                <label className="text-[10px] font-mono text-ink/50 block mb-1">Min size ({minItemSize}px)</label>
                <input type="range" min={10} max={150} value={minItemSize}
                  onChange={e => setMinItemSize(Number(e.target.value))} className="w-full" />
                <p className="text-[9px] text-ink/30 mt-0.5">Bỏ item nhỏ hơn</p>
              </div>
              <div>
                <label className="text-[10px] font-mono text-ink/50 block mb-1">Merge gap ({mergeGap}px)</label>
                <input type="range" min={0} max={30} value={mergeGap}
                  onChange={e => setMergeGap(Number(e.target.value))} className="w-full" />
                <p className="text-[9px] text-ink/30 mt-0.5">Gộp region gần nhau</p>
              </div>
            </div>
            <button onClick={redetect} className="mt-3 px-4 py-1.5 rounded-lg bg-gold text-white text-xs font-semibold hover:bg-gold/80 transition">
              Nhận diện lại
            </button>
          </details>

          {detecting && (
            <div className="flex items-center justify-center py-8 text-ink/40 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang phân tích...
            </div>
          )}

          {/* Item list */}
          {!detecting && items.length > 0 && (
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
              Không phát hiện item nào. Thử điều chỉnh alpha threshold hoặc chọn ảnh khác.
            </div>
          )}

          {/* Save all button */}
          {!detecting && items.length > 0 && (
            <div className="flex justify-end pt-2 border-t border-ink/10">
              <button onClick={() => onBatchSave(items)} disabled={saving}
                className="px-5 py-2.5 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" />
                {saving ? "Đang lưu..." : `Lưu tất cả (${items.length} item)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
