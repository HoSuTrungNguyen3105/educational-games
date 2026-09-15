import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CropCell({ cx, cz, cellSize, crop, onInteract }) {
  const groupRef = useRef()
  const cropRef = useRef()
  const bounceRef = useRef({ time: 0, active: false, initialScale: 1 })
  const ready = crop && crop.stage === 'grown'
  const planted = crop && (crop.stage === 'seed' || crop.stage === 'growing' || crop.stage === 'grown')
  const config = crop?.config;
  const palette = config?.palette || { stem:'#6aaa30', leaf:'#80cc40', leafDark:'#4a8a20', accent:'#fff', accentLight:'#fff', accentDark:'#fff' };

  // Trigger bounce on plant (when progress is 0)
  useMemo(() => {
    if (crop && crop.progress === 0 && crop.stage === 'seed') {
      bounceRef.current = { time: 0, active: true, initialScale: 0.1 };
    }
  }, [crop?.progress, crop?.stage]);

  useFrame(({ clock }) => {
    if (!cropRef.current) return
    const time = clock.elapsedTime
    
    let scale = 1;
    if (bounceRef.current.active) {
      bounceRef.current.time += 0.05;
      const t = bounceRef.current.time;
      scale = bounceRef.current.initialScale + Math.sin(t * Math.PI) * Math.exp(-t) * 1.5;
      if (t > 3) {
        bounceRef.current.active = false;
        scale = 1;
      }
    } else if (crop && crop.stage === 'growing') {
      scale = 0.5 + Math.sin(time * 1.5) * 0.03;
    }

    if (ready) {
      cropRef.current.position.y = 0.2 + Math.sin(time * 2 + cx * 3 + cz * 5) * 0.02
      cropRef.current.scale.setScalar(scale + Math.sin(time * 3 + cx) * 0.02)
    } else {
      cropRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef} position={[cx, 0.12, cz]}>
      <mesh receiveShadow>
        <boxGeometry args={[cellSize, 0.06, cellSize]} />
        <meshStandardMaterial color="#5a4028" />
      </mesh>

      {crop && crop.stage === 'seed' && (
        <group ref={cropRef}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 4]} />
            <meshStandardMaterial color={palette.stem} />
          </mesh>
          <mesh position={[0, 0.13, 0]} castShadow>
            <sphereGeometry args={[0.05, 6, 4]} />
            <meshStandardMaterial color={palette.leaf} />
          </mesh>
        </group>
      )}

      {crop && crop.stage === 'growing' && (
        <group ref={cropRef}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.16, 4]} />
            <meshStandardMaterial color={palette.stem} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <sphereGeometry args={[0.12, 8, 6]} />
            <meshStandardMaterial color={palette.leaf} />
          </mesh>
        </group>
      )}

      {crop && crop.stage === 'grown' && (
        <group ref={cropRef} onClick={(e) => { e.stopPropagation(); onInteract && onInteract(crop) }}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.16, 6]} />
            <meshStandardMaterial color={palette.stem} />
          </mesh>
          
          {config?.kind === 'bloom' && (
            <group position={[0, 0.25, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.15, 12, 12]} />
                <meshStandardMaterial color={palette.leaf} />
              </mesh>
              <mesh position={[0, 0.12, 0]} castShadow>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color={palette.accent} />
              </mesh>
              <mesh position={[0.08, 0.05, 0]} castShadow>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color={palette.accentLight} />
              </mesh>
            </group>
          )}

          {config?.kind === 'fruitTree' && (
            <group position={[0, 0.3, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.18, 12, 12]} />
                <meshStandardMaterial color={palette.leafDark} />
              </mesh>
              {!config.noFruit && (
                <>
                  <mesh position={[0.1, 0.05, 0.1]} castShadow>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color={palette.accent} />
                  </mesh>
                  <mesh position={[-0.1, 0.1, -0.05]} castShadow>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color={palette.accent} />
                  </mesh>
                </>
              )}
            </group>
          )}

          {config?.kind === 'aura' && (
            <group position={[0, 0.25, 0]}>
              <mesh castShadow>
                <coneGeometry args={[0.15, 0.3, 8]} />
                <meshStandardMaterial color={palette.leaf} emissive={palette.accent} emissiveIntensity={0.5} />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color={palette.accentLight} emissive={palette.accentLight} emissiveIntensity={1} />
              </mesh>
            </group>
          )}
          
          {/* Default fallback */}
          {!['bloom', 'fruitTree', 'aura'].includes(config?.kind) && (
            <mesh position={[0, 0.22, 0]} castShadow>
              <sphereGeometry args={[0.16, 10, 8]} />
              <meshStandardMaterial color={palette.leaf} />
            </mesh>
          )}
        </group>
      )}

      {!crop && (
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onInteract && onInteract(null) }}>
          <circleGeometry args={[cellSize * 0.4, 8]} />
          <meshStandardMaterial color="#4a3a18" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  )
}

export default function FarmPlot({ x, z, cols = 4, rows = 3, crops, onCellClick }) {
  const cellSize = 0.55
  const gap = 0.08
  const totalW = cols * (cellSize + gap) - gap
  const totalH = rows * (cellSize + gap) - gap

  const handleCellClick = (row, col, existing) => {
    if (onCellClick) onCellClick({ row, col, existing })
  }

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[totalW + 0.3, 0.12, totalH + 0.3]} />
        <meshStandardMaterial color="#7a5a38" />
      </mesh>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[totalW + 0.1, 0.02, totalH + 0.1]} />
        <meshStandardMaterial color="#6a4a28" />
      </mesh>

      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const cx = (c - (cols - 1) / 2) * (cellSize + gap)
          const cz = (r - (rows - 1) / 2) * (cellSize + gap)
          const key = `${r}-${c}`
          const crop = crops?.[key] || null
          return (
            <CropCell
              key={key}
              cx={cx}
              cz={cz}
              cellSize={cellSize}
              crop={crop}
              onInteract={(existing) => handleCellClick(r, c, existing)}
            />
          )
        })
      )}
    </group>
  )
}
