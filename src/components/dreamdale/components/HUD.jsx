import React from 'react'

export default function HUD({ level, xp, xpNeeded, playerName, resources }) {
  return (
    <div className="dd-hud">
      <div className="dd-level-badge">
        <span className="lv">{level}</span>
        <span className="lbl">LV</span>
      </div>
      <div className="dd-hud-center">
        <div className="dd-player-info">
          <span className="name">{playerName}</span>
        </div>
        <div className="dd-xp-row" style={{ background: 'var(--ui-bg)', borderRadius: 10, padding: '4px 10px' }}>
          <span className="dd-xp-label">XP</span>
          <div className="dd-xp-bar">
            <div className="dd-xp-fill" style={{ width: `${(xp / xpNeeded) * 100}%` }} />
          </div>
          <span className="dd-xp-text">{xp}/{xpNeeded}</span>
        </div>
      </div>
      <div className="dd-resources">
        <div className="dd-res">
          <span className="dd-res-icon dd-res-wood">🪵</span>
          {resources.wood}
        </div>
        <div className="dd-res">
          <span className="dd-res-icon dd-res-stone">🪨</span>
          {resources.stone}
        </div>
        <div className="dd-res">
          <span className="dd-res-icon dd-res-coin">🪙</span>
          {resources.coins}
        </div>
      </div>
    </div>
  )
}
