import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const SETTINGS_QUERY_KEY = ['settings']

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (error) {
        // Handle no rows found gracefully (if the admin hasn't configured settings yet)
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
