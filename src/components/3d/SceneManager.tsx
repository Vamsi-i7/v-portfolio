import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Experience } from './Experience'

export function SceneManager() {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-[-1]">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />

        <Suspense fallback={null}>
          <Experience />
        </Suspense>

        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={0.4} 
            radius={0.3} 
          />
          <Vignette offset={0.5} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

