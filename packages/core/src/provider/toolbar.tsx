'use client'

import React from 'react'
import { NextLogo } from '@next-devtools/shared/components'
import { isDev } from '../utils'
import { useLocalStorage } from './use-local-storage'
import type { CSSProperties } from 'react'

interface ToolbarProps {
  inspectorActive: boolean
  setInspectorActive: React.Dispatch<React.SetStateAction<boolean>>
  iframeRef: React.RefObject<HTMLIFrameElement>
}

export default function Toolbar({ inspectorActive, setInspectorActive, iframeRef }: ToolbarProps) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const [show, setShow] = React.useState(false)
  const [panelActive, setPanelActive] = React.useState(false)
  const panelActiveTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const handleToggle = React.useCallback(() => {
    setShow((s) => !s)
  }, [])
  const handleToggleInspectorActive = React.useCallback(() => {
    if (show === true) setShow(false)
    setInspectorActive((s) => !s)
  }, [show])
  const handlePanelMouseEnter = React.useCallback(() => {
    if (show) return
    setPanelActive(true)
    if (panelActiveTimeout.current) clearTimeout(panelActiveTimeout.current)
  }, [show])
  const handlePanelMouseLeave = React.useCallback(() => {
    if (show) return
    panelActiveTimeout.current = setTimeout(
      () => {
        setPanelActive(false)
      },
      isDev ? 1000 : 3000,
    )
  }, [show])

  const { ref, dragStyles, frameStyles, isDragging } = useDrag({ show, frameRef })

  return (
    <div
      className="next-devtools-container"
      id="next-devtools-container"
      style={{ position: 'fixed', zIndex: 2147483645, width: 0 }}
    >
      <div className="next-devtools-anchor" id="next-devtools-anchor" style={dragStyles}>
        <div
          ref={ref}
          className={`next-devtools-panel ${panelActive ? 'active' : ''}`}
          id="next-devtools-panel"
          style={{
            cursor: isDragging ? 'grabbing' : undefined,
            transform: isDragging ? 'scale(1)' : show ? 'scale(1)' : undefined,
            borderColor: isDragging ? 'var(--next-devtools-primary-light-color)' : undefined,
            borderStyle: isDragging ? 'dashed' : undefined,
          }}
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
        >
          <div className="next-devtools-panel-wrapper">
            <button className="next-devtools-toggle-button" title="Toggle Next Devtools" onClick={handleToggle}>
              <NextLogo
                fill={show ? 'var(--next-devtools-primary-color' : '#000'}
                mode="small"
                style={{ minWidth: 30 }}
                theme="light"
              />
            </button>

            <div className="next-devtools-separator" />

            <button
              className="next-devtools-inspector-button"
              title="Toggle Component Inspector"
              onClick={handleToggleInspectorActive}
            >
              <svg
                className="next-devtools-inspector-icon"
                style={{ fill: inspectorActive ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.8)' }}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13 1L13.001 4.06201C16.6192 4.51365 19.4869 7.38163 19.9381 11L23 11V13L19.938 13.001C19.4864 16.6189 16.6189 19.4864 13.001 19.938L13 23H11L11 19.9381C7.38163 19.4869 4.51365 16.6192 4.06201 13.001L1 13V11L4.06189 11C4.51312 7.38129 7.38129 4.51312 11 4.06189L11 1H13ZM12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={frameRef} className="next-devtools-frame" id="next-devtools-frame" style={frameStyles}>
          <iframe
            ref={iframeRef}
            className="next-devtools-iframe"
            id="next-devtools-iframe"
            src="/__next_devtools__/client"
            style={{ display: show ? 'block' : 'none' }}
          />
        </div>
      </div>
    </div>
  )
}

interface Position {
  x: number
}
const NEXT_DEVTOOLS_POSITION = 'NEXT_DEVTOOLS_POSITION'
function useDrag({ show, frameRef }: { show: boolean; frameRef: React.RefObject<HTMLDivElement> }) {
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

  const frameStyles = React.useMemo(() => {
    const frameMargin = {
      left: panelMargins.current.left,
      top: panelMargins.current.top,
      right: panelMargins.current.right,
      bottom: panelMargins.current.bottom,
    }

    const marginHorizontal = frameMargin.left + frameMargin.right
    const marginVertical = frameMargin.top + frameMargin.bottom

    const maxWidth = windowSize.width - marginHorizontal
    const iframeBoundingClientRect = frameRef.current?.getBoundingClientRect() || { width: 0, height: 0 }

    const style: CSSProperties = {
      position: 'fixed',
      zIndex: -1,
      pointerEvents: isDragging || !show ? 'none' : 'auto',
      width: `min(80vw, calc(100vw - ${marginHorizontal}px))`,
      height: `min(60vh, calc(100vh - ${marginVertical}px))`,
      left: `-${iframeBoundingClientRect.width / 2}px`,
    }

    const width = Math.min(maxWidth, (80 * windowSize.width) / 100)
    const anchorX = dragStyles.left

    style.transform = 'translate(0, 0)'
    if (anchorX - frameMargin.left < width / 2) {
      style.left = `${width / 2 - anchorX + frameMargin.left - iframeBoundingClientRect.width / 2}px`
    } else if (windowSize.width - anchorX - frameMargin.right < width / 2) {
      style.left = `${windowSize.width - anchorX - width / 2 - frameMargin.right - iframeBoundingClientRect.width / 2}px`
    }
    return style
  }, [isDragging, position, windowSize, dragStyles, show, frameRef])

  return {
    ref,
    isDragging,
    dragStyles,
    frameStyles,
  }
}

const SNAP_THRESHOLD = 2
function snapToPoints(value: number) {
  if (value < 5) return 0
  if (value > 95) return 100
  if (Math.abs(value - 50) < SNAP_THRESHOLD) return 50
  return value
}
