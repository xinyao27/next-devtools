'use client'

import { NavLink } from 'react-router'
import { useMedia } from 'react-use'
import { useShallow } from 'zustand/react/shallow'
import Logo from '@/components/logo'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/store/settings'
import { ToolbarPositionToggle } from '@/pages/settings/(components)/toolbar-position'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'

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
    value: 'network',
    label: 'Network',
    link: '/network',
    icon: 'i-ri-earth-line',
  },
  {
    value: 'seo',
    label: 'SEO',
    link: '/seo',
    icon: 'i-ri-seo-line',
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
  const setSettings = useSettingsStore((state) => state.setState)
  const isMobile = useMedia('(max-width: 768px)')

  function handleToggleSideBar() {
    if (isMobile) {
      if (sidebarCollapsed !== undefined) setSettings({ sidebarCollapsed: !sidebarCollapsed })
      else setSettings({ sidebarCollapsed: false })
    } else {
      if (sidebarCollapsed !== undefined) setSettings({ sidebarCollapsed: !sidebarCollapsed })
      else setSettings({ sidebarCollapsed: true })
    }
  }

  return (
    <nav
      className={cn(
        'no-scrollbar h-full w-[3rem] overflow-y-auto overflow-x-hidden px-2 transition-all duration-200 md:w-[12rem]',
        { '!w-[3rem]': !!sidebarCollapsed },
        { '!w-[12rem]': !sidebarCollapsed },
      )}
    >
      <div className="relative flex h-full flex-col">
        <section className="sticky top-0 z-10">
          <div className="bg-sidebar flex items-center justify-between overflow-hidden border-b py-2 transition-all duration-200">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex w-full items-center hover:bg-zinc-500/10" size="sm" variant="ghost">
                  <Logo
                    className={cn('absolute size-5 flex-none transition-all duration-200', {
                      'left-1.5': !!sidebarCollapsed,
                      'left-3': !sidebarCollapsed,
                    })}
                  />

                  <span
                    className={cn(
                      'text-left text-lg font-medium transition-all duration-200',
                      { 'w-0 flex-none opacity-0': !!sidebarCollapsed },
                      { 'w-full flex-1 pl-7 opacity-100': !sidebarCollapsed },
                    )}
                  >
                    Devtools
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0">
                <div className="flex w-[300px] flex-col gap-2 px-4 py-3 md:w-[450px]">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {/* toggle sidebar */}
                    <Button size="sm" variant="outline" onClick={handleToggleSideBar}>
                      <i
                        className={cn('i-ri-sidebar-unfold-line md:i-ri-sidebar-fold-line !h-5 !w-5 flex-none', {
                          '!i-ri-sidebar-unfold-line': !!sidebarCollapsed,
                          '!i-ri-sidebar-fold-line': !sidebarCollapsed,
                        })}
                      />
                      <span className="ml-2">{sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar</span>
                    </Button>

                    {/* theme toggle */}
                    <ThemeToggle />

                    {/* exit fullscreen */}
                    <Button size="sm" variant="outline" onClick={useSettingsStore.getState().toggleToolbar}>
                      <i className="i-ri-fullscreen-exit-line size-5 flex-none" />
                      <span className="ml-2">Exit Fullscreen</span>
                    </Button>
                  </div>

                  <Separator />

                  <ToolbarPositionToggle />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-1 py-1.5">
          {menuItems.map((item) => (
            <Tooltip key={item.value}>
              <TooltipTrigger asChild>
                <NavLink to={item.link}>
                  {({ isActive }) => (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        'group relative flex w-full overflow-hidden px-0 opacity-50 transition-all duration-200 hover:bg-zinc-500/10 md:px-3',
                        {
                          'text-primary bg-secondary opacity-100': isActive,
                          '!px-0': !!sidebarCollapsed,
                          '!px-3': !sidebarCollapsed,
                        },
                      )}
                    >
                      <i
                        className={cn(
                          item.icon,
                          'group-hover:text-primary absolute left-1.5 size-5 flex-none transition-all duration-200 md:left-3',
                          {
                            '!left-1.5': !!sidebarCollapsed,
                            '!left-3': !sidebarCollapsed,
                          },
                        )}
                      />
                      <div
                        className={cn(
                          'group-hover:text-primary w-0 text-left opacity-0 transition-all duration-200 md:w-full md:pl-7 md:opacity-100',
                          { '!w-0 !opacity-0': !!sidebarCollapsed },
                          { '!w-full !pl-7 !opacity-100': !sidebarCollapsed },
                        )}
                      >
                        {item.label}
                      </div>
                    </Button>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={cn('md:hidden', {
                  '!hidden': !sidebarCollapsed,
                  '!inline-block': !!sidebarCollapsed,
                })}
              >
                <div>{item.label}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </section>
      </div>
    </nav>
  )
}
