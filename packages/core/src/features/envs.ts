import type { Env, NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

import dotenv from 'dotenv'

import { internalStore } from '../store/internal'

/**
 * Get all envs including .env, .env.local, .env.[mode], .env.[mode].local and next.config.js -> env
 * @param context
 * @returns
 */
export async function getEnvs() {
  const { dev, root } = internalStore.getState()

  const result: Env = {
    loadedEnvFiles: [],
    privateEnv: {},
    publicEnv: {},
  }
  const nextEnvConfig = await import('@next/env').then((mod) => mod.loadEnvConfig(root, dev))
  Object.keys(nextEnvConfig.combinedEnv).forEach((key) => {
    const value = nextEnvConfig.combinedEnv[key]
    if (typeof value === 'string') {
      result.privateEnv[key] = value
      if (key.startsWith('NEXT_PUBLIC_')) result.publicEnv[key] = value
    }
  })
  nextEnvConfig.loadedEnvFiles.forEach((envFile) => {
    const contents = dotenv.parse(envFile.contents)
    result.loadedEnvFiles.push({ ...envFile, contents })
  })

  return result
}

export function setupEnvsRpc(_: NextDevtoolsServerContext) {
  return {
    getEnvs,
  } satisfies Partial<ServerFunctions>
}
