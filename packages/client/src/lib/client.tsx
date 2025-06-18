'use client'

import type { ClientFunctions, RpcMessage, ServerFunctions } from '@next-devtools/shared/types'

import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { WS_CLIENT_TO_SERVER_EVENT_NAME, WS_SERVER_EVENT_NAME } from '@next-devtools/shared/types'
import { diffApply } from '@next-devtools/shared/utils'
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import { createBirpc } from 'birpc'

import { useInternalStore } from '@/store/internal'
import { useNetworkStore } from '@/store/network'
import { useSettingsStore } from '@/store/settings'
import { useTerminalStore } from '@/store/terminal'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData: JSON.stringify,
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: JSON.parse,
      },
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getBaseUrl() {
  if (typeof window === 'undefined') return
  const _ip = window.location.hostname
  const _protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${_protocol}://${_ip}:${RPC_SERVER_PORT}`
}

export function getQueryClient() {
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

const clientFunctions: ClientFunctions = {
  onNetworkUpdate: (diff) => {
    const data = structuredClone(useNetworkStore.getState().requests)
    const newData = diffApply(data, diff)
    useNetworkStore.setState({ requests: newData })
  },

  onSettingsStoreUpdate: (state) => {
    useSettingsStore.setState(state)
  },
  onTerminalWrite: (data) => {
    useTerminalStore.getState().onTerminalWrite(data)
  },
  serverReady: () => {
    useInternalStore.getState().setup()
  },
}

export function getRpcClient() {
  const ws = new WebSocket(getBaseUrl()!)
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
