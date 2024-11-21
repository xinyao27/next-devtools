'use client'

import React from 'react'
import { NextLogo } from '@next-devtools/shared'
import type { CSSProperties } from 'react'

function Separator() {
  return <div style={{ width: 1, height: 10, borderLeft: '1px solid rgba(136, 136, 136, 0.2)', margin: '0 6px' }} />
}

interface ToolbarProps {
  inspectorActive: boolean
  setInspectorActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Toolbar({ inspectorActive, setInspectorActive }: ToolbarProps) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const [show, setShow] = React.useState(false)
  const handleToggle = React.useCallback(() => {
    setShow((s) => !s)
  }, [])
  const handleToggleInspectorActive = React.useCallback(() => {
    if (show === true) setShow(false)
    setInspectorActive((s) => !s)
  }, [show])

  const { ref, dragStyles, frameStyles } = useDrag({ show, frameRef })

  return (
    <div
      id="next-devtools-container"
      style={{
        position: 'fixed',
        width: 0,
        zIndex: 2147483645,
        // @ts-expect-error noop
        '--next-devtools-widget-bg': '#fafafa',
        '--next-devtools-widget-border': '#efefef',
        '--next-devtools-widget-shadow': 'rgb(0 0 0 / 10%)',
      }}
    >
      <div
        id="next-devtools-anchor"
        style={{
          width: 0,
          zIndex: 2147483645,
          position: 'fixed',
          display: 'flex',
          justifyContent: 'center',
          bottom: 8,
          transform: 'translate(-50%, -50%) rotate(0)',
          transformOrigin: 'center center',
          ...dragStyles,
        }}
      >
        <div
          ref={ref}
          id="next-devtools-panel"
          style={{
            padding: '0 6px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--next-devtools-widget-bg)',
            boxShadow:
              '0 2px 15px -3px var(--next-devtools-widget-shadow), 0 4px 6px -4px var(--next-devtools-widget-shadow)',
            border: '1px solid var(--next-devtools-widget-border)',
            borderRadius: '4px',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          <button
            title="Toggle Next Devtools"
            style={{
              marginLeft: 6,
              marginRight: 6,
              background: 'none',
              cursor: 'pointer',
              borderRadius: '100%',
              borderWidth: 0,
              width: 30,
              height: 30,
              color: '#000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.8,
              transition: 'opacity 0.2s ease-in-out',
            }}
            onClick={handleToggle}
          >
            <NextLogo mode="small" theme="light" />
          </button>

          <Separator />

          <button
            title="Toggle Component Inspector"
            style={{
              background: 'none',
              cursor: 'pointer',
              borderRadius: '100%',
              borderWidth: 0,
              width: 30,
              height: 30,
              color: '#000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.8,
              transition: 'opacity 0.2s ease-in-out',
            }}
            onClick={handleToggleInspectorActive}
          >
            <svg
              style={{ width: 16, height: 16, opacity: inspectorActive ? 1 : 0.5 }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 1L13.001 4.06201C16.6192 4.51365 19.4869 7.38163 19.9381 11L23 11V13L19.938 13.001C19.4864 16.6189 16.6189 19.4864 13.001 19.938L13 23H11L11 19.9381C7.38163 19.4869 4.51365 16.6192 4.06201 13.001L1 13V11L4.06189 11C4.51312 7.38129 7.38129 4.51312 11 4.06189L11 1H13ZM12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" />
            </svg>
          </button>
        </div>

        <div
          ref={frameRef}
          id="next-devtools-frame"
          style={{
            position: 'fixed',
            zIndex: -1,
            pointerEvents: 'auto',
            bottom: 24,
            ...frameStyles,
          }}
        >
          <iframe
            id="next-devtools-iframe"
            src="/__next_devtools__/client"
            style={{
              display: show ? 'block' : 'none',
              width: '100%',
              height: '100%',
              boxShadow:
                '0 2px 15px -3px var(--next-devtools-widget-shadow), 0 4px 6px -4px var(--next-devtools-widget-shadow)',
              border: '1px solid hsla(0,0%,100%,.05)',
              borderRadius: '4px',
              pointerEvents: 'auto',
            }}
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
  const [position, setPosition] = React.useState<Position | null>(() => {
    const storedPosition = window?.localStorage?.getItem(NEXT_DEVTOOLS_POSITION)
    if (storedPosition) {
      try {
        return JSON.parse(storedPosition)
      } catch {
        /**/
      }
    }
    return null
  })
  const isMouseDownOnToolbar = React.useRef(false)

  const dragStyles = React.useMemo(() => {
    function clamp(value: number, min: number, max: number) {
      return Math.min(Math.max(value, min), max)
    }
    const halfWidth = (ref.current?.clientWidth || 0) / 2
    const left = position?.x || 0
    return {
      left: clamp(
        left,
        halfWidth + panelMargins.current.left,
        windowSize.width - halfWidth - panelMargins.current.right,
      ),
      opacity: isDragging ? 0.75 : 1,
      cursor: isDragging ? 'grabbing' : undefined,
    }
  }, [isDragging, position, windowSize])

  const onMouseDown = React.useCallback((event: PointerEvent) => {
    if (ref.current && ref.current.contains(event.target as Node)) {
      isMouseDownOnToolbar.current = true
      const { left, width } = ref.current.getBoundingClientRect()
      setDraggingOffset({ x: event.clientX - left - width / 2 })

      document.body.style.userSelect = 'none'
    }
  }, [])
  const onMouseMove = React.useCallback(
    (event: PointerEvent) => {
      if (!isMouseDownOnToolbar.current || event.buttons !== 1) return

      if (!isDragging && Math.abs(draggingOffset?.x || 0) > 5) {
        setIsDragging(true)
      }

      if (isDragging && ref.current) {
        const x = event.clientX - (draggingOffset?.x || 0)
        if (x > windowSize.width - ref.current.clientWidth / 2 - panelMargins.current.right) return
        if (x < panelMargins.current.left + ref.current.clientWidth / 2) return

        setPosition({
          x,
        })
      }
    },
    [isDragging, draggingOffset],
  )
  const onMouseUp = React.useCallback(() => {
    if (!position) return

    if (isDragging) {
      const adjustedPosition = position
      if (adjustedPosition.x !== position.x) {
        setPosition(adjustedPosition)
      }
      setTimeout(() => {
        localStorage.setItem('NEXT_DEVTOOLS_POSITION', JSON.stringify(adjustedPosition))
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
    const { width } = ref.current.getBoundingClientRect()

    const newX = (position.x / (innerWidth - width)) * (innerWidth - width)
    const newPosition = { x: newX }

    setPosition(newPosition)
    localStorage.setItem(NEXT_DEVTOOLS_POSITION, JSON.stringify(newPosition))
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
    const halfHeight = (ref.current?.clientHeight || 0) / 2

    const frameMargin = {
      left: panelMargins.current.left + halfHeight,
      top: panelMargins.current.top + halfHeight,
      right: panelMargins.current.right + halfHeight,
      bottom: panelMargins.current.bottom + halfHeight,
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
    const anchorX = position?.x || 0

    style.transform = 'translate(0, 0)'
    if (anchorX - frameMargin.left < width / 2) {
      style.left = `${width / 2 - anchorX + frameMargin.left - iframeBoundingClientRect.width / 2}px`
    } else if (windowSize.width - anchorX - frameMargin.right < width / 2) {
      style.left = `${windowSize.width - anchorX - width / 2 - frameMargin.right - iframeBoundingClientRect.width / 2}px`
    } else {
      style.left = `-${iframeBoundingClientRect.width / 2}px`
    }
    return style
  }, [isDragging, position, windowSize, show, frameRef])

  return {
    ref,
    isDragging,
    dragStyles,
    frameStyles,
  }
}
