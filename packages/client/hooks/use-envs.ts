'use client'

import useSWR from 'swr'
import { useRPCClient } from '@/lib/client'

export default function useEnvs() {
  const rpcClient = useRPCClient()
  return useSWR('getEnvs', () => rpcClient?.getEnvs.query())
}
