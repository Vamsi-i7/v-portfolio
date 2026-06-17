import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { useAchievements } from '@/hooks/queries/useAchievements'
import { useDeleteAchievement } from '@/hooks/mutations/useDeleteAchievement'
import { DataTable } from '@/components/admin/tables/DataTable'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import type { Database } from '@/types/database.types'

type AchievementRow = Database['public']['Tables']['achievements']['Row']

export function AchievementsList() {
  const navigate = useNavigate()
  const { data: achievements = [], isLoading } = useAchievements()
  const { mutateAsync: deleteAchievement, isPending: isDeleting } = useDeleteAchievement()
  const { toast } = useToast()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return
    setDeletingId(id)
    try {
      await deleteAchievement(id)
      toast({
        title: 'Achievement Deleted',
        description: 'The achievement has been removed successfully.',
      })
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Achievement',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<AchievementRow>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'achievement_type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('achievement_type') as string
        return <span className="capitalize">{type}</span>
      }
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
    },
    {
      accessorKey: 'value',
      header: 'Value',
    },
    {
      accessorKey: 'achieved_at',
      header: 'Date',
      cell: ({ row }) => {
        const val = row.getValue('achieved_at') as string
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
              onClick={() => navigate(`/admin/achievements/${id}/edit`)}
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

  const nowCount = achievements.filter(a => a.achievement_type === 'now' && a.status === 'published').length
  const showWarning = nowCount > 3

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Achievements</h1>
          <p className="text-muted-foreground mt-1">Manage your achievements and "Now" entries.</p>
        </div>
        <Button onClick={() => navigate('/admin/achievements/new')} className="gap-2 shrink-0 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
      </div>

      {showWarning && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-center gap-3 border border-destructive/20">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">You have {nowCount} published "Now" entries. The public site shows a maximum of 3.</p>
        </div>
      )}

      <div className="card-elevated">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading achievements...</div>
        ) : (
          <DataTable columns={columns} data={achievements} />
        )}
      </div>
    </div>
  )
}
