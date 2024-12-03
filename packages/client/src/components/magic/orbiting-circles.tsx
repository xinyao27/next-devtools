import { cn } from '@/lib/utils'

export interface OrbitingCirclesProps {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 10,
  radius = 50,
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
            '--duration': duration,
            '--radius': radius,
            '--delay': -delay,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
  )
}
