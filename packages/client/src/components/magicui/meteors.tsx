'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface MeteorsProps {
  number?: number
}
export const Meteors = ({ number = 20 }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const styles = [...Array.from({ length: number })].map(() => ({
      animationDelay: `${Math.random() * 1 + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
      left: `${Math.floor(Math.random() * window.innerWidth)}px`,
      top: -5,
    }))
    setMeteorStyles(styles)
  }, [number])

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          className={cn(
            'animate-meteor rotate-215 pointer-events-none absolute left-1/2 top-1/2 size-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]',
          )}
          key={idx}
          style={style}
        >
          {/* Meteor Tail */}
          <div className="bg-linear-to-r pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  )
}

export default Meteors
