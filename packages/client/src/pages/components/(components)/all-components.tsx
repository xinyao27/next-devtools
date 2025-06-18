'use client'

import type { Component } from '@next-devtools/shared/types'

import { prettySize } from '@next-devtools/shared/utils'
import React from 'react'

import OpenInEditor from '@/components/open-in-editor'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import TagComponent from './tag-component'

interface Props {
  data?: Component[]
}
export default function AllComponents({ data }: Props) {
  return (
    <Accordion type="multiple">
      {data?.map((component) => {
        const key = component.publicPath || component.filePath || component.file
        return (
          <AccordionItem
            key={key}
            value={key}
          >
            <AccordionTrigger className="py-2">
              <div className="flex flex-1 items-center gap-2">
                <div className="flex-1 truncate text-left [direction:rtl]">{key}</div>
                <span className="pr-2 text-[10px] opacity-60">{prettySize(component.size)}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2">
                <OpenInEditor
                  className="flex flex-wrap gap-2"
                  value={component.filePath}
                >
                  {component.documentations.map((doc) => (
                    <TagComponent key={doc.displayName}>{doc.displayName}</TagComponent>
                  ))}
                </OpenInEditor>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
