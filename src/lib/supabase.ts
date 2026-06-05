import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safety check for local developer environment configuration
const isPlaceholder = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-project-ref') || 
  supabaseAnonKey.includes('your-anon-key-here')

if (isPlaceholder && import.meta.env.DEV) {
  console.warn(
    '⚠️ [Supabase Client]: Environment variables are missing or using placeholders. ' +
    'Please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
  )
}

// Initialize client with fallback placeholder to prevent crash during builds
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key-fallback'
)
