'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Line from '@/components/line'
import OpenInVscode from '@/components/open-in-vscode'
import TagComponent from './tag-component'
import type { Component } from '@next-devtools/shared'

interface Props {
  data?: Component[]
}
export default function AllComponents({ data }: Props) {
  return (
    <Accordion collapsible defaultValue="all-components" type="single">
      <AccordionItem value="all-components">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <i className="i-ri-box-1-line w-6 h-6" />
            <div className="text-left">
              <div>All Components</div>
              <div className="opacity-50">{data?.length} components registered in your application</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div>
            {data?.map((component) => {
              return (
                <Line key={component.file}>
                  <OpenInVscode value={component.filePath}>
                    <button
                      className="opacity-50 hover:opacity-75 hover:text-primary transition"
                      title={component.filePath}
                    >
                      <TagComponent>{component.displayName}</TagComponent>
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
