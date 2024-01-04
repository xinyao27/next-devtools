'use client'

import { useRef } from 'react'
import { type FrameMessageHandler, createFrameMessageClient } from '@next-devtools/shared'
import { createRPCClient } from '@/lib/rpc'

export function useRPCClient() {
  const client = useRef(createRPCClient())
  return client
}

export function useMessageClient() {
  const client = useRef(createFrameMessageClient<FrameMessageHandler>())
  return client
}
