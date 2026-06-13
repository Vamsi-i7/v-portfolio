import { useSettings } from '@/hooks/queries/useSettings'
import { supabase } from '@/lib/supabase'

export function JsonLd() {
  const { data: settings } = useSettings()

  if (!settings) return null

  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
  const socialLinks = settings.social_links as Record<string, string> || {}

  // Resolve Profile Image
  let profileImageUrl = ''
  if (settings.profile_image_path) {
    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(settings.profile_image_path)
    profileImageUrl = data.publicUrl
  }

  // Schema.org Person object
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": settings.full_name,
    "jobTitle": settings.tagline || "Software Engineer",
    "url": siteUrl,
    "image": profileImageUrl || undefined,
    "email": settings.email || undefined,
    "description": settings.meta_description || settings.bio || undefined,
    "sameAs": [
      socialLinks.github,
      socialLinks.linkedin,
      socialLinks.twitter,
      socialLinks.instagram
    ].filter(Boolean)
  }

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  )
}
