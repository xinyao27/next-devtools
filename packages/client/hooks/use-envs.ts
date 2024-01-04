'use client'

import useSWR from 'swr'
import { useRPCClient } from '@/app/client'

export default function useEnvs() {
  const rpcClient = useRPCClient()
  return useSWR('getEnvs', () => rpcClient.current?.getEnvs.query())
}
