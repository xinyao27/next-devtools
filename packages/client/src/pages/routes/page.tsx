'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { rpcClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AllRoutes from './(components)/all-routes'
import CurrentRoute from './(components)/current-route'
import FlowRoutes from './(components)/flow-routes'

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['getRoutes'],
    queryFn: () => rpcClient.getRoutes(),
  })
  const [view, setView] = React.useState<'routes' | 'flow'>('routes')

  return (
    <div className="flex h-full flex-col">
      <CurrentRoute
        actions={
          view === 'routes' ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setView('flow')}>
                  <i className="i-ri-flow-chart size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle View</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setView('routes')}>
                  <i className="i-ri-node-tree size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle View</p>
              </TooltipContent>
            </Tooltip>
          )
        }
      />
      {isLoading ? (
        <div>
          <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[450px]" />
              <Skeleton className="h-4 w-[400px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[450px]" />
              <Skeleton className="h-4 w-[400px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[450px]" />
              <Skeleton className="h-4 w-[400px]" />
            </div>
          </div>
        </div>
      ) : view === 'routes' ? (
        <AllRoutes data={data?.routes} />
      ) : (
        <FlowRoutes data={data?.routes} />
      )}
    </div>
  )
}
