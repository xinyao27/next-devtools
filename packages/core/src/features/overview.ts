import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

import { removeVersionPrefix } from '@next-devtools/shared/utils'

import { getStaticAssets } from './assets'
import { getComponents } from './components'
import { getPackages } from './packages'
import { getRoutes } from './routes'

export async function getOverviewData() {
  const version = process.env.VERSION!

  const packages = await getPackages()
  const nextVersion = removeVersionPrefix(packages.find((v) => v.name === 'next')!.version)
  const reactVersion = removeVersionPrefix(packages.find((v) => v.name === 'react')!.version)

  const routes = (await getRoutes()).routes
  const components = await getComponents()
  const assets = await getStaticAssets()

  return {
    assets,
    components,
    nextVersion,
    packages,
    reactVersion,
    routes,
    version,
  }
}

export function setupOverviewRpc(_: NextDevtoolsServerContext) {
  return {
    getOverviewData,
  } satisfies Partial<ServerFunctions>
}
