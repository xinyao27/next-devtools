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
    <div className="p-4 h-full dark:bg-grid-small-white/[0.3] bg-grid-small-black/[0.1]">
      <section className="w-full flex justify-center items-center flex-col space-y-2 mt-12">
        <h1 className="text-4xl flex gap-2 font-bold">Next DevTools</h1>
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

      <section className="flex justify-center space-x-4">
        <Link href="https://github.com/xinyao27/next-devtools" target="_black">
          <Button className="font-normal" variant="ghost">
            <i className="w-4 h-4 mr-2 i-ri-star-line" />
            Star on Github
          </Button>
        </Link>
        <Link href="https://github.com/xinyao27/next-devtools/discussions/15" target="_black">
          <Button className="font-normal" variant="ghost">
            <i className="w-4 h-4 mr-2 i-ri-lightbulb-flash-line" />
            Ideas & Suggestions
          </Button>
        </Link>
        <Link href="https://github.com/xinyao27/next-devtools/issues/new/choose" target="_black">
          <Button className="font-normal" variant="ghost">
            <i className="w-4 h-4 mr-2 i-ri-bug-line" />
            Bug Reports
          </Button>
        </Link>
      </section>
    </div>
  )
}
