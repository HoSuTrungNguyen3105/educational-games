import React from 'react'

export default function Rock3D({ x, z, scale = 1 }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#9aa4b0" roughness={0.7} />
      </mesh>
      <mesh position={[0.25, 0.15, 0.15]} castShadow>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#b0b8c4" roughness={0.7} />
      </mesh>
    </group>
  )
}
