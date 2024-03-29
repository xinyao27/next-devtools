import { Inter } from 'next/font/google'
import { NextDevtoolsProvider } from '@next-devtools/core'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextDevtoolsProvider>{children}</NextDevtoolsProvider>
      </body>
    </html>
  )
}
