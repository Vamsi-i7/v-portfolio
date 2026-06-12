/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { useJourneyEntry } from '@/hooks/queries/useJourneyEntry'
import { useMutateJourneyEntry } from '@/hooks/mutations/useMutateJourneyEntry'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  entry_type: z.string().min(1, 'Type is required'),
  entry_date: z.string().min(1, 'Date is required'),
  description: z.string().optional().nullable(),
  icon_override: z.string().optional().nullable(),
  tags: z.string().optional(),
  link_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  link_label: z.string().optional().nullable(),
  is_highlight: z.boolean(),
  display_order: z.number().int(),
  status: z.enum(['draft', 'published']),
})

type FormValues = z.infer<typeof formSchema>

const ENTRY_TYPES = [
  'Work',
  'Education',
  'Project',
  'Achievement',
  'Certification',
  'Milestone',
  'Personal',
]

export function JourneyForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isEditing = !!id
  const { data: entry, isLoading } = useJourneyEntry(id)
  const { mutateAsync: saveEntry, isPending: isSaving } = useMutateJourneyEntry()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      entry_type: 'Milestone',
      entry_date: new Date().toISOString().split('T')[0],
      description: '',
      icon_override: '',
      tags: '',
      link_url: '',
      link_label: '',
      is_highlight: false,
      display_order: 0,
      status: 'draft',
    },
  })

  const currentType = watch('entry_type');
  const currentStatus = watch('status');

  useEffect(() => {
    if (isEditing && entry) {
      reset({
        title: entry.title,
        entry_type: entry.entry_type,
        entry_date: entry.entry_date,
        description: entry.description || '',
        icon_override: entry.icon_override || '',
        tags: entry.tags ? entry.tags.join(', ') : '',
        link_url: entry.link_url || '',
        link_label: entry.link_label || '',
        is_highlight: entry.is_highlight || false,
        display_order: entry.display_order || 0,
        status: (entry.status as 'draft' | 'published') || 'draft',
      })
    }
  }, [entry, isEditing, reset])

  const onSubmit = async (data: FormValues) => {
    try {
      const parsedTags = data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

      const payload = {
        ...data,
        tags: parsedTags,
      }

      await saveEntry(isEditing ? { id, ...payload } : payload)

      toast({
        title: 'Success',
        description: `Journey entry ${isEditing ? 'updated' : 'created'} successfully.`,
      })
      navigate('/admin/journey')
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error saving entry',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    }
  }

  if (isEditing && isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading entry...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/journey')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold">
            {isEditing ? 'Edit Journey Entry' : 'New Journey Entry'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Update the details below.' : 'Add a new milestone to your timeline.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-elevated space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} placeholder="e.g. Senior Engineer Promotion" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Type *</Label>
            <Select 
              value={currentType} 
              onValueChange={(val) => setValue('entry_type', val, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.entry_type && <p className="text-sm text-destructive">{errors.entry_type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry_date">Date *</Label>
            <Input id="entry_date" type="date" {...register('entry_date')} />
            {errors.entry_date && <p className="text-sm text-destructive">{errors.entry_date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={currentStatus} 
              onValueChange={(val: 'draft' | 'published') => setValue('status', val, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register('description')} 
              placeholder="What happened? Keep it concise."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" {...register('tags')} placeholder="e.g. Promotion, Leadership" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon_override">Icon Override (Optional)</Label>
            <Input id="icon_override" {...register('icon_override')} placeholder="Lucide icon name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url">Link URL</Label>
            <Input id="link_url" type="url" {...register('link_url')} placeholder="https://..." />
            {errors.link_url && <p className="text-sm text-destructive">{errors.link_url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_label">Link Label</Label>
            <Input id="link_label" {...register('link_label')} placeholder="e.g. View Post" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input id="display_order" type="number" {...register('display_order', { valueAsNumber: true })} />
          </div>

          <div className="space-y-2 flex items-center gap-2 mt-8">
            <input 
              type="checkbox" 
              id="is_highlight" 
              className="w-4 h-4"
              {...register('is_highlight')} 
            />
            <Label htmlFor="is_highlight" className="mb-0">Highlight this entry</Label>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/journey')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || (!isDirty && isEditing)}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Save Changes' : 'Create Entry'}
          </Button>
        </div>
      </form>
    </div>
  )
}
