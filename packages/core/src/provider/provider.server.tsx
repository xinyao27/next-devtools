'use server'

import { patchFetch } from '../features/network'
import { isDev } from '../utils'
import { NextDevtoolsClientProvider } from './provider.client'

interface NextDevtoolsServerProviderProps {
  children: React.ReactNode
}
export async function NextDevtoolsServerProvider({ children }: NextDevtoolsServerProviderProps) {
  if (isDev) {
    const originalFetch = globalThis.fetch
    // @ts-expect-error: TODO
    globalThis.fetch = patchFetch(originalFetch)

    return <NextDevtoolsClientProvider>{children}</NextDevtoolsClientProvider>
  }

  return children
}
