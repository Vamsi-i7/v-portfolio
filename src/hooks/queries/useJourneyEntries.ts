import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const JOURNEY_ENTRIES_QUERY_KEY = ['journey_entries']

export function useJourneyEntries() {
  return useQuery({
    queryKey: JOURNEY_ENTRIES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journey_entries')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true })
        .order('entry_date', { ascending: false })

      if (error) throw error
      return data
    },
  })
}
