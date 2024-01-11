'use client'

import { useRef } from 'react'
import { type FrameMessageHandler, createFrameMessageClient } from '@next-devtools/shared'
import { createRPCClient } from '@/lib/rpc'
import type { MutableRefObject } from 'react'
import type { CreateTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '@next-devtools/core/types'

export function useRPCClient(): MutableRefObject<CreateTRPCProxyClient<AppRouter> | null> {
  const client = useRef(createRPCClient())
  return client
}

export function useMessageClient() {
  const client = useRef(createFrameMessageClient<FrameMessageHandler>())
  return client
}
