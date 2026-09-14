import React from 'react'

export const WORLD_SIZE = { width: 2400, height: 2400 }

const WATER_ZONES = [
  { x: 0, y: 0, w: 600, h: 320 },
  { x: 1800, y: 0, w: 600, h: 400 },
  { x: 0, y: 2000, w: 400, h: 400 },
  { x: 2000, y: 2100, w: 400, h: 300 },
]

const PATHS = [
  { x: 580, y: 300, w: 80, h: 1800 },
  { x: 660, y: 1000, w: 900, h: 80 },
  { x: 1060, y: 300, w: 80, h: 800 },
  { x: 300, y: 1600, w: 800, h: 70 },
  { x: 300, y: 1600, w: 70, h: 400 },
  { x: 1400, y: 800, w: 70, h: 900 },
  { x: 740, y: 1500, w: 740, h: 70 },
]

const STONE_PATHS = [
  { x: 800, y: 750, w: 180, h: 50 },
  { x: 1200, y: 1200, w: 160, h: 50 },
]

const TREES = [
  { x: 180, y: 450, size: 'round' }, { x: 280, y: 520, size: 'round' },
  { x: 150, y: 650, size: 'tall' }, { x: 400, y: 400, size: 'round' },
  { x: 1550, y: 200, size: 'round' }, { x: 1700, y: 350, size: 'tall' },
  { x: 1650, y: 500, size: 'round' }, { x: 1800, y: 250, size: 'round' },
  { x: 200, y: 1200, size: 'round' }, { x: 350, y: 1350, size: 'tall' },
  { x: 1800, y: 1000, size: 'round' }, { x: 1900, y: 1200, size: 'round' },
  { x: 2100, y: 800, size: 'tall' }, { x: 2200, y: 1100, size: 'round' },
  { x: 1600, y: 1800, size: 'round' }, { x: 1750, y: 1900, size: 'tall' },
  { x: 2000, y: 1600, size: 'round' }, { x: 2150, y: 1750, size: 'round' },
  { x: 500, y: 1900, size: 'round' }, { x: 700, y: 2000, size: 'tall' },
  { x: 900, y: 1950, size: 'round' },
]

const BUSHES = [
  { x: 220, y: 580 }, { x: 350, y: 480 }, { x: 1600, y: 400 },
  { x: 1850, y: 300 }, { x: 250, y: 1280 }, { x: 1850, y: 1100 },
  { x: 2050, y: 900 }, { x: 1650, y: 1850 }, { x: 600, y: 1950 },
]

const FLOWERS = [
  { x: 500, y: 800 }, { x: 900, y: 600 }, { x: 1300, y: 900 },
  { x: 400, y: 1400 }, { x: 1100, y: 1700 }, { x: 1500, y: 1300 },
  { x: 800, y: 1100 }, { x: 1700, y: 1500 }, { x: 2000, y: 1400 },
  { x: 600, y: 600 }, { x: 1200, y: 500 }, { x: 350, y: 1050 },
]

const ROCKS = [
  { x: 450, y: 700, w: 40, h: 30 }, { x: 1500, y: 600, w: 50, h: 35 },
  { x: 1800, y: 1400, w: 45, h: 32 }, { x: 300, y: 1800, w: 38, h: 28 },
  { x: 2100, y: 600, w: 42, h: 30 }, { x: 700, y: 400, w: 36, h: 26 },
]

const LOGS = [
  { x: 400, y: 1700 }, { x: 1100, y: 1400 }, { x: 1900, y: 1700 },
]

const FARMS = [
  { x: 850, y: 1550, cols: 4, crops: ['pumpkin','pumpkin','carrot','pumpkin','wheat','pumpkin','corn','pumpkin','pumpkin','pumpkin','carrot','pumpkin'] },
  { x: 1350, y: 1550, cols: 3, crops: ['wheat','wheat','wheat','corn','corn','corn','carrot','carrot','carrot'] },
]

const WATER_LILIES = [
  { x: 150, y: 120 }, { x: 300, y: 80 }, { x: 450, y: 200 },
  { x: 1900, y: 100 }, { x: 2050, y: 250 }, { x: 100, y: 2150 },
]

export default function GameWorld({ children }) {
  return (
    <>
      <div className="dd-grass">
        <div className="dd-grass-pattern" />
      </div>

      {WATER_ZONES.map((w, i) => (
        <div key={`w${i}`} className="dd-water" style={{ left: w.x, top: w.y, width: w.w, height: w.h }} />
      ))}
      {WATER_LILIES.map((l, i) => (
        <div key={`wl${i}`} className="dd-water-lily" style={{ left: l.x, top: l.y }} />
      ))}

      {PATHS.map((p, i) => (
        <div key={`p${i}`} className="dd-path" style={{ left: p.x, top: p.y, width: p.w, height: p.h }} />
      ))}
      {STONE_PATHS.map((p, i) => (
        <div key={`sp${i}`} className="dd-stone-path" style={{ left: p.x, top: p.y, width: p.w, height: p.h }} />
      ))}

      {TREES.map((t, i) => (
        <div key={`t${i}`} className="dd-tree" style={{ left: t.x, top: t.y, width: 70, height: 90 }}>
          <div className="dd-tree-trunk" />
          <div className={`dd-tree-leaves ${t.size}`} />
        </div>
      ))}

      {BUSHES.map((b, i) => (
        <div key={`b${i}`} className="dd-bush" style={{ left: b.x, top: b.y }} />
      ))}

      {FLOWERS.map((f, i) => (
        <div key={`f${i}`} className="dd-flower" style={{ left: f.x, top: f.y }} />
      ))}

      {ROCKS.map((r, i) => (
        <div key={`r${i}`} className="dd-rock" style={{ left: r.x, top: r.y, width: r.w, height: r.h }} />
      ))}

      {LOGS.map((l, i) => (
        <div key={`l${i}`} className="dd-log" style={{ left: l.x, top: l.y }} />
      ))}

      {FARMS.map((farm, fi) => (
        <div key={`farm${fi}`} className="dd-farm" style={{
          left: farm.x, top: farm.y,
          gridTemplateColumns: `repeat(${farm.cols}, 26px)`,
        }}>
          {farm.crops.map((crop, ci) => (
            <div key={ci} className={`dd-farm-cell grown-${crop}`} />
          ))}
        </div>
      ))}

      {children}
    </>
  )
}

export const BUILDINGS = {
  house: { x: 800, y: 500, w: 150, h: 120 },
  blacksmith: { x: 1100, y: 800, w: 140, h: 115 },
  market: { x: 1300, y: 1300, w: 148, h: 112 },
}

export const NPCS = [
  { x: 1150, y: 750, emoji: '👨‍🔧', name: 'Thợ rèn' },
  { x: 1350, y: 1250, emoji: '🧑‍🌾', name: 'Thương nhân' },
]
