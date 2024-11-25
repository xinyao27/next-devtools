'use client'

import React from 'react'
import { api } from '@/lib/client'
import AllEnvs from './(components)/all-envs'

export default function Page() {
  const { data } = api.getEnvs.useQuery()

  return (
    <div>
      <AllEnvs data={data} />
    </div>
  )
}
