import React from 'react'

export default function Modal({ icon, title, onClose, children }) {
  return (
    <div className="dd-modal-overlay" onClick={onClose}>
      <div className="dd-modal" onClick={e => e.stopPropagation()}>
        <div className="dd-modal-header">
          <span className="icon">{icon}</span>
          <span className="title">{title}</span>
          <button className="dd-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="dd-modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
