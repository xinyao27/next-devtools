'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createFrameMessageHandler } from '@next-devtools/shared/utils'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { FrameMessageHandler, FrameStatus } from '@next-devtools/shared/utils'

interface Props {
  children: React.ReactNode
  iframeRef: React.RefObject<HTMLIFrameElement>
  setFrameStatus: React.Dispatch<React.SetStateAction<FrameStatus>>
}
export function MessageProvider({ children, iframeRef, setFrameStatus }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const latestPathname = React.useRef(pathname)
  latestPathname.current = pathname

  React.useEffect(() => {
    const handler: FrameMessageHandler = {
      toggle: async (status) => {
        setFrameStatus(status)
      },
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
  }, [iframeRef, setFrameStatus])

  return <>{children}</>
}
