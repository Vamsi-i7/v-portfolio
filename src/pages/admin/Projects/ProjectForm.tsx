/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { useProject } from '@/hooks/queries/useProject'
import { useMutateProject } from '@/hooks/mutations/useMutateProject'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/admin/ui-custom/ImageUpload'
import { useToast } from '@/hooks/use-toast'

const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  short_description: z.string().optional().nullable(),
  long_description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  demo_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  github_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  tech_stack: z.string().optional().nullable(), // We'll parse this to array
  status: z.enum(['draft', 'published']),
  is_featured: z.boolean(),
  is_ongoing: z.boolean(),
  started_at: z.string().optional().nullable(),
  ended_at: z.string().optional().nullable(),
  display_order: z.number().int(),
  thumbnail_path: z.string().optional().nullable(),
  banner_path: z.string().optional().nullable(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export function ProjectForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isEditing = !!id
  const { data: project, isLoading } = useProject(id)
  const { mutateAsync: saveProject, isPending: isSaving } = useMutateProject()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      short_description: '',
      long_description: '',
      category: '',
      demo_url: '',
      github_url: '',
      tech_stack: '',
      status: 'draft',
      is_featured: false,
      is_ongoing: false,
      started_at: '',
      ended_at: '',
      display_order: 0,
      thumbnail_path: '',
      banner_path: '',
    },
  })

  useEffect(() => {
    if (isEditing && project) {
      reset({
        title: project.title,
        slug: project.slug,
        short_description: project.short_description || '',
        long_description: project.long_description || '',
        category: project.category || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        tech_stack: project.tech_stack ? project.tech_stack.join('\n') : '',
        status: (project.status as 'draft' | 'published') || 'draft',
        is_featured: project.is_featured || false,
        is_ongoing: project.is_ongoing || false,
        started_at: project.started_at ? project.started_at.split('T')[0] : '',
        ended_at: project.ended_at ? project.ended_at.split('T')[0] : '',
        display_order: project.display_order || 0,
        thumbnail_path: project.thumbnail_path || '',
        banner_path: project.banner_path || '',
      })
    }
  }, [project, isEditing, reset])

  const onSubmit = async (data: ProjectFormValues) => {
    console.log('[DEBUG] ProjectForm onSubmit triggered');
    console.log('[DEBUG] Form data received:', JSON.stringify(data, null, 2));

    try {
      const techStackArray = data.tech_stack 
        ? data.tech_stack.split('\n').map(s => s.trim()).filter(Boolean) 
        : []

      const payload = {
        ...data,
        tech_stack: techStackArray,
        started_at: data.started_at || null,
        ended_at: data.ended_at || null,
        demo_url: data.demo_url || null,
        github_url: data.github_url || null,
        ...(isEditing && id ? { id } : {}),
      }

      console.log('[DEBUG] Sending payload to mutation:', JSON.stringify(payload, null, 2));

      const result = await saveProject(payload)
      
      console.log('[DEBUG] SaveProject result:', result);

      toast({
        title: `Project ${isEditing ? 'Updated' : 'Created'}`,
        description: `Successfully ${isEditing ? 'updated' : 'created'} the project with ID: ${result.id}`,
      })
      
      navigate('/admin/projects')
    } catch (err: unknown) {
      console.error('[DEBUG] ProjectForm Submit Error:', err);
      
      // Type-safe handling for Supabase error objects
      const error = err as { message?: string, code?: string, details?: string, hint?: string };
      
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: (
          <div className="mt-2 space-y-1 text-xs font-mono">
            <p>Message: {error?.message || 'Unknown error occurred'}</p>
            {error?.code && <p>Code: {error.code}</p>}
            {error?.details && <p>Details: {error.details}</p>}
            {error?.hint && <p>Hint: {error.hint}</p>}
          </div>
        ),
      })
    }
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              {isEditing ? 'Edit Project' : 'New Project'}
            </h1>
          </div>
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
          Save Project
        </Button>
      </div>

      <form className="grid gap-6 md:grid-cols-3" onSubmit={handleSubmit(onSubmit)}>
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="card-elevated space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input id="slug" {...register('slug')} placeholder="my-awesome-project" />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea id="short_description" rows={2} {...register('short_description')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_description">Long Description</Label>
              <Textarea id="long_description" rows={8} {...register('long_description')} />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input id="demo_url" type="url" {...register('demo_url')} placeholder="https://" />
                {errors.demo_url && <p className="text-sm text-destructive">{errors.demo_url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" type="url" {...register('github_url')} placeholder="https://github.com/..." />
                {errors.github_url && <p className="text-sm text-destructive">{errors.github_url.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tech_stack">Tech Stack (One per line)</Label>
              <Textarea 
                id="tech_stack" 
                rows={5} 
                placeholder="React&#10;TypeScript&#10;TailwindCSS"
                {...register('tech_stack')} 
              />
            </div>
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="space-y-6">
          <div className="card-elevated space-y-6">
            <h3 className="font-semibold border-b border-border pb-2">Configuration</h3>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('status')}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register('category')} placeholder="Frontend, Fullstack, CLI..." />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="is_featured" className="rounded border-gray-300" {...register('is_featured')} />
              <Label htmlFor="is_featured">Featured Project</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="is_ongoing" className="rounded border-gray-300" {...register('is_ongoing')} />
              <Label htmlFor="is_ongoing">Ongoing Project</Label>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="started_at">Start Date</Label>
              <Input id="started_at" type="date" {...register('started_at')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ended_at">End Date</Label>
              <Input id="ended_at" type="date" disabled={watch('is_ongoing')} {...register('ended_at')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input id="display_order" type="number" {...register('display_order', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="card-elevated space-y-6">
            <h3 className="font-semibold border-b border-border pb-2">Media</h3>
            
            <div className="space-y-4">
              <Label>Thumbnail Image</Label>
              <ImageUpload
                bucket="portfolio-assets"
                value={watch('thumbnail_path')}
                onChange={(path) => setValue('thumbnail_path', path, { shouldDirty: true })}
                onRemove={() => setValue('thumbnail_path', '', { shouldDirty: true })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <Label>Banner Image</Label>
              <ImageUpload
                bucket="portfolio-assets"
                value={watch('banner_path')}
                onChange={(path) => setValue('banner_path', path, { shouldDirty: true })}
                onRemove={() => setValue('banner_path', '', { shouldDirty: true })}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
