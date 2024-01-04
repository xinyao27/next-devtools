'use client'

import React from 'react'
import useSWR from 'swr'
import { useRPCClient } from '../client'
import AllEnvs from './(components)/all-envs'

export default function Page() {
  const rpcClient = useRPCClient()
  const { data } = useSWR('getEnvs', () => rpcClient.current?.getEnvs.query())

  return (
    <div>
      <AllEnvs data={data} />
    </div>
  )
}
