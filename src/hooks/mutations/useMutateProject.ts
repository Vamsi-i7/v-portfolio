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
      console.log('[DEBUG] useMutateProject execution started');
      console.log('[DEBUG] Input values:', JSON.stringify(values, null, 2));

      if ('id' in values && values.id) {
        // Update
        console.log('[DEBUG] Performing UPDATE for ID:', values.id);
        const { data, error } = await supabase
          .from('projects')
          .update(values as ProjectUpdate)
          .eq('id', values.id)
          .select()
          .single()
        
        if (error) {
          console.error('[DEBUG] Supabase UPDATE Error:', error);
          throw error;
        }
        console.log('[DEBUG] Supabase UPDATE Success:', data);
        return data
      } else {
        // Insert
        console.log('[DEBUG] Performing INSERT');
        const { data, error } = await supabase
          .from('projects')
          .insert(values as ProjectInsert)
          .select()
          .single()
        
        if (error) {
          console.error('[DEBUG] Supabase INSERT Error:', error);
          console.error('[DEBUG] Error Details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }
        console.log('[DEBUG] Supabase INSERT Success:', data);
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}
