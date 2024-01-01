'use client'

import React from 'react'
import { Frame } from './frame'

interface NextDevtoolsProviderProps {
  children: React.ReactNode
}
export function NextDevtoolsProvider({ children }: NextDevtoolsProviderProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <>
        <Frame />
        {children}
      </>
    )
  }

  return children
}
