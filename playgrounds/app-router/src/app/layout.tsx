import localFont from 'next/font/local'
import { NextDevtoolsProvider } from '@next-devtools/core'
import type { Metadata } from 'next'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* <head>
        <script async src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextDevtoolsProvider>{children}</NextDevtoolsProvider>
      </body>
    </html>
  )
}
