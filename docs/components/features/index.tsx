import cn from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { type ReactNode } from 'react'
import styles from './styles.module.css'

interface Props {
  large?: boolean
  centered?: boolean
  lightOnly?: boolean
  className?: string
  href?: string
  index: number
  children: ReactNode
}
export function Feature({
  large,
  centered,
  children,
  lightOnly,
  className,
  href,
  index,
  ...props
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: Math.min(0.25 + index * 0.2, 0.8) }}
      viewport={{ once: true, margin: '-20px' }}
      whileInView={{ opacity: 1 }}
      className={cn(
        styles.feature,
        large && styles.large,
        centered && styles.centered,
        lightOnly && styles['light-only'],
        className,
      )}
      {...props}
    >
      {children}
      {href
        ? (
          <Link
            className={styles.link}
            href={href}
            target="_blank"
          >
            <i className="i-ri-arrow-right-s-line h-4 w-4" />
          </Link>
          )
        : null}
    </motion.div>
  )
}

export function Features({ children }: { children: ReactNode }) {
  return <div className={styles.features}>{children}</div>
}
