'use client'

import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { rpcClient } from '@/lib/client'

import { Skeleton } from '../ui/skeleton'

interface Testimonial {
  name: string
  src: string
}

export const Testimonials = ({
  autoplay = true,
  testimonials,
}: {
  autoplay?: boolean
  testimonials: Testimonial[]
}) => {
  const [active, setActive] = useState(0)

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }

  const isActive = (index: number) => {
    return index === active
  }

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000)
      return () => clearInterval(interval)
    }
  }, [autoplay])

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10
  }
  return (
    <div className="relative size-40">
      <AnimatePresence>
        {testimonials.map((testimonial, index) => (
          <motion.div
            animate={{
              opacity: isActive(index) ? 1 : 0.7,
              rotate: isActive(index) ? 0 : randomRotateY(),
              scale: isActive(index) ? 1 : 0.95,
              y: isActive(index) ? [0, -80, 0] : 0,
              z: isActive(index) ? 0 : -100,
              zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
            }}
            className="absolute inset-0 origin-bottom"
            exit={{
              opacity: 0,
              rotate: randomRotateY(),
              scale: 0.9,
              z: 100,
            }}
            initial={{
              opacity: 0,
              rotate: randomRotateY(),
              scale: 0.9,
              z: -100,
            }}
            key={testimonial.src}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
          >
            <Image testimonial={testimonial} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

const Image = ({ testimonial }: { testimonial: Testimonial }) => {
  const { data: assetInfo, isLoading } = useQuery({
    queryFn: () => rpcClient.getStaticAssetInfo(testimonial.src),
    queryKey: ['getStaticAssetInfo', testimonial.src],
  })

  return isLoading ? (
    <Skeleton className="size-full rounded-3xl object-cover object-center" />
  ) : (
    <div className="bg-muted flex size-full items-center justify-center rounded-3xl p-6 shadow">
      <img
        alt={testimonial.name}
        className="w-fit object-cover object-center"
        draggable={false}
        src={assetInfo}
      />
    </div>
  )
}
