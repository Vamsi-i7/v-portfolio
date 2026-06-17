import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useExperiences } from '@/hooks/queries/useExperiences'
import { useDeleteExperience } from '@/hooks/mutations/useDeleteExperience'
import { DataTable } from '@/components/admin/tables/DataTable'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { ColumnDef } from '@tanstack/react-table'
import type { Database } from '@/types/database.types'

type ExperienceRow = Database['public']['Tables']['experience']['Row']

export function ExperienceList() {
  const navigate = useNavigate()
  const { data: experiences = [], isLoading } = useExperiences()
  const { mutateAsync: deleteExperience, isPending: isDeleting } = useDeleteExperience()
  const { toast } = useToast()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) return
    setDeletingId(id)
    try {
      await deleteExperience(id)
      toast({
        title: 'Entry Deleted',
        description: 'The experience entry has been removed successfully.',
      })
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Entry',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<ExperienceRow>[] = [
    {
      accessorKey: 'role_title',
      header: 'Role',
    },
    {
      accessorKey: 'company_name',
      header: 'Company',
    },
    {
      id: 'dates',
      header: 'Dates',
      cell: ({ row }) => {
        const start = row.getValue('start_date') as string
        const isCurrent = row.original.is_current
        const end = row.original.end_date
        return `${start ? start.substring(0, 7) : ''} - ${isCurrent ? 'Present' : (end ? end.substring(0, 7) : '')}`
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const exp = row.original
        const isCurrentDeleting = isDeleting && deletingId === exp.id

        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/admin/experience/${exp.id}`)}
              disabled={isCurrentDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(exp.id)}
              disabled={isCurrentDeleting}
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
          <h1 className="text-3xl font-display font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground mt-1">
            Manage your work history and roles.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/experience/new')} className="btn-accent shrink-0 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <DataTable columns={columns} data={experiences} isLoading={isLoading} />
    </div>
  )
}
