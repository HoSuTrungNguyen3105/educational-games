import React, { useEffect, useRef, useState, useCallback } from 'react'
import TopBar from './components/TopBar.jsx'
import GameWorld, { WORLD_SIZE } from './components/GameWorld.jsx'
import { BlacksmithModal, BLACKSMITH_POS } from './components/Blacksmith.jsx'
import { ExchangeModal, EXCHANGE_POS } from './components/ExchangeShop.jsx'

const NEAR_DISTANCE = 140
const SPEED = 3.2

function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by)
}

export default function App() {
  const gameRef = useRef(null)
  const keysRef = useRef({})
  const worldOffsetRef = useRef({ x: -540, y: -620 })

  const [worldOffset, setWorldOffset] = useState({ x: -540, y: -620 })
  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState(1)
  const [openModal, setOpenModal] = useState(null) // 'blacksmith' | 'exchange' | null
  const [nearby, setNearby] = useState({ blacksmith: false, exchange: false })

  const [resources, setResources] = useState({ wood: 60, stone: 80, coins: 120 })
  const [swordLevel, setSwordLevel] = useState(1)

  // --- keyboard input ---
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

  // --- main movement / proximity loop ---
  useEffect(() => {
    let raf
    const tick = () => {
      const keys = keysRef.current
      let dx = 0
      let dy = 0
      if (keys['arrowup'] || keys['w']) dy += 1
      if (keys['arrowdown'] || keys['s']) dy -= 1
      if (keys['arrowleft'] || keys['a']) dx += 1
      if (keys['arrowright'] || keys['d']) dx -= 1

      const mag = Math.hypot(dx, dy)
      const moving = mag > 0.05 && !openModal

      if (moving) {
        dx /= mag
        dy /= mag

        const container = gameRef.current
        const vw = container ? container.clientWidth : 400
        const vh = container ? container.clientHeight : 750

        let { x, y } = worldOffsetRef.current
        x += dx * SPEED
        y += dy * SPEED

        const minX = -(WORLD_SIZE.width - vw / 2)
        const maxX = vw / 2
        const minY = -(WORLD_SIZE.height - vh / 2)
        const maxY = vh / 2
        x = Math.max(minX, Math.min(maxX, x))
        y = Math.max(minY, Math.min(maxY, y))

        worldOffsetRef.current = { x, y }
        setWorldOffset({ x, y })
        setWalking(true)
        if (dx > 0.15) setFacing(-1)
        else if (dx < -0.15) setFacing(1)

        // proximity check (player world position = viewport center - offset)
        const playerWorldX = vw / 2 - x
        const playerWorldY = vh / 2 - y
        setNearby({
          blacksmith:
            distance(playerWorldX, playerWorldY, BLACKSMITH_POS.x + 70, BLACKSMITH_POS.y + 60) <
            NEAR_DISTANCE,
          exchange:
            distance(playerWorldX, playerWorldY, EXCHANGE_POS.x + 70, EXCHANGE_POS.y + 60) <
            NEAR_DISTANCE,
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
    <div className="game" ref={gameRef}>
      <GameWorld
        worldOffset={worldOffset}
        walking={walking}
        facing={facing}
        nearBlacksmith={nearby.blacksmith}
        nearExchange={nearby.exchange}
        onOpenBlacksmith={() => setOpenModal('blacksmith')}
        onOpenExchange={() => setOpenModal('exchange')}
      />

      <TopBar resources={resources} />

      <div className="left-actions">
        <div className="action-btn" title="Cửa hàng">🏪<span className="badge">!</span></div>
        <div className="action-btn" title="Kiếm hiện tại">
          ⚔️<span className="up-arrow">{swordLevel}</span>
        </div>
      </div>

      <div className="hint">
        WASD / mũi tên để di chuyển. Đi tới gần lò rèn hoặc khu đổi đồ rồi bấm vào để tương tác.
      </div>

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
