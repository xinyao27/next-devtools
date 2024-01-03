'use client'

import useSWR from 'swr'
import { useRPCClient } from '@/app/client'

export default function useAssets() {
  const rpcClient = useRPCClient()
  return useSWR('getStaticAssets', () => rpcClient.current.getStaticAssets.query())
}
