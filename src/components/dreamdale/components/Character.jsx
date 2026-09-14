import React, { useMemo } from 'react'

export default function Character({ walking, facing, avatarSvg, avatarUrl, playerName }) {
  const content = useMemo(() => {
    if (avatarSvg) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      )
    }
    if (avatarUrl) return <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    return <span style={{ fontSize: 26, lineHeight: 1 }}>🧑</span>
  }, [avatarSvg, avatarUrl])

  return (
    <div className="dd-player">
      <div className="dd-player-shadow" />
      <div
        className={`dd-avatar-wrap ${walking ? 'walking' : ''}`}
        style={{ '--facing': facing }}
      >
        {content}
      </div>
      <div className="dd-player-name">{playerName}</div>
    </div>
  )
}
