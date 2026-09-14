import React from 'react'
import * as THREE from 'three'

export default function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#5cb83a" />
      </mesh>

      {Array.from({ length: 80 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 56
        const z = (Math.random() - 0.5) * 56
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.04, z]}>
            <circleGeometry args={[0.15 + Math.random() * 0.15, 6]} />
            <meshStandardMaterial
              color={Math.random() > 0.5 ? '#72d148' : '#4a9e2e'}
              transparent
              opacity={0.3}
            />
          </mesh>
        )
      })}

      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 50
        const z = (Math.random() - 0.5) * 50
        return (
          <mesh key={`f${i}`} position={[x, 0.02, z]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#ffe082" emissive="#ffe082" emissiveIntensity={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}
