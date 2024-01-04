'use client'

import React from 'react'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { useRPCClient } from '@/lib/client'
import AllRoutes from './(components)/all-routes'
import CurrentRoute from './(components)/current-route'

export default function Page() {
  const rpcClient = useRPCClient()
  const { data, isLoading } = useSWR('getRoutes', () => rpcClient.current?.getRoutes.query())

  return (
    <div>
      <CurrentRoute />
      {
        isLoading
          ? (
            <div>
              <div className="flex items-center p-4 space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[450px]" />
                  <Skeleton className="h-4 w-[400px]" />
                </div>
              </div>
              <div className="flex items-center p-4 space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[450px]" />
                  <Skeleton className="h-4 w-[400px]" />
                </div>
              </div>
              <div className="flex items-center p-4 space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[450px]" />
                  <Skeleton className="h-4 w-[400px]" />
                </div>
              </div>
            </div>
            )
          : <AllRoutes data={data?.routes} />
      }
    </div>
  )
}
