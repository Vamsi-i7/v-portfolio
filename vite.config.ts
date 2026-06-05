import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Bundle visualizer: generates stats.html after `npm run build`
    // Only runs during build, not during dev
    mode === 'production' &&
      visualizer({
        filename: 'stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Warn if any chunk is larger than 500kb (before gzip)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Manual code splitting: Three.js must NEVER be in the initial bundle
        // Admin dashboard chunk will be added when admin routes are implemented
        manualChunks: {
          // Vendor chunk for stable dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-motion': ['framer-motion'],
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
}))
