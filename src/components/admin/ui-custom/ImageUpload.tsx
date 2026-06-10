import { useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { getPublicUrl } from '@/lib/storage'

interface ImageUploadProps {
  bucket: string
  value?: string | null
  onChange: (path: string) => void
  onRemove?: () => void
  disabled?: boolean
}

export function ImageUpload({
  bucket,
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Convert to WebP using Canvas
      const webpFile = await convertToWebP(file)
      
      const fileName = `${crypto.randomUUID()}.webp`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, webpFile, {
          contentType: 'image/webp',
          cacheControl: '3600',
        })

      if (uploadError) {
        throw uploadError
      }

      // Return the relative path instead of full URL
      onChange(filePath)
    } catch (err: unknown) {
      console.error('Error uploading image:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas context failed'))
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('WebP conversion failed'))
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                type: 'image/webp',
              })
              resolve(newFile)
            },
            'image/webp',
            0.8 // 80% quality
          )
        }
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = event.target?.result as string
      }
      reader.onerror = () => reject(new Error('File read failed'))
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video max-w-sm overflow-hidden rounded-md border border-border">
          <img
            src={getPublicUrl(bucket, value)}
            alt="Upload preview"
            className="h-full w-full object-cover"
          />
          {onRemove && !disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 opacity-80 hover:opacity-100"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <label
            className={`flex aspect-video max-w-sm w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface transition-colors hover:bg-surface/80 ${
              disabled || isUploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2 pb-6 pt-5">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-accent">Click to upload</span>
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
