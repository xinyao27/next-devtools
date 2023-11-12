import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { type WebpackOptionsNormalized } from 'webpack'
import { type Context } from '@next-devtools/shared'
import { getStaticAssets } from '../features/assets'
import { getComponents } from '../features/components'
import { getEnvs } from '../features/envs'
import { getPackages } from '../features/packages'
import { getRoutes } from '../features/routes'
import { openInVscode } from '../features/vscode'

const t = initTRPC.context<() => { options: WebpackOptionsNormalized; context: Context }>().create()

export const appRouter = t.router({
  getStaticAssets: t.procedure
    .query(async (opts) => {
      const options = opts.ctx.options
      return await getStaticAssets(options)
    }),
  getComponents: t.procedure
    .query(async (opts) => {
      const options = opts.ctx.options
      return await getComponents(options)
    }),
  getEnvs: t.procedure
    .query(async (opts) => {
      const options = opts.ctx.options
      const context = opts.ctx.context
      return await getEnvs(options, context)
    }),
  getPackages: t.procedure
    .query(async (opts) => {
      const options = opts.ctx.options
      return await getPackages(options)
    }),
  getRoutes: t.procedure
    .query(async (opts) => {
      const context = opts.ctx.context
      return await getRoutes(context)
    }),
  openInVscode: t.procedure
    .input(z.object({
      path: z.string(),
      line: z.string().optional(),
      column: z.string().optional(),
    }))
    .mutation(async (opts) => {
      const input = opts.input
      return openInVscode(input)
    }),
})

export type AppRouter = typeof appRouter
