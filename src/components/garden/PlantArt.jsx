/* ============================================================
   COLOR HELPER — lighten/darken a hex color by a percent amount
============================================================ */
function shade(hex, percent) {
  if (!hex || hex[0] !== '#') return hex;
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/* ============================================================
   ICON — nhỏ, tự vẽ bằng SVG, không dùng thư viện icon
============================================================ */
export function Icon({ name, className = 'w-4 h-4', style }) {
  const common = { className, style, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (name) {
    case 'back':
      return <svg {...common}><path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'coin':
      return <svg {...common}><circle cx="12" cy="12" r="8.5" fill="#F4B93E" stroke="#B8791A" strokeWidth="1.3" /><path d="M12 8v8M9.8 10.2c0-1 1-1.7 2.2-1.7s2.2.6 2.2 1.5c0 2.1-4.4 1.2-4.4 3.3 0 .9 1 1.5 2.2 1.5s2.2-.6 2.2-1.6" stroke="#8A5A0E" strokeWidth="1.1" strokeLinecap="round" /></svg>;
    case 'close':
      return <svg {...common}><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
    case 'water':
      return <svg {...common}><path d="M12 3C12 3 6 10.5 6 14.5C6 18.09 8.69 21 12 21C15.31 21 18 18.09 18 14.5C18 10.5 12 3 12 3Z" fill="#8FCBEA" stroke="#3D8FBF" strokeWidth="1.2" /></svg>;
    case 'cut':
      return <svg {...common}><circle cx="6.5" cy="6.5" r="2.3" stroke="currentColor" strokeWidth="1.6" /><circle cx="6.5" cy="17.5" r="2.3" stroke="currentColor" strokeWidth="1.6" /><path d="M8.3 8L19 18M8.3 16L19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
    case 'trash':
      return <svg {...common}><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 12a1 1 0 001 1h6a1 1 0 001-1l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'bag':
      return <svg {...common}><path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.6" /></svg>;
    case 'backpack':
      return <svg {...common}><path d="M8 9V7a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.6" /><rect x="6" y="9" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'sparkle':
      return <svg {...common}><path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3Z" fill="currentColor" /></svg>;
    default:
      return null;
  }
}

/* ============================================================
   PLANT ART — bộ SVG cao cấp: gradient, cánh hoa dạng giọt nước,
   lá có gân, quả có bóng đổ + highlight, hào quang cho cây thần kỳ.
============================================================ */

/** Bộ định nghĩa gradient dùng chung cho một cây (theo plantId để tránh trùng id). */
function PlantGradientDefs({ id, palette }) {
  return (
    <defs>
      <radialGradient id={`ground-${id}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8C6A42" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#8C6A42" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`stem-${id}`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={shade(palette.stem, -15)} />
        <stop offset="100%" stopColor={shade(palette.stem, 25)} />
      </linearGradient>
      <linearGradient id={`leaf-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={palette.leaf} />
        <stop offset="100%" stopColor={palette.leafDark} />
      </linearGradient>
      <radialGradient id={`petal-${id}`} cx="35%" cy="28%" r="80%">
        <stop offset="0%" stopColor={palette.accentLight} />
        <stop offset="55%" stopColor={palette.accent} />
        <stop offset="100%" stopColor={palette.accentDark} />
      </radialGradient>
      <radialGradient id={`fruit-${id}`} cx="32%" cy="28%" r="80%">
        <stop offset="0%" stopColor={palette.accentLight} />
        <stop offset="60%" stopColor={palette.accent} />
        <stop offset="100%" stopColor={palette.accentDark} />
      </radialGradient>
      <radialGradient id={`center-${id}`} cx="38%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FFF6D8" />
        <stop offset="60%" stopColor={palette.accentLight} />
        <stop offset="100%" stopColor={palette.accentDark} />
      </radialGradient>
    </defs>
  );
}

/** Một chiếc lá dạng giọt nước có gân giữa, đẹp hơn ellipse thô. */
function LeafShape({ cx, cy, angle, size, fill }) {
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <path
        d={`M0,0 Q${size * 0.62},${-size * 0.5} 0,${-size * 1.55} Q${-size * 0.62},${-size * 0.5} 0,0 Z`}
        fill={fill}
        opacity={0.92}
      />
      <path d={`M0,-1.5 L0,${-size * 1.35}`} stroke="#00000022" strokeWidth={0.5} strokeLinecap="round" />
    </g>
  );
}

/** Một cánh hoa dạng giọt nước, xoay quanh tâm hoa theo góc `angle`. */
function Petal({ cx, cy, angle, length, width, gradientId, strokeColor }) {
  return (
    <path
      d={`M0,0 C${-width / 2},${-length * 0.35} ${-width / 2},${-length * 0.78} 0,${-length}
          C${width / 2},${-length * 0.78} ${width / 2},${-length * 0.35} 0,0 Z`}
      fill={`url(#${gradientId})`}
      stroke={strokeColor}
      strokeWidth={0.4}
      opacity={0.96}
      transform={`translate(${cx},${cy}) rotate(${angle})`}
    />
  );
}

/** Một trái cây tròn có bóng đổ dưới + highlight sáng bóng phía trên. */
function Fruit({ cx, cy, r, gradientId, strokeColor }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + r * 0.85} rx={r * 1.05} ry={r * 0.35} fill="#000" opacity={0.1} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradientId})`} stroke={strokeColor} strokeWidth={0.5} />
      <ellipse
        cx={cx - r * 0.32}
        cy={cy - r * 0.35}
        rx={r * 0.38}
        ry={r * 0.2}
        fill="#fff"
        opacity={0.4}
        transform={`rotate(-30 ${cx - r * 0.32} ${cy - r * 0.35})`}
      />
    </g>
  );
}

function StemBase({ stageIdx, totalStages, palette, withLeaves = true, plantId }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 18 + frac * 66;
  const topY = 122 - stemH;
  const leafCount = Math.min(stageIdx, 3);
  const leaves = [];
  if (withLeaves) {
    for (let i = 0; i < leafCount; i++) {
      const y = 118 - (i + 1) * (stemH / (leafCount + 1.4));
      const spread = 8 + i * 2;
      const size = 9 - i;
      const rot = 35 - i * 4;
      leaves.push(
        <g key={`${y}-${i}`}>
          <LeafShape cx={60 - spread} cy={y} angle={-rot} size={size} fill={i % 2 ? `url(#leaf-${plantId})` : palette.leafDark} />
          <LeafShape cx={60 + spread} cy={y} angle={rot} size={size} fill={i % 2 ? palette.leaf : `url(#leaf-${plantId})`} />
        </g>
      );
    }
  }
  return (
    <>
      <ellipse cx={60} cy={122} rx={4} ry={1.4} fill="#000" opacity={0.08} />
      <path
        d={`M60,122 Q${58 - frac * 4},${(122 + topY) / 2} 60,${topY}`}
        stroke={`url(#stem-${plantId})`}
        strokeWidth={3.5 - frac * 1}
        fill="none"
        strokeLinecap="round"
      />
      {leaves}
    </>
  );
}

export function renderBloom({ stageIdx, totalStages, palette, isReady, plantId }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 18 + frac * 66;
  const topY = 122 - stemH;
  const mature = stageIdx === totalStages - 1;
  const petalCount = 12;
  return (
    <>
      <StemBase stageIdx={stageIdx} totalStages={totalStages} palette={palette} plantId={plantId} />
      {mature && (
        <g className={isReady ? 'gd-sway' : ''} style={{ transformOrigin: `60px ${topY}px` }}>
          <ellipse cx={60} cy={topY + 3} rx={15} ry={5.5} fill={palette.accentDark} opacity={0.18} />
          {Array.from({ length: petalCount }).map((_, i) => (
            <Petal
              key={`b-${i}`}
              cx={60}
              cy={topY}
              angle={(360 / petalCount) * i + 15}
              length={9.5}
              width={5.5}
              gradientId={`petal-${plantId}`}
              strokeColor={palette.accentDark}
            />
          ))}
          {Array.from({ length: petalCount }).map((_, i) => (
            <Petal
              key={`t-${i}`}
              cx={60}
              cy={topY}
              angle={(360 / petalCount) * i}
              length={13}
              width={7}
              gradientId={`petal-${plantId}`}
              strokeColor={palette.accentDark}
            />
          ))}
          <circle cx={60} cy={topY} r={7.5} fill={`url(#center-${plantId})`} stroke={palette.accentDark} strokeWidth={0.7} />
          {[0, 60, 120, 180, 240, 300].map((d) => (
            <circle key={d} cx={60 + 3.2 * Math.cos((d * Math.PI) / 180)} cy={topY + 3.2 * Math.sin((d * Math.PI) / 180)} r={0.9} fill="#C97F17" opacity={0.85} />
          ))}
          <ellipse cx={57} cy={topY - 2.2} rx={2.4} ry={1.2} fill="#fff" opacity={0.55} />
        </g>
      )}
    </>
  );
}

export function renderFruitTree({ stageIdx, totalStages, palette, isReady, noFruit, plantId }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 20 + frac * 68;
  const topY = 122 - stemH;
  const canopyR = 12 + frac * 14;
  const showCanopy = stageIdx >= 1;
  const mature = stageIdx === totalStages - 1;
  return (
    <>
      <ellipse cx={60} cy={122} rx={5} ry={1.6} fill="#000" opacity={0.08} />
      <path d={`M60,122 L${60 - frac * 2},${topY}`} stroke={`url(#stem-${plantId})`} strokeWidth={4 + frac * 2.5} strokeLinecap="round" />
      {showCanopy && (
        <g className={mature && isReady ? 'gd-sway' : ''} style={{ transformOrigin: `60px ${topY}px` }}>
          <ellipse cx={60} cy={topY + canopyR * 0.75} rx={canopyR * 1.05} ry={canopyR * 0.3} fill="#000" opacity={0.08} />
          <circle cx={60} cy={topY + 2} r={canopyR} fill={`url(#leaf-${plantId})`} opacity={0.92} />
          <circle cx={60 - canopyR * 0.4} cy={topY - canopyR * 0.28} r={canopyR * 0.65} fill={palette.leaf} opacity={0.85} />
          <circle cx={60 + canopyR * 0.45} cy={topY - canopyR * 0.18} r={canopyR * 0.6} fill={palette.leaf} opacity={0.85} />
          <circle cx={60} cy={topY - canopyR * 0.45} r={canopyR * 0.42} fill={shade(palette.leaf, 20)} opacity={0.55} />
          {mature && !noFruit && (
            <>
              {[[-7, 2], [6, 6], [1, -6], [-4, 8], [8, -2]].map(([dx, dy], i) => (
                <Fruit key={i} cx={60 + dx} cy={topY + dy} r={4.3} gradientId={`fruit-${plantId}`} strokeColor={palette.accentDark} />
              ))}
            </>
          )}
        </g>
      )}
    </>
  );
}

export function renderCactus({ stageIdx, totalStages, palette, plantId }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const h = 20 + frac * 55;
  const w = 12 + frac * 6;
  const topY = 120 - h;
  const mature = stageIdx === totalStages - 1;
  return (
    <>
      <ellipse cx={60} cy={120} rx={w * 0.8} ry={3.5} fill="#000" opacity={0.08} />
      <rect x={60 - w / 2} y={topY} width={w} height={h} rx={w / 2} fill={`url(#leaf-${plantId})`} stroke={palette.leafDark} strokeWidth={1} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={60 - w / 2 + (i * w) / 4} y1={topY + 4} x2={60 - w / 2 + (i * w) / 4} y2={topY + h - 4} stroke={palette.leafDark} strokeWidth={0.6} opacity={0.4} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = w / 2 + 2;
        const cx = 60 + r * Math.cos(angle);
        const cy = topY + h * 0.5 + r * 0.4 * Math.sin(angle);
        return <line key={i} x1={cx} y1={cy} x2={cx + 4 * Math.cos(angle)} y2={cy + 4 * Math.sin(angle)} stroke="#9C6B3A" strokeWidth={0.7} opacity={0.55} />;
      })}
      {stageIdx >= 1 && (
        <path d={`M${60 - w / 2},${topY + h * 0.4} q-10,-2 -9,-14`} stroke={`url(#leaf-${plantId})`} strokeWidth={5} strokeLinecap="round" fill="none" />
      )}
      {stageIdx >= 2 && (
        <path d={`M${60 + w / 2},${topY + h * 0.55} q10,-2 9,-14`} stroke={`url(#leaf-${plantId})`} strokeWidth={5} strokeLinecap="round" fill="none" />
      )}
      {mature && (
        <g>
          <circle cx={60} cy={topY - 4} r={5.5} fill={`url(#petal-${plantId})`} stroke={palette.accentDark} strokeWidth={0.6} />
          <circle cx={60} cy={topY - 4} r={2} fill="#FFF6D8" />
          <ellipse cx={58.4} cy={topY - 5.6} rx={1.3} ry={0.7} fill="#fff" opacity={0.55} />
        </g>
      )}
    </>
  );
}

export function renderBamboo({ stageIdx, totalStages, palette, plantId }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stalks = [{ dx: -9, h: 0.8 }, { dx: 0, h: 1 }, { dx: 9, h: 0.65 }];
  return (
    <>
      {stalks.map((s, i) => {
        const h = (20 + frac * 62) * s.h;
        const topY = 122 - h;
        const joints = Math.max(1, Math.round(h / 14));
        return (
          <g key={i}>
            <ellipse cx={60 + s.dx} cy={122} rx={4} ry={1.4} fill="#000" opacity={0.08} />
            <rect x={60 + s.dx - 3.5} y={topY} width={7} height={h} rx={3.5} fill={`url(#stem-${plantId})`} />
            {Array.from({ length: joints }).map((_, j) => (
              <line
                key={j}
                x1={60 + s.dx - 4}
                x2={60 + s.dx + 4}
                y1={topY + (j + 1) * (h / (joints + 1))}
                y2={topY + (j + 1) * (h / (joints + 1))}
                stroke={palette.leafDark}
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
            {stageIdx >= 1 && (
              <>
                <LeafShape cx={60 + s.dx - 7} cy={topY + 4} angle={-60} size={9} fill={`url(#leaf-${plantId})`} />
                <LeafShape cx={60 + s.dx + 7} cy={topY + 9} angle={60} size={9} fill={`url(#leaf-${plantId})`} />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

export function renderVine({ stageIdx, totalStages, palette, plantId }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const mature = stageIdx === totalStages - 1;
  const spread = 14 + frac * 14;
  return (
    <>
      <path d={`M60,120 q${-spread},-4 ${-spread - 6},-14`} stroke={`url(#stem-${plantId})`} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d={`M60,120 q${spread},-6 ${spread + 6},-10`} stroke={`url(#stem-${plantId})`} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {Array.from({ length: 1 + stageIdx }).map((_, i) => (
        <LeafShape key={i} cx={60 - spread + i * 9} cy={112 - (i % 2) * 4} angle={-20 + i * 10} size={8} fill={`url(#leaf-${plantId})`} />
      ))}
      {mature && (
        <g>
          <circle cx={72} cy={112} r={10} fill={`url(#petal-${plantId})`} stroke={palette.accentDark} strokeWidth={0.7} />
          <circle cx={72} cy={112} r={3} fill="#FFF6D8" />
          <ellipse cx={70} cy={110} rx={1.6} ry={0.9} fill="#fff" opacity={0.5} />
          {[-1, 0, 1].map((k) => (
            <path key={k} d={`M${72 + k * 3.6},100 q${k * 2},11 0,22`} stroke={palette.leafDark} strokeWidth={1.3} fill="none" opacity={0.4} />
          ))}
        </g>
      )}
    </>
  );
}

export function renderAura({ stageIdx, totalStages, palette, isReady, plantId }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 16 + frac * 60;
  const topY = 122 - stemH;
  const mature = stageIdx === totalStages - 1;
  const orbits = Math.min(stageIdx, 3);
  return (
    <>
      <path d={`M60,122 L60,${topY}`} stroke={`url(#stem-${plantId})`} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
      {Array.from({ length: orbits }).map((_, i) => (
        <circle
          key={i}
          cx={60 + (i % 2 ? 9 : -9)}
          cy={topY + 10 + i * 12}
          r={4}
          fill={`url(#petal-${plantId})`}
          className="gd-twinkle"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {mature && (
        <g className={isReady ? 'gd-pulse' : ''} style={{ transformOrigin: `60px ${topY}px` }}>
          {isReady && (
            <>
              <circle cx={60} cy={topY} r={22} fill={`url(#petal-${plantId})`} opacity={0.14} />
              <circle cx={60} cy={topY} r={30} fill={palette.accentLight} opacity={0.07} className="gd-pulse" />
            </>
          )}
          <path
            d={`M60,${topY - 13} L64,${topY - 3} L74,${topY - 3} L66,${topY + 5} L69,${topY + 15} L60,${topY + 8} L51,${topY + 15} L54,${topY + 5} L46,${topY - 3} L56,${topY - 3} Z`}
            fill={`url(#center-${plantId})`}
            stroke={palette.accentDark}
            strokeWidth={0.6}
          />
          <circle cx={60} cy={topY} r={4} fill="white" opacity={0.35} />
        </g>
      )}
    </>
  );
}

export function PlantArt({ plantId, stageIdx, totalStages, isReady, plantConfig }) {
  const cfg = plantConfig[plantId];
  if (!cfg) return null;
  const { palette, kind, noFruit } = cfg;
  return (
    <svg viewBox="0 0 120 140" width="120" height="140">
      <PlantGradientDefs id={plantId} palette={palette} />
      <ellipse cx="60" cy="127" rx="32" ry="8" fill={`url(#ground-${plantId})`} />
      <ellipse cx="60" cy="123.5" rx="28" ry="6" fill="#8C6A42" opacity="0.55" />
      {kind === 'bloom' && renderBloom({ stageIdx, totalStages, palette, isReady, plantId })}
      {kind === 'fruitTree' && renderFruitTree({ stageIdx, totalStages, palette, isReady, noFruit, plantId })}
      {kind === 'cactus' && renderCactus({ stageIdx, totalStages, palette, plantId })}
      {kind === 'bamboo' && renderBamboo({ stageIdx, totalStages, palette, plantId })}
      {kind === 'vine' && renderVine({ stageIdx, totalStages, palette, plantId })}
      {kind === 'aura' && renderAura({ stageIdx, totalStages, palette, isReady, plantId })}
    </svg>
  );
}

export { shade };
