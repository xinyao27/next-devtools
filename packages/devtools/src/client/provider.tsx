'use client'

import React from 'react'
import { Frame } from './frame'

interface NextDevtoolsProviderProps {
  children: React.ReactNode
}
export function NextDevtoolsProvider({ children }: NextDevtoolsProviderProps) {
  return (
    <>
      <Frame />
      {children}
    </>
  )
}
