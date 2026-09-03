import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { gardenService, questionService, API_BASE } from '../../services/api.js';
import GardenerAvatar from '../../components/avatar/GardenerAvatar.jsx';

/* ============================================================
   PLANT CONFIG — fetched from backend /api/plant-types
   Each plant has "kind" (render style) + palette for SVG PlantArt.
   If fetch fails, falls back to hardcoded defaults.
============================================================ */
const FALLBACK_PLANT_CONFIG = {
  sunflower: {
    name: 'Hoa hướng dương', kind: 'bloom', stageCount: 3,
    growthTime: 5 * 60 * 1000, harvestCoin: 20, seedPrice: 5, rarity: 'common',
    palette: { stem: '#5B8C3A', leaf: '#7CB342', leafDark: '#4C7A2A', accent: '#F4B93E', accentLight: '#FFE08A', accentDark: '#C97F17' },
  },
  apple: {
    name: 'Cây táo', kind: 'fruitTree', stageCount: 4,
    growthTime: 30 * 60 * 1000, harvestCoin: 50, seedPrice: 15, rarity: 'common',
    palette: { stem: '#7A5230', leaf: '#4E8B3C', leafDark: '#356428', accent: '#D6483C', accentLight: '#F0847A', accentDark: '#A32A20' },
  },
  cherry: {
    name: 'Cây anh đào', kind: 'bloom', stageCount: 3,
    growthTime: 2 * 60 * 60 * 1000, harvestCoin: 120, seedPrice: 40, rarity: 'rare',
    palette: { stem: '#6B4A34', leaf: '#7CB342', leafDark: '#578A2E', accent: '#F3A6C6', accentLight: '#FFE1EE', accentDark: '#D4679A' },
  },
  oak: {
    name: 'Cây cổ thụ', kind: 'fruitTree', stageCount: 3, noFruit: true,
    growthTime: 12 * 60 * 60 * 1000, harvestCoin: 500, seedPrice: 150, rarity: 'epic',
    palette: { stem: '#6E4E30', leaf: '#3E6B32', leafDark: '#2A4E24', accent: '#3E6B32', accentLight: '#5C8B4C', accentDark: '#20381C' },
  },
  magic: {
    name: 'Cây thần kỳ', kind: 'aura', stageCount: 4,
    growthTime: 24 * 60 * 60 * 1000, harvestCoin: 1000, seedPrice: 400, rarity: 'legendary',
    palette: { stem: '#8A5CC4', leaf: '#B27FE0', leafDark: '#6B3FA0', accent: '#7FD8E8', accentLight: '#F4A6E0', accentDark: '#5C3FA0' },
  },
};

const RARITY_STYLES = {
  common: { bg: '#EEF0EC', text: '#6B7264', label: 'Thường', border: '#D0D5CC', glow: 'rgba(107,114,100,0.15)' },
  rare: { bg: '#E4EEFA', text: '#3D6FA8', label: 'Hiếm', border: '#A8C8E8', glow: 'rgba(61,111,168,0.2)' },
  epic: { bg: '#F0E6FA', text: '#7A4EA8', label: 'Sử thi', border: '#C9A8E0', glow: 'rgba(122,78,168,0.2)' },
  legendary: { bg: '#FCEFD6', text: '#B8791A', label: 'Huyền thoại', border: '#F0C87A', glow: 'rgba(184,121,26,0.25)' },
};

function buildPlantConfig(apiTypes) {
  if (!apiTypes || apiTypes.length === 0) return FALLBACK_PLANT_CONFIG;
  const config = {};
  for (const t of apiTypes) {
    config[t.id] = {
      name: t.name,
      kind: t.kind || 'bloom',
      stageCount: t.stages || 3,
      growthTime: t.growthTime || 300000,
      harvestCoin: t.harvestCoin || 10,
      seedPrice: t.seedPrice || 5,
      rarity: t.rarity || 'common',
      palette: t.palette || FALLBACK_PLANT_CONFIG.sunflower.palette,
    };
  }
  return config;
}

/* ============================================================
   ĐỒ DÙNG / KHO ĐỒ
============================================================ */
const ITEM_CONFIG = {
  basic_fertilizer: {
    name: 'Phân bón thường', type: 'consumable', price: 20, boost: 15,
    desc: 'Thúc cây lớn nhanh thêm 15% ngay lập tức.', color: '#8B6A46', icon: '🌱',
  },
  premium_fertilizer: {
    name: 'Phân bón cao cấp', type: 'consumable', price: 55, boost: 40,
    desc: 'Thúc cây lớn nhanh thêm 40% ngay lập tức.', color: '#C97F17', icon: '🌟',
  },
  miracle_fertilizer: {
    name: 'Phân bón thần kỳ', type: 'consumable', price: 150, boost: 100,
    desc: 'Giúp cây chín ngay lập tức, sẵn sàng thu hoạch.', color: '#B8791A', icon: '✨',
  },
  golden_can: {
    name: 'Bình tưới vàng', type: 'upgrade', price: 300,
    desc: 'Nâng cấp vĩnh viễn: mỗi lần tưới nước tăng 20% thay vì 10%.', color: '#D8A83E', icon: '🪙',
  },
  magic_lens: {
    name: 'Kính lúp phép thuật', type: 'upgrade', price: 150,
    desc: 'Nâng cấp vĩnh viễn: hiện đồng hồ đếm ngược chính xác trên mỗi cây.', color: '#5C8BD8', icon: '🔍',
  },
};

function loadInventory(userId) {
  try {
    const raw = localStorage.getItem(`garden_inventory_${userId || 'guest'}`);
    if (!raw) return { basic_fertilizer: 0, premium_fertilizer: 0, miracle_fertilizer: 0, golden_can: 0, magic_lens: 0 };
    return { basic_fertilizer: 0, premium_fertilizer: 0, miracle_fertilizer: 0, golden_can: 0, magic_lens: 0, ...JSON.parse(raw) };
  } catch {
    return { basic_fertilizer: 0, premium_fertilizer: 0, miracle_fertilizer: 0, golden_can: 0, magic_lens: 0 };
  }
}
function saveInventory(userId, inv) {
  try { localStorage.setItem(`garden_inventory_${userId || 'guest'}`, JSON.stringify(inv)); } catch { /* ignore */ }
}

function loadWaterDrops(userId) {
  try {
    const raw = localStorage.getItem(`garden_water_${userId || 'guest'}`);
    return raw ? parseInt(raw, 10) || 0 : 5;
  } catch { return 5; }
}
function saveWaterDrops(userId, count) {
  try { localStorage.setItem(`garden_water_${userId || 'guest'}`, String(count)); } catch { /* ignore */ }
}

const MATH_QUESTIONS = [
  { q: '3 + 5 = ?', options: ['6', '7', '8', '9'], answer: 2 },
  { q: '12 - 4 = ?', options: ['6', '7', '8', '9'], answer: 2 },
  { q: '6 x 7 = ?', options: ['36', '42', '48', '49'], answer: 1 },
  { q: '48 : 6 = ?', options: ['6', '7', '8', '9'], answer: 2 },
  { q: '9 x 9 = ?', options: ['72', '81', '90', '99'], answer: 1 },
  { q: '100 - 37 = ?', options: ['53', '63', '73', '83'], answer: 1 },
  { q: '15 + 28 = ?', options: ['33', '43', '45', '53'], answer: 1 },
  { q: '7 x 8 = ?', options: ['48', '54', '56', '64'], answer: 2 },
  { q: '64 : 8 = ?', options: ['6', '7', '8', '9'], answer: 2 },
  { q: '25 x 4 = ?', options: ['75', '80', '90', '100'], answer: 3 },
  { q: '144 : 12 = ?', options: ['10', '11', '12', '13'], answer: 2 },
  { q: '99 + 101 = ?', options: ['180', '190', '200', '210'], answer: 2 },
];

function formatTime(ms) {
  if (ms <= 0) return 'Sẵn sàng!';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d} ngày ${h % 24} giờ`;
  if (h > 0) return `${h} giờ ${m % 60} phút`;
  if (m > 0) return `${m} phút ${s % 60} giây`;
  return `${s} giây`;
}
function formatClock(ms) {
  if (ms <= 0) return '00:00';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(ss)}` : `${pad(m)}:${pad(ss)}`;
}

/* ============================================================
   ICON — nhỏ, tự vẽ bằng SVG, không dùng thư viện icon
============================================================ */
function Icon({ name, className = 'w-4 h-4', style }) {
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
   PLANT ART — minh hoạ cây bằng SVG thay cho icon/emoji (phiên bản đẹp hơn)
============================================================ */
function leafPair(cx, y, spread, size, rotate, fill, opacity = 1) {
  return (
    <g key={`${y}-${rotate}`}>
      <ellipse cx={cx - spread} cy={y} rx={size} ry={size * 0.55} fill={fill} opacity={opacity} transform={`rotate(${-rotate} ${cx - spread} ${y})`} />
      <ellipse cx={cx + spread} cy={y} rx={size} ry={size * 0.55} fill={fill} opacity={opacity} transform={`rotate(${rotate} ${cx + spread} ${y})`} />
    </g>
  );
}

function StemBase({ stageIdx, totalStages, palette, withLeaves = true }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 18 + frac * 66;
  const topY = 122 - stemH;
  const leafCount = Math.min(stageIdx, 3);
  const leaves = [];
  if (withLeaves) {
    for (let i = 0; i < leafCount; i++) {
      const y = 118 - (i + 1) * (stemH / (leafCount + 1.4));
      leaves.push(leafPair(60, y, 8 + i * 2, 9 - i, 35 - i * 4, i % 2 ? palette.leaf : palette.leafDark, 0.9));
    }
  }
  return (
    <>
      <path d={`M60,122 Q${58 - frac * 4},${(122 + topY) / 2} 60,${topY}`} stroke={palette.stem} strokeWidth={3.5 - frac * 1} fill="none" strokeLinecap="round" />
      {leaves}
    </>
  );
}

function renderBloom({ stageIdx, totalStages, palette, isReady }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 18 + frac * 66;
  const topY = 122 - stemH;
  const mature = stageIdx === totalStages - 1;
  return (
    <>
      <StemBase stageIdx={stageIdx} totalStages={totalStages} palette={palette} />
      {mature && (
        <g className={isReady ? 'gd-sway' : ''} style={{ transformOrigin: `60px ${topY}px` }}>
          {/* Cánh hoa nhiều lớp */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const r = i % 2 === 0 ? 11 : 8;
            const fill = i % 2 === 0 ? palette.accentLight : palette.accent;
            return (
              <ellipse
                key={deg}
                cx={60}
                cy={topY - 12}
                rx={r}
                ry={5}
                fill={fill}
                stroke={palette.accentDark}
                strokeWidth={0.3}
                opacity={0.9}
                transform={`rotate(${deg} 60 ${topY})`}
              />
            );
          })}
          <circle cx={60} cy={topY} r={9} fill={palette.accentDark} opacity={0.3} />
          <circle cx={60} cy={topY} r={7} fill={palette.accent} stroke="#8A5A0E" strokeWidth={0.8} />
          <circle cx={60} cy={topY} r={3} fill="#FFE08A" />
          {/* Nhị hoa */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(d => (
            <circle key={d} cx={60 + 3.5 * Math.cos(d * Math.PI / 180)} cy={topY + 3.5 * Math.sin(d * Math.PI / 180)} r={1.2} fill="#C97F17" />
          ))}
        </g>
      )}
    </>
  );
}

function renderFruitTree({ stageIdx, totalStages, palette, isReady, noFruit }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 20 + frac * 68;
  const topY = 122 - stemH;
  const canopyR = 12 + frac * 14;
  const showCanopy = stageIdx >= 1;
  const mature = stageIdx === totalStages - 1;
  return (
    <>
      <path d={`M60,122 L${60 - frac * 2},${topY}`} stroke={palette.stem} strokeWidth={4 + frac * 2.5} strokeLinecap="round" />
      {showCanopy && (
        <g className={mature && isReady ? 'gd-sway' : ''} style={{ transformOrigin: `60px ${topY}px` }}>
          {/* Tán lá rậm rạp */}
          <circle cx={60} cy={topY + 2} r={canopyR} fill={palette.leafDark} opacity={0.8} />
          <circle cx={60 - canopyR * 0.35} cy={topY - canopyR * 0.25} r={canopyR * 0.7} fill={palette.leaf} opacity={0.9} />
          <circle cx={60 + canopyR * 0.45} cy={topY - canopyR * 0.15} r={canopyR * 0.65} fill={palette.leaf} opacity={0.9} />
          <circle cx={60} cy={topY - canopyR * 0.3} r={canopyR * 0.5} fill={palette.leaf} opacity={0.7} />
          {mature && !noFruit && (
            <>
              {/* Quả có bóng */}
              {[[-7, 2], [6, 6], [1, -6], [-4, 8], [8, -2]].map(([dx, dy], i) => (
                <g key={i}>
                  <circle cx={60 + dx} cy={topY + 2 + dy} r={4.5} fill={palette.accentDark} opacity={0.3} />
                  <circle cx={60 + dx} cy={topY + dy} r={4.2} fill={palette.accent} stroke={palette.accentDark} strokeWidth={0.6} />
                  <circle cx={60 + dx + 1.5} cy={topY + dy - 1.5} r={1.2} fill="white" opacity={0.25} />
                </g>
              ))}
            </>
          )}
        </g>
      )}
    </>
  );
}

function renderCactus({ stageIdx, totalStages, palette }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const h = 20 + frac * 55;
  const w = 12 + frac * 6;
  const topY = 120 - h;
  const mature = stageIdx === totalStages - 1;
  return (
    <>
      <rect x={60 - w / 2} y={topY} width={w} height={h} rx={w / 2} fill={palette.leaf} stroke={palette.leafDark} strokeWidth={1.2} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={60 - w / 2 + (i * w) / 4} y1={topY + 4} x2={60 - w / 2 + (i * w) / 4} y2={topY + h - 4} stroke={palette.leafDark} strokeWidth={0.7} opacity={0.5} />
      ))}
      {/* Gai nhỏ */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = w / 2 + 2;
        const cx = 60 + r * Math.cos(angle);
        const cy = topY + h * 0.5 + r * 0.4 * Math.sin(angle);
        return <line key={i} x1={cx} y1={cy} x2={cx + 4 * Math.cos(angle)} y2={cy + 4 * Math.sin(angle)} stroke="#9C6B3A" strokeWidth={0.8} opacity={0.6} />;
      })}
      {stageIdx >= 1 && (
        <path d={`M${60 - w / 2},${topY + h * 0.4} q-10,-2 -9,-14`} stroke={palette.leaf} strokeWidth={5} strokeLinecap="round" fill="none" />
      )}
      {stageIdx >= 2 && (
        <path d={`M${60 + w / 2},${topY + h * 0.55} q10,-2 9,-14`} stroke={palette.leaf} strokeWidth={5} strokeLinecap="round" fill="none" />
      )}
      {mature && (
        <g>
          <circle cx={60} cy={topY - 2} r={6} fill={palette.accentDark} opacity={0.2} />
          <circle cx={60} cy={topY - 4} r={5} fill={palette.accent} stroke={palette.accentDark} strokeWidth={0.6} />
          <circle cx={60} cy={topY - 4} r={2} fill={palette.accentLight} />
        </g>
      )}
    </>
  );
}

function renderBamboo({ stageIdx, totalStages, palette }) {
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
            <rect x={60 + s.dx - 3.5} y={topY} width={7} height={h} rx={3.5} fill={palette.stem} />
            {Array.from({ length: joints }).map((_, j) => (
              <line key={j} x1={60 + s.dx - 4} x2={60 + s.dx + 4} y1={topY + (j + 1) * (h / (joints + 1))} y2={topY + (j + 1) * (h / (joints + 1))} stroke={palette.leafDark} strokeWidth={1.2} opacity={0.6} />
            ))}
            {stageIdx >= 1 && (
              <>
                <ellipse cx={60 + s.dx - 7} cy={topY + 4} rx={8} ry={3} fill={palette.leaf} opacity={0.8} transform={`rotate(-30 ${60 + s.dx - 7} ${topY + 4})`} />
                <ellipse cx={60 + s.dx + 7} cy={topY + 9} rx={8} ry={3} fill={palette.leaf} opacity={0.8} transform={`rotate(30 ${60 + s.dx + 7} ${topY + 9})`} />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

function renderVine({ stageIdx, totalStages, palette }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const mature = stageIdx === totalStages - 1;
  const spread = 14 + frac * 14;
  return (
    <>
      <path d={`M60,120 q${-spread},-4 ${-spread - 6},-14`} stroke={palette.stem} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d={`M60,120 q${spread},-6 ${spread + 6},-10`} stroke={palette.stem} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {Array.from({ length: 1 + stageIdx }).map((_, i) => (
        <ellipse key={i} cx={60 - spread + i * 9} cy={112 - (i % 2) * 4} rx={8} ry={4.5} fill={i % 2 ? palette.leaf : palette.leafDark} opacity={0.85} transform={`rotate(${-20 + i * 10} ${60 - spread + i * 9} ${112})`} />
      ))}
      {mature && (
        <g>
          <circle cx={72} cy={112} r={12} fill={palette.accentDark} opacity={0.2} />
          <circle cx={72} cy={112} r={10} fill={palette.accent} stroke={palette.accentDark} strokeWidth={0.8} />
          {[-1, 0, 1].map((k) => (
            <path key={k} d={`M${72 + k * 3.6},100 q${k * 2},11 0,22`} stroke={palette.leafDark} strokeWidth={1.5} fill="none" opacity={0.5} />
          ))}
        </g>
      )}
    </>
  );
}

function renderAura({ stageIdx, totalStages, palette, isReady }) {
  const frac = stageIdx / Math.max(1, totalStages - 1);
  const stemH = 16 + frac * 60;
  const topY = 122 - stemH;
  const mature = stageIdx === totalStages - 1;
  const orbits = Math.min(stageIdx, 3);
  return (
    <>
      <path d={`M60,122 L60,${topY}`} stroke={palette.stem} strokeWidth={2.8} strokeLinecap="round" opacity={0.8} />
      {Array.from({ length: orbits }).map((_, i) => (
        <circle key={i} cx={60 + (i % 2 ? 9 : -9)} cy={topY + 10 + i * 12} r={4} fill={palette.accentLight} className="gd-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {mature && (
        <g className={isReady ? 'gd-pulse' : ''} style={{ transformOrigin: `60px ${topY}px` }}>
          {isReady && (
            <>
              <circle cx={60} cy={topY} r={20} fill={palette.accent} opacity={0.15} />
              <circle cx={60} cy={topY} r={28} fill={palette.accentLight} opacity={0.08} className="gd-pulse" />
            </>
          )}
          <path d={`M60,${topY - 13} L64,${topY - 3} L74,${topY - 3} L66,${topY + 5} L69,${topY + 15} L60,${topY + 8} L51,${topY + 15} L54,${topY + 5} L46,${topY - 3} L56,${topY - 3} Z`}
            fill={palette.accent} stroke={palette.accentDark} strokeWidth={0.6} />
          <circle cx={60} cy={topY} r={4} fill="white" opacity={0.3} />
        </g>
      )}
    </>
  );
}

function PlantArt({ plantId, stageIdx, totalStages, isReady, plantConfig }) {
  const cfg = plantConfig[plantId];
  if (!cfg) return null;
  const { palette, kind, noFruit } = cfg;
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full">
      <defs>
        <radialGradient id={`shadow-${plantId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8C6A42" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8C6A42" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`stem-${plantId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={palette.stem} stopOpacity="0.7" />
          <stop offset="50%" stopColor={palette.stem} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.stem} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="126" rx="34" ry="9" fill="url(#shadow)" />
      <ellipse cx="60" cy="123.5" rx="30" ry="6.5" fill="#8C6A42" opacity="0.6" />
      {kind === 'bloom' && renderBloom({ stageIdx, totalStages, palette, isReady })}
      {kind === 'fruitTree' && renderFruitTree({ stageIdx, totalStages, palette, isReady, noFruit })}
      {kind === 'cactus' && renderCactus({ stageIdx, totalStages, palette })}
      {kind === 'bamboo' && renderBamboo({ stageIdx, totalStages, palette })}
      {kind === 'vine' && renderVine({ stageIdx, totalStages, palette })}
      {kind === 'aura' && renderAura({ stageIdx, totalStages, palette, isReady })}
    </svg>
  );
}

/* ============================================================
   SLOT — phiên bản giao diện đẹp hơn
============================================================ */
function PlantSlot({ slot, displayProgress, remainingMs, showClock, onSelect, onHarvest, onWater, onRemove, onFertilize, hasFertilizer, plantConfig }) {
  const plant = slot.plant;
  if (!plant) {
    return (
      <button
        onClick={() => onSelect(slot.index)}
        className="aspect-square rounded-2xl border-2 border-dashed border-ink/15 bg-white/60 hover:bg-white hover:border-gold/50 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 group overflow-hidden"
      >
        <svg viewBox="0 0 120 140" className="w-full h-full">
          <ellipse cx="60" cy="126" rx="34" ry="9" fill="#B08A5A" opacity="0.25" />
          <ellipse cx="60" cy="123.5" rx="30" ry="6.5" fill="#C4A87A" opacity="0.4" />
          <circle cx="60" cy="80" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/10 group-hover:text-gold/40 transition-colors" />
          <path d="M60,68 L60,92 M48,80 L72,80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-ink/10 group-hover:text-gold/50 transition-colors" />
        </svg>
        <span className="text-[9px] font-mono text-ink/25 group-hover:text-ink/40 -mt-6 relative z-10">Trồng cây</span>
      </button>
    );
  }

  const cfg = plantConfig[plant.plantType];
  const isReady = displayProgress >= 100;
  const stageIdx = isReady ? cfg.stageCount - 1 : Math.min(cfg.stageCount - 1, Math.floor((displayProgress / 100) * (cfg.stageCount - 1)));

  return (
    <div className={`aspect-square rounded-2xl border-2 transition-all duration-300 flex flex-col items-center relative overflow-hidden
      ${isReady ? 'border-green-300 bg-gradient-to-b from-green-50 to-white shadow-lg shadow-green-100/60' : 'border-ink/10 bg-white hover:shadow-md'}`}>
      {isReady && <div className="absolute inset-0 bg-green-400/10 gd-glow-bg pointer-events-none" />}

      <div className="w-full flex-1 min-h-0 relative z-10">
        <PlantArt plantId={plant.plantType} stageIdx={stageIdx} totalStages={cfg.stageCount} isReady={isReady} plantConfig={plantConfig} />
      </div>

      <div className="w-full px-1.5 pb-1 relative z-10 shrink-0">
        <p className="text-[8px] font-mono text-ink/35 text-center truncate leading-tight">{cfg.name}</p>

        {!isReady && (
          <>
            <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden mt-1">
              <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 transition-all duration-1000 ease-linear shadow-inner" style={{ width: `${displayProgress}%` }} />
            </div>
            <p className="text-[8px] font-mono text-ink/40 text-center mt-0.5">
              {showClock ? formatClock(remainingMs) : `${Math.floor(displayProgress)}%`}
            </p>
          </>
        )}

        <div className="flex items-center justify-center gap-1 mt-1">
          {!isReady && (
            <button onClick={(e) => { e.stopPropagation(); onWater(slot.index); }}
              className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors shadow-sm hover:shadow" title="Tưới nước">
              <Icon name="water" className="w-3 h-3" />
            </button>
          )}
          {!isReady && hasFertilizer && (
            <button onClick={(e) => { e.stopPropagation(); onFertilize(slot.index); }}
              className="p-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors shadow-sm hover:shadow" title="Bón phân">
              <Icon name="sparkle" className="w-3 h-3" />
            </button>
          )}
          {isReady && (
            <button onClick={(e) => { e.stopPropagation(); onHarvest(slot.index); }}
              className="p-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all shadow-sm hover:shadow-md" title="Thu hoạch">
              <Icon name="cut" className="w-3 h-3" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onRemove(slot.index); }}
            className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors shadow-sm hover:shadow" title="Xóa cây">
            <Icon name="trash" className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SEED SHOP — giao diện đẹp hơn
============================================================ */
function SeedShop({ userCoins, onSelect, onClose, plantConfig }) {
  const seedList = Object.entries(plantConfig).map(([id, cfg]) => ({ id, ...cfg }));
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden anim-pop shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 shrink-0">
          <div className="flex items-center gap-2">
            <Icon name="bag" className="w-5 h-5 text-gold" />
            <h3 className="font-display text-lg text-ink">Cửa hàng hạt giống</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition"><Icon name="close" className="w-5 h-5 text-ink/50" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-gold/10 to-amber-100/40 border-b border-gold/10 shrink-0">
          <Icon name="coin" className="w-4 h-4" />
          <span className="text-sm font-bold text-gold">{userCoins?.toLocaleString()} Coin</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {seedList.map(seed => {
            const canBuy = (userCoins || 0) >= seed.seedPrice;
            const r = RARITY_STYLES[seed.rarity];
            return (
              <button
                key={seed.id}
                onClick={() => canBuy && onSelect(seed.id)}
                disabled={!canBuy}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-300 text-left
                  ${canBuy ? `border-${seed.rarity === 'legendary' ? 'amber' : seed.rarity === 'epic' ? 'purple' : seed.rarity === 'rare' ? 'blue' : 'gray'}-200 bg-white hover:shadow-xl hover:scale-[1.02] cursor-pointer` : 'border-ink/5 bg-ink/[0.02] opacity-50 cursor-not-allowed'}`}
                style={canBuy ? { boxShadow: `0 0 0 1px ${r.border}40, 0 4px 12px ${r.glow}` } : {}}
              >
                <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-b from-sky-50 to-white border border-ink/5 overflow-hidden">
                  <PlantArt plantId={seed.id} stageIdx={seed.stageCount - 1} totalStages={seed.stageCount} isReady={false} plantConfig={plantConfig} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm text-ink">{seed.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: r.bg, color: r.text }}>{r.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-ink/40">
                    <span className="flex items-center gap-1"><Icon name="clock" className="w-3 h-3" /> {formatTime(seed.growthTime)}</span>
                    <span className="flex items-center gap-1"><Icon name="coin" className="w-3 h-3" /> +{seed.harvestCoin}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-bold text-gold">
                    <Icon name="coin" className="w-3.5 h-3.5" /> {seed.seedPrice}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INVENTORY (KHO ĐỒ) — giao diện đẹp hơn
============================================================ */
function InventoryShop({ userCoins, inventory, onBuy, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden anim-pop shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 shrink-0">
          <div className="flex items-center gap-2">
            <Icon name="backpack" className="w-5 h-5 text-gold" />
            <h3 className="font-display text-lg text-ink">Kho đồ</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition"><Icon name="close" className="w-5 h-5 text-ink/50" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-gold/10 to-amber-100/40 border-b border-gold/10 shrink-0">
          <Icon name="coin" className="w-4 h-4" />
          <span className="text-sm font-bold text-gold">{userCoins?.toLocaleString()} Coin</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p className="text-[10px] font-mono text-ink/35 -mt-1 mb-2">Phân bón dùng để bón trực tiếp cho cây trong vườn. Đồ nâng cấp mua một lần, dùng mãi mãi.</p>
          {Object.entries(ITEM_CONFIG).map(([id, item]) => {
            const owned = inventory[id] || 0;
            const isUpgrade = item.type === 'upgrade';
            const alreadyOwned = isUpgrade && owned > 0;
            const canBuy = !alreadyOwned && (userCoins || 0) >= item.price;
            return (
              <div key={id} className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${alreadyOwned ? 'border-green-200 bg-green-50/60 shadow-sm' : 'border-ink/10 bg-white hover:shadow-md'}`}>
                <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${item.color}22` }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm text-ink">{item.name}</span>
                    {!isUpgrade && owned > 0 && <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-ink/5 text-ink/50">x{owned}</span>}
                  </div>
                  <p className="text-[10px] text-ink/40 mt-0.5 leading-snug">{item.desc}</p>
                </div>
                <button
                  onClick={() => canBuy && onBuy(id)}
                  disabled={!canBuy}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors
                    ${alreadyOwned ? 'bg-green-100 text-green-600 cursor-default' : canBuy ? 'bg-gold text-white hover:bg-gold/80 shadow-sm hover:shadow' : 'bg-ink/5 text-ink/30 cursor-not-allowed'}`}
                >
                  {alreadyOwned ? '✅ Đã có' : `${item.price} 💰`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HarvestModal({ plantType, onConfirm, onClose, plantConfig }) {
  if (!plantType) return null;
  const cfg = plantConfig[plantType];
  if (!cfg) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-xs text-center anim-pop shadow-2xl">
        <div className="w-24 h-24 mx-auto mb-2">
          <PlantArt plantId={plantType} stageIdx={cfg.stageCount - 1} totalStages={cfg.stageCount} isReady plantConfig={plantConfig} />
        </div>
        <h3 className="font-display text-lg text-ink mb-1">🎉 Thu hoạch thành công!</h3>
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gold mb-4">
          <Icon name="coin" className="w-6 h-6" /> +{cfg.harvestCoin}
        </div>
        <button onClick={onConfirm} className="w-full py-2.5 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl font-semibold hover:from-gold/90 hover:to-amber-500/90 transition shadow-md">
          Tuyệt vời!
        </button>
      </div>
    </div>
  );
}

function QuizModal({ onEarnWater, onClose }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const pickQuestion = () => {
    const idx = Math.floor(Math.random() * MATH_QUESTIONS.length);
    setQuestion(MATH_QUESTIONS[idx]);
    setSelected(null);
    setResult(null);
    setLoading(false);
  };

  useEffect(() => { pickQuestion(); }, []);

  const handleSubmit = () => {
    if (selected === null || !question) return;
    const correct = selected === question.answer;
    setResult(correct);
    if (correct) {
      setTimeout(() => onEarnWater(1), 800);
    }
  };

  const handleNext = () => {
    pickQuestion();
  };

  if (loading || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm anim-pop shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="water" className="w-5 h-5 text-blue-500" />
            <h3 className="font-display text-base text-ink">💧 Trả lời để nhận nước</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-ink/5 transition">
            <Icon name="close" className="w-4 h-4 text-ink/40" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4 text-center border border-blue-100">
          <p className="text-lg font-bold text-ink">{question.q}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {question.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = result !== null && i === question.answer;
            const isWrong = result !== null && isSelected && i !== question.answer;
            return (
              <button
                key={i}
                onClick={() => result === null && setSelected(i)}
                disabled={result !== null}
                className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all
                  ${isCorrect ? 'border-green-400 bg-green-50 text-green-700 shadow-md' :
                    isWrong ? 'border-red-400 bg-red-50 text-red-600' :
                      isSelected ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm' :
                        'border-ink/10 bg-white text-ink hover:border-blue-300 hover:bg-blue-50/50'}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {result === null ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="w-full py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-40 shadow-md"
          >
            Trả lời
          </button>
        ) : (
          <div className="text-center">
            {result ? (
              <div className="mb-2">
                <p className="text-green-600 font-bold text-sm">✅ Đúng rồi! +1 💧</p>
              </div>
            ) : (
              <div className="mb-2">
                <p className="text-red-500 font-semibold text-sm">❌ Sai rồi! Đáp án: {question.options[question.answer]}</p>
              </div>
            )}
            <button onClick={handleNext}
              className="w-full py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition shadow-md">
              Câu tiếp theo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE — giao diện tổng thể đẹp hơn
============================================================ */
export default function GardenPage({ userAuth, onBack }) {
  const [garden, setGarden] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [error, setError] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [harvestResult, setHarvestResult] = useState(null);
  const [tick, setTick] = useState(0);
  const [inventory, setInventory] = useState(() => loadInventory(userAuth?.user?.id));
  const [wateringSlot, setWateringSlot] = useState(null);
  const [plantConfig, setPlantConfig] = useState(FALLBACK_PLANT_CONFIG);
  const [waterDrops, setWaterDrops] = useState(() => loadWaterDrops(userAuth?.user?.id));
  const [showQuiz, setShowQuiz] = useState(false);
  const gardenGridRef = useRef(null);

  const syncRef = useRef({});

  const userId = userAuth?.user?.id;

  useEffect(() => { setInventory(loadInventory(userId)); }, [userId]);
  const persistInventory = useCallback((next) => { setInventory(next); saveInventory(userId, next); }, [userId]);

  const stampSync = (slotIndex, progress) => {
    syncRef.current[slotIndex] = { progress, at: Date.now() };
  };

  const load = useCallback(async () => {
    try {
      setError(null);
      const [gardenData, plantTypesRes] = await Promise.all([
        gardenService.get(),
        gardenService.getPlantTypes().catch(() => null),
      ]);
      if (gardenData) {
        setGarden(gardenData);
        (gardenData.slots || []).forEach((s) => {
          if (s.plant) stampSync(s.index, s.plant.isReady ? 100 : (s.plant.progress || 0));
          else delete syncRef.current[s.index];
        });
      }
      if (plantTypesRes?.types) {
        setPlantConfig(buildPlantConfig(plantTypesRes.types));
      }

      const auth = JSON.parse(localStorage.getItem('edu_games_auth') || '{}');
      if (auth?.token) {
        const r = await fetch(`${API_BASE}/auth/me/coins`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }).then(r => r.json());
        if (r?.status) setUserCoins(r.data.coins || 0);
      }
    } catch (e) {
      setError(e.message || 'Lỗi tải khu vườn');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const slots = garden?.slots || [];

  const getDisplay = useCallback((slot) => {
    const plant = slot.plant;
    if (!plant) return { progress: 0, remainingMs: 0 };
    const cfg = plantConfig[plant.plantType];
    if (!cfg) return { progress: plant.progress || 0, remainingMs: 0 };
    const sync = syncRef.current[slot.index] || { progress: plant.progress || 0, at: Date.now() };
    if (plant.isReady || sync.progress >= 100) return { progress: 100, remainingMs: 0 };
    const elapsed = Date.now() - sync.at;
    const grown = (elapsed / cfg.growthTime) * 100;
    const progress = Math.min(100, sync.progress + grown);
    const remainingMs = Math.max(0, cfg.growthTime * (1 - progress / 100));
    return { progress, remainingMs };
  }, [plantConfig]);

  const handleSlotSelect = (index) => {
    setSelectedSlot(index);
    setShowShop(true);
  };

  const handlePlant = async (plantType) => {
    if (selectedSlot === null) return;
    const index = selectedSlot;
    const cfg = plantConfig[plantType];
    setShowShop(false);
    setSelectedSlot(null);

    const prevGarden = garden;
    const prevCoins = userCoins;
    setGarden((g) => {
      if (!g) return g;
      const nextSlots = g.slots.map((s) => (s.index === index ? { ...s, plant: { plantType, progress: 0, isReady: false } } : s));
      return { ...g, slots: nextSlots };
    });
    stampSync(index, 0);
    setUserCoins((c) => Math.max(0, c - cfg.seedPrice));

    try {
      const res = await gardenService.plant(index, plantType);
      if (!res?.success) throw new Error(res?.message || 'Không thể trồng cây');
      load();
    } catch (e) {
      setGarden(prevGarden);
      setUserCoins(prevCoins);
      delete syncRef.current[index];
      alert(e.message || 'Lỗi trồng cây');
    }
  };

  const handleHarvest = async (index) => {
    const slot = slots.find((s) => s.index === index);
    const plantType = slot?.plant?.plantType;
    const prevGarden = garden;

    setGarden((g) => ({ ...g, slots: g.slots.map((s) => (s.index === index ? { ...s, plant: null } : s)) }));
    delete syncRef.current[index];
    if (plantType) setHarvestResult(plantType);

    try {
      const res = await gardenService.harvest(index);
      if (!res?.success) throw new Error(res?.message || 'Không thể thu hoạch');
      load();
    } catch (e) {
      setGarden(prevGarden);
      setHarvestResult(null);
      alert(e.message || 'Lỗi thu hoạch');
    }
  };

  const handleWater = async (index) => {
    if (waterDrops <= 0) {
      setShowQuiz(true);
      return;
    }
    const slot = slots.find((s) => s.index === index);
    if (!slot?.plant) return;
    const { progress } = getDisplay(slot);
    const boost = inventory.golden_can > 0 ? 20 : 10;
    const nextProgress = Math.min(100, progress + boost);
    stampSync(index, nextProgress);
    setGarden((g) => ({ ...g, slots: g.slots.map((s) => (s.index === index ? { ...s, plant: { ...s.plant, progress: nextProgress, isReady: nextProgress >= 100 } } : s)) }));

    const newDrops = waterDrops - 1;
    setWaterDrops(newDrops);
    saveWaterDrops(userId, newDrops);

    setWateringSlot(index);
    setTimeout(() => setWateringSlot(null), 2000);

    try {
      await gardenService.water(index);
    } catch (e) {
      alert(e.message || 'Lỗi tưới nước');
    }
  };

  const handleEarnWater = (amount) => {
    const newDrops = waterDrops + amount;
    setWaterDrops(newDrops);
    saveWaterDrops(userId, newDrops);
    setShowQuiz(false);
  };

  const handleFertilize = (index) => {
    const order = ['miracle_fertilizer', 'premium_fertilizer', 'basic_fertilizer'];
    const itemId = order.find((id) => inventory[id] > 0);
    if (!itemId) return;
    const slot = slots.find((s) => s.index === index);
    if (!slot?.plant) return;
    const { progress } = getDisplay(slot);
    const boost = ITEM_CONFIG[itemId].boost;
    const nextProgress = Math.min(100, progress + boost);
    stampSync(index, nextProgress);
    setGarden((g) => ({ ...g, slots: g.slots.map((s) => (s.index === index ? { ...s, plant: { ...s.plant, progress: nextProgress, isReady: nextProgress >= 100 } } : s)) }));
    persistInventory({ ...inventory, [itemId]: inventory[itemId] - 1 });
  };

  const handleRemove = async (index) => {
    if (!confirm('Bạn muốn xóa cây này?')) return;
    const prevGarden = garden;
    setGarden((g) => ({ ...g, slots: g.slots.map((s) => (s.index === index ? { ...s, plant: null } : s)) }));
    delete syncRef.current[index];
    try {
      await gardenService.remove(index);
    } catch (e) {
      setGarden(prevGarden);
      alert(e.message || 'Lỗi xóa cây');
    }
  };

  const handleBuyItem = (itemId) => {
    const item = ITEM_CONFIG[itemId];
    if ((userCoins || 0) < item.price) return;
    setUserCoins((c) => c - item.price);
    persistInventory({ ...inventory, [itemId]: (inventory[itemId] || 0) + 1 });
  };

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3"><PlantArt plantId="sunflower" stageIdx={0} totalStages={3} isReady={false} plantConfig={plantConfig} /></div>
          <h2 className="font-display text-lg text-ink mb-2">🌱 Chưa đăng nhập</h2>
          <p className="text-sm text-ink/50 mb-4">Bạn cần đăng nhập để xem khu vườn</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition">Về trang chủ</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button onClick={load} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition">Thử lại</button>
        </div>
      </div>
    );
  }

  const plantedCount = slots.filter(s => s.plant).length;
  const readyCount = slots.filter(s => (s.plant ? getDisplay(s).progress >= 100 : false)).length;
  const hasAnyFertilizer = inventory.basic_fertilizer > 0 || inventory.premium_fertilizer > 0 || inventory.miracle_fertilizer > 0;

  return (
    <div className="flex-1 px-4 py-4 w-full space-y-4">
      <style>{`
        @keyframes gd-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        .gd-sway { animation: gd-sway 3.2s ease-in-out infinite; }
        @keyframes gd-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.08); } }
        .gd-pulse { animation: gd-pulse 2s ease-in-out infinite; }
        @keyframes gd-twinkle { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .gd-twinkle { animation: gd-twinkle 1.4s ease-in-out infinite; }
        @keyframes gd-glow-bg { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        .gd-glow-bg { animation: gd-glow-bg 2.2s ease-in-out infinite; }
        @keyframes gd-idle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .gd-gardener-idle { animation: gd-idle 2.4s ease-in-out infinite; }
        @keyframes gd-water-bounce { 0%,100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-6px) rotate(-4deg); } 75% { transform: translateY(-3px) rotate(4deg); } }
        .gd-gardener-water { animation: gd-water-bounce 0.6s ease-in-out 3; }
        @keyframes anim-pop { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .anim-pop { animation: anim-pop 0.25s ease-out forwards; }
      `}</style>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink transition">
          <Icon name="back" className="w-4 h-4" /> Trang chủ
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowInventory(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/60 text-sm font-semibold transition shadow-sm">
            <Icon name="backpack" className="w-4 h-4" /> Kho đồ
          </button>
          <button onClick={() => setShowQuiz(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-600 text-sm font-semibold transition shadow-sm">
            <Icon name="water" className="w-4 h-4" /> {waterDrops}
          </button>
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold/10 to-amber-100/40 text-gold text-sm font-bold shadow-sm">
            <Icon name="coin" className="w-4 h-4" /> {userCoins.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-48 shrink-0 flex flex-col items-center gap-3">
          <div className="w-full rounded-2xl p-4 flex flex-col items-center gap-2 shadow-lg" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <GardenerAvatar
              userAuth={userAuth}
              size={120}
              watering={wateringSlot !== null}
              wateringSlotIndex={wateringSlot}
              gardenRef={gardenGridRef}
            />
            <div className="text-center">
              <h1 className="font-display text-sm text-ink">🌿 Khu vườn</h1>
              <p className="text-[10px] text-ink/40 mt-0.5">
                {plantedCount}/{slots.length} ô • {readyCount} sẵn sàng
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-4 shadow-lg" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          {slots.length === 0 && !error ? (
            <div className="text-center py-10 text-ink/40 animate-pulse">Đang tải...</div>
          ) : (
            <div ref={gardenGridRef} className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.map((slot) => {
                const { progress, remainingMs } = getDisplay(slot);
                return (
                  <div key={slot.index} data-slot-index={slot.index}>
                    <PlantSlot
                      slot={slot}
                      displayProgress={progress}
                      remainingMs={remainingMs}
                      showClock={inventory.magic_lens > 0}
                      hasFertilizer={hasAnyFertilizer}
                      onSelect={handleSlotSelect}
                      onHarvest={handleHarvest}
                      onWater={handleWater}
                      onRemove={handleRemove}
                      onFertilize={handleFertilize}
                      plantConfig={plantConfig}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-ink/30 font-mono">
            <Icon name="sparkle" className="w-3 h-3" />
            <span>Nhấn 💧 ở trên để trả lời câu hỏi nhận nước</span>
          </div>
        </div>
      </div>

      {showShop && (
        <SeedShop
          userCoins={userCoins}
          onSelect={handlePlant}
          onClose={() => { setShowShop(false); setSelectedSlot(null); }}
          plantConfig={plantConfig}
        />
      )}

      {showInventory && (
        <InventoryShop
          userCoins={userCoins}
          inventory={inventory}
          onBuy={handleBuyItem}
          onClose={() => setShowInventory(false)}
        />
      )}

      {harvestResult && (
        <HarvestModal
          plantType={harvestResult}
          onConfirm={() => setHarvestResult(null)}
          onClose={() => setHarvestResult(null)}
          plantConfig={plantConfig}
        />
      )}

      {showQuiz && (
        <QuizModal
          onEarnWater={handleEarnWater}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}