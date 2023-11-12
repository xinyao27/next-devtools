import '@/styles/globals.css'
import { NextDevtoolsProvider } from '@next-devtools/core'

export default function App({ Component, pageProps }) {
  return <NextDevtoolsProvider><Component {...pageProps} /></NextDevtoolsProvider>
}
