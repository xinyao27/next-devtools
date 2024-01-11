import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function HoverEffect({
  items,
  className,
}: {
  items: {
    title?: ReactNode
    description?: ReactNode
    link: string
    target?: string
  }[]
  className?: string
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-4  lg:grid-cols-4  py-10', className)}>
      {items.map((item, idx) => (
        <Link
          key={item?.link}
          className="relative block w-full h-full p-2 group"
          href={item?.link}
          target={item?.target}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200/20 dark:bg-neutral-800/80 block  rounded-3xl"
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

          <div
            className={cn(
              'rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-black border dark:border-white/20 group-hover:border-neutral-500 relative z-50 text-center',
              className,
            )}
          >
            <div className="relative z-50">
              <div className="p-4 space-y-4 flex flex-col items-center justify-center">
                <h4 className={cn('dark:text-neutral-100 font-bold tracking-wide mt-4', className)}>{item.title}</h4>
                <p className={cn('mt-2 dark:text-neutral-400 tracking-wide leading-relaxed text-sm', className)}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
