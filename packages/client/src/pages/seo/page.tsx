'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from 'react-use'
import { Skeleton } from '@/components/ui/skeleton'
import { useMessageClient } from '@/lib/client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CurrentRoute from '../routes/(components)/current-route'
import XCard from './(components)/x-card'
import GoogleCard from './(components)/google-card'
import FacebookCard from './(components)/facebook-card'
import OpenGraphTable from './(components)/open-graph-table'

const PLATFORMS = ['google', 'x', 'facebook'] as const

export default function Page() {
  const [direction, setDirection] = useLocalStorage<'horizontal' | 'vertical'>(
    'NEXT_DEVTOOLS_SEO_LAYOUT_DIRECTION',
    'horizontal',
  )
  const [platform, setPlatform] = useLocalStorage<(typeof PLATFORMS)[number]>(
    'NEXT_DEVTOOLS_SEO_PLATFORM',
    PLATFORMS[1],
  )
  const messageClient = useMessageClient()
  const { data: route } = useQuery({
    queryKey: ['getRoute'],
    queryFn: () => messageClient.getRoute(),
  })
  const {
    data: seoMetadata,
    isLoading: isLoadingSEOMetadata,
    refetch: refetchSEOMetadata,
  } = useQuery({
    queryKey: ['getSEOMetadata', route],
    queryFn: () => messageClient.getSEOMetadata(route),
  })

  return (
    <ResizablePanelGroup
      autoSaveId="NEXT_DEVTOOLS_SEO_LAYOUT"
      className="size-full"
      direction={direction ?? 'horizontal'}
    >
      <ResizablePanel maxSize={80} minSize={20}>
        <div className="size-full overflow-y-auto">
          <CurrentRoute
            className="bg-background/80 sticky top-0 z-10 backdrop-blur"
            actions={
              <>
                <Button className="size-9" size="icon" variant="ghost" onClick={() => refetchSEOMetadata()}>
                  <i className="i-ri-refresh-line size-5" />
                </Button>
                <Button
                  className="size-9"
                  size="icon"
                  variant="ghost"
                  onClick={() => setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal')}
                >
                  <i
                    className={cn(
                      direction === 'horizontal' ? 'i-ri-layout-row-line' : 'i-ri-layout-column-line',
                      'size-5',
                    )}
                  />
                </Button>
              </>
            }
          />
          {isLoadingSEOMetadata ? (
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
          ) : (
            <div className="p-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Validate how your Open Graph data is used for link previews on social platforms.
                </p>

                <OpenGraphTable data={seoMetadata} />
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel maxSize={80} minSize={20}>
        <div
          className={cn('flex size-full items-center justify-center', {
            'bg-black': platform === 'x',
            'bg-white': platform === 'google',
          })}
        >
          <Tabs value={platform} onValueChange={(v) => setPlatform(v as (typeof PLATFORMS)[number])}>
            <div className="mb-8 flex w-[600px] items-center justify-center">
              <TabsList>
                {PLATFORMS.map((platform) => (
                  <TabsTrigger key={platform} value={platform}>
                    <span className="capitalize">{platform}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex h-[400px] items-start justify-center">
              {PLATFORMS.map((platform) => {
                if (platform === 'google') {
                  return (
                    <TabsContent key={platform} value={platform}>
                      <div className="flex size-full items-center justify-center">
                        <GoogleCard data={seoMetadata} />
                      </div>
                    </TabsContent>
                  )
                } else if (platform === 'x') {
                  return (
                    <TabsContent key={platform} value={platform}>
                      <div className="flex size-full items-center justify-center">
                        <XCard data={seoMetadata} />
                      </div>
                    </TabsContent>
                  )
                } else if (platform === 'facebook') {
                  return (
                    <TabsContent key={platform} value={platform}>
                      <div className="flex size-full items-center justify-center">
                        <FacebookCard data={seoMetadata} />
                      </div>
                    </TabsContent>
                  )
                }
                return null
              })}
            </div>
          </Tabs>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}