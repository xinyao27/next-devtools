'use client'

import React from 'react'
import { Inspector } from 'react-dev-inspector'
import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { createBirpc } from 'birpc'
import SuperJSON from 'superjson'
import { WS_PROVIDER_TO_SERVER_EVENT_NAME, WS_SERVER_EVENT_NAME } from '@next-devtools/shared/types'
import { MessageProvider } from './message-provider.client'
import Toolbar from './toolbar.client'
import type { ClientFunctions, RpcMessage, ServerFunctions } from '@next-devtools/shared/types'

function createRPCClient(ip?: string) {
  if (typeof window != 'undefined') {
    const _ip = window.location.hostname
    const _protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${_protocol}://${ip || _ip}:${RPC_SERVER_PORT}`)
    const clientFunctions: ClientFunctions = {
      onNetworkUpdate: () => {},
      onTerminalWrite: () => {},
    }
    return createBirpc<ServerFunctions, ClientFunctions>(clientFunctions, {
      post: (data) =>
        ws.send(
          JSON.stringify({
            id: crypto.randomUUID(),
            event: WS_PROVIDER_TO_SERVER_EVENT_NAME,
            payload: data,
          }),
        ),
      on: (fn) =>
        ws.addEventListener('message', (e) => {
          const message = JSON.parse(e.data) as RpcMessage
          if (message.event === WS_SERVER_EVENT_NAME) {
            fn(message.payload)
          }
        }),
      serialize: SuperJSON.stringify,
      deserialize: SuperJSON.parse,
    })
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
          rpcClient.current?.openInEditor({
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
