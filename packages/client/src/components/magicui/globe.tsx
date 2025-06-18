'use client'

import type { COBEOptions } from 'cobe'

import createGlobe from 'cobe'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const GLOBE_CONFIG: COBEOptions = {
  baseColor: [1, 1, 1],
  dark: typeof window !== 'undefined' && localStorage.theme === 'light' ? 0 : 1,
  devicePixelRatio: 2,
  diffuse: 0.4,
  glowColor: [1, 1, 1],
  height: 800,
  mapBrightness: 1.2,
  mapSamples: 16000,
  markerColor: [255 / 255, 199 / 255, 153 / 255], // #ffc799
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
  onRender: () => {},
  phi: 0,
  theta: 0.3,
  width: 800,
}

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string; config?: COBEOptions }) {
  let phi = 0
  let width = 0
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)
  const { theme } = useTheme()

  const updatePointerInteraction = (value: any) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? 'grabbing' : 'grab'
    }
  }

  const updateMovement = (clientX: any) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) phi += 0.005
      state.phi = phi + r
      state.width = width * 2
      state.height = width * 2
    },
    [r],
  )

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }
  }

  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()

    if (canvasRef.current) {
      const globe = createGlobe(canvasRef.current!, {
        ...config,
        dark: theme === 'light' ? 0 : 1,
        glowColor: theme === 'light' ? [1, 1, 1] : [0.2, 0.2, 0.2],
        height: width * 2,
        onRender,
        width: width * 2,
      })

      setTimeout(() => (canvasRef.current!.style.opacity = '1'))
      return () => globe.destroy()
    }
    return () => {}
  }, [theme])

  return (
    <div className={cn('absolute inset-0 mx-auto aspect-square w-full max-w-[600px]', className)}>
      <canvas
        className={cn('contain-[layout_paint_size] size-full opacity-0 transition-opacity duration-500')}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onPointerDown={(e) => updatePointerInteraction(e.clientX - pointerInteractionMovement.current)}
        onPointerOut={() => updatePointerInteraction(null)}
        onPointerUp={() => updatePointerInteraction(null)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
        ref={canvasRef}
      />
    </div>
  )
}
