'use client'

import { useShallow } from 'zustand/react/shallow'
import { useNetworkStore } from '@/store/network'
import DataTable from './(components)/data-table'
import { columns } from './(components)/columns'
import { SheetDetailsContent } from './(components)/sheet-details-content'
import type { NetworkRequest } from '@next-devtools/shared/types'

export default function Page() {
  const data = useNetworkStore(useShallow((state) => Array.from(state.requests.values())))

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DataTable<NetworkRequest, string>
        className="flex-1"
        columns={columns}
        data={data}
        getDetailsContent={(data) => <SheetDetailsContent data={data} />}
        getTitle={(data) => data?.url}
      />
    </div>
  )
}
