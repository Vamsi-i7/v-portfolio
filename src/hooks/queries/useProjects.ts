import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const PROJECTS_QUERY_KEY = ['projects']

export function useProjects() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}
