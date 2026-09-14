import React, { useState } from 'react'
import Modal from './Modal.jsx'

export const EXCHANGE_POS = { x: 230, y: 760 }

// 1 stone converts to this many coins.
const RATE = 0.5

export function ExchangeSprite({ nearby, onClick }) {
  return (
    <div
      className={`building exchange ${nearby ? 'nearby' : ''}`}
      style={{ left: EXCHANGE_POS.x, top: EXCHANGE_POS.y }}
      onClick={onClick}
    >
      {nearby && <div className="enter-hint">Nhấn để vào 🪙</div>}
      <div className="exchange-roof" />
      <div className="exchange-body" />
      <div className="exchange-sign">🪨➡️🪙</div>
    </div>
  )
}

export function ExchangeModal({ resources, onExchange, onClose }) {
  const [amount, setAmount] = useState(10)
  const maxStone = resources.stone
  const clampedAmount = Math.min(Math.max(amount, 0), maxStone)
  const coinsOut = Math.floor(clampedAmount * RATE)

  return (
    <Modal title="Đổi đá lấy xu" icon="🪙" onClose={onClose}>
      <p className="modal-text">
        Bạn đang có <strong>{resources.stone} 🪨</strong> đá và{' '}
        <strong>{resources.coins} 🪙</strong> xu.
      </p>
      <p className="modal-text">Tỉ lệ đổi: 2 đá = 1 xu</p>

      <div className="exchange-slider-row">
        <input
          type="range"
          min="0"
          max={maxStone}
          value={clampedAmount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <span className="exchange-amount">{clampedAmount} 🪨</span>
      </div>

      <div className="exchange-preview">
        Nhận được: <strong>{coinsOut} 🪙</strong>
      </div>

      <div className="exchange-buttons">
        <button
          className="action-button"
          disabled={clampedAmount <= 0}
          onClick={() => {
            onExchange(clampedAmount, coinsOut)
            setAmount(0)
          }}
        >
          Đổi ngay
        </button>
        <button
          className="action-button secondary"
          disabled={maxStone <= 0}
          onClick={() => {
            const all = maxStone
            onExchange(all, Math.floor(all * RATE))
            setAmount(0)
          }}
        >
          Đổi tất cả
        </button>
      </div>
    </Modal>
  )
}
