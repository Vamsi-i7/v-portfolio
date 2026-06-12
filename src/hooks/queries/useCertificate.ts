import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { CERTIFICATES_QUERY_KEY } from './useCertificates'

export function useCertificate(id?: string) {
  return useQuery({
    queryKey: [...CERTIFICATES_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
