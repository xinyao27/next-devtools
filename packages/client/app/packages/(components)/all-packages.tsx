'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import PackageItem from './package-item'
import type { Package } from '@next-devtools/shared'

interface Props {
  data?: Package[]
}
export default function AllPackages({ data }: Props) {
  return (
    <Accordion collapsible defaultValue="all-packages" type="single">
      <AccordionItem value="all-packages">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <i className="i-ri-box-3-line w-6 h-6" />
            <div className="text-left">
              <div>All Packages</div>
              <div className="opacity-50">{data?.length} packages installed in your application</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4 py-2">
            {data?.map((pkg) => <PackageItem key={pkg.name} data={pkg} />)}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
