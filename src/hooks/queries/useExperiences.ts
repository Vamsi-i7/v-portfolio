import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const EXPERIENCES_QUERY_KEY = ['experiences']

export function useExperiences() {
  return useQuery({
    queryKey: EXPERIENCES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: false })

      if (error) throw error
      return data
    },
  })
}
