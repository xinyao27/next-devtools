'use client'

import type { FrameMessageHandler } from '@next-devtools/shared/utils'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import { createFrameMessageHandler } from '@next-devtools/shared/utils'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { getSEOMetadata } from '../features/seo'
import Resizable from './lib/resizable'
import { useInternalStore } from './lib/use-internal-store'
import { useSettingsStore } from './lib/use-settings-store'

export function NextDevtoolsClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const latestPathname = React.useRef(pathname)
  latestPathname.current = pathname
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const { serverReady } = useInternalStore()

  React.useEffect(() => {
    const handler: FrameMessageHandler = {
      backRoute: async () => {
        router.back()
      },
      // routes
      getRoute: async () => latestPathname.current,
      // seo
      getSEOMetadata,

      pushRoute: async (href: string, options?: NavigateOptions) => {
        router.push(href, options)
      },
    }
    const unsubscribe = createFrameMessageHandler(handler, iframeRef)

    return () => {
      unsubscribe()
    }
  }, [iframeRef])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyD' && event.shiftKey && event.altKey) {
        useSettingsStore.getState().toggleToolbar()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!serverReady) return children

  return (
    <>
      <Resizable>
        <iframe
          ref={iframeRef}
          src={CLIENT_BASE_PATH}
          style={{
            border: 'none',
            display: 'block',
            height: '100%',
            pointerEvents: 'auto',
            width: '100%',
          }}
        />
      </Resizable>
      {children}
    </>
  )
}
