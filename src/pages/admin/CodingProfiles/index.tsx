import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RefreshCw, Save, GitBranch, Code2, TerminalSquare } from 'lucide-react'
import { useSettings } from '@/hooks/queries/useSettings'
import { useMutateSettings } from '@/hooks/mutations/useMutateSettings'
import { useCodingCache } from '@/hooks/queries/useCodingCache'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

const profilesSchema = z.object({
  github: z.string().optional().nullable(),
  leetcode: z.string().optional().nullable(),
  codeforces: z.string().optional().nullable(),
})

type ProfilesFormValues = z.infer<typeof profilesSchema>

// Platform configurations for the UI
const PLATFORMS = [
  { id: 'github', label: 'GitHub', icon: GitBranch, color: 'text-gray-100' },
  { id: 'leetcode', label: 'LeetCode', icon: Code2, color: 'text-yellow-500' },
  { id: 'codeforces', label: 'Codeforces', icon: TerminalSquare, color: 'text-blue-500' },
] as const

export function CodingProfilesPage() {
  const { data: settings, isLoading: isLoadingSettings } = useSettings()
  const { data: cacheData, isLoading: isLoadingCache } = useCodingCache()
  const { mutateAsync: saveSettings, isPending: isSaving } = useMutateSettings()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [refreshingPlatform, setRefreshingPlatform] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ProfilesFormValues>({
    resolver: zodResolver(profilesSchema),
    defaultValues: {
      github: '',
      leetcode: '',
      codeforces: '',
    },
  })

  // Load existing social links into form
  useEffect(() => {
    if (settings && settings.social_links) {
      const links = settings.social_links as Record<string, string | null>
      reset({
        github: links.github || '',
        leetcode: links.leetcode || '',
        codeforces: links.codeforces || '',
      })
    }
  }, [settings, reset])

  const onSubmit = async (data: ProfilesFormValues) => {
    try {
      // Merge with existing social_links so we don't lose twitter, linkedin, etc.
      const currentLinks = (settings?.social_links as Record<string, string | null>) || {}
      
      const mergedLinks = {
        ...currentLinks,
        github: data.github || null,
        leetcode: data.leetcode || null,
        codeforces: data.codeforces || null,
      }

      await saveSettings({ social_links: mergedLinks })
      
      toast({
        title: 'Profiles Saved',
        description: 'Coding profile usernames have been updated successfully.',
      })
      
      reset(data) // Clear isDirty
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Profiles',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    }
  }

  const handleRefresh = async (platformId: string, platformLabel: string) => {
    if (platformId !== 'github' && platformId !== 'codeforces') {
      toast({
        title: 'Manual Refresh Queued',
        description: `Manual refresh for ${platformLabel} will be available in Wave 6 via Edge Functions.`,
      })
      return
    }

    setRefreshingPlatform(platformId)
    try {
      const functionName = `sync-${platformId}`
      const { data, error } = await supabase.functions.invoke(functionName)
      
      if (error) throw error
      if (data?.success === false) throw new Error(data.error)

      toast({
        title: `${platformLabel} Sync Successful`,
        description: 'Your coding profile data has been refreshed.',
      })
      
      // Invalidate cache query to update the UI
      queryClient.invalidateQueries({ queryKey: ['coding_cache'] })
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred during sync.',
      })
    } finally {
      setRefreshingPlatform(null)
    }
  }

  if (isLoadingSettings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Coding Profiles</h1>
          <p className="text-muted-foreground mt-1">
            Manage usernames and cache status for external coding platforms.
          </p>
        </div>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={!isDirty || isSaving}
          className="btn-accent"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Usernames
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLATFORMS.map((platform) => {
          const Icon = platform.icon
          // Find matching cache entry
          const cacheEntry = cacheData?.find(c => c.platform === platform.id)
          const lastUpdated = cacheEntry?.fetched_at 
            ? new Date(cacheEntry.fetched_at).toLocaleString() 
            : 'Never'
          const status = cacheEntry?.fetch_status || 'pending'
          
          return (
            <div key={platform.id} className="card-elevated flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className={`p-2 rounded-md bg-surface border border-border ${platform.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-display font-semibold">{platform.label}</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={platform.id}>Username</Label>
                  <Input 
                    id={platform.id} 
                    {...register(platform.id)} 
                    placeholder={`e.g. your-${platform.id}-username`} 
                  />
                </div>

                <div className="space-y-3 bg-surface/50 p-4 rounded-md border border-border/50 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cache Status</span>
                    <Badge variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
                      {status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-mono text-xs">{isLoadingCache ? 'Loading...' : lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={refreshingPlatform === platform.id}
                  onClick={() => handleRefresh(platform.id, platform.label)}
                >
                  {refreshingPlatform === platform.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {refreshingPlatform === platform.id ? 'Syncing...' : 'Refresh Now'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
