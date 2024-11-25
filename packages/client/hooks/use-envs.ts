'use client'

import { api } from '@/lib/client'

export default function useEnvs() {
  const { data } = api.getEnvs.useQuery()
  return data
}
