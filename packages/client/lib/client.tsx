'use client'

import { type FrameMessageHandler, createFrameMessageClient } from '@next-devtools/shared/utils'
import React from 'react'
import { QueryClient, QueryClientProvider, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'
import { createTRPCClient, createTRPCReact, createWSClient, wsLink } from '@trpc/react-query'
import SuperJSON from 'superjson'
import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import type { CreateTRPCProxyClient, CreateTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@next-devtools/core/types'

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
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function getBaseUrl() {
  if (typeof window != 'undefined') {
    const _ip = window.location.hostname
    const _protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    return `${_protocol}://${_ip}:${RPC_SERVER_PORT}`
  }
  return `ws://localhost:${RPC_SERVER_PORT}`
}

export const api: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>()

export const link = wsLink({ client: createWSClient({ url: getBaseUrl() }) })

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = React.useState(() => {
    return api.createClient({
      links: [link],
    })
  })

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}

export const trpcClient: CreateTRPCProxyClient<AppRouter> = createTRPCClient<AppRouter>({
  links: [link],
})
