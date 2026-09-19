import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import './DreamDale.css'
import FarmGame from './components/FarmGame.jsx'

const FARM_POS = [{ cols: 4, rows: 3 }]
import HUD from './components/HUD.jsx'
import ActionButtons from './components/ActionButtons.jsx'
import MobileDPad from './components/MobileDPad.jsx'
import BlacksmithModal from './components/BlacksmithModal.jsx'
import ExchangeModal from './components/ExchangeModal.jsx'
import FarmModal from './components/FarmModal.jsx'
import { gardenService, coinService } from '../../services/api.js'

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

export default function DreamDale({ userAuth, avatarSvg, avatarUrl }) {
  const [openModal, setOpenModal] = useState(null)
  const [nearby, setNearby] = useState({ blacksmith: false, market: false, farmIdx: -1 })
  const [resources, setResources] = useState({ wood: 25, stone: 18, coins: 0 })
  const [swordLevel, setSwordLevel] = useState(1)
  const [level] = useState(2)
  const [xp, setXp] = useState(135)
  const [xpNeeded] = useState(200)
  const [touchDirection, setTouchDirection] = useState({ x: 0, z: 0 })

  // API states
  const [garden, setGarden] = useState(null)
  const [plantConfig, setPlantConfig] = useState(FALLBACK_PLANT_CONFIG)
  const [userCoins, setUserCoins] = useState(0)
  const sync = useRef({})

  const [interactingFarm, setInteractingFarm] = useState({ farmIdx: -1, cell: null })
  const [floatingTexts, setFloatingTexts] = useState([])
  const floatingId = useRef(0)

  const playerName = userAuth?.user?.name || 'Bạn'

  const loadGarden = useCallback(async () => {
    try {
      const [g, pt, coinRes] = await Promise.all([
        gardenService.get(), 
        gardenService.getPlantTypes().catch(()=>null),
        coinService.get().catch(()=>null)
      ]);
      if (g) {
        setGarden(g);
        (g.slots||[]).forEach(s=>{ if(s.plant) sync.current[s.index] = { p:s.plant.progress||0, at:Date.now() }; else delete sync.current[s.index]; });
      }
      if (pt?.types) setPlantConfig(buildPlantConfig(pt.types));
      const coins = coinRes?.coins || 0;
      setUserCoins(coins);
      setResources(prev => ({...prev, coins}));
    } catch(e) { console.error('Lỗi tải khu vườn', e); }
  }, []);

  useEffect(()=>{loadGarden();},[loadGarden]);

  const addFloatingText = useCallback((text, color = '#fff') => {
    const id = floatingId.current++
    setFloatingTexts(prev => [...prev, { id, text, color, createdAt: Date.now() }])
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== id))
    }, 1200)
  }, [])

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t+1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate realtime progress for Phaser render
  const farmCrops = useMemo(() => {
    const crops = [{}, {}];
    if (garden?.slots) {
      garden.slots.forEach(s => {
        if (s.index < 12) {
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
    setTouchDirection({ x: dir.x, z: dir.z })
  }, [])

  const handleTouchRelease = useCallback(() => {
    setTouchDirection({ x: 0, z: 0 })
  }, [])

  // Handle building clicks from Phaser canvas
  const handleNearbyChange = useCallback((type) => {
    if (type === 'blacksmith') {
      setOpenModal('blacksmith')
    } else if (type === 'market') {
      setOpenModal('exchange')
    }
  }, [])

  // Handle movement/proximity changes from Phaser
  const handleMovementChange = useCallback((data) => {
    setNearby({
      blacksmith: data.nearBlacksmith,
      market: data.nearMarket,
      farmIdx: data.nearFarmIdx,
    })
  }, [])

  const handleForge = useCallback((cost) => {
    setResources(r => ({ ...r, wood: r.wood - cost.wood, stone: r.stone - cost.stone }))
    setSwordLevel(l => l + 1)
    addFloatingText('⚒️ Kiếm +1!', '#ffd700')
  }, [addFloatingText])

  const handleExchange = useCallback(async (stoneSpent, coinsGained) => {
    setResources(r => ({ ...r, stone: r.stone - stoneSpent, coins: r.coins + coinsGained }))
    setUserCoins(c => c + coinsGained)
    addFloatingText(`+${coinsGained} 🪙`, '#ffd700')
    
    try {
      const r = await coinService.add(coinsGained)
      if (r?.coins !== undefined) {
        setUserCoins(r.coins)
        setResources(prev => ({ ...prev, coins: r.coins }))
      }
    } catch(e) {
      console.error('Lỗi sync xu', e)
    }
  }, [addFloatingText])

  const handleFarmCellClick = useCallback(async (farmIdx, cell) => {
    if (farmIdx !== 0) {
      addFloatingText('Ô này chưa mở khóa!', '#ff5555');
      return;
    }
    const slotIndex = cell.row * FARM_POS[0].cols + cell.col;
    if (slotIndex >= 10) {
      addFloatingText('Ô này chưa mở khóa!', '#ff5555');
      return;
    }

    if (cell.existing) {
      if (cell.existing.progress >= 100) {
        const yieldCoins = cell.existing.config?.harvestCoin || 10;
        const pg = garden;
        setGarden(g=>g?({...g,slots:g.slots.map(s=>s.index===slotIndex?{...s,plant:null}:s)}):g);
        delete sync.current[slotIndex];
        
        try {
          const r = await gardenService.harvest(slotIndex);
          if (!r?.success) throw new Error(r?.message);
          if (r.coins !== undefined) {
            setUserCoins(r.coins);
            setResources(prev => ({ ...prev, coins: r.coins }));
          } else {
            setUserCoins(c => c + yieldCoins);
            setResources(prev => ({ ...prev, coins: prev.coins + yieldCoins }));
          }
          setXp(x => x + 5);
          addFloatingText(`+${yieldCoins} 🪙`, '#ffd700');
          loadGarden();
        } catch(e) {
          setGarden(pg);
          addFloatingText('Lỗi thu hoạch', '#ff5555');
        }
      } else {
        addFloatingText('Chưa chín!', '#aaaaaa');
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
      addFloatingText('Không đủ coin!', '#ff5555');
      return;
    }

    setOpenModal(null);
    const pg = garden, pc = userCoins;
    setGarden(g=>g?{...g,slots:g.slots.map(s=>s.index===slotIndex?{...s,plant:{plantType:plantId,progress:0,isReady:false}}:s)}:g);
    sync.current[slotIndex] = { p: 0, at: Date.now() };
    setUserCoins(v=>Math.max(0,v-config.seedPrice));
    setResources(r => ({ ...r, coins: Math.max(0,r.coins-config.seedPrice) }));
    addFloatingText('🌱 Đã trồng!', '#66bb6a')

    try {
      const r = await gardenService.plant(slotIndex, plantId);
      if(!r?.success) throw new Error(r?.message);
      if (r.coins !== undefined) {
        setUserCoins(r.coins);
        setResources(prev => ({ ...prev, coins: r.coins }));
      }
      loadGarden();
    } catch(e) {
      setGarden(pg);
      setUserCoins(pc);
      setResources(r => ({ ...r, coins: pc }));
      delete sync.current[slotIndex];
      addFloatingText('Lỗi trồng', '#ff5555');
    }
  }, [interactingFarm, addFloatingText, plantConfig, garden, userCoins, loadGarden])

  return (
    <div className="dd-game">
      <div className="dd-canvas-wrap">
        <FarmGame
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

      {floatingTexts.map(ft => (
        <FloatingText key={ft.id} text={ft.text} color={ft.color} />
      ))}

      <div className="dd-hint-desktop">Click vào các ô đất để trồng cây!</div>
      <div className="dd-hint-mobile">Chạm vào màn hình để thao tác</div>

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
