import { supabase } from './supabase'

/**
 * Returns the public URL for a given file path in a Supabase Storage bucket.
 * If the path is already a full URL (e.g. from an older migration or external link),
 * it simply returns it as-is.
 */
export function getPublicUrl(bucket: string, path: string | null | undefined): string {
  if (!path) return ''
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
