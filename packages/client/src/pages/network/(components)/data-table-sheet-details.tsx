'use client'

import * as React from 'react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/ui/kbd'
import type { Table } from '@tanstack/react-table'

export interface DataTableSheetDetailsProps<TData> {
  table: Table<TData>
  title?: React.ReactNode
  children?: React.ReactNode
}

export function DataTableSheetDetails<TData>({ table, title, children }: DataTableSheetDetailsProps<TData>) {
  const selectedRowKey = Object.keys(table.getState().rowSelection)?.[0] || undefined

  const index = table.getCoreRowModel().flatRows.findIndex((row) => row.id === selectedRowKey)

  const nextId = React.useMemo(() => table.getCoreRowModel().flatRows[index + 1]?.id, [index, table])

  const prevId = React.useMemo(() => table.getCoreRowModel().flatRows[index - 1]?.id, [index, table])

  const onPrev = React.useCallback(() => {
    if (prevId) table.setRowSelection({ [prevId]: true })
  }, [prevId, table])

  const onNext = React.useCallback(() => {
    if (nextId) table.setRowSelection({ [nextId]: true })
  }, [nextId, table])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!selectedRowKey) return

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        onPrev()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        onNext()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [selectedRowKey, onNext, onPrev])

  return (
    <Sheet open={!!selectedRowKey} onOpenChange={() => table.toggleAllRowsSelected(false)}>
      <SheetContent className="overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="bg-background sticky top-0 z-10 border-b p-4">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="truncate text-left font-mono">{title}</SheetTitle>
            <div className="flex h-7 items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-7 w-7" disabled={!prevId} size="icon" variant="ghost" onClick={onPrev}>
                    <i className="i-ri-arrow-up-s-line h-5 w-5" />
                    <span className="sr-only">Previous</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Navigate <Kbd variant="outline">↑</Kbd>
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-7 w-7" disabled={!nextId} size="icon" variant="ghost" onClick={onNext}>
                    <i className="i-ri-arrow-down-s-line h-5 w-5" />
                    <span className="sr-only">Next</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Navigate <Kbd variant="outline">↓</Kbd>
                  </p>
                </TooltipContent>
              </Tooltip>
              <Separator className="mx-1" orientation="vertical" />
              <SheetClose asChild autoFocus={true}>
                <Button className="h-7 w-7" size="icon" variant="ghost">
                  <i className="i-ri-close-line h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <SheetDescription className="sr-only">Selected row details</SheetDescription>
        <div className="p-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
