'use client'

import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { WS_CLIENT_TO_SERVER_EVENT_NAME, WS_SERVER_EVENT_NAME } from '@next-devtools/shared/types'
import { createBirpc } from 'birpc'
import SuperJSON from 'superjson'
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'
import type { ClientFunctions, RpcMessage, ServerFunctions } from '@next-devtools/shared/types'

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

const clientFunctions: ClientFunctions = {
  onNetworkUpdate: () => {},
  onTerminalWrite: () => {},
}

export function getRpcClient() {
  if (typeof window === 'undefined') return

  const _ip = window.location.hostname
  const _protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const ws = new WebSocket(`${_protocol}://${_ip}:${RPC_SERVER_PORT}`)
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
