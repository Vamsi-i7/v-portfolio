/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { useCertificate } from '@/hooks/queries/useCertificate'
import { useMutateCertificate } from '@/hooks/mutations/useMutateCertificate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ImageUpload } from '@/components/admin/ui-custom/ImageUpload'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer_name: z.string().min(1, 'Issuer Name is required'),
  issuer_logo_path: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  certificate_image_path: z.string().optional().nullable(),
  verification_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  credential_id: z.string().optional().nullable(),
  issued_at: z.string().min(1, 'Issue Date is required'),
  expires_at: z.string().optional().nullable(),
  has_expiry: z.boolean(),
  is_featured: z.boolean(),
  status: z.enum(['draft', 'published']),
})

type FormValues = z.infer<typeof formSchema>

const CATEGORIES = [
  'Cloud',
  'Frontend',
  'Backend',
  'DevOps',
  'Data',
  'AI/ML',
  'Other',
]

export function CertificateForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isEditing = !!id
  const { data: certificate, isLoading } = useCertificate(id)
  const { mutateAsync: saveCertificate, isPending: isSaving } = useMutateCertificate()

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
      issuer_name: '',
      issuer_logo_path: '',
      category: '',
      certificate_image_path: '',
      verification_url: '',
      credential_id: '',
      issued_at: '',
      expires_at: '',
      has_expiry: false,
      is_featured: false,
      status: 'draft',
    },
  })

  const currentCategory = watch('category')
  const currentStatus = watch('status')
  const hasExpiry = watch('has_expiry')

  useEffect(() => {
    if (isEditing && certificate) {
      reset({
        title: certificate.title,
        issuer_name: certificate.issuer_name,
        issuer_logo_path: certificate.issuer_logo_path || '',
        category: certificate.category || '',
        certificate_image_path: certificate.certificate_image_path || '',
        verification_url: certificate.verification_url || '',
        credential_id: certificate.credential_id || '',
        issued_at: certificate.issued_at ? certificate.issued_at.split('T')[0] : '',
        expires_at: certificate.expires_at ? certificate.expires_at.split('T')[0] : '',
        has_expiry: certificate.has_expiry || false,
        is_featured: certificate.is_featured || false,
        status: (certificate.status as 'draft' | 'published') || 'draft',
      })
    }
  }, [certificate, isEditing, reset])

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        expires_at: data.has_expiry && data.expires_at ? data.expires_at : null,
        category: data.category || null,
        issuer_logo_path: data.issuer_logo_path || null,
        certificate_image_path: data.certificate_image_path || null,
        verification_url: data.verification_url || null,
        credential_id: data.credential_id || null,
      }

      await saveCertificate(isEditing ? { id, ...payload } : payload)

      toast({
        title: 'Success',
        description: `Certificate ${isEditing ? 'updated' : 'added'} successfully.`,
      })
      navigate('/admin/certificates')
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error saving certificate',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    }
  }

  if (isEditing && isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading certificate...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/certificates')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold">
            {isEditing ? 'Edit Certificate' : 'Add Certificate'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Update certificate details.' : 'Add a new certificate or credential.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-elevated space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Issuer Logo</Label>
            <ImageUpload
              bucket="portfolio-assets"
              value={watch('issuer_logo_path') || null}
              onChange={(path: string) => setValue('issuer_logo_path', path, { shouldDirty: true })}
              onRemove={() => setValue('issuer_logo_path', null, { shouldDirty: true })}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Certificate Image (Optional)</Label>
            <ImageUpload
              bucket="portfolio-assets"
              value={watch('certificate_image_path') || null}
              onChange={(path: string) => setValue('certificate_image_path', path, { shouldDirty: true })}
              onRemove={() => setValue('certificate_image_path', null, { shouldDirty: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} placeholder="e.g. AWS Certified Solutions Architect" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer_name">Issuer Name *</Label>
            <Input id="issuer_name" {...register('issuer_name')} placeholder="e.g. Amazon Web Services" />
            {errors.issuer_name && <p className="text-sm text-destructive">{errors.issuer_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={currentCategory || undefined} 
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
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="issued_at">Issue Date *</Label>
            <Input id="issued_at" type="date" {...register('issued_at')} />
            {errors.issued_at && <p className="text-sm text-destructive">{errors.issued_at.message}</p>}
          </div>

          <div className="space-y-4 flex flex-col justify-end pb-2">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="has_expiry" 
                className="w-4 h-4"
                {...register('has_expiry')} 
              />
              <Label htmlFor="has_expiry" className="mb-0">This credential expires</Label>
            </div>
          </div>

          {hasExpiry && (
            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date</Label>
              <Input id="expires_at" type="date" {...register('expires_at')} />
              {errors.expires_at && <p className="text-sm text-destructive">{errors.expires_at.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="credential_id">Credential ID</Label>
            <Input id="credential_id" {...register('credential_id')} placeholder="e.g. AWS-12345" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="verification_url">Verification URL</Label>
            <Input id="verification_url" type="url" {...register('verification_url')} placeholder="https://..." />
            {errors.verification_url && <p className="text-sm text-destructive">{errors.verification_url.message}</p>}
          </div>
          
          <div className="space-y-2 flex items-center gap-2 mt-4 md:col-span-2">
            <input 
              type="checkbox" 
              id="is_featured" 
              className="w-4 h-4"
              {...register('is_featured')} 
            />
            <Label htmlFor="is_featured" className="mb-0">Feature this certificate</Label>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/certificates')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || (!isDirty && isEditing)}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Save Changes' : 'Add Certificate'}
          </Button>
        </div>
      </form>
    </div>
  )
}
