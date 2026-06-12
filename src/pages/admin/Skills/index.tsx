import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Code2 } from 'lucide-react'
import { useSkills } from '@/hooks/queries/useSkills'
import { useDeleteSkill } from '@/hooks/mutations/useDeleteSkill'
import { DataTable } from '@/components/admin/tables/DataTable'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import type { Database } from '@/types/database.types'

type SkillRow = Database['public']['Tables']['skills']['Row']

function DeviconPreview({ identifier }: { identifier: string | null }) {
  const [error, setError] = useState(false)

  if (!identifier) return <Code2 className="w-6 h-6 text-muted-foreground" />

  if (error) {
    return <Code2 className="w-6 h-6 text-muted-foreground" />
  }

  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${identifier}/${identifier}-original.svg`}
      alt={`${identifier} icon`}
      className="w-6 h-6 object-contain"
      onError={() => setError(true)}
    />
  )
}

export function SkillsList() {
  const navigate = useNavigate()
  const { data: skills = [], isLoading } = useSkills()
  const { mutateAsync: deleteSkill, isPending: isDeleting } = useDeleteSkill()
  const { toast } = useToast()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return
    setDeletingId(id)
    try {
      await deleteSkill(id)
      toast({
        title: 'Skill Deleted',
        description: 'The skill has been removed successfully.',
      })
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Skill',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<SkillRow>[] = [
    {
      id: 'icon',
      header: 'Icon',
      cell: ({ row }) => <DeviconPreview identifier={row.original.icon_identifier} />
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'proficiency',
      header: 'Proficiency',
      cell: ({ row }) => {
        const prof = row.getValue('proficiency') as string
        if (!prof) return 'N/A'
        return <span className="capitalize">{prof}</span>
      }
    },
    {
      accessorKey: 'display_order',
      header: 'Order',
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
              onClick={() => navigate(`/admin/skills/${id}/edit`)}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Skills</h1>
          <p className="text-muted-foreground mt-1">Manage your technical skills and proficiencies.</p>
        </div>
        <Button onClick={() => navigate('/admin/skills/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="card-elevated">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading skills...</div>
        ) : (
          <DataTable columns={columns} data={skills} />
        )}
      </div>
    </div>
  )
}
