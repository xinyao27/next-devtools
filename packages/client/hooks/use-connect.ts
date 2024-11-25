'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/client'

export default function useConnect() {
  const { data } = api.ping.useQuery()
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    if (data === 'pong') setConnected(true)
  }, [data])

  return connected
}
