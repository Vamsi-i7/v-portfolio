import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { EXPERIENCES_QUERY_KEY } from './useExperiences'

export function useExperience(id?: string) {
  return useQuery({
    queryKey: [...EXPERIENCES_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
