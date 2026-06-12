/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { useAchievement } from '@/hooks/queries/useAchievement'
import { useMutateAchievement } from '@/hooks/mutations/useMutateAchievement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  achievement_type: z.enum(['now', 'award', 'competition', 'milestone']),
  platform: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
  icon_name: z.string().optional().nullable(),
  achieved_at: z.string().optional().nullable(),
  link_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  status: z.enum(['draft', 'published']),
})

type FormValues = z.infer<typeof formSchema>

const ACHIEVEMENT_TYPES = ['now', 'award', 'competition', 'milestone'] as const

export function AchievementForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isEditing = !!id
  const { data: achievement, isLoading } = useAchievement(id)
  const { mutateAsync: saveAchievement, isPending: isSaving } = useMutateAchievement()

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
      achievement_type: 'now',
      platform: '',
      value: '',
      icon_name: '',
      achieved_at: '',
      link_url: '',
      status: 'draft',
    },
  })

  const currentType = watch('achievement_type')
  const currentStatus = watch('status')

  useEffect(() => {
    if (isEditing && achievement) {
      reset({
        title: achievement.title,
        achievement_type: (achievement.achievement_type as 'now' | 'award' | 'competition' | 'milestone') || 'now',
        platform: achievement.platform || '',
        value: achievement.value || '',
        icon_name: achievement.icon_name || '',
        achieved_at: achievement.achieved_at || '',
        link_url: achievement.link_url || '',
        status: (achievement.status as 'draft' | 'published') || 'draft',
      })
    }
  }, [achievement, isEditing, reset])

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        achieved_at: data.achieved_at ? data.achieved_at : null,
        link_url: data.link_url ? data.link_url : null,
        platform: data.platform ? data.platform : null,
        value: data.value ? data.value : null,
        icon_name: data.icon_name ? data.icon_name : null,
      }

      await saveAchievement(isEditing ? { id, ...payload } : payload)

      toast({
        title: 'Success',
        description: `Achievement ${isEditing ? 'updated' : 'added'} successfully.`,
      })
      navigate('/admin/achievements')
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error saving achievement',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    }
  }

  if (isEditing && isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading achievement...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/achievements')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold">
            {isEditing ? 'Edit Achievement' : 'Add Achievement'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Update achievement details.' : 'Add a new achievement or milestone.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-elevated space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} placeholder="e.g. 500 LeetCode Problems Solved" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Type *</Label>
            <Select 
              value={currentType} 
              onValueChange={(val: 'now' | 'award' | 'competition' | 'milestone') => setValue('achievement_type', val, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ACHIEVEMENT_TYPES.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.achievement_type && <p className="text-sm text-destructive">{errors.achievement_type.message}</p>}
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

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input id="platform" {...register('platform')} placeholder="e.g. LeetCode, Codeforces" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input id="value" {...register('value')} placeholder="e.g. Top 5% Globally" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
            <Input id="icon_name" {...register('icon_name')} placeholder="e.g. Trophy, Award" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achieved_at">Achieved Date</Label>
            <Input id="achieved_at" type="date" {...register('achieved_at')} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="link_url">Link URL</Label>
            <Input id="link_url" type="url" {...register('link_url')} placeholder="https://..." />
            {errors.link_url && <p className="text-sm text-destructive">{errors.link_url.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/achievements')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || (!isDirty && isEditing)}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Save Changes' : 'Add Achievement'}
          </Button>
        </div>
      </form>
    </div>
  )
}
