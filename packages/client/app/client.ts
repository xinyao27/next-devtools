import { createFrameMessageClient, createRPCClient } from '@next-devtools/shared'
import { type FrameMessageHandler } from '@next-devtools/shared'
import { useRef } from 'react'

export function useRPCClient() {
  const client = useRef(createRPCClient())
  return client
}

export function useMessageClient() {
  const client = useRef(createFrameMessageClient<FrameMessageHandler>())
  return client
}
