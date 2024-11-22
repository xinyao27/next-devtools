'use client'

import React from 'react'
import { SWRConfig } from 'swr'
import { useSnapshot } from 'valtio'
import { ThemeProvider } from '@/components/theme-provider'
import SideBar from '@/components/side-bar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { navBarStore } from '@/store'
import { cn } from '@/lib/utils'
import Initial from './initial'

interface Props {
  children: React.ReactNode
}
export default function Provider({ children }: Props) {
  const navBarSnap = useSnapshot(navBarStore)

  return (
    <ThemeProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system">
      <TooltipProvider delayDuration={200}>
        <SWRConfig
          value={{
            refreshInterval: 3000,
            fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
          }}
        >
          <Toaster />
          <Initial />
          <main
            className={cn(
              'grid h-screen grid-cols-[50px_1fr] overflow-hidden bg-neutral-50/80 backdrop-blur-md md:grid-cols-[180px_1fr] dark:bg-neutral-900/80',
              {
                '!grid-cols-[50px_1fr]': navBarSnap.collapsed === true,
                '!grid-cols-[180px_1fr]': navBarSnap.collapsed === false,
              },
            )}
          >
            <SideBar />
            <div className="h-screen p-2 pl-0">
              <div className="dark:shadow-accent h-full overflow-hidden rounded-lg bg-white shadow-md dark:bg-black dark:shadow-[0_0_10px_1px]">
                <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>
              </div>
            </div>
          </main>
        </SWRConfig>
      </TooltipProvider>
    </ThemeProvider>
  )
}
