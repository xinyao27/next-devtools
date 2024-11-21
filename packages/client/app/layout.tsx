import React from 'react'
import Provider from './provider'
import './globals.css'

interface Props {
  children: React.ReactNode
}
export default function RootLayout({ children }: Props) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
