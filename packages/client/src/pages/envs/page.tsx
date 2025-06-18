'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { rpcClient } from '@/lib/client'

import AllEnvs from './(components)/all-envs'

export default function Page() {
  const { data } = useQuery({
    queryFn: () => rpcClient.getEnvs(),
    queryKey: ['getEnvs'],
  })

  return (
    <div>
      <AllEnvs data={data} />
    </div>
  )
}
