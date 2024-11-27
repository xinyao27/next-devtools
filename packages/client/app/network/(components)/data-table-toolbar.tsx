'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import type { Table } from '@tanstack/react-table'

const methods = [
  {
    value: 'GET',
    label: 'GET',
  },
  {
    value: 'POST',
    label: 'POST',
  },
  {
    value: 'PUT',
    label: 'PUT',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
  {
    value: 'PATCH',
    label: 'PATCH',
  },
  {
    value: 'OPTIONS',
    label: 'OPTIONS',
  },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="min-w-[250px] max-w-[400px]"
          placeholder="Search..."
          prefix={<i className="i-ri-search-line text-muted-foreground size-4" />}
          value={(table.getColumn('url')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('url')?.setFilterValue(event.target.value)}
        />
        {table.getColumn('method') && (
          <DataTableFacetedFilter column={table.getColumn('method')} options={methods} title="Method" />
        )}
        {isFiltered ? (
          <Button className="h-8 px-2 lg:px-3" variant="ghost" onClick={() => table.resetColumnFilters()}>
            <i className="i-ri-close-line mr-2 size-4" />
            Reset
          </Button>
        ) : null}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
