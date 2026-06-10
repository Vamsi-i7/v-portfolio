import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SETTINGS_QUERY_KEY } from '../queries/useSettings'
import type { Database } from '@/types/database.types'

type SettingsInsert = Database['public']['Tables']['settings']['Insert']

export function useMutateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: Partial<SettingsInsert>) => {
      // Get current user id
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check if settings row exists
      const { data: existingSettings } = await supabase
        .from('settings')
        .select('id')
        .single()

      if (existingSettings) {
        // Update
        const { data, error } = await supabase
          .from('settings')
          .update(values)
          .eq('id', existingSettings.id)
          .select()
          .single()
        
        if (error) throw error
        return data
      } else {
        // Insert
        const { data, error } = await supabase
          .from('settings')
          .insert({
            ...values,
            owner_user_id: user.id,
            full_name: values.full_name || 'My Portfolio',
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}
