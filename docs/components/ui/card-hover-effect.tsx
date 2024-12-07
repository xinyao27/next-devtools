import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'relative z-50 h-full w-full overflow-hidden rounded-2xl border border-transparent bg-black p-4 group-hover:border-slate-700 dark:border-white/[0.2]',
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h4 className={cn('mt-4 font-bold tracking-wide text-zinc-100', className)}>{children}</h4>
}
export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('mt-2 text-sm leading-relaxed tracking-wide text-zinc-400', className)}>{children}</p>
}

export function HoverEffect({
  items,
  className,
}: {
  items: {
    title: ReactNode
    description: ReactNode
    icon: ReactNode
    link: string
  }[]
  className?: string
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <Link
          key={item?.link}
          className="group relative block h-full w-full p-2"
          href={item?.link}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200/10 dark:bg-slate-800/[0.8]"
                initial={{ opacity: 0 }}
                layoutId="hoverBackground"
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle className="flex flex-col space-y-4">
              {item.icon}
              <span>{item.title}</span>
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  )
}
