import { removeVersionPrefix } from '@next-devtools/shared'
import { getRoutes } from './routes'
import { getComponents } from './components'
import { getPackages } from './packages'
import { getStaticAssets } from './assets'
import type { WebpackOptionsNormalized } from 'webpack'
import type { Context } from '../server/router'

export async function getOverviewData(options: WebpackOptionsNormalized, context: Context) {
  const version = process.env.VERSION
  const nextVersion = removeVersionPrefix((await getPackages(options)).find((v) => v.name === 'next')!.version)
  const reactVersion = removeVersionPrefix((await getPackages(options)).find((v) => v.name === 'react')!.version)
  const routes = (await getRoutes(context)).routes
  const components = await getComponents(options)
  const assets = await getStaticAssets(options)
  const packages = await getPackages(options)

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
