import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { type WebpackOptionsNormalized } from 'webpack'
import { type Package } from '@next-devtools/shared'

export async function getPackages(options: WebpackOptionsNormalized) {
  const root = options.context!
  const pkgPath = resolve(root, 'package.json')
  const data = JSON.parse(await readFile(pkgPath, 'utf-8').catch(() => '{}'))
  const packages: Package[] = []

  for (const type of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    const dep = data[type]
    if (!dep) {
      continue
    }
    for (const name in dep) {
      const version = dep[name]
      packages.push({ name, version, type })
    }
  }

  return packages
}
