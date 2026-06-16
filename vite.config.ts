import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || 'http://localhost:5173'
  
  // -------------------------------------------------------------------------
  // SEO Metadata Generation (robots.txt, sitemap.xml)
  // -------------------------------------------------------------------------
  // This ensures VITE_SITE_URL is the single source of truth for discovery.
  const isBuild = process.env.NODE_ENV === 'production' || mode === 'production'
  
  if (isBuild) {
    const publicDir = resolve(__dirname, './public')
    const date = new Date().toISOString().split('T')[0]
    
    console.log(`[SEO] Generating discovery files for ${siteUrl}...`)

    const robotsContent = `User-agent: *\nAllow: /\n\n# Sitemap Location\nSitemap: ${siteUrl}/sitemap.xml`
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    try {
      fs.writeFileSync(resolve(publicDir, 'robots.txt'), robotsContent)
      fs.writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemapContent)
      console.log('[SEO] robots.txt and sitemap.xml generated successfully.')
    } catch (err) {
      console.error('[SEO] Failed to generate discovery files:', err)
    }
  }

  return {
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
    optimizeDeps: {
      include: ['@splinetool/react-spline', '@splinetool/runtime'],
    },
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
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('three') || 
                id.includes('@react-three') || 
                id.includes('postprocessing') ||
                id.includes('@splinetool')
              ) {
                return 'vendor-3d';
              }
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@tanstack/react-query')) {
                return 'vendor-query';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform/resolvers')) {
                return 'vendor-forms';
              }
              if (id.includes('@supabase/supabase-js')) {
                return 'vendor-supabase';
              }
            }
          },
        },
      },
    },
  }
})
