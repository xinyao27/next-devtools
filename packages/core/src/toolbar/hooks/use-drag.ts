import React from 'react'
import { useLocalStorage } from './use-local-storage'

interface Position {
  x: number
}
const NEXT_DEVTOOLS_POSITION = 'NEXT_DEVTOOLS_POSITION'

export function useDrag() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const panelMargins = React.useRef({ left: 10, top: 10, right: 10, bottom: 10 })
  const [windowSize, setWindowSize] = React.useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [draggingOffset, setDraggingOffset] = React.useState<Position | null>(null)
  const [position, setPosition] = useLocalStorage<Position | null>(NEXT_DEVTOOLS_POSITION, null)
  const isMouseDownOnToolbar = React.useRef(false)

  const dragStyles = React.useMemo(() => {
    function clamp(value: number, min: number, max: number) {
      return Math.min(Math.max(value, min), max)
    }
    const halfWidth = (ref.current?.clientWidth || 0) / 2
    const left = ((position?.x || 0) * windowSize.width) / 100
    return {
      left: clamp(
        left,
        halfWidth + panelMargins.current.left,
        windowSize.width - halfWidth - panelMargins.current.right,
      ),
    }
  }, [position, windowSize])

  const onMouseDown = React.useCallback((event: PointerEvent) => {
    if (ref.current && ref.current.contains(event.target as Node)) {
      isMouseDownOnToolbar.current = true
      const { left, width } = ref.current.getBoundingClientRect()
      setDraggingOffset({ x: event.clientX - left - width / 2 })
      setIsDragging(true)

      document.body.style.userSelect = 'none'
    }
  }, [])
  const onMouseMove = React.useCallback(
    (event: PointerEvent) => {
      if (!isMouseDownOnToolbar.current || event.buttons !== 1) return

      if (isDragging && ref.current) {
        const x = event.clientX - (draggingOffset?.x || 0)
        if (x > windowSize.width - ref.current.clientWidth / 2 - panelMargins.current.right) return
        if (x < panelMargins.current.left + ref.current.clientWidth / 2) return

        setPosition({
          x: snapToPoints((x / windowSize.width) * 100),
        })
      }
    },
    [isDragging, draggingOffset],
  )
  const onMouseUp = React.useCallback(() => {
    if (!position) return

    if (isDragging) {
      setTimeout(() => {
        setIsDragging(false)
      }, 200 + 16)
    }
    isMouseDownOnToolbar.current = false
  }, [isDragging, position])
  const onPointerLeave = React.useCallback(() => {
    isMouseDownOnToolbar.current = false
    setIsDragging(false)
  }, [])

  const onWindowResize = React.useCallback(() => {
    if (!position || !ref.current) return

    const { innerWidth, innerHeight } = window
    setWindowSize({ width: innerWidth, height: innerHeight })
  }, [position])

  React.useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const rafOnMouseMove = (event: PointerEvent) => {
      requestAnimationFrame(() => onMouseMove(event))
    }
    const rafOnMouseUp = () => {
      requestAnimationFrame(onMouseUp)
    }
    const rafOnWindowResize = () => {
      requestAnimationFrame(onWindowResize)
    }
    window.addEventListener('pointermove', rafOnMouseMove)
    window.addEventListener('pointerup', rafOnMouseUp)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', rafOnWindowResize)
    if (ref.current) {
      ref.current.addEventListener('pointerdown', onMouseDown)
    }
    return () => {
      window.removeEventListener('pointermove', rafOnMouseMove)
      window.removeEventListener('pointerup', rafOnMouseUp)
      window.removeEventListener('resize', rafOnWindowResize)
      window.removeEventListener('pointerleave', onPointerLeave)
      if (ref.current) {
        ref.current.removeEventListener('pointerdown', onMouseDown)
      }
    }
  }, [isDragging, position, onMouseMove, onMouseUp, onWindowResize])

  return {
    ref,
    isDragging,
    dragStyles,
  }
}

const SNAP_THRESHOLD = 2
function snapToPoints(value: number) {
  if (value < 5) return 0
  if (value > 95) return 100
  if (Math.abs(value - 50) < SNAP_THRESHOLD) return 50
  return value
}
