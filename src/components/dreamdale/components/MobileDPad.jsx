import React, { useRef, useCallback, useEffect, useState } from 'react'

export default function MobileDPad({ onMove, onRelease }) {
  const padRef = useRef(null)
  const [active, setActive] = useState(false)
  const dirRef = useRef({ x: 0, z: 0 })

  const handleTouch = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0] || e.changedTouches[0]
    if (!touch || !padRef.current) return

    const rect = padRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = touch.clientX - cx
    const dy = touch.clientY - cy
    const dist = Math.hypot(dx, dy)
    const maxR = rect.width / 2 - 10

    let nx = 0, nz = 0
    if (dist > 8) {
      nx = dx / Math.min(dist, maxR)
      nz = dy / Math.min(dist, maxR)
      if (Math.abs(nx) > 0.3) nx = nx > 0 ? 1 : -1
      else nx = 0
      if (Math.abs(nz) > 0.3) nz = nz > 0 ? 1 : -1
      else nz = 0
    }

    dirRef.current = { x: nx, z: nz }
    setActive(dist > 8)
    onMove({ x: nx, z: nz })
  }, [onMove])

  const handleEnd = useCallback((e) => {
    e.preventDefault()
    dirRef.current = { x: 0, z: 0 }
    setActive(false)
    onRelease()
  }, [onRelease])

  useEffect(() => {
    const el = padRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouch, { passive: false })
    el.addEventListener('touchmove', handleTouch, { passive: false })
    el.addEventListener('touchend', handleEnd, { passive: false })
    el.addEventListener('touchcancel', handleEnd, { passive: false })
    return () => {
      el.removeEventListener('touchstart', handleTouch)
      el.removeEventListener('touchmove', handleTouch)
      el.removeEventListener('touchend', handleEnd)
      el.removeEventListener('touchcancel', handleEnd)
    }
  }, [handleTouch, handleEnd])

  const thumbOffset = active ? {
    transform: `translate(${dirRef.current.x * 18}px, ${dirRef.current.z * 18}px)`,
  } : {}

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 24, zIndex: 150,
      width: 120, height: 120,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'auto',
    }}>
      <div
        ref={padRef}
        style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          border: '2.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{
          position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          borderBottom: '10px solid rgba(255,255,255,0.45)',
        }} />
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          borderTop: '10px solid rgba(255,255,255,0.45)',
        }} />
        <div style={{
          position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
          width: 0, height: 0,
          borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
          borderRight: '10px solid rgba(255,255,255,0.45)',
        }} />
        <div style={{
          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
          width: 0, height: 0,
          borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
          borderLeft: '10px solid rgba(255,255,255,0.45)',
        }} />

        <div style={{
          width: 42, height: 42,
          borderRadius: '50%',
          background: active
            ? 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(200,200,255,0.8))'
            : 'radial-gradient(circle, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
          boxShadow: active ? '0 0 16px rgba(255,255,255,0.5)' : '0 2px 6px rgba(0,0,0,0.2)',
          transition: 'all 0.1s',
          ...thumbOffset,
        }} />
      </div>
    </div>
  )
}
