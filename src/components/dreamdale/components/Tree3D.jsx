import React from 'react'

export default function Tree3D({ x, z, scale = 1, tall = false }) {
  const trunkH = tall ? 1.8 : 1.4
  const leafR = tall ? 1.0 : 1.2
  const leafY = tall ? trunkH + 1.2 : trunkH + 0.8

  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, trunkH, 8]} />
        <meshStandardMaterial color="#8a6230" />
      </mesh>

      <mesh position={[0, leafY, 0]} castShadow>
        <sphereGeometry args={[leafR, 12, 10]} />
        <meshStandardMaterial
          color={tall ? '#3a8a20' : '#4aa830'}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[leafR * 0.3, leafY + leafR * 0.2, leafR * 0.2]} castShadow>
        <sphereGeometry args={[leafR * 0.7, 10, 8]} />
        <meshStandardMaterial color={tall ? '#4aa830' : '#5cb83a'} roughness={0.8} />
      </mesh>
      <mesh position={[-leafR * 0.2, leafY - leafR * 0.1, -leafR * 0.15]} castShadow>
        <sphereGeometry args={[leafR * 0.6, 8, 6]} />
        <meshStandardMaterial color="#3a8a20" roughness={0.8} />
      </mesh>
    </group>
  )
}
