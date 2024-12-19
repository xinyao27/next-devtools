// inspired by https://github.com/MikkelWestermann/react-use-resizable/blob/master/src/index.ts

import React from 'react'

interface SharedProps {
  maxHeight?: number
  maxWidth?: number
  minHeight?: number
  minWidth?: number
  lockHorizontal?: boolean
  lockVertical?: boolean
  onResize?: (values: MoveValues) => void
  onDragEnd?: (values: MoveValues) => void
  onDragStart?: (values: MoveValues) => void
  disabled?: boolean
  maintainAspectRatio?: boolean
}

export interface ResizableProps extends SharedProps {
  interval?: number
  initialHeight?: number | string
  initialWidth?: number | string
}

export interface ResizeHandleProps extends SharedProps {
  parent?: React.RefObject<HTMLElement>
  interval?: number
  reverse?: boolean
}

export interface MoveValues {
  newHeight: number
  heightDiff: number
  newWidth: number
  widthDiff: number
}

type HandleMouseMove = (startHeight: number, startY: number, startWidth: number, startX: number) => (e: Event) => void

type HandleTouchMove = (startHeight: number, startY: number, startWidth: number, startX: number) => (e: Event) => void

enum MoveEvent {
  MouseMove = 'mousemove',
  TouchMove = 'touchmove',
}

enum EndEvent {
  MouseUp = 'mouseup',
  TouchEnd = 'touchend',
}

const defaultProps: ResizableProps = {
  interval: 1,
  initialHeight: 100,
  initialWidth: 100,
  lockHorizontal: false,
  lockVertical: false,
}

export const useResizable = (options: ResizableProps) => {
  const props: ResizableProps = {
    ...defaultProps,
    ...options,
  }

  const parentRef = React.useRef<HTMLDivElement>(null)

  const overlayRef = React.useRef<HTMLDivElement | null>(null)

  const [height, setHeight] = React.useState(props.initialHeight)
  const [width, setWidth] = React.useState(props.initialWidth)

  const createOverlay = () => {
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.right = '0'
    overlay.style.bottom = '0'
    overlay.style.zIndex = '9999'
    overlay.style.cursor = 'ns-resize'
    parentRef.current?.append(overlay)
    overlayRef.current = overlay
  }

  const removeOverlay = () => {
    if (overlayRef.current) {
      overlayRef.current.remove()
      overlayRef.current = null
    }
  }

  const getRootProps = () => {
    return {
      ref: parentRef,
    }
  }

  const getHandleProps = (handleProps?: ResizeHandleProps) => {
    if (!handleProps) {
      handleProps = {}
    }
    const {
      parent = parentRef,
      interval = 1,
      maxHeight = Number.MAX_SAFE_INTEGER,
      maxWidth = Number.MAX_SAFE_INTEGER,
      reverse,
      lockHorizontal,
      lockVertical,
      onResize,
      onDragEnd,
      onDragStart,
      minHeight = 0,
      minWidth = 0,
      disabled = false,
      maintainAspectRatio = false,
    } = { ...props, ...handleProps }

    const handleMove = (
      clientY: number,
      startHeight: number,
      startY: number,
      clientX: number,
      startWidth: number,
      startX: number,
    ) => {
      if (disabled) return
      const currentWidth = parent?.current?.clientWidth || 0
      const currentHeight = parent?.current?.clientHeight || 0
      let roundedHeight = currentHeight
      let roundedWidth = currentWidth

      if (!lockVertical) {
        const newHeight = startHeight + (clientY - startY) * (reverse ? 1 : -1)
        // Round height to nearest interval
        roundedHeight = Math.round(newHeight / interval) * interval
        if (roundedHeight <= 0) {
          roundedHeight = interval
        }
        if (roundedHeight >= maxHeight) {
          roundedHeight = maxHeight
        }
        if (roundedHeight <= minHeight) {
          roundedHeight = minHeight
        }

        setHeight(roundedHeight)
      }

      if (!lockHorizontal) {
        const newWidth = startWidth + (clientX - startX) * (reverse ? 1 : -1)
        // Round height to nearest interval
        roundedWidth = Math.round(newWidth / interval) * interval
        if (roundedWidth <= 0) {
          roundedWidth = interval
        }
        if (roundedWidth >= maxWidth) {
          roundedWidth = maxWidth
        }
        if (roundedWidth <= minWidth) {
          roundedWidth = minWidth
        }

        setWidth(roundedWidth)
      }

      if (maintainAspectRatio) {
        const aspectRatio = currentWidth / currentHeight
        const newAspectRatio = roundedWidth / roundedHeight
        if (newAspectRatio > aspectRatio) {
          roundedWidth = roundedHeight * aspectRatio
          setWidth(roundedWidth)
        } else {
          roundedHeight = roundedWidth / aspectRatio
          setHeight(roundedHeight)
        }
      }

      if (onResize) {
        onResize({
          newHeight: roundedHeight,
          heightDiff: roundedHeight - currentHeight,
          newWidth: roundedWidth,
          widthDiff: roundedWidth - currentWidth,
        })
      }
    }

    const handleMouseMove: HandleMouseMove = (startHeight, startY, startWidth, startX) => (e: Event) => {
      if (!(e instanceof MouseEvent)) return
      handleMove(e.clientY, startHeight, startY, e.clientX, startWidth, startX)
    }

    const handleTouchMove: HandleTouchMove = (startHeight, startY, startWidth, startX) => (e: Event) => {
      e.preventDefault()
      if (!(e instanceof TouchEvent)) return
      handleMove(e.touches[0].clientY, startHeight, startY, e.touches[0].clientX, startWidth, startX)
    }

    const handleDragEnd = (
      handleMoveInstance: (e: Event) => void,
      moveEvent: 'mousemove' | 'touchmove',
      endEvent: 'mouseup' | 'touchend',
      startHeight: number,
      startWidth: number,
    ) => {
      function dragHandler() {
        document.removeEventListener(moveEvent, handleMoveInstance)
        document.removeEventListener(endEvent, dragHandler)
        removeOverlay()

        if (onDragEnd) {
          const currentWidth = parent?.current?.clientWidth || 0
          const currentHeight = parent?.current?.clientHeight || 0
          onDragEnd({
            newHeight: currentHeight,
            heightDiff: currentHeight - startHeight,
            newWidth: currentWidth,
            widthDiff: currentWidth - startWidth,
          })
        }
      }

      return dragHandler
    }

    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return

      createOverlay()

      const startHeight = parent?.current?.clientHeight || 0
      const startWidth = parent?.current?.clientWidth || 0

      let moveHandler = null
      let moveEvent = null
      let endEvent = null
      if (e.type === 'mousedown') {
        const { clientY, clientX } = e as React.MouseEvent
        moveHandler = handleMouseMove(startHeight, clientY, startWidth, clientX)
        moveEvent = MoveEvent.MouseMove
        endEvent = EndEvent.MouseUp
      } else if (e.type === 'touchstart') {
        const { touches } = e as React.TouchEvent
        const { clientY, clientX } = touches[0]
        moveHandler = handleTouchMove(startHeight, clientY, startWidth, clientX)
        moveEvent = MoveEvent.TouchMove
        endEvent = EndEvent.TouchEnd
      }

      if (!moveHandler || !moveEvent || !endEvent) return

      if (onDragStart) {
        onDragStart({
          newHeight: startHeight,
          heightDiff: 0,
          newWidth: startWidth,
          widthDiff: 0,
        })
      }

      const dragEndHandler = handleDragEnd(moveHandler, moveEvent, endEvent, startHeight, startWidth)

      // Attach the mousemove/mouseup/touchmove/touchend listeners to the document
      // so that we can handle the case where the user drags outside of the element
      document.addEventListener(moveEvent, moveHandler, { passive: true })
      document.addEventListener(endEvent, dragEndHandler)
    }

    let cursor
    if (disabled) {
      cursor = 'not-allowed'
    } else if (lockHorizontal && lockVertical) {
      cursor = 'default'
    } else if (lockHorizontal) {
      cursor = 'ns-resize'
    } else if (lockVertical) {
      cursor = 'ew-resize'
    } else {
      cursor = 'nwse-resize'
    }

    const style = {
      cursor,
    }

    return {
      onMouseDown: handleDown,
      onTouchStart: handleDown,
      style,
    }
  }

  return {
    rootRef: parentRef,
    getRootProps,
    getHandleProps,
    size: { height, width },
  }
}
