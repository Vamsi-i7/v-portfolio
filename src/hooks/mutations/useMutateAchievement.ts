import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ACHIEVEMENTS_QUERY_KEY } from '../queries/useAchievements'
import type { Database } from '@/types/database.types'

type AchievementInsert = Database['public']['Tables']['achievements']['Insert']
type AchievementUpdate = Database['public']['Tables']['achievements']['Update']

export function useMutateAchievement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: AchievementInsert | (AchievementUpdate & { id: string })) => {
      if ('id' in values && values.id) {
        const { data, error } = await supabase
          .from('achievements')
          .update(values as AchievementUpdate)
          .eq('id', values.id)
          .select()
          .single()
        
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('achievements')
          .insert(values as AchievementInsert)
          .select()
          .single()
        
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACHIEVEMENTS_QUERY_KEY })
    },
  })
}
