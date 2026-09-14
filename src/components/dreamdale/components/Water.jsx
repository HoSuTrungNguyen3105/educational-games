import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WaterZone({ x, z, w, h }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.7 + Math.sin(clock.elapsedTime * 1.5) * 0.1
    }
  })

  return (
    <group position={[x, -0.02, z]}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color="#3fc8f0"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[w * 0.6, h * 0.4]} />
        <meshStandardMaterial color="#7ee0fa" transparent opacity={0.3} />
      </mesh>
      {[0, 1, 2].map(i => (
        <group key={i} position={[(i - 1) * w * 0.25, 0.05, (i - 1) * 0.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.2, 8]} />
            <meshStandardMaterial color="#4caf50" />
          </mesh>
          <mesh position={[0.1, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 6]} />
            <meshStandardMaterial color="#e91e63" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Water() {
  return (
    <group>
      <WaterZone x={-18} z={-15} w={20} h={10} />
      <WaterZone x={18} z={-12} w={16} h={12} />
      <WaterZone x={-20} z={15} w={12} h={10} />
      <WaterZone x={20} z={18} w={14} h={8} />
    </group>
  )
}
