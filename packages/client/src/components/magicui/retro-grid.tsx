import { cn } from '@/lib/utils'

export function RetroGrid({ angle = 65, className }: { angle?: number; className?: string }) {
  return (
    <div
      className={cn('perspective-[200px] pointer-events-none absolute size-full overflow-hidden opacity-50', className)}
      style={{ '--grid-angle': `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            'animate-grid',

            'bg-size-[60px_60px] inset-[0%_0px] ml-[-50%] h-[300vh] w-[600vw] origin-[100%_0_0] bg-repeat',

            // Light Styles
            'bg-[linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]',

            // Dark styles
            'dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_0)]',
          )}
        />
      </div>

      {/* Background Gradient */}
      <div className="bg-linear-to-t absolute inset-0 from-white to-transparent to-90% dark:from-black" />
    </div>
  )
}
