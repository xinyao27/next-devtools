'use client'

import React from 'react'
import { NextLogo } from '@next-devtools/shared/components'
import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import { AnimatePresence, motion } from 'motion/react'
import { isDev } from '../utils'
import { useLocalStorage } from './use-local-storage'
import { useResizable } from './use-resizable'
import type { MoveValues } from './use-resizable'
import type { FrameStatus } from '@next-devtools/shared/utils'

interface ToolbarProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  frameStatus: FrameStatus
  setFrameStatus: React.Dispatch<React.SetStateAction<FrameStatus>>
}

export default function Toolbar({ iframeRef, frameStatus, setFrameStatus }: ToolbarProps) {
  const [panelActive, setPanelActive] = React.useState(false)
  const [resizing, setResizing] = React.useState(false)
  const panelActiveTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const handleToggle = React.useCallback(() => {
    setFrameStatus((s) => (s === 'hide' ? 'mini' : 'hide'))
  }, [])

  const handlePanelMouseEnter = React.useCallback(() => {
    if (frameStatus !== 'hide') return
    setPanelActive(true)
    if (panelActiveTimeout.current) clearTimeout(panelActiveTimeout.current)
  }, [frameStatus])

  const handlePanelMouseLeave = React.useCallback(() => {
    if (frameStatus !== 'hide') return
    panelActiveTimeout.current = setTimeout(
      () => {
        setPanelActive(false)
      },
      isDev ? 1000 : 3000,
    )
  }, [frameStatus])

  const handleResizeChange = React.useCallback(({ newHeight }: MoveValues) => {
    document.body.style.paddingBottom = `${newHeight}px`
  }, [])

  // Set a default padding bottom so that the iframe doesn't jump when it's resized
  React.useEffect(() => {
    if (frameStatus === 'hide') return
    document.body.style.paddingBottom = '500px'
  }, [frameStatus])

  const { ref, dragStyles, isDragging } = useDrag()
  const { getRootProps, getHandleProps } = useResizable({
    lockHorizontal: true,
    initialHeight: 500,
    initialWidth: '100%',
    onDragStart: (values) => {
      setResizing(true)
      handleResizeChange(values)
    },
    onResize: (values) => {
      setResizing(true)
      handleResizeChange(values)
    },
    onDragEnd: (values) => {
      setResizing(false)
      handleResizeChange(values)
    },
  })

  return (
    <div className="next-devtools-container" id="next-devtools-container">
      <div className="next-devtools-anchor" id="next-devtools-anchor" style={dragStyles}>
        <AnimatePresence>
          {frameStatus === 'hide' && (
            <motion.div
              ref={ref}
              className={`next-devtools-panel ${panelActive ? 'active' : ''}`}
              id="next-devtools-panel"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 20,
                opacity: 0,
              }}
              style={{
                cursor: isDragging ? 'grabbing' : undefined,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              onMouseEnter={handlePanelMouseEnter}
              onMouseLeave={handlePanelMouseLeave}
            >
              <div className="next-devtools-panel-wrapper">
                <button className="next-devtools-toggle-button" title="Toggle Next Devtools" onClick={handleToggle}>
                  <NextLogo
                    fill={frameStatus !== 'hide' ? 'var(--next-devtools-primary-color)' : '#000'}
                    mode="small"
                    style={{ minWidth: 30, width: '80%', height: '80%' }}
                    theme="light"
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {frameStatus !== 'hide' ? (
          <motion.aside
            className="next-devtools-frame"
            id="next-devtools-frame"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
            {...getRootProps()}
          >
            <div {...getHandleProps()} className={`next-devtools-frame-handle ${resizing ? 'resizing' : ''}`} />

            <iframe ref={iframeRef} className="next-devtools-iframe" id="next-devtools-iframe" src={CLIENT_BASE_PATH} />
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

interface Position {
  x: number
}
const NEXT_DEVTOOLS_POSITION = 'NEXT_DEVTOOLS_POSITION'
function useDrag() {
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
