import React from 'react'

const CROP_COLORS = {
  pumpkin: '#e88030',
  carrot: '#f4a020',
  wheat: '#d4c060',
  corn: '#e8d040',
}

export default function FarmPlot({ x, z, cols = 4, rows = 3 }) {
  const cellSize = 0.55
  const gap = 0.08
  const totalW = cols * (cellSize + gap) - gap
  const totalH = rows * (cellSize + gap) - gap
  const crops = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const types = ['pumpkin', 'carrot', 'wheat', 'corn']
      const type = types[(r * cols + c) % types.length]
      crops.push({ c, r, type })
    }
  }

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[totalW + 0.3, 0.12, totalH + 0.3]} />
        <meshStandardMaterial color="#7a5a38" />
      </mesh>

      {crops.map(({ c, r, type }, i) => {
        const cx = (c - (cols - 1) / 2) * (cellSize + gap)
        const cz = (r - (rows - 1) / 2) * (cellSize + gap)
        return (
          <group key={i} position={[cx, 0.12, cz]}>
            <mesh receiveShadow>
              <boxGeometry args={[cellSize, 0.06, cellSize]} />
              <meshStandardMaterial color="#5a4028" />
            </mesh>
            <mesh position={[0, 0.15, 0]} castShadow>
              <sphereGeometry args={[0.15, 8, 6]} />
              <meshStandardMaterial color={CROP_COLORS[type]} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.12, 4]} />
              <meshStandardMaterial color="#4a8a20" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
