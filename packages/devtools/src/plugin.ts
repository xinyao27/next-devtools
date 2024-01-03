import { type Compiler } from 'webpack'
import { type NextConfig } from 'next/dist/server/config-shared'
import consola from 'consola'
import { colors } from 'consola/utils'
import { type Context, LOCAL_CLIENT_PORT } from '@next-devtools/shared'

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
        import('./server/local').then(({ createLocalService }) => {
          createLocalService()
        })
        import('./server/rpc').then(({ createRPCServer }) => {
          createRPCServer(options, this.context)
        })
        consola.log(colors.gray(`  ▲ Next Devtools ${process.env.VERSION}`))
        consola.log('')
        this.running = true
      }
    })
  }
}

export function withNextDevtools(nextConfig: NextConfig): NextConfig {
  const nextDevtoolsConfig: NextConfig = {
    webpack: (
      config,
      context,
    ) => {
      if (!context.isServer) return config
      if (!context.dev) return config

      const runtime = context.isServer ? (context.nextRuntime === 'edge' ? 'edge' : 'node') : 'browser'
      config.plugins.push(new Plugin({ ...context, runtime, nextConfig }))

      return config
    },

    rewrites: async () => {
      const obj = {
        source: '/__next_devtools__/client/:path*',
        destination: `http://localhost:${LOCAL_CLIENT_PORT}/__next_devtools__/client/:path*`,
      }
      const nextRewrites = await nextConfig.rewrites?.()
      if (Array.isArray(nextRewrites)) {
        return [
          ...nextRewrites,
          obj,
        ]
      }
      else if (nextRewrites instanceof Object) {
        return {
          ...nextRewrites,
          fallback: [...nextRewrites.fallback || [], obj],
        }
      }
      return [obj]
    },
  }
  return Object.assign({}, nextConfig, nextDevtoolsConfig)
}
