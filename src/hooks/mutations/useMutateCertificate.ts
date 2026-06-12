import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { CERTIFICATES_QUERY_KEY } from '../queries/useCertificates'
import type { Database } from '@/types/database.types'

type CertificateInsert = Database['public']['Tables']['certificates']['Insert']
type CertificateUpdate = Database['public']['Tables']['certificates']['Update']

export function useMutateCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CertificateInsert | (CertificateUpdate & { id: string })) => {
      if ('id' in values && values.id) {
        const { data, error } = await supabase
          .from('certificates')
          .update(values as CertificateUpdate)
          .eq('id', values.id)
          .select()
          .single()
        
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('certificates')
          .insert(values as CertificateInsert)
          .select()
          .single()
        
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATES_QUERY_KEY })
    },
  })
}
