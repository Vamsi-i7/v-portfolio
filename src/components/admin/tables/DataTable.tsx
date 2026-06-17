import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block rounded-md border border-border bg-base overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-col-${colIndex}`}>
                      <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="grid gap-4 md:hidden">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-mobile-${index}`} className="card-elevated p-4 space-y-3 animate-pulse border border-border bg-base rounded-lg">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          ))
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="card-elevated p-4 space-y-3 border border-border bg-base rounded-lg shadow-sm">
              {row.getVisibleCells().map((cell) => {
                const header = cell.column.columnDef.header
                const headerText = typeof header === "string" ? header : ""
                
                if (cell.column.id === "actions") {
                  return (
                    <div key={cell.id} className="flex justify-end gap-2 pt-2 border-t border-border mt-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  )
                }

                return (
                  <div key={cell.id} className="flex justify-between items-start gap-4 py-1">
                    {headerText && (
                      <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider shrink-0 mt-0.5">
                        {headerText}
                      </span>
                    )}
                    <div className="text-sm text-foreground text-right font-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        ) : (
          <div className="card-elevated py-8 text-center text-muted-foreground border border-border bg-base rounded-lg">
            No results found.
          </div>
        )}
      </div>
    </div>
  )
}
