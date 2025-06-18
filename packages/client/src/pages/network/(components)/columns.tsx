'use client'

import type { NetworkMethod, NetworkRequest } from '@next-devtools/shared/types'
import type { ColumnDef } from '@tanstack/react-table'

import { formatDate } from '@next-devtools/shared/utils'
import prettyMs from 'pretty-ms'

import { formatBytes } from '@/lib/utils'

import { DataTableColumnHeader } from './data-table-column-header'
import Status from './status'

export const columns: ColumnDef<NetworkRequest>[] = [
  {
    accessorKey: 'url',
    cell: ({ row }) => {
      const value = row.getValue('url') as string
      return <div className="truncate">{value}</div>
    },
    header: 'URL',
    id: 'url',
    minSize: 230,
  },
  {
    accessorKey: 'method',
    cell: ({ row }) => {
      const value = row.getValue('method') as NetworkMethod
      return <div className="truncate">{value}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    header: 'Method',
    id: 'method',
    size: 80,
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => {
      const value = row.getValue('status') as number
      if (!value) return <i className="i-ri-subtract-line opacity-60" />
      return <Status status={value} />
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
      />
    ),
    id: 'status',
    size: 80,
  },
  {
    accessorKey: 'duration',
    cell: ({ row }) => {
      if (!row.original.endTime) return <i className="i-ri-subtract-line opacity-60" />
      const value = row.original.endTime - row.original.startTime
      return <div className="truncate">{prettyMs(value)}</div>
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Duration"
      />
    ),
    id: 'duration',
    size: 100,
    sortingFn: (rowA, rowB) => {
      const rowValueA = rowA.original.endTime - rowA.original.startTime
      const rowValueB = rowB.original.endTime - rowB.original.startTime
      return rowValueA - rowValueB
    },
  },
  {
    accessorKey: 'size',
    cell: ({ row }) => {
      const value = row.getValue('size') as number
      if (!value) return <i className="i-ri-subtract-line opacity-60" />
      return <div className="truncate">{formatBytes(value)}</div>
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Size"
      />
    ),
    id: 'size',
    size: 100,
  },
  {
    accessorKey: 'startTime',
    cell: ({ row }) => {
      const value = row.getValue('startTime') as number
      if (!value) return <i className="i-ri-subtract-line opacity-60" />
      return <div className="truncate">{formatDate(value, { format: 'HH:mm:ss' })}</div>
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Start Time"
      />
    ),
    id: 'startTime',
    size: 100,
  },
]
