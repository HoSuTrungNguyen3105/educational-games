import React from 'react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { to: '/', icon: '🗺️', label: 'Bản đồ' },
  { to: '/inventory', icon: '🎒', label: 'Túi đồ' },
  { to: '/skills', icon: '⚡', label: 'Kỹ năng' },
  { to: '/settings', icon: '⚙️', label: 'Cài đặt' },
]

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onToggle} />
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button className="sidebar-close" onClick={onToggle}>✕</button>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onToggle}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
