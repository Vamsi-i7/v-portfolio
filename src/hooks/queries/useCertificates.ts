import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const CERTIFICATES_QUERY_KEY = ['certificates']

export function useCertificates(adminMode = false) {
  return useQuery({
    queryKey: [...CERTIFICATES_QUERY_KEY, { adminMode }],
    queryFn: async () => {
      let query = supabase
        .from('certificates')
        .select('*')

      if (!adminMode) {
        query = query.eq('status', 'published')
      }

      const { data, error } = await query
        .order('is_featured', { ascending: false })
        .order('issued_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}
