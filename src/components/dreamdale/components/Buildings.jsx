import React from 'react'
import { BUILDINGS } from './GameWorld.jsx'

export function House({ isNearby }) {
  const b = BUILDINGS.house
  return (
    <div className={`dd-building ${isNearby ? 'nearby' : ''}`} style={{ left: b.x, top: b.y }}>
      <div className="dd-building-label">🏠 Nhà</div>
      <div className="dd-house">
        <div className="dd-house-roof" />
        <div className="dd-house-body">
          <div className="dd-house-window left" />
          <div className="dd-house-window right" />
          <div className="dd-house-door" />
        </div>
      </div>
    </div>
  )
}

export function Blacksmith({ isNearby, onClick }) {
  const b = BUILDINGS.blacksmith
  return (
    <div
      className={`dd-building ${isNearby ? 'nearby' : ''}`}
      style={{ left: b.x, top: b.y }}
      onClick={onClick}
    >
      <div className="dd-building-label">⚒️ Vào lò rèn</div>
      <div className="dd-blacksmith">
        <div className="dd-blacksmith-roof" />
        <div className="dd-blacksmith-chimney" />
        <div className="dd-blacksmith-body">
          <div className="dd-blacksmith-forge">🔥</div>
          <div className="dd-blacksmith-anvil">🔨</div>
        </div>
      </div>
    </div>
  )
}

export function Market({ isNearby, onClick }) {
  const b = BUILDINGS.market
  return (
    <div
      className={`dd-building ${isNearby ? 'nearby' : ''}`}
      style={{ left: b.x, top: b.y }}
      onClick={onClick}
    >
      <div className="dd-building-label">🏪 Vào chợ</div>
      <div className="dd-market">
        <div className="dd-market-roof" />
        <div className="dd-market-body">
          <div className="dd-market-sign">🛒 Chợ</div>
        </div>
      </div>
    </div>
  )
}

export function NPC({ x, y, emoji, name }) {
  return (
    <div className="dd-npc" style={{ left: x, top: y }}>
      <div className="dd-npc-shadow" />
      <div className="dd-npc-avatar">{emoji}</div>
      <div className="dd-npc-label">{name}</div>
    </div>
  )
}
