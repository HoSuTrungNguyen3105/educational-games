import React from 'react'

export default function SettingsPage() {
  return (
    <div className="page-container">
      <h2 className="page-title">⚙️ Cài đặt</h2>
      <div className="page-content">
        <div className="settings-group">
          <label className="settings-label">Âm thanh</label>
          <input type="range" min="0" max="100" defaultValue="70" className="settings-slider" />
        </div>
        <div className="settings-group">
          <label className="settings-label">Âm nhạc</label>
          <input type="range" min="0" max="100" defaultValue="50" className="settings-slider" />
        </div>
        <div className="settings-group">
          <label className="settings-label">Chất lượng đồ họa</label>
          <select className="settings-select">
            <option>Thấp</option>
            <option>Trung bình</option>
            <option selected>Cao</option>
          </select>
        </div>
        <div className="settings-group">
          <label className="settings-label">Rung feedback</label>
          <input type="checkbox" defaultChecked className="settings-checkbox" />
        </div>
      </div>
    </div>
  )
}
