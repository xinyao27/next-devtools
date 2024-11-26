'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Env } from '@next-devtools/shared/types'
import './react-json-view.css'

const ReactJson = dynamic(() => import('@microlink/react-json-view'), { ssr: false })

interface Props {
  data?: Env
}
export default function AllEnvs({ data }: Props) {
  const { theme } = useTheme()

  return (
    <Accordion defaultValue={['public-envs']} type="multiple">
      <AccordionItem value="public-envs">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <i className="i-ri-file-3-line size-6" />
            <div className="text-left">
              <div>Public Runtime Environments</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="py-4">
            {data?.publicEnv ? (
              <ReactJson
                name={false}
                src={data.publicEnv}
                theme={theme === 'dark' ? 'grayscale' : 'grayscale:inverted'}
              />
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="private-envs">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <i className="i-ri-file-shield-2-line size-6" />
            <div className="text-left">
              <div>Private Runtime Environments</div>
              <div className="opacity-50">These values are not exposed to the client. Readonly in the DevTools.</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="overflow-hidden">
          <div className="overflow-hidden py-4">
            {data?.privateEnv ? (
              <ReactJson
                name={false}
                src={data.privateEnv}
                theme={theme === 'dark' ? 'grayscale' : 'grayscale:inverted'}
              />
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
