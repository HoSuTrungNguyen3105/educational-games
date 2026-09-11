import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { gardenService, API_BASE } from '../../services/api.js';
import { PlantArt } from '../../components/garden/PlantArt.jsx';
import { useAvatarData } from '../../components/avatar/GardenerAvatar.jsx';
import { renderAvatarFull } from '../../lib/avatarRenderer.js';
import '../../farmgame.css';

/* ============================================================
   FARM LAYOUT — mirrors Farmgame.html BLUEPRINT 16×12
   . = grass  T = tree  B = bush  R = rock  F = flower
   C = crop plot  P = path  W = water  S = scarecrow
   L = well  A = barn  O = coop  X = animal
============================================================ */
const COLS = 16, ROWS = 12, TILE = 48;
const FARM = [
  'T T . A A A . . . . . . . T T',
  'T . . A A A . B . . . O O . T',
  'T . L . . F . . . . . . . . T',
  '. F . . . . . . R . . . X . .',
  '. . . C C C C C S . F . . F .',
  '. . . C C C C C . . . . . . .',
  '. X . . . . . . . . . . . . .',
  '. . . . . . . . P P P P P P P',
  '. . . . . . . . . . W W . . .',
  '. . B . . . . . . . W W . . .',
  '. . . F . . . . . . . . . . .',
  'T T . . . . . . . . . . . T T',
];

// which cells are walkable
function tileAt(x, y) { return FARM[y]?.[x] || '.'; }
function isWalkable(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
  const t = tileAt(x, y);
  return t === '.' || t === 'P' || t === 'C' || t === 'F';
}
function isCrop(x, y) { return tileAt(x, y) === 'C'; }

const PLAYER_START = { x: 7, y: 6 };

// map crop tiles to slot indices
const CROP_POSITIONS = [];
for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (tileAt(x, y) === 'C') CROP_POSITIONS.push({ x, y });

/* ============================================================
   CONSTANTS
============================================================ */
const FALLBACK_PLANT_CONFIG = {
  sunflower: { name: 'Hoa hướng dương', kind: 'bloom', stageCount: 3, growthTime: 5*60*1000, harvestCoin: 20, seedPrice: 5, rarity: 'common', palette: { stem:'#5B8C3A', leaf:'#7CB342', leafDark:'#4C7A2A', accent:'#F4B93E', accentLight:'#FFE08A', accentDark:'#C97F17' }},
  apple: { name: 'Cây táo', kind: 'fruitTree', stageCount: 4, growthTime: 30*60*1000, harvestCoin: 50, seedPrice: 15, rarity: 'common', palette: { stem:'#7A5230', leaf:'#4E8B3C', leafDark:'#356428', accent:'#D6483C', accentLight:'#F0847A', accentDark:'#A32A20' }},
  cherry: { name: 'Cây anh đào', kind: 'bloom', stageCount: 3, growthTime: 2*60*60*1000, harvestCoin: 120, seedPrice: 40, rarity: 'rare', palette: { stem:'#6B4A34', leaf:'#7CB342', leafDark:'#578A2E', accent:'#F3A6C6', accentLight:'#FFE1EE', accentDark:'#D4679A' }},
  oak: { name: 'Cây cổ thụ', kind: 'fruitTree', stageCount: 3, noFruit: true, growthTime: 12*60*60*1000, harvestCoin: 500, seedPrice: 150, rarity: 'epic', palette: { stem:'#6E4E30', leaf:'#3E6B32', leafDark:'#2A4E24', accent:'#3E6B32', accentLight:'#5C8B4C', accentDark:'#20381C' }},
  magic: { name: 'Cây thần kỳ', kind: 'aura', stageCount: 4, growthTime: 24*60*60*1000, harvestCoin: 1000, seedPrice: 400, rarity: 'legendary', palette: { stem:'#8A5CC4', leaf:'#B27FE0', leafDark:'#6B3FA0', accent:'#7FD8E8', accentLight:'#F4A6E0', accentDark:'#5C3FA0' }},
};
const RARITY_STYLES = {
  common: { bg:'#EEF0EC', text:'#6B7264', label:'Thường', border:'#D0D5CC' },
  rare: { bg:'#E4EEFA', text:'#3D6FA8', label:'Hiếm', border:'#A8C8E8' },
  epic: { bg:'#F0E6FA', text:'#7A4EA8', label:'Sử thi', border:'#C9A8E0' },
  legendary: { bg:'#FCEFD6', text:'#B8791A', label:'Huyền thoại', border:'#F0C87A' },
};
const ITEM_CONFIG = {
  basic_fertilizer: { name:'Phân bón thường', type:'consumable', price:20, boost:15, desc:'Thúc cây +15%.', icon:'🌱' },
  premium_fertilizer: { name:'Phân bón cao cấp', type:'consumable', price:55, boost:40, desc:'Thúc cây +40%.', icon:'🌟' },
  miracle_fertilizer: { name:'Phân bón thần kỳ', type:'consumable', price:150, boost:100, desc:'Chín ngay.', icon:'✨' },
  golden_can: { name:'Bình tưới vàng', type:'upgrade', price:300, desc:'Tưới +20%.', icon:'🪙' },
  magic_lens: { name:'Kính lúp phép thuật', type:'upgrade', price:150, desc:'Hiện timer.', icon:'🔍' },
};
const DEFAULT_INV = { basic_fertilizer:0, premium_fertilizer:0, miracle_fertilizer:0, golden_can:0, magic_lens:0 };
const MATH_Q = [
  { q:'12 + 8 = ?', o:['18','20','22','19'], a:1 }, { q:'15 - 7 = ?', o:['9','8','7','6'], a:1 },
  { q:'6 × 7 = ?', o:['42','48','36','44'], a:0 }, { q:'56 ÷ 8 = ?', o:['6','8','7','9'], a:2 },
  { q:'25 + 37 = ?', o:['60','62','58','64'], a:1 }, { q:'81 ÷ 9 = ?', o:['8','9','7','10'], a:1 },
  { q:'14 × 3 = ?', o:['40','42','38','44'], a:1 }, { q:'100 - 45 = ?', o:['50','55','60','45'], a:1 },
  { q:'9 × 9 = ?', o:['81','72','90','89'], a:0 }, { q:'72 ÷ 6 = ?', o:['11','13','12','14'], a:2 },
];

/* ============================================================
   HELPERS
============================================================ */
function buildPlantConfig(apiTypes) {
  if (!apiTypes?.length) return FALLBACK_PLANT_CONFIG;
  const c = {};
  for (const t of apiTypes) c[t.id] = { name:t.name, kind:t.kind||'bloom', stageCount:t.stages||3, growthTime:t.growthTime||300000, harvestCoin:t.harvestCoin||10, seedPrice:t.seedPrice||5, rarity:t.rarity||'common', palette:t.palette||FALLBACK_PLANT_CONFIG.sunflower.palette };
  return c;
}
function loadWater(userId) { try { const r=localStorage.getItem(`garden_water_${userId||'g'}`); return r?Number(r):5; } catch{return 5;} }
function saveWater(userId,n) { try{localStorage.setItem(`garden_water_${userId||'g'}`,String(n));}catch{} }

const WATER_MAX = 50;
const WATER_REGEN_MS = 5 * 60 * 1000;
function fmtTime(ms) { const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60),d=Math.floor(h/24); if(d>0)return`${d}d ${h%24}h`; if(h>0)return`${h}h ${m%60}m`; if(ms<=0)return'Sẵn sàng!'; return`${m}p ${s%60}s`; }
function fmtClock(ms) { if(ms<=0)return'00:00'; const t=Math.floor(ms/1000),h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60; return h>0?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }

/* ============================================================
   SVG FARM DECORATIONS — drawn inline, no external deps
============================================================ */
function FarmTileSVG({ type, x, y }) {
  const px = x * TILE + TILE / 2, py = y * TILE + TILE / 2;
  const seed = (x * 31 + y * 17) % 9;
  if (type === 'T') return (<g>
    <ellipse cx={px} cy={py+14} rx={14} ry={5} fill="rgba(0,0,0,0.12)" />
    <rect x={px-3} y={py-2} width={6} height={14} rx={2} fill="#7a5230" />
    <circle cx={px} cy={py-8} r={14} fill="#4c8c3a" />
    <circle cx={px-6} cy={py-3} r={9} fill="#5fa347" />
    <circle cx={px+6} cy={py-3} r={9} fill="#5fa347" />
  </g>);
  if (type === 'B') return (<g>
    <ellipse cx={px} cy={py+10} rx={11} ry={3.5} fill="rgba(0,0,0,0.1)" />
    <circle cx={px-7} cy={py+2} r={8} fill="#4f8e3c" />
    <circle cx={px+7} cy={py+2} r={8} fill="#4f8e3c" />
    <circle cx={px} cy={py-3} r={9} fill="#69a851" />
  </g>);
  if (type === 'R') return (<g>
    <ellipse cx={px} cy={py+10} rx={10} ry={3} fill="rgba(0,0,0,0.12)" />
    <path d={`M${px-10},${py+6} L${px-6},${py-7} L${px+4},${py-9} L${px+10},${py+2} L${px+6},${py+7} Z`} fill="#9a9a92" stroke="#77776e" strokeWidth={1.2} />
    <path d={`M${px-4},${py-4} L${px},${py-7} L${px-2},${py-1} Z`} fill="rgba(255,255,255,0.3)" />
  </g>);
  if (type === 'F') { const emojis = ['🌷','🌼','🌻','🌸']; return <text x={px} y={py+5} textAnchor="middle" fontSize={16}>{emojis[(x+y)%4]}</text>; }
  if (type === 'W') return (<g>
    <ellipse cx={px} cy={py} rx={TILE/2-2} ry={TILE/2-2} fill="#5aa7c9" stroke="#3f83a3" strokeWidth={1.5} />
    <ellipse cx={px-4} cy={py-2} rx={4} ry={2} fill="rgba(255,255,255,0.3)" />
    <text x={px+6} y={py+4} fontSize={11}>🐟</text>
  </g>);
  if (type === 'P') return (<g>
    {seed===0 && <ellipse cx={px} cy={py+2} rx={5} ry={3} fill="rgba(120,86,50,0.2)" />}
  </g>);
  if (type === 'S') return <text x={px} y={py+6} textAnchor="middle" fontSize={20}>🎃</text>;
  if (type === 'L') return <text x={px} y={py+5} textAnchor="middle" fontSize={14}>🪣</text>;
  if (type === 'A') return (<g>
    <rect x={px-18} y={py-4} width={36} height={20} rx={2} fill="#e8dcc0" stroke="#40301d" strokeWidth={1.5} />
    <path d={`M${px-22},${py-2} L${px},${py-18} L${px+22},${py-2} Z`} fill="#c1443a" stroke="#40301d" strokeWidth={1.5} />
    <rect x={px-5} y={py+6} width={10} height={12} rx={1} fill="#fff6e2" stroke="#40301d" strokeWidth={1} />
  </g>);
  if (type === 'O') return (<g>
    <rect x={px-12} y={py-2} width={24} height={14} rx={2} fill="#f5efe0" stroke="#40301d" strokeWidth={1.2} />
    <path d={`M${px-15},${py} L${px},${py-10} L${px+15},${py} Z`} fill="#9c332a" stroke="#40301d" strokeWidth={1.2} />
  </g>);
  if (type === 'X') return <text x={px} y={py+6} textAnchor="middle" fontSize={16}>{(x+y)%3===0?'🐑':(x+y)%3===1?'🐔':'🐓'}</text>;
  return null; // '.' = grass drawn by parent
}

/* ============================================================
   AVATAR PLAYER SVG
============================================================ */
function AvatarPlayer({ moving, userAuth }) {
  const { loadout, items } = useAvatarData(userAuth);
  const state = {};
  let bodyHtml = null;
  for (const [cat, id] of Object.entries(loadout)) {
    if (!id) continue;
    const item = items.find(i => i.code === id);
    if (!item) continue;
    if (cat === 'body') bodyHtml = item.html || null;
    else if (cat === 'skin') state.skin = item.params?.hex || '#FFDFC4';
    else if (cat === 'face') state.face = item.params?.style || 'gentle';
    else if (cat === 'hair') state.hair = { style: item.params?.style || 'spiky', color: item.params?.color || '#6B4226' };
    else if (cat === 'shirt') state.shirt = { style: item.params?.style || 'tee', color: item.params?.color || '#F5F5F5' };
    else if (cat === 'pants') state.pants = { style: item.params?.style || 'shorts', color: item.params?.color || '#241F1C' };
    else if (cat === 'shoes') state.shoes = { style: item.params?.style || 'sneaker', color: item.params?.color || '#3B5EA6' };
    else if (cat === 'hat') state.hat = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    else if (cat === 'glasses') state.glasses = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    else if (cat === 'accessory') state.accessory = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
  }
  const svg = renderAvatarFull(state, bodyHtml);
  if (!svg) return <span className="text-2xl select-none">🧑‍🌾</span>;
  const isFull = svg.includes('<svg') || (svg.includes('id="head"') && svg.includes('id="body"'));
  const vb = isFull ? '0 0 512 700' : '0 0 300 440';
  return <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/* ============================================================
   SEED SHOP MODAL
============================================================ */
function SeedShop({ userCoins, onSelect, onClose, plantConfig }) {
  const seeds = Object.entries(plantConfig).map(([id, c]) => ({ id, ...c }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, margin: '4px 0 6px' }}>🌾 Cửa hàng hạt giống</h1>
        <p className="lang-sub">Chọn hạt giống để trồng trên cánh đồng!</p>
        <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center', marginBottom:14 }}>
          <span className="hud-icon" style={{ width:22, height:22, fontSize:12 }}>🌾</span>
          <span style={{ fontFamily:"'Baloo 2'", fontWeight:700, fontSize:16 }}>{userCoins?.toLocaleString()} Coin</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, textAlign:'left' }}>
          {seeds.map(s => {
            const can = (userCoins||0) >= s.seedPrice;
            const r = RARITY_STYLES[s.rarity];
            return (
              <button key={s.id} onClick={() => can && onSelect(s.id)} disabled={!can}
                className="lang-option" style={{ opacity: can ? 1 : 0.4, cursor: can ? 'pointer' : 'not-allowed', width:'100%', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'#eaf7d8', border:'2px solid #40301d', overflow:'hidden', flexShrink:0 }}>
                    <PlantArt plantId={s.id} stageIdx={s.stageCount-1} totalStages={s.stageCount} isReady={false} plantConfig={plantConfig} />
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:"'Baloo 2'", fontWeight:700, fontSize:14 }}>{s.name} <span style={{ fontSize:10, background:r.bg, color:r.text, border:`1px solid ${r.border}`, borderRadius:4, padding:'1px 5px' }}>{r.label}</span></div>
                    <div style={{ fontSize:11, color:'#6b5540' }}>⏰ {fmtTime(s.growthTime)} · 🌾 +{s.harvestCoin}</div>
                  </div>
                </div>
                <div style={{ fontFamily:"'Baloo 2'", fontWeight:700, fontSize:14, color:'#8a6a10', flexShrink:0 }}>🌾 {s.seedPrice}</div>
              </button>
            );
          })}
        </div>
        <button className="primary-btn" style={{ marginTop:14 }} onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

/* ============================================================
   INVENTORY MODAL
============================================================ */
function InventoryModal({ userCoins, inventory, onBuy, onUse, onSelectFert, onClose }) {
  const owned = Object.entries(ITEM_CONFIG).filter(([id]) => (inventory[id]||0) > 0);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, margin: '4px 0 6px' }}>🎒 Kho đồ</h1>
        <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center', marginBottom:14 }}>
          <span className="hud-icon" style={{ width:22, height:22, fontSize:12 }}>🌾</span>
          <span style={{ fontFamily:"'Baloo 2'", fontWeight:700, fontSize:16 }}>{userCoins?.toLocaleString()} Coin</span>
        </div>
        {owned.length > 0 && <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#6b5540', marginBottom:6, textTransform:'uppercase' }}>Sở hữu</div>
          {owned.map(([id, item]) => {
            const n = inventory[id]||0; const up = item.type==='upgrade';
            return <div key={id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'#dff2c8', border:'2px solid #4c8c3a', borderRadius:12, marginBottom:6 }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <div style={{ flex:1 }}><span style={{ fontFamily:"'Baloo 2'", fontWeight:700, fontSize:13 }}>{item.name}</span> x{n}</div>
              {up ? <button className="vocab-btn known" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => onUse(id)}>Dùng</button>
                : <button className="vocab-btn known" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => onSelectFert(id)}>Bón</button>}
            </div>;
          })}
        </div>}
        <div style={{ fontSize:11, fontWeight:700, color:'#6b5540', marginBottom:6, textTransform:'uppercase' }}>Mua sắm</div>
        {Object.entries(ITEM_CONFIG).map(([id, item]) => {
          const up = item.type==='upgrade'; const have = up && (inventory[id]||0)>0;
          const can = !have && (userCoins||0) >= item.price;
          return <div key={id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background: have ? '#dff2c8' : '#fff', border:`2px solid ${have?'#4c8c3a':'#40301d'}`, borderRadius:12, marginBottom:6 }}>
            <span style={{ fontSize:20 }}>{item.icon}</span>
            <div style={{ flex:1 }}><span style={{ fontFamily:"'Baloo 2'", fontWeight:700, fontSize:13 }}>{item.name}</span><div style={{ fontSize:10, color:'#6b5540' }}>{item.desc}</div></div>
            <button className={`quiz-opt ${have ? 'correct' : can ? '' : 'dim'}`} style={{ padding:'6px 12px', fontSize:12, cursor: can || have ? 'pointer' : 'default' }}
              onClick={() => can && onBuy(id)}>{have ? '✅' : `🌾 ${item.price}`}</button>
          </div>;
        })}
        <button className="primary-btn" style={{ marginTop:14 }} onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

/* ============================================================
   HARVEST / QUIZ / CONFIRM MODALS
============================================================ */
function HarvestModal({ plantType, onConfirm, onClose, plantConfig }) {
  if (!plantType) return null;
  const cfg = plantConfig[plantType]; if (!cfg) return null;
  return (<div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth:340 }}>
      <div style={{ width:80, height:80, margin:'0 auto 8px' }}><PlantArt plantId={plantType} stageIdx={cfg.stageCount-1} totalStages={cfg.stageCount} isReady plantConfig={plantConfig} /></div>
      <h1 style={{ fontSize:20 }}>🎉 Thu hoạch thành công!</h1>
      <div style={{ fontFamily:"'Baloo 2'", fontWeight:700, fontSize:24, color:'#8a6a10', margin:'8px 0 14px' }}>🌾 +{cfg.harvestCoin}</div>
      <button className="primary-btn" onClick={onConfirm}>Tuyệt vời!</button>
    </div>
  </div>);
}

function QuizModal({ onEarn, onClose }) {
  const [q, setQ] = useState(null); const [sel, setSel] = useState(null); const [res, setRes] = useState(null);
  const pick = () => { setQ(MATH_Q[Math.floor(Math.random()*MATH_Q.length)]); setSel(null); setRes(null); };
  useEffect(() => { pick(); }, []);
  const sub = () => { if(sel===null||!q)return; const ok=sel===q.a; setRes(ok); if(ok)setTimeout(()=>onEarn(1),800); };
  if (!q) return null;
  return (<div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth:380 }}>
      <h1 style={{ fontSize:18, margin:'0 0 10px' }}>💧 Trả lời để nhận nước</h1>
      <div style={{ background:'var(--cream-2)', border:'2px solid var(--ink)', borderRadius:14, padding:14, marginBottom:12 }}>
        <p style={{ fontFamily:"'Baloo 2'", fontWeight:800, fontSize:20, margin:0 }}>{q.q}</p>
      </div>
      <div className="quiz-options">
        {q.o.map((o,i) => {
          const cor=res!==null&&i===q.a, wrn=res!==null&&sel===i&&i!==q.a;
          return <button key={i} className={`quiz-opt ${cor?'correct':''} ${wrn?'wrong':''} ${res!==null&&i!==q.a&&i!==sel?'dim':''}`}
            onClick={()=>res===null&&setSel(i)} disabled={res!==null}>{o}</button>;
        })}
      </div>
      {res===null ? <button className="primary-btn" style={{ marginTop:12 }} disabled={sel===null} onClick={sub}>Trả lời</button>
        : <div><p style={{ fontFamily:"'Baloo 2'", fontWeight:700, color:res?'#2f5a24':'#8c2f27', margin:'8px 0' }}>{res?'✅ Đúng rồi! +1 💧':`❌ Sai! Đáp án: ${q.o[q.a]}`}</p>
          <button className="primary-btn" onClick={pick}>Câu tiếp theo</button></div>}
    </div>
  </div>);
}

function ConfirmDialog({ open, title, msg, onYes, onNo }) {
  if (!open) return null;
  return (<div className="modal-overlay" onClick={onNo}>
    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth:340 }}>
      <h1 style={{ fontSize:18 }}>{title}</h1>
      <p style={{ color:'var(--ink-soft)', fontSize:13, margin:'6px 0 16px' }}>{msg}</p>
      <div style={{ display:'flex', gap:10 }}>
        <button className="quiz-opt" style={{ flex:1 }} onClick={onNo}>Hủy</button>
        <button className="primary-btn" style={{ flex:1, background:'var(--barn-red)', boxShadow:'0 5px 0 var(--barn-red-dark)' }} onClick={onYes}>Xóa</button>
      </div>
    </div>
  </div>);
}

function ToastFarm({ msg, onDone }) {
  useEffect(() => { if(!msg)return; const t=setTimeout(onDone,2200); return ()=>clearTimeout(t); }, [msg, onDone]);
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function GardenPage({ userAuth, onBack }) {
  const [garden, setGarden] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [error, setError] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showInv, setShowInv] = useState(false);
  const [selSlot, setSelSlot] = useState(null);
  const [harvestR, setHarvestR] = useState(null);
  const [tick, setTick] = useState(0);
  const [inv, setInv] = useState({ ...DEFAULT_INV });
  const [cfg, setCfg] = useState(FALLBACK_PLANT_CONFIG);
  const [drops, setDrops] = useState(() => loadWater(userAuth?.user?.id));
  const [lastRegenAt, setLastRegenAt] = useState(() => Date.now());
  const [showQuiz, setShowQuiz] = useState(false);
  const [fertMode, setFertMode] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  // player (smooth pixel-based movement)
  const SPEED = 150; // px/s
  const [playerPos, setPlayerPos] = useState(() => ({ x: PLAYER_START.x * TILE + TILE / 2, y: PLAYER_START.y * TILE + TILE / 2 }));
  const [playerDir, setPlayerDir] = useState('down');
  const playerPosRef = useRef({ x: PLAYER_START.x * TILE + TILE / 2, y: PLAYER_START.y * TILE + TILE / 2 });
  const keysHeld = useRef(new Set());
  const dpadDir = useRef(null);
  const sync = useRef({});
  const uid = userAuth?.user?.id;

  const toast_ = useCallback(m => setToast(m), []);
  const stamp = (i, p) => { sync.current[i] = { p, at: Date.now() }; };

  const load = useCallback(async () => {
    try {
      setError(null);
      const [g, pt] = await Promise.all([gardenService.get(), gardenService.getPlantTypes().catch(()=>null)]);
      if (g) {
        setGarden(g);
        if(g.inventory) setInv({...DEFAULT_INV,...g.inventory});
        if(typeof g.waterDrops === 'number') { setDrops(g.waterDrops); saveWater(uid, g.waterDrops); }
        if(g.lastWaterRegenAt) setLastRegenAt(g.lastWaterRegenAt);
        (g.slots||[]).forEach(s=>{ if(s.plant) stamp(s.index, s.plant.isReady?100:(s.plant.progress||0)); else delete sync.current[s.index]; });
      }
      if (pt?.types) setCfg(buildPlantConfig(pt.types));
      const auth = JSON.parse(localStorage.getItem('edu_games_auth')||'{}');
      if (auth?.token) { const r = await fetch(`${API_BASE}/auth/me/coins`,{headers:{Authorization:`Bearer ${auth.token}`}}).then(r=>r.json()); if(r?.status) setUserCoins(r.data.coins||0); }
    } catch(e) { setError(e.message||'Lỗi tải khu vườn'); }
  }, []);
  useEffect(()=>{load();},[load]);
  useEffect(()=>{const iv=setInterval(()=>setTick(t=>t+1),1000);return()=>clearInterval(iv);},[]);

  // Water regeneration timer - check every 30 seconds
  const dropsRef = useRef(drops);
  const lastRegenRef = useRef(lastRegenAt);
  useEffect(() => { dropsRef.current = drops; }, [drops]);
  useEffect(() => { lastRegenRef.current = lastRegenAt; }, [lastRegenAt]);

  useEffect(()=>{
    const check = () => {
      const now = Date.now();
      const d = dropsRef.current;
      const lr = lastRegenRef.current;
      const elapsed = now - lr;
      if (elapsed >= WATER_REGEN_MS && d < WATER_MAX) {
        const dropsToAdd = Math.min(WATER_MAX - d, Math.floor(elapsed / WATER_REGEN_MS));
        if (dropsToAdd > 0) {
          const newDrops = Math.min(WATER_MAX, d + dropsToAdd);
          setDrops(newDrops);
          saveWater(uid, newDrops);
          setLastRegenAt(now - (elapsed % WATER_REGEN_MS));
          gardenService.syncWater(newDrops).catch(()=>{});
        }
      }
    };
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, [uid]);

  const slots = garden?.slots || [];

  // map crop positions to slots
  const cropMap = useMemo(() => {
    const m = {};
    CROP_POSITIONS.forEach((cp, i) => { if (slots[i]) m[`${cp.x},${cp.y}`] = slots[i]; });
    return m;
  }, [slots]);

  const getDisplay = useCallback((slot) => {
    const plant = slot?.plant; if (!plant) return { progress:0, remainingMs:0 };
    const c = cfg[plant.plantType]; if (!c) return { progress:plant.progress||0, remainingMs:0 };
    const s = sync.current[slot.index]||{ p:plant.progress||0, at:Date.now() };
    if (plant.isReady||s.p>=100) return { progress:100, remainingMs:0 };
    const el = Date.now()-s.at; const g = (el/c.growthTime)*100;
    const progress = Math.min(100, s.p+g);
    return { progress, remainingMs: Math.max(0, c.growthTime*(1-progress/100)) };
  }, [cfg]);

  // facing — derive grid cell from pixel position + direction
  const facing = useCallback(() => {
    const gx = Math.floor(playerPosRef.current.x / TILE);
    const gy = Math.floor(playerPosRef.current.y / TILE);
    switch (playerDir) {
      case 'up':    return { x: gx, y: gy - 1 };
      case 'down':  return { x: gx, y: gy + 1 };
      case 'left':  return { x: gx - 1, y: gy };
      case 'right': return { x: gx + 1, y: gy };
      default:      return { x: gx, y: gy + 1 };
    }
  }, [playerDir]);

  const facingSlot = (() => { const f = facing(); return cropMap[`${f.x},${f.y}`] || null; })();

  const interact = useCallback(() => {
    const f = facing(); const slot = cropMap[`${f.x},${f.y}`];
    if (!slot) return;
    const { progress } = getDisplay(slot);
    if (!slot.plant) { setSelSlot(slot); setShowShop(true); }
    else if (progress >= 100) doHarvest(slot.index);
    else if (drops > 0) doWater(slot.index);
    else setShowQuiz(true);
  }, [facing, cropMap, getDisplay, drops]);

  // keyboard
  useEffect(() => {
    const onK = (e) => {
      const k = e.key.toLowerCase();
      if (showShop || showInv || showQuiz || harvestR || confirmDel) return;
      if (k === 'e' || k === ' ') { e.preventDefault(); interact(); return; }
      keysHeld.current.add(k);
    };
    const onU = (e) => keysHeld.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onK);
    window.addEventListener('keyup', onU);
    return () => { window.removeEventListener('keydown', onK); window.removeEventListener('keyup', onU); };
  }, [interact, showShop, showInv, showQuiz, harvestR, confirmDel]);

  // smooth movement game loop (pixel-based, no grid snap)
  useEffect(() => {
    let raf;
    let lastTime = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (showShop || showInv || showQuiz || harvestR || confirmDel) {
        raf = requestAnimationFrame(loop);
        return;
      }

      let dx = 0, dy = 0;
      if (dpadDir.current) {
        dx = dpadDir.current.x;
        dy = dpadDir.current.y;
      } else {
        const k = keysHeld.current;
        if (k.has('arrowup') || k.has('w')) dy = -1;
        else if (k.has('arrowdown') || k.has('s')) dy = 1;
        if (k.has('arrowleft') || k.has('a')) dx = -1;
        else if (k.has('arrowright') || k.has('d')) dx = 1;
      }

      if (dx || dy) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len; dy /= len;

        if (Math.abs(dx) >= Math.abs(dy)) setPlayerDir(dx > 0 ? 'right' : 'left');
        else setPlayerDir(dy > 0 ? 'down' : 'up');

        const newX = playerPosRef.current.x + dx * SPEED * dt;
        const newY = playerPosRef.current.y + dy * SPEED * dt;
        const curGx = Math.floor(playerPosRef.current.x / TILE);
        const curGy = Math.floor(playerPosRef.current.y / TILE);
        const newGx = Math.floor(newX / TILE);
        const newGy = Math.floor(newY / TILE);
        let fx = playerPosRef.current.x, fy = playerPosRef.current.y;
        if (isWalkable(newGx, newGy)) { fx = newX; fy = newY; }
        else if (isWalkable(newGx, curGy)) { fx = newX; }
        else if (isWalkable(curGx, newGy)) { fy = newY; }
        playerPosRef.current = { x: fx, y: fy };
        setPlayerPos({ x: fx, y: fy });
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [showShop, showInv, showQuiz, harvestR, confirmDel]);

  // actions
  const doPlant = async (plantType) => {
    if(!selSlot)return; const c=cfg[plantType]; const idx=selSlot.index;
    setShowShop(false);setSelSlot(null);
    const pg=garden,pc=userCoins;
    setGarden(g=>g?{...g,slots:g.slots.map(s=>s.index===idx?{...s,plant:{plantType,progress:0,isReady:false}}:s)}:g);
    stamp(idx,0);setUserCoins(v=>Math.max(0,v-c.seedPrice));
    try{const r=await gardenService.plant(idx,plantType);if(!r?.success)throw new Error(r?.message||'Lỗi');toast_(`Trồng ${c.name}! 🌱`);load();}
    catch(e){setGarden(pg);setUserCoins(pc);delete sync.current[idx];toast_(e.message);}
  };
  const doHarvest = async (idx) => {
    const s=slots.find(s=>s.index===idx);const pt=s?.plant?.plantType;const pg=garden;
    setGarden(g=>({...g,slots:g.slots.map(s=>s.index===idx?{...s,plant:null}:s)}));delete sync.current[idx];
    if(pt)setHarvestR(pt);
    try{const r=await gardenService.harvest(idx);if(!r?.success)throw new Error(r?.message);load();}
    catch(e){setGarden(pg);setHarvestR(null);toast_(e.message);}
  };
  const doWater = async (idx) => {
    if(drops<=0){setShowQuiz(true);return;}
    const s=slots.find(s=>s.index===idx);if(!s?.plant)return;
    const {progress}=getDisplay(s);const boost=inv.golden_can>0?20:10;const next=Math.min(100,progress+boost);
    stamp(idx,next);setGarden(g=>({...g,slots:g.slots.map(s=>s.index===idx?{...s,plant:{...s.plant,progress:next,isReady:next>=100}}:s)}));
    const nd=drops-1;setDrops(nd);saveWater(uid,nd);
    try{await gardenService.water(idx);gardenService.syncWater(nd).catch(()=>{});}catch(e){toast_(e.message);}
  };
  const doFert = async (idx, itemId) => {
    if(!itemId||(inv[itemId]||0)<=0)return; const s=slots.find(s=>s.index===idx);if(!s?.plant)return;
    const {progress}=getDisplay(s);const next=Math.min(100,progress+ITEM_CONFIG[itemId].boost);
    stamp(idx,next);setGarden(g=>({...g,slots:g.slots.map(s=>s.index===idx?{...s,plant:{...s.plant,progress:next,isReady:next>=100}}:s)}));
    setFertMode(null);toast_(`Bón ${ITEM_CONFIG[itemId].name}!`);
    try{const r=await gardenService.useItem(itemId);if(r?.inventory)setInv({...DEFAULT_INV,...r.inventory});else setInv(p=>({...p,[itemId]:(p[itemId]||0)-1}));}
    catch{setInv(p=>({...p,[itemId]:(p[itemId]||0)-1}));}
  };
  const doEarn = (n) => { const nd=Math.min(WATER_MAX,drops+n);setDrops(nd);saveWater(uid,nd);gardenService.syncWater(nd).catch(()=>{});setShowQuiz(false);toast_('Nhận +1 💧'); };
  const doRemove = async () => { const idx=confirmDel;setConfirmDel(null);const pg=garden;
    setGarden(g=>({...g,slots:g.slots.map(s=>s.index===idx?{...s,plant:null}:s)}));delete sync.current[idx];
    try{await gardenService.remove(idx);toast_('Đã xóa');}catch(e){setGarden(pg);toast_(e.message);}
  };
  const doBuy = async (itemId) => {
    const item=ITEM_CONFIG[itemId];if((userCoins||0)<item.price)return;
    try{const r=await gardenService.buyItem(itemId);if(r?.inventory)setInv({...DEFAULT_INV,...r.inventory});if(r?.coins!==undefined)setUserCoins(r.coins);else setUserCoins(c=>c-item.price);toast_(`Mua ${item.name}!`);}
    catch(e){toast_(e.message);}
  };
  const doUse = async (itemId) => {
    if((inv[itemId]||0)<=0)return;setInv(p=>({...p,[itemId]:(p[itemId]||0)-1}));
    try{const r=await gardenService.useItem(itemId);if(r?.inventory)setInv({...DEFAULT_INV,...r.inventory});toast_(`Dùng ${ITEM_CONFIG[itemId]?.name}!`);}
    catch(e){setInv(p=>({...p,[itemId]:(p[itemId]||0)+1}));toast_(e.message);}
  };

  const planted = slots.filter(s=>s.plant).length;
  const ready = slots.filter(s=>s.plant&&getDisplay(s).progress>=100).length;
  const hasFert = inv.basic_fertilizer>0||inv.premium_fertilizer>0||inv.miracle_fertilizer>0;

  const fp = facingSlot?.plant; const fc = fp?cfg[fp.plantType]:null; const fd = facingSlot?getDisplay(facingSlot):null;
  const hint = fertMode
    ? `Đi đến ô cây, nhấn E để bón`
    : facingSlot && fp
      ? (fd?.progress >= 100
          ? `${fc?.name} — nhấn E thu hoạch! 🎉`
          : drops > 0
            ? `${fc?.name} — nhấn E tưới nước 💧`
            : `${fc?.name} — hết nước, làm quiz để nhận 💧`)
    : facingSlot && !fp
      ? 'Nhấn E để trồng cây 🌱'
    : 'WASD di chuyển · E tương tác';

  if (!userAuth?.user) return (<div className="farm-wrap"><div id="sky"><div className="sky-cloud" style={{'--cy':'8%','--dur':'52s','--delay':'0s'}}/><div className="sky-cloud" style={{'--cy':'16%','--dur':'70s','--delay':'-20s'}}/><div className="sky-cloud" style={{'--cy':'4%','--dur':'60s','--delay':'-40s'}}/></div><div style={{position:'relative',zIndex:5,display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}><div className="modal-card"><h1>🌱 Chưa đăng nhập</h1><p className="lang-sub">Đăng nhập để chơi!</p><button className="primary-btn" onClick={onBack}>Về trang chủ</button></div></div></div>);
  if (error) return (<div className="farm-wrap"><div id="sky"/><div style={{position:'relative',zIndex:5,display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}><div className="modal-card"><p style={{color:'var(--barn-red)'}}>{error}</p><button className="primary-btn" onClick={load}>Thử lại</button></div></div></div>);

  return (
    <div className="farm-wrap">
      {/* Sky */}
      <div id="sky">
        <div className="sky-cloud" style={{'--cy':'8%','--dur':'52s','--delay':'0s'}}/>
        <div className="sky-cloud" style={{'--cy':'16%','--dur':'70s','--delay':'-20s'}}/>
        <div className="sky-cloud" style={{'--cy':'4%','--dur':'60s','--delay':'-40s'}}/>
      </div>

      {/* Farm canvas (CSS grid代替canvas) */}
      <div className="farm-canvas-wrap">
        <svg viewBox={`0 0 ${COLS*TILE} ${ROWS*TILE}`} className="farm-canvas-svg">
          {/* Ground tiles */}
          {Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>{
            const t=tileAt(x,y); const px=x*TILE, py=y*TILE;
            if(t==='C') return <rect key={`${x},${y}`} x={px} y={py} width={TILE} height={TILE} fill="#6d4c33" stroke="#4a3220" strokeWidth={1.5}/>;
            if(t==='P') return <rect key={`${x},${y}`} x={px} y={py} width={TILE} height={TILE} fill="#d8b384"/>;
            const variant = (x*7+y*13)%5===0;
            return <rect key={`${x},${y}`} x={px} y={py} width={TILE} height={TILE} fill={variant?'#83c04a':'#8fc94e'}/>;
          })).flat()}

          {/* Grass tufts */}
          {Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>{
            if(tileAt(x,y)==='C'||tileAt(x,y)==='P')return null;
            const seed=(x*31+y*17)%9; if(seed!==0)return null;
            const px=x*TILE, py=y*TILE;
            return <g key={`tuft-${x}-${y}`} opacity={0.4}>
              {[0,1,2].map(i=>{const bx=px+10+i*8;return <path key={i} d={`M${bx},${py+TILE-6} Q${bx+2},${py+TILE-16} ${bx+(i-1)*3},${py+TILE-22}`} stroke="rgba(48,90,30,0.45)" strokeWidth={2} fill="none"/>;})}
            </g>;
          })).flat()}

          {/* Decorations */}
          {Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>{
            const t=tileAt(x,y); if(t==='.'||t==='P'||t==='C')return null;
            return <FarmTileSVG key={`deco-${x}-${y}`} type={t} x={x} y={y}/>;
          })).flat()}

          {/* Crop plot lines */}
          {Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>{
            if(tileAt(x,y)!=='C')return null;
            const px=x*TILE+TILE/2, py=y*TILE+TILE/2;
            return <g key={`plot-${x}-${y}`} opacity={0.5}>
              {[0,1,2].map(i=><line key={i} x1={px-16} y1={py+i*6-6} x2={px+16} y2={py+i*6-6} stroke="#4a3220" strokeWidth={1}/>)}
            </g>;
          })).flat()}

          {/* Plants on crop plots */}
          {CROP_POSITIONS.map((cp, i) => {
            const slot = cropMap[`${cp.x},${cp.y}`];
            if (!slot?.plant) return null;
            const { progress } = getDisplay(slot);
            const c = cfg[slot.plant.plantType]; if (!c) return null;
            const isReady = progress >= 100;
            const si = isReady ? c.stageCount-1 : Math.min(c.stageCount-1, Math.floor((progress/100)*(c.stageCount-1)));
            const cx = cp.x*TILE+TILE/2, cy = cp.y*TILE+TILE/2;
            // PlantArt viewBox 120×140, explicit width/height 120×140
            // Scale 0.34 → 40.8×47.6px (fits 48px tile)
            // Soil at viewBox (60,123.5) → screen: 60*0.34+tx=cx, 123.5*0.34+ty=cy+4
            const s = 0.34, tx = cx - 20, ty = cy - 38;
            return <g key={`plant-${i}`}>
              <g transform={`translate(${tx},${ty}) scale(${s})`}>
                <PlantArt plantId={slot.plant.plantType} stageIdx={si} totalStages={c.stageCount} isReady={isReady} plantConfig={cfg} />
              </g>
              {/* progress bar — in tile coords */}
              {!isReady && <g transform={`translate(${cx-20},${cy+16})`}>
                <rect x={0} y={0} width={40} height={4} rx={2} fill="#4a3220"/>
                <rect x={0} y={0} width={Math.max(2,progress*0.4)} height={4} rx={2} fill="#4c8c3a"/>
              </g>}
              {isReady && <text x={cx} y={cy-16} textAnchor="middle" fontSize={10} fill="#fff" fontWeight="bold">✅</text>}
            </g>;
          })}

          {/* Fence */}
          <rect x={2} y={2} width={COLS*TILE-4} height={ROWS*TILE-4} fill="none" stroke="#8a5a34" strokeWidth={3} rx={4}/>

          {/* Player */}
          <g transform={`translate(${playerPos.x - TILE/2},${playerPos.y - TILE/2})`}>
            <ellipse cx={TILE/2} cy={TILE-4} rx={12} ry={4} fill="rgba(0,0,0,0.18)"/>
            <foreignObject x={0} y={-8} width={TILE} height={TILE+8} style={{overflow:'visible'}}>
              <div xmlns="http://www.w3.org/1999/xhtml" style={{width:TILE,height:TILE,transform:playerDir==='left'?'scaleX(-1)':'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <AvatarPlayer moving={!!(dpadDir.current || keysHeld.current.size)} userAuth={userAuth}/>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* HUD — exact Farmgame.html style */}
      <header id="hud">
        <div className="hud-pill" id="coin-pill">
          <span className="hud-icon">🌾</span>
          <span>{userCoins.toLocaleString()}</span>
        </div>
        <div className="hud-title">🌿 Khu vườn</div>
        <div className="hud-pill" id="energy-pill">
          <span className="hud-icon">💧</span>
          <span>{drops}</span>
        </div>
      </header>

      {/* Hint bubble */}
      <div className="farm-hint-wrap">
        <div className="hint-bubble" style={{ display:'block' }}>{hint}</div>
      </div>

      {/* Action bar — Farmgame.html style + exit button */}
      <footer id="action-bar">
        <button className="round-btn" onClick={onBack} title="Thoát">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
        <button className="round-btn" onClick={()=>setShowInv(true)} title="Kho đồ">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </button>
        <button className="round-btn" onClick={()=>setShowQuiz(true)} title="Quiz nhận nước">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
        </button>
        <button className="round-btn" onClick={()=>setShowShop(true)} title="Cửa hàng">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        </button>
      </footer>

      {/* Mobile d-pad */}
      <div className="mobile-dpad">
        <div className="mobile-dpad-grid">
          <div/>
          <button className="mobile-dpad-btn mobile-dpad-up"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:0,y:-1};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}
            onPointerCancel={()=>{dpadDir.current=null;}}>▲</button>
          <div/>
          <button className="mobile-dpad-btn mobile-dpad-left"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:-1,y:0};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}
            onPointerCancel={()=>{dpadDir.current=null;}}>◀</button>
          <button className="mobile-dpad-btn mobile-dpad-center"
            onPointerDown={(e)=>{e.preventDefault();interact();}}>E</button>
          <button className="mobile-dpad-btn mobile-dpad-right"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:1,y:0};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}
            onPointerCancel={()=>{dpadDir.current=null;}}>▶</button>
          <div/>
          <button className="mobile-dpad-btn mobile-dpad-down"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:0,y:1};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}
            onPointerCancel={()=>{dpadDir.current=null;}}>▼</button>
          <div/>
        </div>
      </div>

      {/* Desktop d-pad */}
      <div className="desktop-dpad">
        <div className="desktop-dpad-grid">
          <div/>
          <button className="desktop-dpad-btn desktop-dpad-up"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:0,y:-1};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}>▲</button>
          <div/>
          <button className="desktop-dpad-btn desktop-dpad-left"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:-1,y:0};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}>◀</button>
          <button className="desktop-dpad-btn desktop-dpad-center"
            onPointerDown={(e)=>{e.preventDefault();interact();}}>E</button>
          <button className="desktop-dpad-btn desktop-dpad-right"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:1,y:0};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}>▶</button>
          <div/>
          <button className="desktop-dpad-btn desktop-dpad-down"
            onPointerDown={(e)=>{e.preventDefault();dpadDir.current={x:0,y:1};}}
            onPointerUp={()=>{dpadDir.current=null;}}
            onPointerLeave={()=>{dpadDir.current=null;}}>▼</button>
          <div/>
        </div>
      </div>

      {/* Modals */}
      {showShop && <SeedShop userCoins={userCoins} onSelect={doPlant} onClose={()=>{setShowShop(false);setSelSlot(null);}} plantConfig={cfg}/>}
      {showInv && <InventoryModal userCoins={userCoins} inventory={inv} onBuy={doBuy} onUse={doUse} onSelectFert={id=>{setShowInv(false);setFertMode(id);}} onClose={()=>setShowInv(false)}/>}
      {harvestR && <HarvestModal plantType={harvestR} onConfirm={()=>setHarvestR(null)} onClose={()=>setHarvestR(null)} plantConfig={cfg}/>}
      {showQuiz && <QuizModal onEarn={doEarn} onClose={()=>setShowQuiz(false)}/>}
      <ConfirmDialog open={confirmDel!==null} title="Xóa cây?" msg="Không thể hoàn tác." onYes={doRemove} onNo={()=>setConfirmDel(null)}/>
      <ToastFarm msg={toast} onDone={()=>setToast(null)}/>
    </div>
  );
}
