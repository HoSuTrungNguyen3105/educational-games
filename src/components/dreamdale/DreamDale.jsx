import React, { useEffect, useRef, useState, useCallback } from 'react'
import Scene from './components/Scene.jsx'
import HUD from './components/HUD.jsx'
import ActionButtons from './components/ActionButtons.jsx'
import BlacksmithModal from './components/BlacksmithModal.jsx'
import ExchangeModal from './components/ExchangeModal.jsx'

const SPEED = 0.12
const NEAR_DIST = 2.5

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
  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState(1)
  const [openModal, setOpenModal] = useState(null)
  const [nearby, setNearby] = useState({ blacksmith: false, market: false })
  const [resources, setResources] = useState({ wood: 25, stone: 18, coins: 42 })
  const [swordLevel, setSwordLevel] = useState(1)
  const [level] = useState(2)
  const [xp] = useState(135)
  const [xpNeeded] = useState(200)

  const playerName = userAuth?.user?.name || 'Bạn'

  useEffect(() => {
    const down = (e) => {
      keysRef.current[e.key.toLowerCase()] = true
    }
    const up = (e) => {
      keysRef.current[e.key.toLowerCase()] = false
    }
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
      let dx = 0
      let dz = 0

      if (keys['arrowup'] || keys['w']) dz -= 1
      if (keys['arrowdown'] || keys['s']) dz += 1
      if (keys['arrowleft'] || keys['a']) dx -= 1
      if (keys['arrowright'] || keys['d']) dx += 1

      const mag = Math.hypot(dx, dz)
      const moving = mag > 0.05 && !openModal

      if (moving) {
        dx /= mag
        dz /= mag

        playerPos.current.x += dx * SPEED
        playerPos.current.z += dz * SPEED

        playerPos.current.x = Math.max(-28, Math.min(28, playerPos.current.x))
        playerPos.current.z = Math.max(-28, Math.min(28, playerPos.current.z))

        setWalking(true)
        if (dx > 0.1) setFacing(-1)
        else if (dx < -0.1) setFacing(1)

        const bs = BUILDING_POS.blacksmith
        const mk = BUILDING_POS.market
        setNearby({
          blacksmith: dist3(playerPos.current, bs) < NEAR_DIST,
          market: dist3(playerPos.current, mk) < NEAR_DIST,
        })
      } else {
        setWalking(false)
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [openModal])

  const handleForge = useCallback((cost) => {
    setResources((r) => ({ ...r, wood: r.wood - cost.wood, stone: r.stone - cost.stone }))
    setSwordLevel((l) => l + 1)
  }, [])

  const handleExchange = useCallback((stoneSpent, coinsGained) => {
    setResources((r) => ({
      ...r,
      stone: r.stone - stoneSpent,
      coins: r.coins + coinsGained,
    }))
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Scene
        playerPos={playerPos}
        walking={walking}
        facing={facing}
        avatarSvg={avatarSvg}
        avatarUrl={avatarUrl}
        playerName={playerName}
        onNearBuilding={setNearby}
      />

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

      <div style={{
        position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 600,
        textShadow: '0 1px 4px rgba(0,0,0,0.6)', textAlign: 'center', width: '90%',
        pointerEvents: 'none', zIndex: 10,
      }}>
        WASD / mũi tên để di chuyển · Đi tới gần toà nhà rồi bấm để tương tác
      </div>

      {nearby.blacksmith && !openModal && (
        <button
          onClick={() => setOpenModal('blacksmith')}
          style={{
            position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #ffbf47, #e08a1e)', color: '#4a2c00',
            border: 'none', borderRadius: 14, padding: '10px 24px', fontWeight: 800,
            fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 0 #a35f10, 0 6px 12px rgba(0,0,0,0.3)',
            zIndex: 20, animation: 'pulse 1.5s infinite',
          }}
        >
          ⚒️ Vào lò rèn
        </button>
      )}

      {nearby.market && !openModal && (
        <button
          onClick={() => setOpenModal('exchange')}
          style={{
            position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #ffbf47, #e08a1e)', color: '#4a2c00',
            border: 'none', borderRadius: 14, padding: '10px 24px', fontWeight: 800,
            fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 0 #a35f10, 0 6px 12px rgba(0,0,0,0.3)',
            zIndex: 20, animation: 'pulse 1.5s infinite',
          }}
        >
          🏪 Vào chợ
        </button>
      )}

      {openModal === 'blacksmith' && (
        <BlacksmithModal
          resources={resources}
          swordLevel={swordLevel}
          onForge={handleForge}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'exchange' && (
        <ExchangeModal
          resources={resources}
          onExchange={handleExchange}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  )
}
