'use client'

import React from 'react'
import useSWR from 'swr'
import { rpcClient } from '../client'
import AllEnvs from './(components)/all-envs'

export default function Page() {
  const { data } = useSWR('getEnvs', () => rpcClient.getEnvs.query())

  return (
    <div>
      <AllEnvs data={data} />
    </div>
  )
}
