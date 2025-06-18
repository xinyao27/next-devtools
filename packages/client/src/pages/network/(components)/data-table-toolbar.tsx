'use client'

import type { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

const methods = [
  {
    label: 'GET',
    value: 'GET',
  },
  {
    label: 'POST',
    value: 'POST',
  },
  {
    label: 'PUT',
    value: 'PUT',
  },
  {
    label: 'DELETE',
    value: 'DELETE',
  },
  {
    label: 'PATCH',
    value: 'PATCH',
  },
  {
    label: 'OPTIONS',
    value: 'OPTIONS',
  },
]

interface DataTableToolbarProps<TData> {
  extra?: React.ReactNode
  table: Table<TData>
}

export function DataTableToolbar<TData>({ extra, table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="min-w-[250px] max-w-[400px]"
          onChange={(event) => table.getColumn('url')?.setFilterValue(event.target.value)}
          placeholder="Search..."
          prefix={<i className="i-ri-search-line text-muted-foreground size-4" />}
          value={(table.getColumn('url')?.getFilterValue() as string) ?? ''}
        />
        {table.getColumn('method') && (
          <DataTableFacetedFilter
            column={table.getColumn('method')}
            options={methods}
            title="Method"
          />
        )}
        <DataTableViewOptions table={table} />
        {isFiltered ? (
          <Button
            onClick={() => table.resetColumnFilters()}
            size="sm"
            variant="outline"
          >
            <i className="i-ri-close-line mr-1 size-4" />
            Reset
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {table.getCoreRowModel().rows.length > 0 ? (
          <div className="text-xs opacity-60">
            {table.getFilteredRowModel().rows.length} / {table.getCoreRowModel().rows.length} requests
          </div>
        ) : null}

        {extra}
      </div>
    </div>
  )
}
