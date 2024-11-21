'use client'

import React from 'react'
import useSWR from 'swr'
import { useRPCClient } from '@/lib/client'
import AllEnvs from './(components)/all-envs'

export default function Page() {
  const rpcClient = useRPCClient()
  const { data } = useSWR('getEnvs', () => rpcClient?.getEnvs.query())

  return (
    <div>
      <AllEnvs data={data} />
    </div>
  )
}
