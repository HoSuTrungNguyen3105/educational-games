import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import './DreamDale.css'
import Scene, { FARM_POS } from './components/Scene.jsx'
import HUD from './components/HUD.jsx'
import ActionButtons from './components/ActionButtons.jsx'
import MobileDPad from './components/MobileDPad.jsx'
import BlacksmithModal from './components/BlacksmithModal.jsx'
import ExchangeModal from './components/ExchangeModal.jsx'
import FarmModal from './components/FarmModal.jsx'
import { gardenService, API_BASE } from '../../services/api.js'

const SPEED = 0.065
const NEAR_DIST = 2.5
const FARM_NEAR_DIST = 2.0

const FALLBACK_PLANT_CONFIG = {
  sunflower: { name: 'Hoa hướng dương', kind: 'bloom', stageCount: 3, growthTime: 5*60*1000, harvestCoin: 20, seedPrice: 5, rarity: 'common' },
  apple: { name: 'Cây táo', kind: 'fruitTree', stageCount: 4, growthTime: 30*60*1000, harvestCoin: 50, seedPrice: 15, rarity: 'common' },
  cherry: { name: 'Cây anh đào', kind: 'bloom', stageCount: 3, growthTime: 2*60*60*1000, harvestCoin: 120, seedPrice: 40, rarity: 'rare' },
  oak: { name: 'Cây cổ thụ', kind: 'fruitTree', stageCount: 3, noFruit: true, growthTime: 12*60*60*1000, harvestCoin: 500, seedPrice: 150, rarity: 'epic' },
  magic: { name: 'Cây thần kỳ', kind: 'aura', stageCount: 4, growthTime: 24*60*60*1000, harvestCoin: 1000, seedPrice: 400, rarity: 'legendary' },
};

function buildPlantConfig(apiTypes) {
  if (!apiTypes?.length) return FALLBACK_PLANT_CONFIG;
  const c = {};
  for (const t of apiTypes) c[t.id] = { name:t.name, kind:t.kind||'bloom', stageCount:t.stages||3, growthTime:t.growthTime||300000, harvestCoin:t.harvestCoin||10, seedPrice:t.seedPrice||5, rarity:t.rarity||'common', palette:t.palette };
  return c;
}

function dist3(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z)
}

const BUILDING_POS = {
  blacksmith: { x: 4, z: 2 },
  market: { x: 6, z: 7 },
}

export default function DreamDale({ userAuth, avatarSvg, avatarUrl }) {
  const playerPos = useRef({ x: 0, y: 0, z: 6 })
  const keysRef = useRef({})
  const touchDir = useRef({ x: 0, z: 0 })

  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState(1)
  const [openModal, setOpenModal] = useState(null)
  const [nearby, setNearby] = useState({ blacksmith: false, market: false, farmIdx: -1 })
  const [resources, setResources] = useState({ wood: 25, stone: 18, coins: 0 })
  const [swordLevel, setSwordLevel] = useState(1)
  const [level] = useState(2)
  const [xp, setXp] = useState(135)
  const [xpNeeded] = useState(200)

  // API states
  const [garden, setGarden] = useState(null)
  const [plantConfig, setPlantConfig] = useState(FALLBACK_PLANT_CONFIG)
  const [userCoins, setUserCoins] = useState(0)
  const sync = useRef({})

  // Mapping API slots (0-9) to DreamDale plot 0 (4x3=12) cells
  const [interactingFarm, setInteractingFarm] = useState({ farmIdx: -1, cell: null })
  const [floatingTexts, setFloatingTexts] = useState([])
  const floatingId = useRef(0)

  const playerName = userAuth?.user?.name || 'Bạn'

  const loadGarden = useCallback(async () => {
    try {
      const [g, pt] = await Promise.all([gardenService.get(), gardenService.getPlantTypes().catch(()=>null)]);
      if (g) {
        setGarden(g);
        (g.slots||[]).forEach(s=>{ if(s.plant) sync.current[s.index] = { p:s.plant.progress||0, at:Date.now() }; else delete sync.current[s.index]; });
      }
      if (pt?.types) setPlantConfig(buildPlantConfig(pt.types));
      const auth = JSON.parse(localStorage.getItem('edu_games_auth')||'{}');
      if (auth?.token) { const r = await fetch(`${API_BASE}/auth/me/coins`,{headers:{Authorization:`Bearer ${auth.token}`}}).then(r=>r.json()); if(r?.status) { setUserCoins(r.data.coins||0); setResources(prev => ({...prev, coins: r.data.coins||0})); } }
    } catch(e) { console.error('Lỗi tải khu vườn', e); }
  }, []);

  useEffect(()=>{loadGarden();},[loadGarden]);

  useEffect(() => {
    const down = (e) => { keysRef.current[e.key.toLowerCase()] = true }
    const up = (e) => { keysRef.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    let raf
    const tick = () => {
      const keys = keysRef.current
      let dx = 0, dz = 0

      if (keys['arrowup'] || keys['w']) dz -= 1
      if (keys['arrowdown'] || keys['s']) dz += 1
      if (keys['arrowleft'] || keys['a']) dx -= 1
      if (keys['arrowright'] || keys['d']) dx += 1

      if (touchDir.current.x !== 0 || touchDir.current.z !== 0) {
        dx = touchDir.current.x
        dz = touchDir.current.z
      }

      const mag = Math.hypot(dx, dz)
      const moving = mag > 0.05 && !openModal

      if (moving) {
        if (mag > 1) { dx /= mag; dz /= mag }

        playerPos.current.x += dx * SPEED
        playerPos.current.z += dz * SPEED

        playerPos.current.x = Math.max(-28, Math.min(28, playerPos.current.x))
        playerPos.current.z = Math.max(-28, Math.min(28, playerPos.current.z))

        setWalking(true)
        if (dx > 0.1) setFacing(-1)
        else if (dx < -0.1) setFacing(1)

        const pp = playerPos.current
        setNearby({
          blacksmith: dist3(pp, BUILDING_POS.blacksmith) < NEAR_DIST,
          market: dist3(pp, BUILDING_POS.market) < NEAR_DIST,
          farmIdx: FARM_POS.findIndex(fp => dist3(pp, { x: fp.x, z: fp.z }) < FARM_NEAR_DIST),
        })
      } else {
        setWalking(false)
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [openModal])

  const addFloatingText = useCallback((text, worldPos, color = '#fff') => {
    const id = floatingId.current++
    setFloatingTexts(prev => [...prev, { id, text, worldPos, color, createdAt: Date.now() }])
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== id))
    }, 1200)
  }, [])

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t+1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate realtime progress for 3D render
  const farmCrops = useMemo(() => {
    const crops = [{}, {}];
    if (garden?.slots) {
      garden.slots.forEach(s => {
        if (s.index < 12) {
          // Map to plot 0 (cols:4, rows:3). row = Math.floor(index/4), col = index%4
          const r = Math.floor(s.index / 4);
          const c = s.index % 4;
          if (s.plant) {
            const config = plantConfig[s.plant.plantType];
            const pSync = sync.current[s.index] || { p: s.plant.progress||0, at: Date.now() };
            let progress = 100;
            if (!s.plant.isReady && config) {
              const el = Date.now() - pSync.at;
              progress = Math.min(100, pSync.p + (el / config.growthTime) * 100);
            }
            crops[0][`${r}-${c}`] = {
              type: s.plant.plantType,
              stage: progress >= 100 ? 'grown' : progress > 40 ? 'growing' : 'seed',
              progress: progress,
              config: config
            };
          }
        }
      });
    }
    return crops;
  }, [garden, plantConfig, tick]);

  const handleTouchMove = useCallback((dir) => {
    touchDir.current = { x: dir.x, z: dir.z }
  }, [])

  const handleTouchRelease = useCallback(() => {
    touchDir.current = { x: 0, z: 0 }
  }, [])

  const handleForge = useCallback((cost) => {
    setResources(r => ({ ...r, wood: r.wood - cost.wood, stone: r.stone - cost.stone }))
    setSwordLevel(l => l + 1)
    addFloatingText('⚒️ Kiếm +1!', playerPos.current, '#ffd700')
  }, [addFloatingText])

  const handleExchange = useCallback((stoneSpent, coinsGained) => {
    setResources(r => ({ ...r, stone: r.stone - stoneSpent, coins: r.coins + coinsGained }))
    addFloatingText(`+${coinsGained} 🪙`, playerPos.current, '#ffd700')
  }, [addFloatingText])

  const handleFarmCellClick = useCallback(async (farmIdx, cell) => {
    // only farmIdx 0 is mapped to API slots
    if (farmIdx !== 0) {
      addFloatingText('Ô này chưa mở khóa!', playerPos.current, '#ff5555');
      return;
    }
    const slotIndex = cell.row * FARM_POS[0].cols + cell.col;
    if (slotIndex >= 10) {
      addFloatingText('Ô này chưa mở khóa!', playerPos.current, '#ff5555');
      return;
    }

    if (cell.existing) {
      if (cell.existing.progress >= 100) {
        // Harvest
        const yieldCoins = cell.existing.config?.harvestCoin || 10;
        const pg = garden;
        setGarden(g=>g?({...g,slots:g.slots.map(s=>s.index===slotIndex?{...s,plant:null}:s)}):g);
        delete sync.current[slotIndex];
        
        try {
          const r = await gardenService.harvest(slotIndex);
          if (!r?.success) throw new Error(r?.message);
          setResources(r => ({ ...r, coins: r.coins + yieldCoins }));
          setUserCoins(c => c + yieldCoins);
          setXp(x => x + 5);
          addFloatingText(`+${yieldCoins} 🪙`, playerPos.current, '#ffd700');
          loadGarden();
        } catch(e) {
          setGarden(pg);
          addFloatingText('Lỗi thu hoạch', playerPos.current, '#ff5555');
        }
      } else {
        addFloatingText('Chưa chín!', playerPos.current, '#aaaaaa');
      }
    } else {
      setInteractingFarm({ farmIdx, cell, slotIndex })
      setOpenModal('farm')
    }
  }, [addFloatingText, garden, loadGarden])

  const handlePlant = useCallback(async (plantId) => {
    const { slotIndex } = interactingFarm
    if (slotIndex === undefined || slotIndex < 0) return
    const config = plantConfig[plantId];
    if (!config) return;
    if (userCoins < config.seedPrice) {
      addFloatingText('Không đủ coin!', playerPos.current, '#ff5555');
      return;
    }

    setOpenModal(null);
    const pg = garden, pc = userCoins;
    setGarden(g=>g?{...g,slots:g.slots.map(s=>s.index===slotIndex?{...s,plant:{plantType:plantId,progress:0,isReady:false}}:s)}:g);
    sync.current[slotIndex] = { p: 0, at: Date.now() };
    setUserCoins(v=>Math.max(0,v-config.seedPrice));
    setResources(r => ({ ...r, coins: Math.max(0,r.coins-config.seedPrice) }));
    addFloatingText('🌱 Đã trồng!', playerPos.current, '#66bb6a')

    try {
      const r = await gardenService.plant(slotIndex, plantId);
      if(!r?.success) throw new Error(r?.message);
      loadGarden();
    } catch(e) {
      setGarden(pg);
      setUserCoins(pc);
      setResources(r => ({ ...r, coins: pc }));
      delete sync.current[slotIndex];
      addFloatingText('Lỗi trồng', playerPos.current, '#ff5555');
    }
  }, [interactingFarm, addFloatingText, plantConfig, garden, userCoins, loadGarden])

  return (
    <div className="dd-game">
      <div className="dd-canvas-wrap">
        <Scene
          playerPos={playerPos}
          walking={walking}
          facing={facing}
          avatarSvg={avatarSvg}
          avatarUrl={avatarUrl}
          playerName={playerName}
          farmCrops={farmCrops}
          onFarmCellClick={handleFarmCellClick}
        />
      </div>

      <HUD
        level={level}
        xp={xp}
        xpNeeded={xpNeeded}
        playerName={playerName}
        resources={resources}
      />

      <ActionButtons
        swordLevel={swordLevel}
        onOpenShop={() => setOpenModal('exchange')}
      />

      <MobileDPad onMove={handleTouchMove} onRelease={handleTouchRelease} />

      {floatingTexts.map(ft => (
        <FloatingText key={ft.id} text={ft.text} color={ft.color} />
      ))}

      <div className="dd-hint-desktop">WASD / mũi tên để di chuyển</div>
      <div className="dd-hint-mobile">Dùng joystick để di chuyển</div>

      {nearby.blacksmith && !openModal && (
        <button className="dd-interact-btn" onClick={() => setOpenModal('blacksmith')}>
          ⚒️ Vào lò rèn
        </button>
      )}
      {nearby.market && !openModal && (
        <button className="dd-interact-btn" onClick={() => setOpenModal('exchange')}>
          🏪 Vào chợ
        </button>
      )}
      {nearby.farmIdx >= 0 && !openModal && (
        <button className="dd-interact-btn dd-interact-farm" onClick={() => {
          const fp = FARM_POS[nearby.farmIdx]
          const farm = farmCrops[nearby.farmIdx] || {}
          const hasEmpty = Array.from({ length: fp.rows * fp.cols }).some((_, i) => !farm[i])
          setInteractingFarm({ farmIdx: nearby.farmIdx, cell: null })
          if (!hasEmpty) {
            setOpenModal('farm')
          } else {
            setOpenModal('farm')
          }
        }}>
          🌱 Vào vườn
        </button>
      )}

      {openModal === 'blacksmith' && (
        <BlacksmithModal resources={resources} swordLevel={swordLevel} onForge={handleForge} onClose={() => setOpenModal(null)} />
      )}
      {openModal === 'exchange' && (
        <ExchangeModal resources={resources} onExchange={handleExchange} onClose={() => setOpenModal(null)} />
      )}
      {openModal === 'farm' && (
        <FarmModal userCoins={userCoins} plantConfig={plantConfig} onPlant={handlePlant} onClose={() => setOpenModal(null)} />
      )}
    </div>
  )
}

function FloatingText({ text, color }) {
  return (
    <div className="dd-floating-text" style={{ color }}>
      {text}
    </div>
  )
}
