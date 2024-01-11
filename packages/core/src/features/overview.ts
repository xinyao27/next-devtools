import { getRoutes } from './routes'
import { getComponents } from './components'
import { getPackages } from './packages'
import type { WebpackOptionsNormalized } from 'webpack'
import type { Context } from '../server/router'

function removeVersionPrefix(version: string) {
  return version.replace(/^[<=>^~]*\s*/, '')
}

export async function getOverviewData(options: WebpackOptionsNormalized, context: Context) {
  const version = process.env.VERSION
  const nextVersion = removeVersionPrefix((await getPackages(options)).find((v) => v.name === 'next')!.version)
  const reactVersion = removeVersionPrefix((await getPackages(options)).find((v) => v.name === 'react')!.version)
  const routesCount = (await getRoutes(context)).routes.length
  const componentsCount = (await getComponents(options)).length

  return {
    version,
    nextVersion,
    reactVersion,
    routesCount,
    componentsCount,
  }
}
