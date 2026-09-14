import React from 'react'
import Modal from './Modal.jsx'

export const BLACKSMITH_POS = { x: 500, y: 600 }

// Forging cost grows a bit with every sword level.
function forgeCost(level) {
  return { wood: 15 + level * 5, stone: 10 + level * 5 }
}

export function BlacksmithSprite({ nearby, onClick }) {
  return (
    <div
      className={`building smithy ${nearby ? 'nearby' : ''}`}
      style={{ left: BLACKSMITH_POS.x, top: BLACKSMITH_POS.y }}
      onClick={onClick}
    >
      {nearby && <div className="enter-hint">Nhấn để vào 🔨</div>}
      <div className="smithy-roof" />
      <div className="smithy-body" />
      <div className="smithy-forge">🔥</div>
      <div className="smithy-anvil">⚒️</div>
    </div>
  )
}

export function BlacksmithModal({ resources, swordLevel, onForge, onClose }) {
  const cost = forgeCost(swordLevel)
  const canAfford = resources.wood >= cost.wood && resources.stone >= cost.stone

  return (
    <Modal title="Lò rèn kiếm" icon="⚔️" onClose={onClose}>
      <p className="modal-text">
        Thanh kiếm hiện tại: <strong>Cấp {swordLevel}</strong>
      </p>
      <p className="modal-text">
        Chi phí rèn lên cấp {swordLevel + 1}:
      </p>
      <div className="cost-row">
        <span className={resources.wood >= cost.wood ? 'ok' : 'bad'}>
          🪵 {cost.wood}
        </span>
        <span className={resources.stone >= cost.stone ? 'ok' : 'bad'}>
          🪨 {cost.stone}
        </span>
      </div>
      <button
        className="action-button forge"
        disabled={!canAfford}
        onClick={() => onForge(cost)}
      >
        {canAfford ? 'Rèn kiếm ⚔️' : 'Không đủ nguyên liệu'}
      </button>
    </Modal>
  )
}
