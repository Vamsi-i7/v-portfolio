import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const ACHIEVEMENTS_QUERY_KEY = ['achievements']

export function useAchievements() {
  return useQuery({
    queryKey: ACHIEVEMENTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('status', 'published')
        .order('achieved_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}
