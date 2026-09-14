import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function NPC3D({ x, z, emoji, name }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 2 + x) * 0.05
    }
  })

  return (
    <group ref={ref} position={[x, 0, z]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 12]} />
        <meshStandardMaterial color="#000" transparent opacity={0.15} />
      </mesh>

      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.35, 6, 12]} />
        <meshStandardMaterial color="#c9a26b" />
      </mesh>

      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color="#FFDFC4" />
      </mesh>

      <Text
        position={[0, 1.15, 0]}
        fontSize={0.14}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {emoji} {name}
      </Text>
    </group>
  )
}
