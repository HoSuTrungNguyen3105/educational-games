import React from 'react'

export default function Bush3D({ x, z, scale = 1 }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color="#4faa2e" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 0.3, 0.1]} castShadow>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color="#5cb83a" roughness={0.8} />
      </mesh>
    </group>
  )
}
