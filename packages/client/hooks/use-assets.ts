'use client'

import useSWR from 'swr'
import { rpcClient } from '@/app/client'

export default function useAssets() {
  return useSWR('getStaticAssets', () => rpcClient.getStaticAssets.query())
}
