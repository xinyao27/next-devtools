import dotenv from 'dotenv'
import { loadEnvConfig } from '@next/env'
import { internalStore } from '../store/internal'
import type { Env } from '@next-devtools/shared/types/features'
import type { Context } from '../server/router'

/**
 * Get all envs including .env, .env.local, .env.[mode], .env.[mode].local and next.config.js -> env
 * @param context
 * @returns
 */
export async function getEnvs(context: Context) {
  const root = internalStore.getState().root

  const result: Env = {
    publicEnv: {},
    privateEnv: {},
    loadedEnvFiles: [],
  }
  const nextEnvConfig = loadEnvConfig(root, context.dev)
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
