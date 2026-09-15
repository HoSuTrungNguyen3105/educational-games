import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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

function Fireflies({ count = 40 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -20 + Math.random() * 40
      const yFactor = 1 + Math.random() * 4
      const zFactor = -20 + Math.random() * 40
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.08, 4, 4]} />
      <meshBasicMaterial color="#ffe885" transparent opacity={0.6} />
    </instancedMesh>
  )
}

function CameraFollow({ playerPos }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())

  useFrame(() => {
    const px = playerPos.current.x
    const pz = playerPos.current.z

    targetPos.current.set(px, 10, pz + 16)
    targetLook.current.set(px, 0, pz)

    camera.position.lerp(targetPos.current, 0.06)
    const lookAt = new THREE.Vector3()
    lookAt.copy(camera.position)
    lookAt.y = 0
    camera.lookAt(targetLook.current)
  })

  return null
}

export const FARM_POS = [
  { x: -4, z: 8, cols: 4, rows: 3 },
  { x: 2, z: 10, cols: 3, rows: 3 },
]

export default function Scene({ playerPos, walking, facing, avatarSvg, avatarUrl, playerName, farmCrops, onFarmCellClick }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 20], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#6eb3d9']} />
      <fog attach="fog" args={['#6eb3d9', 15, 40]} />

      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight
        position={[15, 30, 10]}
        intensity={1.5}
        color="#fff1e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0005}
      />
      <hemisphereLight args={['#aaccff', '#5cb83a', 0.6]} />

      <Fireflies count={60} />

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

      {FARM_POS.map((fp, i) => (
        <FarmPlot
          key={i}
          x={fp.x}
          z={fp.z}
          cols={fp.cols}
          rows={fp.rows}
          crops={farmCrops?.[i]}
          onCellClick={(cell) => onFarmCellClick?.(i, cell)}
        />
      ))}

      <House3D x={0} z={-2} />
      <Blacksmith3D x={4} z={2} />
      <Market3D x={6} z={7} />

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
