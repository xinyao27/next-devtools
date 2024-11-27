'use client'

import React from 'react'
import { Inspector } from 'react-dev-inspector'
import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import { MessageProvider } from './message-provider.client'
import Toolbar from './toolbar.client'
import type { CreateTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '../server/router'

function createRPCClient(ip?: string): CreateTRPCProxyClient<AppRouter> | null {
  if (typeof window != 'undefined') {
    const _ip = window.location.hostname
    const _protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    // create persistent WebSocket connection
    const wsClient = createWSClient({ url: `${_protocol}://${ip || _ip}:${RPC_SERVER_PORT}` })
    // configure TRPCClient to use WebSockets transport
    return createTRPCProxyClient<AppRouter>({ links: [wsLink({ client: wsClient })] })
  }
  return null
}

function Frame() {
  const rpcClient = React.useRef(createRPCClient())
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const [inspectorActive, setInspectorActive] = React.useState(false)

  return (
    <MessageProvider iframeRef={iframeRef}>
      <Inspector
        active={inspectorActive}
        onActiveChange={setInspectorActive}
        onInspectElement={({ codeInfo }) => {
          rpcClient.current?.openInEditor.mutate({
            path: codeInfo.absolutePath || codeInfo.relativePath || '',
            line: codeInfo.lineNumber,
            column: codeInfo.columnNumber,
          })
        }}
      />

      <Toolbar iframeRef={iframeRef} inspectorActive={inspectorActive} setInspectorActive={setInspectorActive} />
    </MessageProvider>
  )
}
export default React.memo(Frame)
