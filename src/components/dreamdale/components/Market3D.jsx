import React from 'react'

export default function Market3D({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.9, 2]} />
        <meshStandardMaterial color="#e8b870" />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[3.2, 0.5, 2.4]} />
        <meshStandardMaterial color="#70d4f4" />
      </mesh>

      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[-1.2 + i * 0.8, 1.15, 1.21]}>
          <boxGeometry args={[0.35, 0.45, 0.02]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#fff' : '#70d4f4'} />
        </mesh>
      ))}

      <mesh position={[0, 0.5, 1.01]}>
        <boxGeometry args={[1, 0.3, 0.05]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  )
}
