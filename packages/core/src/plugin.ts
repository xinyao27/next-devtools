import { EventEmitter } from 'node:events'
import consola from 'consola'
import { colors } from 'consola/utils'
import {
  CLIENT_BASE_PATH,
  LOCAL_CLIENT_PORT,
  STATIC_BASE_PATH,
  STATIC_SERVER_PORT,
  TEMP_DIR,
} from '@next-devtools/shared/constants'
import { ip } from 'address'
import { getPort } from 'get-port-please'
import { createLocalService } from './server/local'
import { createRPCServer } from './server/rpc'
import { createStaticServer } from './server/static'
import { getGlobalThis } from './utils'
import { settingsStore } from './store/settings'
import { internalStore } from './store/internal'
import { setupTerminal } from './features/terminal'
import { networkStore } from './store/network'
import type { NextDevtoolsServerContext } from '@next-devtools/shared/types'
import type { NextConfig } from 'next'
import type { Compiler } from 'webpack'

const globalThis = getGlobalThis()

export class Plugin {
  context: NextDevtoolsServerContext['context']
  running: boolean = false
  constructor(context: NextDevtoolsServerContext['context']) {
    this.context = context
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('NextDevtoolsPlugin', () => {
      if (!this.running && this.context.dev && this.context.runtime === 'node' && typeof window === 'undefined') {
        const ctx: NextDevtoolsServerContext = {
          options: compiler.options,
          context: this.context,
        }

        const __NEXT_DEVTOOLS_EE__ = new EventEmitter()
        globalThis.__NEXT_DEVTOOLS_EE__ = __NEXT_DEVTOOLS_EE__

        // Ensuring order
        createRPCServer(ctx)
        createLocalService()
        createStaticServer(ctx)
        setupTerminal()
        internalStore.getState().setup(ctx)
        settingsStore.getState().setup(ctx)
        networkStore.getState().setup()

        setInterval(() => {
          globalThis.__NEXT_DEVTOOLS_RPC__.broadcast.serverReady()
        }, 1000)

        consola.log(colors.magenta(colors.bold(`   ▲ Next Devtools ${process.env.VERSION}`)))
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
      localClientPort = await getPort({ port: LOCAL_CLIENT_PORT })
      staticServerPort = await getPort({ port: STATIC_SERVER_PORT })
      const nextRewrites = await nextConfig.rewrites?.()
      if (process.env.NODE_ENV === 'production') return nextRewrites || []

      const localClientHost = ip('lo') || 'localhost'
      const rewrites = [
        {
          source: `${CLIENT_BASE_PATH}/:path*`,
          destination: `http://${localClientHost}:${localClientPort}${CLIENT_BASE_PATH}/:path*`,
        },
        {
          source: `${STATIC_BASE_PATH}/:path*`,
          destination: `http://${localClientHost}:${staticServerPort}/:path*`,
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
