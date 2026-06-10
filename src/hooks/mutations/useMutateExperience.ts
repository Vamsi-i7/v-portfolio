import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { EXPERIENCES_QUERY_KEY } from '../queries/useExperiences'
import type { Database } from '@/types/database.types'

type ExperienceInsert = Database['public']['Tables']['experience']['Insert']
type ExperienceUpdate = Database['public']['Tables']['experience']['Update']

export function useMutateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ExperienceInsert | (ExperienceUpdate & { id: string })) => {
      console.log('[DEBUG] useMutateExperience execution started');
      console.log('[DEBUG] Input values:', JSON.stringify(values, null, 2));

      if ('id' in values && values.id) {
        // Update
        console.log('[DEBUG] Performing UPDATE for ID:', values.id);
        const { data, error } = await supabase
          .from('experience')
          .update(values as ExperienceUpdate)
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
          .from('experience')
          .insert(values as ExperienceInsert)
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
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY })
    },
  })
}
