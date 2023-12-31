'use client'

import useSWR from 'swr'
import { rpcClient } from '@/app/client'

export default function useRoutes() {
  return useSWR('getRoutes', () => rpcClient.getRoutes.query())
}
