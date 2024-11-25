import { removeVersionPrefix } from '@next-devtools/shared/utils/helpers'
import { getRoutes } from './routes'
import { getComponents } from './components'
import { getPackages } from './packages'
import { getStaticAssets } from './assets'

export async function getOverviewData() {
  const version = process.env.VERSION!

  const packages = await getPackages()
  const nextVersion = removeVersionPrefix(packages.find((v) => v.name === 'next')!.version)
  const reactVersion = removeVersionPrefix(packages.find((v) => v.name === 'react')!.version)

  const routes = (await getRoutes()).routes
  const components = await getComponents()
  const assets = await getStaticAssets()

  return {
    version,
    nextVersion,
    reactVersion,
    routes,
    components,
    assets,
    packages,
  }
}
