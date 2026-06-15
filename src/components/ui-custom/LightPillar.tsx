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

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() + delay;
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

export const LightPillar = ({ 
  count = 40, 
  colors = ['#ffffff', '#FF9500', '#E68600', '#FFB74D'],
  speed = 0.5
}: LightPillarProps) => {
  
  const pillars = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        0,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: speed + Math.random() * 0.5,
      delay: Math.random() * 20
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
