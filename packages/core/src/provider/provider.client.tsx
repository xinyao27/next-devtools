'use client'

import React from 'react'
import Frame from './frame.client'

import './styles.css'

interface NextDevtoolsClientProviderProps {
  children: React.ReactNode
}
export function NextDevtoolsClientProvider({ children }: NextDevtoolsClientProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  if (isMounted === true) {
    return (
      <React.Suspense>
        <Frame />
        {children}
      </React.Suspense>
    )
  }

  return children
}
