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
  const nabBarSnap = useSnapshot(navBarStore)

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
              'grid grid-cols-[50px_1fr] md:grid-cols-[180px_1fr] h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900',
              {
                '!grid-cols-[50px_1fr]': nabBarSnap.collapsed === true,
                '!grid-cols-[180px_1fr]': nabBarSnap.collapsed === false,
              },
            )}
          >
            <SideBar />
            <div className="h-screen p-2 pl-0">
              <div className="h-full rounded-lg shadow-md dark:shadow-[0_0_10px_1px] dark:shadow-accent bg-white dark:bg-black overflow-hidden">
                <div className="h-full overflow-x-hidden overflow-y-auto">{children}</div>
              </div>
            </div>
          </main>
        </SWRConfig>
      </TooltipProvider>
    </ThemeProvider>
  )
}
