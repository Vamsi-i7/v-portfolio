import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { EXPERIENCES_QUERY_KEY } from '../queries/useExperiences'

export function useDeleteExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY })
    },
  })
}
