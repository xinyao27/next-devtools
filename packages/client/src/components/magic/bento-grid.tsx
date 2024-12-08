import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const BentoGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('grid w-full auto-rows-[240px] grid-cols-12 gap-4', className)}>{children}</div>
}

export interface BentoCardProps {
  name: string
  className?: string
  background?: ReactNode
  Icon: ReactNode
  description: ReactNode
  href: string
  cta: ReactNode
}

const BentoCard = ({ name, className, background, Icon, description, href, cta }: BentoCardProps) => (
  <div
    className={cn(
      'group relative col-span-1 flex transform-gpu overflow-hidden rounded border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-black',
      className,
    )}
  >
    <Link
      className="relative flex flex-1 flex-col justify-between overflow-hidden"
      target={href.startsWith('http') ? '_blank' : '_self'}
      to={href}
    >
      <div className="relative flex flex-1">{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300">
        <div className="group-hover:text-primary h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-125">
          {Icon}
        </div>
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">{name}</h3>
        <p className="max-w-lg text-neutral-400">{description}</p>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute bottom-0 right-0 flex translate-y-10 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100',
        )}
      >
        {cta}
        <i className="i-ri-arrow-right-line ml-2 size-4" />
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </Link>
  </div>
)

export { BentoCard, BentoGrid }
