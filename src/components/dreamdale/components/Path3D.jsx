import React from 'react'

function Path({ x, z, w, h, color = '#e8d5a3' }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]} receiveShadow>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function Path3D() {
  return (
    <group>
      <Path x={0} z={0} w={2} h={24} />
      <Path x={3} z={0} w={12} h={2} />
      <Path x={8} z={-5} w={2} h={10} />
      <Path x={3} z={8} w={10} h={1.5} />
      <Path x={-2} z={12} w={1.5} h={8} />
      <Path x={6} z={5} w={1.5} h={10} />
      <Path x={3} z={10} w={8} h={1.5} />
      <Path x={0} z={-2} w={3} h={3} color="#d5cfc5" />
      <Path x={5} z={4} w={3} h={2} color="#d5cfc5" />
    </group>
  )
}
