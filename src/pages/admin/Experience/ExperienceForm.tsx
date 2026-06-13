/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { useExperience } from '@/hooks/queries/useExperience'
import { useMutateExperience } from '@/hooks/mutations/useMutateExperience'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/admin/ui-custom/ImageUpload'
import { useToast } from '@/hooks/use-toast'

const experienceSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  role_title: z.string().min(2, 'Role title is required'),
  employment_type: z.string().min(2, 'Employment type is required'),
  location: z.string().optional().nullable(),
  is_remote: z.boolean(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean(),
  company_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  description_bullets: z.string().optional().nullable(), // Parsed to string[] then to JSON
  technologies: z.string().optional().nullable(), // Parsed to string[]
  status: z.enum(['draft', 'published']),
  display_order: z.number().int(),
  company_logo_path: z.string().optional().nullable(),
})

type ExperienceFormValues = z.infer<typeof experienceSchema>

export function ExperienceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isEditing = !!id
  const { data: experience, isLoading } = useExperience(id)
  const { mutateAsync: saveExperience, isPending: isSaving } = useMutateExperience()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: '',
      role_title: '',
      employment_type: 'Full-time',
      location: '',
      is_remote: false,
      start_date: '',
      end_date: '',
      is_current: false,
      company_url: '',
      description_bullets: '',
      technologies: '',
      status: 'draft',
      display_order: 0,
      company_logo_path: '',
    },
  })

  useEffect(() => {
    if (isEditing && experience) {
      // safely parse bullets
      let bulletsStr = ''
      if (Array.isArray(experience.description_bullets)) {
        bulletsStr = experience.description_bullets.join('\n')
      } else if (typeof experience.description_bullets === 'string') {
        bulletsStr = experience.description_bullets
      }

      reset({
        company_name: experience.company_name,
        role_title: experience.role_title,
        employment_type: experience.employment_type,
        location: experience.location || '',
        is_remote: experience.is_remote || false,
        start_date: experience.start_date.split('T')[0],
        end_date: experience.end_date ? experience.end_date.split('T')[0] : '',
        is_current: experience.is_current || false,
        company_url: experience.company_url || '',
        description_bullets: bulletsStr,
        technologies: experience.technologies ? experience.technologies.join('\n') : '',
        status: (experience.status as 'draft' | 'published') || 'draft',
        display_order: experience.display_order || 0,
        company_logo_path: experience.company_logo_path || '',
      })
    }
  }, [experience, isEditing, reset])

  const onSubmit = async (data: ExperienceFormValues) => {

    try {
      const technologiesArray = data.technologies 
        ? data.technologies.split('\n').map(s => s.trim()).filter(Boolean) 
        : []

      const bulletsArray = data.description_bullets
        ? data.description_bullets.split('\n').map(s => s.trim()).filter(Boolean)
        : []

      const payload = {
        ...data,
        technologies: technologiesArray,
        description_bullets: bulletsArray,
        end_date: data.is_current ? null : (data.end_date || null),
        company_url: data.company_url || null,
        ...(isEditing && id ? { id } : {}),
      }


      const result = await saveExperience(payload)
      

      toast({
        title: `Experience ${isEditing ? 'Updated' : 'Created'}`,
        description: `Successfully ${isEditing ? 'updated' : 'created'} the experience entry with ID: ${result.id}`,
      })
      
      navigate('/admin/experience')
    } catch (err: unknown) {
      
      const error = err as { message?: string, code?: string, details?: string, hint?: string };
      
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: (
          <div className="mt-2 space-y-1 text-xs font-mono">
            <p>Message: {error.message}</p>
            {error.code && <p>Code: {error.code}</p>}
            {error.details && <p>Details: {error.details}</p>}
            {error.hint && <p>Hint: {error.hint}</p>}
          </div>
        ),
      })
    }
  }

  return (
    <div className="space-y-6 max-w-5xl pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/experience')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              {isEditing ? 'Edit Experience' : 'Add Experience'}
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
          Save Experience
        </Button>
      </div>

      {isEditing && isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <form className="grid gap-6 md:grid-cols-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="card-elevated space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input id="company_name" {...register('company_name')} />
                  {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role_title">Role Title *</Label>
                  <Input id="role_title" {...register('role_title')} />
                  {errors.role_title && <p className="text-sm text-destructive">{errors.role_title.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type *</Label>
                  <select 
                    id="employment_type" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('employment_type')}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                  {errors.employment_type && <p className="text-sm text-destructive">{errors.employment_type.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register('location')} placeholder="City, Country" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_url">Company URL</Label>
                <Input id="company_url" type="url" {...register('company_url')} placeholder="https://" />
                {errors.company_url && <p className="text-sm text-destructive">{errors.company_url.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_bullets">Description Bullets (One per line)</Label>
                <Textarea 
                  id="description_bullets" 
                  rows={8} 
                  placeholder="- Developed core features...&#10;- Led a team of..."
                  {...register('description_bullets')} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies Used (One per line)</Label>
                <Textarea 
                  id="technologies" 
                  rows={4} 
                  placeholder="React&#10;Node.js"
                  {...register('technologies')} 
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

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="is_remote" className="rounded border-gray-300" {...register('is_remote')} />
                <Label htmlFor="is_remote">Remote Position</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_current" className="rounded border-gray-300" {...register('is_current')} />
                <Label htmlFor="is_current">I currently work here</Label>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input id="start_date" type="date" {...register('start_date')} />
                {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" disabled={watch('is_current')} {...register('end_date')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" type="number" {...register('display_order', { valueAsNumber: true })} />
              </div>
            </div>

            <div className="card-elevated space-y-6">
              <h3 className="font-semibold border-b border-border pb-2">Media</h3>
              
              <div className="space-y-4">
                <Label>Company Logo</Label>
                <ImageUpload
                  bucket="portfolio-assets"
                  value={watch('company_logo_path')}
                  onChange={(path) => setValue('company_logo_path', path, { shouldDirty: true })}
                  onRemove={() => setValue('company_logo_path', '', { shouldDirty: true })}
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
