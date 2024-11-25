'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMedia } from 'react-use'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSettingsStore } from '@/store/settings'
import { ThemeToggle } from './theme-toggle'

const menuItems = [
  {
    value: 'overview',
    label: 'Overview',
    link: '/overview',
    icon: 'i-ri-information-line',
  },
  {
    value: 'routes',
    label: 'Routes',
    link: '/routes',
    icon: 'i-ri-node-tree',
  },
  {
    value: 'components',
    label: 'Components',
    link: '/components',
    icon: 'i-ri-box-1-line',
  },
  {
    value: 'assets',
    label: 'Assets',
    link: '/assets',
    icon: 'i-ri-gallery-line',
  },
  {
    value: 'packages',
    label: 'Packages',
    link: '/packages',
    icon: 'i-ri-box-3-line',
  },
  {
    value: 'envs',
    label: 'Envs',
    link: '/envs',
    icon: 'i-ri-shapes-line',
  },
  {
    value: 'terminal',
    label: 'Terminal',
    link: '/terminal',
    icon: 'i-ri-terminal-box-line',
  },
  {
    value: 'bundle-analyzer',
    label: 'Bundle Analyzer',
    link: '/bundle-analyzer',
    icon: 'i-ri-pie-chart-box-line',
  },
  {
    value: 'settings',
    label: 'Settings',
    link: '/settings',
    icon: 'i-ri-settings-6-line',
  },
]

export default function SideBar() {
  const sidebarCollapsed = useSettingsStore(useShallow((state) => state.sidebarCollapsed))
  const pathname = usePathname()
  const isMobile = useMedia('(max-width: 768px)')

  function handleToggleSideBar() {
    if (isMobile) {
      if (sidebarCollapsed !== undefined) useSettingsStore.setState({ sidebarCollapsed: !sidebarCollapsed })
      else useSettingsStore.setState({ sidebarCollapsed: false })
    } else {
      if (sidebarCollapsed !== undefined) useSettingsStore.setState({ sidebarCollapsed: !sidebarCollapsed })
      else useSettingsStore.setState({ sidebarCollapsed: true })
    }
  }

  return (
    <nav
      className={cn(
        'h-full w-[3rem] overflow-y-auto overflow-x-hidden transition-all duration-200 md:w-[12rem]',
        { '!w-[3rem]': sidebarCollapsed === true },
        { '!w-[12rem]': sidebarCollapsed === false },
      )}
    >
      <div className="flex h-full flex-col space-y-2 p-2">
        <section className="flex flex-1 flex-col gap-1">
          {menuItems.map((item) => (
            <Tooltip key={item.value}>
              <TooltipTrigger asChild>
                <Link
                  href={item.link}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'hover:text-primary group relative overflow-hidden px-0 opacity-50 transition-all duration-200 hover:bg-zinc-500/10 md:px-3',
                    {
                      'text-primary bg-secondary opacity-100': pathname.startsWith(item.link),
                      '!px-0': sidebarCollapsed === true,
                      '!px-3': sidebarCollapsed === false,
                    },
                  )}
                >
                  <i
                    className={cn(
                      item.icon,
                      'absolute left-1.5 size-5 flex-none transition-all duration-200 md:left-3',
                      {
                        '!left-1.5': sidebarCollapsed === true,
                        '!left-3': sidebarCollapsed === false,
                      },
                    )}
                  />
                  <div
                    className={cn(
                      'w-0 opacity-0 transition-all duration-200 md:w-full md:pl-7 md:opacity-100',
                      { '!w-0 !opacity-0': sidebarCollapsed === true },
                      { '!w-full !pl-7 !opacity-100': sidebarCollapsed === false },
                    )}
                  >
                    {item.label}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={cn('md:hidden', {
                  '!hidden': sidebarCollapsed === false,
                  '!inline-block': sidebarCollapsed === true,
                })}
              >
                <div>{item.label}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </section>

        <Separator />

        <section
          className={cn(
            'flex flex-col-reverse items-center justify-between gap-1 px-1.5 transition-all duration-200 md:flex-row',
            {
              '!flex-col-reverse': sidebarCollapsed === true,
              '!flex-row': sidebarCollapsed === false,
            },
          )}
        >
          <Button
            className="opacity-50 transition hover:opacity-100"
            size="icon"
            variant="ghost"
            onClick={handleToggleSideBar}
          >
            <i
              className={cn('i-ri-sidebar-unfold-line md:i-ri-sidebar-fold-line !h-5 !w-5', {
                '!i-ri-sidebar-unfold-line': sidebarCollapsed === true,
                '!i-ri-sidebar-fold-line': sidebarCollapsed === false,
              })}
            />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <ThemeToggle />
        </section>
      </div>
    </nav>
  )
}
