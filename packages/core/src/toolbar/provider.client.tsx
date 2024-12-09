'use client'

import React from 'react'
import Frame from './frame.client'
import { useInternalStore } from './internal.store'

import './styles.css'

interface NextDevtoolsClientProviderProps {
  children: React.ReactNode
}
export function NextDevtoolsClientProvider({ children }: NextDevtoolsClientProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const serverReady = useInternalStore((state) => state.serverReady)

  React.useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  if (serverReady && isMounted === true) {
    return (
      <React.Suspense>
        <Frame />
        {children}
      </React.Suspense>
    )
  }

  return children
}
