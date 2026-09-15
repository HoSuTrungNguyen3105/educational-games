import React, { useState } from 'react'
import Modal from './Modal.jsx'

function fmtTime(ms) {
  const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60),d=Math.floor(h/24);
  if(d>0)return`${d}d ${h%24}h`;
  if(h>0)return`${h}h ${m%60}m`;
  if(ms<=0)return'Sẵn sàng!';
  return`${m}p ${s%60}s`;
}

export default function FarmModal({ userCoins = 0, plantConfig = {}, onPlant, onClose }) {
  const [selected, setSelected] = useState(null)
  const seeds = Object.entries(plantConfig).map(([id, c]) => ({ id, ...c }));

  return (
    <Modal icon="🌱" title="Cửa hàng Hạt giống" onClose={onClose}>
      <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center', marginBottom:14 }}>
        <span style={{ fontSize:16 }}>🌾</span>
        <span style={{ fontWeight:800, fontSize:16, color:'#4a2c00' }}>{userCoins.toLocaleString()} Coin</span>
      </div>

      <div className="dd-farm-seed-list" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, maxHeight: '50vh', overflowY: 'auto', paddingRight: 4 }}>
        {seeds.map(seed => {
          const canAfford = userCoins >= seed.seedPrice;
          const isSelected = selected === seed.id;
          return (
            <button
              key={seed.id}
              disabled={!canAfford}
              onClick={() => canAfford && setSelected(seed.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isSelected
                  ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)'
                  : '#f5f5f5',
                border: isSelected ? '2px solid #4caf50' : '2px solid transparent',
                borderRadius: 12,
                padding: '10px 12px',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                transition: 'all 0.15s',
                opacity: canAfford ? 1 : 0.5,
                boxShadow: isSelected ? '0 4px 12px rgba(76, 175, 80, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                gap: 8
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {seed.name}
                  <span style={{ fontSize: 10, marginLeft: 6, color: '#888', fontWeight: 600 }}>({seed.rarity})</span>
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ⏰ {fmtTime(seed.growthTime)} · 🌾 +{seed.harvestCoin} xu
                </div>
              </div>
              <div style={{ fontWeight: 800, color: '#8a6a10', fontSize: 14, flexShrink: 0 }}>
                🌾 {seed.seedPrice}
              </div>
            </button>
          )
        })}
      </div>

      <button
        className="dd-btn dd-btn-gold"
        disabled={!selected}
        onClick={() => {
          if (selected) {
            onPlant(selected)
          }
        }}
      >
        🌱 Trồng ngay
      </button>
    </Modal>
  )
}
