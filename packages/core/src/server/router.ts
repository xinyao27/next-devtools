import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { Editor, settingsSchema } from '@next-devtools/shared/types'
import { getStaticAssetInfo, getStaticAssets } from '../features/assets'
import { getComponents } from '../features/components'
import { getEnvs } from '../features/envs'
import { checkPackageVersion, getPackageInfo, getPackages } from '../features/packages'
import { getRoutes } from '../features/routes'
import { openInEditor } from '../features/editor'
import { getOverviewData } from '../features/overview'
import { executeCommand, getTerminal, getTerminals, onTerminalWrite, runTerminalAction } from '../features/terminal'
import { runNpmCommand } from '../features/npm'
import { restartProject } from '../features/service'
import { settingsStore } from '../store/settings'
import { internalStore } from '../store/internal'
import { networkStore } from '../store/network'
import { onNetworkUpdate } from '../features/network'
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
  ping: t.procedure.query(async () => {
    return 'pong'
  }),
  setSettingsStore: t.procedure.input(z.object({ settings: settingsSchema.partial() })).mutation(async (opts) => {
    const settings = opts.input.settings
    return settingsStore.setState(settings)
  }),
  getSettingsStore: t.procedure.query(async () => {
    return settingsStore.getState()
  }),
  getInternalStore: t.procedure.query(async () => {
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
  openInEditor: t.procedure
    .input(
      z.object({
        path: z.string(),
        line: z.string().optional(),
        column: z.string().optional(),
        editor: z.nativeEnum(Editor).optional(),
      }),
    )
    .mutation(async (opts) => {
      const input = opts.input
      return openInEditor(input)
    }),
  getTerminals: t.procedure.query(async () => {
    return await getTerminals()
  }),
  getTerminal: t.procedure.input(z.string()).query(async (opts) => {
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
    .mutation(async (opts) => {
      const input = opts.input
      return await runTerminalAction(input.id, input.action)
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
  restartProject: t.procedure.mutation(async () => {
    return restartProject()
  }),
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
  getNetworkRequests: t.procedure.query(async () => {
    const requests = networkStore.getState().requests
    return requests
  }),
  onNetworkUpdate: t.procedure.subscription(onNetworkUpdate),
})

export type AppRouter = typeof appRouter
