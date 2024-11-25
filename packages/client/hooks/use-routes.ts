'use client'

import { api } from '@/lib/client'

export default function useRoutes() {
  const { data } = api.getRoutes.useQuery()
  return data
}
