'use client'

import prettyMs from 'pretty-ms'
import { formatBytes } from '@/lib/utils'
import Status from './status'
import { DataTableColumnHeader } from './data-table-column-header'
import type { NetworkMethod, NetworkRequest } from '@next-devtools/shared/types'
import type { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<NetworkRequest>[] = [
  {
    id: 'url',
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const value = row.getValue('url') as string
      return <div className="truncate">{value}</div>
    },
    minSize: 230,
  },
  {
    id: 'method',
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => {
      const value = row.getValue('method') as NetworkMethod
      return <div className="truncate">{value}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    size: 80,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const value = row.getValue('status') as number
      if (!value) return <i className="i-ri-subtract-line opacity-60" />
      return <Status status={value} />
    },
    size: 80,
  },
  {
    id: 'duration',
    accessorKey: 'duration',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
    cell: ({ row }) => {
      if (!row.original.endTime) return <i className="i-ri-subtract-line opacity-60" />
      const value = row.original.endTime - row.original.startTime
      return <div className="truncate">{prettyMs(value)}</div>
    },
    sortingFn: (rowA, rowB) => {
      const rowValueA = rowA.original.endTime - rowA.original.startTime
      const rowValueB = rowB.original.endTime - rowB.original.startTime
      return rowValueA - rowValueB
    },
    size: 100,
  },
  {
    id: 'size',
    accessorKey: 'size',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
    cell: ({ row }) => {
      const value = row.getValue('size') as number
      if (!value) return <i className="i-ri-subtract-line opacity-60" />
      return <div className="truncate">{formatBytes(value)}</div>
    },
    size: 100,
  },
]
