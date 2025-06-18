'use client'

import { NavLink } from 'react-router'
import { useMedia } from 'react-use'
import { useShallow } from 'zustand/react/shallow'

import Logo from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ToolbarPositionToggle } from '@/pages/settings/(components)/toolbar-position'
import { useSettingsStore } from '@/store/settings'

const menuItems = [
  {
    icon: 'i-ri-information-line',
    label: 'Overview',
    link: '/overview',
    value: 'overview',
  },
  {
    icon: 'i-ri-node-tree',
    label: 'Routes',
    link: '/routes',
    value: 'routes',
  },
  {
    icon: 'i-ri-box-1-line',
    label: 'Components',
    link: '/components',
    value: 'components',
  },
  {
    icon: 'i-ri-gallery-line',
    label: 'Assets',
    link: '/assets',
    value: 'assets',
  },
  {
    icon: 'i-ri-box-3-line',
    label: 'Packages',
    link: '/packages',
    value: 'packages',
  },
  {
    icon: 'i-ri-shapes-line',
    label: 'Envs',
    link: '/envs',
    value: 'envs',
  },
  {
    icon: 'i-ri-earth-line',
    label: 'Network',
    link: '/network',
    value: 'network',
  },
  {
    icon: 'i-ri-seo-line',
    label: 'SEO',
    link: '/seo',
    value: 'seo',
  },
  {
    icon: 'i-ri-terminal-box-line',
    label: 'Terminal',
    link: '/terminal',
    value: 'terminal',
  },
  {
    icon: 'i-ri-pie-chart-box-line',
    label: 'Bundle Analyzer',
    link: '/bundle-analyzer',
    value: 'bundle-analyzer',
  },
  {
    icon: 'i-ri-settings-6-line',
    label: 'Settings',
    link: '/settings',
    value: 'settings',
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
        'no-scrollbar h-full w-12 overflow-y-auto overflow-x-hidden px-2 transition-all duration-200 md:w-48',
        { 'w-12!': !!sidebarCollapsed },
        { 'w-48!': !sidebarCollapsed },
      )}
    >
      <div className="relative flex h-full flex-col">
        <section className="sticky top-0 z-10">
          <div className="bg-sidebar flex items-center justify-between overflow-hidden border-b py-2 transition-all duration-200">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="flex w-full items-center hover:bg-zinc-500/10"
                  size="sm"
                  variant="ghost"
                >
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
              <PopoverContent
                align="end"
                className="w-[300px] p-0 md:w-[450px]"
              >
                <div className="flex flex-col gap-2 px-4 py-3">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {/* toggle sidebar */}
                    <Button
                      onClick={handleToggleSideBar}
                      size="sm"
                      variant="outline"
                    >
                      <i
                        className={cn('i-ri-sidebar-unfold-line md:i-ri-sidebar-fold-line h-5! w-5! flex-none', {
                          '!i-ri-sidebar-fold-line': !sidebarCollapsed,
                          '!i-ri-sidebar-unfold-line': !!sidebarCollapsed,
                        })}
                      />
                      <span className="ml-2">{sidebarCollapsed ? 'Expand' : 'Collapse'}</span>
                    </Button>

                    {/* theme toggle */}
                    <ThemeToggle />

                    {/* exit fullscreen */}
                    <Button
                      onClick={useSettingsStore.getState().toggleToolbar}
                      size="sm"
                      variant="outline"
                    >
                      <i className="i-ri-fullscreen-exit-line size-5 flex-none" />
                      <span className="ml-2">Minimize</span>
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
                      className={cn(
                        'group relative flex w-full overflow-hidden px-0 opacity-50 transition-all duration-200 hover:bg-zinc-500/10 md:px-3',
                        {
                          'px-0!': !!sidebarCollapsed,
                          'px-3!': !sidebarCollapsed,
                          'text-primary bg-secondary opacity-100': isActive,
                        },
                      )}
                      size="sm"
                      variant="ghost"
                    >
                      <i
                        className={cn(
                          item.icon,
                          'group-hover:text-primary absolute left-1.5 size-5 flex-none transition-all duration-200 md:left-3',
                          {
                            'left-1.5!': !!sidebarCollapsed,
                            'left-3!': !sidebarCollapsed,
                          },
                        )}
                      />
                      <div
                        className={cn(
                          'group-hover:text-primary w-0 text-left opacity-0 transition-all duration-200 md:w-full md:pl-7 md:opacity-100',
                          { 'w-0! opacity-0!': !!sidebarCollapsed },
                          { 'w-full! pl-7! opacity-100!': !sidebarCollapsed },
                        )}
                      >
                        {item.label}
                      </div>
                    </Button>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent
                className={cn('md:hidden', {
                  'hidden!': !sidebarCollapsed,
                  'inline-block!': !!sidebarCollapsed,
                })}
                side="right"
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
