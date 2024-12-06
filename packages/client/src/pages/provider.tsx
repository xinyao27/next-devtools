'use client'

import React, { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Outlet } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import SideBar from '@/components/side-bar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { useSettingsStore } from '@/store/settings'
import { cn } from '@/lib/utils'
import { getQueryClient } from '@/lib/client'
import Initial from './initial'

export default function Provider() {
  return (
    <ThemeProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system">
      <TooltipProvider delayDuration={200}>
        <QueryClientProvider client={getQueryClient()}>
          <Toaster />
          <Initial />

          <Main>
            <Outlet />
          </Main>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

interface Props {
  children: React.ReactNode
}
function Main({ children }: Props) {
  const { uiScale, sidebarCollapsed } = useSettingsStore(
    useShallow((state) => ({
      uiScale: state.uiScale,
      sidebarCollapsed: state.sidebarCollapsed,
    })),
  )

  useEffect(() => {
    document.documentElement.style.fontSize = `${uiScale}px`
  }, [uiScale])

  return (
    <main
      className={cn(
        'bg-sidebar grid h-screen grid-cols-[3rem_1fr] overflow-hidden backdrop-blur-md transition-all duration-300 md:grid-cols-[12rem_1fr]',
        {
          '!grid-cols-[3rem_1fr]': sidebarCollapsed === true,
          '!grid-cols-[12rem_1fr]': sidebarCollapsed === false,
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
  )
}
