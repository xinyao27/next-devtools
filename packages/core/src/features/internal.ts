import { resolve } from 'node:path'
import { exists } from 'fs-extra'
import type { WebpackOptionsNormalized } from 'webpack'
import type { Internal } from '@next-devtools/shared'

let cache: Internal

export async function getInternal(options: WebpackOptionsNormalized) {
  try {
    if (cache) return cache

    const root = options.context!

    let pkgPath: Internal['pkgPath'] = resolve(root, 'package.json')
    // Make sure package.json exists
    if (!(await exists(pkgPath))) pkgPath = undefined

    cache = {
      root,
      pkgPath,
    }

    return cache
  } catch (error) {
    console.error(error)
    return null
  }
}
