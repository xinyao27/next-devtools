import { Link } from 'nextra-theme-docs'
import { useMemo } from 'react'

import { BackgroundBeams } from '@/components/ui/background-beams'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

export const projects = [
  {
    description: 'Enhance your DX even further, and adding an extra layer of enjoyment to the development journey!',
    icon: <i className="i-ri-code-s-slash-line size-8" />,
    link: '/',
    title: 'Developer experience',
  },
  {
    description: 'Shows your current routes and provide a quick way to navigate to them.',
    icon: <i className="i-ri-node-tree size-8" />,
    link: '/guide/features#routes',
    title: 'Routes',
  },
  {
    description: 'Shows your components and provide a quick way to navigate to them.',
    icon: <i className="i-ri-box-1-line size-8" />,
    link: '/guide/features#components',
    title: 'Components',
  },
  {
    description: 'Shows all your static assets and their information. You can also preview them.',
    icon: <i className="i-ri-gallery-line size-8" />,
    link: '/guide/features#assets',
    title: 'Assets',
  },
  {
    description: 'Shows all your packages and their information.',
    icon: <i className="i-ri-box-3-line size-8" />,
    link: '/guide/features#packages',
    title: 'Packages',
  },
  {
    description: 'Shows all your environment variables.',
    icon: <i className="i-ri-shapes-line size-8" />,
    link: '/guide/features#envs',
    title: 'Environment Variables',
  },
]

export default function Index() {
  const getStartedButton = useMemo(() => {
    return (
      <Link href="/guide/getting-started">
        <button className="group relative inline-block cursor-pointer rounded-full bg-slate-800 p-px text-base font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-6 py-2 ring-1 ring-white/10">
            <span>Get started</span>
            <i className="i-ri-rocket-line" />
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </Link>
    )
  }, [])

  return (
    <>
      <div className="relative flex flex-col items-center justify-center gap-12 antialiased">
        <BackgroundBeams />

        <ContainerScroll
          content={
            <div
              className="w-screen overflow-hidden rounded-lg sm:w-full"
              style={{
                boxShadow:
                  '0 2px 15px -3px var(--next-devtools-widget-shadow), 0 4px 6px -4px var(--next-devtools-widget-shadow)',
              }}
            >
              <img
                alt="preview"
                className="object-contain"
                src="/images/preview.png"
              />
            </div>
          }
          titleComponent={
            <div className="relative z-10 mx-auto p-4 pt-20">
              <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl">
                Enhance
                <br />
                Next developer
                <br />
                experience
              </h1>

              <div className="my-6">{getStartedButton}</div>
            </div>
          }
        />
      </div>

      <div className="container mx-auto">
        <HoverEffect items={projects} />
      </div>

      <div className="container mx-auto mb-40 mt-40 space-y-6">
        {/* <h2 className="text-4xl font-bold text-center bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">Get started</h2> */}

        <div className="text-center">{getStartedButton}</div>
      </div>
    </>
  )
}
