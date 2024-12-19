import React from 'react'
import type { SEOMetadata } from '../types'

export interface NextDevtoolsContextValue {
  // routes
  getRoute: () => string
  pushRoute: (href: string) => void
  backRoute: (href: string) => void
  // seo
  getSEOMetadata: (route?: string) => Promise<SEOMetadata>
}

export const NextDevtoolsContext = React.createContext<NextDevtoolsContextValue>({} as NextDevtoolsContextValue)
