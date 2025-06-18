import '@/styles/globals.css'

import type { AppProps } from 'next/app'

import { NextDevtoolsProvider } from '@next-devtools/core'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextDevtoolsProvider>
      <Component {...pageProps} />
    </NextDevtoolsProvider>
  )
}
