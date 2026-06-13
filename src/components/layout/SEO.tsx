import { Helmet } from 'react-helmet-async'
import { useSettings } from '@/hooks/queries/useSettings'
import { supabase } from '@/lib/supabase'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  url?: string
  ogImage?: string
  type?: string
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  url, 
  ogImage,
  type = 'website'
}: SEOProps) {
  const { data: settings } = useSettings()

  // Base site URL
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl

  // Dynamic values with fallbacks
  const seoTitle = title 
    ? `${title} | ${settings?.full_name || 'Portfolio'}`
    : settings?.site_title || `${settings?.full_name || 'Portfolio'} — Software Engineer`
  
  const seoDescription = description || settings?.meta_description || settings?.bio || ''
  
  // Resolve OG Image URL
  let resolvedOgImage = ogImage
  
  // 1. If no override image provided, try CMS image
  if (!resolvedOgImage && settings?.og_image_path) {
    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(settings.og_image_path)
    resolvedOgImage = data.publicUrl
  }

  // 2. Fallback to static hero asset if still missing
  // Note: Hero asset must be an absolute URL for social crawlers
  if (!resolvedOgImage) {
    resolvedOgImage = `${siteUrl}/assets/hero.png`
  }

  // Ensure image URL is absolute (handles /assets/... overrides)
  if (resolvedOgImage && resolvedOgImage.startsWith('/')) {
    resolvedOgImage = `${siteUrl}${resolvedOgImage}`
  }

  const ogImageAlt = `${seoTitle} - Open Graph Image`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:alt" content={ogImageAlt} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={resolvedOgImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
    </Helmet>
  )
}
