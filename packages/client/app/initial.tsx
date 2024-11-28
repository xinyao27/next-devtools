'use client'

import { useEffect } from 'react'
import { api } from '@/lib/client'
import { useNetworkStore } from '@/store/network'

export default function Initial() {
  // network
  const setData = useNetworkStore((state) => state.set)
  const { data: initialNetworkRequests } = api.getNetworkRequests.useQuery()
  useEffect(() => {
    if (initialNetworkRequests) {
      setData(initialNetworkRequests)
    }
  }, [initialNetworkRequests])
  api.onNetworkUpdate.useSubscription(undefined, {
    onData: (data) => {
      setData(data)
    },
  })

  return <div className="hidden" />
}
