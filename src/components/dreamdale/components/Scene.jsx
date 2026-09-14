import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Ground from './Ground.jsx'
import Water from './Water.jsx'
import Path3D from './Path3D.jsx'
import Tree3D from './Tree3D.jsx'
import Bush3D from './Bush3D.jsx'
import Rock3D from './Rock3D.jsx'
import FarmPlot from './FarmPlot.jsx'
import House3D from './House3D.jsx'
import Blacksmith3D from './Blacksmith3D.jsx'
import Market3D from './Market3D.jsx'
import Character3D from './Character3D.jsx'
import NPC3D from './NPC3D.jsx'

function CameraFollow({ playerPos }) {
  const { camera } = useThree()

  useFrame(() => {
    const target = new THREE.Vector3(playerPos.current.x, playerPos.current.y + 8, playerPos.current.z + 18)
    camera.position.lerp(target, 0.08)
    camera.lookAt(playerPos.current.x, playerPos.current.y, playerPos.current.z)
  })

  return null
}

export default function Scene({ playerPos, walking, facing, avatarSvg, avatarUrl, playerName, onNearBuilding }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 20], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#87ceeb']} />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight args={['#87ceeb', '#5cb83a', 0.4]} />

      <Ground />

      <Water />
      <Path3D />

      <Tree3D x={-8} z={-6} scale={1} />
      <Tree3D x={-10} z={-3} scale={0.8} />
      <Tree3D x={-7} z={2} scale={1.1} tall />
      <Tree3D x={10} z={-8} scale={0.9} />
      <Tree3D x={12} z={-4} scale={1} tall />
      <Tree3D x={11} z={2} scale={0.7} />
      <Tree3D x={-11} z={6} scale={1} />
      <Tree3D x={-9} z={9} scale={0.8} tall />
      <Tree3D x={13} z={8} scale={0.9} />
      <Tree3D x={14} z={12} scale={1.1} />
      <Tree3D x={-12} z={14} scale={0.8} />
      <Tree3D x={8} z={15} scale={1} tall />
      <Tree3D x={-5} z={-12} scale={0.9} />
      <Tree3D x={6} z={-14} scale={0.7} />

      <Bush3D x={-6} z={-4} />
      <Bush3D x={9} z={-6} />
      <Bush3D x={-9} z={10} />
      <Bush3D x={11} z={10} />

      <Rock3D x={-5} z={4} scale={0.8} />
      <Rock3D x={7} z={-2} scale={1} />
      <Rock3D x={-3} z={12} scale={0.6} />

      <FarmPlot x={-4} z={8} cols={4} rows={3} />
      <FarmPlot x={2} z={10} cols={3} rows={3} />

      <House3D x={0} z={-2} />
      <Blacksmith3D x={4} z={2} onNear={onNearBuilding} playerPos={playerPos} />
      <Market3D x={6} z={7} onNear={onNearBuilding} playerPos={playerPos} />

      <NPC3D x={3.5} z={0.5} emoji="👨‍🔧" name="Thợ rèn" />
      <NPC3D x={5.5} z={5.5} emoji="🧑‍🌾" name="Thương nhân" />

      <Character3D
        playerPos={playerPos}
        walking={walking}
        facing={facing}
        avatarSvg={avatarSvg}
        avatarUrl={avatarUrl}
        playerName={playerName}
      />

      <CameraFollow playerPos={playerPos} />
    </Canvas>
  )
}
