'use client'

import React from 'react'
import { Toolbar } from '@next-devtools/client'
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

  if (isMounted === true) {
    return (
      <React.Suspense>
        <Toolbar {...contextValue} />

        {children}
      </React.Suspense>
    )
  }

  return children
}
