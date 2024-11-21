import { ArrowRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
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
      'group relative col-span-1 flex overflow-hidden rounded',
      // light styles
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      // dark styles
      'transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      className,
    )}
  >
    <Link
      className="relative flex flex-1 flex-col justify-between overflow-hidden"
      href={href}
      target={href.startsWith('http') ? '_blank' : '_self'}
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
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </Link>
  </div>
)

export { BentoCard, BentoGrid }
