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

export async function getPackageInfo(name: string) {
  // Get NPM data
  const npmRegistryUrl = 'https://registry.npmjs.org'
  const npmUrl = `${npmRegistryUrl}/${name}`
  const npmResponse = await fetch(npmUrl, { cache: 'force-cache' })
  const npmData = await npmResponse.json()
  if (npmData.repository?.url.startsWith('git+')) {
    npmData.repository.url = npmData.repository.url.slice(4)
  }

  // Get GitHub data
  const githubUrl = npmData.repository?.url
  const githubUser = githubUrl?.split('/')[3]
  const githubRepo = githubUrl?.split('/')[4]?.split('.git')[0]
  const githubApiUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}`
  const githubResponse = await fetch(githubApiUrl, { cache: 'force-cache' })
  const githubData = await githubResponse.json()

  return { ...npmData, ...githubData }
}
