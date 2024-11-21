'use client'

import useSWR from 'swr'
import { useRPCClient } from '@/lib/client'

export default function useAssets() {
  const rpcClient = useRPCClient()
  return useSWR('getStaticAssets', () => rpcClient?.getStaticAssets.query())
}
