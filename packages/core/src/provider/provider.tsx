'use client'

import React from 'react'
import Frame from './frame'
import './styles.css'

interface NextDevtoolsProviderProps {
  children: React.ReactNode
}
export function NextDevtoolsProvider({ children }: NextDevtoolsProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  if (process.env.NODE_ENV === 'development' && isMounted === true) {
    return (
      <React.Suspense>
        <Frame />
        {children}
      </React.Suspense>
    )
  }

  return <>{children}</>
}
