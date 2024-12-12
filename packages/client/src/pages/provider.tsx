'use client'

import React from 'react'
import { Outlet } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { getToolbarStatusBySize } from '@next-devtools/shared/types'
import { ThemeProvider } from '@/components/theme-provider'
import SideBar from '@/components/side-bar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { useSettingsStore } from '@/store/settings'
import { cn } from '@/lib/utils'
import { getQueryClient } from '@/lib/client'
import MiniToolbar from '@/components/mini-toolbar'
import { useInternalStore } from '@/store/internal'
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
  const uiScale = useSettingsStore((state) => state.uiScale)
  const sidebarCollapsed = useSettingsStore((state) => state.sidebarCollapsed)
  const toolbarPosition = useSettingsStore((state) => state.toolbarPosition)
  const toolbarSize = useSettingsStore((state) => state.toolbarSize)
  const serverReady = useInternalStore((state) => state.serverReady)

  const toolbarStatus = React.useMemo(
    () => getToolbarStatusBySize(toolbarSize, toolbarPosition),
    [toolbarSize, toolbarPosition],
  )

  React.useEffect(() => {
    document.documentElement.style.fontSize = `${uiScale}px`
  }, [uiScale])

  if (!serverReady) return null
  if (toolbarStatus === 'hide') return null
  if (toolbarStatus === 'mini') return <MiniToolbar />

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
      <div className="h-screen overflow-hidden p-2 pl-0">
        <div className="h-full overflow-hidden rounded-lg border bg-white dark:bg-black">
          <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>
        </div>
      </div>
    </main>
  )
}
