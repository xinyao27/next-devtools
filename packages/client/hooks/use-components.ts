'use client'

import useSWR from 'swr'
import { rpcClient } from '@/app/client'

export default function useComponents() {
  return useSWR('getComponents', () => rpcClient.getComponents.query())
}
