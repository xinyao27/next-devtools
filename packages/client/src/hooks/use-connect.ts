'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { rpcClient } from '@/lib/client'

export default function useConnect() {
  const { data } = useQuery({
    queryFn: () => rpcClient.ping(),
    queryKey: ['ping'],
  })
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    if (data === 'pong') setConnected(true)
  }, [data])

  return connected
}
