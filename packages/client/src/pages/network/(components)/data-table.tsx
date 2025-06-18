'use client'

import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

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

const ROW_HEIGHT = 36
const OVERSCAN = 10

export interface DataTableProps<TData, TValue> {
  className?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  getDetailsContent?: (data?: TData) => React.ReactNode
  getRowId?: (row: TData) => string
  getTitle?: (data?: TData) => React.ReactNode
  headerExtra?: React.ReactNode
  isFetching?: boolean
  isLoading?: boolean
}

function DataTable<TData, TValue>({
  className,
  columns,
  data,
  getDetailsContent,
  getRowId,
  getTitle,
  headerExtra,
  isFetching,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    columns,
    data,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
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
      <DataTableToolbar
        extra={headerExtra}
        table={table}
      />

      <div
        className={cn('relative overflow-auto', className)}
        ref={tableContainerRef}
      >
        <Table className="grid">
          <TableHeader className="bg-background sticky top-0 z-10 grid shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="flex w-full hover:bg-transparent"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  const column = columns.find((c) => c.id === header.id)
                  const defSize = column?.size
                  const width = defSize === undefined ? 'auto' : header.getSize()
                  const flexGrow = defSize === undefined ? 1 : 0

                  return (
                    <TableHead
                      className="relative flex items-center"
                      colSpan={header.colSpan}
                      key={header.id}
                      style={{
                        flexGrow,
                        width,
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
                      className={cn('absolute flex w-full cursor-default', virtualRow.index % 2 && 'bg-muted')}
                      data-index={virtualRow.index}
                      data-state={row.getIsSelected() && 'selected'}
                      key={row.id}
                      onClick={() => {
                        React.startTransition(() => {
                          row.toggleSelected()
                        })
                      }}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      style={{
                        height: ROW_HEIGHT,
                        transform: `translateY(${virtualRow.start}px)`, // this should always be a `style` as it changes on scroll
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const column = columns.find((c) => c.id === cell.column.id)
                        const defSize = column?.size
                        const width = defSize === undefined ? 'auto' : cell.column.getSize()
                        const flexGrow = defSize === undefined ? 1 : 0

                        return (
                          <TableCell
                            className="flex"
                            key={cell.id}
                            style={{
                              flexGrow,
                              width,
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

      <DataTableSheetDetails
        rowSelection={rowSelection}
        table={table}
        title={getTitle?.(selectedRow?.original)}
      >
        {getDetailsContent?.(selectedRow?.original)}
      </DataTableSheetDetails>
    </>
  )
}
export default React.memo(DataTable) as typeof DataTable
