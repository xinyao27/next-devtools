import type { Column } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  className,
  column,
  title,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <button
      className={cn('flex items-center gap-1.5 text-sm font-medium', className)}
      onClick={() => {
        column.toggleSorting(undefined)
      }}
      {...props}
    >
      <span>{title}</span>
      <span className="flex flex-col">
        <i
          className={cn(
            'i-ri-arrow-up-s-line -mb-0.5 opacity-50',
            column.getIsSorted() === 'asc' ? 'text-accent-foreground opacity-100' : 'text-muted-foreground opacity-50',
          )}
        />
        <i
          className={cn(
            'i-ri-arrow-down-s-line -mt-0.5 opacity-50',
            column.getIsSorted() === 'desc' ? 'text-accent-foreground opacity-100' : 'text-muted-foreground opacity-50',
          )}
        />
      </span>
    </button>
  )
}
