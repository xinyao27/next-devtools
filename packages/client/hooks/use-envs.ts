'use client'

import useSWR from 'swr'
import { rpcClient } from '@/app/client'

export default function useEnvs() {
  return useSWR('getEnvs', () => rpcClient.getEnvs.query())
}
