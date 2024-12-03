import { detectPackageManager } from 'nypm'
import { executeCommand } from './terminal'
import { restartProject } from './service'
import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

export type NpmCommandType = 'install' | 'uninstall' | 'update'
export interface NpmCommandOptions {
  dev?: boolean
  global?: boolean
  cwd: string
}
export async function getNpmCommand(command: NpmCommandType, packageName: string, options: NpmCommandOptions) {
  const isInstalledGlobally = (await import('is-installed-globally')).default
  const { dev = true, global = packageName === process.env.PACKAGE_NAME && isInstalledGlobally, cwd } = options
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
      command: args[0],
      args: args.slice(1),
    },
    {
      id: processId,
      name: `${command} ${packageName}`,
      icon: 'i-ri-npmjs-fill',
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
    },
  } satisfies Partial<ServerFunctions>
}
