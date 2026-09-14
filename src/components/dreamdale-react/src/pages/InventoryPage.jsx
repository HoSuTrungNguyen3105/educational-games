import React from 'react'

export default function InventoryPage() {
  return (
    <div className="page-container">
      <h2 className="page-title">🎒 Túi đồ</h2>
      <div className="page-content">
        <div className="inventory-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="inventory-slot">
              {i === 0 && <span className="inventory-item">🪓</span>}
              {i === 1 && <span className="inventory-item">🪨</span>}
              {i === 2 && <span className="inventory-item">🪵</span>}
              {i === 3 && <span className="inventory-item">⚔️</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
