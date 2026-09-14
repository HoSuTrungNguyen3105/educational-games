import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

function AvatarTexture({ svg, url }) {
  const texture = useMemo(() => {
    if (!svg && !url) return null

    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')

    if (url) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = url
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 128, 128)
        texture.needsUpdate = true
      }
      const tex = new THREE.CanvasTexture(canvas)
      return tex
    }

    if (svg) {
      const img = new Image()
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const url2 = URL.createObjectURL(blob)
      img.src = url2
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 128, 128)
        URL.revokeObjectURL(url2)
        tex.needsUpdate = true
      }
      const tex = new THREE.CanvasTexture(canvas)
      return tex
    }

    return null
  }, [svg, url])

  return texture
}

export default function Character3D({ playerPos, walking, facing, avatarSvg, avatarUrl, playerName }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const bobRef = useRef(0)

  const texture = useMemo(() => {
    if (!avatarSvg && !avatarUrl) return null

    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    const tex = new THREE.CanvasTexture(canvas)

    if (avatarUrl) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = avatarUrl
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 128, 128)
        tex.needsUpdate = true
      }
    } else if (avatarSvg) {
      const img = new Image()
      const blob = new Blob([avatarSvg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      img.src = url
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 128, 128)
        URL.revokeObjectURL(url)
        tex.needsUpdate = true
      }
    }

    return tex
  }, [avatarSvg, avatarUrl])

  const faceTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const tex = new THREE.CanvasTexture(canvas)

    ctx.fillStyle = '#FFDFC4'
    ctx.fillRect(0, 0, 64, 64)
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.arc(22, 26, 4, 0, Math.PI * 2)
    ctx.arc(42, 26, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(32, 38, 6, 0, Math.PI)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.stroke()
    tex.needsUpdate = true

    return tex
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    groupRef.current.position.x = playerPos.current.x
    groupRef.current.position.z = playerPos.current.z

    if (walking) {
      bobRef.current += delta * 10
      groupRef.current.position.y = Math.abs(Math.sin(bobRef.current)) * 0.15
    } else {
      bobRef.current = 0
      groupRef.current.position.y = 0
    }

    const targetRotY = facing === 1 ? 0 : Math.PI
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.15
    )
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0.2} />
      </mesh>

      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
        <meshStandardMaterial color="#2f8f6a" />
      </mesh>

      <group ref={bodyRef} position={[0, 0.5, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.28, 12, 10]} />
          {texture ? (
            <meshStandardMaterial map={texture} />
          ) : (
            <meshStandardMaterial map={faceTexture} />
          )}
        </mesh>

        <mesh position={[0, 0.55, 0.29]} castShadow>
          <planeGeometry args={[0.45, 0.45]} />
          {texture ? (
            <meshStandardMaterial map={texture} />
          ) : (
            <meshStandardMaterial map={faceTexture} />
          )}
        </mesh>
      </group>

      <group position={[0.35, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
          <meshStandardMaterial color="#FFDFC4" />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.15, 0.18]} />
          <meshStandardMaterial color="#3B5EA6" />
        </mesh>
      </group>

      <group position={[-0.35, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
          <meshStandardMaterial color="#FFDFC4" />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.15, 0.18]} />
          <meshStandardMaterial color="#3B5EA6" />
        </mesh>
      </group>

      <group position={[0, 0.7, 0.1]} rotation={[0.5, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.2, 0.04, 0.15]} />
          <meshStandardMaterial color="#a0a0a0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      <Text
        position={[0, 1.2, 0]}
        fontSize={0.18}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {playerName}
      </Text>
    </group>
  )
}
