'use client'

import { NextLogo, ReactLogo } from '@next-devtools/shared'
import React from 'react'
import useSWR from 'swr'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRPCClient } from '@/lib/client'
import NpmVersionCheck from '@/components/npm-version-check'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { Button } from '@/components/ui/button'

export default function Page() {
  const rpcClient = useRPCClient()
  const { theme } = useTheme()
  const { data } = useSWR('getOverviewData', () => rpcClient.current?.getOverviewData.query())

  return (
    <div className="dark:bg-grid-small-white/[0.3] bg-grid-small-black/[0.1] h-full p-4">
      <section className="mt-12 flex w-full flex-col items-center justify-center space-y-2">
        <h1 className="flex gap-2 text-4xl font-bold">Next DevTools</h1>
        <div className="opacity-50">
          Next Devtools <NpmVersionCheck packageName="@next-devtools/core" version={data?.version} />
        </div>
      </section>

      <section className="mb-16">
        <HoverEffect
          items={[
            {
              title: <NextLogo className="h-6" theme={theme as 'dark' | 'light'} />,
              description: <NpmVersionCheck packageName="next" version={data?.nextVersion} />,
              link: 'https://nextjs.org',
              target: '_blank',
            },
            {
              title: <ReactLogo className="w-8" />,
              description: <NpmVersionCheck packageName="react" version={data?.reactVersion} />,
              link: 'https://react.dev',
              target: '_blank',
            },
            {
              title: <i className="i-ri-node-tree text-3xl" />,
              description: <span>{data?.routesCount} routes</span>,
              link: '/routes',
            },
            {
              title: <i className="i-ri-box-1-line text-3xl" />,
              description: <span>{data?.componentsCount} components</span>,
              link: '/components',
            },
          ]}
        />
      </section>

      <section className="flex flex-col justify-center space-x-4 md:flex-row">
        <Link href="https://github.com/xinyao27/next-devtools" target="_black">
          <Button className="w-full font-normal" variant="ghost">
            <i className="i-ri-star-line mr-2 h-4 w-4" />
            Star on Github
          </Button>
        </Link>
        <Link href="https://github.com/xinyao27/next-devtools/discussions/15" target="_black">
          <Button className="w-full font-normal" variant="ghost">
            <i className="i-ri-lightbulb-flash-line mr-2 h-4 w-4" />
            Ideas & Suggestions
          </Button>
        </Link>
        <Link href="https://github.com/xinyao27/next-devtools/issues/new/choose" target="_black">
          <Button className="w-full font-normal" variant="ghost">
            <i className="i-ri-bug-line mr-2 h-4 w-4" />
            Bug Reports
          </Button>
        </Link>
      </section>
    </div>
  )
}
