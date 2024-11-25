'use client'

import { api } from '@/lib/client'

export default function useAssets() {
  const { data } = api.getStaticAssets.useQuery()
  return data
}
