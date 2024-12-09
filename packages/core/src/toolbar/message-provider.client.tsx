'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createFrameMessageHandler } from '@next-devtools/shared/utils'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { FrameMessageHandler } from '@next-devtools/shared/utils'

interface Props {
  children: React.ReactNode
  iframeRef: React.RefObject<HTMLIFrameElement>
}
export function MessageProvider({ children, iframeRef }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const latestPathname = React.useRef(pathname)
  latestPathname.current = pathname

  React.useEffect(() => {
    const handler: FrameMessageHandler = {
      getRoute: async () => latestPathname.current,
      pushRoute: async (href: string, options?: NavigateOptions) => {
        router.push(href, options)
      },
      backRoute: async () => {
        router.back()
      },
    }
    const unsubscribe = createFrameMessageHandler(handler, iframeRef)

    return () => {
      unsubscribe()
    }
  }, [iframeRef])

  return <>{children}</>
}
