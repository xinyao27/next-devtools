'use client'

import { type FrameMessageHandler, createFrameMessageClient } from '@next-devtools/shared/utils/frame-message'
import { useRef } from 'react'
import { createRPCClient } from '@/lib/rpc'
import type { CreateTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '@next-devtools/core/types'

// eslint-disable-next-line import/no-mutable-exports
export let rpcClient: CreateTRPCProxyClient<AppRouter> | null = null

export function useRPCClient(): CreateTRPCProxyClient<AppRouter> | null {
  if (!rpcClient) {
    rpcClient = createRPCClient()
  }
  return rpcClient
}

export function useMessageClient() {
  const ref = useRef(createFrameMessageClient<FrameMessageHandler>())
  return ref.current
}
