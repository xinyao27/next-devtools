import { EventEmitter } from 'node:events'
import consola from 'consola'
import { colors } from 'consola/utils'
import { LOCAL_CLIENT_PORT, STATIC_SERVER_PORT, TEMP_DIR } from '@next-devtools/shared'
import { ip } from 'address'
import { getPort } from 'get-port-please'
import { createLocalService } from './server/local'
import { createRPCServer } from './server/rpc'
import { createStaticServer } from './server/static'
import type { Context } from './server/router'
import type { NextConfig } from 'next'
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

        const __NEXT_DEVTOOLS_EE__ = new EventEmitter()
        globalThis.__NEXT_DEVTOOLS_EE__ = __NEXT_DEVTOOLS_EE__
        createLocalService(this.context.localClientPort)
        createRPCServer(options, this.context)
        createStaticServer(this.context, this.context.staticServerPort)

        consola.log(colors.gray(`   ▲ Next Devtools ${process.env.VERSION}`))
        consola.log('')
        this.running = true
      }
    })
  }
}

export function withNextDevtools(nextConfig: NextConfig): NextConfig {
  let localClientPort = LOCAL_CLIENT_PORT
  let staticServerPort = STATIC_SERVER_PORT
  const nextDevtoolsConfig: NextConfig = {
    webpack: (config, context) => {
      if (process.env.ANALYZE === 'true' && !context.dev) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: !context.nextRuntime
              ? `../${TEMP_DIR}/analyze/client.html`
              : `../${context.nextRuntime === 'nodejs' ? '../' : ''}../${TEMP_DIR}/analyze/${context.nextRuntime}.html`,
          }),
        )
      }

      if (!context.isServer) return config
      if (!context.dev) return config

      const runtime = context.isServer ? (context.nextRuntime === 'edge' ? 'edge' : 'node') : 'browser'
      config.plugins.push(new Plugin({ ...context, runtime, nextConfig, localClientPort, staticServerPort }))

      return config
    },

    rewrites: async () => {
      localClientPort = (await getPort({ port: Number(LOCAL_CLIENT_PORT) })).toString()
      staticServerPort = (await getPort({ port: Number(STATIC_SERVER_PORT) })).toString()
      const nextRewrites = await nextConfig.rewrites?.()
      if (process.env.NODE_ENV === 'production') return nextRewrites || []

      const rewrites = [
        {
          source: '/__next_devtools__/client/:path*',
          destination: `http://${ip('lo')}:${localClientPort}/__next_devtools__/client/:path*`,
        },
        {
          source: '/__next_devtools__/static/:path*',
          destination: `http://${ip('lo')}:${staticServerPort}/:path*`,
        },
      ]
      if (Array.isArray(nextRewrites)) {
        return [...nextRewrites, ...rewrites]
      } else if (nextRewrites instanceof Object) {
        return {
          ...nextRewrites,
          fallback: [...(nextRewrites.fallback || []), ...rewrites],
        }
      }
      return rewrites
    },
  }
  return Object.assign({}, nextConfig, nextDevtoolsConfig)
}
