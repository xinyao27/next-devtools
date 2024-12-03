import { RouterProvider, createBrowserRouter } from 'react-router'
import { CLIENT_BASE_PATH } from '@next-devtools/shared/constants'
import HomePage from './pages/page'
import OverviewPage from './pages/overview/page'
import RoutesPage from './pages/routes/page'
import ComponentsPage from './pages/components/page'
import AssetsPage from './pages/assets/page'
import PackagesPage from './pages/packages/page'
import EnvsPage from './pages/envs/page'
import NetworkPage from './pages/network/page'
import TerminalPage from './pages/terminal/page'
import BundleAnalyzerPage from './pages/bundle-analyzer/page'
import SettingsPage from './pages/settings/page'
import Provider from './pages/provider'
import Error from './pages/error'

export const routes = createBrowserRouter(
  [
    {
      path: `/`,
      Component: Provider,
      ErrorBoundary: Error,
      children: [
        { index: true, Component: HomePage },
        { path: 'overview', Component: OverviewPage },
        { path: 'routes', Component: RoutesPage },
        { path: 'components', Component: ComponentsPage },
        { path: 'assets', Component: AssetsPage },
        { path: 'packages', Component: PackagesPage },
        { path: 'envs', Component: EnvsPage },
        { path: 'network', Component: NetworkPage },
        { path: 'terminal', Component: TerminalPage },
        { path: 'bundle-analyzer', Component: BundleAnalyzerPage },
        { path: 'settings', Component: SettingsPage },
      ],
    },
  ],
  {
    basename: CLIENT_BASE_PATH,
  },
)

export const router = <RouterProvider router={routes} />
