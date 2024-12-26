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
import { useResizable } from '@/hooks/use-resizable'
import { useSettingsStore } from '@/store/settings'
import { cn } from '@/lib/utils'
import type { ToolbarSize } from '@next-devtools/shared/types'

const setToolbarSize = throttle((size: ToolbarSize) => {
  useSettingsStore.getState().setState({ toolbarSize: size })
}, 50)

export default function Resizable({ children }: { children: React.ReactNode }) {
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
          className={cn(
            'pointer-events-auto fixed -z-10 overflow-hidden',
            toolbarPosition === ToolbarPosition.Bottom && 'bottom-0 left-0 right-0 max-h-[90%] min-h-[42px] w-screen',
            toolbarPosition === ToolbarPosition.Top && 'left-0 right-0 top-0 max-h-[90%] min-h-[42px] w-screen',
            toolbarPosition === ToolbarPosition.Left && 'bottom-0 left-0 top-0 h-screen min-w-[42px] max-w-[90%]',
            toolbarPosition === ToolbarPosition.Right && 'bottom-0 right-0 top-0 h-screen min-w-[42px] max-w-[90%]',
          )}
          exit={{
            y: 20,
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          {...getRootProps()}
          style={toolbarSize}
        >
          {/* drag handle */}
          <div
            {...getHandleProps({
              reverse: toolbarPosition === ToolbarPosition.Top || toolbarPosition === ToolbarPosition.Left,
            })}
            className={cn(
              'bg-border hover:bg-primary [&.resizing]:bg-primary absolute z-20 transition-all duration-200',
              toolbarPosition === ToolbarPosition.Top &&
                'bottom-0 left-0 right-0 h-px w-full hover:h-1 [&.resizing]:h-1',
              toolbarPosition === ToolbarPosition.Bottom &&
                'left-0 right-0 top-0 h-px w-full hover:h-1 [&.resizing]:h-1',
              toolbarPosition === ToolbarPosition.Left &&
                'bottom-0 right-0 top-0 h-full w-px hover:w-1 [&.resizing]:w-1',
              toolbarPosition === ToolbarPosition.Right &&
                'bottom-0 left-0 top-0 h-full w-px hover:w-1 [&.resizing]:w-1',
              resizing && 'resizing',
            )}
          />

          <div className="size-full" id="next-devtools-toolbar-wrapper">
            {children}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
