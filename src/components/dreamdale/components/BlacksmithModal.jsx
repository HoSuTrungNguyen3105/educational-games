import React from 'react'
import Modal from './Modal.jsx'

const COSTS = [
  { wood: 5, stone: 3 },
  { wood: 10, stone: 6 },
  { wood: 18, stone: 10 },
  { wood: 30, stone: 18 },
]

export default function BlacksmithModal({ resources, swordLevel, onForge, onClose }) {
  const cost = COSTS[Math.min(swordLevel - 1, COSTS.length - 1)]
  const canAfford = resources.wood >= cost.wood && resources.stone >= cost.stone

  return (
    <Modal icon="⚒️" title="Lò rèn" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#555', margin: '0 0 8px' }}>
        Rèn kiếm để tăng sức mạnh!<br />
        Kiếm hiện tại: <strong style={{ color: '#7c3aed' }}>Cấp {swordLevel}</strong>
      </p>

      <div style={{ background: '#f5f0ff', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: '#666', margin: '0 0 6px', fontWeight: 600 }}>Chi phí:</p>
        <div className="dd-cost-row" style={{ margin: 0 }}>
          <span className={resources.wood >= cost.wood ? 'ok' : 'bad'}>🪵 {cost.wood}</span>
          <span className={resources.stone >= cost.stone ? 'ok' : 'bad'}>🪨 {cost.stone}</span>
        </div>
      </div>

      <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#666', margin: 0 }}>
          Kết quả: <strong style={{ color: '#16a34a' }}>Kiếm cấp {swordLevel + 1}</strong> ⚔️
        </p>
      </div>

      <button
        className="dd-btn dd-btn-gold"
        disabled={!canAfford}
        onClick={() => onForge(cost)}
      >
        ⚒️ Rèn kiếm (+1 cấp)
      </button>

      {!canAfford && (
        <p style={{ fontSize: 11, color: '#dc2626', textAlign: 'center', marginTop: 8 }}>
          Không đủ tài nguyên để rèn!
        </p>
      )}
    </Modal>
  )
}
