'use client'

import React from 'react'
import { MessageProvider } from './message-provider.client'
import Toolbar from './toolbar.client'

function Frame() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  return (
    <MessageProvider iframeRef={iframeRef}>
      <Toolbar iframeRef={iframeRef} />
    </MessageProvider>
  )
}
export default React.memo(Frame)
