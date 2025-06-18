'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useLocalStorage } from 'react-use'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNextDevtoolsContent } from '@/hooks/use-next-devtools-context'
import { cn } from '@/lib/utils'

import CurrentRoute from '../routes/(components)/current-route'
import FacebookCard from './(components)/facebook-card'
import GoogleCard from './(components)/google-card'
import OpenGraphTable from './(components)/open-graph-table'
import XCard from './(components)/x-card'

const PLATFORMS = [
  {
    icon: <i className="i-ri-google-fill size-5" />,
    label: 'Google',
    value: 'google',
  },
  {
    icon: <i className="i-ri-twitter-x-line size-5" />,
    label: 'X',
    value: 'x',
  },
  {
    icon: <i className="i-ri-facebook-fill size-5" />,
    label: 'Facebook',
    value: 'facebook',
  },
] as const

export default function Page() {
  const { getRoute, getSEOMetadata } = useNextDevtoolsContent()
  const { data: currentRoute } = useQuery({
    queryFn: () => getRoute(),
    queryKey: ['getRoute'],
  })
  const [direction, setDirection] = useLocalStorage<'horizontal' | 'vertical'>(
    'NEXT_DEVTOOLS_SEO_LAYOUT_DIRECTION',
    'horizontal',
  )
  const [platform, setPlatform] = useLocalStorage<(typeof PLATFORMS)[number]['value']>(
    'NEXT_DEVTOOLS_SEO_PLATFORM',
    PLATFORMS[1].value,
  )
  const {
    data: seoMetadata,
    isLoading: isLoadingSEOMetadata,
    refetch: refetchSEOMetadata,
  } = useQuery({
    queryFn: () => getSEOMetadata(currentRoute),
    queryKey: ['getSEOMetadata', currentRoute],
  })

  return (
    <ResizablePanelGroup
      autoSaveId="NEXT_DEVTOOLS_SEO_LAYOUT"
      className="size-full"
      direction={direction ?? 'horizontal'}
    >
      <ResizablePanel
        maxSize={80}
        minSize={20}
      >
        <div className="size-full overflow-y-auto">
          <CurrentRoute
            actions={
              <>
                <Button
                  className="size-9"
                  onClick={() => refetchSEOMetadata()}
                  size="icon"
                  variant="ghost"
                >
                  <i className="i-ri-refresh-line size-5" />
                </Button>
                <Button
                  className="size-9"
                  onClick={() => setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal')}
                  size="icon"
                  variant="ghost"
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
            className="bg-background/80 sticky top-0 z-10 backdrop-blur"
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

      <ResizablePanel
        maxSize={80}
        minSize={20}
      >
        <div
          className={cn('flex size-full items-center justify-center overflow-auto', {
            'bg-black': platform === 'x',
            'bg-white': platform === 'google',
          })}
        >
          <Tabs
            className={cn('flex gap-8', {
              'flex-col': direction === 'horizontal',
            })}
            onValueChange={(v) => setPlatform(v as (typeof PLATFORMS)[number]['value'])}
            orientation={direction}
            value={platform}
          >
            <div
              className={cn('flex items-center justify-center', {
                '-ml-12': direction === 'vertical',
                'w-[600px]': direction === 'horizontal',
              })}
            >
              <TabsList
                className={cn('flex', {
                  'flex-col': direction === 'vertical',
                })}
              >
                {PLATFORMS.map((platform) => (
                  <TabsTrigger
                    key={platform.value}
                    value={platform.value}
                  >
                    {platform.icon}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div
              className={cn('flex h-[400px] items-start justify-center', {
                'w-[600px] items-center': direction === 'vertical',
              })}
            >
              {PLATFORMS.map((platform) => {
                if (platform.value === 'google') {
                  return (
                    <TabsContent
                      key={platform.value}
                      value={platform.value}
                    >
                      <div className="flex size-full items-center justify-center">
                        <GoogleCard data={seoMetadata} />
                      </div>
                    </TabsContent>
                  )
                } else if (platform.value === 'x') {
                  return (
                    <TabsContent
                      key={platform.value}
                      value={platform.value}
                    >
                      <div className="flex size-full items-center justify-center">
                        <XCard data={seoMetadata} />
                      </div>
                    </TabsContent>
                  )
                } else if (platform.value === 'facebook') {
                  return (
                    <TabsContent
                      key={platform.value}
                      value={platform.value}
                    >
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
