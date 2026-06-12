import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SKILLS_QUERY_KEY } from '../queries/useSkills'
import type { Database } from '@/types/database.types'

type SkillInsert = Database['public']['Tables']['skills']['Insert']
type SkillUpdate = Database['public']['Tables']['skills']['Update']

export function useMutateSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: SkillInsert | (SkillUpdate & { id: string })) => {
      if ('id' in values && values.id) {
        const { data, error } = await supabase
          .from('skills')
          .update(values as SkillUpdate)
          .eq('id', values.id)
          .select()
          .single()
        
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('skills')
          .insert(values as SkillInsert)
          .select()
          .single()
        
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY })
    },
  })
}
