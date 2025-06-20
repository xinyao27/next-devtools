'use client'
import { motion, useScroll, useTransform } from 'motion/react'
import React, { useRef } from 'react'

export function Card({
  content,
  rotate,
  scale,
  translate,
}: {
  content: React.ReactNode
  rotate: any
  scale: any
  translate: any
}) {
  return (
    <motion.div
      className="mx-auto -mt-2 w-full max-w-5xl rounded-[30px]"
      style={{
        rotateX: rotate, // rotate in X-axis
        scale,
      }}
    >
      <motion.div
        className="h-full w-full"
        style={{
          boxShadow:
            '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
          translateY: translate,
        }}
      >
        {content}
      </motion.div>
    </motion.div>
  )
}

export function ContainerScroll({
  content,
  titleComponent,
}: {
  content: React.ReactNode
  titleComponent: React.ReactNode | string
}) {
  const containerRef = useRef<any>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const scaleDimensions = () => {
    return isMobile ? [0.7, 1] : [1.05, 1]
  }

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div
      className="relative flex h-[90vh] items-start justify-center p-20 sm:h-[120vh] sm:items-center"
      ref={containerRef}
    >
      <div
        className="relative h-full w-full"
        style={{ perspective: '1000px' }}
      >
        <Header
          titleComponent={titleComponent}
          translate={translate}
        />
        <Card
          content={content}
          rotate={rotate}
          scale={scale}
          translate={translate}
        />
      </div>
    </div>
  )
}

export function Header({ titleComponent, translate }: any) {
  return (
    <motion.div
      className="div mx-auto max-w-5xl text-center"
      style={{ translateY: translate }}
    >
      {titleComponent}
    </motion.div>
  )
}
