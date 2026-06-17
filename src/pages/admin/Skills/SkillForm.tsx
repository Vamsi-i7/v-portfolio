/* eslint-disable react-hooks/incompatible-library */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft, Code2 } from 'lucide-react'
import { useSkill } from '@/hooks/queries/useSkill'
import { useMutateSkill } from '@/hooks/mutations/useMutateSkill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional().nullable(),
  icon_identifier: z.string().optional().nullable(),
  display_order: z.number().int(),
  status: z.enum(['draft', 'published']),
})

type FormValues = z.infer<typeof formSchema>

const CATEGORIES = [
  'Languages',
  'Frameworks & Libraries',
  'Databases',
  'Cloud & DevOps',
  'Tools',
  'Testing',
  'Other',
]

const PROFICIENCIES = ['beginner', 'intermediate', 'advanced', 'expert'] as const

export function SkillForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isEditing = !!id
  const { data: skill, isLoading } = useSkill(id)
  const { mutateAsync: saveSkill, isPending: isSaving } = useMutateSkill()

  const [iconError, setIconError] = useState(false)

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
      name: '',
      category: 'Languages',
      proficiency: 'intermediate',
      icon_identifier: '',
      display_order: 0,
      status: 'draft',
    },
  })

  const currentCategory = watch('category')
  const currentProficiency = watch('proficiency')
  const currentStatus = watch('status')
  const watchIconId = watch('icon_identifier')

  useEffect(() => {
    setIconError(false)
  }, [watchIconId])

  useEffect(() => {
    if (isEditing && skill) {
      reset({
        name: skill.name,
        category: skill.category,
        proficiency: (skill.proficiency as 'beginner' | 'intermediate' | 'advanced' | 'expert') || 'intermediate',
        icon_identifier: skill.icon_identifier || '',
        display_order: skill.display_order || 0,
        status: (skill.status as 'draft' | 'published') || 'draft',
      })
    }
  }, [skill, isEditing, reset])

  const onSubmit = async (data: FormValues) => {
    try {
      await saveSkill(isEditing ? { id, ...data } : data)

      toast({
        title: 'Success',
        description: `Skill ${isEditing ? 'updated' : 'added'} successfully.`,
      })
      navigate('/admin/skills')
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error saving skill',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    }
  }

  if (isEditing && isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading skill...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/skills')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold">
            {isEditing ? 'Edit Skill' : 'Add Skill'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Update skill details.' : 'Add a new technical skill.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-elevated space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register('name')} placeholder="e.g. React" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select 
              value={currentCategory} 
              onValueChange={(val) => setValue('category', val, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Proficiency</Label>
            <Select 
              value={currentProficiency || ''} 
              onValueChange={(val: 'beginner' | 'intermediate' | 'advanced' | 'expert') => setValue('proficiency', val, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency" />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCIES.map(prof => (
                  <SelectItem key={prof} value={prof} className="capitalize">{prof}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon_identifier">Devicon Identifier (Slug)</Label>
            <div className="flex gap-4 items-center">
              <Input 
                id="icon_identifier" 
                {...register('icon_identifier')} 
                placeholder="e.g. react, typescript" 
                className="flex-1"
              />
              <div className="w-[40px] h-[40px] border border-border rounded-md flex items-center justify-center bg-surface shrink-0">
                {!watchIconId || iconError ? (
                  <Code2 className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <img 
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${watchIconId}/${watchIconId}-original.svg`} 
                    alt="Preview" 
                    className="w-6 h-6 object-contain"
                    onError={() => setIconError(true)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input id="display_order" type="number" {...register('display_order', { valueAsNumber: true })} />
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

        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/skills')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || (!isDirty && isEditing)}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Save Changes' : 'Add Skill'}
          </Button>
        </div>
      </form>
    </div>
  )
}
