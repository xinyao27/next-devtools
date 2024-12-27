'use client'

import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  MINI_TOOLBAR_SIZE,
  TOOLBAR_MIN_SIZE,
  ToolbarDefaultSize,
  ToolbarPosition,
  getToolbarStatusBySize,
} from '@next-devtools/shared/types'
import { throttle } from 'es-toolkit'
import { useResizable } from './use-resizable'
import { useSettingsStore } from './use-settings-store'
import type { ToolbarSize } from '@next-devtools/shared/types'

const positionStyles: Record<string, React.CSSProperties> = {
  [ToolbarPosition.Bottom]: {
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
    minHeight: '42px',
    width: '100vw',
  },
  [ToolbarPosition.Top]: {
    left: 0,
    right: 0,
    top: 0,
    maxHeight: '90%',
    minHeight: '42px',
    width: '100vw',
  },
  [ToolbarPosition.Left]: {
    bottom: 0,
    left: 0,
    top: 0,
    height: '100vh',
    minWidth: '42px',
    maxWidth: '90%',
  },
  [ToolbarPosition.Right]: {
    bottom: 0,
    right: 0,
    top: 0,
    height: '100vh',
    minWidth: '42px',
    maxWidth: '90%',
  },
}

const handleStyles: Record<string, Record<string, React.CSSProperties>> = {
  style: {
    base: {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      position: 'absolute',
      zIndex: 20,
      transition: 'all 200ms ease',
    },
    hover: {
      backgroundColor: '#c391e6',
    },
    resizing: {
      backgroundColor: '#c391e6',
    },
  },
  [ToolbarPosition.Top]: {
    base: {
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      width: '100%',
    },
    hover: {
      height: 4,
    },
    resizing: {
      height: 4,
    },
  },
  [ToolbarPosition.Bottom]: {
    base: {
      top: 0,
      left: 0,
      right: 0,
      height: 1,
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
      right: 0,
      top: 0,
      height: '100%',
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
      left: 0,
      top: 0,
      height: '100%',
      width: 1,
    },
    hover: {
      width: 4,
    },
    resizing: {
      width: 4,
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
        case ToolbarPosition.Top:
        case ToolbarPosition.Bottom: {
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
            setToolbarSize({ width: 0, height: '100%' })
          } else if (value <= TOOLBAR_MIN_SIZE) {
            setToolbarSize({ width: MINI_TOOLBAR_SIZE, height: '100%' })
          } else {
            setToolbarSize({ width: value, height: '100%' })
          }
          break
        }
      }
    },
    [toolbarPosition],
  )

  const { getRootProps, getHandleProps } = useResizable({
    lockHorizontal: toolbarPosition === ToolbarPosition.Bottom || toolbarPosition === ToolbarPosition.Top,
    lockVertical: toolbarPosition === ToolbarPosition.Left || toolbarPosition === ToolbarPosition.Right,
    initialHeight: toolbarSize.height,
    initialWidth: toolbarSize.width,
    minHeight:
      toolbarPosition === ToolbarPosition.Bottom || toolbarPosition === ToolbarPosition.Top
        ? MINI_TOOLBAR_SIZE
        : undefined,
    minWidth:
      toolbarPosition === ToolbarPosition.Left || toolbarPosition === ToolbarPosition.Right
        ? MINI_TOOLBAR_SIZE
        : undefined,
    onDragStart: (values) => {
      setResizing(true)
      handleToolbarSizeChange({ height: values.newHeight, width: values.newWidth })
    },
    onResize: (values) => {
      setResizing(true)
      handleToolbarSizeChange({ height: values.newHeight, width: values.newWidth })
    },
    onDragEnd: (values) => {
      setResizing(false)
      handleToolbarSizeChange({ height: values.newHeight, width: values.newWidth })
    },
  })

  const { onMouseDown, onTouchStart, style } = getHandleProps({
    reverse: toolbarPosition === ToolbarPosition.Top || toolbarPosition === ToolbarPosition.Left,
  })

  React.useEffect(() => {
    switch (toolbarPosition) {
      case ToolbarPosition.Top:
        document.body.style.padding = `${toolbarSize.height}px 0 0 0`
        break
      case ToolbarPosition.Bottom:
        document.body.style.padding = `0 0 ${toolbarSize.height}px 0`
        break
      case ToolbarPosition.Left:
        document.body.style.padding = `0 0 0 ${toolbarSize.width}px`
        break
      case ToolbarPosition.Right:
        document.body.style.padding = `0 ${toolbarSize.width}px 0 0`
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
          style={{
            pointerEvents: 'auto',
            position: 'fixed',
            overflow: 'hidden',
            boxShadow: `0 2px 15px -3px rgb(0, 0, 0, 0.2),0 4px 6px -4px rgb(0, 0, 0, 0.2)`,
            ...positionStyles[toolbarPosition],
            ...toolbarSize,
          }}
        >
          {/* drag handle */}
          <div
            data-hovering={hovering}
            data-resizing={resizing}
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
            onMouseDown={onMouseDown}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={onTouchStart}
          />

          {children}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
