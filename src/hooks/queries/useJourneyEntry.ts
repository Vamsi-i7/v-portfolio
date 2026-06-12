import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { JOURNEY_ENTRIES_QUERY_KEY } from './useJourneyEntries'

export function useJourneyEntry(id?: string) {
  return useQuery({
    queryKey: [...JOURNEY_ENTRIES_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('journey_entries')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
