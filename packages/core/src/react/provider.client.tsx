'use client'

import React from 'react'
import { renderToolbar } from '@next-devtools/client'
import { usePathname, useRouter } from 'next/navigation'
import { getSEOMetadata } from '../features/seo'
import type { NextDevtoolsContextValue } from '@next-devtools/shared/context'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface NextDevtoolsClientProviderProps {
  children: React.ReactNode
}
export function NextDevtoolsClientProvider({ children }: NextDevtoolsClientProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const latestPathname = React.useRef(pathname)
  latestPathname.current = pathname
  const target = React.useRef<HTMLDivElement>(null)

  const contextValue = React.useMemo<NextDevtoolsContextValue>(() => {
    return {
      // routes
      getRoute: () => latestPathname.current,
      pushRoute: (href: string, options?: NavigateOptions) => {
        router.push(href, options)
      },
      backRoute: () => {
        router.back()
      },

      // seo
      getSEOMetadata,
    }
  }, [latestPathname])

  React.useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted && target.current) {
      renderToolbar(contextValue, target.current)
    }
  }, [isMounted, contextValue])

  if (isMounted === true) {
    return (
      <React.Suspense>
        <div ref={target} id="next-devtools-toolbar" style={{ zIndex: 2147483645 }} />

        {children}
      </React.Suspense>
    )
  }

  return children
}
