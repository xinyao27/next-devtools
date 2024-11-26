'use client'

import React from 'react'
import { isDev } from '../utils'
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

  if (isDev && isMounted === true) {
    return (
      <React.Suspense>
        <Frame />
        {children}
      </React.Suspense>
    )
  }

  return <React.Fragment>{children}</React.Fragment>
}
