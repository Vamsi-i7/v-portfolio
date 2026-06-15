import React, { useMemo, useRef } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

export function NodeGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 100 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX.set(x - 0.5)
    mouseY.set(y - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Generate deterministic nodes
  const nodes = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.5
    }))
  }, [])

  // Generate edges (connections)
  const edges = useMemo(() => {
    const results = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
        if (dist < 25) {
          results.push({ i, j, opacity: 1 - dist / 25 })
        }
      }
    }
    return results
  }, [nodes])

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square max-w-[500px] flex items-center justify-center cursor-crosshair group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible"
        style={{
          x: useTransform(springX, (v) => v * 20),
          y: useTransform(springY, (v) => v * 20),
          rotateX: useTransform(springY, (v) => v * -15),
          rotateY: useTransform(springX, (v) => v * 15),
        }}
      >
        <defs>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--accent-primary-dark)" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {edges.map((edge, idx) => (
          <motion.line
            key={`edge-${idx}`}
            x1={nodes[edge.i].x}
            y1={nodes[edge.i].y}
            x2={nodes[edge.j].x}
            y2={nodes[edge.j].y}
            stroke="currentColor"
            strokeWidth="0.15"
            className="text-accent-primary/20"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: edge.opacity * 0.4 }}
            transition={{ duration: 2, delay: idx * 0.01 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.size / 8}
            fill="url(#nodeGradient)"
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              x: [0, Math.sin(node.id) * 2, 0],
              y: [0, Math.cos(node.id) * 2, 0]
            }}
            transition={{ 
              scale: { type: 'spring', delay: node.id * 0.02 },
              x: { duration: 4 + node.id % 2, repeat: Infinity, ease: "linear" },
              y: { duration: 4 + node.id % 2, repeat: Infinity, ease: "linear" }
            }}
            className="filter drop-shadow-[0_0_2px_rgba(255,149,0,0.5)]"
          />
        ))}
      </motion.svg>
      
      {/* Central Glow */}
      <div className="absolute inset-0 bg-accent-primary/5 rounded-full blur-[80px] group-hover:bg-accent-primary/10 transition-colors duration-500" />
      
      {/* Decorative Orbits */}
      <div className="absolute inset-0 border border-accent-primary/5 rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-10 border border-accent-primary/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
    </div>
  )
}
