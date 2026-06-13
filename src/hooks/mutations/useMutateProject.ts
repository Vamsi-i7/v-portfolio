import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { PROJECTS_QUERY_KEY } from '../queries/useProjects'
import type { Database } from '@/types/database.types'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export function useMutateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ProjectInsert | (ProjectUpdate & { id: string })) => {

      if ('id' in values && values.id) {
        // Update
        const { data, error } = await supabase
          .from('projects')
          .update(values as ProjectUpdate)
          .eq('id', values.id)
          .select()
          .single()
        
        if (error) {
          throw error;
        }
        return data
      } else {
        // Insert
        const { data, error } = await supabase
          .from('projects')
          .insert(values as ProjectInsert)
          .select()
          .single()
        
        if (error) {
          throw error;
        }
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}
