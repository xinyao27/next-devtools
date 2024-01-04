import { type WebpackOptionsNormalized } from 'webpack'
import dotenv from 'dotenv'
import { type Env } from '@next-devtools/shared'
import env from '@next/env'
import { type Context } from '../server/router'

/**
 * Get all envs including .env, .env.local, .env.[mode], .env.[mode].local and next.config.js -> env
 * @param options
 * @returns
 */
export async function getEnvs(options: WebpackOptionsNormalized, context: Context) {
  const root = options.context!

  const result: Env = {
    publicEnv: {},
    privateEnv: {},
    loadedEnvFiles: [],
  }
  const nextEnvConfig = env.loadEnvConfig(root, context.dev)
  Object.keys(nextEnvConfig.combinedEnv).forEach((key) => {
    const value = nextEnvConfig.combinedEnv[key]
    if (typeof value === 'string') {
      result.privateEnv[key] = value
      if (key.startsWith('NEXT_PUBLIC_')) {
        result.publicEnv[key] = value
      }
    }
  })
  nextEnvConfig.loadedEnvFiles.forEach((envFile) => {
    const contents = dotenv.parse(envFile.contents)
    result.loadedEnvFiles.push({ ...envFile, contents })
  })

  return result
}
