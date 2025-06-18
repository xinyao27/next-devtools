import type { DocsThemeConfig } from 'nextra-theme-docs'

import { useRouter } from 'next/router'
import { Link } from 'nextra-theme-docs'
import React from 'react'

import Logo from './components/logo'

const config: DocsThemeConfig = {
  chat: { icon: <i className="i-ri-twitter-x-fill block size-6" />, link: 'https://x.com/xinyao27' },
  docsRepositoryBase: 'https://github.com/xinyao27/next-devtools/blob/main/docs',
  footer: {
    component: () => (
      <div className="border-t border-neutral-200/10">
        <div className="container mx-auto flex justify-between py-16">
          <Link href="/">
            <Logo className="w-36 text-white" />
          </Link>
          <div className="opacity-50">
            Published under{' '}
            <a
              className="underline"
              href="https://github.com/xinyao27/next-devtools"
              rel="noreferrer"
              target="_blank"
            >
              MIT License
            </a>
          </div>
        </div>
      </div>
    ),
  },
  logo: <Logo className="w-36 text-white" />,
  nextThemes: { defaultTheme: 'dark' },
  project: { link: 'https://github.com/xinyao27/next-devtools' },
  themeSwitch: { component: null },
  useNextSeoProps: () => {
    const { asPath } = useRouter()
    if (asPath !== '/') return { titleTemplate: '%s - NextDevtools' }

    return {}
  },
}

export default config
