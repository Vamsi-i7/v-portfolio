import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { PROJECTS_QUERY_KEY } from './useProjects'

export function useProject(id?: string) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
