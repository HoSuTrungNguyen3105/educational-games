import React, { useState } from 'react'
import Modal from './Modal.jsx'

const RATE = 2

export default function ExchangeModal({ resources, onExchange, onClose }) {
  const [amount, setAmount] = useState(1)
  const maxCanSell = resources.stone
  const coinsGained = amount * RATE
  const canExchange = amount > 0 && amount <= maxCanSell

  return (
    <Modal icon="🏪" title="Chợ đổi đồ" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#555', margin: '0 0 4px' }}>
        Đổi đá lấy xu
      </p>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
        Tỷ lệ: <strong>1 đá = {RATE} xu</strong> · Đá hiện có: <strong>{resources.stone}</strong>
      </p>

      <div style={{ background: '#fffbeb', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <div className="dd-exchange-slider">
          <input
            type="range"
            min={1}
            max={Math.max(1, maxCanSell)}
            value={amount}
            onChange={e => setAmount(+e.target.value)}
          />
          <span className="dd-exchange-amount">{amount} 🪨</span>
        </div>
        <div className="dd-exchange-preview">
          Nhận: <span style={{ color: '#d4a017', fontWeight: 800 }}>+{coinsGained} xu 🪙</span>
        </div>
      </div>

      <button
        className="dd-btn dd-btn-gold"
        disabled={!canExchange}
        onClick={() => { onExchange(amount, coinsGained); onClose() }}
      >
        🪙 Đổi ngay
      </button>

      {maxCanSell === 0 && (
        <p style={{ fontSize: 11, color: '#dc2626', textAlign: 'center', marginTop: 8 }}>
          Không có đá để đổi!
        </p>
      )}
    </Modal>
  )
}
