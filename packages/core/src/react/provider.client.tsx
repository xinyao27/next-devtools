'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createFrameMessageHandler } from '@next-devtools/shared/utils'
import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import { getSEOMetadata } from '../features/seo'
import { useSettingsStore } from './lib/use-settings-store'
import { useInternalStore } from './lib/use-internal-store'
import Resizable from './lib/resizable'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { FrameMessageHandler } from '@next-devtools/shared/utils'

export function NextDevtoolsClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const latestPathname = React.useRef(pathname)
  latestPathname.current = pathname
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const { serverReady } = useInternalStore()

  React.useEffect(() => {
    const handler: FrameMessageHandler = {
      // routes
      getRoute: async () => latestPathname.current,
      pushRoute: async (href: string, options?: NavigateOptions) => {
        router.push(href, options)
      },
      backRoute: async () => {
        router.back()
      },

      // seo
      getSEOMetadata,
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
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'auto',
            border: 'none',
          }}
        />
      </Resizable>
      {children}
    </>
  )
}
