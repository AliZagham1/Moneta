"use client"
import * as React from "react"
import { Trash } from "lucide-react"

import {
  ColumnDef,
  Row,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,

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
import { useConfirm } from "@/hooks/use-confirm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterkey : string
  onDelete:(rows: Row<TData>[]) => void
  disabled?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterkey,
  onDelete,
  disabled
}: DataTableProps<TData, TValue>) {
  const [Confirmed, confirm] = useConfirm("Delete", "Are you sure you want to delete this row?")
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )
      const[rowSelection, setRowSelection] = React.useState({})
     
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    
    state: {
      sorting,
      columnFilters,
      rowSelection,
    }
  })

return (
 <div>
  <Confirmed/>
    <div className="flex items-center py-4">
    {table.getColumn(filterkey) && (
        <Input
          placeholder={`Filter ${filterkey}...`}
          value={(table.getColumn(filterkey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterkey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        )}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button 
            disabled = {disabled}
            size = "sm"
            variant = "outline"
            className = "ml-auto font-normal text-xs"
           onClick={async() => {
            const ok = await confirm();
            if (ok) {
             onDelete(table.getFilteredSelectedRowModel().rows)
             table.resetRowSelection();
            }

           }}
            >
                <Trash className = "size-4 mr-2"/>
                Delete {(table.getFilteredSelectedRowModel().rows.length )}
            </Button>
            
        )}
      </div>
   
    <div className="rounded-md border">
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
          {table.getRowModel().rows?.length ? (
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="rounded-md border">
        <Table>
         
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
       <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
       </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
 </div>
  )
}
