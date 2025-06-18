import { cn } from '@/lib/utils'

interface MarqueeProps {
  [key: string]: any
  children?: React.ReactNode
  className?: string
  pauseOnHover?: boolean
  repeat?: number
  reverse?: boolean
  vertical?: boolean
}

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  repeat = 4,
  reverse,
  vertical = false,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'gap-(--gap) group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        {
          'flex-col': vertical,
          'flex-row': !vertical,
        },
        className,
      )}
    >
      {Array.from({ length: repeat })
        .fill(0)
        .map((_, i) => (
          <div
            className={cn('gap-(--gap) flex shrink-0 justify-around', {
              '[animation-direction:reverse]': reverse,
              'animate-marquee-vertical flex-col': vertical,
              'animate-marquee flex-row': !vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
            })}
            key={i}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

export function MarqueeItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-50 mask-[linear-gradient(to_top,transparent_10%,#000_100%)] relative flex cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-xl border p-4',
        // light styles
        'bg-gray-950/1 border-gray-950/10 hover:bg-gray-950/5',
        // dark styles
        'dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
