'use client'

import { prettySize } from '@next-devtools/shared/utils'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import React from 'react'

import type { BentoCardProps } from '@/components/magic/bento-grid'

import Logo from '@/components/logo'
import { BentoCard, BentoGrid } from '@/components/magic/bento-grid'
import { Globe } from '@/components/magic/globe'
import { Marquee, MarqueeItem } from '@/components/magic/marquee'
import { Meteors } from '@/components/magic/meteors'
import { OrbitingCircles } from '@/components/magic/orbiting-circles'
import { RetroGrid } from '@/components/magic/retro-grid'
import NextLogo from '@/components/next-logo'
import NpmVersionCheck from '@/components/npm-version-check'
import ReactLogo from '@/components/react-logo'
import { Button } from '@/components/ui/button'
import { rpcClient } from '@/lib/client'
import { cn } from '@/lib/utils'

import AssetsImage from './(components)/assets-image'

export default function Page() {
  const { theme } = useTheme()
  const { data } = useQuery({
    queryFn: () => rpcClient.getOverviewData(),
    queryKey: ['getOverviewData'],
  })

  const features = React.useMemo<BentoCardProps[]>(() => {
    return [
      {
        background: (
          <Globe className="md:left-30 mask-[linear-gradient(to_top,transparent_30%,#000_100%)] absolute top-0 mx-auto h-[500px] w-[500px] transition-all duration-300 group-hover:scale-105 sm:left-10" />
        ),
        className: 'md:col-span-5',
        cta: 'Visit',
        description: (
          <NpmVersionCheck
            packageName="next"
            version={data?.nextVersion}
          />
        ),
        href: 'https://nextjs.org',
        Icon: (
          <NextLogo
            className="h-6"
            theme={theme as 'dark' | 'light'}
          />
        ),
        name: 'Next',
      },
      {
        background: <Meteors />,
        className: 'md:col-span-4',
        cta: 'Visit',
        description: (
          <NpmVersionCheck
            packageName="react"
            version={data?.reactVersion}
          />
        ),
        href: 'https://react.dev',
        Icon: <ReactLogo className="w-8" />,
        name: 'React',
      },
      {
        background: <RetroGrid className="absolute -top-12 h-[200px]" />,
        className: 'md:col-span-3',
        cta: '',
        description: <span>{data?.routes.length} routes</span>,
        href: '/routes',
        Icon: <i className="i-ri-node-tree text-3xl" />,
        name: 'Routes',
      },
      {
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
        className: 'md:col-span-4',
        cta: '',
        description: <span>{data?.components.length} components</span>,
        href: '/components',
        Icon: <i className="i-ri-box-1-line text-3xl" />,
        name: 'Components',
      },
      {
        background: (
          <div className="mask-[linear-gradient(to_top,transparent_30%,#000_100%)] absolute -right-10 -top-20 flex h-[300px] w-full items-center justify-center overflow-hidden">
            {/* Inner Circles */}
            {data?.assets.slice(0, data.assets.length / 2).map((asset, index) => (
              <OrbitingCircles
                className="size-[30px] border-none bg-transparent"
                delay={index * 10}
                duration={20}
                key={asset.filePath}
                radius={60}
              >
                <AssetsImage data={asset} />
              </OrbitingCircles>
            ))}
            {/* Outer Circles */}
            {data?.assets.slice(data.assets.length / 2).map((asset, index) => (
              <OrbitingCircles
                className="size-[30px] border-none bg-transparent"
                delay={index * 10}
                duration={20}
                key={asset.filePath}
                radius={100}
                reverse
              >
                <AssetsImage data={asset} />
              </OrbitingCircles>
            ))}
          </div>
        ),
        className: 'md:col-span-4',
        cta: '',
        description: <span>{data?.assets.length} assets</span>,
        href: '/assets',
        Icon: <i className="i-ri-gallery-line text-3xl" />,
        name: 'Assets',
      },
      {
        background: (
          <Marquee
            pauseOnHover
            reverse
          >
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
        className: 'md:col-span-4',
        cta: '',
        description: <span>{data?.packages.length} packages</span>,
        href: '/packages',
        Icon: <i className="i-ri-box-3-line text-3xl" />,
        name: 'Packages',
      },
    ]
  }, [data])

  return (
    <div className="h-full p-4">
      <section className="mt-12 flex w-full flex-col items-center justify-center space-y-8">
        <Logo className="size-16 text-zinc-800/90 dark:text-white" />

        <div className="opacity-50">
          Next Devtools{' '}
          <NpmVersionCheck
            packageName="@next-devtools/core"
            version={data?.version}
          />
        </div>
      </section>

      <section className="mt-12">
        <BentoGrid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-12">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              {...feature}
            />
          ))}
        </BentoGrid>
      </section>

      <section className="flex flex-col justify-center space-x-4 py-16 md:flex-row">
        <a
          href="https://github.com/xinyao27/next-devtools"
          target="_black"
        >
          <Button
            className="w-full font-normal"
            variant="ghost"
          >
            <i className="i-ri-star-line mr-2 size-4" />
            Star on Github
          </Button>
        </a>
        <a
          href="https://github.com/xinyao27/next-devtools/discussions/15"
          target="_black"
        >
          <Button
            className="w-full font-normal"
            variant="ghost"
          >
            <i className="i-ri-lightbulb-flash-line mr-2 size-4" />
            Ideas & Suggestions
          </Button>
        </a>
        <a
          href="https://github.com/xinyao27/next-devtools/issues/new/choose"
          target="_black"
        >
          <Button
            className="w-full font-normal"
            variant="ghost"
          >
            <i className="i-ri-bug-line mr-2 size-4" />
            Bug Reports
          </Button>
        </a>
      </section>

      <RetroGrid />
    </div>
  )
}
