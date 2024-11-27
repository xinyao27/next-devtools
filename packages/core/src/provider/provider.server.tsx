'use server'

import { isDev } from '../utils'
import { NextDevtoolsClientProvider } from './provider.client'

interface NextDevtoolsServerProviderProps {
  children: React.ReactNode
}
export async function NextDevtoolsServerProvider({ children }: NextDevtoolsServerProviderProps) {
  if (isDev) {
    const { patchFetch } = await import('../features/network')
    const originalFetch = globalThis.fetch
    // @ts-expect-error - TODO: fix this
    globalThis.fetch = patchFetch(originalFetch)

    return <NextDevtoolsClientProvider>{children}</NextDevtoolsClientProvider>
  }

  return children
}
