'use client'

import React from 'react'
import useSWR from 'swr'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useMessageClient } from '@/lib/client'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import Line from '@/components/line'
import OpenInVscode from '@/components/open-in-vscode'
import type { Route } from '@next-devtools/shared'

interface Props {
  data?: Route[]
}
export default function AllRoutes({ data }: Props) {
  const messageClient = useMessageClient()
  const { data: currentRoute, mutate } = useSWR('getRoute', () => messageClient.getRoute())

  return (
    <Accordion collapsible defaultValue="all-routes" type="single">
      <AccordionItem value="all-routes">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <i className="i-ri-node-tree h-6 w-6" />
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
                  <OpenInVscode value={route.path}>
                    <button
                      className={cn('opacity-50 transition hover:opacity-75', { '!opacity-100': active })}
                      title={`Navigate to ${route.route}`}
                      onClick={() => {
                        messageClient.pushRoute(route.route)
                        setTimeout(() => {
                          mutate()
                        }, 300)
                      }}
                    >
                      <code>{route.route}</code>
                    </button>
                  </OpenInVscode>
                </Line>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
