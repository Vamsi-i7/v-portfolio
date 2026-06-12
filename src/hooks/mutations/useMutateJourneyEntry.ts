import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { JOURNEY_ENTRIES_QUERY_KEY } from '../queries/useJourneyEntries'
import type { Database } from '@/types/database.types'

type JourneyInsert = Database['public']['Tables']['journey_entries']['Insert']
type JourneyUpdate = Database['public']['Tables']['journey_entries']['Update']

export function useMutateJourneyEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: JourneyInsert | (JourneyUpdate & { id: string })) => {
      if ('id' in values && values.id) {
        const { data, error } = await supabase
          .from('journey_entries')
          .update(values as JourneyUpdate)
          .eq('id', values.id)
          .select()
          .single()
        
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('journey_entries')
          .insert(values as JourneyInsert)
          .select()
          .single()
        
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNEY_ENTRIES_QUERY_KEY })
    },
  })
}
