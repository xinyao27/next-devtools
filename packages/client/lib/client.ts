'use client'

import { type FrameMessageHandler, createFrameMessageClient } from '@next-devtools/shared'
import { proxy } from 'valtio'
import { useRef } from 'react'
import { createRPCClient } from '@/lib/rpc'
import type { CreateTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '@next-devtools/core/types'

export const rpcClientStore = proxy<{ client: CreateTRPCProxyClient<AppRouter> | null }>({ client: null })

export function useRPCClient(): CreateTRPCProxyClient<AppRouter> | null {
  if (!rpcClientStore.client) {
    rpcClientStore.client = createRPCClient()
  }
  return rpcClientStore.client
}

export function useMessageClient() {
  const ref = useRef(createFrameMessageClient<FrameMessageHandler>())
  return ref.current
}
