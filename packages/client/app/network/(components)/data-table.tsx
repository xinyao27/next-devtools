'use client'

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { DataTableSheetDetails } from './data-table-sheet-details'
import { DataTableToolbar } from './data-table-toolbar'
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

const ROW_HEIGHT = 36
const OVERSCAN = 10

export interface DataTableProps<TData, TValue> {
  className?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isFetching?: boolean
  getTitle?: (data?: TData) => React.ReactNode
  getDetailsContent?: (data?: TData) => React.ReactNode
  headerExtra?: React.ReactNode
}

function DataTable<TData, TValue>({
  className,
  columns,
  data,
  isLoading,
  isFetching,
  getTitle,
  getDetailsContent,
  headerExtra,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableMultiRowSelection: false,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  })
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: OVERSCAN,
  })
  const visibleRows = rowVirtualizer.getVirtualItems()

  const selectedRow = React.useMemo(() => {
    const selectedRowKey = Object.keys(rowSelection)?.[0]
    return table.getCoreRowModel().flatRows.find((row) => row.id === selectedRowKey)
  }, [rowSelection, table])

  const loading = isFetching || isLoading

  return (
    <>
      <DataTableToolbar extra={headerExtra} table={table} />

      <div ref={tableContainerRef} className={cn('relative overflow-auto', className)}>
        <Table className="grid">
          <TableHeader className="bg-background sticky top-0 z-10 grid shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const column = columns.find((c) => c.id === header.id)
                  const defSize = column?.size
                  const width = defSize === undefined ? 'auto' : header.getSize()
                  const flexGrow = defSize === undefined ? 1 : 0

                  return (
                    <TableHead
                      key={header.id}
                      className="relative flex items-center"
                      colSpan={header.colSpan}
                      style={{
                        width,
                        flexGrow,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className="relative grid"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {visibleRows?.length
              ? visibleRows.map((virtualRow) => {
                  const row = rows[virtualRow.index] as Row<TData>
                  return (
                    <TableRow
                      key={row.id}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      className={cn('absolute flex w-full cursor-default', virtualRow.index % 2 && 'bg-muted')}
                      data-index={virtualRow.index}
                      data-state={row.getIsSelected() && 'selected'}
                      style={{
                        height: ROW_HEIGHT,
                        transform: `translateY(${virtualRow.start}px)`, // this should always be a `style` as it changes on scroll
                      }}
                      onClick={() => {
                        React.startTransition(() => {
                          row.toggleSelected()
                        })
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const column = columns.find((c) => c.id === cell.column.id)
                        const defSize = column?.size
                        const width = defSize === undefined ? 'auto' : cell.column.getSize()
                        const flexGrow = defSize === undefined ? 1 : 0

                        return (
                          <TableCell
                            key={cell.id}
                            className="flex"
                            style={{
                              width,
                              flexGrow,
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              : null}
          </TableBody>
        </Table>

        {loading ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/5">
            <i className="i-ri-loader-2-line size-6 animate-spin" />
          </div>
        ) : null}
      </div>

      <DataTableSheetDetails table={table} title={getTitle?.(selectedRow?.original)}>
        {getDetailsContent?.(selectedRow?.original)}
      </DataTableSheetDetails>
    </>
  )
}
export default React.memo(DataTable) as typeof DataTable
