'use client'

import { api } from '@/lib/client'

export default function useComponents() {
  const { data } = api.getComponents.useQuery()
  return data
}
