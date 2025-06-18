'use client'

import type { MotionProps } from 'motion/react'

import { motion } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const AnimatedSpan = ({ children, className, delay = 0, ...props }: AnimatedSpanProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className={cn('flex text-sm font-normal tracking-tight', className)}
    initial={{ opacity: 0, y: -5 }}
    transition={{ delay: delay / 1000, duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
)

interface TypingAnimationProps extends MotionProps {
  as?: React.ElementType
  children: string
  className?: string
  delay?: number
  duration?: number
}

export const TypingAnimation = ({
  as: Component = 'span',
  children,
  className,
  delay = 0,
  duration = 60,
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== 'string') {
    throw new TypeError('TypingAnimation: children must be a string. Received:')
  }

  const MotionComponent = motion.create(Component as any, {
    forwardMotionProps: true,
  })

  const [displayedText, setDisplayedText] = React.useState<string>('')
  const [started, setStarted] = React.useState(false)
  const elementRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true)
    }, delay)
    return () => clearTimeout(startTimeout)
  }, [delay])

  React.useEffect(() => {
    if (!started) return

    let i = 0
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.slice(0, Math.max(0, i + 1)))
        i++
      } else {
        clearInterval(typingEffect)
      }
    }, duration)

    return () => {
      clearInterval(typingEffect)
    }
  }, [children, duration, started])

  return (
    <MotionComponent
      className={cn('text-sm font-normal tracking-tight', className)}
      ref={elementRef}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  )
}

interface TerminalProps {
  children: React.ReactNode
  className?: string
}

export const Terminal = ({ children, className }: TerminalProps) => {
  return (
    <div className={cn('bg-background z-0 h-full max-h-[400px] w-full max-w-lg rounded-xl text-left', className)}>
      <pre className="p-4">
        <code className="flex flex-col gap-y-1 overflow-auto">{children}</code>
      </pre>
    </div>
  )
}
