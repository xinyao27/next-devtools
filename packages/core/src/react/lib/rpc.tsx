'use client'

import type { ClientFunctions, RpcMessage, ServerFunctions } from '@next-devtools/shared/types'

import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { WS_CLIENT_TO_SERVER_EVENT_NAME, WS_SERVER_EVENT_NAME } from '@next-devtools/shared/types'
import { createBirpc } from 'birpc'

import { useInternalStore } from './use-internal-store'
import { useSettingsStore } from './use-settings-store'

const clientFunctions: ClientFunctions = {
  onNetworkUpdate: () => {},
  onSettingsStoreUpdate: (state) => {
    useSettingsStore.setState(state)
  },
  onTerminalWrite: () => {},
  serverReady: () => {
    useInternalStore.getState().setup()
  },
}
export function getRpcClient() {
  if (typeof window === 'undefined') return
  const _ip = window.location.hostname
  const _protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const ws = new WebSocket(`${_protocol}://${_ip}:${RPC_SERVER_PORT}`)
  const rpc = createBirpc<ServerFunctions, ClientFunctions>(clientFunctions, {
    deserialize: JSON.parse,
    on: (fn) => {
      ws.addEventListener('message', (e) => {
        const message = JSON.parse(e.data) as RpcMessage
        if (message.event === WS_SERVER_EVENT_NAME) {
          fn(message.payload)
        }
      })
    },
    post: (data) =>
      ws.send(
        JSON.stringify({
          event: WS_CLIENT_TO_SERVER_EVENT_NAME,
          id: crypto.randomUUID(),
          payload: data,
        }),
      ),
    serialize: JSON.stringify,
  })
  return rpc
}
export const rpcClient = getRpcClient()
