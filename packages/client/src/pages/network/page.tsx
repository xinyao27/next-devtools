'use client'

import { useMemo } from 'react'
import { useNetworkStore } from '@/store/network'
import { Button } from '@/components/ui/button'
import DataTable from './(components)/data-table'
import { columns } from './(components)/columns'
import { SheetDetailsContent } from './(components)/sheet-details-content'
import type { NetworkRequest } from '@next-devtools/shared/types'

export default function Page() {
  const requests = useNetworkStore((state) => state.requests)
  const data = useMemo(() => Object.values(requests).sort((a, b) => b.startTime - a.startTime), [requests])
  const clear = useNetworkStore((state) => state.clear)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DataTable<NetworkRequest, string>
        className="flex-1"
        columns={columns}
        data={data}
        getDetailsContent={(data) => <SheetDetailsContent data={data} />}
        getTitle={(data) => data?.url}
        headerExtra={
          <>
            {data.length > 0 ? (
              <Button className="group size-6" size="icon" variant="secondary" onClick={() => clear()}>
                <i className="i-ri-delete-bin-line text-muted-foreground group-hover:text-foreground size-4 transition-colors duration-200" />
              </Button>
            ) : null}
          </>
        }
      />
    </div>
  )
}
