import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { getStaticAssetInfo, getStaticAssets } from '../features/assets'
import { getComponents } from '../features/components'
import { getEnvs } from '../features/envs'
import { getPackageInfo, getPackages } from '../features/packages'
import { getRoutes } from '../features/routes'
import { openInVscode } from '../features/vscode'
import type { NextConfig, WebpackConfigContext } from 'next/dist/server/config-shared'
import type { WebpackOptionsNormalized } from 'webpack'

export interface Context extends WebpackConfigContext {
  runtime: 'node' | 'edge' | 'browser'
  nextConfig: NextConfig
}

const t = initTRPC.context<() => { options: WebpackOptionsNormalized; context: Context }>().create()

export const appRouter = t.router({
  getStaticAssets: t.procedure.query(async (opts) => {
    const options = opts.ctx.options
    return await getStaticAssets(options)
  }),
  getStaticAssetInfo: t.procedure.input(z.string()).query(async (opts) => {
    const path = opts.input
    return await getStaticAssetInfo(path)
  }),
  getComponents: t.procedure.query(async (opts) => {
    const options = opts.ctx.options
    return await getComponents(options)
  }),
  getEnvs: t.procedure.query(async (opts) => {
    const options = opts.ctx.options
    const context = opts.ctx.context
    return await getEnvs(options, context)
  }),
  getPackages: t.procedure.query(async (opts) => {
    const options = opts.ctx.options
    return await getPackages(options)
  }),
  getPackageInfo: t.procedure.input(z.string()).query(async (opts) => {
    const name = opts.input
    return await getPackageInfo(name)
  }),
  getRoutes: t.procedure.query(async (opts) => {
    const context = opts.ctx.context
    return await getRoutes(context)
  }),
  openInVscode: t.procedure
    .input(
      z.object({
        path: z.string(),
        line: z.string().optional(),
        column: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const input = opts.input
      return openInVscode(input)
    }),
})

export type AppRouter = typeof appRouter
