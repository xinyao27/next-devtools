'use client'

import useSWR from 'swr'
import { useRPCClient } from '@/app/client'

export default function useRoutes() {
  const rpcClient = useRPCClient()
  return useSWR('getRoutes', () => rpcClient.current.getRoutes.query())
}
