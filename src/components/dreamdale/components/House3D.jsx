import React from 'react'

export default function House3D({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 2.5]} />
        <meshStandardMaterial color="#f5e6d0" />
      </mesh>

      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[2.2, 1, 4]} />
        <meshStandardMaterial color="#e85d4a" />
      </mesh>

      <mesh position={[0, 0.35, 1.26]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.1]} />
        <meshStandardMaterial color="#6a4a20" />
      </mesh>

      <mesh position={[-0.8, 0.6, 1.26]}>
        <boxGeometry args={[0.45, 0.45, 0.05]} />
        <meshStandardMaterial color="#60c0f0" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.8, 0.6, 1.26]}>
        <boxGeometry args={[0.45, 0.45, 0.05]} />
        <meshStandardMaterial color="#60c0f0" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}
