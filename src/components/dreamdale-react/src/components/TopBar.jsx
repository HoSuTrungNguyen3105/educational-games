import React from 'react'

export default function TopBar({ resources }) {
  return (
    <div className="topbar">
      <div className="level-badge">🌴</div>
      <div className="name-panel">
        <div className="dreamdale-name">Dreamdale</div>
        <div className="xp-row">
          <span className="lvl-num">10</span>
          <div className="xp-bar"><div className="xp-bar-fill" /></div>
        </div>
      </div>
      <div className="top-resources">
        <span><i className="ic ic-wood" />{resources.wood}</span>
        <span><i className="ic ic-stone" />{resources.stone}</span>
        <span><i className="ic ic-coin" />{resources.coins}</span>
      </div>
    </div>
  )
}
