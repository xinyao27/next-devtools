import { useMemo } from 'react'
import { Link } from 'nextra-theme-docs'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { BackgroundBeams } from '@/components/ui/background-beams'

export const projects = [
  {
    icon: <i className="w-8 h-8 i-ri-code-s-slash-line" />,
    title: 'Developer experience',
    description:
    'Enhance your DX even further, and adding an extra layer of enjoyment to the development journey!',
    link: '/',
  },
  {
    icon: <i className="w-8 h-8 i-ri-node-tree" />,
    title: 'Routes',
    description:
    'Shows your current routes and provide a quick way to navigate to them.',
    link: '/guide/features#routes',
  },
  {
    icon: <i className="w-8 h-8 i-ri-box-1-line" />,
    title: 'Components',
    description:
    'Shows your components and provide a quick way to navigate to them.',
    link: '/guide/features#components',
  },
  {
    icon: <i className="w-8 h-8 i-ri-gallery-line" />,
    title: 'Assets',
    description:
    'Shows all your static assets and their information. You can also preview them.',
    link: '/guide/features#assets',
  },
  {
    icon: <i className="w-8 h-8 i-ri-box-3-line" />,
    title: 'Packages',
    description:
    'Shows all your packages and their information.',
    link: '/guide/features#packages',
  },
  {
    icon: <i className="w-8 h-8 i-ri-shapes-line" />,
    title: 'Environment Variables',
    description:
      'Shows all your environment variables.',
    link: '/guide/features#envs',
  },
]

export default function Index() {
  const getStartedButton = useMemo(() => {
    return (
      <Link href="/guide/getting-started">
        <button className="relative inline-block p-px text-base font-semibold leading-6 text-white no-underline rounded-full shadow-2xl cursor-pointer bg-slate-800 group shadow-zinc-900">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative z-10 flex items-center px-6 py-2 space-x-2 rounded-full bg-zinc-950 ring-1 ring-white/10 ">
            <span>
              Get started
            </span>
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
          content={(
            <div
              className="w-screen overflow-hidden rounded-lg sm:w-full"
              style={{ boxShadow: '0 2px 15px -3px var(--next-devtools-widget-shadow), 0 4px 6px -4px var(--next-devtools-widget-shadow)' }}
            >
              <img
                alt="preview"
                className="object-contain"
                src="/images/preview.png"
              />
            </div>
          )}
          titleComponent={(
            <div className="relative z-10 p-4 pt-20 mx-auto">
              <h1 className="text-5xl font-bold text-center text-transparent bg-opacity-50 sm:text-6xl lg:text-7xl bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">
                Enhance<br />Next developer<br />experience
              </h1>

              <div className="my-6">{getStartedButton}</div>
            </div>
          )}
        />
      </div>

      <div className="container mx-auto">
        <HoverEffect items={projects} />
      </div>

      <div className="container mx-auto mt-40 mb-40 space-y-6">
        {/* <h2 className="text-4xl font-bold text-center bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">Get started</h2> */}

        <div className="text-center">
          {getStartedButton}
        </div>
      </div>

    </>
  )
}
