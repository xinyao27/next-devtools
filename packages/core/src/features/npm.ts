import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

import { detectPackageManager } from 'nypm'

import { restartProject } from './service'
import { executeCommand } from './terminal'

export interface NpmCommandOptions {
  cwd: string
  dev?: boolean
  global?: boolean
}
export type NpmCommandType = 'install' | 'uninstall' | 'update'
export async function getNpmCommand(command: NpmCommandType, packageName: string, options: NpmCommandOptions) {
  const isInstalledGlobally = (await import('is-installed-globally')).default
  const { cwd, dev = true, global = packageName === process.env.PACKAGE_NAME && isInstalledGlobally } = options
  const agent = await detectPackageManager(cwd)

  const name = agent?.name || 'npm'

  if (command === 'install' || command === 'update') {
    return [
      name,
      name === 'npm' ? 'install' : 'add',
      `${packageName}@latest`,
      dev ? '-D' : '',
      global ? '-g' : '',
      // In yarn berry, `--ignore-scripts` is removed
      name === 'yarn' && !agent?.version?.startsWith('1.') ? '' : '--ignore-scripts',
    ].filter(Boolean)
  }

  if (command === 'uninstall') {
    return [name, name === 'npm' ? 'uninstall' : 'remove', packageName, global ? '-g' : ''].filter(Boolean)
  }

  return []
}

export async function runNpmCommand(command: NpmCommandType, packageName: string, options: NpmCommandOptions) {
  const args = await getNpmCommand(command, packageName, options)

  if (!args) return

  const processId = `npm:${command}:${packageName}`

  executeCommand(
    {
      args: args.slice(1),
      command: args[0],
    },
    {
      icon: 'i-ri-npmjs-fill',
      id: processId,
      name: `${command} ${packageName}`,
    },
  )

  return {
    processId,
  }
}

export function setupNpmRpc({ context }: NextDevtoolsServerContext) {
  return {
    runAnalyzeBuild: async () => {
      await executeCommand(
        {
          args: [`next`, `build`],
          command: 'npx',
          options: {
            cwd: context.dir,
            env: {
              ANALYZE: 'true',
            },
            onExit: () => {
              restartProject()
            },
          },
        },
        {
          icon: 'i-ri-pie-chart-box-line',
          id: `devtools:build`,
          name: `next build`,
        },
      )
    },
  } satisfies Partial<ServerFunctions>
}
