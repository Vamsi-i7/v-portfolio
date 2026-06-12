import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const SKILLS_QUERY_KEY = ['skills']

export function useSkills() {
  return useQuery({
    queryKey: SKILLS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true })

      if (error) throw error
      return data
    },
  })
}
