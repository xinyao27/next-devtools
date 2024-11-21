'use client'

import useSWR from 'swr'
import { useRPCClient } from '@/lib/client'

export default function useRoutes() {
  const rpcClient = useRPCClient()
  return useSWR('getRoutes', () => rpcClient?.getRoutes.query())
}
