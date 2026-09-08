import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { gardenService, API_BASE } from '../../services/api.js';
import { Icon, PlantArt } from '../../components/garden/PlantArt.jsx';

/* ============================================================
   FARM MAP — like Farmgame.html BLUEPRINT
============================================================ */
const TILE = 56;
const MAP_COLS = 12;
const MAP_ROWS = 9;

// tile types: G=grass, P=path, C=crop plot, T=tree, B=bush, R=rock, W=water, L=flower
const FARM_MAP = [
  'T T . . . . . . . . T T',
  'T . . B . . . . . B . T',
  'T . . . . W . . . . . T',
  '. . . C C C C C C . . .',
  '. . . C C C C C C . . .',
  '. . . . . . . . . . . .',
  '. . . . . . . . . . . .',
  '. . B . . . . . . B . .',
  '. . . . . . . . . . . .',
];

// parse map into structured tiles
function parseMap() {
  const tiles = [];
  const plots = [];
  const decorations = [];
  const rows = FARM_MAP.map(r => r.split(' '));
  for (let y = 0; y < MAP_ROWS; y++) {
    tiles[y] = [];
    for (let x = 0; x < MAP_COLS; x++) {
      const ch = rows[y]?.[x] || '.';
      let type = 'grass';
      if (ch === 'P') type = 'path';
      else if (ch === 'C') type = 'plot';
      else if (ch === 'T') type = 'tree';
      else if (ch === 'B') type = 'bush';
      else if (ch === 'R') type = 'rock';
      else if (ch === 'W') type = 'water';
      else if (ch === 'L') type = 'flower';
      tiles[y][x] = type;
      if (type === 'plot') plots.push({ x, y });
      if (type === 'tree') decorations.push({ x, y, emoji: '🌳' });
      if (type === 'bush') decorations.push({ x, y, emoji: '🌿' });
      if (type === 'rock') decorations.push({ x, y, emoji: '🪨' });
      if (type === 'water') decorations.push({ x, y, emoji: '💧' });
    }
  }
  return { tiles, plots, decorations };
}

const { tiles: FARM_TILES, plots: FARM_PLOTS, decorations: FARM_DECOS } = parseMap();

function isWalkable(x, y) {
  if (x < 0 || y < 0 || x >= MAP_COLS || y >= MAP_ROWS) return false;
  const t = FARM_TILES[y]?.[x];
  return t === 'grass' || t === 'path' || t === 'plot';
}

const PLAYER_START = { x: 5, y: 7 };

/* ============================================================
   CONSTANTS
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
  common: { bg: '#EEF0EC', text: '#6B7264', label: 'Thường', border: '#D0D5CC' },
  rare: { bg: '#E4EEFA', text: '#3D6FA8', label: 'Hiếm', border: '#A8C8E8' },
  epic: { bg: '#F0E6FA', text: '#7A4EA8', label: 'Sử thi', border: '#C9A8E0' },
  legendary: { bg: '#FCEFD6', text: '#B8791A', label: 'Huyền thoại', border: '#F0C87A' },
};

const ITEM_CONFIG = {
  basic_fertilizer: { name: 'Phân bón thường', type: 'consumable', price: 20, boost: 15, desc: 'Thúc cây lớn nhanh thêm 15%.', icon: '🌱' },
  premium_fertilizer: { name: 'Phân bón cao cấp', type: 'consumable', price: 55, boost: 40, desc: 'Thúc cây lớn nhanh thêm 40%.', icon: '🌟' },
  miracle_fertilizer: { name: 'Phân bón thần kỳ', type: 'consumable', price: 150, boost: 100, desc: 'Giúp cây chín ngay lập tức.', icon: '✨' },
  golden_can: { name: 'Bình tưới vàng', type: 'upgrade', price: 300, desc: 'Tưới nước tăng 20% thay vì 10%.', icon: '🪙' },
  magic_lens: { name: 'Kính lúp phép thuật', type: 'upgrade', price: 150, desc: 'Hiện đồng hồ đếm ngược trên cây.', icon: '🔍' },
};

const DEFAULT_INVENTORY = { basic_fertilizer: 0, premium_fertilizer: 0, miracle_fertilizer: 0, golden_can: 0, magic_lens: 0 };

const MATH_QUESTIONS = [
  { q: '12 + 8 = ?', options: ['18', '20', '22', '19'], answer: 1 },
  { q: '15 - 7 = ?', options: ['9', '8', '7', '6'], answer: 1 },
  { q: '6 × 7 = ?', options: ['42', '48', '36', '44'], answer: 0 },
  { q: '56 ÷ 8 = ?', options: ['6', '8', '7', '9'], answer: 2 },
  { q: '25 + 37 = ?', options: ['60', '62', '58', '64'], answer: 1 },
  { q: '81 ÷ 9 = ?', options: ['8', '9', '7', '10'], answer: 1 },
  { q: '14 × 3 = ?', options: ['40', '42', '38', '44'], answer: 1 },
  { q: '100 - 45 = ?', options: ['50', '55', '60', '45'], answer: 1 },
  { q: '9 × 9 = ?', options: ['81', '72', '90', '89'], answer: 0 },
  { q: '72 ÷ 6 = ?', options: ['11', '13', '12', '14'], answer: 2 },
  { q: '38 + 29 = ?', options: ['65', '67', '69', '63'], answer: 1 },
  { q: '144 ÷ 12 = ?', options: ['11', '12', '13', '14'], answer: 1 },
];

/* ============================================================
   HELPERS
============================================================ */
function buildPlantConfig(apiTypes) {
  if (!apiTypes || apiTypes.length === 0) return FALLBACK_PLANT_CONFIG;
  const config = {};
  for (const t of apiTypes) {
    config[t.id] = {
      name: t.name, kind: t.kind || 'bloom', stageCount: t.stages || 3,
      growthTime: t.growthTime || 300000, harvestCoin: t.harvestCoin || 10,
      seedPrice: t.seedPrice || 5, rarity: t.rarity || 'common',
      palette: t.palette || FALLBACK_PLANT_CONFIG.sunflower.palette,
    };
  }
  return config;
}

function loadWaterDrops(userId) {
  try { const r = localStorage.getItem(`garden_water_${userId || 'guest'}`); return r ? Number(r) : 5; } catch { return 5; }
}
function saveWaterDrops(userId, count) {
  try { localStorage.setItem(`garden_water_${userId || 'guest'}`, String(count)); } catch {}
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  if (ms <= 0) return 'Sẵn sàng!';
  return `${m}p ${s % 60}s`;
}

function formatClock(ms) {
  if (ms <= 0) return '00:00';
  const t = Math.floor(ms / 1000), h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  return h > 0 ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ============================================================
   FARM TILE — renders a single grid cell
============================================================ */
function FarmTile({ x, y, type, plant, progress, isReady, stageIdx, cfg, showClock, remainingMs, isFacing, fertilizing, onInteract }) {
  const isPlot = type === 'plot';
  const isTree = type === 'tree';
  const isBush = type === 'bush';
  const isWater = type === 'water';

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-100
        ${isFacing ? 'ring-2 ring-[#ffc94a] ring-offset-1' : ''}
        ${fertilizing && isPlot && plant && !isReady ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}
      style={{ width: TILE, height: TILE }}
    >
      {/* Tile background */}
      <div className={`absolute inset-0 rounded-md border border-[#40301d]/20
        ${isPlot ? 'bg-[#6d4c33]' : isTree ? 'bg-[#83c04a]' : isBush ? 'bg-[#83c04a]' : isWater ? 'bg-[#5aa7c9]' : 'bg-[#8fc94e]'}`}
        style={isPlot ? { border: '2px solid #4a3220' } : {}}
      />

      {/* Decorations */}
      {isTree && <span className="text-2xl relative z-10 select-none" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>🌳</span>}
      {isBush && <span className="text-lg relative z-10 select-none">🌿</span>}
      {isWater && <span className="text-lg relative z-10 select-none">💧</span>}

      {/* Crop plot */}
      {isPlot && !plant && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full cursor-pointer" onClick={onInteract}>
          <div className="text-[8px] text-white/40 font-bold">🌱</div>
          <div className="w-8 h-0.5 bg-[#4a3220]/40 rounded my-0.5" />
          <div className="w-6 h-0.5 bg-[#4a3220]/30 rounded" />
        </div>
      )}

      {/* Plant on plot */}
      {isPlot && plant && cfg && (
        <div className="relative z-10 w-full h-full" onClick={onInteract}>
          <PlantArt plantId={plant.plantType} stageIdx={stageIdx} totalStages={cfg.stageCount} isReady={isReady} plantConfig={FALLBACK_PLANT_CONFIG} />
          <div className="absolute bottom-0 left-0 right-0 px-0.5 pb-0.5">
            <div className="text-[7px] font-bold text-white/60 text-center truncate">{cfg.name}</div>
            {!isReady ? (
              <div className="w-full bg-[#4a3220] rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#4c8c3a] rounded-full transition-all duration-500" style={{ width: `${Math.max(2, progress)}%` }} />
              </div>
            ) : (
              <div className="text-[7px] font-bold text-[#b9e88a] text-center">✅</div>
            )}
            {!isReady && showClock && remainingMs > 0 && (
              <div className="text-[6px] font-mono text-white/30 text-center">{formatClock(remainingMs)}</div>
            )}
          </div>
        </div>
      )}

      {/* Grass tuft decoration */}
      {!isPlot && !isTree && !isBush && !isWater && (x + y) % 4 === 0 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] opacity-40 select-none">🌱</div>
      )}
    </div>
  );
}

/* ============================================================
   PLAYER — movable avatar
============================================================ */
function Player({ x, y, dir, moving, bobOffset }) {
  const flipX = dir === 'left';
  return (
    <div
      className="absolute z-30 pointer-events-none transition-none"
      style={{
        width: TILE,
        height: TILE,
        left: x * TILE,
        top: y * TILE - bobOffset,
        transform: flipX ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* Shadow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full" />
      {/* Emoji */}
      <div className="absolute inset-0 flex items-center justify-center text-3xl select-none" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
        🧑‍🌾
      </div>
      {/* Direction indicator */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#ffc94a] rounded-full border border-[#40301d] shadow-sm" />
    </div>
  );
}

/* ============================================================
   SEED SHOP MODAL
============================================================ */
function SeedShop({ userCoins, onSelect, onClose, plantConfig, plotIndex }) {
  const seedList = Object.entries(plantConfig).map(([id, cfg]) => ({ id, ...cfg }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1c2410]/60" />
      <div className="relative bg-[#fff6e2] border-[4px] border-[#40301d] rounded-[22px] w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden anim-pop"
        style={{ boxShadow: '0 24px 40px -10px rgba(0,0,0,0.45)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b-[3px] border-[#40301d] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌾</span>
            <h3 className="font-bold text-lg text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Cửa hàng hạt giống</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-[#40301d] bg-[#fff6e2] hover:bg-[#fdecc8] text-[#6b5540] text-sm" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>✕</button>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 bg-[#ffc94a]/20 border-b-[3px] border-[#40301d] shrink-0">
          <div className="w-5 h-5 rounded-full bg-[#ffc94a] border-2 border-[#40301d] flex items-center justify-center text-[10px]">🌾</div>
          <span className="text-sm font-bold text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{userCoins?.toLocaleString()} Coin</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {seedList.map(seed => {
            const canBuy = (userCoins || 0) >= seed.seedPrice;
            const r = RARITY_STYLES[seed.rarity];
            return (
              <button key={seed.id} onClick={() => canBuy && onSelect(seed.id, plotIndex)} disabled={!canBuy}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-[3px] border-[#40301d] transition-all text-left
                  ${canBuy ? 'bg-white hover:translate-y-[-1px] cursor-pointer' : 'bg-[#e8e0d0] opacity-50 cursor-not-allowed'}`}
                style={{ boxShadow: canBuy ? '0 3px 0 rgba(64,48,29,0.35)' : 'none' }}>
                <div className="w-11 h-11 shrink-0 rounded-lg bg-[#eaf7d8] border-2 border-[#40301d] overflow-hidden">
                  <PlantArt plantId={seed.id} stageIdx={seed.stageCount - 1} totalStages={seed.stageCount} isReady={false} plantConfig={plantConfig} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{seed.name}</span>
                    <span className="px-1 py-0.5 rounded text-[8px] font-bold border border-[#40301d]" style={{ background: r.bg, color: r.text }}>{r.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold text-[#6b5540]">
                    <span>⏰ {formatTime(seed.growthTime)}</span>
                    <span>🌾 +{seed.harvestCoin}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-bold text-[#8a6a10]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    <span className="w-4 h-4 rounded-full bg-[#ffc94a] border border-[#40301d] flex items-center justify-center text-[9px]">🌾</span>{seed.seedPrice}
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
   INVENTORY SHOP MODAL
============================================================ */
function InventoryShop({ userCoins, inventory, onBuy, onUse, onSelectFertilizer, onClose }) {
  const ownedEntries = Object.entries(ITEM_CONFIG).filter(([id]) => (inventory[id] || 0) > 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1c2410]/60" />
      <div className="relative bg-[#fff6e2] border-[4px] border-[#40301d] rounded-[22px] w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden anim-pop"
        style={{ boxShadow: '0 24px 40px -10px rgba(0,0,0,0.45)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b-[3px] border-[#40301d] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <h3 className="font-bold text-lg text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Kho đồ</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-[#40301d] bg-[#fff6e2] hover:bg-[#fdecc8] text-[#6b5540] text-sm" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>✕</button>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 bg-[#ffc94a]/20 border-b-[3px] border-[#40301d] shrink-0">
          <div className="w-5 h-5 rounded-full bg-[#ffc94a] border-2 border-[#40301d] flex items-center justify-center text-[10px]">🌾</div>
          <span className="text-sm font-bold text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{userCoins?.toLocaleString()} Coin</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {ownedEntries.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-[#6b5540] mb-1.5">Sở hữu</div>
              <div className="space-y-1.5">
                {ownedEntries.map(([id, item]) => {
                  const owned = inventory[id] || 0;
                  const isUpgrade = item.type === 'upgrade';
                  return (
                    <div key={id} className="flex items-center gap-2.5 p-2 rounded-xl border-[3px] border-[#4c8c3a] bg-[#b9e88a]/30" style={{ boxShadow: '0 3px 0 #2f5a24' }}>
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{item.name}</span>
                          <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-[#4c8c3a] text-white border border-[#2f5a24]">x{owned}</span>
                        </div>
                      </div>
                      {isUpgrade ? (
                        <button onClick={() => onUse(id)} className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ffc94a] text-[#40301d] border-[3px] border-[#40301d]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>Dùng</button>
                      ) : (
                        <button onClick={() => onSelectFertilizer(id)} className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#fff6e2] text-[#8a6a10] border-[3px] border-[#40301d]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>Bón</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <div className="text-[10px] font-bold uppercase text-[#6b5540] mb-1.5">Mua sắm</div>
            <div className="space-y-2">
              {Object.entries(ITEM_CONFIG).map(([id, item]) => {
                const owned = inventory[id] || 0;
                const isUpgrade = item.type === 'upgrade';
                const alreadyOwned = isUpgrade && owned > 0;
                const canBuy = !alreadyOwned && (userCoins || 0) >= item.price;
                return (
                  <div key={id} className={`flex items-center gap-2.5 p-2 rounded-xl border-[3px] border-[#40301d] ${alreadyOwned ? 'bg-[#b9e88a]/30 border-[#4c8c3a]' : 'bg-white'}`}
                    style={{ boxShadow: alreadyOwned ? '0 3px 0 #2f5a24' : '0 3px 0 rgba(64,48,29,0.35)' }}>
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{item.name}</span>
                      <p className="text-[9px] text-[#6b5540]">{item.desc}</p>
                    </div>
                    <button onClick={() => canBuy && onBuy(id)} disabled={!canBuy}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold border-[3px] border-[#40301d]
                        ${alreadyOwned ? 'bg-[#b9e88a] text-[#2f5a24] cursor-default' : canBuy ? 'bg-[#ffc94a] text-[#40301d]' : 'bg-[#e8e0d0] text-[#6b5540] cursor-not-allowed opacity-50'}`}
                      style={{ boxShadow: canBuy ? '0 3px 0 rgba(64,48,29,0.35)' : 'none' }}>
                      {alreadyOwned ? '✅' : `${item.price}🌾`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HARVEST MODAL
============================================================ */
function HarvestModal({ plantType, onConfirm, onClose, plantConfig }) {
  if (!plantType) return null;
  const cfg = plantConfig[plantType];
  if (!cfg) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1c2410]/60" />
      <div className="relative bg-[#fff6e2] border-[4px] border-[#40301d] rounded-[22px] w-full max-w-xs text-center p-5 anim-pop"
        style={{ boxShadow: '0 24px 40px -10px rgba(0,0,0,0.45)' }} onClick={e => e.stopPropagation()}>
        <div className="w-20 h-20 mx-auto mb-2">
          <PlantArt plantId={plantType} stageIdx={cfg.stageCount - 1} totalStages={cfg.stageCount} isReady plantConfig={plantConfig} />
        </div>
        <h3 className="font-bold text-lg text-[#40301d] mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>🎉 Thu hoạch!</h3>
        <div className="flex items-center justify-center gap-2 text-xl font-bold text-[#8a6a10] mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          🌾 +{cfg.harvestCoin}
        </div>
        <button onClick={onConfirm} className="w-full py-2.5 bg-[#4c8c3a] text-white rounded-xl font-bold border-[3px] border-[#40301d] hover:bg-[#2f5a24] transition" style={{ boxShadow: '0 4px 0 #2f5a24' }}>
          Tuyệt vời!
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   QUIZ MODAL
============================================================ */
function QuizModal({ onEarnWater, onClose }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const pickQuestion = () => {
    const idx = Math.floor(Math.random() * MATH_QUESTIONS.length);
    setQuestion(MATH_QUESTIONS[idx]);
    setSelected(null);
    setResult(null);
  };

  useEffect(() => { pickQuestion(); }, []);

  const handleSubmit = () => {
    if (selected === null || !question) return;
    const correct = selected === question.answer;
    setResult(correct);
    if (correct) setTimeout(() => onEarnWater(1), 800);
  };

  if (!question) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1c2410]/60" />
      <div className="relative bg-[#fff6e2] border-[4px] border-[#40301d] rounded-[22px] w-full max-w-sm p-5 anim-pop"
        style={{ boxShadow: '0 24px 40px -10px rgba(0,0,0,0.45)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💧</span>
            <h3 className="font-bold text-base text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Trả lời để nhận nước</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center border-[3px] border-[#40301d] bg-[#fff6e2] text-[#6b5540] text-xs" style={{ boxShadow: '0 2px 0 rgba(64,48,29,0.35)' }}>✕</button>
        </div>
        <div className="bg-[#eaf7d8] rounded-xl p-3 mb-3 text-center border-[3px] border-[#40301d]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>
          <p className="text-lg font-bold text-[#40301d]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{question.q}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {question.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = result !== null && i === question.answer;
            const isWrong = result !== null && isSelected && i !== question.answer;
            return (
              <button key={i} onClick={() => result === null && setSelected(i)} disabled={result !== null}
                className={`py-2.5 rounded-xl border-[3px] border-[#40301d] text-sm font-bold transition-all
                  ${isCorrect ? 'bg-[#b9e88a] border-[#2f5a24]' : isWrong ? 'bg-[#f3a6a0] border-[#8c2f27]' : isSelected ? 'bg-[#ffc94a]' : 'bg-white hover:translate-y-[-1px]'}`}
                style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>
                {opt}
              </button>
            );
          })}
        </div>
        {result === null ? (
          <button onClick={handleSubmit} disabled={selected === null}
            className="w-full py-2.5 bg-[#5aa7c9] text-white rounded-xl font-bold border-[3px] border-[#40301d] disabled:opacity-40"
            style={{ boxShadow: '0 4px 0 #2a5a6e' }}>Trả lời</button>
        ) : (
          <div className="text-center">
            <p className={`font-bold text-sm mb-2 ${result ? 'text-[#2f5a24]' : 'text-[#8c2f27]'}`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              {result ? '✅ Đúng rồi! +1 💧' : `❌ Sai! Đáp án: ${question.options[question.answer]}`}
            </p>
            <button onClick={pickQuestion} className="w-full py-2.5 bg-[#5aa7c9] text-white rounded-xl font-bold border-[3px] border-[#40301d]" style={{ boxShadow: '0 4px 0 #2a5a6e' }}>Câu tiếp</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TOAST
============================================================ */
function FarmToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose?.(), 2200);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full border-[3px] border-[#40301d] max-w-[86vw] text-center whitespace-nowrap overflow-hidden text-ellipsis anim-pop"
      style={{ fontFamily: "'Baloo 2', sans-serif", background: '#40301d', color: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.3)' }}>
      {message}
    </div>
  );
}

/* ============================================================
   CONFIRM MODAL
============================================================ */
function FarmConfirm({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-[#1c2410]/60" />
      <div className="relative bg-[#fff6e2] border-[4px] border-[#40301d] rounded-[22px] w-full max-w-xs text-center p-5 anim-pop"
        style={{ boxShadow: '0 24px 40px -10px rgba(0,0,0,0.45)' }} onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-lg text-[#40301d] mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{title}</h3>
        <p className="text-sm text-[#6b5540] mb-4">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-[#fff6e2] text-[#6b5540] font-bold text-sm border-[3px] border-[#40301d] hover:bg-[#fdecc8]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>Hủy</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-[#c1443a] text-white font-bold text-sm border-[3px] border-[#40301d] hover:bg-[#9c332a]" style={{ boxShadow: '0 3px 0 #6b1e18' }}>Xóa</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function GardenPage({ userAuth, onBack }) {
  const [garden, setGarden] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [error, setError] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [selectedPlotIndex, setSelectedPlotIndex] = useState(null);
  const [harvestResult, setHarvestResult] = useState(null);
  const [inventory, setInventory] = useState({ ...DEFAULT_INVENTORY });
  const [plantConfig, setPlantConfig] = useState(FALLBACK_PLANT_CONFIG);
  const [waterDrops, setWaterDrops] = useState(() => loadWaterDrops(userAuth?.user?.id));
  const [showQuiz, setShowQuiz] = useState(false);
  const [fertilizeMode, setFertilizeMode] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tick, setTick] = useState(0);

  // Player state
  const [playerPos, setPlayerPos] = useState({ x: PLAYER_START.x, y: PLAYER_START.y });
  const [playerDir, setPlayerDir] = useState('down');
  const [playerMoving, setPlayerMoving] = useState(false);
  const [playerFrom, setPlayerFrom] = useState({ x: PLAYER_START.x, y: PLAYER_START.y });
  const [playerTo, setPlayerTo] = useState({ x: PLAYER_START.x, y: PLAYER_START.y });
  const moveStartRef = useRef(0);
  const moveDuration = 140;
  const keysDown = useRef(new Set());
  const lastMoveRef = useRef(0);
  const syncRef = useRef({});
  const userId = userAuth?.user?.id;

  const showToast = useCallback((msg) => setToast(msg), []);

  const stampSync = (idx, prog) => { syncRef.current[idx] = { progress: prog, at: Date.now() }; };

  // Facing tile
  const facingTile = useMemo(() => {
    let dx = 0, dy = 0;
    if (playerDir === 'down') dy = 1;
    else if (playerDir === 'up') dy = -1;
    else if (playerDir === 'left') dx = -1;
    else if (playerDir === 'right') dx = 1;
    return { x: playerPos.x + dx, y: playerPos.y + dy };
  }, [playerPos, playerDir]);

  // Load data
  const load = useCallback(async () => {
    try {
      setError(null);
      const [gardenData, plantTypesRes] = await Promise.all([
        gardenService.get(),
        gardenService.getPlantTypes().catch(() => null),
      ]);
      if (gardenData) {
        setGarden(gardenData);
        if (gardenData.inventory) setInventory({ ...DEFAULT_INVENTORY, ...gardenData.inventory });
        (gardenData.slots || []).forEach(s => {
          if (s.plant) stampSync(s.index, s.plant.isReady ? 100 : (s.plant.progress || 0));
          else delete syncRef.current[s.index];
        });
      }
      if (plantTypesRes?.types) setPlantConfig(buildPlantConfig(plantTypesRes.types));
      const auth = JSON.parse(localStorage.getItem('edu_games_auth') || '{}');
      if (auth?.token) {
        const r = await fetch(`${API_BASE}/auth/me/coins`, { headers: { Authorization: `Bearer ${auth.token}` } }).then(r => r.json());
        if (r?.status) setUserCoins(r.data.coins || 0);
      }
    } catch (e) { setError(e.message || 'Lỗi tải khu vườn'); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(iv); }, []);

  const slots = garden?.slots || [];

  // Map farm plots to garden slots
  const plotToSlot = useMemo(() => {
    const map = {};
    FARM_PLOTS.forEach((fp, i) => {
      if (slots[i]) map[`${fp.x},${fp.y}`] = slots[i];
    });
    return map;
  }, [slots]);

  const getDisplay = useCallback((slot) => {
    const plant = slot?.plant;
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

  // Player movement
  const tryMove = useCallback((dx, dy) => {
    if (playerMoving) return;
    let dir = 'down';
    if (dx === 1) dir = 'right';
    else if (dx === -1) dir = 'left';
    else if (dy === -1) dir = 'up';
    setPlayerDir(dir);
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    if (!isWalkable(nx, ny)) return;
    setPlayerFrom({ ...playerPos });
    setPlayerTo({ x: nx, y: ny });
    setPlayerMoving(true);
    moveStartRef.current = performance.now();
  }, [playerPos, playerMoving]);

  // Interaction with facing tile
  const handleInteract = useCallback(() => {
    const key = `${facingTile.x},${facingTile.y}`;
    const slot = plotToSlot[key];
    if (!slot) return;

    const { progress } = getDisplay(slot);
    const plant = slot.plant;

    if (!plant) {
      // Empty plot — open seed shop
      setSelectedPlotIndex(slot.index);
      setShowShop(true);
    } else if (progress >= 100) {
      // Ready — harvest
      handleHarvest(slot.index);
    } else if (waterDrops > 0) {
      // Water
      handleWater(slot.index);
    } else {
      setShowQuiz(true);
    }
  }, [facingTile, plotToSlot, getDisplay, waterDrops]);

  // Keyboard
  useEffect(() => {
    const MOVE_REPEAT = 140;
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (showShop || showInventory || showQuiz || harvestResult || confirmDelete) return;
      if (key === 'e' || key === ' ') { e.preventDefault(); handleInteract(); return; }
      keysDown.current.add(key);
    };
    const handleUp = (e) => { keysDown.current.delete(e.key.toLowerCase()); };

    const loop = (now) => {
      if (!playerMoving) {
        const k = keysDown.current;
        let dx = 0, dy = 0;
        if (k.has('arrowup') || k.has('w')) dy = -1;
        else if (k.has('arrowdown') || k.has('s')) dy = 1;
        else if (k.has('arrowleft') || k.has('a')) dx = -1;
        else if (k.has('arrowright') || k.has('d')) dx = 1;
        if ((dx || dy) && now - lastMoveRef.current > MOVE_REPEAT) {
          tryMove(dx, dy);
          lastMoveRef.current = now;
        }
      }
      requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleUp);
    const raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleUp); cancelAnimationFrame(raf); };
  }, [playerMoving, tryMove, handleInteract, showShop, showInventory, showQuiz, harvestResult, confirmDelete]);

  // Player position update
  useEffect(() => {
    if (!playerMoving) return;
    const iv = requestAnimationFrame((now) => {
      const t = Math.min(1, (now - moveStartRef.current) / moveDuration);
      if (t >= 1) {
        setPlayerPos({ ...playerTo });
        setPlayerMoving(false);
      }
    });
    return () => cancelAnimationFrame(iv);
  }, [playerMoving, playerTo, tick]);

  // Bob offset
  const bobOffset = playerMoving ? Math.sin((tick % 10) / 10 * Math.PI) * 3 : 0;

  // Plant, water, harvest, fertilize handlers
  const handlePlant = async (plantType, plotIdx) => {
    const cfg = plantConfig[plantType];
    setShowShop(false);
    setSelectedPlotIndex(null);
    const prevGarden = garden;
    const prevCoins = userCoins;
    setGarden(g => {
      if (!g) return g;
      return { ...g, slots: g.slots.map(s => s.index === plotIdx ? { ...s, plant: { plantType, progress: 0, isReady: false } } : s) };
    });
    stampSync(plotIdx, 0);
    setUserCoins(c => Math.max(0, c - cfg.seedPrice));
    try {
      const res = await gardenService.plant(plotIdx, plantType);
      if (!res?.success) throw new Error(res?.message || 'Lỗi trồng cây');
      showToast(`Đã trồng ${cfg.name}! 🌱`);
      load();
    } catch (e) {
      setGarden(prevGarden);
      setUserCoins(prevCoins);
      delete syncRef.current[plotIdx];
      showToast(e.message);
    }
  };

  const handleHarvest = async (index) => {
    const slot = slots.find(s => s.index === index);
    const plantType = slot?.plant?.plantType;
    const prevGarden = garden;
    setGarden(g => ({ ...g, slots: g.slots.map(s => s.index === index ? { ...s, plant: null } : s) }));
    delete syncRef.current[index];
    if (plantType) setHarvestResult(plantType);
    try {
      const res = await gardenService.harvest(index);
      if (!res?.success) throw new Error(res?.message);
      load();
    } catch (e) { setGarden(prevGarden); setHarvestResult(null); showToast(e.message); }
  };

  const handleWater = async (index) => {
    if (waterDrops <= 0) { setShowQuiz(true); return; }
    const slot = slots.find(s => s.index === index);
    if (!slot?.plant) return;
    const { progress } = getDisplay(slot);
    const boost = inventory.golden_can > 0 ? 20 : 10;
    const next = Math.min(100, progress + boost);
    stampSync(index, next);
    setGarden(g => ({ ...g, slots: g.slots.map(s => s.index === index ? { ...s, plant: { ...s.plant, progress: next, isReady: next >= 100 } } : s) }));
    const nd = waterDrops - 1;
    setWaterDrops(nd);
    saveWaterDrops(userId, nd);
    try { await gardenService.water(index); } catch (e) { showToast(e.message); }
  };

  const handleEarnWater = (amt) => {
    const nd = waterDrops + amt;
    setWaterDrops(nd);
    saveWaterDrops(userId, nd);
    setShowQuiz(false);
    showToast('Nhận +1 💧');
  };

  const handleFertilize = async (index, itemId) => {
    if (!itemId || (inventory[itemId] || 0) <= 0) return;
    const slot = slots.find(s => s.index === index);
    if (!slot?.plant) return;
    const { progress } = getDisplay(slot);
    const next = Math.min(100, progress + ITEM_CONFIG[itemId].boost);
    stampSync(index, next);
    setGarden(g => ({ ...g, slots: g.slots.map(s => s.index === index ? { ...s, plant: { ...s.plant, progress: next, isReady: next >= 100 } } : s) }));
    setFertilizeMode(null);
    showToast(`Đã bón ${ITEM_CONFIG[itemId].name}!`);
    try {
      const r = await gardenService.useItem(itemId);
      if (r?.inventory) setInventory({ ...DEFAULT_INVENTORY, ...r.inventory });
      else setInventory(p => ({ ...p, [itemId]: (p[itemId] || 0) - 1 }));
    } catch { setInventory(p => ({ ...p, [itemId]: (p[itemId] || 0) - 1 })); }
  };

  const handleRemove = (index) => setConfirmDelete(index);
  const confirmRemove = async () => {
    const index = confirmDelete;
    setConfirmDelete(null);
    const prevGarden = garden;
    setGarden(g => ({ ...g, slots: g.slots.map(s => s.index === index ? { ...s, plant: null } : s) }));
    delete syncRef.current[index];
    try { await gardenService.remove(index); showToast('Đã xóa cây'); } catch (e) { setGarden(prevGarden); showToast(e.message); }
  };

  const handleBuyItem = async (itemId) => {
    const item = ITEM_CONFIG[itemId];
    if ((userCoins || 0) < item.price) return;
    try {
      const r = await gardenService.buyItem(itemId);
      if (r?.inventory) setInventory({ ...DEFAULT_INVENTORY, ...r.inventory });
      if (r?.coins !== undefined) setUserCoins(r.coins);
      else setUserCoins(c => c - item.price);
      showToast(`Đã mua ${item.name}!`);
    } catch (e) { showToast(e.message); }
  };

  const handleUseItem = async (itemId) => {
    if ((inventory[itemId] || 0) <= 0) return;
    setInventory(p => ({ ...p, [itemId]: (p[itemId] || 0) - 1 }));
    try {
      const r = await gardenService.useItem(itemId);
      if (r?.inventory) setInventory({ ...DEFAULT_INVENTORY, ...r.inventory });
      showToast(`Đã dùng ${ITEM_CONFIG[itemId]?.name}!`);
    } catch (e) { setInventory(p => ({ ...p, [itemId]: (p[itemId] || 0) + 1 })); showToast(e.message); }
  };

  const handleSelectFertilizer = (itemId) => { setShowInventory(false); setFertilizeMode(itemId); };

  // Planted count
  const plantedCount = slots.filter(s => s.plant).length;
  const readyCount = slots.filter(s => s.plant && getDisplay(s).progress >= 100).length;
  const hasAnyFertilizer = inventory.basic_fertilizer > 0 || inventory.premium_fertilizer > 0 || inventory.miracle_fertilizer > 0;

  // Get facing plot
  const facingKey = `${facingTile.x},${facingTile.y}`;
  const facingSlot = plotToSlot[facingKey];
  const facingPlant = facingSlot?.plant;
  const facingCfg = facingPlant ? plantConfig[facingPlant.plantType] : null;
  const facingDisplay = facingSlot ? getDisplay(facingSlot) : null;

  // Hint
  const getHint = () => {
    if (fertilizeMode) return `Chọn cây để bón — di chuyển đến ô cây, nhấn E`;
    if (facingSlot && facingPlant) {
      if (facingDisplay?.progress >= 100) return `Nhấn E để thu hoạch ${facingCfg?.name || 'cây'}! 🎉`;
      return `${facingCfg?.name || 'Cây'} — nhấn E để tưới nước 💧`;
    }
    if (facingSlot && !facingPlant) return 'Nhấn E để trồng cây 🌱';
    return 'Dùng WASD/Phím mũi tên để di chuyển, E để tương tác';
  };

  if (!userAuth?.user) {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div id="farm-sky" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-[#fff6e2] border-[4px] border-[#40301d] rounded-[22px] p-6 text-center max-w-xs w-full anim-pop" style={{ boxShadow: '0 24px 40px -10px rgba(0,0,0,0.45)' }}>
            <div className="text-4xl mb-3">🌱</div>
            <h2 className="font-bold text-lg text-[#40301d] mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Chưa đăng nhập</h2>
            <p className="text-sm text-[#6b5540] mb-4">Bạn cần đăng nhập để xem khu vườn</p>
            <button onClick={onBack} className="w-full py-2.5 bg-[#4c8c3a] text-white rounded-xl font-bold border-[3px] border-[#40301d] hover:bg-[#2f5a24]" style={{ boxShadow: '0 4px 0 #2f5a24' }}>Về trang chủ</button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div id="farm-sky" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-[#fff6e2] border-[4px] border-[#40301d] rounded-[22px] p-6 text-center max-w-xs w-full anim-pop" style={{ boxShadow: '0 24px 40px -10px rgba(0,0,0,0.45)' }}>
            <p className="text-sm text-[#8c2f27] mb-3 font-bold">{error}</p>
            <button onClick={load} className="w-full py-2.5 bg-[#4c8c3a] text-white rounded-xl font-bold border-[3px] border-[#40301d] hover:bg-[#2f5a24]" style={{ boxShadow: '0 4px 0 #2f5a24' }}>Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Sky */}
      <div id="farm-sky" />

      {/* Clouds */}
      <div className="sky-cloud" style={{ '--cy': '8%', '--dur': '52s', '--delay': '0s' }} />
      <div className="sky-cloud" style={{ '--cy': '16%', '--dur': '70s', '--delay': '-20s' }} />
      <div className="sky-cloud" style={{ '--cy': '4%', '--dur': '60s', '--delay': '-40s' }} />

      {/* HUD */}
      <header className="absolute top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#fff6e2] border-[3px] border-[#40301d] rounded-full px-3 py-1.5" style={{ fontFamily: "'Baloo 2', sans-serif", boxShadow: '0 4px 0 rgba(64,48,29,0.35)' }}>
          <span className="w-6 h-6 rounded-full bg-[#ffc94a] border-2 border-[#40301d] flex items-center justify-center text-[11px]">🌾</span>
          <span className="text-[15px] text-[#40301d] font-bold">{userCoins.toLocaleString()}</span>
        </div>
        <div className="pointer-events-auto bg-[rgba(64,48,29,0.35)] backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-[13px] font-bold max-w-[40vw] truncate" style={{ fontFamily: "'Baloo 2', sans-serif", textShadow: '0 2px 0 rgba(0,0,0,0.25)' }}>
          🌿 Khu vườn
        </div>
        <div className="pointer-events-auto flex items-center gap-2 bg-[#fff6e2] border-[3px] border-[#40301d] rounded-full px-3 py-1.5" style={{ fontFamily: "'Baloo 2', sans-serif", boxShadow: '0 4px 0 rgba(64,48,29,0.35)' }}>
          <span className="w-6 h-6 rounded-full bg-[#ffc94a] border-2 border-[#40301d] flex items-center justify-center text-[11px]">💧</span>
          <span className="text-[15px] text-[#40301d] font-bold">{waterDrops}</span>
        </div>
      </header>

      {/* Hint */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-[#fff6e2] border-[3px] border-[#40301d] whitespace-nowrap" style={{ fontFamily: "'Baloo 2', sans-serif", boxShadow: '0 4px 0 rgba(64,48,29,0.35)' }}>
          <span className="text-[12px] font-semibold text-[#40301d]">{getHint()}</span>
        </div>
      </div>

      {/* Farm Grid */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="relative"
          style={{ width: MAP_COLS * TILE, height: MAP_ROWS * TILE }}
        >
          {/* Grid tiles */}
          {FARM_TILES.map((row, y) =>
            row.map((type, x) => {
              const key = `${x},${y}`;
              const slot = plotToSlot[key];
              const plant = slot?.plant;
              const cfg = plant ? plantConfig[plant.plantType] : null;
              const display = slot ? getDisplay(slot) : null;
              const progress = display?.progress || 0;
              const isReady = progress >= 100;
              const stageIdx = plant && cfg ? (isReady ? cfg.stageCount - 1 : Math.min(cfg.stageCount - 1, Math.floor((progress / 100) * (cfg.stageCount - 1)))) : 0;
              const isFacing = facingTile.x === x && facingTile.y === y;

              return (
                <FarmTile
                  key={key}
                  x={x} y={y} type={type}
                  plant={plant} progress={progress} isReady={isReady}
                  stageIdx={stageIdx} cfg={cfg}
                  showClock={inventory.magic_lens > 0}
                  remainingMs={display?.remainingMs || 0}
                  isFacing={isFacing}
                  fertilizing={!!fertilizeMode}
                  onInteract={() => {
                    if (type !== 'plot') return;
                    if (fertilizeMode && plant && !isReady) { handleFertilize(slot.index, fertilizeMode); return; }
                    if (!plant) { setSelectedPlotIndex(slot.index); setShowShop(true); return; }
                    if (isReady) { handleHarvest(slot.index); return; }
                    if (waterDrops > 0) handleWater(slot.index);
                    else setShowQuiz(true);
                  }}
                />
              );
            })
          )}

          {/* Decorations */}
          {FARM_DECOS.map((d, i) => (
            <div key={`deco-${i}`} className="absolute z-20 pointer-events-none select-none flex items-center justify-center" style={{ left: d.x * TILE, top: d.y * TILE, width: TILE, height: TILE }}>
              <span className="text-2xl" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>{d.emoji}</span>
            </div>
          ))}

          {/* Player */}
          <Player x={playerPos.x} y={playerPos.y} dir={playerDir} moving={playerMoving} bobOffset={bobOffset} />
        </div>
      </div>

      {/* Action bar — bottom */}
      <footer className="absolute bottom-4 left-0 right-0 z-50 flex items-center justify-center gap-4 pointer-events-none px-3">
        <button onClick={() => setShowInventory(true)} className="pointer-events-auto w-[52px] h-[52px] rounded-full flex items-center justify-center bg-[#fff6e2] border-[3px] border-[#40301d] text-xl hover:translate-y-[2px] active:translate-y-[3px] transition" style={{ boxShadow: '0 5px 0 rgba(64,48,29,0.35)' }} title="Kho đồ">🎒</button>
        <button onClick={() => setShowQuiz(true)} className="pointer-events-auto w-[52px] h-[52px] rounded-full flex items-center justify-center bg-[#fff6e2] border-[3px] border-[#40301d] text-xl hover:translate-y-[2px] active:translate-y-[3px] transition" style={{ boxShadow: '0 5px 0 rgba(64,48,29,0.35)' }} title="Quiz nhận nước">💧</button>
        <button onClick={onBack} className="pointer-events-auto w-[52px] h-[52px] rounded-full flex items-center justify-center bg-[#fff6e2] border-[3px] border-[#40301d] text-xl hover:translate-y-[2px] active:translate-y-[3px] transition" style={{ boxShadow: '0 5px 0 rgba(64,48,29,0.35)' }} title="Về trang chủ">🏠</button>
      </footer>

      {/* Mobile controls */}
      <div className="absolute bottom-24 left-4 z-50 md:hidden pointer-events-auto">
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button onTouchStart={(e) => { e.preventDefault(); tryMove(0, -1); }} className="w-10 h-10 rounded-full bg-[#fff6e2] border-[3px] border-[#40301d] flex items-center justify-center text-lg active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>⬆️</button>
          <div />
          <button onTouchStart={(e) => { e.preventDefault(); tryMove(-1, 0); }} className="w-10 h-10 rounded-full bg-[#fff6e2] border-[3px] border-[#40301d] flex items-center justify-center text-lg active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>⬅️</button>
          <button onTouchStart={(e) => { e.preventDefault(); handleInteract(); }} className="w-10 h-10 rounded-full bg-[#ffc94a] border-[3px] border-[#40301d] flex items-center justify-center text-lg active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>E</button>
          <button onTouchStart={(e) => { e.preventDefault(); tryMove(1, 0); }} className="w-10 h-10 rounded-full bg-[#fff6e2] border-[3px] border-[#40301d] flex items-center justify-center text-lg active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>➡️</button>
          <div />
          <button onTouchStart={(e) => { e.preventDefault(); tryMove(0, 1); }} className="w-10 h-10 rounded-full bg-[#fff6e2] border-[3px] border-[#40301d] flex items-center justify-center text-lg active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 rgba(64,48,29,0.35)' }}>⬇️</button>
          <div />
        </div>
      </div>

      {/* Modals */}
      {showShop && <SeedShop userCoins={userCoins} onSelect={handlePlant} onClose={() => { setShowShop(false); setSelectedPlotIndex(null); }} plantConfig={plantConfig} plotIndex={selectedPlotIndex} />}
      {showInventory && <InventoryShop userCoins={userCoins} inventory={inventory} onBuy={handleBuyItem} onUse={handleUseItem} onSelectFertilizer={handleSelectFertilizer} onClose={() => setShowInventory(false)} />}
      {harvestResult && <HarvestModal plantType={harvestResult} onConfirm={() => setHarvestResult(null)} onClose={() => setHarvestResult(null)} plantConfig={plantConfig} />}
      {showQuiz && <QuizModal onEarnWater={handleEarnWater} onClose={() => setShowQuiz(false)} />}
      <FarmConfirm open={confirmDelete !== null} title="Xóa cây?" message="Bạn muốn xóa cây này?" onConfirm={confirmRemove} onCancel={() => setConfirmDelete(null)} />
      <FarmToast message={toast} onClose={() => setToast(null)} />

      <style>{`
        @keyframes drift { from { transform: translateX(-20vw); } to { transform: translateX(120vw); } }
        @keyframes sun-glow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes anim-pop { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .anim-pop { animation: anim-pop 0.25s ease-out forwards; }
        #farm-sky {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, #cdeeff 0%, #eaf7d8 45%, #8fc94e 45%);
          z-index: 0; overflow: hidden;
        }
        #farm-sky::before {
          content: ""; position: absolute; top: 6%; right: 8%;
          width: clamp(46px, 9vw, 74px); height: clamp(46px, 9vw, 74px);
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff6c8, #ffc94a 70%);
          box-shadow: 0 0 40px 10px rgba(255, 201, 74, 0.45);
          animation: sun-glow 5s ease-in-out infinite;
        }
        .sky-cloud {
          position: absolute; top: var(--cy, 10%);
          width: clamp(60px, 14vw, 110px); height: clamp(24px, 6vw, 42px);
          background: #fff; border-radius: 999px; opacity: 0.8;
          filter: drop-shadow(0 4px 0 rgba(255,255,255,0.5));
          animation: drift var(--dur, 40s) linear infinite;
          animation-delay: var(--delay, 0s);
          z-index: 1;
        }
        .sky-cloud::before, .sky-cloud::after { content: ""; position: absolute; background: #fff; border-radius: 50%; }
        .sky-cloud::before { width: 55%; height: 140%; top: -55%; left: 8%; }
        .sky-cloud::after { width: 45%; height: 110%; top: -40%; right: 10%; }
      `}</style>
    </div>
  );
}
