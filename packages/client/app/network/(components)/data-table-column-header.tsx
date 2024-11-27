import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Column } from '@tanstack/react-table'

interface DataTableColumnHeaderProps<TData, TValue> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
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
        <ChevronUp
          size={12}
          className={cn(
            '-mb-0.5 opacity-50',
            column.getIsSorted() === 'asc' ? 'text-accent-foreground opacity-100' : 'text-muted-foreground opacity-50',
          )}
        />
        <ChevronDown
          size={12}
          className={cn(
            '-mt-0.5 opacity-50',
            column.getIsSorted() === 'desc' ? 'text-accent-foreground opacity-100' : 'text-muted-foreground opacity-50',
          )}
        />
      </span>
    </button>
  )
}
