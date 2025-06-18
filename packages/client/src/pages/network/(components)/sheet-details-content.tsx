'use client'

import type { NetworkRequest } from '@next-devtools/shared/types'

import { formatDate } from '@next-devtools/shared/utils'
import prettyMs from 'pretty-ms'
import * as React from 'react'

import CodeBlock from '@/components/ui/code-block'
import { cn, formatBytes } from '@/lib/utils'

import Status from './status'

interface Row {
  content: (data: NetworkRequest) => React.ReactNode
  direction?: 'col' | 'row'
  id: string
  label: React.ReactNode
}
const rows: Row[] = [
  {
    content: (data) => data.id || <i className="i-ri-subtract-line opacity-60" />,
    id: 'id',
    label: 'ID',
  },
  {
    content: (data) => data.url,
    id: 'url',
    label: 'URL',
  },
  {
    content: (data) => data.method,
    id: 'method',
    label: 'Method',
  },
  {
    content: (data) =>
      data.status ? <Status status={data.status} /> : <i className="i-ri-subtract-line opacity-60" />,
    id: 'status',
    label: 'Status',
  },
  {
    content: (data) => data.statusText || <i className="i-ri-subtract-line opacity-60" />,
    id: 'statusText',
    label: 'Status Text',
  },
  {
    content: (data) => (data.startTime ? formatDate(data.startTime) : <i className="i-ri-subtract-line opacity-60" />),
    id: 'startTime',
    label: 'Start Time',
  },
  {
    content: (data) => (data.endTime ? formatDate(data.endTime) : <i className="i-ri-subtract-line opacity-60" />),
    id: 'endTime',
    label: 'End Time',
  },
  {
    content: (data) =>
      data.endTime ? prettyMs(data.endTime - data.startTime) : <i className="i-ri-subtract-line opacity-60" />,
    id: 'duration',
    label: 'Duration',
  },
  {
    content: (data) => (data.size > 0 ? formatBytes(data.size) : <i className="i-ri-subtract-line opacity-60" />),
    id: 'size',
    label: 'Size',
  },
  {
    content: (data) =>
      data.headers ? (
        <CodeBlock
          code={JSON.stringify(data.headers, null, 2)}
          language="json"
        />
      ) : (
        <i className="i-ri-subtract-line opacity-60" />
      ),
    direction: 'col',
    id: 'headers',
    label: 'Headers',
  },
  {
    content: (data) =>
      data.body ? (
        <CodeBlock
          code={JSON.stringify(JSON.parse(data.body), null, 2)}
          language="json"
        />
      ) : (
        <i className="i-ri-subtract-line opacity-60" />
      ),
    direction: 'col',
    id: 'body',
    label: 'Body',
  },
]

interface SheetDetailsContentProps extends React.HTMLAttributes<HTMLDListElement> {
  data?: any
}

export function SheetDetailsContent({ data, ...props }: SheetDetailsContentProps) {
  return (
    <dl {...props}>
      {rows.map((row, index) => (
        <div
          className={cn(
            'flex items-center justify-between gap-2 border-b py-2 text-sm',
            row.direction === 'col' && 'flex-col items-start',
            index === rows.length - 1 && 'border-b-0',
          )}
          key={row.id}
        >
          <dt className="text-muted-foreground text-nowrap">{row.label}</dt>

          <dd className={cn('truncate font-mono', row.direction === 'col' && 'w-full')}>
            {data ? row.content(data) : <i className="i-ri-subtract-line opacity-60" />}
          </dd>
        </div>
      ))}
    </dl>
  )
}
