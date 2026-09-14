import React from 'react'

// Renders the river that runs along the top of the map plus a wooden
// bridge crossing it, and a few reeds/rocks along the bank.
export default function Riverbank() {
  return (
    <>
      <div className="water water-top" />
      <div className="bridge" style={{ left: 420, top: 210 }} />

      <div className="reed prop" style={{ left: 330, top: 180 }} />
      <div className="reed prop" style={{ left: 350, top: 190 }} />
      <div className="reed prop" style={{ left: 530, top: 190 }} />
      <div className="reed prop" style={{ left: 555, top: 200 }} />

      <div className="rock prop" style={{ left: 250, top: 230 }} />
      <div className="rock prop" style={{ left: 620, top: 235 }} />

      <div className="flower prop" style={{ left: 140, top: 250 }} />
      <div className="flower prop" style={{ left: 700, top: 260 }} />
    </>
  )
}
