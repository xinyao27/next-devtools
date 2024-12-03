'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { rpcClient } from '@/lib/client'

export default function useConnect() {
  const { data } = useQuery({
    queryKey: ['ping'],
    queryFn: () => rpcClient.ping(),
  })
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    if (data === 'pong') setConnected(true)
  }, [data])

  return connected
}
