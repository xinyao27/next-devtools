'use client'

import useSWR from 'swr'
import { useRPCClient } from '@/app/client'

export default function useComponents() {
  const rpcClient = useRPCClient()
  return useSWR('getComponents', () => rpcClient.current.getComponents.query())
}
