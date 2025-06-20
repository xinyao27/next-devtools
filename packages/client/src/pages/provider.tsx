'use client'

import { getToolbarStatusBySize } from '@next-devtools/shared/types'
import { QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import posthog from 'posthog-js'
import { PostHogProvider, usePostHog } from 'posthog-js/react'
import React from 'react'
import { Outlet, useLocation } from 'react-router'

import MiniToolbar from '@/components/mini-toolbar'
import SideBar from '@/components/side-bar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getQueryClient } from '@/lib/client'
import { cn } from '@/lib/utils'
import { useInternalStore } from '@/store/internal'
import { useSettingsStore } from '@/store/settings'

import Initial from './initial'

interface Props {
  children: React.ReactNode
}

export function PostHogPageView() {
  const location = useLocation()
  const posthog = usePostHog()

  React.useEffect(() => {
    if (location && posthog) {
      const url = location.pathname
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [location, posthog])

  return null
}

export default function Provider() {
  if (typeof window !== 'undefined') {
    posthog.init('phc_un1VkX5BmxsipGXyq4ZRL95JCh564TZOreGUoqcdllA', {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: false,
    })
  }

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <TooltipProvider delayDuration={200}>
          <QueryClientProvider client={getQueryClient()}>
            <Toaster />
            <Initial />
            <PostHogPageView />

            <Main>
              <Outlet />
            </Main>
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </PostHogProvider>
  )
}
function Main({ children }: Props) {
  const uiScale = useSettingsStore((state) => state.uiScale)
  const sidebarCollapsed = useSettingsStore((state) => state.sidebarCollapsed)
  const toolbarPosition = useSettingsStore((state) => state.toolbarPosition)
  const toolbarSize = useSettingsStore((state) => state.toolbarSize)
  const serverReady = useInternalStore((state) => state.serverReady)
  const { resolvedTheme } = useTheme()

  const toolbarStatus = React.useMemo(
    () => getToolbarStatusBySize(toolbarSize, toolbarPosition),
    [toolbarSize, toolbarPosition],
  )

  React.useEffect(() => {
    const root = document.body
    if (!root) return
    root.style.fontSize = `${uiScale}px`
  }, [uiScale])

  React.useEffect(() => {
    const root = document.body
    if (!root || !resolvedTheme) return
    root.classList.remove(resolvedTheme === 'dark' ? 'light' : 'dark')
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  React.useEffect(() => {
    useSettingsStore.getState().setup()
  }, [])

  if (!serverReady) return null
  if (toolbarStatus === 'hide') return null
  if (toolbarStatus === 'mini') return <MiniToolbar />

  return (
    <main
      className={cn(
        'bg-sidebar grid h-full grid-cols-[3rem_1fr] overflow-hidden backdrop-blur-md transition-all md:grid-cols-[12rem_1fr]',
        {
          'grid-cols-[3rem_1fr]!': sidebarCollapsed === true,
          'grid-cols-[12rem_1fr]!': sidebarCollapsed === false,
        },
      )}
    >
      <SideBar />
      <div className="h-full overflow-hidden p-2 pl-0">
        <div className="h-full overflow-hidden rounded-lg border bg-white dark:bg-black">
          <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>
        </div>
      </div>
    </main>
  )
}
