'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { rpcClient } from '@/lib/client'
import { useNetworkStore } from '@/store/network'

export default function Initial() {
  const { data: initialNetworkRequests } = useQuery({
    queryFn: () => rpcClient.getNetworkRequests(),
    queryKey: ['getNetworkRequests'],
  })
  useEffect(() => {
    if (initialNetworkRequests) {
      useNetworkStore.setState({ requests: initialNetworkRequests })
    }
  }, [initialNetworkRequests])

  return null
}
