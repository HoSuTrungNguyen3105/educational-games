import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Blacksmith3D({ x, z, onNear, playerPos }) {
  const fireRef = useRef()

  useFrame(({ clock }) => {
    if (fireRef.current) {
      fireRef.current.scale.y = 0.8 + Math.sin(clock.elapsedTime * 8) * 0.3
      fireRef.current.scale.x = 0.8 + Math.cos(clock.elapsedTime * 6) * 0.2
    }
  })

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1, 2.2]} />
        <meshStandardMaterial color="#d4a870" />
      </mesh>

      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color="#7a5aa0" />
      </mesh>

      <mesh position={[0.8, 1.8, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial color="#4a3a3a" />
      </mesh>

      <mesh ref={fireRef} position={[0.8, 2.15, 0]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={2} />
      </mesh>

      <mesh position={[-0.8, 0.3, 1.11]}>
        <boxGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      <group position={[-0.8, 0.55, 1.11]}>
        <mesh ref={fireRef}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#ff8800" emissive="#ff4400" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  )
}
