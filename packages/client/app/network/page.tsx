'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/client'
import DataTable from './(components)/data-table'
import { columns } from './(components)/columns'
import { SheetDetailsContent } from './(components)/sheet-details-content'
import type { NetworkRequest } from '@next-devtools/shared/types'

export default function Page() {
  const { data: initialNetworkRequests, isFetching, isLoading } = api.getNetworkRequests.useQuery()
  const [data, setData] = useState<NetworkRequest[]>(initialNetworkRequests ?? [])

  api.onNetworkUpdate.useSubscription(undefined, {
    onData: (data) => {
      setData(data)
    },
  })

  useEffect(() => {
    if (initialNetworkRequests) {
      setData(initialNetworkRequests)
    }
  }, [initialNetworkRequests])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DataTable<NetworkRequest, string>
        className="flex-1"
        columns={columns}
        data={data}
        getDetailsContent={(data) => <SheetDetailsContent data={data} />}
        getTitle={(data) => data?.url}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </div>
  )
}
