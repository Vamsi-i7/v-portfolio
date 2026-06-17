import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useJourneyEntries } from '@/hooks/queries/useJourneyEntries'
import { useDeleteJourneyEntry } from '@/hooks/mutations/useDeleteJourneyEntry'
import { DataTable } from '@/components/admin/tables/DataTable'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import type { Database } from '@/types/database.types'

type JourneyRow = Database['public']['Tables']['journey_entries']['Row']

export function JourneyList() {
  const navigate = useNavigate()
  const { data: entries = [], isLoading } = useJourneyEntries()
  const { mutateAsync: deleteEntry, isPending: isDeleting } = useDeleteJourneyEntry()
  const { toast } = useToast()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this journey entry?')) return
    setDeletingId(id)
    try {
      await deleteEntry(id)
      toast({
        title: 'Entry Deleted',
        description: 'The journey entry has been removed successfully.',
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

  const columns: ColumnDef<JourneyRow>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'entry_type',
      header: 'Type',
    },
    {
      accessorKey: 'entry_date',
      header: 'Date',
      cell: ({ row }) => {
        const val = row.getValue('entry_date') as string
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
              onClick={() => navigate(`/admin/journey/${id}/edit`)}
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
          <h1 className="text-3xl font-display font-bold">Journey</h1>
          <p className="text-muted-foreground mt-1">Manage your timeline milestones.</p>
        </div>
        <Button onClick={() => navigate('/admin/journey/new')} className="gap-2 shrink-0 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      <div className="card-elevated">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading entries...</div>
        ) : (
          <DataTable columns={columns} data={entries} />
        )}
      </div>
    </div>
  )
}
