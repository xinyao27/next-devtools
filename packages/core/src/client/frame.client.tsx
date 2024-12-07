'use client'

import React from 'react'
import { MessageProvider } from './message-provider.client'
import Toolbar from './toolbar.client'
import type { FrameStatus } from '@next-devtools/shared/utils'

function Frame() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [frameStatus, setFrameStatus] = React.useState<FrameStatus>('hide')

  return (
    <MessageProvider iframeRef={iframeRef} setFrameStatus={setFrameStatus}>
      <Toolbar frameStatus={frameStatus} iframeRef={iframeRef} setFrameStatus={setFrameStatus} />
    </MessageProvider>
  )
}
export default React.memo(Frame)
