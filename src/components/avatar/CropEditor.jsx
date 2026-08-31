import { useCallback, useEffect, useRef, useState } from 'react';

const SPRITE_SHEET = `${import.meta.env.BASE_URL}avatar/avatar-sprite.png`;
const SPRITE_W = 1536;
const SPRITE_H = 1024;
const MIN_SIZE = 16;

export default function CropEditor({ value, onChange }) {
  const { x, y, width, height } = value;
  const imgRef = useRef(null);
  const [displayW, setDisplayW] = useState(0);
  const [displayH, setDisplayH] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const dragRef = useRef(null);

  const scale = displayW > 0 ? displayW / SPRITE_W : 1;
  const toDisplayX = (v) => v * scale;
  const toDisplayY = (v) => v * scale;
  const toDisplayW = (v) => v * scale;
  const toDisplayH = (v) => v * scale;
  const toOrigX = (v) => Math.round(v / scale);
  const toOrigY = (v) => Math.round(v / scale);

  const clamp = useCallback((nx, ny) => ({
    x: Math.max(0, Math.min(nx, SPRITE_W - width)),
    y: Math.max(0, Math.min(ny, SPRITE_H - height)),
  }), [width, height]);

  const onPointerDown = useCallback((e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    dragRef.current = {
      mode,
      startX, startY,
      origX: x, origY: y, origW: width, origH: height,
    };
  }, [x, y, width, height]);

  const onPointerMove = useCallback((e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = (e.clientX - d.startX) / scale;
    const dy = (e.clientY - d.startY) / scale;
    let nx, ny, nw, nh;

    switch (d.mode) {
      case 'move':
        nx = d.origX + dx;
        ny = d.origY + dy;
        const c = clamp(nx, ny);
        onChange({ ...value, x: c.x, y: c.y });
        break;
      case 'nw':
        nw = d.origW - dx;
        nh = d.origH - dy;
        if (nw >= MIN_SIZE && nh >= MIN_SIZE) {
          nx = d.origX + dx;
          ny = d.origY + dy;
          const cl = clamp(Math.max(0, nx), Math.max(0, ny));
          onChange({ x: cl.x, y: cl.y, width: Math.min(nw, SPRITE_W - cl.x), height: Math.min(nh, SPRITE_H - cl.y) });
        }
        break;
      case 'ne':
        nw = d.origW + dx;
        nh = d.origH - dy;
        if (nw >= MIN_SIZE && nh >= MIN_SIZE) {
          nx = d.origX;
          ny = Math.max(0, d.origY + dy);
          onChange({ x: nx, y: ny, width: Math.min(nw, SPRITE_W - nx), height: Math.min(nh, SPRITE_H - ny) });
        }
        break;
      case 'sw':
        nw = d.origW - dx;
        nh = d.origH + dy;
        if (nw >= MIN_SIZE && nh >= MIN_SIZE) {
          nx = Math.max(0, d.origX + dx);
          ny = d.origY;
          onChange({ x: nx, y: ny, width: Math.min(nw, SPRITE_W - nx), height: Math.min(nh, SPRITE_H - ny) });
        }
        break;
      case 'se':
        nw = d.origW + dx;
        nh = d.origH + dy;
        if (nw >= MIN_SIZE && nh >= MIN_SIZE) {
          nx = d.origX;
          ny = d.origY;
          onChange({ x: nx, y: ny, width: Math.min(nw, SPRITE_W - nx), height: Math.min(nh, SPRITE_H - ny) });
        }
        break;
      case 'e':
        nw = d.origW + dx;
        if (nw >= MIN_SIZE) {
          onChange({ ...value, width: Math.min(nw, SPRITE_W - d.origX) });
        }
        break;
      case 'w':
        nw = d.origW - dx;
        if (nw >= MIN_SIZE) {
          nx = Math.max(0, d.origX + dx);
          onChange({ ...value, x: nx, width: Math.min(nw, SPRITE_W - nx) });
        }
        break;
      case 's':
        nh = d.origH + dy;
        if (nh >= MIN_SIZE) {
          onChange({ ...value, height: Math.min(nh, SPRITE_H - d.origY) });
        }
        break;
      case 'n':
        nh = d.origH - dy;
        if (nh >= MIN_SIZE) {
          ny = Math.max(0, d.origY + dy);
          onChange({ ...value, y: ny, height: Math.min(nh, SPRITE_H - ny) });
        }
        break;
      default: break;
    }
  }, [value, onChange, scale, clamp]);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  const imgRefCallback = useCallback((node) => {
    if (!node) return;
    imgRef.current = node;
    const obs = new ResizeObserver(entries => {
      const { width: w } = entries[0].contentRect;
      const h = w * (SPRITE_H / SPRITE_W);
      setDisplayW(w);
      setDisplayH(h);
    });
    obs.observe(node);
    if (node.complete) setImgLoaded(true);
    node.onload = () => setImgLoaded(true);
    return () => obs.disconnect();
  }, []);

  const dx = toDisplayX(x);
  const dy = toDisplayY(y);
  const dw = toDisplayW(width);
  const dh = toDisplayH(height);

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Editor */}
        <div className="flex-1 min-w-0">
          <label className="text-[11px] font-mono uppercase text-ink/50 mb-1 block">Ảnh tổng — kéo khung crop</label>
          <div className="relative select-none rounded-xl overflow-hidden border border-ink/10 bg-ink/5"
            style={{ aspectRatio: `${SPRITE_W} / ${SPRITE_H}`, touchAction: 'none' }}>
            <img ref={imgRefCallback} src={SPRITE_SHEET} alt="Sprite sheet" draggable={false}
              className="w-full h-full object-contain pointer-events-none" />

            {imgLoaded && displayW > 0 && (
              <>
                {/* Darkened areas outside crop */}
                <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0, ${dx}px ${dy}px, ${dx}px ${dy + dh}px, ${dx + dw}px ${dy + dh}px, ${dx + dw}px ${dy}px, ${dx}px ${dy}px)` }}>
                  <div className="w-full h-full" style={{ background: 'rgba(0,0,0,0.5)' }} />
                </div>

                {/* Crop box */}
                <div className="absolute" style={{ left: dx, top: dy, width: dw, height: dh, cursor: 'move', touchAction: 'none' }}
                  onPointerDown={(e) => onPointerDown(e, 'move')}>

                  {/* Border */}
                  <div className="absolute inset-0 border-2 border-gold shadow-lg pointer-events-none" />

                  {/* Corner handles */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-gold rounded-full cursor-nw-resize shadow z-10"
                    onPointerDown={(e) => onPointerDown(e, 'nw')} />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-gold rounded-full cursor-ne-resize shadow z-10"
                    onPointerDown={(e) => onPointerDown(e, 'ne')} />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-gold rounded-full cursor-sw-resize shadow z-10"
                    onPointerDown={(e) => onPointerDown(e, 'sw')} />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-gold rounded-full cursor-se-resize shadow z-10"
                    onPointerDown={(e) => onPointerDown(e, 'se')} />

                  {/* Edge handles */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-gold/80 rounded cursor-n-resize z-10"
                    onPointerDown={(e) => onPointerDown(e, 'n')} />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-gold/80 rounded cursor-s-resize z-10"
                    onPointerDown={(e) => onPointerDown(e, 's')} />
                  <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-6 bg-gold/80 rounded cursor-w-resize z-10"
                    onPointerDown={(e) => onPointerDown(e, 'w')} />
                  <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-6 bg-gold/80 rounded cursor-e-resize z-10"
                    onPointerDown={(e) => onPointerDown(e, 'e')} />

                  {/* Dimension label */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-gold/90 text-white text-[10px] font-mono whitespace-nowrap pointer-events-none">
                    {width}×{height}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview + coords */}
        <div className="w-full lg:w-48 shrink-0 space-y-3">
          <label className="text-[11px] font-mono uppercase text-ink/50 mb-1 block">Preview</label>
          <div className="w-full aspect-square rounded-xl border border-ink/10 overflow-hidden"
            style={{
              backgroundImage: `url(${SPRITE_SHEET})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${-(x * (256 / width))}px ${-(y * (256 / height))}px`,
              backgroundSize: `${SPRITE_W * (256 / width)}px ${SPRITE_H * (256 / height)}px`,
              backgroundColor: '#F4E8D1',
            }} />

          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            <div className="px-2 py-1 rounded bg-ink/5"><span className="text-ink/40">X:</span> {x}</div>
            <div className="px-2 py-1 rounded bg-ink/5"><span className="text-ink/40">Y:</span> {y}</div>
            <div className="px-2 py-1 rounded bg-ink/5"><span className="text-ink/40">W:</span> {width}</div>
            <div className="px-2 py-1 rounded bg-ink/5"><span className="text-ink/40">H:</span> {height}</div>
          </div>

          {/* Quick set from inputs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-ink/50 block">Tọa độ thủ công</label>
            <div className="grid grid-cols-2 gap-1.5">
              <NumInput label="X" value={x} max={SPRITE_W - width} onChange={v => onChange({ ...value, x: v })} />
              <NumInput label="Y" value={y} max={SPRITE_H - height} onChange={v => onChange({ ...value, y: v })} />
              <NumInput label="W" value={width} max={SPRITE_W - x} onChange={v => onChange({ ...value, width: v })} />
              <NumInput label="H" value={height} max={SPRITE_H - y} onChange={v => onChange({ ...value, height: v })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumInput({ label, value, max, onChange }) {
  return (
    <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg border border-ink/10 bg-white">
      <span className="text-[10px] font-mono text-ink/40">{label}</span>
      <input type="number" value={value} min={0} max={max}
        onChange={e => { const v = Math.max(0, Math.min(Number(e.target.value) || 0, max)); onChange(v); }}
        className="flex-1 w-0 text-[11px] font-mono text-ink bg-transparent outline-none" />
    </div>
  );
}
