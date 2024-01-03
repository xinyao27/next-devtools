import React from 'react'
import { type DocsThemeConfig, Link } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import Logo from './components/logo'

const config: DocsThemeConfig = {
  logo: <Logo className="text-white w-36" />,
  project: { link: 'https://github.com/xinyao27/next-devtools' },
  chat: { icon: <i className="block w-6 h-6 i-ri-twitter-x-fill" />, link: 'https://x.com/xinyao27' },
  docsRepositoryBase: 'https://github.com/xinyao27/next-devtools/blob/main/docs',
  footer: {
    component: () => (
      <div className="border-t border-neutral-200/10">
        <div className="container flex justify-between py-16 mx-auto">
          <Link href="/">
            <Logo className="text-white w-36" />
          </Link>
          <div className="opacity-50">
            Published under{' '}
            <a
              className="underline"
              href="https://github.com/xinyao27/next-devtools"
              target="_blank"
            >
              MIT License
            </a>
          </div>
        </div>
      </div>
    ),
  },
  nextThemes: { defaultTheme: 'dark' },
  themeSwitch: { component: null },
  useNextSeoProps: () => {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return { titleTemplate: '%s - NextDevtools' }
    }
    return {}
  },
}

export default config
