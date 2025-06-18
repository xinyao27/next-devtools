import { cn } from '@/lib/utils'

export interface OrbitingCirclesProps {
  children?: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  path?: boolean
  radius?: number
  reverse?: boolean
}

export function OrbitingCircles({
  children,
  className,
  delay = 10,
  duration = 20,
  radius = 50,
  reverse,
  // path = true,
}: OrbitingCirclesProps) {
  return (
    <>
      {/* {path ? (
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle className="stroke-black/5 stroke-1 dark:stroke-white/5" cx="50%" cy="50%" fill="none" r={radius} />
        </svg>
      ) : null} */}

      <div
        className={cn(
          'animate-orbit absolute flex size-full transform-gpu items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1000ms)] dark:bg-white/10',
          { '[animation-direction:reverse]': reverse },
          className,
        )}
        style={
          {
            '--delay': -delay,
            '--duration': duration,
            '--radius': radius,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
  )
}
