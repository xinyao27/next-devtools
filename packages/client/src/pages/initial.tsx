'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { rpcClient } from '@/lib/client'
import { useNetworkStore } from '@/store/network'

export default function Initial() {
  const { data: initialNetworkRequests } = useQuery({
    queryKey: ['getNetworkRequests'],
    queryFn: () => rpcClient.getNetworkRequests(),
  })
  useEffect(() => {
    if (initialNetworkRequests) {
      useNetworkStore.setState({ requests: initialNetworkRequests })
    }
  }, [initialNetworkRequests])

  return null
}
