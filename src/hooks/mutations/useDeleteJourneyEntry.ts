import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { JOURNEY_ENTRIES_QUERY_KEY } from '../queries/useJourneyEntries'

export function useDeleteJourneyEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('journey_entries')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNEY_ENTRIES_QUERY_KEY })
    },
  })
}
