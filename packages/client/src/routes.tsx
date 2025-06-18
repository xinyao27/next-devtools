'use client'

import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import { createBrowserRouter, RouterProvider } from 'react-router'

import AssetsPage from './pages/assets/page'
import BundleAnalyzerPage from './pages/bundle-analyzer/page'
import ComponentsPage from './pages/components/page'
import EnvsPage from './pages/envs/page'
import Error from './pages/error'
import NetworkPage from './pages/network/page'
import OverviewPage from './pages/overview/page'
import PackagesPage from './pages/packages/page'
import HomePage from './pages/page'
import Provider from './pages/provider'
import RoutesPage from './pages/routes/page'
import SEOPage from './pages/seo/page'
import SettingsPage from './pages/settings/page'
import TerminalPage from './pages/terminal/page'

export const routes = createBrowserRouter(
  [
    {
      children: [
        { Component: HomePage, index: true },
        { Component: AssetsPage, path: 'assets' },
        { Component: BundleAnalyzerPage, path: 'bundle-analyzer' },
        { Component: ComponentsPage, path: 'components' },
        { Component: EnvsPage, path: 'envs' },
        { Component: NetworkPage, path: 'network' },
        { Component: OverviewPage, path: 'overview' },
        { Component: PackagesPage, path: 'packages' },
        { Component: RoutesPage, path: 'routes' },
        { Component: SEOPage, path: 'seo' },
        { Component: SettingsPage, path: 'settings' },
        { Component: TerminalPage, path: 'terminal' },
      ],
      Component: Provider,
      ErrorBoundary: Error,
      path: `/`,
    },
  ],
  {
    basename: CLIENT_BASE_PATH,
  },
)

export const router = <RouterProvider router={routes} />
