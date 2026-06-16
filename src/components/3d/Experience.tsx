import { useRef, useMemo, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { Constellation } from './Constellation'

const MAX_MIST_COUNT = 2000
const MAX_STAR_COUNT = 1000

// Pre-generate static random arrays outside render context for react-hooks/purity rules
const preGeneratedMistPositions = new Float32Array(MAX_MIST_COUNT * 3)
for (let i = 0; i < MAX_MIST_COUNT; i++) {
  preGeneratedMistPositions[i * 3] = (Math.random() - 0.5) * 20
  preGeneratedMistPositions[i * 3 + 1] = (Math.random() - 0.5) * 40
  preGeneratedMistPositions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const preGeneratedStarPositions = new Float32Array(MAX_STAR_COUNT * 3)
for (let i = 0; i < MAX_STAR_COUNT; i++) {
  const r = 20 + Math.random() * 30
  const theta = 2 * Math.PI * Math.random()
  const phi = Math.acos(2 * Math.random() - 1)
  preGeneratedStarPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
  preGeneratedStarPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
  preGeneratedStarPositions[i * 3 + 2] = r * Math.cos(phi)
}

interface ParticleMistProps {
  count?: number
}

function ParticleMist({ count = 2000 }: ParticleMistProps) {
  const points = useRef<THREE.Points>(null!)
  const { smoothProgress } = useScrollProgress()
  const { viewport } = useThree()

  // Pure slice of static pre-generated data
  const positions = useMemo(() => {
    return preGeneratedMistPositions.slice(0, count * 3)
  }, [count])

  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (!points.current) return

    timeRef.current += delta
    const time = timeRef.current
    const progress = smoothProgress.get()
    
    // Subtle drift + mouse tracking rotation
    const mouseX = state.pointer.x * 0.5
    const mouseY = state.pointer.y * 0.5
    points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, time * 0.03 + mouseX * 0.2, 0.05)
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, Math.sin(time * 0.1) * 0.05 - mouseY * 0.1, 0.05)
    
    // Scroll parallax - move the entire mist vertically
    points.current.position.y = THREE.MathUtils.lerp(
      points.current.position.y,
      progress * viewport.height * 2,
      0.05
    )

    // Breathing effect
    const scale = 1 + Math.sin(time * 0.5) * 0.02
    points.current.scale.set(scale, scale, scale)
  })

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  )
}

interface StarFieldProps {
  count?: number
}

function StarField({ count = 1000 }: StarFieldProps) {
  const points = useRef<THREE.Points>(null!)
  
  // Pure slice of static pre-generated data
  const positions = useMemo(() => {
    return preGeneratedStarPositions.slice(0, count * 3)
  }, [count])

  useFrame(() => {
    if (!points.current) return
    points.current.rotation.y += 0.0005
  })

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#888888"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
      />
    </Points>
  )
}

export function Experience() {
  const { size } = useThree()
  const isMobile = size.width < 768

  return (
    <>
      <color attach="background" args={['#020202']} />
      
      <fog attach="fog" args={['#020202', 5, 25]} />

      <group rotation={[0, 0, Math.PI / 4]}>
        <ParticleMist count={isMobile ? 800 : 2000} />
      </group>

      <StarField count={isMobile ? 300 : 1000} />

      <Suspense fallback={null}>
        <Constellation />
      </Suspense>

      {/* Subtle central glow */}
      <mesh scale={10}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#111111" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide} 
        />
      </mesh>
    </>
  )
}
