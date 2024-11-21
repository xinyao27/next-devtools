import { removeVersionPrefix } from '@next-devtools/shared'
import { getRoutes } from './routes'
import { getComponents } from './components'
import { getPackages } from './packages'
import { getStaticAssets } from './assets'
import type { WebpackOptionsNormalized } from 'webpack'
import type { Context } from '../server/router'

export async function getOverviewData(options: WebpackOptionsNormalized, context: Context) {
  const version = process.env.VERSION!

  const packages = await getPackages(options)
  const nextVersion = removeVersionPrefix(packages.find((v) => v.name === 'next')!.version)
  const reactVersion = removeVersionPrefix(packages.find((v) => v.name === 'react')!.version)

  const routes = (await getRoutes(context)).routes
  const components = await getComponents(options)
  const assets = await getStaticAssets(options)

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
