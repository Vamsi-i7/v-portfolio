import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const CODING_CACHE_QUERY_KEY = ['coding_cache']

export function useCodingCache() {
  return useQuery({
    queryKey: CODING_CACHE_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coding_cache')
        .select('*')

      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
