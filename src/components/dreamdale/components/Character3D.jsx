import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Character3D — nhân vật có thân/chân/tay tách rời để đi bộ tự nhiên:
 * - Chân vung ngược pha khi đi (walk cycle), tay vung ngược pha với chân cùng bên
 * - Nảy người (bob) mượt dần vào/ra thay vì bật tắt đột ngột
 * - Hơi thở nhẹ (breathing) khi đứng yên
 * - Xoay người mượt theo khung hình (frame-rate independent) khi đổi hướng
 * - Bảng tên luôn quay mặt về camera (Billboard) nên không bị lật ngược khi quay trái
 */
export default function Character3D({ playerPos, walking, facing, avatarSvg, avatarUrl, playerName }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const shadowRef = useRef()

  const cycle = useRef(0)
  const walkBlend = useRef(0)

  // Texture avatar (ảnh đại diện) vẽ lên canvas rồi dùng làm map cho đầu
  const texture = useMemo(() => {
    if (!avatarSvg && !avatarUrl) return null

    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    const tex = new THREE.CanvasTexture(canvas)

    const img = new Image()
    if (avatarUrl) {
      img.crossOrigin = 'anonymous'
      img.src = avatarUrl
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 128, 128)
        tex.needsUpdate = true
      }
    } else if (avatarSvg) {
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

  // Mặt mặc định (khi chưa có avatar) vẽ sẵn bằng canvas 2D
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

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Vị trí theo con trỏ trạng thái người chơi
    groupRef.current.position.x = playerPos.current.x
    groupRef.current.position.z = playerPos.current.z

    // Chuyển động mượt dần vào/ra trạng thái đi bộ thay vì bật tắt cứng
    walkBlend.current = THREE.MathUtils.damp(walkBlend.current, walking ? 1 : 0, 6, delta)
    if (walking) cycle.current += delta * 8

    const swing = Math.sin(cycle.current) * walkBlend.current
    const bounce = Math.abs(Math.sin(cycle.current)) * 0.13 * walkBlend.current

    groupRef.current.position.y = bounce

    // Chân vung ngược pha nhau
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing * 0.6
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * 0.6

    // Tay vung ngược pha với chân cùng bên (dáng đi tự nhiên)
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.5
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.5

    // Hơi thở nhẹ khi đứng yên, giảm dần khi đi bộ
    const breathe = Math.sin(state.clock.elapsedTime * 1.6) * 0.02 * (1 - walkBlend.current)
    if (bodyRef.current) bodyRef.current.scale.set(1, 1 + breathe, 1)

    // Đầu hơi lắc nhẹ theo nhịp bước
    if (headRef.current) headRef.current.rotation.z = swing * 0.06

    // Bóng đổ hơi co giãn theo nhịp nảy để tăng cảm giác trọng lượng
    if (shadowRef.current) {
      const s = 1 - bounce * 0.6
      shadowRef.current.scale.set(s, s, 1)
    }

    // Xoay người mượt, không phụ thuộc tốc độ khung hình
    const targetRotY = facing === 1 ? 0 : Math.PI
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      8,
      delta
    )
  })

  return (
    <group ref={groupRef}>
      {/* Bóng đổ dưới chân */}
      <mesh ref={shadowRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0.25} />
      </mesh>

      {/* ===== CHÂN (mỗi chân là 1 pivot group để vung khi đi) ===== */}
      {[
        { ref: leftLegRef, side: -1 },
        { ref: rightLegRef, side: 1 },
      ].map(({ ref, side }, i) => (
        <group key={i} ref={ref} position={[side * 0.12, 0.5, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.28, 4, 8]} />
            <meshStandardMaterial color="#33414f" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.5, 0.05]} castShadow>
            <boxGeometry args={[0.14, 0.09, 0.22]} />
            <meshStandardMaterial color="#221f1f" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ===== THÂN + ĐẦU (chung group để áp hiệu ứng thở) ===== */}
      <group ref={bodyRef} position={[0, 0, 0]}>
        {/* Thắt lưng nối thân với chân */}
        <mesh position={[0, 0.53, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.08, 12]} />
          <meshStandardMaterial color="#6a4a24" roughness={0.8} />
        </mesh>

        {/* Thân trên */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <capsuleGeometry args={[0.27, 0.36, 6, 16]} />
          <meshStandardMaterial color="#2f8f6a" roughness={0.65} />
        </mesh>

        {/* Đầu (có thể lắc nhẹ theo bước đi) */}
        <group ref={headRef} position={[0, 1.35, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.28, 16, 14]} />
            <meshStandardMaterial map={texture || faceTexture} />
          </mesh>
          {/* Mặt trước rõ nét hơn khi có avatar */}
          <mesh position={[0, 0, 0.27]}>
            <planeGeometry args={[0.42, 0.42]} />
            <meshStandardMaterial map={texture || faceTexture} transparent />
          </mesh>
        </group>
      </group>

      {/* ===== TAY (pivot ở vai để vung khi đi) ===== */}
      {[
        { ref: leftArmRef, side: -1 },
        { ref: rightArmRef, side: 1 },
      ].map(({ ref, side }, i) => (
        <group key={i} ref={ref} position={[side * 0.34, 1.03, 0]} rotation={[0, 0, -side * 0.22]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.28, 4, 8]} />
            <meshStandardMaterial color="#FFDFC4" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.34, 0]} castShadow>
            <sphereGeometry args={[0.09, 10, 8]} />
            <meshStandardMaterial color="#3B5EA6" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Cây trượng đeo sau lưng (phụ kiện trang trí) */}
      <group position={[0, 1.05, -0.12]} rotation={[0.35, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.62, 0.06]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.36, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.2, 0.04, 0.15]} />
          <meshStandardMaterial color="#a0a0a0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Bảng tên — luôn quay mặt về camera dù nhân vật quay hướng nào */}
      <Billboard position={[0, 1.75, 0]}>
        <Text
          fontSize={0.18}
          color="#fff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {playerName}
        </Text>
      </Billboard>
    </group>
  )
}