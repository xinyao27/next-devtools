import '@/styles/globals.css'

import { NextDevtoolsProvider } from '@next-devtools/core'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextDevtoolsProvider>
      <Component {...pageProps} />
    </NextDevtoolsProvider>
  )
}
