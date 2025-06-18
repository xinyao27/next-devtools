import type { ReactNode } from 'react'

import cn from 'clsx'
import { motion } from 'motion/react'
import Link from 'next/link'

import styles from './styles.module.css'

interface Props {
  centered?: boolean
  children: ReactNode
  className?: string
  href?: string
  index: number
  large?: boolean
  lightOnly?: boolean
}
export function Feature({ centered, children, className, href, index, large, lightOnly, ...props }: Props) {
  return (
    <motion.div
      className={cn(
        styles.feature,
        large && styles.large,
        centered && styles.centered,
        lightOnly && styles['light-only'],
        className,
      )}
      initial={{ opacity: 0 }}
      transition={{ duration: Math.min(0.25 + index * 0.2, 0.8) }}
      viewport={{ margin: '-20px', once: true }}
      whileInView={{ opacity: 1 }}
      {...props}
    >
      {children}
      {href ? (
        <Link
          className={styles.link}
          href={href}
          target="_blank"
        >
          <i className="i-ri-arrow-right-s-line size-4" />
        </Link>
      ) : null}
    </motion.div>
  )
}

export function Features({ children }: { children: ReactNode }) {
  return <div className={styles.features}>{children}</div>
}
