'use client'

import React from 'react'
import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import { AnimatePresence, motion } from 'motion/react'
import {
  MINI_TOOLBAR_SIZE,
  TOOLBAR_MIN_SIZE,
  ToolbarDefaultSize,
  ToolbarPosition,
  getToolbarStatusBySize,
} from '@next-devtools/shared/types'
import { throttle } from 'es-toolkit'
import { useResizable } from './hooks/use-resizable'
import { useSettingsStore } from './settings.store'
import type { ToolbarSize } from '@next-devtools/shared/types'

interface ToolbarProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
}

const setToolbarSize = throttle((size: ToolbarSize) => {
  useSettingsStore.getState().setState({ toolbarSize: size })
}, 50)

export default function Toolbar({ iframeRef }: ToolbarProps) {
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
    <div className="next-devtools-container" id="next-devtools-container">
      <AnimatePresence>
        {toolbarStatus === 'full' || toolbarStatus === 'mini' ? (
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
            data-position={toolbarPosition}
            style={toolbarSize}
          >
            <div
              {...getHandleProps({
                reverse: toolbarPosition === ToolbarPosition.Top || toolbarPosition === ToolbarPosition.Left,
              })}
              className={`next-devtools-frame-handle ${resizing ? 'resizing' : ''}`}
              data-position={toolbarPosition}
            />

            <iframe ref={iframeRef} className="next-devtools-iframe" id="next-devtools-iframe" src={CLIENT_BASE_PATH} />
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
