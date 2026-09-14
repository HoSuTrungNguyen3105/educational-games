import React from 'react'

export default function ActionButtons({ swordLevel, onOpenShop }) {
  return (
    <div className="dd-actions">
      <button className="dd-action-btn" title="Cửa hàng" onClick={onOpenShop}>
        🏪
        <span className="badge">!</span>
      </button>
      <button className="dd-action-btn" title="Kiếm hiện tại">
        ⚔️
        <span className="badge" style={{ background: '#3fae6b' }}>{swordLevel}</span>
      </button>
    </div>
  )
}
