'use client'

import type { ToolbarSize } from '@next-devtools/shared/types'

import {
  getToolbarStatusBySize,
  MINI_TOOLBAR_SIZE,
  TOOLBAR_MIN_SIZE,
  ToolbarDefaultSize,
  ToolbarPosition,
} from '@next-devtools/shared/types'
import { throttle } from 'es-toolkit'
import { AnimatePresence, motion } from 'motion/react'
import React from 'react'

import { useResizable } from './use-resizable'
import { useSettingsStore } from './use-settings-store'

const positionStyles: Record<string, React.CSSProperties> = {
  [ToolbarPosition.Bottom]: {
    bottom: 0,
    left: 0,
    maxHeight: '90%',
    minHeight: '42px',
    right: 0,
    width: '100vw',
  },
  [ToolbarPosition.Left]: {
    bottom: 0,
    height: '100vh',
    left: 0,
    maxWidth: '90%',
    minWidth: '42px',
    top: 0,
  },
  [ToolbarPosition.Right]: {
    bottom: 0,
    height: '100vh',
    maxWidth: '90%',
    minWidth: '42px',
    right: 0,
    top: 0,
  },
  [ToolbarPosition.Top]: {
    left: 0,
    maxHeight: '90%',
    minHeight: '42px',
    right: 0,
    top: 0,
    width: '100vw',
  },
}

const handleStyles: Record<string, Record<string, React.CSSProperties>> = {
  style: {
    base: {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      position: 'absolute',
      transition: 'all 200ms ease',
      zIndex: 20,
    },
    hover: {
      backgroundColor: '#ffc799',
    },
    resizing: {
      backgroundColor: '#ffc799',
    },
  },
  [ToolbarPosition.Bottom]: {
    base: {
      height: 1,
      left: 0,
      right: 0,
      top: 0,
      width: '100%',
    },
    hover: {
      height: 4,
    },
    resizing: {
      height: 4,
    },
  },
  [ToolbarPosition.Left]: {
    base: {
      bottom: 0,
      height: '100%',
      right: 0,
      top: 0,
      width: 1,
    },
    hover: {
      width: 4,
    },
    resizing: {
      width: 4,
    },
  },
  [ToolbarPosition.Right]: {
    base: {
      bottom: 0,
      height: '100%',
      left: 0,
      top: 0,
      width: 1,
    },
    hover: {
      width: 4,
    },
    resizing: {
      width: 4,
    },
  },
  [ToolbarPosition.Top]: {
    base: {
      bottom: 0,
      height: 1,
      left: 0,
      right: 0,
      width: '100%',
    },
    hover: {
      height: 4,
    },
    resizing: {
      height: 4,
    },
  },
}

const setToolbarSize = throttle((size: ToolbarSize) => {
  useSettingsStore.getState().setState({ toolbarSize: size })
}, 50)

export default function Resizable({ children }: { children: React.ReactNode }) {
  const [hovering, setHovering] = React.useState(false)
  const [resizing, setResizing] = React.useState(false)
  const toolbarPosition = useSettingsStore((state) => state.toolbarPosition)
  const toolbarSize = useSettingsStore((state) => state.toolbarSize || ToolbarDefaultSize[toolbarPosition])

  const toolbarStatus = React.useMemo(
    () => getToolbarStatusBySize(toolbarSize, toolbarPosition),
    [toolbarSize, toolbarPosition],
  )

  const handleToolbarSizeChange = React.useCallback(
    (size: ToolbarSize) => {
      switch (toolbarPosition) {
        case ToolbarPosition.Bottom:
        case ToolbarPosition.Top: {
          const value = Number(size.height)
          if (value < MINI_TOOLBAR_SIZE) {
            setToolbarSize({ height: 0, width: '100%' })
          } else if (value <= TOOLBAR_MIN_SIZE) {
            setToolbarSize({ height: MINI_TOOLBAR_SIZE, width: '100%' })
          } else {
            setToolbarSize({ height: value, width: '100%' })
          }
          break
        }
        case ToolbarPosition.Left:
        case ToolbarPosition.Right: {
          const value = Number(size.width)
          if (value < MINI_TOOLBAR_SIZE) {
            setToolbarSize({ height: '100%', width: 0 })
          } else if (value <= TOOLBAR_MIN_SIZE) {
            setToolbarSize({ height: '100%', width: MINI_TOOLBAR_SIZE })
          } else {
            setToolbarSize({ height: '100%', width: value })
          }
          break
        }
      }
    },
    [toolbarPosition],
  )

  const { getHandleProps, getRootProps } = useResizable({
    initialHeight: toolbarSize.height,
    initialWidth: toolbarSize.width,
    lockHorizontal: toolbarPosition === ToolbarPosition.Bottom || toolbarPosition === ToolbarPosition.Top,
    lockVertical: toolbarPosition === ToolbarPosition.Left || toolbarPosition === ToolbarPosition.Right,
    minHeight:
      toolbarPosition === ToolbarPosition.Bottom || toolbarPosition === ToolbarPosition.Top
        ? MINI_TOOLBAR_SIZE
        : undefined,
    minWidth:
      toolbarPosition === ToolbarPosition.Left || toolbarPosition === ToolbarPosition.Right
        ? MINI_TOOLBAR_SIZE
        : undefined,
    onDragEnd: (values) => {
      setResizing(false)
      handleToolbarSizeChange({ height: values.newHeight, width: values.newWidth })
    },
    onDragStart: (values) => {
      setResizing(true)
      handleToolbarSizeChange({ height: values.newHeight, width: values.newWidth })
    },
    onResize: (values) => {
      setResizing(true)
      handleToolbarSizeChange({ height: values.newHeight, width: values.newWidth })
    },
  })

  const { onMouseDown, onTouchStart, style } = getHandleProps({
    reverse: toolbarPosition === ToolbarPosition.Top || toolbarPosition === ToolbarPosition.Left,
  })

  React.useEffect(() => {
    switch (toolbarPosition) {
      case ToolbarPosition.Bottom:
        document.body.style.padding = `0 0 ${toolbarSize.height}px 0`
        break
      case ToolbarPosition.Left:
        document.body.style.padding = `0 0 0 ${toolbarSize.width}px`
        break
      case ToolbarPosition.Right:
        document.body.style.padding = `0 ${toolbarSize.width}px 0 0`
        break
      case ToolbarPosition.Top:
        document.body.style.padding = `${toolbarSize.height}px 0 0 0`
        break
    }
  }, [toolbarPosition, toolbarSize])

  React.useEffect(() => {
    useSettingsStore.getState().setup()
  }, [])

  return (
    <AnimatePresence>
      {toolbarStatus === 'full' || toolbarStatus === 'mini' ? (
        <motion.aside
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          {...getRootProps()}
          style={{
            boxShadow: `0 2px 15px -3px rgb(0, 0, 0, 0.2),0 4px 6px -4px rgb(0, 0, 0, 0.2)`,
            overflow: 'hidden',
            pointerEvents: 'auto',
            position: 'fixed',
            ...positionStyles[toolbarPosition],
            ...toolbarSize,
          }}
        >
          {/* drag handle */}
          <div
            data-hovering={hovering}
            data-resizing={resizing}
            onMouseDown={onMouseDown}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={onTouchStart}
            style={{
              ...style,
              ...handleStyles.style.base,
              ...handleStyles[toolbarPosition].base,
              ...(hovering && {
                ...handleStyles.style.hover,
                ...handleStyles[toolbarPosition].hover,
              }),
              ...(resizing && {
                ...handleStyles.style.resizing,
                ...handleStyles[toolbarPosition].resizing,
              }),
            }}
          />

          {children}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
