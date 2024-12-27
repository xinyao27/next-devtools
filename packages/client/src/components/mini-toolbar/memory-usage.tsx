'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn, formatBytes } from '@/lib/utils'
import { rpcClient } from '@/lib/client'

interface MemoryUsageProps {
  className?: string
  isHorizontal: boolean
  isVertical: boolean
}

const REFRESH_INTERVAL = 2000
const NA = 'N/A'

export default function MemoryUsage({ className, isHorizontal, isVertical }: MemoryUsageProps) {
  const { data: nextServerMemoryBytes } = useQuery({
    queryKey: ['getNextServerMemory'],
    queryFn: () => rpcClient.getNextServerMemory(),
    refetchInterval: REFRESH_INTERVAL,
  })
  const nextServerMemory = React.useMemo(() => {
    if (!nextServerMemoryBytes) return NA
    return formatBytes(nextServerMemoryBytes.heapUsed)
  }, [nextServerMemoryBytes])
  const [support, setSupport] = React.useState<boolean>(false)
  const [browserMemory, setBrowserMemory] = React.useState<string>(NA)

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const updateMemoryUsage = () => {
      if (window.performance && (performance as any).memory) {
        const memoryUsage = (performance as any).memory.usedJSHeapSize
        setBrowserMemory(formatBytes(memoryUsage))
        setSupport(true)
      }
    }

    // 初始更新
    updateMemoryUsage()
    // 每秒更新一次
    intervalId = setInterval(updateMemoryUsage, REFRESH_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  if (!support) return null

  return (
    <button
      title={`Browser Memory: ${browserMemory}\nNext.js Server Memory: ${nextServerMemory}`}
      className={cn(className, {
        'max-w-[230px] border-r': isHorizontal,
        'max-h-[200px] flex-col items-center border-b': isVertical,
      })}
    >
      <i className="i-ri-cpu-line size-4 opacity-60" />
      <span className={cn('hidden opacity-60', isHorizontal && 'block')} data-label="Memory">
        MEM
      </span>
      <div className={cn('truncate opacity-70', isVertical && '[writing-mode:vertical-rl]')}>
        <span className="font-medium">{browserMemory}</span>
        {' / '}
        <span className="font-medium">{nextServerMemory}</span>
      </div>
    </button>
  )
}
