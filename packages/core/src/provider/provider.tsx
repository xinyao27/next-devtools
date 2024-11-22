'use client'

import React from 'react'
import Frame from './frame'
import './styles.css'

interface NextDevtoolsProviderProps {
  children: React.ReactNode
}
export function NextDevtoolsProvider({ children }: NextDevtoolsProviderProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <React.Suspense>
        <Frame />
        {children}
      </React.Suspense>
    )
  }

  return <>{children}</>
}
