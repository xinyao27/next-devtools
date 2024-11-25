'use client'

import { NextLogo } from '@next-devtools/shared/components/next-logo'
import { ReactLogo } from '@next-devtools/shared/components/react-logo'
import { prettySize } from '@next-devtools/shared/utils/helpers'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRPCClient } from '@/lib/client'
import NpmVersionCheck from '@/components/npm-version-check'
import { BentoCard, BentoGrid } from '@/components/magic/bento-grid'
import { Button } from '@/components/ui/button'
import { Meteors } from '@/components/magic/meteors'
import { Globe } from '@/components/magic/globe'
import { Marquee, MarqueeItem } from '@/components/magic/marquee'
import { cn } from '@/lib/utils'
import { OrbitingCircles } from '@/components/magic/orbiting-circles'
import { RetroGrid } from '@/components/magic/retro-grid'
import AssetsImage from './(components)/assets-image'
import type { BentoCardProps } from '@/components/magic/bento-grid'

export default function Page() {
  const rpcClient = useRPCClient()
  const { theme } = useTheme()
  const { data } = useSWR('getOverviewData', () => rpcClient?.getOverviewData.query())

  const features = useMemo<BentoCardProps[]>(() => {
    return [
      {
        name: 'Next',
        className: 'md:col-span-5',
        background: (
          <Globe className="md:left-30 absolute top-0 mx-auto h-[500px] w-[500px] transition-all duration-300 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] group-hover:scale-105 sm:left-10" />
        ),
        Icon: <NextLogo className="h-6" theme={theme as 'dark' | 'light'} />,
        description: <NpmVersionCheck packageName="next" version={data?.nextVersion} />,
        href: 'https://nextjs.org',
        cta: 'Visit',
      },
      {
        name: 'React',
        className: 'md:col-span-4',
        background: <Meteors />,
        Icon: <ReactLogo className="w-8" />,
        description: <NpmVersionCheck packageName="react" version={data?.reactVersion} />,
        href: 'https://react.dev',
        cta: 'Visit',
      },
      {
        name: 'Routes',
        className: 'md:col-span-3',
        background: <RetroGrid className="absolute -top-12 h-[200px]" />,
        Icon: <i className="i-ri-node-tree text-3xl" />,
        description: <span>{data?.routes.length} routes</span>,
        href: '/routes',
        cta: '',
      },
      {
        name: 'Components',
        className: 'md:col-span-4',
        background: (
          <Marquee pauseOnHover>
            {data?.components.map((component) => (
              <MarqueeItem key={component.filePath}>
                <div className="flex items-center gap-1">
                  <i className={cn(component.type === 'component' ? 'i-ri-box-1-line' : 'i-ri-gallery-line')} />
                  {component.file}
                </div>

                <div>
                  <span className="text-nowrap text-[10px] opacity-60">{prettySize(component.size)}</span>
                </div>
              </MarqueeItem>
            ))}
          </Marquee>
        ),
        Icon: <i className="i-ri-box-1-line text-3xl" />,
        description: <span>{data?.components.length} components</span>,
        href: '/components',
        cta: '',
      },
      {
        name: 'Assets',
        className: 'md:col-span-4',
        background: (
          <div className="absolute -right-10 -top-20 flex h-[300px] w-full items-center justify-center overflow-hidden [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
            {/* Inner Circles */}
            {data?.assets.slice(0, data.assets.length / 2).map((asset, index) => (
              <OrbitingCircles
                key={asset.filePath}
                className="size-[30px] border-none bg-transparent"
                delay={index * 10}
                duration={20}
                radius={60}
              >
                <AssetsImage data={asset} />
              </OrbitingCircles>
            ))}
            {/* Outer Circles */}
            {data?.assets.slice(data.assets.length / 2).map((asset, index) => (
              <OrbitingCircles
                key={asset.filePath}
                reverse
                className="size-[30px] border-none bg-transparent"
                delay={index * 10}
                duration={20}
                radius={100}
              >
                <AssetsImage data={asset} />
              </OrbitingCircles>
            ))}
          </div>
        ),
        Icon: <i className="i-ri-gallery-line text-3xl" />,
        description: <span>{data?.assets.length} assets</span>,
        href: '/assets',
        cta: '',
      },
      {
        name: 'Packages',
        className: 'md:col-span-4',
        background: (
          <Marquee pauseOnHover reverse>
            {data?.packages.map((pkg) => (
              <MarqueeItem key={`${pkg.name}@${pkg.version}-${pkg.type}`}>
                <div className="flex items-center gap-1">
                  <i className="i-ri-box-3-line" />
                  {pkg.name}
                </div>

                <div>
                  <span className="text-nowrap text-[10px] opacity-60">{pkg.version}</span>
                </div>
              </MarqueeItem>
            ))}
          </Marquee>
        ),
        Icon: <i className="i-ri-box-3-line text-3xl" />,
        description: <span>{data?.packages.length} packages</span>,
        href: '/packages',
        cta: '',
      },
    ]
  }, [data])

  return (
    <div className="h-full p-4">
      <section className="mt-12 flex w-full flex-col items-center justify-center space-y-2">
        <h1 className="flex gap-2 text-4xl font-bold">Next DevTools</h1>
        <div className="opacity-50">
          Next Devtools <NpmVersionCheck packageName="@next-devtools/core" version={data?.version} />
        </div>
      </section>

      <section className="mt-12">
        <BentoGrid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-12">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </section>

      <section className="flex flex-col justify-center space-x-4 py-16 md:flex-row">
        <Link href="https://github.com/xinyao27/next-devtools" target="_black">
          <Button className="w-full font-normal" variant="ghost">
            <i className="i-ri-star-line mr-2 size-4" />
            Star on Github
          </Button>
        </Link>
        <Link href="https://github.com/xinyao27/next-devtools/discussions/15" target="_black">
          <Button className="w-full font-normal" variant="ghost">
            <i className="i-ri-lightbulb-flash-line mr-2 size-4" />
            Ideas & Suggestions
          </Button>
        </Link>
        <Link href="https://github.com/xinyao27/next-devtools/issues/new/choose" target="_black">
          <Button className="w-full font-normal" variant="ghost">
            <i className="i-ri-bug-line mr-2 size-4" />
            Bug Reports
          </Button>
        </Link>
      </section>

      <RetroGrid />
    </div>
  )
}
