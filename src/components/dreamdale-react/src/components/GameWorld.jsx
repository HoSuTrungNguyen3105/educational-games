import React from 'react'
import Riverbank from './Riverbank.jsx'
import { BlacksmithSprite } from './Blacksmith.jsx'
import { ExchangeSprite } from './ExchangeShop.jsx'
import Character from './Character.jsx'

export const WORLD_SIZE = { width: 1700, height: 2000 }

export default function GameWorld({
  worldOffset,
  walking,
  facing,
  nearBlacksmith,
  nearExchange,
  onOpenBlacksmith,
  onOpenExchange,
}) {
  return (
    <>
      <div
        className="world"
        style={{ transform: `translate(${worldOffset.x}px, ${worldOffset.y}px)` }}
      >
        <Riverbank />

        {/* paths connecting the buildings */}
        <div className="path" style={{ left: 350, top: 280, width: 170, height: 520 }} />
        <div className="path" style={{ left: 150, top: 520, width: 600, height: 170 }} />
        <div className="path" style={{ left: 420, top: 640, width: 160, height: 560 }} />

        <BlacksmithSprite nearby={nearBlacksmith} onClick={onOpenBlacksmith} />
        <ExchangeSprite nearby={nearExchange} onClick={onOpenExchange} />

        {/* decoration */}
        <div className="tree prop" style={{ left: 60, top: 380 }}>
          <div className="leaves" /><div className="trunk" />
        </div>
        <div className="tree prop" style={{ left: 660, top: 1010 }}>
          <div className="leaves" /><div className="trunk" />
        </div>
        <div className="bush prop" style={{ left: 700, top: 600 }} />
        <div className="bush prop" style={{ left: 60, top: 900 }} />
        <div className="rock prop" style={{ left: 60, top: 1080 }} />
        <div className="flower prop" style={{ left: 250, top: 900 }} />
        <div className="flower prop" style={{ left: 640, top: 850 }} />
      </div>

      <Character walking={walking} facing={facing} />
    </>
  )
}
