'use client'

import React, { memo, useRef } from 'react'
import { Inspector } from 'react-dev-inspector'
import { NextLogo, RPC_SERVER_PORT } from '@next-devtools/shared'
import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import { MessageProvider } from './message-provider'
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

function Separator() {
  return <div style={{ width: 1, height: 10, borderLeft: '1px solid rgba(136, 136, 136, 0.2)', margin: '0 6px' }} />
}

function Frame() {
  const rpcClient = useRef(createRPCClient())
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [show, setShow] = React.useState(false)
  const [inspectorActive, setInspectorActive] = React.useState(false)
  const handleToggle = React.useCallback(() => {
    setShow((s) => !s)
  }, [])
  const handleToggleInspectorActive = React.useCallback(() => {
    if (show === true) setShow(false)
    setInspectorActive((s) => !s)
  }, [show])

  return (
    <MessageProvider iframeRef={iframeRef}>
      <Inspector
        active={inspectorActive}
        onActiveChange={setInspectorActive}
        onInspectElement={({ codeInfo }) => {
          rpcClient.current?.openInVscode.mutate({
            path: codeInfo.absolutePath || codeInfo.relativePath || '',
            line: codeInfo.lineNumber,
            column: codeInfo.columnNumber,
          })
        }}
      />

      <div
        id="next-devtools-container"
        style={{
          position: 'fixed',
          width: 0,
          zIndex: 2147483645,
          // @ts-expect-error noop
          '--next-devtools-widget-bg': '#fafafa',
          '--next-devtools-widget-border': '#efefef',
          '--next-devtools-widget-shadow': 'rgb(0 0 0 / 10%)',
        }}
      >
        <div
          id="next-devtools-anchor"
          style={{
            width: 0,
            zIndex: 2147483645,
            position: 'fixed',
            left: '50%',
            bottom: 8,
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            id="next-devtools-panel"
            style={{
              padding: '0 6px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'var(--next-devtools-widget-bg)',
              boxShadow:
                '0 2px 15px -3px var(--next-devtools-widget-shadow), 0 4px 6px -4px var(--next-devtools-widget-shadow)',
              border: '1px solid var(--next-devtools-widget-border)',
              borderRadius: '4px',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            <button
              title="Toggle Next Devtools"
              style={{
                marginLeft: 6,
                marginRight: 6,
                background: 'none',
                cursor: 'pointer',
                borderRadius: '100%',
                borderWidth: 0,
                width: 30,
                height: 30,
                color: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.8,
                transition: 'opacity 0.2s ease-in-out',
              }}
              onClick={handleToggle}
            >
              <NextLogo mode="small" theme="light" />
            </button>

            <Separator />

            <button
              title="Toggle Component Inspector"
              style={{
                background: 'none',
                cursor: 'pointer',
                borderRadius: '100%',
                borderWidth: 0,
                width: 30,
                height: 30,
                color: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.8,
                transition: 'opacity 0.2s ease-in-out',
              }}
              onClick={handleToggleInspectorActive}
            >
              <svg
                style={{ width: 16, height: 16, opacity: inspectorActive ? 1 : 0.5 }}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13 1L13.001 4.06201C16.6192 4.51365 19.4869 7.38163 19.9381 11L23 11V13L19.938 13.001C19.4864 16.6189 16.6189 19.4864 13.001 19.938L13 23H11L11 19.9381C7.38163 19.4869 4.51365 16.6192 4.06201 13.001L1 13V11L4.06189 11C4.51312 7.38129 7.38129 4.51312 11 4.06189L11 1H13ZM12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" />
              </svg>
            </button>
          </div>
        </div>
        <div
          id="next-devtools-frame"
          style={{
            display: show ? 'block' : 'none',
            position: 'fixed',
            zIndex: -1,
            pointerEvents: 'auto',
            width: 'min(80vw, 100vw - 48px)',
            height: 'min(60vh, 100vh - 48px)',
            transform: 'translateX(-50%)',
            left: '50%',
            bottom: 24,
          }}
        >
          <iframe
            ref={iframeRef}
            id="next-devtools-iframe"
            src="/__next_devtools__/client"
            style={{
              width: '100%',
              height: '100%',
              boxShadow:
                '0 2px 15px -3px var(--next-devtools-widget-shadow), 0 4px 6px -4px var(--next-devtools-widget-shadow)',
              border: '1px solid hsla(0,0%,100%,.05)',
              borderRadius: '4px',
              pointerEvents: 'auto',
            }}
          />
        </div>
      </div>
    </MessageProvider>
  )
}
export default memo(Frame)
