'use client'

import React from 'react'
import { NextLogo } from '@next-devtools/shared/components'
import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import { AnimatePresence, motion } from 'motion/react'
import { isDev } from '../utils'
import { useResizable } from './hooks/use-resizable'
import { useDrag } from './hooks/use-drag'
import MiniToolbar from './mini-toolbar.client'
import type { MoveValues } from './hooks/use-resizable'
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
    if (frameStatus === 'hide') document.body.style.paddingBottom = '0'
    else if (frameStatus === 'mini') document.body.style.paddingBottom = '42px'
    else if (frameStatus === 'full') document.body.style.paddingBottom = '500px'
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
                <button
                  className="next-devtools-toggle-button"
                  title="Toggle Next Devtools"
                  onClick={() => setFrameStatus('mini')}
                >
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
        {frameStatus === 'full' ? (
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

      <AnimatePresence>
        {frameStatus === 'mini' && (
          <motion.aside
            className="next-devtools-mini-toolbar"
            id="next-devtools-mini-toolbar"
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
          >
            <MiniToolbar setFrameStatus={setFrameStatus} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
