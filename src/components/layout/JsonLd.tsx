import { useSettings } from '@/hooks/queries/useSettings'
import { supabase } from '@/lib/supabase'

/**
 * Escapes a string for safe embedding inside a <script> tag's text content.
 * Prevents breaking out of the JSON-LD block with </script> injection.
 */
function escapeScriptContent(str: string): string {
  return str
    .replace(/<\//g, '<\\/')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

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
    "name": escapeScriptContent(String(settings.full_name || '')),
    "jobTitle": escapeScriptContent(String(settings.tagline || 'Software Engineer')),
    "url": siteUrl,
    "image": profileImageUrl || undefined,
    "description": escapeScriptContent(String(settings.meta_description || settings.bio || '')) || undefined,
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
