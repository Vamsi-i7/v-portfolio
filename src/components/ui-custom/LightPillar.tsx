import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

interface PillarProps {
  position: [number, number, number];
  color: string;
  speed: number;
  delay: number;
}

const Pillar = ({ position, color, speed, delay }: PillarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const time = timeRef.current + delay;
    const y = ((time * speed) % 20) - 10;
    meshRef.current.position.y = y;
    
    // Using simple math to pulse opacity based on height
    const opacity = Math.max(0, Math.sin(((y + 10) * Math.PI) / 20));
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.015, 0.015, 10, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

interface LightPillarProps {
  count?: number;
  colors?: string[];
  speed?: number;
}

// Pre-generate static random seeds at the module level (100% pure relative to React rendering)
const MAX_PILLARS = 100;
const seedX = new Float32Array(MAX_PILLARS);
const seedZ = new Float32Array(MAX_PILLARS);
const seedColorIdx = new Float32Array(MAX_PILLARS);
const seedSpeedOffset = new Float32Array(MAX_PILLARS);
const seedDelay = new Float32Array(MAX_PILLARS);

for (let i = 0; i < MAX_PILLARS; i++) {
  seedX[i] = Math.random() - 0.5;
  seedZ[i] = Math.random() - 0.5;
  seedColorIdx[i] = Math.random();
  seedSpeedOffset[i] = Math.random();
  seedDelay[i] = Math.random();
}

export const LightPillar = ({ 
  count = 40, 
  colors = ['#ffffff', '#FF9500', '#E68600', '#FFB74D'],
  speed = 0.5
}: LightPillarProps) => {
  
  const pillars = useMemo(() => {
    const limit = Math.min(count, MAX_PILLARS);
    return Array.from({ length: limit }).map((_, i) => ({
      position: [
        seedX[i] * 20,
        0,
        seedZ[i] * 10
      ] as [number, number, number],
      color: colors[Math.floor(seedColorIdx[i] * colors.length)],
      speed: speed + seedSpeedOffset[i] * 0.5,
      delay: seedDelay[i] * 20
    }));
  }, [count, colors, speed]);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-[-50]">
      <Canvas frameloop="always" camera={{ position: [0, 0, 15], fov: 45 }}>
        <color attach="background" args={['#0A0A08']} />
        {pillars.map((p, i) => (
          <Pillar key={i} {...p} />
        ))}
        <EffectComposer>
          <Bloom 
            intensity={2} 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.9} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
