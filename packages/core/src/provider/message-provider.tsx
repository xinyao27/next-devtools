'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createFrameMessageHandler } from '@next-devtools/shared'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { FrameMessageHandler } from '@next-devtools/shared'

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
      getRoute: () => latestPathname.current,
      pushRoute: (href: string, options?: NavigateOptions) => {
        router.push(href, options)
      },
      backRoute: () => {
        router.back()
      },
    }
    createFrameMessageHandler(handler, iframeRef)
  }, [])

  return <>{children}</>
}
