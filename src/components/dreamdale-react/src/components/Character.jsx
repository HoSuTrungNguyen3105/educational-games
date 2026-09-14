import React from 'react'

export default function Character({ walking, facing }) {
  return (
    <div className="char-wrap">
      <div
        className={`char ${walking ? 'walking' : ''}`}
        style={{ transform: `scaleX(${facing})` }}
      >
        <div className="shield" />
        <div className="weapon" />
        <div className="body" />
        <div className="head" />
      </div>
    </div>
  )
}
