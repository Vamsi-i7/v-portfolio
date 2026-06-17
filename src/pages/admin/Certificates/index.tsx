import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { useCertificates } from '@/hooks/queries/useCertificates'
import { useDeleteCertificate } from '@/hooks/mutations/useDeleteCertificate'
import { DataTable } from '@/components/admin/tables/DataTable'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import type { Database } from '@/types/database.types'

type CertificateRow = Database['public']['Tables']['certificates']['Row']

export function CertificatesList() {
  const navigate = useNavigate()
  const { data: certificates = [], isLoading } = useCertificates(true)
  const { mutateAsync: deleteCertificate, isPending: isDeleting } = useDeleteCertificate()
  const { toast } = useToast()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return
    setDeletingId(id)
    try {
      await deleteCertificate(id)
      toast({
        title: 'Certificate Deleted',
        description: 'The certificate has been removed successfully.',
      })
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Certificate',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<CertificateRow>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
          <span>{row.original.title}</span>
        </div>
      )
    },
    {
      accessorKey: 'issuer_name',
      header: 'Issuer',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'issued_at',
      header: 'Issue Date',
      cell: ({ row }) => {
        const val = row.getValue('issued_at') as string
        return val ? new Date(val).toLocaleDateString() : 'N/A'
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge variant={status === 'published' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/admin/certificates/${id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(id)}
              disabled={deletingId === id || isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Certificates</h1>
          <p className="text-muted-foreground mt-1">Manage your professional certificates and credentials.</p>
        </div>
        <Button onClick={() => navigate('/admin/certificates/new')} className="gap-2 shrink-0 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      <div className="card-elevated">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading certificates...</div>
        ) : (
          <DataTable columns={columns} data={certificates} />
        )}
      </div>
    </div>
  )
}
