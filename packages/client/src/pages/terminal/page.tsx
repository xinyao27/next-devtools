'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { getQueryClient, rpcClient } from '@/lib/client'
import { cn } from '@/lib/utils'
import { useTerminalStore } from '@/store/terminal'

import TerminalView from './(components)/terminal-view'

const setCurrentId = (id: string) => useTerminalStore.setState({ currentId: id })

const runTerminalAction = rpcClient.runTerminalAction
export default function Page() {
  const { data, isLoading } = useQuery({
    queryFn: () => rpcClient.getTerminals(),
    queryKey: ['getTerminals'],
  })
  const currentId = useTerminalStore((state) => state.currentId)

  const handleRunTerminalAction = (id: string, action: 'terminate') => {
    runTerminalAction(id, action)
    const queryClient = getQueryClient()
    queryClient.invalidateQueries({ queryKey: ['getTerminals'] })
  }

  useEffect(() => {
    if (data) {
      useTerminalStore.setState({ terminals: data || [] })
    }
  }, [data])
  useEffect(() => {
    if (data && data.length > 0 && !currentId) {
      setCurrentId(data[0].id)
    } else if (data?.length === 1 && currentId !== data[0].id) {
      setCurrentId(data[0].id)
    }
  }, [data, currentId])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <i className="i-ri-loader-2-line animate-spin text-2xl" />
      </div>
    )
  }
  if (!data?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <em className="opacity-50">No terminal attached</em>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-rows-[max-content_1fr_max-content] overflow-hidden">
      <div className="flex items-center border-b">
        {data?.map((terminal) => (
          <div
            className={cn('bg-secondary flex items-center gap-2 border-r px-3 py-1 transition-colors', {
              'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white': terminal.id === currentId,
            })}
            key={terminal.id}
            onClick={() => {
              setCurrentId(terminal.id)
            }}
            role="button"
          >
            <i className={terminal.icon} />
            {terminal.name}

            <Button
              className="scale-90"
              onClick={() => {
                handleRunTerminalAction(terminal.id, 'terminate')
              }}
              size="icon"
              variant="ghost"
            >
              <i className="i-ri-close-line text-lg" />
            </Button>
          </div>
        ))}
      </div>

      <TerminalView id={currentId} />
    </div>
  )
}
