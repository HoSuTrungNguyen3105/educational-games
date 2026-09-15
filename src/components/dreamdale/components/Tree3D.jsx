import React, { useMemo } from 'react'

/**
 * Tree3D — cây có gốc loe, thân hơi nghiêng tự nhiên, cành nhỏ,
 * và tán lá nhiều lớp. Khi tall=true: cây lá kim dạng tháp (thông).
 * Khi tall=false: cây lá tròn rậm nhiều cụm, màu sắc có biến thiên.
 * Dùng x/z làm seed để mỗi cây có hình dáng hơi khác nhau dù cùng props.
 */
export default function Tree3D({ x, z, scale = 1, tall = false }) {
  const trunkH = tall ? 1.8 : 1.4
  const leafR = tall ? 1.0 : 1.2
  const leafY = tall ? trunkH + 1.2 : trunkH + 0.8

  // pseudo-random ổn định dựa trên vị trí, để mỗi cây có chút khác biệt
  const rnd = useMemo(() => {
    const seed = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
    return (i) => {
      const v = Math.sin(seed + i * 17.13) * 43758.5453
      return v - Math.floor(v)
    }
  }, [x, z])

  const tilt = (rnd(1) - 0.5) * 0.12

  return (
    <group position={[x, 0, z]} scale={scale}>
      {/* ===== GỐC LOE ===== */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.34, 0.24, 9]} />
        <meshStandardMaterial color="#6b4a24" roughness={0.95} />
      </mesh>

      {/* ===== THÂN CÂY (hơi nghiêng tự nhiên) ===== */}
      <group rotation={[tilt, 0, tilt * 1.3]}>
        <mesh position={[0, trunkH / 2 + 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.22, trunkH, 8]} />
          <meshStandardMaterial color="#8a6230" roughness={0.9} />
        </mesh>

        {/* Vệt vỏ cây nhấn (mảnh, sậm hơn) */}
        <mesh position={[0, trunkH * 0.55, 0.02]} castShadow>
          <cylinderGeometry args={[0.135, 0.19, trunkH * 0.7, 8]} />
          <meshStandardMaterial color="#6e4c22" roughness={1} />
        </mesh>

        {/* Cành nhỏ nhô ra (chỉ cho cây lá tròn) */}
        {!tall &&
          [0, 1].map((i) => (
            <mesh
              key={i}
              position={[
                (i === 0 ? 1 : -1) * 0.18,
                trunkH * 0.7,
                (rnd(2 + i) - 0.5) * 0.15,
              ]}
              rotation={[0, 0, (i === 0 ? -1 : 1) * 0.9]}
              castShadow
            >
              <cylinderGeometry args={[0.03, 0.05, 0.4, 6]} />
              <meshStandardMaterial color="#7a5528" roughness={0.9} />
            </mesh>
          ))}

        {tall ? (
          /* ===== TÁN LÁ KIM DẠNG THÁP (CÂY THÔNG) ===== */
          <group position={[0, trunkH - 0.1, 0]}>
            {[0, 1, 2, 3].map((i) => {
              const t = i / 3
              const r = leafR * (1.05 - t * 0.65)
              const h = 0.95 - t * 0.25
              const y = t * 1.55
              return (
                <mesh key={i} position={[0, y, 0]} castShadow>
                  <coneGeometry args={[r, h, 9]} />
                  <meshStandardMaterial
                    color={i % 2 === 0 ? '#2f7a1c' : '#3a8a20'}
                    roughness={0.85}
                  />
                </mesh>
              )
            })}
          </group>
        ) : (
          /* ===== TÁN LÁ TRÒN NHIỀU CỤM (CÂY RỤNG LÁ) ===== */
          <group position={[0, leafY - trunkH / 2 - 0.1, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[leafR, 14, 12]} />
              <meshStandardMaterial color="#4aa830" roughness={0.85} />
            </mesh>

            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2 + rnd(5 + i) * 1.5
              const dist = leafR * (0.55 + rnd(10 + i) * 0.25)
              const r = leafR * (0.45 + rnd(20 + i) * 0.3)
              const yOff = (rnd(30 + i) - 0.5) * leafR * 0.6
              const colors = ['#5cb83a', '#3a8a20', '#4aa830', '#67c246']
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * dist,
                    yOff,
                    Math.sin(angle) * dist,
                  ]}
                  castShadow
                >
                  <sphereGeometry args={[r, 10, 8]} />
                  <meshStandardMaterial
                    color={colors[i % colors.length]}
                    roughness={0.85}
                  />
                </mesh>
              )
            })}

            {/* Vài đốm sáng nhỏ tạo chiều sâu / điểm nhấn ánh sáng */}
            <mesh position={[leafR * 0.35, leafR * 0.4, leafR * 0.3]}>
              <sphereGeometry args={[leafR * 0.35, 8, 6]} />
              <meshStandardMaterial color="#7ed957" roughness={0.7} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  )
}