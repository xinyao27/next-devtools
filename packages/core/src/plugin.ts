import consola from 'consola'
import { colors } from 'consola/utils'
import { LOCAL_CLIENT_PORT } from '@next-devtools/shared'
import { ip } from 'address'
import { createLocalService } from './server/local'
import { createRPCServer } from './server/rpc'
import type { Context } from './server/router'
import type { NextConfig } from 'next/dist/server/config-shared'
import type { Compiler } from 'webpack'

export class Plugin {
  context: Context
  running: boolean = false
  constructor(context: Context) {
    this.context = context
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('NextDevtoolsPlugin', () => {
      if (!this.running && this.context.dev && this.context.runtime === 'node' && typeof window === 'undefined') {
        const options = compiler.options

        createLocalService()
        createRPCServer(options, this.context)

        consola.log(colors.gray(`  ▲ Next Devtools ${process.env.VERSION}`))
        consola.log('')
        this.running = true
      }
    })
  }
}

export function withNextDevtools(nextConfig: NextConfig): NextConfig {
  const nextDevtoolsConfig: NextConfig = {
    webpack: (config, context) => {
      if (!context.isServer) return config
      if (!context.dev) return config

      const runtime = context.isServer ? (context.nextRuntime === 'edge' ? 'edge' : 'node') : 'browser'
      config.plugins.push(new Plugin({ ...context, runtime, nextConfig }))

      return config
    },

    rewrites: async () => {
      const nextRewrites = await nextConfig.rewrites?.()
      if (process.env.NODE_ENV === 'production') return nextRewrites || []

      const obj = {
        source: '/__next_devtools__/client/:path*',
        destination: `http://${ip('lo')}:${LOCAL_CLIENT_PORT}/__next_devtools__/client/:path*`,
      }
      if (Array.isArray(nextRewrites)) {
        return [...nextRewrites, obj]
      } else if (nextRewrites instanceof Object) {
        return {
          ...nextRewrites,
          fallback: [...(nextRewrites.fallback || []), obj],
        }
      }
      return [obj]
    },
  }
  return Object.assign({}, nextConfig, nextDevtoolsConfig)
}
