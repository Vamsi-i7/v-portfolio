import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import * as THREE from 'three'

function createRandom(seed: number) {
  let s = seed
  return function () {
    const x = Math.sin(s++) * 10000
    return x - Math.floor(x)
  }
}

export function Constellation() {
  const groupRef = useRef<THREE.Group>(null!)
  const nucleusRef = useRef<THREE.Mesh>(null!)
  const orbit1Ref = useRef<THREE.Group>(null!)
  const orbit2Ref = useRef<THREE.Group>(null!)
  const orbit3Ref = useRef<THREE.Group>(null!)
  
  const { smoothProgress } = useScrollProgress()

  // Generate static positions for the 3 particle orbits
  const orbit1Particles = useMemo(() => {
    const random = createRandom(42)
    const temp = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + (random() - 0.5) * 0.4
      const r = 1.0 + random() * 0.25
      temp.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, (random() - 0.5) * 0.15))
    }
    return temp
  }, [])

  const orbit2Particles = useMemo(() => {
    const random = createRandom(100)
    const temp = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + (random() - 0.5) * 0.4
      const r = 1.35 + random() * 0.3
      temp.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, (random() - 0.5) * 0.15))
    }
    return temp
  }, [])

  const orbit3Particles = useMemo(() => {
    const random = createRandom(200)
    const temp = []
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + (random() - 0.5) * 0.5
      const r = 1.7 + random() * 0.3
      temp.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, (random() - 0.5) * 0.2))
    }
    return temp
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    const scroll = smoothProgress.get()
    const mouseX = state.pointer.x
    const mouseY = state.pointer.y
    const time = state.clock.getElapsedTime()

    // Smooth mouse tilt parallax
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.3, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.3, 0.05)

    // Scroll translation & scaling
    const isMobile = state.size.width < 1024
    const initialX = isMobile ? 0.0 : 1.2
    const initialY = isMobile ? -0.4 : 0.0
    const baseScale = isMobile ? 0.8 : 1.25

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      initialX + scroll * (isMobile ? 0.0 : 3.0),
      0.08
    )
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      initialY - scroll * 2.0,
      0.08
    )
    const scaleFactor = baseScale * (1 - scroll * 0.4)
    groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor)

    // Nucleus breathing pulse
    if (nucleusRef.current) {
      const pulse = 1.0 + Math.sin(time * 1.5) * 0.03
      nucleusRef.current.scale.set(pulse, pulse, pulse)
      nucleusRef.current.rotation.y += 0.003
      nucleusRef.current.rotation.x += 0.001
    }

    // Spin orbits at varying speeds and directions
    if (orbit1Ref.current) orbit1Ref.current.rotation.z += 0.008
    if (orbit2Ref.current) orbit2Ref.current.rotation.z -= 0.005
    if (orbit3Ref.current) orbit3Ref.current.rotation.z += 0.003
  })

  return (
    <group ref={groupRef}>
      {/* Lighting for glass refraction/specular effects */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -2]} intensity={0.5} color="#FF9500" />
      
      {/* Central Glass Nucleus with inner point light */}
      <group>
        <mesh ref={nucleusRef}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <meshPhysicalMaterial
            color="#FF9500"
            roughness={0.03}
            metalness={0.05}
            transmission={0.85}
            thickness={1.0}
            ior={1.45}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            emissive="#FF9500"
            emissiveIntensity={0.2}
          />
        </mesh>
        <pointLight color="#FF9500" intensity={2.0} distance={3.0} decay={2.0} />
      </group>

      {/* Orbit 1: Faint inner ring + orange particles */}
      <group ref={orbit1Ref} rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.003, 8, 100]} />
          <meshBasicMaterial color="#FF9500" transparent opacity={0.2} />
        </mesh>
        {orbit1Particles.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#FF9500" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Orbit 2: Thin middle ring + white particles */}
      <group ref={orbit2Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.4, 0.002, 8, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
        {orbit2Particles.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Orbit 3: Thin outer ring + mixed particles */}
      <group ref={orbit3Ref} rotation={[Math.PI / 3, -Math.PI / 5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.75, 0.001, 8, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
        {orbit3Particles.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial 
              color={idx % 2 === 0 ? "#FF9500" : "#ffffff"} 
              transparent 
              opacity={0.5} 
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
