'use client'

import type { Route } from '@next-devtools/shared/types'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import Line from '@/components/line'
import OpenInEditor from '@/components/open-in-editor'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useNextDevtoolsContent } from '@/hooks/use-next-devtools-context'
import { getQueryClient } from '@/lib/client'
import { cn } from '@/lib/utils'

interface Props {
  data?: Route[]
}
export default function AllRoutes({ data }: Props) {
  const { getRoute, pushRoute } = useNextDevtoolsContent()
  const { data: currentRoute } = useQuery({
    queryFn: () => getRoute(),
    queryKey: ['getRoute'],
  })

  const handleClick = (route: Route) => {
    pushRoute(route.route)
    setTimeout(() => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: ['getRoute'] })
    }, 300)
  }

  return (
    <Accordion
      collapsible
      defaultValue="all-routes"
      type="single"
    >
      <AccordionItem value="all-routes">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <i className="i-ri-node-tree size-6" />
            <div className="text-left">
              <div>All Routes</div>
              <div className="opacity-50">{data?.length} routes registered in your application</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div>
            {data?.map((route) => {
              const active = route.route === currentRoute
              return (
                <Line key={route.path}>
                  <div className="w-16">{active ? <Badge variant="secondary">active</Badge> : null}</div>
                  <OpenInEditor
                    disableLine
                    value={route.path}
                  >
                    <div
                      className={cn('opacity-50 transition hover:opacity-75', { 'opacity-100!': active })}
                      onClick={() => {
                        handleClick(route)
                      }}
                      title={`Navigate to ${route.route}`}
                    >
                      <code>{route.route}</code>
                    </div>
                  </OpenInEditor>
                </Line>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
