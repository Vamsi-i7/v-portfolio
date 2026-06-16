import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'

/**
 * Silence THREE.Clock deprecation warning from react-three-fiber
 * This is an upstream issue in R3F 9.x + Three.js r184+
 */
const originalWarn = console.warn
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' && 
    args[0].includes('THREE.Clock: This module has been deprecated')
  ) {
    return
  }
  originalWarn(...args)
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    '[V Portfolio] Root element #root not found in index.html. Check your HTML template.'
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
