/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useSettings } from '@/hooks/queries/useSettings'
import { useMutateSettings } from '@/hooks/mutations/useMutateSettings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/admin/ui-custom/ImageUpload'
import { useToast } from '@/hooks/use-toast'
import { getPublicUrl } from '@/lib/storage'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const settingsSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  tagline: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
  site_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  profile_image_path: z.string().optional().nullable(),
  resume_path: z.string().optional().nullable(),
  og_image_path: z.string().optional().nullable(),
  social_links: z.object({
    github: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
    leetcode: z.string().optional().nullable(),
    codeforces: z.string().optional().nullable(),
  }).optional().nullable(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function Settings() {
  const { data: settings, isLoading } = useSettings()
  const { mutateAsync: saveSettings, isPending: isSaving } = useMutateSettings()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      full_name: '',
      tagline: '',
      bio: '',
      location: '',
      email: '',
      site_title: '',
      meta_description: '',
      profile_image_path: '',
      resume_path: '',
      og_image_path: '',
      social_links: {
        github: '',
        linkedin: '',
        twitter: '',
        leetcode: '',
        codeforces: '',
      },
    },
  })

  // Load data into form when fetched
  useEffect(() => {
    if (settings) {
      const parsedSocial = settingsSchema.shape.social_links.safeParse(settings.social_links)
      const validSocialLinks = parsedSocial.success && parsedSocial.data ? parsedSocial.data : {
          github: '',
          linkedin: '',
          twitter: '',
          leetcode: '',
          codeforces: '',
      }

      reset({
        full_name: settings.full_name || '',
        tagline: settings.tagline || '',
        bio: settings.bio || '',
        location: settings.location || '',
        email: settings.email || '',
        site_title: settings.site_title || '',
        meta_description: settings.meta_description || '',
        profile_image_path: settings.profile_image_path || '',
        resume_path: settings.resume_path || '',
        og_image_path: settings.og_image_path || '',
        social_links: validSocialLinks,
      })
    }
  }, [settings, reset])

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await saveSettings(data)
      toast({
        title: 'Settings Saved',
        description: 'Your portfolio settings have been updated successfully.',
      })
      // Reset with the saved data to clear the isDirty flag
      reset(data)
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Settings',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    }
  }

  if (isLoading) {
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
          <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal profile, site configuration, and SEO metadata.
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
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-surface border border-border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="media">Media & Assets</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* PROFILE TAB */}
          <TabsContent value="profile" className="space-y-6">
            <div className="card-elevated space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input id="full_name" {...register('full_name')} />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Public Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tagline">Professional Tagline</Label>
                <Input 
                  id="tagline" 
                  placeholder="Software Engineer & Developer" 
                  {...register('tagline')} 
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="San Francisco, CA" {...register('location')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio (supports HTML)</Label>
                <Textarea 
                  id="bio" 
                  rows={5} 
                  className="font-mono text-sm"
                  {...register('bio')} 
                />
              </div>
            </div>
          </TabsContent>

          {/* MEDIA TAB */}
          <TabsContent value="media" className="space-y-6">
            <div className="card-elevated space-y-8">
              <div className="space-y-4">
                <Label>Profile Image</Label>
                <p className="text-sm text-muted-foreground">
                  Square image recommended. Displayed in the About section.
                </p>
                <ImageUpload
                  bucket="portfolio-assets"
                  value={watch('profile_image_path')}
                  onChange={(path) => setValue('profile_image_path', path, { shouldDirty: true })}
                  onRemove={() => setValue('profile_image_path', '', { shouldDirty: true })}
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <Label>Resume PDF</Label>
                <p className="text-sm text-muted-foreground">
                  Your current resume. Linked from the Hero section.
                </p>
                <div className="flex gap-4 items-center">
                  <Input id="resume_path" {...register('resume_path')} placeholder="path/to/resume.pdf" className="flex-1" />
                  <Button variant="outline" type="button" onClick={() => {
                    const path = getValues('resume_path')
                    if (path) {
                       window.open(getPublicUrl('portfolio-assets', path), '_blank')
                    }
                  }} disabled={!watch('resume_path')}>
                    Test Link
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Enter the path relative to the bucket or public URL.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* SOCIAL TAB */}
          <TabsContent value="social" className="space-y-6">
            <div className="card-elevated space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="social_github">GitHub URL or Username</Label>
                  <Input id="social_github" {...register('social_links.github')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                  <Input id="social_linkedin" {...register('social_links.linkedin')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter/X URL</Label>
                  <Input id="social_twitter" {...register('social_links.twitter')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_leetcode">LeetCode Username (For API integration)</Label>
                  <Input id="social_leetcode" {...register('social_links.leetcode')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_codeforces">Codeforces Username (For API integration)</Label>
                  <Input id="social_codeforces" {...register('social_links.codeforces')} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SEO TAB */}
          <TabsContent value="seo" className="space-y-6">
            <div className="card-elevated space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Title (For &lt;title&gt; tag)</Label>
                <Input id="site_title" {...register('site_title')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea id="meta_description" rows={3} {...register('meta_description')} />
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <Label>Open Graph Image (Social Sharing Preview)</Label>
                <ImageUpload
                  bucket="portfolio-assets"
                  value={watch('og_image_path')}
                  onChange={(path) => setValue('og_image_path', path, { shouldDirty: true })}
                  onRemove={() => setValue('og_image_path', '', { shouldDirty: true })}
                />
              </div>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}
