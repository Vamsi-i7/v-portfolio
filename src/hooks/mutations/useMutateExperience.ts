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

      if ('id' in values && values.id) {
        // Update
        const { data, error } = await supabase
          .from('experience')
          .update(values as ExperienceUpdate)
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
          .from('experience')
          .insert(values as ExperienceInsert)
          .select()
          .single()
        
        if (error) {
          throw error;
        }
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY })
    },
  })
}
