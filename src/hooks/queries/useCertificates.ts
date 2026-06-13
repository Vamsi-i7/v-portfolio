import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const CERTIFICATES_QUERY_KEY = ['certificates']

export function useCertificates() {
  return useQuery({
    queryKey: CERTIFICATES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('issued_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}
