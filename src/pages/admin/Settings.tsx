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
  email: z.string().email('Invalid email').or(z.literal('')).optional().nullable(),
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
  about_philosophy: z.string().optional().nullable(),
  about_principles: z.string().optional().nullable().refine(val => {
    if (!val) return true;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, 'Principles must be a valid JSON array of objects'),
  availability_status: z.string().optional().nullable(),
  contact_headline: z.string().optional().nullable(),
  contact_description: z.string().optional().nullable(),
  response_protocol: z.string().optional().nullable(),
  footer_tagline: z.string().optional().nullable(),
  copyright_text: z.string().optional().nullable(),
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
      about_philosophy: '',
      about_principles: '[]',
      availability_status: '',
      contact_headline: '',
      contact_description: '',
      response_protocol: '',
      footer_tagline: '',
      copyright_text: '',
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
        about_philosophy: settings.about_philosophy || '',
        about_principles: settings.about_principles ? JSON.stringify(settings.about_principles, null, 2) : '[]',
        availability_status: settings.availability_status || '',
        contact_headline: settings.contact_headline || '',
        contact_description: settings.contact_description || '',
        response_protocol: settings.response_protocol || '',
        footer_tagline: settings.footer_tagline || '',
        copyright_text: settings.copyright_text || '',
      })
    }
  }, [settings, reset])

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      const parsedPrinciples = data.about_principles ? JSON.parse(data.about_principles) : []
      
      await saveSettings({
        ...data,
        about_principles: parsedPrinciples,
      })
      
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal profile, site configuration, and SEO metadata.
          </p>
        </div>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={!isDirty || isSaving}
          className="btn-accent shrink-0 w-full sm:w-auto"
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
        <TabsList className="bg-surface border border-border flex w-full overflow-x-auto whitespace-nowrap scrollbar-none justify-start md:justify-center md:flex-wrap">
          <TabsTrigger value="profile" className="shrink-0">Profile</TabsTrigger>
          <TabsTrigger value="media" className="shrink-0">Media & Assets</TabsTrigger>
          <TabsTrigger value="social" className="shrink-0">Social Links</TabsTrigger>
          <TabsTrigger value="copy" className="shrink-0">Landing Copy</TabsTrigger>
          <TabsTrigger value="seo" className="shrink-0">SEO & Meta</TabsTrigger>
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
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
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

          {/* COPY TAB */}
          <TabsContent value="copy" className="space-y-6">
            <div className="card-elevated space-y-6">
              <h2 className="text-lg font-bold tracking-tight text-white uppercase font-display border-b border-border pb-3">Section Headlines & Layout Copy</h2>
              
              <div className="space-y-2">
                <Label htmlFor="about_philosophy">About: Philosophy Statement</Label>
                <Input id="about_philosophy" {...register('about_philosophy')} placeholder="I believe in building systems that don't just work, but endure." />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="availability_status">Contact: Availability Pill</Label>
                  <Input id="availability_status" {...register('availability_status')} placeholder="Available for Q3 2026" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="response_protocol">Contact: Response Protocol</Label>
                  <Input id="response_protocol" {...register('response_protocol')} placeholder="Under 12 Hours" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_headline">Contact: Headline Callout</Label>
                <Input id="contact_headline" {...register('contact_headline')} placeholder="Looking for a staff-level partner to lead your next technical breakthrough?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_description">Contact: Sub-description Copy</Label>
                <Textarea id="contact_description" rows={3} {...register('contact_description')} placeholder="Whether it's complex distributed systems, autonomous AI integration..." />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="footer_tagline">Footer Tagline</Label>
                  <Input id="footer_tagline" {...register('footer_tagline')} placeholder="Designing architectures. Engineering impact. Shipping excellence since 2020." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copyright_text">Footer Copyright Label</Label>
                  <Input id="copyright_text" {...register('copyright_text')} placeholder="CORE.SYS OPERATING SYSTEM" />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <Label htmlFor="about_principles">About: Engineering Principles (JSON format)</Label>
                <Textarea 
                  id="about_principles" 
                  rows={8} 
                  className="font-mono text-xs bg-[#0b0b0f] text-white border border-border" 
                  {...register('about_principles')} 
                />
                {errors.about_principles && (
                  <p className="text-sm text-destructive">{errors.about_principles.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Provide a JSON array containing your four core values/principles. Schema: E.g.<br />
                  <code className="bg-black/30 p-1 rounded font-mono text-[10px]">
                    {"[ { \"title\": \"Predictive Scale\", \"desc\": \"...\", \"icon\": \"cpu\" } ]"}
                  </code><br />
                  Valid icon values: <code className="text-accent">cpu</code>, <code className="text-accent">box</code>, <code className="text-accent">layout</code>, <code className="text-accent">zap</code>, <code className="text-accent">shield</code>, <code className="text-accent">award</code>, <code className="text-accent">star</code>.
                </p>
              </div>
            </div>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              disabled={!isDirty || isSaving}
              className="btn-accent w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
