'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { useRPCClient } from '@/lib/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const TerminalView = dynamic(() => import('./(components)/terminal-view'), { ssr: false })

export default function Page() {
  const rpcClient = useRPCClient()
  const { data, mutate, isLoading } = useSWR('getTerminals', () => rpcClient.current?.getTerminals.query())
  const [currentId, setCurrentId] = useState<string>()
  useEffect(() => {
    if (data && data.length > 0 && !currentId) {
      setCurrentId(data[0].id)
    } else if (data?.length === 1 && currentId !== data[0].id) {
      setCurrentId(data[0].id)
    }
  }, [data, currentId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <i className="i-ri-loader-2-line animate-spin text-2xl" />
      </div>
    )
  }
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <em className="opacity-50">No terminal attached</em>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden grid grid-rows-[max-content_1fr_max-content]">
      <div className="flex items-center border-b">
        {data?.map((terminal) => (
          <button
            className={cn('border-r flex gap-2 items-center bg-secondary px-3 py-2 transition-colors', {
              'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white': terminal.id === currentId,
            })}
            onClick={() => {
              setCurrentId(terminal.id)
            }}
          >
            <i className={terminal.icon} />
            {terminal.name}

            <Button
              className="scale-90"
              size="icon"
              variant="ghost"
              onClick={() => {
                rpcClient.current?.runTerminalAction.mutate({ id: terminal.id, action: 'terminate' })
                mutate()
              }}
            >
              <i className="i-ri-close-line text-lg" />
            </Button>
          </button>
        ))}
      </div>

      <TerminalView id={currentId} />
    </div>
  )
}
