import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useProjects } from '@/hooks/queries/useProjects'
import { useDeleteProject } from '@/hooks/mutations/useDeleteProject'
import { DataTable } from '@/components/admin/tables/DataTable'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { ColumnDef } from '@tanstack/react-table'
import type { Database } from '@/types/database.types'

type ProjectRow = Database['public']['Tables']['projects']['Row']

export function ProjectsList() {
  const navigate = useNavigate()
  const { data: projects = [], isLoading } = useProjects()
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject()
  const { toast } = useToast()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    setDeletingId(id)
    try {
      await deleteProject(id)
      toast({
        title: 'Project Deleted',
        description: 'The project has been removed successfully.',
      })
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Project',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<ProjectRow>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'category',
      header: 'Category',
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
      accessorKey: 'is_featured',
      header: 'Featured',
      cell: ({ row }) => (row.getValue('is_featured') ? 'Yes' : 'No'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const project = row.original
        const isCurrentDeleting = isDeleting && deletingId === project.id

        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/admin/projects/${project.id}`)}
              disabled={isCurrentDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(project.id)}
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
          <h1 className="text-3xl font-display font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')} className="btn-accent shrink-0 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <DataTable columns={columns} data={projects} isLoading={isLoading} />
    </div>
  )
}
