import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SKILLS_QUERY_KEY } from './useSkills'

export function useSkill(id?: string) {
  return useQuery({
    queryKey: [...SKILLS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
