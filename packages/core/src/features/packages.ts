import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import semver from 'semver'
import { getLatestVersion } from 'fast-npm-meta'
import { internalStore } from '../store/internal'
import { customFetch, getFetchHeaders } from '../utils'
import { runNpmCommand } from './npm'
import type { NextDevtoolsServerContext, Package, ServerFunctions } from '@next-devtools/shared/types'

export async function getPackages() {
  const root = internalStore.getState().root
  const pkgPath = resolve(root, 'package.json')
  const data = JSON.parse(await readFile(pkgPath, 'utf-8').catch(() => '{}'))
  const packages: Package[] = []

  for (const type of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    const dep = data[type]
    if (!dep) continue

    for (const name in dep) {
      if (name !== process.env.PACKAGE_NAME) {
        const version = dep[name]
        packages.push({ name, version, type })
      }
    }
  }

  return packages
}

export async function getPackageInfo(name: string, github = true) {
  // Get NPM data
  const npmRegistryUrl = 'https://registry.npmjs.org'
  const npmUrl = `${npmRegistryUrl}/${name}`
  const npmResponse = await fetch(npmUrl, { cache: 'force-cache', headers: getFetchHeaders() })
  const npmData = await npmResponse.json()
  if (npmData.repository?.url.startsWith('git+')) npmData.repository.url = npmData.repository.url.slice(4)

  if (github) {
    // Get GitHub data
    const githubUrl = npmData.repository?.url
    const githubUser = githubUrl?.split('/')[3]
    const githubRepo = githubUrl?.split('/')[4]?.split('.git')[0]
    const githubApiUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}`
    const githubResponse = await fetch(githubApiUrl, { cache: 'force-cache', headers: getFetchHeaders() })
    const githubData = await githubResponse.json()

    return { ...npmData, ...githubData }
  }

  return npmData
}

export async function checkPackageVersion(name: string, current?: string) {
  if (!current) {
    const pkg = (await getPackages()).find((v) => v.name === name)
    if (!pkg) return null
    current = pkg.version
  }
  if (!current) return null
  current = semver.clean(current)!
  if (typeof current !== 'string') return null

  const npmData = await getPackageInfo(name)
  const { version: latest } = await getLatestVersion(name, {
    fetch: customFetch,
  })
  const isOutdated = !!latest && latest !== current && semver.lt(current, latest)

  return {
    name,
    current,
    latest,
    isOutdated,
    npmData,
  }
}

export function setupPackagesRpc(_: NextDevtoolsServerContext) {
  return {
    getPackages,
    getPackageInfo,
    checkPackageVersion,
    updatePackageVersion: async (name, options) => {
      const root = internalStore.getState().root
      await runNpmCommand('update', name, { cwd: root, ...options })
    },
  } satisfies Partial<ServerFunctions>
}
