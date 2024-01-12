'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSnapshot } from 'valtio'
import { useMedia } from 'react-use'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { navBarStore } from '@/store'
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
]

export default function SideBar() {
  const navBarSnap = useSnapshot(navBarStore)
  const pathname = usePathname()
  const isMobile = useMedia('(max-width: 768px)')

  function handleToggleSideBar() {
    if (isMobile) {
      if (navBarStore.collapsed !== undefined) navBarStore.collapsed = !navBarStore.collapsed
      else navBarStore.collapsed = false
    } else {
      if (navBarStore.collapsed !== undefined) navBarStore.collapsed = !navBarStore.collapsed
      else navBarStore.collapsed = true
    }
  }

  return (
    <nav
      className={cn(
        'w-[50px] md:w-[180px] h-full overflow-x-hidden overflow-y-auto transition-all',
        { '!w-[50px]': navBarSnap.collapsed === true },
        { '!w-[180px]': navBarSnap.collapsed === false },
      )}
    >
      <div className="p-2 space-y-2 flex flex-col h-full">
        <section className="flex flex-col gap-1 flex-1">
          {menuItems.map((item) => (
            <Tooltip key={item.value}>
              <TooltipTrigger asChild>
                <Link
                  href={item.link}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'space-x-2 justify-center md:justify-start opacity-50 transition px-0 md:px-3',
                    {
                      'text-primary opacity-100 bg-accent': pathname.startsWith(item.link),
                      '!justify-center !px-0': navBarSnap.collapsed === true,
                      '!justify-start !px-3': navBarSnap.collapsed === false,
                    },
                  )}
                >
                  <i className={cn(item.icon, 'w-5 h-5')} />
                  <span
                    className={cn(
                      'hidden md:inline-block',
                      { '!hidden': navBarSnap.collapsed === true },
                      { '!inline-block': navBarSnap.collapsed === false },
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent asChild side="right">
                <p
                  className={cn('md:hidden', {
                    '!hidden': navBarSnap.collapsed === true,
                    '!inline': navBarSnap.collapsed === false,
                  })}
                >
                  {item.label}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </section>

        <Separator />

        <section
          className={cn('px-1.5 flex flex-col-reverse md:flex-row justify-between items-center gap-1', {
            '!flex-col-reverse': navBarSnap.collapsed === true,
            '!flex-row': navBarSnap.collapsed === false,
          })}
        >
          <Button
            className="opacity-50 hover:opacity-100 transition"
            size="icon"
            variant="ghost"
            onClick={handleToggleSideBar}
          >
            <i
              className={cn('i-ri-side-bar-line md:i-ri-side-bar-fill !h-5 !w-5', {
                '!i-ri-side-bar-line': navBarSnap.collapsed === true,
                '!i-ri-side-bar-fill': navBarSnap.collapsed === false,
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
