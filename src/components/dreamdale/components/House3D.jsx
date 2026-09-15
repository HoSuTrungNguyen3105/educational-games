import React from 'react'

/**
 * House3D — nhà gỗ kiểu cottage, mái ngói dốc hai bên, có ống khói,
 * hiên trước với bậc thềm, cửa sổ có khung + song ngang dọc,
 * hộp hoa dưới cửa sổ và đèn hiên nhỏ phát sáng.
 */
export default function House3D({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      {/* ===== MÓNG NHÀ (đá) ===== */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.16, 2.7]} />
        <meshStandardMaterial color="#9a958c" roughness={0.95} />
      </mesh>

      {/* ===== THÂN NHÀ ===== */}
      <mesh position={[0, 0.66, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 2.5]} />
        <meshStandardMaterial color="#f2e2c8" roughness={0.75} />
      </mesh>

      {/* Viền gỗ góc tường (4 cột trang trí) */}
      {[
        [-1.48, 1.24],
        [1.48, 1.24],
        [-1.48, -1.24],
        [1.48, -1.24],
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, 0.66, pz]} castShadow>
          <boxGeometry args={[0.12, 1.02, 0.12]} />
          <meshStandardMaterial color="#8a6a3f" roughness={0.8} />
        </mesh>
      ))}

      {/* ===== MÁI NHÀ KIỂU DỐC HAI BÊN (gable roof) ===== */}
      <group position={[0, 1.16, 0]}>
        {/* Hai tấm mái nghiêng */}
        <mesh position={[0, 0.55, 0.72]} rotation={[Math.PI / 3.6, 0, 0]} castShadow>
          <boxGeometry args={[3.4, 0.08, 1.85]} />
          <meshStandardMaterial color="#a8402f" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.55, -0.72]} rotation={[-Math.PI / 3.6, 0, 0]} castShadow>
          <boxGeometry args={[3.4, 0.08, 1.85]} />
          <meshStandardMaterial color="#a8402f" roughness={0.6} />
        </mesh>
        {/* Nóc mái (bờ nóc) */}
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[3.45, 0.12, 0.16]} />
          <meshStandardMaterial color="#7a2e22" roughness={0.6} />
        </mesh>
        {/* Ván hồi mái tam giác 2 đầu */}
        {[-1.72, 1.72].map((px, i) => (
          <mesh key={i} position={[px, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <coneGeometry args={[0.9, 1, 3]} />
            <meshStandardMaterial color="#e6d4b0" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ===== ỐNG KHÓI ===== */}
      <mesh position={[0.9, 1.85, -0.4]} castShadow>
        <boxGeometry args={[0.32, 0.9, 0.32]} />
        <meshStandardMaterial color="#8b4a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0.9, 2.32, -0.4]} castShadow>
        <boxGeometry args={[0.42, 0.1, 0.42]} />
        <meshStandardMaterial color="#5c3226" roughness={0.9} />
      </mesh>

      {/* ===== HIÊN & CỬA CHÍNH ===== */}
      {/* Bậc thềm */}
      <mesh position={[0, 0.08, 1.4]} receiveShadow castShadow>
        <boxGeometry args={[0.9, 0.1, 0.3]} />
        <meshStandardMaterial color="#8a8378" roughness={0.9} />
      </mesh>
      {/* Mái hiên nhỏ */}
      <mesh position={[0, 1.28, 1.35]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.55]} />
        <meshStandardMaterial color="#7a2e22" roughness={0.6} />
      </mesh>
      {/* Cột hiên */}
      {[-0.5, 0.5].map((px, i) => (
        <mesh key={i} position={[px, 0.9, 1.55]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.85, 8]} />
          <meshStandardMaterial color="#8a6a3f" roughness={0.7} />
        </mesh>
      ))}
      {/* Khung cửa */}
      <mesh position={[0, 0.4, 1.27]} castShadow>
        <boxGeometry args={[0.62, 0.92, 0.06]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.6} />
      </mesh>
      {/* Cánh cửa */}
      <mesh position={[0, 0.38, 1.3]} castShadow>
        <boxGeometry args={[0.5, 0.82, 0.06]} />
        <meshStandardMaterial color="#7a4a24" roughness={0.55} />
      </mesh>
      {/* Tay nắm cửa */}
      <mesh position={[0.18, 0.38, 1.34]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#d8b45a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Đèn hiên phát sáng */}
      <mesh position={[0.5, 0.95, 1.28]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#ffe9a8" emissive="#ffd76a" emissiveIntensity={1.2} />
      </mesh>

      {/* ===== CỬA SỔ (2 bên, có khung + song + hộp hoa) ===== */}
      {[-0.85, 0.85].map((px, i) => (
        <group key={i} position={[px, 0.62, 1.26]}>
          {/* Khung ngoài */}
          <mesh castShadow>
            <boxGeometry args={[0.56, 0.56, 0.06]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.6} />
          </mesh>
          {/* Kính */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.46, 0.46, 0.03]} />
            <meshStandardMaterial
              color="#a9def9"
              transparent
              opacity={0.55}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>
          {/* Song cửa: dọc + ngang */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.03, 0.46, 0.02]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.46, 0.03, 0.02]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
          {/* Hộp hoa dưới cửa sổ */}
          <mesh position={[0, -0.34, 0.05]} castShadow>
            <boxGeometry args={[0.5, 0.12, 0.12]} />
            <meshStandardMaterial color="#6a4a20" roughness={0.9} />
          </mesh>
          {[-0.15, 0, 0.15].map((fx, j) => (
            <mesh key={j} position={[fx, -0.24, 0.08]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color={j % 2 === 0 ? '#e8567a' : '#f5c542'}
                roughness={0.6}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}