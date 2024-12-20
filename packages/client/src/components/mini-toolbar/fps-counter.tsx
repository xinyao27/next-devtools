'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface FpsCounterProps {
  className?: string
  isHorizontal: boolean
  isVertical: boolean
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
}

export default function FpsCounter({ className, isHorizontal, isVertical, tooltipSide }: FpsCounterProps) {
  const [fps, setFps] = React.useState<number>(0)

  React.useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const calculateFps = () => {
      const currentTime = performance.now()
      frameCount++

      if (currentTime - lastTime > 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(calculateFps)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId)
      } else {
        animationId = requestAnimationFrame(calculateFps)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    animationId = requestAnimationFrame(calculateFps)

    return () => {
      cancelAnimationFrame(animationId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(className, {
            'border-r': isHorizontal,
            'flex-col items-center border-b': isVertical,
          })}
        >
          <i className="i-ri-speed-up-line size-4 opacity-60" />
          <span className={cn('hidden opacity-60', isHorizontal && 'block')} data-label="FPS">
            FPS
          </span>
          <span className="text-nowrap opacity-70">
            <span className="font-medium">{fps}</span>
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>FPS: {fps}</TooltipContent>
    </Tooltip>
  )
}
