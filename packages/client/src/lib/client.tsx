'use client'

import { createFrameMessageClient, diffApply } from '@next-devtools/shared/utils'
import React from 'react'
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'
import SuperJSON from 'superjson'
import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { createBirpc } from 'birpc'
import { WS_CLIENT_TO_SERVER_EVENT_NAME, WS_SERVER_EVENT_NAME } from '@next-devtools/shared/types'
import { useNetworkStore } from '@/store/network'
import { useTerminalStore } from '@/store/terminal'
import { useSettingsStore } from '@/store/settings'
import { useInternalStore } from '@/store/internal'
import type { FrameMessageHandler } from '@next-devtools/shared/utils'
import type { ClientFunctions, RpcMessage, ServerFunctions } from '@next-devtools/shared/types'

export function useMessageClient() {
  const ref = React.useRef(createFrameMessageClient<FrameMessageHandler>())
  return ref.current
}

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function getBaseUrl() {
  const _ip = window.location.hostname
  const _protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${_protocol}://${_ip}:${RPC_SERVER_PORT}`
}

const clientFunctions: ClientFunctions = {
  serverReady: () => {
    useInternalStore.getState().setup()
  },

  onNetworkUpdate: (diff) => {
    const data = structuredClone(useNetworkStore.getState().requests)
    const newData = diffApply(data, diff)
    useNetworkStore.setState({ requests: newData })
  },
  onTerminalWrite: (data) => {
    useTerminalStore.getState().onTerminalWrite(data)
  },
  onSettingsStoreUpdate: (state) => {
    useSettingsStore.setState(state)
  },
}

export function getRpcClient() {
  const ws = new WebSocket(getBaseUrl())
  const rpc = createBirpc<ServerFunctions, ClientFunctions>(clientFunctions, {
    post: (data) =>
      ws.send(
        JSON.stringify({
          id: crypto.randomUUID(),
          event: WS_CLIENT_TO_SERVER_EVENT_NAME,
          payload: data,
        }),
      ),
    on: (fn) => {
      ws.addEventListener('message', (e) => {
        const message = JSON.parse(e.data) as RpcMessage
        if (message.event === WS_SERVER_EVENT_NAME) {
          fn(message.payload)
        }
      })
    },
    serialize: SuperJSON.stringify,
    deserialize: SuperJSON.parse,
  })
  return rpc
}
export const rpcClient = getRpcClient()
