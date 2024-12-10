'use client'

import { NavLink } from 'react-router'
import { useMedia } from 'react-use'
import { useShallow } from 'zustand/react/shallow'
import { Logo } from '@next-devtools/shared/components'
import { MINI_TOOLBAR_SIZE } from '@next-devtools/shared/types'
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
  const setToolbarSize = useSettingsStore((state) => state.setToolbarSize)
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

  function handleToggleToolbar() {
    setToolbarSize(MINI_TOOLBAR_SIZE)
  }

  return (
    <nav
      className={cn(
        'no-scrollbar h-full w-[3rem] overflow-y-auto overflow-x-hidden px-2 transition-all duration-200 md:w-[12rem]',
        { '!w-[3rem]': sidebarCollapsed === true },
        { '!w-[12rem]': sidebarCollapsed === false },
      )}
    >
      <div className="relative flex h-full flex-col">
        <section className="sticky top-0 z-10">
          <div
            className={cn(
              'bg-sidebar flex items-center justify-between overflow-hidden border-b pb-3 pt-4 transition-all duration-200',
              { 'px-3': sidebarCollapsed === false },
              { 'px-0': sidebarCollapsed === true },
            )}
          >
            <div className="flex h-5 w-full items-center font-medium transition-all duration-200">
              <Logo
                className={cn('absolute size-5 flex-none transition-all duration-200', {
                  'left-1.5': sidebarCollapsed === true,
                  'left-3': sidebarCollapsed === false,
                })}
              />

              <span
                className={cn(
                  'text-lg font-medium transition-all duration-200',
                  { 'w-0 flex-none opacity-0': sidebarCollapsed === true },
                  { 'w-full flex-1 pl-7 opacity-100': sidebarCollapsed === false },
                )}
              >
                Devtools
              </span>
            </div>
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
                          '!px-0': sidebarCollapsed === true,
                          '!px-3': sidebarCollapsed === false,
                        },
                      )}
                    >
                      <i
                        className={cn(
                          item.icon,
                          'group-hover:text-primary absolute left-1.5 size-5 flex-none transition-all duration-200 md:left-3',
                          {
                            '!left-1.5': sidebarCollapsed === true,
                            '!left-3': sidebarCollapsed === false,
                          },
                        )}
                      />
                      <div
                        className={cn(
                          'group-hover:text-primary w-0 text-left opacity-0 transition-all duration-200 md:w-full md:pl-7 md:opacity-100',
                          { '!w-0 !opacity-0': sidebarCollapsed === true },
                          { '!w-full !pl-7 !opacity-100': sidebarCollapsed === false },
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
                  '!hidden': sidebarCollapsed === false,
                  '!inline-block': sidebarCollapsed === true,
                })}
              >
                <div>{item.label}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </section>

        <div className="bg-sidebar sticky bottom-0 z-10 w-full pb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full border-t" variant="ghost">
                <i className="i-ri-more-line size-5 flex-none" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-0" side="right">
              <div className="flex flex-col gap-2 px-4 py-3">
                <div className="grid grid-cols-3 gap-1">
                  {/* toggle sidebar */}
                  <Button size="sm" variant="outline" onClick={handleToggleSideBar}>
                    <i
                      className={cn('i-ri-sidebar-unfold-line md:i-ri-sidebar-fold-line !h-5 !w-5', {
                        '!i-ri-sidebar-unfold-line': sidebarCollapsed === true,
                        '!i-ri-sidebar-fold-line': sidebarCollapsed === false,
                      })}
                    />
                    <span className="ml-2">{sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar</span>
                  </Button>

                  {/* theme toggle */}
                  <ThemeToggle />

                  {/* exit fullscreen */}
                  <Button size="sm" variant="outline" onClick={handleToggleToolbar}>
                    <i className="i-ri-fullscreen-exit-line size-4" />
                    <span className="ml-2">Exit Fullscreen</span>
                  </Button>
                </div>

                <Separator />

                <ToolbarPositionToggle />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  )
}
