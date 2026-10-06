/**
 * GardenCanvas — ruộng đồng isometric của khu vườn.
 *
 * Trang bịa y hệt cách dựng cảnh trong src/games/offline/nong-trai-vui.html:
 *   • Bầu trời gradient + mặt trời/đầu trăng đi theo vòng ngày–đêm
 *   • Đồi xa 2 lớp, mặt đất gradient, cỏ và hoa rải rác
 *   • Ô đất hình thoi: mặt trên + 2 mặt bên (dày), ô chưa mở khoá thì viền đứt + 🔒
 *   • Cây/hoa vẽ bằng PlantArt đặt chồng lên canvas (giữ đồ hoạ SVG sẵn có)
 *
 * Dữ liệu cây đến từ API: `slots` (gardenService.get()) — mỗi slot là 1 ô đất.
 * Không có nhân vật đi bộ như bản cũ; tương tác bằng cách chạm vào ô.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { PlantArt } from './PlantArt.jsx';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

// Bảng màu trời: [đêm-trên, đêm-dưới] → [ngày-trên, ngày-dưới]
const NT = [11, 20, 54], NB = [40, 54, 112];
const DT = [88, 185, 245], DB = [207, 238, 255];
const DAYLEN = 360, DAY0 = DAYLEN * 0.32;

/** Rút gọn thời gian còn lại cho nhãn nút: 45p, 2h 10p… */
function fmtLeft(ms) {
  if (ms <= 0) return '0p';
  const s = Math.ceil(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}p`;
  return `${m}p`;
}

/** Các ô đã mở, bắt đầu từ giữa ra ngoài như START_UNLOCK của game gốc. */
function unlockOrder(n) {
  const g = Math.ceil(Math.sqrt(n));
  const cells = [];
  for (let r = 0; r < g; r++) for (let c = 0; c < g; c++) cells.push([r, c]);
  const mid = (g - 1) / 2;
  return cells
    .sort((a, b) => (Math.abs(a[0] - mid) + Math.abs(a[1] - mid)) - (Math.abs(b[0] - mid) + Math.abs(b[1] - mid)))
    .slice(0, n)
    .map(([r, c]) => r * g + c)
    .sort((a, b) => a - b);
}

export default function GardenCanvas({
  slots = [],
  cfg = {},
  getDisplay,
  selectedIndex = null,
  onSelectPlot,
  onLockedPlot,
}) {
  const wrapRef = useRef(null);
  const cvRef = useRef(null);
  const [layout, setLayout] = useState(null);

  // Vòng lặp vẽ cần thấy dữ liệu mới nhất mà không phải dựng lại effect,
  // nên đẩy xuống ref trong effect (không gán trực tiếp lúc render).
  const dataRef = useRef({ slots, cfg, getDisplay, selectedIndex, layout, onSelectPlot, onLockedPlot });
  useEffect(() => {
    dataRef.current = { slots, cfg, getDisplay, selectedIndex, layout, onSelectPlot, onLockedPlot };
  });

  /* ── Tính hình học: ô thoi tw × th, nén theo chiều dọc 0.55 như game gốc ── */
  const measure = useCallback(() => {
    const el = wrapRef.current, cv = cvRef.current;
    if (!el || !cv) return;
    const W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * DPR; cv.height = H * DPR;
    const ctx = cv.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const n = Math.max(1, slots.length);
    const g = Math.ceil(Math.sqrt(n));
    const barH = 108;              // chỗ cho thanh dưới
    const topH = 96;               // chỗ cho HUD
    const horizon = H * 0.29;
    const tw = Math.min((W - 24) / g, 118, ((H - barH - topH - 30) / g) / 0.55);
    const th = tw * 0.55;
    const fieldCX = W / 2;
    const fieldH = g * th + tw * 0.1;
    const aTop = Math.max(horizon + H * 0.04, topH + 30);
    const aBot = H - barH - 6;
    const fieldTop = aTop + Math.max(0, (aBot - aTop - fieldH) / 2);

        // Ô được mở khoá KHÔNG trùng chỉ số 0..n-1 (chúng rải rác từ giữa ra).
    // Phải có bảng tra tường minh: ô trong lưới → vị trí trong mảng slots.
    // Nếu đoán bằng slots[ô] thì các ô mở khoá ở đuôi sẽ ra undefined
    // (bấm không ăn), còn slot đầu rơi vào ô đang khoá (không hiện, không bấm).
    const cells = unlockOrder(n);                 // đã sort tăng dần
    const slotAtCell = new Map(cells.map((cell, i) => [cell, i]));

    setLayout({ W, H, g, tw, th, horizon, fieldCX, fieldTop, slotAtCell });
  }, [slots.length]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('orientationchange', measure);
    return () => { ro.disconnect(); window.removeEventListener('orientationchange', measure); };
  }, [measure]);

  /* ── Vẽ ── */
  useEffect(() => {
    let raf, last = performance.now(), T = 0;
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');

    const quad = (pts, fill) => {
      ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    };

    const drawSky = (L) => {
      const g = ctx.createLinearGradient(0, 0, 0, layout.horizon * 1.25);
      g.addColorStop(0, rgb(mix(NT, DT, L)));
      g.addColorStop(1, rgb(mix(NB, DB, L)));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, layout.W, layout.horizon * 1.3);

      // Mặt trời / đầu trăng đi trên vòng cung
      const phase = ((T + DAY0) % DAYLEN) / DAYLEN;
      const arc = (q) => ({ x: layout.W * (0.1 + 0.8 * q), y: layout.horizon * 0.95 - Math.sin(Math.PI * q) * layout.horizon * 0.72 });
      if (phase >= 0.25 && phase <= 0.75) {
        const s = arc((phase - 0.25) * 2);
        const gl = ctx.createRadialGradient(s.x, s.y, 4, s.x, s.y, 70);
        gl.addColorStop(0, 'rgba(255,240,170,.9)'); gl.addColorStop(1, 'rgba(255,240,170,0)');
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(s.x, s.y, 70, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#fff4b8'; ctx.beginPath(); ctx.arc(s.x, s.y, 22, 0, 6.283); ctx.fill();
      } else {
        const m = arc((((phase < 0.25 ? phase + 1 : phase) - 0.75)) * 2);
        const gl = ctx.createRadialGradient(m.x, m.y, 4, m.x, m.y, 60);
        gl.addColorStop(0, 'rgba(230,240,255,.55)'); gl.addColorStop(1, 'rgba(230,240,255,0)');
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(m.x, m.y, 60, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#f6f3e2'; ctx.beginPath(); ctx.arc(m.x, m.y, 17, 0, 6.283); ctx.fill();
      }

      ctx.fillStyle = `rgba(255,255,255,${0.35 + L * 0.55})`;
      for (let i = 0; i < 4; i++) {
        const x = (((0.12 + i * 0.26) + T * 0.006) % 1.3 - 0.15) * layout.W;
        const y = layout.H * (0.05 + (i % 3) * 0.06);
        const s = 26 + (i % 2) * 12;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 1.4, s * 0.5, 0, 0, 6.283);
        ctx.ellipse(x - s * 0.7, y + s * 0.1, s * 0.8, s * 0.4, 0, 0, 6.283);
        ctx.ellipse(x + s * 0.8, y + s * 0.12, s * 0.9, s * 0.42, 0, 0, 6.283);
        ctx.ellipse(x + s * 0.1, y - s * 0.3, s * 0.8, s * 0.5, 0, 0, 6.283);
        ctx.fill();
      }
    };

    const hill = (off, amp, base) => {
      ctx.beginPath(); ctx.moveTo(0, layout.horizon + 40);
      for (let x = 0; x <= layout.W + 10; x += 10) {
        ctx.lineTo(x, base - Math.sin(x * 0.011 + off) * amp - Math.sin(x * 0.029 + off * 2) * amp * 0.35);
      }
      ctx.lineTo(layout.W, layout.horizon + 40); ctx.closePath();
    };

    const drawGround = () => {
      hill(1, 20, layout.horizon - 14); ctx.fillStyle = '#8ccf86'; ctx.fill();
      hill(3.4, 14, layout.horizon + 2); ctx.fillStyle = '#74c46f'; ctx.fill();
      const g = ctx.createLinearGradient(0, layout.horizon, 0, layout.H);
      g.addColorStop(0, '#8adb72'); g.addColorStop(1, '#4da14b');
      ctx.fillStyle = g; ctx.fillRect(0, layout.horizon + 6, layout.W, layout.H - layout.horizon);
      const gh = layout.H - layout.horizon - 10;
      ctx.strokeStyle = 'rgba(46,120,50,.45)'; ctx.lineWidth = 1.6;
      for (let i = 0; i < 46; i++) {
        const x = ((i * 0.137) % 1) * layout.W;
        const y = layout.horizon + 16 + ((i * 0.219) % 1) * gh;
        const s = 1 + ((i % 3) * 0.4);
        ctx.beginPath();
        ctx.moveTo(x - 4 * s, y); ctx.lineTo(x - 2 * s, y - 7 * s);
        ctx.moveTo(x, y); ctx.lineTo(x, y - 9 * s);
        ctx.moveTo(x + 4 * s, y); ctx.lineTo(x + 2 * s, y - 7 * s);
        ctx.stroke();
      }
      for (let i = 0; i < 16; i++) {
        const x = ((i * 0.271 + 0.05) % 1) * layout.W;
        const y = layout.horizon + 20 + ((i * 0.373) % 1) * gh;
        ctx.fillStyle = ['#ff8fb1', '#ffd54a', '#fff', '#b79cf5'][i % 4];
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#ffd54a'; ctx.beginPath(); ctx.arc(x, y, 1, 0, 6.283); ctx.fill();
      }
    };

    const drawTrees = () => {
      [[0.04, 1], [0.3, 0.8], [0.6, 0.95], [0.86, 1.05], [0.97, 0.8]].forEach(([fx, s]) => {
        ctx.fillStyle = 'rgba(0,0,0,.14)';
        ctx.beginPath(); ctx.ellipse(fx * layout.W, layout.horizon + 16, 22 * s, 6 * s, 0, 0, 6.283); ctx.fill();
        ctx.font = `${58 * s}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('🌳', fx * layout.W, layout.horizon + 16);
      });
    };

    const tp = (r, c) => ({
      x: layout.fieldCX + (c - r) * layout.tw / 2,
      y: layout.fieldTop + layout.tw * 0.05 + (c + r) * layout.th / 2,
    });

    const drawTile = (r, c, unlocked, selected, prog, ready) => {
      const { x, y } = tp(r, c);
      const w = layout.tw * 0.97, h = layout.th * 0.97, d = layout.tw * 0.09;
      if (unlocked) {
        // 2 mặt bên cho ô đất có độ dày
        quad([x - w / 2, y, x, y + h / 2, x, y + h / 2 + d, x - w / 2, y + d], '#63401f');
        quad([x, y + h / 2, x + w / 2, y, x + w / 2, y + d, x, y + h / 2 + d], '#75492a');
        const g = ctx.createLinearGradient(x, y - h / 2, x, y + h / 2);
        g.addColorStop(0, '#b07240'); g.addColorStop(1, '#8e5a32');
        quad([x, y - h / 2, x + w / 2, y, x, y + h / 2, x - w / 2, y], g);
        // vân đất
        ctx.strokeStyle = 'rgba(60,30,10,.22)'; ctx.lineWidth = 1.6;
        for (let k = -1; k <= 1; k++) {
          ctx.beginPath();
          ctx.moveTo(x - w * 0.28 + k * w * 0.12, y - h * 0.32 + k * h * 0.12);
          ctx.lineTo(x + w * 0.18 + k * w * 0.12, y + h * 0.04 + k * h * 0.12);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x, y - h / 2); ctx.lineTo(x + w / 2, y); ctx.stroke();
        // ô đang chọn: viền sáng
        if (selected) {
          ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y - h / 2); ctx.lineTo(x + w / 2, y);
          ctx.lineTo(x, y + h / 2); ctx.lineTo(x - w / 2, y); ctx.closePath();
          ctx.stroke();
        }
        // thanh tiến độ nằm trên mặt ô, dưới gốc cây
        if (prog !== null && !ready) {
          const bw = layout.tw * 0.42, bx = x - bw / 2, by = y + layout.th * 0.22;
          ctx.fillStyle = 'rgba(60,35,15,.55)';
          ctx.beginPath(); ctx.roundRect(bx, by, bw, 6, 3); ctx.fill();
          ctx.fillStyle = '#6cc8ff';
          ctx.beginPath(); ctx.roundRect(bx + 1, by + 1, Math.max(3, (bw - 2) * (prog / 100)), 4, 2); ctx.fill();
        }
      } else {
        quad([x - w / 2, y, x, y + h / 2, x, y + h / 2 + d * 0.5, x - w / 2, y + d * 0.5], '#4c9a49');
        quad([x, y + h / 2, x + w / 2, y, x + w / 2, y + d * 0.5, x, y + h / 2 + d * 0.5], '#57a955');
        quad([x, y - h / 2, x + w / 2, y, x, y + h / 2, x - w / 2, y], 'rgba(160,230,130,.95)');
        ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y - h * 0.42); ctx.lineTo(x + w * 0.43, y);
        ctx.lineTo(x, y + h * 0.42); ctx.lineTo(x - w * 0.43, y); ctx.closePath();
        ctx.stroke(); ctx.setLineDash([]);
        ctx.globalAlpha = 0.85;
        ctx.font = `${layout.tw * 0.27}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🔒', x, y - 1);
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now) => {
      // dt tính bằng GIÂY → T cũng tính bằng giây. Nếu nhân thêm 1000 thì
      // DAYLEN=360 sẽ bị nén còn 0.36s và trời nhấp nháy sáng/tối liên tục.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now; T += dt;
      const d = dataRef.current;
      const L = clamp(0.5 + 0.8 * Math.sin(2 * Math.PI * (((T + DAY0) % DAYLEN) / DAYLEN - 0.25)), 0, 1);
      ctx.clearRect(0, 0, layout.W, layout.H);
      drawSky(L); drawGround(); drawTrees();
      ctx.fillStyle = 'rgba(0,0,0,.12)';
      ctx.beginPath();
      ctx.ellipse(layout.fieldCX, layout.fieldTop + layout.g * layout.th * 0.52, layout.g * layout.tw * 0.56, layout.g * layout.th * 0.58, 0, 0, 6.283);
      ctx.fill();

      // Ô đất: vẽ theo thứ tự z (xa → gần) để chồng đúng
      const order = [];
      for (let r = 0; r < layout.g; r++) for (let c = 0; c < layout.g; c++) order.push([r, c]);
      order.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
      order.forEach(([r, c]) => {
        const i = r * layout.g + c;
        const si = layout.slotAtCell.get(i);
        const slot = si === undefined ? undefined : d.slots[si];
        let prog = null, isReady = false;
        if (slot?.plant) {
          prog = d.getDisplay ? d.getDisplay(slot).progress : (slot.plant.progress || 0);
          isReady = prog >= 100;
        }
        drawTile(r, c, si !== undefined, d.selectedIndex === (slot?.index ?? -2), prog, isReady);
      });

      // Ánh sáng đêm + đèn vàng
      ctx.fillStyle = `rgba(12,22,70,${(1 - L) * 0.42})`;
      ctx.fillRect(0, 0, layout.W, layout.H);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [layout]);

  /* ── Lớp bấm: xem phần `hits` gần cuối file ── */

  // Ô đã trồng: đặt PlantArt chồng lên canvas
  //
  // PlantArt có viewBox="0 0 120 140" và mặt đất nằm ở y = 123.5.
  // Đặt khung theo đúng kích thước gốc rồi scale quanh ĐÁY GIỮA → gốc cây
  // luôn nằm chính giữa ô đất, không bị lệch hay méo.
  const ART_W = 120, ART_H = 140, SOIL_Y = 123.5;
  const plots = [];
  if (layout) {
    // Mỗi slot từ API gắn đúng ô đã mở khoá tương ứng (xem slotAtCell).
    const cellOfSlot = new Map([...layout.slotAtCell.entries()].map(([cell, si]) => [si, cell]));
    slots.forEach((slot, si) => {
      const cell = cellOfSlot.get(si);
      if (cell === undefined || !slot?.plant) return;
      const prog = getDisplay ? getDisplay(slot).progress : (slot.plant.progress || 0);
      const conf = cfg[slot.plant.plantType];
      if (!conf) return;
      const r = Math.floor(cell / layout.g), c = cell % layout.g;
      const x = layout.fieldCX + (c - r) * layout.tw / 2;
      const y = layout.fieldTop + layout.tw * 0.05 + (c + r) * layout.th / 2;
      const ready = prog >= 100;
      const stage = ready
        ? conf.stageCount - 1
        : Math.min(conf.stageCount - 1, Math.floor((prog / 100) * (conf.stageCount - 1)));
      // Cây rộng ~62% bề ngang ô thoi
      const k = (layout.tw * 0.62) / ART_W;
      plots.push(
        <div key={slot.index ?? si} style={{ position: 'absolute', left: x - ART_W / 2, top: y - SOIL_Y, width: ART_W, height: ART_H, pointerEvents: 'none' }}>
          <div style={{
            width: ART_W, height: ART_H,
            transform: `scale(${k * (0.62 + 0.38 * (prog / 100))})`,
            transformOrigin: 'bottom center',
            transition: 'transform .4s ease',
            filter: ready ? 'drop-shadow(0 0 10px rgba(255,240,150,.9))' : 'none',
          }}>
            <PlantArt plantId={slot.plant.plantType} stageIdx={stage} totalStages={conf.stageCount} isReady={ready} plantConfig={cfg} />
          </div>
          {/* ✅ đặt trên đỉnh cây, không tính vào scale */}
          {ready && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: -6, textAlign: 'center',
              fontSize: layout.tw * 0.26, lineHeight: 1,
            }}>✅</div>
          )}
        </div>
      );
    });
  }

  // Lớp bấm: MỘT NÚT DOM THẬT cho mỗi ô đất, cắt thành hình thoi bằng clip-path.
  //
  // Trước đây bấm bằng cách tính ngược toạ độ pixel trên canvas. Cách đó dễ
  // hỏng: lệch 1px là trúng ô khác, và không có phần tử nào để bàn phím/người
  // dùng đọc màn hình nhận biết. Nút thật thì chắc chắn bấm được, có focus,
  // và clip-path khớp đúng hình thoi nên không chồng lên ô kề.
  const hits = [];
  if (layout) {
    const DIAMOND = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    const nCells = layout.g * layout.g;
    for (let cell = 0; cell < nCells; cell++) {
      const si = layout.slotAtCell.get(cell);
      const r = Math.floor(cell / layout.g), c = cell % layout.g;
      const x = layout.fieldCX + (c - r) * layout.tw / 2;
      const y = layout.fieldTop + layout.tw * 0.05 + (c + r) * layout.th / 2;
      const locked = si === undefined;
      const slot = locked ? null : slots[si];
      const prog = !locked && slot?.plant && getDisplay ? getDisplay(slot).progress : 0;
      const conf = !locked && slot?.plant ? cfg[slot.plant.plantType] : null;
      const ready = prog >= 100;
      const label = locked
        ? 'Ô đất chưa mở khoá'
        : slot?.plant
          ? `${conf?.name || slot.plant.plantType}${ready ? ' — sẵn sàng thu hoạch' : ` — còn ${fmtLeft(ready ? 0 : (conf?.growthTime || 0) * (1 - prog / 100))}`}`
          : 'Ô đất trống — chạm để trồng cây';

      hits.push(
        <button
          key={`hit-${cell}`}
          type="button"
          className="g-plot"
          title={label}
          aria-label={label}
          data-plot={cell}
          onClick={() => (locked ? onLockedPlot?.() : slot && onSelectPlot?.(slot))}
          style={{
            position: 'absolute',
            left: x - layout.tw / 2,
            top: y - layout.th / 2,
            width: layout.tw,
            height: layout.th,
            clipPath: DIAMOND,
            border: 0,
            padding: 0,
            margin: 0,
            background: 'transparent',
            cursor: 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        />
      );
    }
  }

  return (
    <div
      ref={wrapRef}
      className="g-canvas"
      style={{ position: 'absolute', inset: 0, zIndex: 1, touchAction: 'none' }}
    >
      <canvas ref={cvRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />
      {plots}
      {/* Lớp bấm nằm trên canvas, dưới HUD */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>{hits}</div>
    </div>
  );
}