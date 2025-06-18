'use client'

import { prettySize } from '@next-devtools/shared/utils'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import React from 'react'

import type { BentoCardProps } from '@/components/magicui/bento-grid'

import Logo from '@/components/logo'
import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid'
import { Globe } from '@/components/magicui/globe'
import { Marquee, MarqueeItem } from '@/components/magicui/marquee'
import { RetroGrid } from '@/components/magicui/retro-grid'
import { AnimatedSpan, Terminal, TypingAnimation } from '@/components/magicui/terminal'
import { Testimonials } from '@/components/magicui/testimonials'
import NextLogo from '@/components/next-logo'
import NpmVersionCheck from '@/components/npm-version-check'
import { UwuLogo } from '@/components/react-logo'
import { Button } from '@/components/ui/button'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { rpcClient } from '@/lib/client'
import { cn } from '@/lib/utils'

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
          <Globe className="md:left-30 mask-[linear-gradient(to_top,transparent_30%,#000_100%)] absolute top-0 mx-auto size-[500px] transition-all group-hover:scale-105 sm:left-10" />
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
            className="mt-5 h-6"
            theme={theme as 'dark' | 'light'}
          />
        ),
      },
      {
        background: null,
        className: 'md:col-span-4',
        cta: 'Visit',
        description: (
          <NpmVersionCheck
            packageName="react"
            version={data?.reactVersion}
          />
        ),
        href: 'https://react.dev',
        Icon: <UwuLogo className="-ml-2 w-24 max-w-32" />,
      },
      {
        background: (
          <Terminal className="absolute inset-x-0 top-0 size-[500px] max-w-full opacity-80 group-hover:opacity-50">
            <TypingAnimation>&gt; ls</TypingAnimation>

            {data?.routes.slice(1, 5).map((route, index) => (
              <AnimatedSpan
                delay={index * 1000}
                key={route.route}
              >
                <span className="truncate-left text-primary w-full">
                  <span>✔ {route.route}</span>
                </span>
              </AnimatedSpan>
            ))}
            <AnimatedSpan delay={4000}>
              <span className="truncate-left text-primary w-full">
                <span>✔ ...</span>
              </span>
            </AnimatedSpan>

            <TypingAnimation
              className="text-muted-foreground"
              delay={5000}
            >
              Get all routes!
            </TypingAnimation>
          </Terminal>
        ),
        className: 'md:col-span-3 text-right',
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
                <div className="flex flex-1 items-center gap-1 overflow-hidden">
                  <i
                    className={cn(
                      component.type === 'component' ? 'i-ri-box-1-line' : 'i-ri-gallery-line',
                      'size-4 shrink-0',
                    )}
                  />
                  <span className="truncate">{component.file}</span>
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
          <div className="absolute top-4 flex w-full justify-center">
            <Testimonials
              testimonials={
                data?.assets.slice(0, 6).map((asset) => ({
                  name: asset.filePath,
                  src: asset.filePath,
                })) || []
              }
            />
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
                <div className="flex flex-1 items-center gap-1 overflow-hidden">
                  <i className="i-ri-box-3-line size-4 shrink-0" />
                  <span className="truncate">{pkg.name}</span>
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
      <SmoothCursor />

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
