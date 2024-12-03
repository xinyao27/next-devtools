'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { rpcClient } from '@/lib/client'
import AllEnvs from './(components)/all-envs'

export default function Page() {
  const { data } = useQuery({
    queryKey: ['getEnvs'],
    queryFn: () => rpcClient.getEnvs(),
  })

  return (
    <div>
      <AllEnvs data={data} />
    </div>
  )
}
