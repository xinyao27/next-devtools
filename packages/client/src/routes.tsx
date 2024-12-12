import { RouterProvider, createBrowserRouter } from 'react-router'
import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import Provider from './pages/provider'
import Error from './pages/error'
import HomePage from './pages/page'
import AssetsPage from './pages/assets/page'
import BundleAnalyzerPage from './pages/bundle-analyzer/page'
import ComponentsPage from './pages/components/page'
import EnvsPage from './pages/envs/page'
import NetworkPage from './pages/network/page'
import OverviewPage from './pages/overview/page'
import PackagesPage from './pages/packages/page'
import RoutesPage from './pages/routes/page'
import SEOPage from './pages/seo/page'
import SettingsPage from './pages/settings/page'
import TerminalPage from './pages/terminal/page'

export const routes = createBrowserRouter(
  [
    {
      path: `/`,
      Component: Provider,
      ErrorBoundary: Error,
      children: [
        { index: true, Component: HomePage },
        { path: 'assets', Component: AssetsPage },
        { path: 'bundle-analyzer', Component: BundleAnalyzerPage },
        { path: 'components', Component: ComponentsPage },
        { path: 'envs', Component: EnvsPage },
        { path: 'network', Component: NetworkPage },
        { path: 'overview', Component: OverviewPage },
        { path: 'packages', Component: PackagesPage },
        { path: 'routes', Component: RoutesPage },
        { path: 'seo', Component: SEOPage },
        { path: 'settings', Component: SettingsPage },
        { path: 'terminal', Component: TerminalPage },
      ],
    },
  ],
  {
    basename: CLIENT_BASE_PATH,
  },
)

export const router = <RouterProvider router={routes} />
