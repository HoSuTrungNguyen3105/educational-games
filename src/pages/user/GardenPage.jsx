import { useState, useEffect, useCallback, useRef } from 'react';
import { gardenService, API_BASE } from '../../services/api.js';
import GardenCanvas from '../../components/garden/GardenCanvas.jsx';
// SeedShop và HarvestModal vẫn hiển thị cây bằng PlantArt.
import { PlantArt } from '../../components/garden/PlantArt.jsx';
import '../../farmgame.css';

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

  // Đồng bộ mốc thời gian đếm tiến độ cây từ server
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

  const getDisplay = useCallback((slot) => {
    const plant = slot?.plant; if (!plant) return { progress:0, remainingMs:0 };
    const c = cfg[plant.plantType]; if (!c) return { progress:plant.progress||0, remainingMs:0 };
    const s = sync.current[slot.index]||{ p:plant.progress||0, at:Date.now() };
    if (plant.isReady||s.p>=100) return { progress:100, remainingMs:0 };
    const el = Date.now()-s.at; const g = (el/c.growthTime)*100;
    const progress = Math.min(100, s.p+g);
    return { progress, remainingMs: Math.max(0, c.growthTime*(1-progress/100)) };
  }, [cfg]);

  // Chạm vào ô đất: trồng / tưới / thu hoạch — tương tác theo ô, không cần đi bộ
  const onPlotTap = useCallback((slot) => {
    setSelSlot(slot);
    const { progress } = getDisplay(slot);
    if (!slot.plant) setShowShop(true);
    else if (progress >= 100) doHarvest(slot.index);
    else if (drops > 0) doWater(slot.index);
    else setShowQuiz(true);
  }, [getDisplay, drops]);

  // Phím E tác động ô đang chọn (tương đương chạm)
  const interact = useCallback(() => {
    if (!selSlot) return;
    const { progress } = getDisplay(selSlot);
    if (!selSlot.plant) setShowShop(true);
    else if (progress >= 100) doHarvest(selSlot.index);
    else if (drops > 0) doWater(selSlot.index);
    else setShowQuiz(true);
  }, [selSlot, getDisplay, drops]);

  // keyboard
  useEffect(() => {
    const onK = (e) => {
      const k = e.key.toLowerCase();
      if (showShop || showInv || showQuiz || harvestR || confirmDel) return;
      if (k === 'e' || k === ' ') { e.preventDefault(); interact(); return; }
    };
    window.addEventListener('keydown', onK);
    return () => window.removeEventListener('keydown', onK);
  }, [interact, showShop, showInv, showQuiz, harvestR, confirmDel]);


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

  const fp = selSlot?.plant; const fc = fp?cfg[fp.plantType]:null; const fd = selSlot?getDisplay(selSlot):null;
  const hint = fertMode
    ? `Chọn ô cây để bón phân 🌱`
    : selSlot && fp
      ? (fd?.progress >= 100
          ? `${fc?.name} — chạm để thu hoạch! 🎉`
          : drops > 0
            ? `${fc?.name} — chạm để tưới nước 💧`
            : `${fc?.name} — hết nước, làm quiz để nhận 💧`)
    : selSlot && !fp
      ? 'Chạm ô đất để trồng cây 🌱'
    : 'Chạm vào ô đất để trồng · tưới · thu hoạch';

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

      {/* Ruộng đồng isometric — trang bịa y theo nong-trai-vui.html */}
      <GardenCanvas
        slots={slots}
        cfg={cfg}
        getDisplay={getDisplay}
        selectedIndex={selSlot?.index ?? null}
        onSelectPlot={onPlotTap}
        onLockedPlot={() => toast_('Ô đất này chưa mở khoá 🔒')}
      />

      {/* HUD — bám sát nong-trai-vui.html: pill bên trái, tiền + nước bên phải */}
      <header id="hud">
        <div className="hud-pill" id="lvl-pill">
          <span className="hud-icon">🌱</span>
          <span>{planted}/{slots.length}</span>
          <span style={{ opacity: 0.7, fontSize: '0.8em' }}>đã trồng</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="hud-pill" id="coin-pill">
            <span className="hud-icon">🌾</span>
            <span>{userCoins.toLocaleString()}</span>
          </div>
          <div className="hud-pill" id="energy-pill">
            <span className="hud-icon">💧</span>
            <span>{drops}</span>
          </div>
        </div>
      </header>

      {/* Hint bubble */}
      <div className="farm-hint-wrap">
        <div className="hint-bubble" style={{ display:'block' }}>{hint}</div>
      </div>

      {/* Rail nút bên phải — giống #side / .fab của nong-trai-vui.html */}
      <div className="g-rail">
        <button className="round-btn" onClick={onBack} title="Thoát">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
        <button className="g-fab" onClick={()=>setShowShop(true)} title="Cửa hàng hạt giống">
          <span className="ic">🌱</span>
          <span className="tx">Hạt</span>
        </button>
        <button className="g-fab" onClick={()=>setShowInv(true)} title="Kho đồ">
          <span className="ic">🎒</span>
          <span className="tx">Kho</span>
          {hasFert && <span className="dot on" aria-hidden="true" />}
        </button>
        <button className="g-fab" onClick={()=>setShowQuiz(true)} title="Quiz nhận nước">
          <span className="ic">🧠</span>
          <span className="tx">Quiz</span>
          {drops <= 0 && <span className="dot on" aria-hidden="true" />}
        </button>
      </div>

      {/* Thanh dưới: dải ô đất — dữ liệu cây lấy thẳng từ API (garden.slots) */}
      <footer className="g-bar">
        <div className="g-slots">
          {slots.map((slot) => {
            const d = getDisplay(slot);
            const c = slot.plant ? cfg[slot.plant.plantType] : null;
            const isReady = !!slot.plant && d.progress >= 100;
            const sel = selSlot?.index === slot.index;
            return (
              <button
                key={slot.index}
                className={`g-slot${sel ? ' sel' : ''}${!slot.plant ? ' lock' : ''}`}
                title={c ? `${c.name}${isReady ? ' — sẵn sàng thu hoạch' : ` — ${fmtTime(d.remainingMs)}`}` : 'Ô trống'}
                onClick={() => { setSelSlot(slot); if (!slot.plant) setShowShop(true); }}
              >
                <span className="em">{isReady ? '✅' : (slot.plant ? '🌿' : '🕳')}</span>
                <span className="lb">{c ? c.name : `Ô ${slot.index + 1}`}</span>
                {slot.plant && !isReady && (
                  <span className="meter"><b style={{ width: `${d.progress}%` }} /></span>
                )}
              </button>
            );
          })}
          {slots.length === 0 && <p style={{ color: 'var(--paper)', fontWeight: 700, padding: '10px 6px' }}>Đang tải ô đất…</p>}
        </div>
      </footer>

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
