'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FpsCounterProps {
  className?: string
  isHorizontal: boolean
  isVertical: boolean
}

export default function FpsCounter({ className, isHorizontal, isVertical }: FpsCounterProps) {
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
    <button
      title={`FPS: ${fps}`}
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
  )
}
