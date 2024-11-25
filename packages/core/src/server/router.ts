import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { settingsSchema } from '@next-devtools/shared/types/settings'
import { getStaticAssetInfo, getStaticAssets } from '../features/assets'
import { getComponents } from '../features/components'
import { getEnvs } from '../features/envs'
import { checkPackageVersion, getPackageInfo, getPackages } from '../features/packages'
import { getRoutes } from '../features/routes'
import { openInVscode } from '../features/vscode'
import { getOverviewData } from '../features/overview'
import { executeCommand, getTerminal, getTerminals, onTerminalWrite, runTerminalAction } from '../features/terminal'
import { runNpmCommand } from '../features/npm'
import { restartProject } from '../features/service'
import { settingsStore } from '../store/settings'
import { internalStore } from '../store/internal'
import type { NextConfig, WebpackConfigContext } from 'next/dist/server/config-shared'
import type { WebpackOptionsNormalized } from 'webpack'

export interface Context extends WebpackConfigContext {
  localClientPort: string
  staticServerPort: string
  runtime: 'node' | 'edge' | 'browser'
  nextConfig: NextConfig
}

const t = initTRPC.context<() => { options: WebpackOptionsNormalized; context: Context }>().create()

export const appRouter = t.router({
  setSettingsStore: t.procedure.input(z.object({ settings: settingsSchema.partial() })).mutation((opts) => {
    const settings = opts.input.settings
    return settingsStore.setState(settings)
  }),
  getSettingsStore: t.procedure.query(() => {
    return settingsStore.getState()
  }),
  getInternalStore: t.procedure.query(() => {
    return internalStore.getState()
  }),
  getOverviewData: t.procedure.query(async () => {
    return await getOverviewData()
  }),
  getStaticAssets: t.procedure.query(async () => {
    return await getStaticAssets()
  }),
  getStaticAssetInfo: t.procedure.input(z.string()).query(async (opts) => {
    const path = opts.input
    return await getStaticAssetInfo(path)
  }),
  getComponents: t.procedure.query(async () => {
    return await getComponents()
  }),
  getEnvs: t.procedure.query(async (opts) => {
    const context = opts.ctx.context
    return await getEnvs(context)
  }),
  getPackages: t.procedure.query(async () => {
    return await getPackages()
  }),
  getPackageInfo: t.procedure.input(z.string()).query(async (opts) => {
    const name = opts.input
    return await getPackageInfo(name)
  }),
  checkPackageVersion: t.procedure
    .input(
      z.object({
        name: z.string(),
        current: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const input = opts.input
      return await checkPackageVersion(input.name, input.current)
    }),
  updatePackageVersion: t.procedure
    .input(
      z.object({
        name: z.string(),
        options: z.any().optional(),
      }),
    )
    .mutation(async (opts) => {
      const context = opts.ctx.context
      const input = opts.input

      return await runNpmCommand('update', input.name, { cwd: context.dir, ...input.options })
    }),
  getRoutes: t.procedure.query(async () => {
    return await getRoutes()
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
  getTerminals: t.procedure.query(getTerminals),
  getTerminal: t.procedure.input(z.string()).query((opts) => {
    const id = opts.input
    return getTerminal(id)
  }),
  runTerminalAction: t.procedure
    .input(
      z.object({
        id: z.string(),
        action: z.union([z.literal('restart'), z.literal('clear'), z.literal('terminate')]),
      }),
    )
    .mutation((opts) => {
      const input = opts.input
      return runTerminalAction(input.id, input.action)
    }),
  onTerminalWrite: t.procedure.subscription(onTerminalWrite),
  executeCommand: t.procedure
    .input(
      z.object({
        command: z.string(),
        args: z.array(z.string()).optional(),
        options: z.any().optional(),

        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        icon: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const context = opts.ctx.context
      const input = opts.input
      return await executeCommand(
        {
          command: input.command,
          args: input.args,
          options: { cwd: context.dir, ...input.options },
        },
        {
          id: input.id,
          name: input.name,
          description: input.description,
          icon: input.icon,
        },
      )
    }),
  restartProject: t.procedure.mutation(restartProject),
  runAnalyzeBuild: t.procedure.mutation(async (opts) => {
    const context = opts.ctx.context
    await executeCommand(
      {
        command: 'npx',
        args: [`next`, `build`],
        options: {
          env: {
            ANALYZE: 'true',
          },
          cwd: context.dir,
          onExit: () => {
            restartProject()
          },
        },
      },
      {
        id: `devtools:build`,
        name: `next build`,
        icon: 'i-ri-pie-chart-box-line',
      },
    )
  }),
})

export type AppRouter = typeof appRouter
